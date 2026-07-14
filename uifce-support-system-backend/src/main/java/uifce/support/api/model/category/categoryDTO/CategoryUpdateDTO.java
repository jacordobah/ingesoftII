package uifce.support.api.model.category.categoryDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;

public record CategoryUpdateDTO(
        @JsonAlias("id")
        @NotNull
        Long id,
        @JsonAlias("nombre")
        String name,
        @JsonAlias("descripcion")
        String description
) {
}
