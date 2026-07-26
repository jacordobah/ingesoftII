package uifce.support.api.auth.controller;


import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import uifce.support.api.auth.authDTO.LoginResponseDTO;
import uifce.support.api.auth.authDTO.LoginRequestDTO;
import uifce.support.api.auth.service.AuthService;

import java.io.IOException;
import java.util.Map;

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
        LoginResponseDTO response = authService.processLogin(loginRequestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/google-success")
    public void googleSuccess(@AuthenticationPrincipal OAuth2User principal, HttpServletResponse response) throws IOException {
        String email = principal.getAttribute("email");

        LoginResponseDTO loginResponseDTO = authService.processGoogleSuccess(email);

        response.sendRedirect("http://localhost:3000/login-success?token=" + loginResponseDTO.token() + "&id=" + loginResponseDTO.user().id()
                + "&role=" + loginResponseDTO.user().role().toLowerCase());
    }
}
