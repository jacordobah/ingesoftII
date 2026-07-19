package uifce.support.api.model.ticket;


import jakarta.persistence.*;
import lombok.*;
import uifce.support.api.model.category.Subcategory;
import uifce.support.api.model.location.Office;
import uifce.support.api.model.ticket.ticketDTO.TicketRecordDTO;
import uifce.support.api.model.user.User;

import java.time.LocalDateTime;

@Table(name = "tickets")
@Entity(name = "Ticket")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of="id")
public class Ticket {
    @Id
    @TicketId
    @Column(name = "Id")
    private String id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategoria_id")
    private Subcategory subcategory;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oficina_id")
    private Office office;
    @Column(name = "descripcion")
    private String description;
    @Column(name = "cantidad_equipos")
    private int numberOfEquipment;
    @Column(name = "tiempo_de_respuesta")
    private String responseTime;
    @Enumerated(EnumType.STRING)
    @Column(name = "prioridad")
    private Priority priority;
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Status status;
    @Column(name = "puntaje")
    private int score;
    @Column(name = "fecha_creacion")
    private LocalDateTime creationDate;
    @Column(name = "fecha_resolucion")
    private LocalDateTime resolutionDate;
    @Column(name = "fecha_actualizacion")
    private LocalDateTime updateTime;
    @Column(name = "comentario")
    private String comment;

    public Ticket(User user, Subcategory subcategory, Office office, TicketRecordDTO ticketRecord) {
        this.user = user;
        this.subcategory = subcategory;
        this.office = office;
        this.description = ticketRecord.description();
        this.numberOfEquipment = ticketRecord.numberOfEquipment();
        this.status = Status.Abierto;
        this.creationDate = LocalDateTime.now();
        this.updateTime = LocalDateTime.now();
        this.score = this.calculateScore();
        this.responseTime = this.calculateResponseTime();
        this.comment = "";
    }



    private int calculateScore() {
        return getSubcategory().getScore() + getOffice().getScore() + scoreFromEquipments();
    }

    private int scoreFromEquipments() {
        if (this.numberOfEquipment >= 0 && this.numberOfEquipment <= 3) {
            return 1;
        } else if (this.numberOfEquipment >= 4 && this.numberOfEquipment <= 14) {
            return 10;
        } else if (this.numberOfEquipment >= 15 && this.numberOfEquipment <= 30) {
            return 20;
        }
        return 35;

    }

    private String calculateResponseTime() {
        if (this.score >= 1 && this.score <= 10) {
            this.priority = Priority.Alta;
            return  "24 HORAS";
        } else if (this.score >= 11 && this.score <= 20) {
            this.priority = Priority.Alta;
            return  "48 HORAS";
        } else if (this.score >= 21 && this.score <= 30) {
            this.priority = Priority.Alta;
            return  "72 HORAS";
        } else if (this.score >= 31 && this.score <= 40) {
            this.priority = Priority.Media;
            return "5 DÍAS";
        } else if (this.score >= 41 && this.score <= 50) {
            this.priority = Priority.Media;
            return  "10 DÍAS";
        } else if (this.score >= 51 && this.score <= 60) {
            this.priority = Priority.Media;
            return  "15 DÍAS";
        } else if (this.score >= 61 && this.score <= 70) {
            this.priority = Priority.Baja;
            return  "DURANTE EL SEMESTRE ACADÉMICO";
        } else if (this.score > 70) {
            this.priority = Priority.Baja;
            return  "NO ESTABLECIDO";
        }
        this.priority = Priority.Baja;
        return  "NO ESTABLECIDO";

    }

}
