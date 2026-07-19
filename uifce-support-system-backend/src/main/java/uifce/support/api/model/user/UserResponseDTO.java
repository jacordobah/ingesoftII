package uifce.support.api.model.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserResponseDTO(
        Long id,
        @JsonProperty("nombre")
        String name,
        String email,
        @JsonProperty("rol")
        String role
) {
    public UserResponseDTO(User user){
       this(user.getId(), user.getName(), user.getEmail(), user.getRole().toString());
    }
}
