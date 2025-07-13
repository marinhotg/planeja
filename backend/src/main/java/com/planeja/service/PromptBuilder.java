package com.planeja.service;

import com.planeja.model.BNCCContent;
import com.planeja.model.LessonPlanRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromptBuilder {

    public String buildPrompt(LessonPlanRequest request, List<BNCCContent> habilidades) {
        String nivelDetalhado = getNivelDetalhado(request.getNivel());
        
        return """
            Você é um professor experiente da Educação de Jovens e Adultos (EJA) da disciplina %s no nível %s.
            
            Crie um plano de aula contextualizado para EJA baseado EXCLUSIVAMENTE nas habilidades da BNCC fornecidas: %s.
            O plano de aula deve ser completo, relevante e aplicável, considerando os princípios da andragogia e as características dos estudantes adultos da EJA.
            
            Siga estes princípios da andragogia na elaboração:
            
            1. Necessidade de saber – Explique claramente o porquê do conteúdo, relacionando-o a situações do cotidiano.
            2. Autonomia – Respeite o fato de que os alunos adultos são responsáveis por suas próprias decisões e aprendizados. Incentive participação ativa.
            3. Valorização da experiência prévia – Aproveite os conhecimentos de vida, trabalho e contexto dos alunos como base para o novo conteúdo.
            4. Prontidão para aprender – Foque em conteúdos que respondam a necessidades reais e imediatas dos alunos.
            5. Aprendizagem orientada para a vida – Prefira atividades que resolvam problemas práticos e conectem a teoria com a prática.
            6. Motivação interna – Estimule o sentimento de competência, superação e crescimento pessoal.
            
            Use as informações fornecidas abaixo sobre a aula e sobre o perfil da turma.
            
            Detalhes da aula:
            * Disciplina: %s
            * Nível Educacional: %s
            * Tema: %s
            * Habilidades da BNCC: %s
            * Duração total da aula: %s
            * Quantidade de aulas: %s
            * Recursos disponíveis: %s
            
            O perfil da turma conta com %s alunos com as seguintes características diversas:
            * Nível de escolarização anterior: %s
            * Faixas etárias predominantes: %s
            * Contextos de vida: %s
            * Áreas profissionais predominantes: %s
            * Outros perfis relevantes: %s
            
            Considere essas observações adicionais: %s
            
            O plano deve ser entregue exclusivamente no formato JSON, com os seguintes campos:
            {
              "titulo": "Nome atrativo e claro do plano de aula",
              "objetivoGeral": "Descreva o objetivo geral da aula de forma clara e concisa.",
              "habilidadesTrabalhadas": [
                "Habilidade específica 1 da BNCC trabalhada",
                "Habilidade específica 2 da BNCC trabalhada"
              ],
              "metodologia": "Descrição da abordagem andragógica contextualizada",
              "atividades": [
                {
                  "titulo": "Nome da atividade",
                  "descricao": "Descrição detalhada da atividade",
                  "duracao": "15min"
                }
              ],
              "recursosNecessarios": [
                "Lista dos recursos que serão efetivamente utilizados"
              ],
              "metodosDeAvaliacao": "Como avaliar o aprendizado de forma formativa"
            }
            
            Instruções importantes:
            1. PREENCHA TODOS OS CAMPOS - nenhum campo deve ficar null ou vazio.
            2. O título deve ser atrativo e refletir o tema da aula.
            3. O campo 'habilidadesTrabalhadas' deve citar especificamente as habilidades da BNCC trabalhadas.
            4. Liste apenas os recursos que serão realmente utilizados na aula.
            5. Use metodologias ativas, dialógicas e respeitosas com os adultos.
            6. A avaliação deve ser formativa, baseada na participação e aplicação prática.
            7. Gere somente o JSON como resposta, sem explicações adicionais.
            """.formatted(
                request.getDisciplina(),
                nivelDetalhado,
                formatHabilidades(habilidades),
                request.getDisciplina(),
                nivelDetalhado,
                request.getTema(),
                formatHabilidades(habilidades),
                request.getDuracao(),
                request.getQuantidade(),
                formatList(request.getRecursos()),
                request.getTamanho(),
                formatList(request.getEscolarizacao()),
                formatList(request.getFaixas()),
                formatList(request.getContextos()),
                formatList(request.getProfissoes()),
                formatList(request.getOutrosPerfis()),
                request.getObservacoes()
            );
    }

    private String formatHabilidades(List<BNCCContent> habilidades) {
        if (habilidades == null || habilidades.isEmpty()) {
            return "Nenhuma habilidade específica fornecida.";
        }
        return habilidades.stream()
                .map(h -> String.format("%s: %s", h.getId(), h.getContent()))
                .collect(Collectors.joining(", "));
    }

    private String formatList(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "Não especificado";
        }
        return String.join(", ", list);
    }

    /**
     * Converte o nível do frontend para uma descrição mais detalhada para o prompt
     */
    private String getNivelDetalhado(String nivel) {
        if (nivel == null) {
            return "Ensino Fundamental - Etapa 1 (1º ao 5º ano)";
        }
        
        if (nivel.contains("Nível I") || nivel.contains("1º ao 5º")) {
            return "Ensino Fundamental - Etapa 1 (1º ao 5º ano)";
        } else if (nivel.contains("Nível II") || nivel.contains("6º ao 9º")) {
            return "Ensino Fundamental - Etapa 2 (6º ao 9º ano)";
        } else if (nivel.contains("Nível III") || nivel.contains("Ensino Médio")) {
            return "Ensino Médio";
        }
        
        return nivel; // retorna o valor original se não conseguir mapear
    }
}