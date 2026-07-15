package uifce.support.api.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import uifce.support.api.model.ticket.ticketDTO.*;
import uifce.support.api.service.TicketService;

import java.net.URI;


@Controller
@RestController("/api/v1/tickets")
public class TicketController {
    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }


    @PostMapping
    public ResponseEntity<TicketResponseRecordDTO> createTicket(@RequestBody @Valid TicketRecordDTO ticketRecord,
                                                                UriComponentsBuilder uriBuilder) {
        TicketResponseRecordDTO ticketResponse = ticketService.createTicket(ticketRecord);
        URI url = uriBuilder.path("/api/v1/tickets/{id}").buildAndExpand(ticketResponse.id()).toUri();
        return ResponseEntity.created(url).body(ticketResponse);
    }

    @PatchMapping("/cambiar-estado")
    public ResponseEntity<TicketResponseAssignmentDTO> updateTicketStatus(
            @RequestBody @Valid TicketUpdateStatusDTO ticketUpdate) {

        return ResponseEntity.ok(ticketService.updateTicketStatus(ticketUpdate));

    }
    @PatchMapping("/asignar-tecnico")
    public ResponseEntity<TicketResponseAssignmentDTO> updateTicketTechnical(
            @RequestBody @Valid TicketUpdateStatusDTO ticketUpdate) {

        return ResponseEntity.ok(ticketService.updateTicketStatus(ticketUpdate));

    }

    @GetMapping
    public ResponseEntity<Page<TicketResponseAssignmentDTO>> getAllTickets(Pageable pageable) {
        return ResponseEntity.ok(ticketService.getAllTickets(pageable));
    }

}
