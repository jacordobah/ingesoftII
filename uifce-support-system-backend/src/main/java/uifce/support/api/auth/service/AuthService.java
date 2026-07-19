package uifce.support.api.auth.service;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uifce.support.api.auth.authDTO.LoginRequestDTO;
import uifce.support.api.auth.authDTO.LoginResponseDTO;
import uifce.support.api.model.user.Role;
import uifce.support.api.model.user.User;
import uifce.support.api.model.user.UserRepository;

import java.util.Collections;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public LoginResponseDTO processLogin(LoginRequestDTO loginRequestDTO) {
        try {
            String clientId = System.getenv("SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID");

            // verificador oficial
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(clientId))
                    .build();
            // validar el tocken
            GoogleIdToken idToken = verifier.verify(loginRequestDTO.googleToken());
            if (idToken == null) {
                throw new IllegalArgumentException("El token de autenticación de Google es inválido o ha expirado.");
            }

            // extraer datos del pyload
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String realName = (String) payload.get("name");

            if (email == null || !email.endsWith("@unal.edu.co")) {
                throw new IllegalArgumentException("Acceso denegado. Se requiere un correo institucional @unal.edu.co");
            }
            Optional<User> userOpt = userRepository.findByEmail(email);
            User user;

            if (userOpt.isPresent()) {
                user = userOpt.get();
                if (!user.isActive()) {
                    throw new IllegalStateException("Su cuenta de user se encuentra inactiva. Contacte soporte.");
                }
            } else {
                user = new User();
                user.setEmail(email);
                user.setName(realName != null ? realName : email.split("@")[0]);
                user.setRole(Role.Usuario);
                user.setActive(true);
                userRepository.saveAndFlush(user);
            }

            // respuesta al front
            String tokenJWT = "jwt-simulado-unal-" + user.getId();
            return new LoginResponseDTO(user, tokenJWT);

        } catch (IllegalArgumentException | IllegalStateException e) {
            throw e; // para clase ErrorHanlder
        } catch (Exception e) {
            throw new RuntimeException("Falla crítica en la comunicación con los servicios de Google Auth: " + e.getMessage());
        }
    }
/*
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
*/
}
