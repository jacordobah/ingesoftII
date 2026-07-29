package uifce.support.api;

import org.junit.jupiter.api.Test;
import uifce.support.api.model.category.Subcategory;
import uifce.support.api.model.location.Office;
import uifce.support.api.model.ticket.Priority;
import uifce.support.api.model.ticket.Ticket;
import uifce.support.api.model.ticket.ticketDTO.TicketRecordDTO;
import uifce.support.api.model.user.User;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TicketScoringTest {

    @Test
    void usesOfficialEquipmentAndResponseTimeMatrices() {
        assertTicket(1, 0, 1, "24 HORAS", Priority.Alta);
        assertTicket(4, 1, 11, "48 HORAS", Priority.Alta);
        assertTicket(15, 1, 21, "72 HORAS", Priority.Alta);
        assertTicket(31, 0, 35, "5 DÍAS", Priority.Media);
        assertTicket(1, 40, 41, "10 DÍAS", Priority.Media);
        assertTicket(1, 50, 51, "15 DÍAS", Priority.Media);
        assertTicket(1, 60, 61, "DURANTE EL SEMESTRE ACADÉMICO", Priority.Baja);
        assertTicket(1, 70, 71, "NO ESTABLECIDO", Priority.Baja);
    }

    private void assertTicket(int equipment, int subcategoryScore, int expectedScore,
                              String expectedResponseTime, Priority expectedPriority) {
        Subcategory subcategory = new Subcategory();
        subcategory.setScore(subcategoryScore);
        Office office = new Office();
        office.setScore(0);

        Ticket ticket = new Ticket(
                new User(),
                subcategory,
                office,
                new TicketRecordDTO(1L, 1L, "Prueba de matriz oficial", equipment)
        );

        assertEquals(expectedScore, ticket.getScore());
        assertEquals(expectedResponseTime, ticket.getResponseTime());
        assertEquals(expectedPriority, ticket.getPriority());
    }
}
