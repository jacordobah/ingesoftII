package uifce.support.api.infra.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import uifce.support.api.auth.service.CustomOAuth2UserService;
import uifce.support.api.model.user.UserRepository;


import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
@EnableMethodSecurity
public class    SecurityConfig {
    private final UserRepository userRepository;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    public SecurityConfig(UserRepository userRepository, CustomOAuth2UserService customOAuth2UserService) {
        this.userRepository = userRepository;
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/usuarios").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/login").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login")
                        .defaultSuccessUrl("/api/auth/google-success", true)
                        .failureUrl("/login?error=true")
                        .userInfoEndpoint(userInfo ->
                                userInfo.userService(customOAuth2UserService))
                );

        return http.build();
    }

}
