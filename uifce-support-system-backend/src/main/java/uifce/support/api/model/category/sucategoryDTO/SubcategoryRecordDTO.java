package uifce.support.api.model.category.sucategoryDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubcategoryRecordDTO (
        @JsonAlias("nombre")
        @NotBlank
        String name,
        @JsonAlias("puntaje")
        @NotNull
        int score
){
}

/*
      {
        "nombre":"subcat-1",
        "puntaje":10
      }
 */