package uifce.support.api.model.user;

import com.fasterxml.jackson.annotation.JsonAlias;

public record UserResponseDTO(
        Long id,
        @JsonAlias("nombre")
        String name,
        String email,
        @JsonAlias("rol")
        String role
) {
    public UserResponseDTO(User user){
       this(user.getId(), user.getName(), user.getEmail(), user.getRole().toString());
    }
}
