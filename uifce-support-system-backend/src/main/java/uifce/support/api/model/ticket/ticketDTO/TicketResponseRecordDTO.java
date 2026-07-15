package uifce.support.api.model.ticket.ticketDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import uifce.support.api.model.ticket.Ticket;

import java.time.LocalDateTime;

public record  TicketResponseRecordDTO(
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
        @JsonProperty("puntajeTotal") int score,
        @JsonProperty("fechaCreacion") LocalDateTime creationDate
) {
    public TicketResponseRecordDTO(Ticket ticket) {
        this(
                ticket.getId(),
                ticket.getUser() != null ? ticket.getUser().getName() : null,
                ticket.getUser() != null ? ticket.getUser().getEmail() : null,
                ticket.getSubcategory() != null ? ticket.getSubcategory().getCategory().getName(): null,
                ticket.getSubcategory() != null ? ticket.getSubcategory().getName() : null,
                ticket.getOffice() != null ? ticket.getOffice().getName() : null,

                (ticket.getOffice() != null && ticket.getOffice().getBuilding() != null)
                        ? ticket.getOffice().getBuilding().getName() : null,
                ticket.getNumberOfEquipment(),
                ticket.getDescription(),
                ticket.getStatus() != null ? ticket.getStatus().name() : null,
                ticket.getResponseTime(),
                ticket.getPriority() != null ? ticket.getPriority().name() : null,
                ticket.getScore(),
                ticket.getCreationDate()
        );
    }
}
/*
        "id": "TKT-2026-0042",
        "usuarioNombre": "Carlos Mendoza",
        "usuarioCorreo": "carlos.mendoza@facultad.edu",
        "categoriaNombre": "Hardware",
        "subcategoriaNombre": "Hardware",
        "oficinaNombre": "Laboratorio B",
        "edificioNombre": "Edificio de Ciencias"
        "cantidadEquipos": 1,
        "descripcion": "El proyector del laboratorio no enciende",
        "tiempoRespuesta": "24 horas",
        "estado": "OPEN",
        "prioridad": "Media",
        "fechaCreacion": "2026-07-12T05:07:00",
        }
*/