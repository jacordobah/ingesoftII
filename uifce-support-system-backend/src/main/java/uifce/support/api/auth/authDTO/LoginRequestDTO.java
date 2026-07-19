package uifce.support.api.auth.authDTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @JsonAlias("googleToken")
        @NotBlank(message = "El tocken es requerido para logueo o registro")
        String googleToken

) {
}
