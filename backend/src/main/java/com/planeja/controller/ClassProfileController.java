package com.planeja.controller;

import com.planeja.dto.ClassProfileDTO;
import com.planeja.model.ClassProfile;
import com.planeja.model.User;
import com.planeja.service.ClassProfileService;
import com.planeja.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
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
    public List<ClassProfileDTO> getAllClassProfiles(Authentication authentication) {
        UUID userId = ((com.planeja.model.UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        return classProfileService.findAllByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassProfileDTO> getClassProfileById(@PathVariable UUID id, Authentication authentication) {
        UUID userId = ((com.planeja.model.UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        Optional<ClassProfile> classProfile = classProfileService.findByIdAndUserId(id, userId);
        return classProfile.map(cp -> ResponseEntity.ok(convertToDto(cp)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClassProfileDTO> createClassProfile(@RequestBody ClassProfileDTO classProfileDTO, Authentication authentication) {
        UUID userId = ((com.planeja.model.UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        try {
            ClassProfile classProfile = convertToEntity(classProfileDTO);
            ClassProfile savedClassProfile = classProfileService.createClassProfile(classProfile, userId);
            return new ResponseEntity<>(convertToDto(savedClassProfile), HttpStatus.CREATED);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassProfileDTO> updateClassProfile(@PathVariable UUID id, @RequestBody ClassProfileDTO classProfileDTO, Authentication authentication) {
        UUID userId = ((com.planeja.model.UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        try {
            ClassProfile updatedProfile = convertToEntity(classProfileDTO);
            Optional<ClassProfile> classProfile = classProfileService.updateClassProfile(id, updatedProfile, userId);
            return classProfile.map(cp -> ResponseEntity.ok(convertToDto(cp)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassProfile(@PathVariable UUID id, Authentication authentication) {
        UUID userId = ((com.planeja.model.UserDetailsImpl) authentication.getPrincipal()).getUser().getId();
        classProfileService.deleteByIdAndUserId(id, userId);
        return ResponseEntity.noContent().build();
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