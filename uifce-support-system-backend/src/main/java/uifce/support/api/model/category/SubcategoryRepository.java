package uifce.support.api.model.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uifce.support.api.model.location.Office;

import java.util.List;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory,Long> {
    List<Subcategory> findByCategory_IdAndActiveTrue(Long id);
}
