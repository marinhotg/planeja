package com.planeja.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "class_profiles")
public class ClassProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String profileName;

    private Integer size;

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

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public ClassProfile() {
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

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
