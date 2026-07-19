package uifce.support.api.auth.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
            // Validar contraseña
            if (!passwordEncoder.matches(loginRequestDTO.password(), user.getPassword())) {
                throw new IllegalArgumentException("Credenciales inválidas");
            }
        } else {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        String tokenJWT = "jwt-simulado-unal-" + user.getId();
        return new LoginResponseDTO(user, tokenJWT);
    }

}
