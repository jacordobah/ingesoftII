package uifce.support.api.model.location.officeDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;

public record OfficeUpdateDTO(
        @NotNull
        Long id,
        @JsonAlias("nombre")
        String name,
        @JsonAlias("puntaje")
        Integer score
) {
}
