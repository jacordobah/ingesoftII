package uifce.support.api.model.auditor;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import uifce.support.api.model.category.Category;
import uifce.support.api.model.category.Subcategory;
import uifce.support.api.model.ticket.Ticket;
import uifce.support.api.model.user.User;

import java.time.LocalDateTime;

@Table(name = "auditoria")
@Entity(name = "Audit")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Audit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Category category;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategoria_id")
    private Subcategory subcategory;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private User user;
    @Column(name = "usuario_rol")
    private String role;
    @Column(name = "accion")
    private String action;
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "detalles", columnDefinition = "json")
    private String details;
    @Column(name = "fecha")
    private LocalDateTime date;

}
