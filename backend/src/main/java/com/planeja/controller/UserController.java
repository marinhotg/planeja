package com.planeja.controller;

import com.planeja.dto.AuthResponse;
import com.planeja.dto.GoogleLoginRequest;
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
        String jwt = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(user, jwt));
    }
}