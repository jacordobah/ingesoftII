package uifce.support.api.model.category.sucategoryDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import uifce.support.api.model.category.Subcategory;

public record SubcategoryResponseDTO(
        @JsonProperty("id")
        Long id,
        @JsonProperty("categoriaId")
        Long categoryId,
        @JsonProperty("nombre")
        String name,
        @JsonProperty("puntaje")
        Integer score
) {
    public SubcategoryResponseDTO(Subcategory subcategory){
        this(subcategory.getId(), subcategory.getCategory().getId(), subcategory.getName(), subcategory.getScore());
    }
}
