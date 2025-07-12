package com.planeja.service;

import com.planeja.model.BNCCContent;
import com.planeja.model.LessonPlan;
import com.planeja.model.LessonPlanRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.ArrayList;

@Service
public class LessonPlanService {

    @Autowired
    private BNCCSearchService bnccService;

    @Autowired
    private PromptBuilder promptBuilder;

    @Autowired
    private GeminiService geminiService;

    public LessonPlan generateLessonPlan(LessonPlanRequest request) {
        List<String> anos = extractAnosFromNivel(request.getNivel());
        String normalizedDisciplina = normalizeStringForPinecone(request.getDisciplina());
        List<BNCCContent> habilidades = bnccService.searchForEJA(
                request.getTema(),
                normalizedDisciplina,
                "ensino_fundamental",
                anos
        );

        String prompt = promptBuilder.buildPrompt(request, habilidades);

        return geminiService.generatePlan(prompt);
    }

    private List<String> extractAnosFromNivel(String nivel) {
        List<String> anos = new ArrayList<>();
        if (nivel == null) {
            return anos;
        }

        if (nivel.contains("Anos Finais")) {
            for (int i = 6; i <= 9; i++) {
                anos.add(String.format("%02dº ano", i));
            }
        } else {
            Pattern pattern = Pattern.compile("(\\d{2})º ano");
            Matcher matcher = pattern.matcher(nivel);
            while (matcher.find()) {
                anos.add(matcher.group());
            }
        }

        return anos;
    }

    private String normalizeStringForPinecone(String text) {
        if (text == null || text.isEmpty()) {
            return "";
        }
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        normalized = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        normalized = normalized.toLowerCase();
        normalized = normalized.replaceAll("\\s+", "_");
        normalized = normalized.replaceAll("[^a-z0-9_]", "");
        return normalized;
    }
}
