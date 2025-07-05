package com.planeja.service;

import com.planeja.model.BNCCContent;
import com.planeja.model.LessonPlanRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromptBuilder {

    public String buildPrompt(LessonPlanRequest request, List<BNCCContent> habilidades) {
        return """
            Crie um plano de aula contextualizado para EJA baseado EXCLUSIVAMENTE nas habilidades da BNCC fornecidas.

            DADOS DA AULA:
            - Disciplina: %s
            - Tema: %s
            - Perfil da turma: %s
            - Duração: %s
            - Recursos disponíveis: %s
            - Observações: %s

            HABILIDADES DA BNCC RELEVANTES:
            %s

            INSTRUÇÕES:
            1. Use APENAS as habilidades fornecidas acima
            2. Adapte para o perfil EJA (jovens e adultos)
            3. Contextualize com situações do cotidiano e trabalho
            4. Seja prático e objetivo
            5. Considere o tempo de estudo limitado dos alunos

            FORMATO DE RESPOSTA (JSON):
            {
              "titulo": "Nome atrativo do plano",
              "objetivos": ["Código da habilidade: descrição adaptada"],
              "metodologia": "Abordagem pedagógica contextualizada",
              "atividades": [
                {"titulo": "Nome", "descricao": "Descrição detalhada", "duracao": "15min"}
              ],
              "recursos": ["recursos utilizados"],
              "avaliacao": "Como avaliar o aprendizado",
              "observacoes_eja": "Orientações específicas para EJA"
            }
            """.formatted(
                request.getDisciplina(),
                request.getTema(),
                request.getPerfilTurma(),
                request.getDuracao(),
                String.join(", ", request.getRecursos()),
                request.getObservacoes(),
                formatHabilidades(habilidades)
            );
    }

    private String formatHabilidades(List<BNCCContent> habilidades) {
        if (habilidades == null || habilidades.isEmpty()) {
            return "Nenhuma habilidade específica fornecida.";
        }
        return habilidades.stream()
                .map(h -> String.format("- %s: %s", h.getId(), h.getContent()))
                .collect(Collectors.joining("\n"));
    }
}
