package com.smartbuildai.controller;

import com.smartbuildai.dto.auth.ChangeCredentialsRequestDTO;
import com.smartbuildai.dto.auth.LoginRequestDTO;
import com.smartbuildai.dto.auth.LoginResponseDTO;
import com.smartbuildai.security.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody LoginRequestDTO request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PutMapping("/credentials")
    public ResponseEntity<String> changeCredentials(
            @RequestBody ChangeCredentialsRequestDTO request) {

        authService.changeCredentials(request);

        return ResponseEntity.ok(
                "Credentials updated successfully. Please log in again with your new credentials."
        );
    }
}