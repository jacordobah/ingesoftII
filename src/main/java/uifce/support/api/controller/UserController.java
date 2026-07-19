package uifce.support.api.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import uifce.support.api.model.user.UserRecordDTO;
import uifce.support.api.model.user.UserResponseDTO;
import uifce.support.api.service.UserService;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping
    public ResponseEntity<UserResponseDTO> recordUser(@RequestBody @Valid UserRecordDTO userRecordDTO,
                                                            UriComponentsBuilder uriBuilder) {
        UserResponseDTO userResponseDTO= userService.createUser(userRecordDTO);
        URI url = uriBuilder.path("/api/v1/usuarios/{id}").buildAndExpand(userResponseDTO.id()).toUri();
        return ResponseEntity.created(url).body(userResponseDTO);
    }

    @GetMapping
    public ResponseEntity<Page<UserResponseDTO>> ListUserByAdminOrTechnical(Pageable pag) {
        return ResponseEntity.ok(userService.findAllUserByAdminOrTechnical(pag));
    }

    @GetMapping("/usuarios_registrados")
    public ResponseEntity<Page<UserResponseDTO>> findAllUserByUser(Pageable pag) {
        return ResponseEntity.ok(userService.findAllUserByUser(pag));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserResponseDTO> deleteUserById(@PathVariable Long id) {
        userService.disableUser(id);
        return ResponseEntity.noContent().build();
    }


}
