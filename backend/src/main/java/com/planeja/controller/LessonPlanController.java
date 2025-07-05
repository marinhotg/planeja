package com.planeja.controller;

import com.planeja.model.LessonPlan;
import com.planeja.model.LessonPlanRequest;
import com.planeja.service.LessonPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lesson-plans")
public class LessonPlanController {

    @Autowired
    private LessonPlanService lessonPlanService;

    @PostMapping("/generate")
    public ResponseEntity<LessonPlan> generateLessonPlan(@RequestBody LessonPlanRequest request) {
        LessonPlan plan = lessonPlanService.generateLessonPlan(request);
        return ResponseEntity.ok(plan);
    }
}
