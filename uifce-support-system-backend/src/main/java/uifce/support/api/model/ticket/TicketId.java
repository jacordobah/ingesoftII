package uifce.support.api.model.ticket;

import org.hibernate.annotations.IdGeneratorType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import static java.lang.annotation.ElementType.FIELD;

@IdGeneratorType(TicketIdGenerator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target({FIELD})
public @interface TicketId {
}
