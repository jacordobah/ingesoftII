package uifce.support.api.auth.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uifce.support.api.auth.authDTO.LoginRequestDTO;
import uifce.support.api.auth.authDTO.LoginResponseDTO;
import uifce.support.api.model.user.Role;
import uifce.support.api.model.user.User;
import uifce.support.api.model.user.UserRepository;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponseDTO processLogin(LoginRequestDTO loginRequestDTO) {
        if (!loginRequestDTO.email().endsWith("@unal.edu.co")) {
            throw new IllegalArgumentException("Acceso denegado. Se requiere correo @unal.edu.co");
        }
        Optional<User> userOpt = userRepository.findByEmail(loginRequestDTO.email());
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            if (!user.isActive()) {
                throw new IllegalStateException("Usuario inactivo en el sistema");
            }
        } else {
            user = new User();
            user.setEmail(loginRequestDTO.email());
            user.setName(loginRequestDTO.name() != null ? loginRequestDTO.name() : loginRequestDTO.email().split("@")[0]);
            user.setRole(Role.Usuario); // Rol por defecto del ENUM
            user.setActive(true);

            userRepository.save(user);
        }

        String tokenJWT = "jwt-simulado-unal-" + user.getId();
        return new LoginResponseDTO(user, tokenJWT);
    }

}
