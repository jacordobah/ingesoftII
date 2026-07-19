package uifce.support.api.model.location.buildingDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import uifce.support.api.model.location.Building;

import java.time.LocalDateTime;

public record BuildingResponseDetailDTO(
        Long id,
        @JsonProperty("numero")
        int buildingNumber,
        @JsonProperty("nombre")
        String name,
        @JsonProperty("activo")
        boolean active,
        @JsonProperty("fechaCreacion")
        LocalDateTime creationDate,
        @JsonProperty("fechaActualizacion")
        LocalDateTime updateTime
) {
    public BuildingResponseDetailDTO(Building building) {
        this(
                building.getId(),
                building.getBuildingNumber(),
                building.getName(),
                building.isActive(),
                building.getCreationDate(),
                building.getUpdateDate()
        );
    }
}
