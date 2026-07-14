package uifce.support.api.model.location;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfficeRepository  extends JpaRepository<Office,Long> {
    List<Office> findByBuilding_IdAndActiveTrue(Long id);
}
