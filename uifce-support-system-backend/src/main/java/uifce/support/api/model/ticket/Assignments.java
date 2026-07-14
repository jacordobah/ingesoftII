package uifce.support.api.model.ticket;


import jakarta.persistence.*;
import lombok.*;
import uifce.support.api.model.user.User;

import java.time.LocalDateTime;

@Table(name = "asignaciones")
@Entity(name = "Assignments")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of="id")
public class Assignments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnico_id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;
    @Column(name = "fecha")
    private LocalDateTime date;

    public  Assignments(User user, Ticket ticket) {
        this.user = user;
        this.ticket = ticket;
        this.date = LocalDateTime.now();
    }
}
