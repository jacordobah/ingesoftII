package uifce.support.api.auth.authDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import uifce.support.api.model.user.User;
import uifce.support.api.model.user.UserResponseDTO;

public record LoginResponseDTO(
        @JsonProperty("user")
        UserResponseDTO user,
        @JsonProperty("token")
        String token

) {
}
