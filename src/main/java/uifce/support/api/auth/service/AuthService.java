package uifce.support.api.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uifce.support.api.auth.authDTO.LoginRequestDTO;
import uifce.support.api.model.user.User;
import uifce.support.api.model.user.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User processLogin(LoginRequestDTO request) {
        String email = request.email().trim().toLowerCase();
        if (!email.endsWith("@unal.edu.co")) {
            throw new IllegalArgumentException("Acceso denegado. Se requiere correo @unal.edu.co");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));
        if (!user.isActive()) {
            throw new IllegalStateException("Usuario inactivo en el sistema");
        }
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }
        return user;
    }
}
