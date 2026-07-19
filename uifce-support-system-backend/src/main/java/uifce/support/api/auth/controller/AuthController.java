package uifce.support.api.auth.controller;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uifce.support.api.auth.authDTO.LoginResponseDTO;
import uifce.support.api.auth.authDTO.LoginRequestDTO;
import uifce.support.api.auth.service.AuthService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO loginRequestDTO) {           // Pasamos los datos del DTO a la capa de servicios
        LoginResponseDTO respuesta = authService.processLogin(loginRequestDTO);
        return ResponseEntity.ok(respuesta);
    }

}
