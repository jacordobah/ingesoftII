package uifce.support.api.service;


import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import uifce.support.api.infra.EntityValidator;
import uifce.support.api.model.category.Category;
import uifce.support.api.model.category.CategoryRepository;
import uifce.support.api.model.category.Subcategory;
import uifce.support.api.model.category.SubcategoryRepository;
import uifce.support.api.model.category.categoryDTO.CategoryRecordDTO;
import uifce.support.api.model.category.categoryDTO.CategoryResponseDTO;
import uifce.support.api.model.category.categoryDTO.CategoryResponseDetailDTO;
import uifce.support.api.model.category.categoryDTO.CategoryUpdateDTO;
import uifce.support.api.model.category.sucategoryDTO.SubcategoryRecordDTO;
import uifce.support.api.model.category.sucategoryDTO.SubcategoryResponseDTO;
import uifce.support.api.model.category.sucategoryDTO.SubcategoryResponseDetailDTO;
import uifce.support.api.model.category.sucategoryDTO.SubcategoryUpdateDTO;
import uifce.support.api.model.location.Building;
import uifce.support.api.model.location.Office;
import uifce.support.api.model.location.buildingDTO.BuildingResponseDTO;
import uifce.support.api.model.location.officeDTO.OfficeResponseDTO;
import uifce.support.api.model.location.officeDTO.OfficeResponseDetailDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryAndSubcategoryService {
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final EntityValidator entityValidator;

    @Autowired
    public CategoryAndSubcategoryService(CategoryRepository categoryRepository,
                                         SubcategoryRepository subcategoryRepository, EntityValidator entityValidator){
        this.categoryRepository = categoryRepository;
        this.subcategoryRepository = subcategoryRepository;
        this.entityValidator = entityValidator;
    }

    public CategoryResponseDetailDTO recordCategory(CategoryRecordDTO categoryRecord) {
        Category category = categoryRepository.save(new Category(categoryRecord));
        return new CategoryResponseDetailDTO(category);
    }

    public SubcategoryResponseDetailDTO recordSubcategory(Long id,SubcategoryRecordDTO subcategoryRecord) {
        Category category = entityValidator.findOrThrow(categoryRepository, id, "categoria");
        Subcategory subcategory = subcategoryRepository.save(new Subcategory(category, subcategoryRecord));
        return new SubcategoryResponseDetailDTO(subcategory);
    }

    public List<CategoryResponseDTO> findAllCategories() {
        List<Category> categories = categoryRepository.findByActiveTrue();
        return categories.stream().map(CategoryResponseDTO::new).collect(Collectors.toList());
    }


    public List<SubcategoryResponseDTO> findAllSubcategoriesByCategory(Long id) {
        List<Subcategory> subcats = subcategoryRepository.findByCategory_IdAndActiveTrue(id);
        return subcats.stream().map(SubcategoryResponseDTO::new).toList();
    }

    @Transactional
    public CategoryResponseDTO updateCategory(CategoryUpdateDTO categoryUpdate) {
        Category category = entityValidator.findOrThrow(categoryRepository, categoryUpdate.id(), "categoria");
        category.update(categoryUpdate);
        return new CategoryResponseDTO(category);
    }

    @Transactional
    public SubcategoryResponseDTO updateSubcategory(@Valid SubcategoryUpdateDTO subcatUpdate) {
        Subcategory subcategory = entityValidator.findOrThrow(subcategoryRepository, subcatUpdate.id(), "subcategory");
        subcategory.update(subcatUpdate);
        return new SubcategoryResponseDTO(subcategory);
    }

    public CategoryResponseDetailDTO findCategoryById(Long id) {
        Category category = entityValidator.findOrThrow(categoryRepository, id, "categoria");
        return new CategoryResponseDetailDTO(category);
    }

    public SubcategoryResponseDetailDTO findSubcategoryById(Long id) {
        Subcategory subcategory = entityValidator.findOrThrow(subcategoryRepository, id, "subcategory");
        return new SubcategoryResponseDetailDTO(subcategory);
    }

    @Transactional
    public void disableCategory(Long id) {
        Category category = entityValidator.findOrThrow(categoryRepository, id, "categoria");
        category.setActive(false);
    }

    @Transactional
    public void disableSubcategory(Long id) {
        Subcategory subcategory = entityValidator.findOrThrow(subcategoryRepository, id, "subcategory");
        subcategory.setActive(false);
    }
}
