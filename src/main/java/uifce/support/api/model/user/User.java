package uifce.support.api.model.user;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Table(name = "usuarios")
@Entity(name = "User")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of="id")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nombre")
    @JsonAlias("nombre")
    private String name;
    @Column(name = "email")
    private String email;
    @Column(name = "password")
    private String password;
    @Column(name = "google_id")
    private String googleId;
    @Enumerated(EnumType.STRING)
    @Column(name = "rol")
    @JsonAlias("rol")
    private Role role;
    @Column(name = "activo")
    @JsonAlias("activo")
    private boolean active;
    @Column(name = "fecha_creacion")
    private LocalDateTime creationDate;
    @Column(name = "fecha_actualizacion")
    private LocalDateTime updateDate;

    public User(UserRecordDTO userRecordDTO) {
        this.name = userRecordDTO.name();
        this.email = userRecordDTO.email();
        this.role = userRecordDTO.role();
        if (userRecordDTO.password() != null) {
            this.password = userRecordDTO.password();
        }else{
            this.password = "OAUTH_USER";
        }
        this.active = true;
        this.creationDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String nombreRol = this.role.name();
        String rolSpringSecurity;

        if (nombreRol.equals("Administrador")) {
            rolSpringSecurity = "ADMIN";       // Habilita .hasRole("ADMIN")
        } else if (nombreRol.equals("Tecnico")) {
            rolSpringSecurity = "TECNICO";     // Habilita .hasRole("TECNICO")
        } else {
            rolSpringSecurity = "USUARIO";     // Habilita .hasRole("USUARIO")
        }


        return List.of(new SimpleGrantedAuthority("ROLE_" + rolSpringSecurity));
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return this.active;
    }
}
