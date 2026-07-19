package uifce.support.api.model.ticket.assignmentDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AssignmentUpdateTecnicalDTO(
        @JsonAlias("ticketId")
        @NotBlank(message = "Id del ticket es necesario")
        String ticketId,
        @JsonAlias("tecnicoID")
        @NotNull
        Long technicianId
) {}
