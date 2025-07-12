package com.planeja.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class LessonPlanDTO {
    private UUID id;
    private UUID userId;
    private String discipline;
    private String level;
    private String theme;
    private Integer durationMinutes;
    private Integer quantity;
    private List<String> resources;
    private UUID classProfileId;
    private Integer classSize;
    private List<String> educationLevels;
    private List<String> ageRanges;
    private List<String> lifeContexts;
    private List<String> professionalAreas;
    private List<String> otherProfiles;
    private String observations;
    private String generatedContent;
    private LocalDateTime generationTimestamp;

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

    public String getDiscipline() {
        return discipline;
    }

    public void setDiscipline(String discipline) {
        this.discipline = discipline;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public List<String> getResources() {
        return resources;
    }

    public void setResources(List<String> resources) {
        this.resources = resources;
    }

    public UUID getClassProfileId() {
        return classProfileId;
    }

    public void setClassProfileId(UUID classProfileId) {
        this.classProfileId = classProfileId;
    }

    public Integer getClassSize() {
        return classSize;
    }

    public void setClassSize(Integer classSize) {
        this.classSize = classSize;
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

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public String getGeneratedContent() {
        return generatedContent;
    }

    public void setGeneratedContent(String generatedContent) {
        this.generatedContent = generatedContent;
    }

    public LocalDateTime getGenerationTimestamp() {
        return generationTimestamp;
    }

    public void setGenerationTimestamp(LocalDateTime generationTimestamp) {
        this.generationTimestamp = generationTimestamp;
    }
}