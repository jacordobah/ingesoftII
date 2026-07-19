package uifce.support.api.model.category.categoryDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import uifce.support.api.model.category.Category;

import java.time.LocalDateTime;

public record CategoryResponseDetailDTO(
        @JsonProperty("id")
        Long id,
        @JsonProperty("nombre")
        String name,
        @JsonProperty("descripcion")
        String description,
        @JsonProperty("activo")
        boolean active,
        @JsonProperty("fechaCreacion")
        LocalDateTime creationDate,
        @JsonProperty("fechaActualizacion")
        LocalDateTime updateDate
) {
        public CategoryResponseDetailDTO(Category category){
            this(category.getId(), category.getName(), category.getDescription(), category.isActive(),
                    category.getCreationDate(), category.getUpdateDate());
        }
}
