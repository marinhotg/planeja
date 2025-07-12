package com.planeja.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "lesson_plans")
public class LessonPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String discipline;

    @Column(nullable = false)
    private String level;

    @Column(nullable = false)
    private String theme;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Column(nullable = false)
    private Integer quantity;

    @Column(columnDefinition = "TEXT")
    private String resources;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_profile_id")
    private ClassProfile classProfile;

    private Integer classSize;

    @Column(columnDefinition = "TEXT")
    private String educationLevels;

    @Column(columnDefinition = "TEXT")
    private String ageRanges;

    @Column(columnDefinition = "TEXT")
    private String lifeContexts;

    @Column(columnDefinition = "TEXT")
    private String professionalAreas;

    @Column(columnDefinition = "TEXT")
    private String otherProfiles;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String generatedContent;

    @Column(nullable = false)
    private LocalDateTime generationTimestamp;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String feedbackText;

    // Constructors
    public LessonPlan() {
        this.generationTimestamp = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public String getResources() {
        return resources;
    }

    public void setResources(String resources) {
        this.resources = resources;
    }

    public ClassProfile getClassProfile() {
        return classProfile;
    }

    public void setClassProfile(ClassProfile classProfile) {
        this.classProfile = classProfile;
    }

    public Integer getClassSize() {
        return classSize;
    }

    public void setClassSize(Integer classSize) {
        this.classSize = classSize;
    }

    public String getEducationLevels() {
        return educationLevels;
    }

    public void setEducationLevels(String educationLevels) {
        this.educationLevels = educationLevels;
    }

    public String getAgeRanges() {
        return ageRanges;
    }

    public void setAgeRanges(String ageRanges) {
        this.ageRanges = ageRanges;
    }

    public String getLifeContexts() {
        return lifeContexts;
    }

    public void setLifeContexts(String lifeContexts) {
        this.lifeContexts = lifeContexts;
    }

    public String getProfessionalAreas() {
        return professionalAreas;
    }

    public void setProfessionalAreas(String professionalAreas) {
        this.professionalAreas = professionalAreas;
    }

    public String getOtherProfiles() {
        return otherProfiles;
    }

    public void setOtherProfiles(String otherProfiles) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getFeedbackText() {
        return feedbackText;
    }

    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}