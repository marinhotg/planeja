package com.planeja.repository;

import com.planeja.model.LessonPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface LessonPlanRepository extends JpaRepository<LessonPlan, UUID> {
}
