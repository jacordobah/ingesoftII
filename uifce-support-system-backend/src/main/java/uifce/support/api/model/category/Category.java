package uifce.support.api.model.category;

import jakarta.persistence.*;
import lombok.*;
import uifce.support.api.model.category.categoryDTO.CategoryRecordDTO;
import uifce.support.api.model.category.categoryDTO.CategoryUpdateDTO;

import java.time.LocalDateTime;

@Table(name = "categorias")
@Entity(name = "Category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of="id")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nombre")
    private String name;
    @Column(name = "descripcion")
    private String description;
    @Column(name = "activo")
    private boolean active;
    @Column(name = "fecha_creacion")
    private LocalDateTime creationDate;
    @Column(name = "fecha_actualizacion")
    private LocalDateTime updateDate;


    public Category(CategoryRecordDTO categoryRecord) {
        this.name = categoryRecord.name();
        this.description = categoryRecord.description();
        this.active = true;
        this.creationDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
    }

    public void update(CategoryUpdateDTO categoryUpdate) {
        if(categoryUpdate.name() != null && !categoryUpdate.name().isEmpty()) {
            this.name = categoryUpdate.name();
        }
        if(categoryUpdate.description() != null && !categoryUpdate.description().isEmpty()) {
            this.description = categoryUpdate.description();
        }
        this.updateDate = LocalDateTime.now();
    }
}
