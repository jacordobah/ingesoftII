package uifce.support.api.model.auditor;

import java.time.LocalDateTime;

public record AuditResponseDTO(
        Long id,
        String ticketId,
        String accion,
        String usuario,
        String usuarioRol,
        LocalDateTime fecha,
        String detalles
) {
}
