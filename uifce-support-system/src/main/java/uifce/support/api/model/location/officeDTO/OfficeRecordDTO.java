package uifce.support.api.model.location.officeDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OfficeRecordDTO(
        @NotBlank
        @JsonAlias("nombre")
        String name,
        @JsonAlias("puntaje")
        @NotNull
        Integer score) {
}
