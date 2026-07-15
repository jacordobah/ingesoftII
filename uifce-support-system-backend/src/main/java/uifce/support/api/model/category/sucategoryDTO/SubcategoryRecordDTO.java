package uifce.support.api.model.category.sucategoryDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public record SubcategoryRecordDTO (
        @JsonAlias("nombre")
        @NotBlank
        String name,
        @JsonAlias("puntaje")
        @NotBlank
        int score
){
}

/*
      {
        "nombre":"subcat-1",
        "puntaje":10
      }
 */