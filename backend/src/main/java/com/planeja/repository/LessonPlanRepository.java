package com.planeja.repository;

import com.planeja.model.LessonPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonPlanRepository extends JpaRepository<LessonPlan, UUID> {
    List<LessonPlan> findByUserId(UUID userId);
    Optional<LessonPlan> findByIdAndUserId(UUID id, UUID userId);
}
