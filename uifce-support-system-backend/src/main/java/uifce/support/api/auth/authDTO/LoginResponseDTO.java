package uifce.support.api.auth.authDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import uifce.support.api.model.user.User;

public record LoginResponseDTO(
        @JsonProperty("usuario")
        String name,
        @JsonProperty("token")
        String token
) {
        public LoginResponseDTO(User user, String token) {
                this(user.getName(), token);
        }
}
