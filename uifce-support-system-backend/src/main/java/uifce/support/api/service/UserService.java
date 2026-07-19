package uifce.support.api.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import uifce.support.api.model.user.*;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    UserService(UserRepository userRepository){
        this.userRepository= userRepository;
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
        User user = userRepository.getReferenceById(id);
        return new UserResponseDTO(user);
    }

    public UserResponseDTO createUser(UserRecordDTO userRecordDTO) {
        User user = userRepository.save(new User(userRecordDTO));
        return new UserResponseDTO(user.getId(),user.getName(),user.getEmail(),
                user.getRole().toString());

    }

    public void disableUser(Long id) {
        User user = userRepository.getReferenceById(id);
        user.setActive(false);
    }
}
