package uifce.support.api.infra;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice   //Prog orientada a Aspectos spring AOP
@Hidden
public class ErrorHandler {


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity handleException409(DataIntegrityViolationException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage().subSequence(29,70));
        //return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String,String>> handleException404(EntityNotFoundException exception) {
        String message = exception.getMessage() != null ? exception.getMessage() : "Resource not found";
        Map<String, String> response = Map.of("error", message);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        //return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity handleException400(MethodArgumentNotValidException exception) {
        var errors = exception.getBindingResult().getFieldErrors().stream().map(DataExcepcionValidation::new).toList();
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException exception) {
        Map<String, String> response = Map.of(
                "error", "Regla de negocio violada",
                "message", exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    private record DataExcepcionValidation(String field, String error){
        DataExcepcionValidation(FieldError ferror){
            this(ferror.getField(),ferror.getDefaultMessage());
        }
    }


}
