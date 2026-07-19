package uifce.support.api.model.ticket;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AssignmentsRepositoty extends JpaRepository<Assignments, Long> {

    @Query("SELECT a FROM Assignments a WHERE a.ticket.id = :ticketId ORDER BY a.date DESC")
    List<Assignments> findLatestAssignment(String ticketId, Pageable pageable);
}
