package uifce.support.api.model.location.officeDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import uifce.support.api.model.location.Office;

public record OfficeResponseDTO(
        @JsonProperty("id")
        Long id,
        @JsonProperty("nombre")
        String name,
        @JsonProperty("puntaje")
        int score) {


    public OfficeResponseDTO(Office office) {
        this(office.getId(), office.getName(), office.getScore());
    }
}
