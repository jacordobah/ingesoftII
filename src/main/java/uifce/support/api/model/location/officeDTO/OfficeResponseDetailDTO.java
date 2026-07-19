package uifce.support.api.model.location.officeDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import uifce.support.api.model.location.Office;

import java.time.LocalDateTime;

public record OfficeResponseDetailDTO(
        Long id,
        @JsonProperty("edificio_id")
        Long buildingId,
        @JsonProperty("nombre")
        String name,
        @JsonProperty("puntaje")
        int score,
        @JsonProperty("activo")
        boolean active,
        LocalDateTime creationDate,
        LocalDateTime updateDate
) {
    public OfficeResponseDetailDTO(Office office){
        this(office.getId(),office.getBuilding().getId(), office.getName(), office.getScore(),office.isActive(),
                office.getCreationDate(),office.getCreationDate());
    }
}
