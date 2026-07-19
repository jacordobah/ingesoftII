package uifce.support.api.model.ticket.ticketDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record TicketRecordDTO (
        @JsonAlias("usuarioId")
        @NotNull(message = "El ID del usuario es obligatorio")
        Long userId,

        @JsonAlias("subcategoriaId")
        @NotNull(message = "La subcategoría es obligatoria")
        Long subcategoryId,

        @JsonAlias("oficinaId")
        @NotNull(message = "La oficina es obligatoria")
        Long officeId,

        @JsonAlias("descripcion")
        @NotBlank(message = "La descripción no puede estar vacía")
        String description,

        @JsonAlias("cantidadEquipos")
        @Positive(message = "La cantidad de equipos debe ser mayor a cero")
        int numberOfEquipment
){
}
