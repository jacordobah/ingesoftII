package uifce.support.api.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uifce.support.api.model.auditor.AuditResponseDTO;
import uifce.support.api.service.AuditService;

@RestController
@RequestMapping("/api/v1/auditoria")
@PreAuthorize("hasRole('Administrador')")
public class AuditController {
    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public Page<AuditResponseDTO> findAll(Pageable pageable) {
        return auditService.findAll(pageable);
    }

    @GetMapping("/ticket/{ticketId}")
    public Page<AuditResponseDTO> findByTicket(
            @PathVariable String ticketId,
            Pageable pageable) {
        return auditService.findByTicket(ticketId, pageable);
    }
}
