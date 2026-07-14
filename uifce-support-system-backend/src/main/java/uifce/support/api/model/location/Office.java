package uifce.support.api.model.location;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import lombok.*;
import uifce.support.api.model.location.officeDTO.OfficeRecordDTO;
import uifce.support.api.model.location.officeDTO.OfficeUpdateDTO;

import java.time.LocalDateTime;

@Table(name = "oficinas")
@Entity(name = "Office")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Office {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "edificio_id")
    private Building building;
    @JsonAlias("nombre")
    @Column(name = "nombre")
    private String name;
    @JsonAlias("puntaje")
    @Column(name = "puntaje")
    private int score;
    @Column(name = "activo")
    @JsonAlias("activo")
    private boolean active;
    @Column(name = "fecha_creacion")
    private LocalDateTime creationDate;
    @Column(name = "fecha_actualizacion")
    private LocalDateTime updateDate;

    public Office(Building building, OfficeRecordDTO officeRecord) {
        this.building = building;
        this.name = officeRecord.name();
        this.score = officeRecord.score();
        this.active=true;
        this.creationDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
    }

    public void update(OfficeUpdateDTO officeUpdate) {
        if(officeUpdate.name() != null) {
            this.name = officeUpdate.name();
        }
        if(officeUpdate.score() != this.score) {
            this.score = officeUpdate.score();
        }
        this.updateDate = LocalDateTime.now();
    }

    public void disableOffice() {
        this.setActive(false);
        this.updateDate = LocalDateTime.now();
    }

    public void enableOffice() {
        this.active=true;
        this.updateDate = LocalDateTime.now();
    }
}
