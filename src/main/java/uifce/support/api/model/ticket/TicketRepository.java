package uifce.support.api.model.ticket;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface TicketRepository extends JpaRepository<Ticket, String> {
    Page<Ticket> findByUserEmail(String email, Pageable pageable);
}
