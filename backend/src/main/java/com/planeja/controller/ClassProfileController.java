package com.planeja.controller;

import com.planeja.dto.ClassProfileDTO;
import com.planeja.model.ClassProfile;
import com.planeja.model.User;
import com.planeja.service.ClassProfileService;
import com.planeja.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/class-profiles")
public class ClassProfileController {

    @Autowired
    private ClassProfileService classProfileService;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper; // For JSON conversion

    @GetMapping
    public List<ClassProfileDTO> getAllClassProfiles() {
        return classProfileService.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassProfileDTO> getClassProfileById(@PathVariable UUID id) {
        Optional<ClassProfile> classProfile = classProfileService.findById(id);
        return classProfile.map(cp -> ResponseEntity.ok(convertToDto(cp)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClassProfileDTO> createClassProfile(@RequestBody ClassProfileDTO classProfileDTO) {
        try {
            ClassProfile classProfile = convertToEntity(classProfileDTO);
            ClassProfile savedClassProfile = classProfileService.save(classProfile);
            return new ResponseEntity<>(convertToDto(savedClassProfile), HttpStatus.CREATED);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassProfileDTO> updateClassProfile(@PathVariable UUID id, @RequestBody ClassProfileDTO classProfileDTO) {
        Optional<ClassProfile> existingClassProfile = classProfileService.findById(id);
        if (existingClassProfile.isPresent()) {
            try {
                ClassProfile classProfile = existingClassProfile.get();
                // Update fields from DTO
                classProfile.setProfileName(classProfileDTO.getProfileName());
                classProfile.setSize(classProfileDTO.getSize());
                classProfile.setEducationLevels(objectMapper.writeValueAsString(classProfileDTO.getEducationLevels()));
                classProfile.setAgeRanges(objectMapper.writeValueAsString(classProfileDTO.getAgeRanges()));
                classProfile.setLifeContexts(objectMapper.writeValueAsString(classProfileDTO.getLifeContexts()));
                classProfile.setProfessionalAreas(objectMapper.writeValueAsString(classProfileDTO.getProfessionalAreas()));
                classProfile.setOtherProfiles(objectMapper.writeValueAsString(classProfileDTO.getOtherProfiles()));

                ClassProfile updatedClassProfile = classProfileService.save(classProfile);
                return ResponseEntity.ok(convertToDto(updatedClassProfile));
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassProfile(@PathVariable UUID id) {
        if (classProfileService.findById(id).isPresent()) {
            classProfileService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private ClassProfileDTO convertToDto(ClassProfile classProfile) {
        ClassProfileDTO dto = new ClassProfileDTO();
        dto.setId(classProfile.getId());
        dto.setUserId(classProfile.getUser().getId());
        dto.setProfileName(classProfile.getProfileName());
        dto.setSize(classProfile.getSize());
        try {
            dto.setEducationLevels(objectMapper.readValue(classProfile.getEducationLevels(), List.class));
            dto.setAgeRanges(objectMapper.readValue(classProfile.getAgeRanges(), List.class));
            dto.setLifeContexts(objectMapper.readValue(classProfile.getLifeContexts(), List.class));
            dto.setProfessionalAreas(objectMapper.readValue(classProfile.getProfessionalAreas(), List.class));
            dto.setOtherProfiles(objectMapper.readValue(classProfile.getOtherProfiles(), List.class));
        } catch (JsonProcessingException e) {
            // Handle exception, e.g., log it or return empty lists
            dto.setEducationLevels(List.of());
            dto.setAgeRanges(List.of());
            dto.setLifeContexts(List.of());
            dto.setProfessionalAreas(List.of());
            dto.setOtherProfiles(List.of());
        }
        return dto;
    }

    private ClassProfile convertToEntity(ClassProfileDTO dto) throws JsonProcessingException {
        ClassProfile classProfile = new ClassProfile();
        if (dto.getId() != null) {
            classProfile.setId(dto.getId());
        }
        // Assuming userId is provided and valid
        User user = userService.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        classProfile.setUser(user);
        classProfile.setProfileName(dto.getProfileName());
        classProfile.setSize(dto.getSize());
        classProfile.setEducationLevels(objectMapper.writeValueAsString(dto.getEducationLevels()));
        classProfile.setAgeRanges(objectMapper.writeValueAsString(dto.getAgeRanges()));
        classProfile.setLifeContexts(objectMapper.writeValueAsString(dto.getLifeContexts()));
        classProfile.setProfessionalAreas(objectMapper.writeValueAsString(dto.getProfessionalAreas()));
        classProfile.setOtherProfiles(objectMapper.writeValueAsString(dto.getOtherProfiles()));
        return classProfile;
    }
}
