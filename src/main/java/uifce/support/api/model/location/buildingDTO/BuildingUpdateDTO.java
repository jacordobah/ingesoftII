package uifce.support.api.model.location.buildingDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record BuildingUpdateDTO(
        @JsonAlias("id")
        @NotNull
        Long id,
        @JsonAlias("numero")
        @Positive
        int buildingNumber,
        @JsonAlias("nombre")
        String name
) {

}
