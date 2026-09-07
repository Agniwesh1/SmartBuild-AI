package com.smartbuildai.service;

import com.smartbuildai.dto.UserRequestDTO;
import com.smartbuildai.dto.UserResponseDTO;
import com.smartbuildai.entity.User;
import com.smartbuildai.exception.UserNotFoundException;
import com.smartbuildai.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO createUser(UserRequestDTO request) {

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // Encrypt password before saving it
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + id));

        return convertToResponse(user);
    }

    public UserResponseDTO updateUser(
            Long id,
            UserRequestDTO request) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + id));

        existingUser.setUsername(request.getUsername());
        existingUser.setEmail(request.getEmail());

        // Encrypt the new password before saving
        existingUser.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        User updatedUser = userRepository.save(existingUser);

        return convertToResponse(updatedUser);
    }

    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + id));

        userRepository.delete(user);
    }

    private UserResponseDTO convertToResponse(User user) {

        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}