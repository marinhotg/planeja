package com.planeja.controller;

import com.planeja.dto.AuthResponse;
import com.planeja.dto.GoogleLoginRequest;
import com.planeja.dto.RefreshTokenRequest;
import com.planeja.model.User;
import com.planeja.service.JwtService;
import com.planeja.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/google-login")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleLoginRequest request) {
        User user = userService.findOrCreateGoogleUser(request.getEmail(), request.getName(), request.getGoogleId(), request.getImageUrl());
        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshToken = user.getRefreshToken(); // Get the refresh token from the user object
        return ResponseEntity.ok(new AuthResponse(user, accessToken, refreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        String userEmail = jwtService.extractUsername(request.getRefreshToken());
        User user = userService.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (jwtService.isTokenValid(request.getRefreshToken(), user.getEmail()) && user.getRefreshToken().equals(request.getRefreshToken())) {
            String newAccessToken = jwtService.generateToken(user.getEmail());
            String newRefreshToken = jwtService.generateRefreshToken(user.getEmail());
            userService.updateRefreshToken(user.getEmail(), newRefreshToken);
            return ResponseEntity.ok(new AuthResponse(user, newAccessToken, newRefreshToken));
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }
}