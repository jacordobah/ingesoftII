package uifce.support.api.model.category.sucategoryDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;

public record SubcategoryUpdateDTO(
        @NotNull
        Long id,
        @JsonAlias("nombre")
        String name,
        @JsonAlias("puntaje")
        Integer score
) {
}
