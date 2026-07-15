package uifce.support.api.model.category.categoryDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import uifce.support.api.model.category.Category;

public record CategoryResponseDTO(
        @JsonProperty("id")
        Long id,
        @JsonProperty("nombre")
        String name,
        @JsonProperty("descripcion")
        String description,
        @JsonProperty("activo")
        boolean active
) {
    public CategoryResponseDTO(Category category){
        this(category.getId(), category.getName(), category.getDescription(), category.isActive());
    }
}
