package uifce.support.api.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import uifce.support.api.model.ticket.assignmentDTO.AssignmentUpdateTecnicalDTO;
import uifce.support.api.model.ticket.ticketDTO.*;
import uifce.support.api.service.TicketService;

import java.net.URI;


@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {
    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }


    @PostMapping
    public ResponseEntity<TicketResponseRecordDTO> createTicket(@RequestBody @Valid TicketRecordDTO ticketRecord,
                                                                UriComponentsBuilder uriBuilder,
                                                                Authentication authentication) {
        TicketResponseRecordDTO ticketResponse = ticketService.createTicket(ticketRecord, emailOf(authentication));
        URI url = uriBuilder.path("/api/v1/tickets/{id}").buildAndExpand(ticketResponse.id()).toUri();
        return ResponseEntity.created(url).body(ticketResponse);
    }

    @PatchMapping("/cambiar-estado")
    @PreAuthorize("hasAnyRole('Administrador', 'Tecnico')")
    public ResponseEntity<TicketResponseAssignmentDTO> updateTicketStatus(
            @RequestBody @Valid TicketUpdateStatusDTO ticketUpdate,
            Authentication authentication) {

        return ResponseEntity.ok(ticketService.updateTicketStatus(ticketUpdate, emailOf(authentication)));

    }
    @PatchMapping("/asignar-tecnico")
    @PreAuthorize("hasRole('Administrador')")
    public ResponseEntity<TicketResponseAssignmentDTO> updateTicketTechnical(
            @RequestBody @Valid AssignmentUpdateTecnicalDTO assignmentUpdate) {

        return ResponseEntity.ok(ticketService.asignarTecnico(assignmentUpdate));

    }

    @GetMapping
    public ResponseEntity<Page<TicketResponseAssignmentDTO>> getAllTickets(
            Pageable pageable,
            Authentication authentication
    ) {
        boolean canViewAll = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_Administrador")
                        || authority.getAuthority().equals("ROLE_Tecnico"));
        return ResponseEntity.ok(ticketService.getTickets(pageable, emailOf(authentication), canViewAll));
    }

    private static String emailOf(Authentication authentication) {
        return authentication.getPrincipal() instanceof OAuth2User oauthUser
                ? oauthUser.getAttribute("email")
                : authentication.getName();
    }
}
