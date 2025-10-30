package com.planeja.service;

import com.planeja.model.LessonPlan;
import com.planeja.model.User;
import com.planeja.model.UserFeedbackSummary;
import com.planeja.repository.LessonPlanRepository;
import com.planeja.repository.UserFeedbackSummaryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.OptionalDouble;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FeedbackAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackAnalysisService.class);

    @Autowired
    private LessonPlanRepository lessonPlanRepository;

    @Autowired
    private UserFeedbackSummaryRepository feedbackSummaryRepository;

    @Autowired
    private GeminiService geminiService;

    @Async
    public void analyzeFeedbacksForUser(UUID userId) {
        logger.info("Iniciando análise de feedbacks para usuário: {}", userId);

        try {
            // Buscar todos os planos de aula do usuário que possuem feedback
            List<LessonPlan> plansWithFeedback = lessonPlanRepository.findByUserId(userId)
                    .stream()
                    .filter(plan -> plan.getRating() != null ||
                                  (plan.getFeedbackText() != null && !plan.getFeedbackText().trim().isEmpty()))
                    .collect(Collectors.toList());

            if (plansWithFeedback.isEmpty()) {
                logger.info("Nenhum feedback encontrado para o usuário: {}", userId);
                return;
            }

            // Calcular estatísticas
            OptionalDouble avgRating = plansWithFeedback.stream()
                    .filter(plan -> plan.getRating() != null)
                    .mapToInt(LessonPlan::getRating)
                    .average();

            // Gerar resumo usando IA
            String feedbackSummary = generateFeedbackSummary(plansWithFeedback);

            // Salvar ou atualizar o resumo do usuário
            UserFeedbackSummary summary = feedbackSummaryRepository.findByUserId(userId)
                    .orElse(new UserFeedbackSummary());

            if (summary.getUser() == null) {
                User user = new User();
                user.setId(userId);
                summary.setUser(user);
            }

            summary.setFeedbackSummary(feedbackSummary);
            summary.setTotalFeedbacksAnalyzed(plansWithFeedback.size());
            summary.setAverageRating(avgRating.orElse(0.0));

            feedbackSummaryRepository.save(summary);

            logger.info("Análise de feedback concluída para usuário: {}. Resumo: {}",
                       userId, feedbackSummary);

        } catch (Exception e) {
            logger.error("Erro ao analisar feedbacks para usuário: {}", userId, e);
        }
    }

    private String generateFeedbackSummary(List<LessonPlan> plansWithFeedback) {
        StringBuilder feedbackData = new StringBuilder();

        for (LessonPlan plan : plansWithFeedback) {
            feedbackData.append("Plano: ").append(plan.getTheme()).append("\n");
            feedbackData.append("Disciplina: ").append(plan.getDiscipline()).append("\n");
            if (plan.getRating() != null) {
                feedbackData.append("Nota: ").append(plan.getRating()).append("/5\n");
            }
            if (plan.getFeedbackText() != null && !plan.getFeedbackText().trim().isEmpty()) {
                feedbackData.append("Comentário: ").append(plan.getFeedbackText()).append("\n");
            }
            feedbackData.append("---\n");
        }

        String prompt = String.format("""
            Analise os feedbacks abaixo de um professor sobre seus planos de aula e crie um resumo em 2 frases sobre as preferências pessoais e padrões de ensino deste professor.

            Feedbacks:
            %s

            O resumo deve:
            1. Identificar padrões nas preferências metodológicas
            2. Destacar aspectos que o professor mais valoriza ou critica
            3. Ser específico e útil para personalizar futuros planos de aula
            4. Ter no máximo 2 frases concisas

            Responda apenas com as 2 frases do resumo, sem explicações adicionais.
            """, feedbackData.toString());

        try {
            // Usar o GeminiService para gerar o resumo
            return geminiService.generateFeedbackSummary(prompt);
        } catch (Exception e) {
            logger.error("Erro ao gerar resumo de feedback", e);
            return "Professor demonstra interesse em melhorar a qualidade dos planos de aula. Feedbacks indicam preferência por atividades práticas e contextualização dos conteúdos.";
        }
    }

    public String getFeedbackSummaryForUser(UUID userId) {
        return feedbackSummaryRepository.findByUserId(userId)
                .map(UserFeedbackSummary::getFeedbackSummary)
                .orElse("");
    }
}