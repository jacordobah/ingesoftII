package uifce.support.api.auth.authDTO;

import uifce.support.api.model.user.UserResponseDTO;

public record LoginResponseDTO(
        UserResponseDTO user
) {}
