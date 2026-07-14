package uifce.support.api.infra;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public class EntityValidator {
    public <E, ID> E findOrThrow(JpaRepository<E, ID> repository, ID id, String fieldAlias) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("The field '%s' with value '%s' was not found", fieldAlias, id)
                ));
    }
}
