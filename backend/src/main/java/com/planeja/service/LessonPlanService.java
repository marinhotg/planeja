package com.planeja.service;

import com.planeja.model.BNCCContent;
import com.planeja.model.LessonPlan;
import com.planeja.model.LessonPlanRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonPlanService {

    @Autowired
    private BNCCSearchService bnccService;

    @Autowired
    private PromptBuilder promptBuilder;

    @Autowired
    private GeminiService geminiService;

    public LessonPlan generateLessonPlan(LessonPlanRequest request) {
        List<BNCCContent> habilidades = bnccService.searchForEJA(
                request.getTema(),
                request.getDisciplina(),
                "ensino_fundamental"
        );

        String prompt = promptBuilder.buildPrompt(request, habilidades);

        return geminiService.generatePlan(prompt);
    }
}
