package uifce.support.api.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import uifce.support.api.model.category.categoryDTO.CategoryRecordDTO;
import uifce.support.api.model.category.categoryDTO.CategoryResponseDTO;
import uifce.support.api.model.category.categoryDTO.CategoryResponseDetailDTO;
import uifce.support.api.model.category.categoryDTO.CategoryUpdateDTO;
import uifce.support.api.model.category.sucategoryDTO.SubcategoryRecordDTO;
import uifce.support.api.model.category.sucategoryDTO.SubcategoryResponseDTO;
import uifce.support.api.model.category.sucategoryDTO.SubcategoryResponseDetailDTO;
import uifce.support.api.model.category.sucategoryDTO.SubcategoryUpdateDTO;
import uifce.support.api.service.CategoryAndSubcategoryService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/categoria")
public class CategoryAndSubcategoryController {
    private final CategoryAndSubcategoryService catAndSubbService;

    @Autowired
    public CategoryAndSubcategoryController(CategoryAndSubcategoryService catAndSubbService) {
        this.catAndSubbService = catAndSubbService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDetailDTO> recordCategory(@RequestBody @Valid CategoryRecordDTO categoryRecord,
                                                                    UriComponentsBuilder uriBuilder) {
        CategoryResponseDetailDTO responseDTO = catAndSubbService.recordCategory(categoryRecord);
        URI url = uriBuilder.path("/api/v1/categoria/{id}").buildAndExpand(responseDTO.id()).toUri();
        return ResponseEntity.created(url).body(responseDTO);
    }

    @PostMapping("/{id}/supcategoria")
    public ResponseEntity<SubcategoryResponseDetailDTO> recordCategory(@PathVariable Long id, @RequestBody @Valid SubcategoryRecordDTO subcategoryRecord,
                                                                    UriComponentsBuilder uriBuilder) {
        SubcategoryResponseDetailDTO responseDTO = catAndSubbService.recordSubcategory(id,subcategoryRecord);
        URI url = uriBuilder.path("/api/v1/categoria/subcategoria/{id}").buildAndExpand(responseDTO.id()).toUri();
        return ResponseEntity.created(url).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> findAllCategories() {
        return ResponseEntity.ok(catAndSubbService.findAllCategories());
    }

    @GetMapping("/{id}/subcategorias")
    public ResponseEntity<List<SubcategoryResponseDTO>> findAllSubcategories(@PathVariable Long id){
        return ResponseEntity.ok(catAndSubbService.findAllSubcategoriesByCategory(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDetailDTO> findCategory(@PathVariable Long id){
        return ResponseEntity.ok(catAndSubbService.findCategoryById(id));
    }

    @GetMapping("/subcategoria/{id}")
    public ResponseEntity<SubcategoryResponseDetailDTO> findSubcategory(@PathVariable Long id){
        return ResponseEntity.ok(catAndSubbService.findSubcategoryById(id));
    }

    @PutMapping
    public ResponseEntity<CategoryResponseDTO> updateCategory(@RequestBody @Valid CategoryUpdateDTO categoryUpdate){
        return ResponseEntity.ok(catAndSubbService.updateCategory(categoryUpdate));
    }

    @PutMapping("/subcategoria")
    public ResponseEntity<SubcategoryResponseDTO> updateSubcategory(@RequestBody @Valid SubcategoryUpdateDTO officeUpdate){
        return ResponseEntity.ok(catAndSubbService.updateSubcategory(officeUpdate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteCategory(@PathVariable Long id){
        catAndSubbService.disableCategory(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/subcategoria/{id}")
    public ResponseEntity deleteSubcategory(@PathVariable Long id){
        catAndSubbService.disableSubcategory(id);
        return ResponseEntity.noContent().build();
    }
}
