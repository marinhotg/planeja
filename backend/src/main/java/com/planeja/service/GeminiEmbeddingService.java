package com.planeja.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeminiEmbeddingService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiEmbeddingService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String baseUrl;

    public GeminiEmbeddingService(RestTemplate restTemplate, ObjectMapper objectMapper,
                                  @Value("${gemini.api-key}") String apiKey,
                                  @Value("${gemini.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    public List<Float> generateEmbedding(String text) {
        logger.info("Generating embedding for text: {}", text.substring(0, Math.min(50, text.length())));

        // Use Gemini embedding model
        String url = String.format("%s/models/text-embedding-004:embedContent?key=%s", baseUrl, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(Collections.singletonMap("text", text)));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("content", content);
        requestBody.put("taskType", "RETRIEVAL_QUERY");

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            JsonNode rootNode = restTemplate.postForObject(url, requestEntity, JsonNode.class);

            JsonNode embeddingNode = rootNode.path("embedding").path("values");

            List<Float> embedding = new ArrayList<>();
            if (embeddingNode.isArray()) {
                for (JsonNode value : embeddingNode) {
                    embedding.add((float) value.asDouble());
                }
            }

            logger.info("Successfully generated embedding with {} dimensions", embedding.size());
            return embedding;
        } catch (Exception e) {
            logger.error("Error calling Gemini Embedding API", e);
            throw new RuntimeException("Failed to generate embedding from Gemini", e);
        }
    }

    public List<Double> generateEmbeddingAsDouble(String text) {
        return generateEmbedding(text).stream()
                .map(Float::doubleValue)
                .collect(Collectors.toList());
    }
}
