package uifce.support.api.model.location;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import lombok.*;
import uifce.support.api.model.location.buildingDTO.BuildingRecordDTO;

import java.time.LocalDateTime;

@Table(name = "edificios")
@Entity(name = "Building")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "numero")
    private int buildingNumber;
    @Column(name = "nombre")
    private String name;
    @Column(name = "activo")
    private boolean active;
    @Column(name = "fecha_creacion")
    private LocalDateTime creationDate;
    @Column(name = "fecha_actualizacion")
    private LocalDateTime updateDate;

    public Building(BuildingRecordDTO buildingRecord) {
        this.buildingNumber = buildingRecord.buildingNumber();
        this.name = buildingRecord.name();
        this.active = true;
        this.creationDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
    }

    public void disableBuilding() {
        this.setActive(false);
        this.setUpdateDate(LocalDateTime.now());
    }
}
