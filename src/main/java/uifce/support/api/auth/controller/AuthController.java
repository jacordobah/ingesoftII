package uifce.support.api.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.web.csrf.CsrfToken;
import uifce.support.api.auth.authDTO.LoginRequestDTO;
import uifce.support.api.auth.authDTO.LoginResponseDTO;
import uifce.support.api.auth.service.AuthService;
import uifce.support.api.model.user.User;
import uifce.support.api.model.user.UserResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(AuthService authService, SecurityContextRepository securityContextRepository) {
        this.authService = authService;
        this.securityContextRepository = securityContextRepository;
    }

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken token) {
        return token;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody @Valid LoginRequestDTO requestBody,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User user = authService.processLogin(requestBody);
        var authentication = UsernamePasswordAuthenticationToken.authenticated(
                user.getEmail(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        securityContextRepository.saveContext(context, request, response);
        return ResponseEntity.ok(new LoginResponseDTO(new UserResponseDTO(user)));
    }
}
