package uifce.support.api.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import uifce.support.api.model.user.Role;
import uifce.support.api.model.user.User;
import uifce.support.api.model.user.UserRepository;

import java.util.Collections;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final String ALLOWED_EMAIL_DOMAIN = "@unal.edu.co";

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String googleId = oauth2User.getAttribute("sub");
        Boolean emailVerified = oauth2User.getAttribute("email_verified");

        // Solo se permite el acceso con correo institucional verificado por Google.
        // La validacion va antes de tocar la base de datos para no crear usuarios
        // "basura" con dominios no autorizados.
        if (email == null || emailVerified == null || !emailVerified
                || !email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN)) {
            throw new OAuth2AuthenticationException(new OAuth2Error(
                    "invalid_domain",
                    "Debe iniciar sesión con un correo institucional " + ALLOWED_EMAIL_DOMAIN,
                    null
            ));
        }

        // Buscar o crear usuario
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(email, name, googleId));
        
        // Actualizar información si es necesario
        if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
            userRepository.save(user);
        }
        
        // Crear OAuth2User con authorities del usuario
        return new DefaultOAuth2User(
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                oauth2User.getAttributes(),
                "sub"
        );
    }
    
    private User createNewUser(String email, String name, String googleId) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setGoogleId(googleId);
        user.setRole(Role.Usuario); // Por defecto rol de usuario
        user.setActive(true);
        user.setPassword("OAUTH_USER"); // Placeholder para usuarios OAuth
        return userRepository.save(user);
    }
}
