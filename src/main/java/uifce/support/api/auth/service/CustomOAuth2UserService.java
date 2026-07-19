package uifce.support.api.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
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

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String googleId = oauth2User.getAttribute("sub");
        
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
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRol().name())),
                oauth2User.getAttributes(),
                "sub"
        );
    }
    
    private User createNewUser(String email, String name, String googleId) {
        User user = new User();
        user.setNombre(name);
        user.setEmail(email);
        user.setGoogleId(googleId);
        user.setRol(Role.Usuario); // Por defecto rol de usuario
        user.setActivo(true);
        user.setPassword("OAUTH_USER"); // Placeholder para usuarios OAuth
        return userRepository.save(user);
    }
}
