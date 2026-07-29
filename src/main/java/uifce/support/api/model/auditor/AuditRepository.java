package uifce.support.api.model.auditor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditRepository extends JpaRepository<Audit, Long> {

    @EntityGraph(attributePaths = {"ticket", "user"})
    Page<Audit> findAllByOrderByDateDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"ticket", "user"})
    Page<Audit> findByTicket_IdOrderByDateDesc(String ticketId, Pageable pageable);
}
