package com.planeja.service;

import com.planeja.model.LessonPlan;
import com.planeja.repository.LessonPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LessonPlanService {

    @Autowired
    private LessonPlanRepository lessonPlanRepository;

    public List<LessonPlan> findAll() {
        return lessonPlanRepository.findAll();
    }

    public Optional<LessonPlan> findById(UUID id) {
        return lessonPlanRepository.findById(id);
    }

    public LessonPlan save(LessonPlan lessonPlan) {
        return lessonPlanRepository.save(lessonPlan);
    }

    public void deleteById(UUID id) {
        lessonPlanRepository.deleteById(id);
    }
}