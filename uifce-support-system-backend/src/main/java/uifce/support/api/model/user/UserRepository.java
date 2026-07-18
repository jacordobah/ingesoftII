package uifce.support.api.model.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Page<User> findByActiveTrueAndRoleIn(Pageable pageable, List<Role> role);

    Optional<User> findByEmail(String email);
}
