package uifce.support.api.service;


import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uifce.support.api.model.user.*;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<UserResponseDTO> findAllUserByAdminOrTechnical(Pageable pag){
        List<Role> roles = List.of(Role.Administrador, Role.Tecnico);
        Page<User> userPage = userRepository.findByActiveTrueAndRoleIn(pag, roles);

        return userPage.map(UserResponseDTO::new);
    }

    public Page<UserResponseDTO> findAllUserByUser(Pageable pag){
        List<Role> roles = List.of(Role.Usuario);
        Page<User> userPage = userRepository.findByActiveTrueAndRoleIn(pag, roles);

        return userPage.map(UserResponseDTO::new);
    }


    public UserResponseDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + id));
        return new UserResponseDTO(user);
    }

    public UserResponseDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + email));
        return new UserResponseDTO(user);
    }

    public UserResponseDTO createUser(UserRecordDTO userRecordDTO) {
        User user = new User(userRecordDTO);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        userRepository.save(user);
        return new UserResponseDTO(user.getId(),user.getName(),user.getEmail(),
                user.getRole().toString());

    }

    @Transactional
    public UserResponseDTO updateRole(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + id));
        if (user.getRole() == Role.Administrador
                && role != Role.Administrador
                && userRepository.countByRoleAndActiveTrue(Role.Administrador) <= 1) {
            throw new IllegalArgumentException("El sistema debe conservar al menos un administrador activo");
        }
        user.setRole(role);
        return new UserResponseDTO(user);
    }

    @Transactional
    public void disableUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + id));
        if (user.getRole() == Role.Administrador
                && userRepository.countByRoleAndActiveTrue(Role.Administrador) <= 1) {
            throw new IllegalArgumentException("El sistema debe conservar al menos un administrador activo");
        }
        user.setActive(false);
    }
}
