package uifce.support.api.model.location.buildingDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import uifce.support.api.model.location.Building;

public record BuildingResponseDTO(
        Long id,
        @JsonProperty("numero")
        int buildingNumber,
        @JsonProperty("nombre")
        String name
) {
    public BuildingResponseDTO(Building building){
        this(building.getId(), building.getBuildingNumber(),building.getName());
    }
}
