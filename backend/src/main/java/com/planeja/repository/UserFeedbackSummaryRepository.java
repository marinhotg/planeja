package com.planeja.repository;

import com.planeja.model.UserFeedbackSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserFeedbackSummaryRepository extends JpaRepository<UserFeedbackSummary, UUID> {

    Optional<UserFeedbackSummary> findByUserId(UUID userId);

    void deleteByUserId(UUID userId);
}