package uifce.support.api.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import uifce.support.api.model.auditor.Audit;
import uifce.support.api.model.auditor.AuditRepository;
import uifce.support.api.model.auditor.AuditResponseDTO;

@Service
public class AuditService {
    private final AuditRepository auditRepository;

    public AuditService(AuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    public Page<AuditResponseDTO> findAll(Pageable pageable) {
        return auditRepository.findAllByOrderByDateDesc(pageable).map(this::toResponse);
    }

    public Page<AuditResponseDTO> findByTicket(String ticketId, Pageable pageable) {
        return auditRepository.findByTicket_IdOrderByDateDesc(ticketId, pageable).map(this::toResponse);
    }

    private AuditResponseDTO toResponse(Audit audit) {
        return new AuditResponseDTO(
                audit.getId(),
                audit.getTicket() == null ? null : audit.getTicket().getId(),
                audit.getAction(),
                audit.getUser().getName(),
                audit.getRole(),
                audit.getDate(),
                audit.getDetails()
        );
    }
}
