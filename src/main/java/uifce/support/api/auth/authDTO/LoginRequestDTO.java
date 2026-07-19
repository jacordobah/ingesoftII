package uifce.support.api.auth.authDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @JsonAlias("email")
        @NotBlank(message = "El email es requerido")
        String email,
        @JsonAlias("password")
        @NotBlank(message = "La contraseña es requerida")
        String password
) {
}
