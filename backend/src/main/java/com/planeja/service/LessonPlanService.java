package com.planeja.service;

import com.planeja.model.BNCCContent;
import com.planeja.model.LessonPlan;
import com.planeja.model.LessonPlanRequest;
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

    @Autowired
    private BNCCSearchService bnccService;

    @Autowired
    private PromptBuilder promptBuilder;

    @Autowired
    private GeminiService geminiService;

    public List<LessonPlan> findAllByUserId(UUID userId) {
        return lessonPlanRepository.findByUserId(userId);
    }

    public Optional<LessonPlan> findByIdAndUserId(UUID id, UUID userId) {
        return lessonPlanRepository.findByIdAndUserId(id, userId);
    }

    public LessonPlan save(LessonPlan lessonPlan) {
        return lessonPlanRepository.save(lessonPlan);
    }

    public void deleteById(UUID id) {
        lessonPlanRepository.deleteById(id);
    }

    public LessonPlan generateLessonPlan(LessonPlanRequest request) {
        List<BNCCContent> habilidades = bnccService.searchForEJA(
                request.getTema(),
                request.getDisciplina(),
                "ensino_fundamental",
                List.of() // Adicionado o quarto argumento como uma lista vazia
        );

        String prompt = promptBuilder.buildPrompt(request, habilidades);

        return geminiService.generatePlan(prompt);
    }
}