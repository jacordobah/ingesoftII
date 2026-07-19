package uifce.support.api.model.location.buildingDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BuildingRecordDTO(
        @JsonAlias("numero") @NotNull int buildingNumber,
        @JsonAlias("nombre") @NotBlank String name) {}
