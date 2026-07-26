package uifce.support.api.auth.service;


import jakarta.transaction.Transactional;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uifce.support.api.auth.authDTO.LoginRequestDTO;
import uifce.support.api.auth.authDTO.LoginResponseDTO;
import uifce.support.api.model.user.Role;
import uifce.support.api.model.user.User;
import uifce.support.api.model.user.UserRepository;
import uifce.support.api.model.user.UserResponseDTO;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    //private final PasswordEncoder passwordEncoder;
    private final org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder passwordEncoder =
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();


    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        //this.passwordEncoder = passwordEncoder;
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
       /*   System.out.println("-> Clave digitada en Insomnia: " + loginRequestDTO.password());
            System.out.println("-> Hash guardado en tu MySQL: " + user.getPassword());
            System.out.println("--> generado por spring: " + passwordEncoder.encode(loginRequestDTO.password()));
            System.out.println("-> ¿Coinciden?: " + passwordEncoder.matches(loginRequestDTO.password(), user.getPassword()));

            // Validar contraseña
        */
            if (!passwordEncoder.matches(loginRequestDTO.password(), user.getPassword())) {
                throw new IllegalArgumentException("Credenciales inválidas");
            }
        } else {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        return assignRole(user);
    }



    @Transactional()
    public LoginResponseDTO processGoogleSuccess(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no registrado en la base de datos"));
        return assignRole(user);
    }

    @NonNull
    private LoginResponseDTO assignRole(User user) {
        UserResponseDTO userResponseDTO;
        if(user.getRole().equals(Role.Administrador)) {
            userResponseDTO = new UserResponseDTO(user, "admin");
        }else{
            userResponseDTO = new UserResponseDTO(user);
        }

        String tokenJWT = "jwt-simulado-unal-" + user.getId();
        return new LoginResponseDTO(userResponseDTO,tokenJWT);
    }
}
