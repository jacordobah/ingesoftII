package uifce.support.api.model.ticket.ticketDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TicketUpdateStatusDTO(
        @JsonAlias("id")
        @NotBlank(message = "El id del ticket es obligatorio")
        String id,
        @JsonAlias("tecnicoId")
        @NotNull(message = "El id del tecnico es obligatorio")
        Long tecnicoId,
        @JsonAlias("estado")
        @NotBlank(message = "El nuevo estado es obligatorio")
        String status,
        @JsonAlias("comentario")
        String comment
) {

}
