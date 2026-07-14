package uifce.support.api.model.ticket;

import org.springframework.data.jpa.repository.JpaRepository;


public interface TicketRepository extends JpaRepository<Ticket, String> {
}
