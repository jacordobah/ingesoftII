package uifce.support.api.infra.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import uifce.support.api.model.user.User;
import uifce.support.api.model.user.UserRepository;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    // Recibimos el repositorio para poder buscar al usuario real en MySQL por su ID
    public JwtAuthenticationFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Capturamos la cabecera HTTP estándar que envía api.ts
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Recorta "Bearer " y queda "jwt-simulado-unal-X"

            if (token.startsWith("jwt-simulado-unal-")) {
                try {
                    // Extraemos el ID numérico del final de la cadena de texto
                    Long userId = Long.parseLong(token.replace("jwt-simulado-unal-", ""));

                    // Buscamos al usuario en la base de datos
                    Optional<User> userOpt = userRepository.findById(userId);

                    if (userOpt.isPresent()) {
                        User user = userOpt.get();

                        // 🌟 Conexión Segura: Registramos la sesión en el hilo de Spring Security.
                        // Se activa automáticamente tu getAuthorities() con ROLE_ADMIN, ROLE_TECNICO, etc.
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } catch (Exception e) {
                    // Si el token viene corrupto, el filtro continúa pacíficamente sin romper el servidor
                    this.logger.error("Error al procesar el token simulado en el Backend", e);
                }
            }
        }

        // 2. Continuar con el siguiente eslabón en la cadena de filtros de Spring
        filterChain.doFilter(request, response);
    }
}
