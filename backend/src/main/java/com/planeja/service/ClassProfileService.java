package com.planeja.service;

import com.planeja.model.ClassProfile;
import com.planeja.model.User;
import com.planeja.repository.ClassProfileRepository;
import com.planeja.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClassProfileService {

    @Autowired
    private ClassProfileRepository classProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ClassProfile> findAllByUserId(UUID userId) {
        return classProfileRepository.findByUserId(userId);
    }

    public Optional<ClassProfile> findByIdAndUserId(UUID id, UUID userId) {
        return classProfileRepository.findByIdAndUserId(id, userId);
    }

    public Optional<ClassProfile> findById(UUID id) {
        return classProfileRepository.findById(id);
    }

    public ClassProfile save(ClassProfile classProfile) {
        if (classProfile.getCreatedAt() == null) {
            classProfile.setCreatedAt(LocalDateTime.now());
        }
        classProfile.setUpdatedAt(LocalDateTime.now());
        return classProfileRepository.save(classProfile);
    }

    public void deleteByIdAndUserId(UUID id, UUID userId) {
        classProfileRepository.findByIdAndUserId(id, userId).ifPresent(classProfileRepository::delete);
    }

    public ClassProfile createClassProfile(ClassProfile classProfile, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        classProfile.setUser(user);
        return save(classProfile);
    }

    public Optional<ClassProfile> updateClassProfile(UUID id, ClassProfile updatedProfile, UUID userId) {
        return classProfileRepository.findByIdAndUserId(id, userId).map(existingProfile -> {
            existingProfile.setProfileName(updatedProfile.getProfileName());
            existingProfile.setSize(updatedProfile.getSize());
            existingProfile.setEducationLevels(updatedProfile.getEducationLevels());
            existingProfile.setAgeRanges(updatedProfile.getAgeRanges());
            existingProfile.setLifeContexts(updatedProfile.getLifeContexts());
            existingProfile.setProfessionalAreas(updatedProfile.getProfessionalAreas());
            existingProfile.setOtherProfiles(updatedProfile.getOtherProfiles());
            return save(existingProfile);
        });
    }
}
