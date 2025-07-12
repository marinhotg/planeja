package com.planeja.dto;

import java.util.List;
import java.util.UUID;

public class ClassProfileDTO {
    private UUID id;
    private UUID userId;
    private String profileName;
    private Integer size;
    private List<String> educationLevels;
    private List<String> ageRanges;
    private List<String> lifeContexts;
    private List<String> professionalAreas;
    private List<String> otherProfiles;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getProfileName() {
        return profileName;
    }

    public void setProfileName(String profileName) {
        this.profileName = profileName;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public List<String> getEducationLevels() {
        return educationLevels;
    }

    public void setEducationLevels(List<String> educationLevels) {
        this.educationLevels = educationLevels;
    }

    public List<String> getAgeRanges() {
        return ageRanges;
    }

    public void setAgeRanges(List<String> ageRanges) {
        this.ageRanges = ageRanges;
    }

    public List<String> getLifeContexts() {
        return lifeContexts;
    }

    public void setLifeContexts(List<String> lifeContexts) {
        this.lifeContexts = lifeContexts;
    }

    public List<String> getProfessionalAreas() {
        return professionalAreas;
    }

    public void setProfessionalAreas(List<String> professionalAreas) {
        this.professionalAreas = professionalAreas;
    }

    public List<String> getOtherProfiles() {
        return otherProfiles;
    }

    public void setOtherProfiles(List<String> otherProfiles) {
        this.otherProfiles = otherProfiles;
    }
}
