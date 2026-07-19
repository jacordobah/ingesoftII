package uifce.support.api.model.user;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "usuarios")
@Entity(name = "User")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of="id")
public class User {
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
        this.active = true;
        this.creationDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
    }
}
