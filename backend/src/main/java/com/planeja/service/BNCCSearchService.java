package com.planeja.service;

import com.planeja.config.PineconeConfig;
import com.planeja.model.BNCCContent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class BNCCSearchService {

    private static final Logger logger = LoggerFactory.getLogger(BNCCSearchService.class);

    private final RestTemplate restTemplate;
    private final PineconeConfig pineconeConfig;
    private final EmbeddingClient embeddingClient;
    private final ObjectMapper objectMapper;

    public BNCCSearchService(RestTemplate restTemplate, PineconeConfig pineconeConfig, EmbeddingClient embeddingClient) {
        this.restTemplate = restTemplate;
        this.pineconeConfig = pineconeConfig;
        this.embeddingClient = embeddingClient;
        this.objectMapper = new ObjectMapper();
    }

    public List<BNCCContent> searchWithFilters(String query, String area, String etapa, int topK) {
        long startTime = System.currentTimeMillis();
        logger.info("Executing search with query: '{}', area: '{}', etapa: '{}', topK: {}", query, area, etapa, topK);

        try {
            List<Double> embeddingDouble = embeddingClient.embed(query);
            List<Float> embedding = embeddingDouble.stream()
                    .map(Double::floatValue)
                    .collect(Collectors.toList());

            String pineconeUrl = String.format("%s/query", pineconeConfig.getHost());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Api-Key", pineconeConfig.getApiKey());

            Map<String, Object> requestBody = new java.util.HashMap<>();
            requestBody.put("vector", embedding);
            requestBody.put("topK", topK);
            requestBody.put("includeMetadata", true);

            if (area != null || etapa != null) {
                Map<String, Object> filter = new java.util.HashMap<>();
                if (area != null) {
                    filter.put("area", area);
                }
                if (etapa != null) {
                    filter.put("etapa", etapa);
                }
                requestBody.put("filter", filter);
            }

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            String jsonResponse = restTemplate.exchange(pineconeUrl, HttpMethod.POST, requestEntity, String.class).getBody();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode matchesNode = rootNode.path("matches");

            List<BNCCContent> results = new ArrayList<>();
            if (matchesNode.isArray()) {
                for (JsonNode matchNode : matchesNode) {
                    results.add(toBNCCContent(matchNode));
                }
            }

            long endTime = System.currentTimeMillis();
            logger.info("Search completed in {} ms", endTime - startTime);

            return results;
        } catch (Exception e) {
            logger.error("Error during search", e);
            return Collections.emptyList();
        }
    }

    public List<BNCCContent> searchForEJA(String query, String disciplina, String nivelEnsino) {
        return searchWithFilters(query, disciplina, nivelEnsino, 10);
    }

    private BNCCContent toBNCCContent(JsonNode matchNode) {
        BNCCContent bnccContent = new BNCCContent();
        bnccContent.setId(matchNode.path("id").asText());
        bnccContent.setScore(matchNode.path("score").asDouble());

        JsonNode metadataNode = matchNode.path("metadata");
        if (metadataNode.isObject()) {
            bnccContent.setType(metadataNode.path("type").asText());
            bnccContent.setArea(metadataNode.path("area").asText());
            bnccContent.setEtapa(metadataNode.path("etapa").asText());
            bnccContent.setAno(metadataNode.path("ano").asText());
            bnccContent.setContent(metadataNode.path("content").asText());
            bnccContent.setAdaptavelEJA(metadataNode.path("adaptavel_eja").asBoolean());

            String codigosString = metadataNode.path("codigos").asText();
            if (codigosString != null && !codigosString.isEmpty()) {
                bnccContent.setCodigos(List.of(codigosString.split(",")));
            }
        }

        return bnccContent;
    }
}