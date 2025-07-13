package com.planeja;

import com.planeja.model.ClassProfile;
import com.planeja.model.LessonPlan;
import com.planeja.model.User;
import com.planeja.repository.ClassProfileRepository;
import com.planeja.repository.LessonPlanRepository;
import com.planeja.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClassProfileRepository classProfileRepository;

    @Autowired
    private LessonPlanRepository lessonPlanRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        clearDatabase();

        User testUser = new User("Test User", "test@example.com", "google-id-123", "https://example.com/image.jpg", null);
        testUser.setId(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"));
        userRepository.save(testUser);
        System.out.println("Created test user: " + testUser.getEmail());

        ClassProfile testClassProfile = new ClassProfile();
        testClassProfile.setUser(testUser);
        testClassProfile.setProfileName("Turma Teste EJA Noturno");
        testClassProfile.setSize(25);
        testClassProfile.setEducationLevels(objectMapper.writeValueAsString(Arrays.asList("Alfabetização", "Reintegração escolar")));
        testClassProfile.setAgeRanges(objectMapper.writeValueAsString(Arrays.asList("Adultos (25 a 59 anos)")));
        testClassProfile.setLifeContexts(objectMapper.writeValueAsString(Arrays.asList("Trabalhadores noturnos")));
        testClassProfile.setProfessionalAreas(objectMapper.writeValueAsString(Arrays.asList("Comércio e Vendas")));
        testClassProfile.setOtherProfiles(objectMapper.writeValueAsString(Arrays.asList("Nenhum")));
        classProfileRepository.save(testClassProfile);
        System.out.println("Created test class profile: " + testClassProfile.getProfileName());

        LessonPlan testLessonPlan = new LessonPlan();
        testLessonPlan.setUser(testUser);
        testLessonPlan.setDiscipline("Matemática");
        testLessonPlan.setLevel("Nível I - Ensino Fundamental - Etapa 1 (1º ao 5º ano)");
        testLessonPlan.setTheme("Operações Básicas");
        testLessonPlan.setDurationMinutes(50);
        testLessonPlan.setQuantity(1);
        testLessonPlan.setResources(objectMapper.writeValueAsString(Arrays.asList("Quadro e giz/lousa", "Livros")));
        testLessonPlan.setClassProfile(testClassProfile); // Link to the created class profile
        testLessonPlan.setClassSize(25);
        testLessonPlan.setEducationLevels(objectMapper.writeValueAsString(Arrays.asList("Alfabetização")));
        testLessonPlan.setAgeRanges(objectMapper.writeValueAsString(Arrays.asList("Adultos (25 a 59 anos)")));
        testLessonPlan.setLifeContexts(objectMapper.writeValueAsString(Arrays.asList("Trabalhadores noturnos")));
        testLessonPlan.setProfessionalAreas(objectMapper.writeValueAsString(Arrays.asList("Comércio e Vendas")));
        testLessonPlan.setOtherProfiles(objectMapper.writeValueAsString(Arrays.asList("Nenhum")));
        testLessonPlan.setObservations("Foco em exemplos práticos do dia a dia.");
        
        String generatedContent = "{\"title\":\"Plano de Aula de Matemática - Operações Básicas\",\"objetivoGeral\":\"Capacitar os alunos a realizar as quatro operações básicas.\",\"habilidadesTrabalhadas\":[\"EF01MA01\",\"EF01MA02\"],\"metodologia\":\"Aulas expositivas e exercícios práticos.\",\"atividades\":[{\"titulo\":\"Introdução\",\"duracao\":\"10 min\",\"descricao\":\"Revisão de conceitos.\"},{\"titulo\":\"Exercícios\",\"duracao\":\"30 min\",\"descricao\":\"Resolução de problemas.\"}],\"recursosNecessarios\":[\"Livro didático\",\"Calculadora\"],\"metodosDeAvaliacao\":\"Observação e lista de exercícios.\"}";
        testLessonPlan.setGeneratedContent(generatedContent);
        testLessonPlan.setGenerationTimestamp(LocalDateTime.now());
        lessonPlanRepository.save(testLessonPlan);
        System.out.println("Created test lesson plan: " + testLessonPlan.getTheme());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void clearDatabase() {
        System.out.println("Cleaning up existing data...");
        lessonPlanRepository.deleteAllInBatch();
        classProfileRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
        System.out.println("Data cleanup complete.");
    }
}
