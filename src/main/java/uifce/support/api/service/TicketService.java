package uifce.support.api.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import uifce.support.api.infra.EntityValidator;
import uifce.support.api.model.category.Subcategory;
import uifce.support.api.model.category.SubcategoryRepository;
import uifce.support.api.model.location.Office;
import uifce.support.api.model.location.OfficeRepository;
import uifce.support.api.model.ticket.*;
import uifce.support.api.model.ticket.assignmentDTO.AssignmentUpdateTecnicalDTO;
import uifce.support.api.model.ticket.ticketDTO.*;
import uifce.support.api.model.user.Role;
import uifce.support.api.model.user.User;
import uifce.support.api.model.user.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final OfficeRepository officeRepository;
    private final UserRepository userRepository;
    private final AssignmentsRepositoty assignmentsRepositoty;
    private final SubcategoryRepository subcategoryRepository;
    private final EntityValidator  entityValidator;

    @Autowired
    public TicketService(TicketRepository ticketRepository,
                         OfficeRepository officeRepository, UserRepository userRepository,
                         AssignmentsRepositoty assignmentsRepositoty,
                         SubcategoryRepository subcategoryRepository,EntityValidator  entityValidator) {
        this.ticketRepository = ticketRepository;
        this.officeRepository = officeRepository;
        this.userRepository = userRepository;
        this.assignmentsRepositoty = assignmentsRepositoty;
        this.subcategoryRepository = subcategoryRepository;
        this.entityValidator = entityValidator;
    }

    @Transactional
    public TicketResponseRecordDTO createTicket(TicketRecordDTO ticketRecord) {
        User user = entityValidator.findOrThrow(userRepository, ticketRecord.userId(), "usuarId");
        Subcategory subcategory = entityValidator.findOrThrow(subcategoryRepository, ticketRecord.subcategoryId(),
                "subcategoriaId");
        Office office = entityValidator.findOrThrow(officeRepository, ticketRecord.officeId(), "oficinaId");
        Ticket ticket = new Ticket(user, subcategory, office, ticketRecord);
        return new TicketResponseRecordDTO(ticketRepository.save(ticket));

    }

    @Transactional
    public TicketResponseAssignmentDTO updateTicketStatus(TicketUpdateStatusDTO ticketUpdate) {
        Ticket ticket = entityValidator.findOrThrow(ticketRepository, ticketUpdate.id(), "ticketId");
        User user = entityValidator.findOrThrow(userRepository, ticketUpdate.tecnicoId(),  "userId");

        Status nextStatus = Status.valueOf(ticketUpdate.status());
        Status currentStatus = ticket.getStatus();


        if (currentStatus == Status.Cerrado && !user.getRole().equals(Role.Administrador)) {
            throw new IllegalArgumentException("Solo el Administrador puede reabrir un ticket cerrado.");
        }

        if (!user.getRole().equals(Role.Administrador)) {
            if (currentStatus == Status.Abierto && nextStatus == Status.Cerrado) {
                throw new IllegalArgumentException("No se puede cerrar un ticket que no ha sido puesto En Proceso.");
            }
            if (currentStatus == Status.En_proceso && nextStatus == Status.Abierto) {
                throw new IllegalArgumentException("Acción inválida: Un técnico no puede regresar un ticket a estado Abierto.");
            }
        }



        if (nextStatus == Status.Cerrado) {
            if (ticketUpdate.comment() == null || ticketUpdate.comment().trim().isEmpty()) {
                throw new IllegalArgumentException("Es obligatorio dejar un comentario final al cerrar el ticket.");
            }
            ticket.setComment(ticketUpdate.comment());
            ticket.setResolutionDate(LocalDateTime.now());
        }

        ticket.setStatus(nextStatus);
        if(nextStatus == Status.En_proceso) {
            var assignment = assignmentsRepositoty.findById(user.getId());
            if(assignment.isPresent()){
                return asignarTecnico(new AssignmentUpdateTecnicalDTO(ticket.getId(),user.getId()));
            }
        }
        var assigmentAux = new Assignments();
        return new TicketResponseAssignmentDTO((ticketRepository.save(ticketRepository.save(ticket))),assigmentAux);
    }

    @Transactional
    public TicketResponseAssignmentDTO asignarTecnico(AssignmentUpdateTecnicalDTO assignmentUpdateTecnicalDTO) {
        Ticket ticket = entityValidator.findOrThrow(ticketRepository, assignmentUpdateTecnicalDTO.ticketId(),
                "ticketId");
        User user = entityValidator.findOrThrow(userRepository, assignmentUpdateTecnicalDTO.technicianId(),
                "tecnicoId");
        Assignments assignment = new Assignments(user,ticket);
        ticket.setUpdateTime(LocalDateTime.now());
        assignmentsRepositoty.save(assignment);
        return new TicketResponseAssignmentDTO(ticket,  assignment);
    }

   // @Transactional
    public Page<TicketResponseAssignmentDTO> getAllTickets(Pageable pageable) {
        Page<Ticket> ticketPage = ticketRepository.findAll(pageable);
        return ticketPage.map(ticket -> {
            List<Assignments> latest = assignmentsRepositoty.findLatestAssignment(ticket.getId(), PageRequest.of(0, 1));
            String technicianName = latest.isEmpty() ? "undefined" : latest.getFirst().getUser().getName();
            return new TicketResponseAssignmentDTO(ticket, technicianName);
        });

    }
}
