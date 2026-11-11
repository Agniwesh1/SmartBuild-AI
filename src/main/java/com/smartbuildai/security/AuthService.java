package com.smartbuildai.security;

import com.smartbuildai.dto.auth.ChangeCredentialsRequestDTO;
import com.smartbuildai.dto.auth.LoginRequestDTO;
import com.smartbuildai.dto.auth.LoginResponseDTO;
import com.smartbuildai.entity.User;
import com.smartbuildai.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        String token = jwtService.generateToken(request.getUsername());

        return new LoginResponseDTO(
                token,
                request.getUsername()
        );
    }

    public void changeCredentials(
            ChangeCredentialsRequestDTO request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in again."
            );
        }

        String currentUsername = authentication.getName();

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User account not found."
                ));

        if (request.getCurrentPassword() == null
                || request.getCurrentPassword().isBlank()
                || !passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Current password is incorrect."
            );
        }

        String newUsername = request.getNewUsername();

        if (newUsername != null && !newUsername.isBlank()) {
            newUsername = newUsername.trim();

            if (!newUsername.equals(user.getUsername())
                    && userRepository.existsByUsername(newUsername)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "That username is already in use."
                );
            }

            user.setUsername(newUsername);
        }

        String newPassword = request.getNewPassword();

        if (newPassword != null && !newPassword.isBlank()) {
            if (newPassword.length() < 8) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "New password must be at least 8 characters long."
                );
            }

            user.setPassword(passwordEncoder.encode(newPassword));
        }

        if ((newUsername == null || newUsername.isBlank())
                && (newPassword == null || newPassword.isBlank())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter a new username, a new password, or both."
            );
        }

        userRepository.save(user);
    }
}