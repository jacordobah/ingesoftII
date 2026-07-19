package uifce.support.api.infra.aspect;


import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import uifce.support.api.model.user.User;
import uifce.support.api.model.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Optional;

@Aspect
@Component
public class AuditContextAspect {

    private final JdbcTemplate jdbcTemplate;
    private final UserRepository userRepository;

    @Autowired
    public AuditContextAspect(JdbcTemplate jdbcTemplate, UserRepository userRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.userRepository = userRepository;
    }

    @Before("execution(* uifce.support.api.model..*.save*(..)) || execution(* uifce.support.api.model..*.delete*(..))")
    public void setAuditContext() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.getPrincipal() instanceof OAuth2User) {
                OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                String email = oAuth2User.getAttribute("email");

                if (email != null) {
                    Optional<User> userOpt = userRepository.findByEmail(email);
                    if (userOpt.isPresent()) {
                        User usuario = userOpt.get();

                        jdbcTemplate.execute("SET @usuario_id_auditoria = " + usuario.getId());
                        jdbcTemplate.execute("SET @usuario_rol_auditoria = '" + usuario.getRole().name() + "'");
                    }
                }
            }
        } catch (Exception e) {
            // Evita que falle la aplicación si la persistencia ocurre fuera de una petición web
            System.err.println("No se pudo establecer el contexto de auditoría AOP: " + e.getMessage());
        }
    }

}
