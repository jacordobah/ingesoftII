package uifce.support.api;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

class AdminPasswordHashTest {

    @Test
    void adminPasswordMatchesMigrationHash() {
        String migrationHash = "$2a$10$yzAJ0Z1U.lIcTJmzIm4PAOsbnTRLqPLw2iI7B8nn/4C3Q8LiqEpK2";

        assertTrue(new BCryptPasswordEncoder().matches("Admin123!", migrationHash));
    }
}
