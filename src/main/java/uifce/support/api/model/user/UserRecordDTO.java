package uifce.support.api.model.user;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.*;

public record UserRecordDTO(
        @NotBlank
        @JsonAlias("nombre")
        String name,
        @NotBlank
        @Email
        String email,
        @NotNull
        @JsonAlias("rol")
        Role role) {
}
