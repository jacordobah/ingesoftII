package uifce.support.api.model.location.buildingDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;

public record BuildingUpdateDTO(
        @JsonAlias("id")
        @NotNull
        Long id,
        @JsonAlias("numero")
        int buildingNumber,
        @JsonAlias("nombre")
        String name
) {

}
