package com.planeja.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_feedback_summaries")
public class UserFeedbackSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String feedbackSummary;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @Column(nullable = false)
    private Integer totalFeedbacksAnalyzed = 0;

    @Column(nullable = false)
    private Double averageRating = 0.0;

    public UserFeedbackSummary() {
        this.lastUpdated = LocalDateTime.now();
    }

    public UserFeedbackSummary(User user, String feedbackSummary) {
        this();
        this.user = user;
        this.feedbackSummary = feedbackSummary;
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

    public String getFeedbackSummary() {
        return feedbackSummary;
    }

    public void setFeedbackSummary(String feedbackSummary) {
        this.feedbackSummary = feedbackSummary;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public Integer getTotalFeedbacksAnalyzed() {
        return totalFeedbacksAnalyzed;
    }

    public void setTotalFeedbacksAnalyzed(Integer totalFeedbacksAnalyzed) {
        this.totalFeedbacksAnalyzed = totalFeedbacksAnalyzed;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}