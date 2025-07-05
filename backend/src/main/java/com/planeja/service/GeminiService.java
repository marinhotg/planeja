package com.planeja.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.planeja.model.LessonPlan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String baseUrl;
    private final String model;

    public GeminiService(RestTemplate restTemplate, ObjectMapper objectMapper,
                         @Value("${gemini.api-key}") String apiKey,
                         @Value("${gemini.base-url}") String baseUrl,
                         @Value("${gemini.model}") String model) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.model = model;
    }

    public LessonPlan generatePlan(String prompt) {
        String url = String.format("%s/models/%s:generateContent?key=%s", baseUrl, model, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(Collections.singletonMap("text", prompt)));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(content));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            com.fasterxml.jackson.databind.JsonNode rootNode = restTemplate.postForObject(url, requestEntity, com.fasterxml.jackson.databind.JsonNode.class);

            String textResponse = rootNode
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();

            String cleanJson = extractJsonFromMarkdown(textResponse);

            return objectMapper.readValue(cleanJson, LessonPlan.class);
        } catch (Exception e) {
            logger.error("Error calling Gemini API or parsing response", e);
            throw new RuntimeException("Failed to generate or parse lesson plan from Gemini", e);
        }
    }

    private String extractJsonFromMarkdown(String markdown) {
        String cleaned = markdown.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }
}
