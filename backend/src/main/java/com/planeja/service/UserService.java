package com.planeja.service;

import com.planeja.model.User;
import com.planeja.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    public void deleteById(UUID id) {
        userRepository.deleteById(id);
    }

    public User findOrCreateGoogleUser(String email, String name, String googleId, String imageUrl) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User(name, email, googleId, imageUrl, null);
            String refreshToken = jwtService.generateRefreshToken(email);
            user.setRefreshToken(refreshToken);
            userRepository.save(user);
        } else if (user.getGoogleId() == null) {
            user.setGoogleId(googleId);
            user.setImageUrl(imageUrl);
            String refreshToken = jwtService.generateRefreshToken(email);
            user.setRefreshToken(refreshToken);
            userRepository.save(user);
        }
        return user;
    }

    public User updateRefreshToken(String email, String newRefreshToken) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRefreshToken(newRefreshToken);
        return userRepository.save(user);
    }
}
