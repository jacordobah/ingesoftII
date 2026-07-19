package uifce.support.api.model.category;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.*;
import uifce.support.api.model.category.sucategoryDTO.SubcategoryRecordDTO;
import uifce.support.api.model.category.sucategoryDTO.SubcategoryUpdateDTO;

import java.time.LocalDateTime;

@Table(name = "subcategorias")
@Entity(name = "Subcategory")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of="id")
public class Subcategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "categoria_id")
    private Category category;
    @Column(name = "nombre")
    private String name;
    @Column(name = "puntaje")
    private int score;
    @Column(name = "activo")
    private boolean active;
    @Column(name = "fecha_creacion")
    private LocalDateTime creationDate;
    @Column(name = "fecha_actualizacion")
    private LocalDateTime updateDate;


    public Subcategory(Category category, SubcategoryRecordDTO subcategoryRecord) {
        this.category = category;
        this.name= subcategoryRecord.name();
        this.score = subcategoryRecord.score();
        this.active= true;
        this.creationDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
    }

    public void update(@Valid SubcategoryUpdateDTO subcatUpdate) {
        if(subcatUpdate.name() != null && !subcatUpdate.name().isEmpty())
        {
            this.name = subcatUpdate.name();
        }
        if(subcatUpdate.score() != null && subcatUpdate.score()>0){
            this.score = subcatUpdate.score();
        }
        this.updateDate = LocalDateTime.now();
    }
}
