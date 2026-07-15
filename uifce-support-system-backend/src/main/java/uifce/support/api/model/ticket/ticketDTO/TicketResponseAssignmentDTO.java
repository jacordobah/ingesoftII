package uifce.support.api.model.ticket.ticketDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import uifce.support.api.model.ticket.Assignments;
import uifce.support.api.model.ticket.Ticket;

import java.time.LocalDateTime;

public record TicketResponseAssignmentDTO(
        @JsonProperty("id") String id,
        @JsonProperty("usuarioNombre") String userName,
        @JsonProperty("usuarioCorreo") String userEmail,
        @JsonProperty("categoria") String Category,
        @JsonProperty("subcategoriaNombre") String subcategoryName,
        @JsonProperty("oficinaNombre") String officeName,
        @JsonProperty("edificioNombre") String buildingName,
        @JsonProperty("cantidadEquipos") int numberOfEquipment,
        @JsonProperty("descripcion") String description,
        @JsonProperty("estado") String status,
        @JsonProperty("tiempoRespuesta") String responseTime,
        @JsonProperty("prioridad") String priority,
        @JsonProperty("fechaCreacion") LocalDateTime creationDate,
        @JsonProperty("fechaActualizacion") LocalDateTime updateDate,
        @JsonProperty("tecnicoAsignado") String technician,
        @JsonProperty("comentario") String comment
) {
    public TicketResponseAssignmentDTO(Ticket ticket, Assignments assignments) {
        this(
                ticket.getId(),
                ticket.getUser() != null ? ticket.getUser().getName() : null,
                ticket.getUser() != null ? ticket.getUser().getEmail() : null,
                ticket.getSubcategory() != null ? ticket.getSubcategory().getCategory().getName() : null,
                ticket.getSubcategory() != null ? ticket.getSubcategory().getName() : null,
                ticket.getOffice() != null ? ticket.getOffice().getName() : null,
                (ticket.getOffice() != null && ticket.getOffice().getBuilding() != null)
                        ? ticket.getOffice().getBuilding().getName() : null,
                ticket.getNumberOfEquipment(),
                ticket.getDescription(),
                ticket.getStatus() != null ? ticket.getStatus().name() : null,
                ticket.getResponseTime(),
                ticket.getPriority() != null ? ticket.getPriority().name() : "",
                ticket.getCreationDate(),
                ticket.getUpdateTime(),
                assignments.getUser() != null ? assignments.getUser().getName() : "undefined",
                ticket.getComment()
        );
    }

    public TicketResponseAssignmentDTO(Ticket ticket, String technicianName) {
        this(
                ticket.getId(),
                ticket.getUser() != null ? ticket.getUser().getName() : null,
                ticket.getUser() != null ? ticket.getUser().getEmail() : null,
                (ticket.getSubcategory() != null && ticket.getSubcategory().getCategory() != null)
                        ? ticket.getSubcategory().getCategory().getName() : null,
                ticket.getSubcategory() != null ? ticket.getSubcategory().getName() : null,
                ticket.getOffice() != null ? ticket.getOffice().getName() : null,
                (ticket.getOffice() != null && ticket.getOffice().getBuilding() != null)
                        ? ticket.getOffice().getBuilding().getName() : null,
                ticket.getNumberOfEquipment(),
                ticket.getDescription(),
                ticket.getStatus() != null ? ticket.getStatus().name() : null,
                ticket.getResponseTime(),
                ticket.getPriority() != null ? ticket.getPriority().name() : "",
                ticket.getCreationDate(),
                ticket.getUpdateTime(),
                technicianName, // Asigna directamente el String procesado
                ticket.getComment()
        );
    }
}
