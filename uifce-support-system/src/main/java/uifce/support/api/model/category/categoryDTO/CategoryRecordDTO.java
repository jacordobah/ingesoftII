package uifce.support.api.model.category.categoryDTO;


import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public record CategoryRecordDTO(
        @JsonAlias("nombre")
        @NotBlank
        String name,
        @JsonAlias("descripcion")
        @NotBlank
        String description
) {}
