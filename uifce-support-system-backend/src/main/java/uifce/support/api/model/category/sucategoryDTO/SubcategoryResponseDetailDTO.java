package uifce.support.api.model.category.sucategoryDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import uifce.support.api.model.category.Category;
import uifce.support.api.model.category.Subcategory;

import java.time.LocalDateTime;

public record SubcategoryResponseDetailDTO(
        @JsonProperty("id")
        Long id,
        @JsonProperty("categoriaId")
        Long categoryId,
        @JsonProperty("nombre")
        String name,
        @JsonProperty("puntaje")
        int score,
        @JsonProperty("fechaCreacion")
        LocalDateTime creationDate,
        @JsonProperty("fechaActualizacion")
        LocalDateTime updateDate
) {
    public SubcategoryResponseDetailDTO(Subcategory subcategory){
        this(subcategory.getId(), subcategory.getCategory().getId(), subcategory.getName(), subcategory.getScore(),
                subcategory.getCreationDate(), subcategory.getUpdateDate());
    }

}
