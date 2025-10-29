package com.planeja.service;

import com.planeja.config.PineconeConfig;
import com.planeja.model.BNCCContent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final GeminiEmbeddingService geminiEmbeddingService;
    private final ObjectMapper objectMapper;

    public BNCCSearchService(RestTemplate restTemplate, PineconeConfig pineconeConfig, GeminiEmbeddingService geminiEmbeddingService) {
        this.restTemplate = restTemplate;
        this.pineconeConfig = pineconeConfig;
        this.geminiEmbeddingService = geminiEmbeddingService;
        this.objectMapper = new ObjectMapper();
    }

    public List<BNCCContent> searchWithFilters(String query, String area, String etapa, List<String> anos, int topK) {
        long startTime = System.currentTimeMillis();
        logger.info("Executing search with query: '{}', area: '{}', etapa: '{}', anos: {}, topK: {}", query, area, etapa, anos, topK);

        try {
            // Use GeminiEmbeddingService instead of local embedding client
            List<Float> embedding = geminiEmbeddingService.generateEmbedding(query);

            String pineconeUrl = String.format("%s/query", pineconeConfig.getHost());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Api-Key", pineconeConfig.getApiKey());

            Map<String, Object> requestBody = new java.util.HashMap<>();
            requestBody.put("vector", embedding);
            requestBody.put("topK", topK);
            requestBody.put("includeMetadata", true);

            Map<String, Object> filter = new java.util.HashMap<>();
            if (area != null) {
                filter.put("area", mapAreaToPineconeFormat(area));
            }
            if (etapa != null) {
                filter.put("etapa", mapEtapaToPineconeFormat(etapa));
            }
            if (anos != null && !anos.isEmpty()) {
                filter.put("ano", Map.of("$in", anos));
            }
            if (!filter.isEmpty()) {
                requestBody.put("filter", filter);
            }

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            logger.info("Sending Pinecone query to {}: {}", pineconeUrl, requestBody);
            String jsonResponse = restTemplate.exchange(pineconeUrl, HttpMethod.POST, requestEntity, String.class).getBody();
            logger.info("Received Pinecone response: {}", jsonResponse);
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

    public List<BNCCContent> searchForEJA(String query, String disciplina, String nivelEnsino, List<String> anos) {
        return searchWithFilters(query, disciplina, nivelEnsino, anos, 100);
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

    private String removeAccentsAndFormat(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        String normalizedText = java.text.Normalizer.normalize(text, java.text.Normalizer.Form.NFD);
        String asciiText = normalizedText.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        String formattedText = asciiText.toLowerCase().replaceAll("\\s+", "_").replaceAll("[^a-z0-9_]", "");
        return formattedText.replaceAll("__+", "_").replaceAll("^_|_$", "");
    }

    private String mapEtapaToPineconeFormat(String etapa) {
        if (etapa == null || etapa.isEmpty()) {
            return etapa;
        }
        if (etapa.toLowerCase().contains("fundamental")) {
            return "ensino_fundamental";
        } else if (etapa.toLowerCase().contains("médio") || etapa.toLowerCase().contains("medio")) {
            return "ensino_medio";
        } else if (etapa.toLowerCase().contains("eja")) {
            return "todas"; // EJA specific chunks have 'todas' as etapa
        }
        return etapa.toLowerCase().replaceAll("\\s+", "_"); // Default fallback
    }

    private String mapAreaToPineconeFormat(String area) {
        if (area == null || area.isEmpty()) {
            return area;
        }
        switch (area.toLowerCase()) {
            case "linguagens":
                // This is ambiguous, could be Lingua Portuguesa (EF) or Linguagens e suas Tecnologias (EM)
                // For now, let's assume Lingua Portuguesa for EF context based on common queries.
                // A more robust solution might involve passing the education level from frontend.
                return "lingua_portuguesa"; 
            case "matemática":
            case "matematica":
                return "matematica";
            case "ciências":
            case "ciencias":
                return "ciencias";
            case "história":
            case "historia":
                return "historia";
            case "geografia":
                return "geografia";
            case "arte":
                return "arte";
            case "educação física":
            case "educacao fisica":
                return "educacao_fisica";
            case "ensino religioso":
                return "ensino_religioso";
            case "língua inglesa":
            case "lingua inglesa":
                return "lingua_inglesa";
            // Add mappings for Ensino Médio areas if needed, e.g.:
            case "linguagens e suas tecnologias":
                return "linguagens_e_suas_tecnologias";
            case "matemática e suas tecnologias":
            case "matematica e suas tecnologias":
                return "matematica_e_suas_tecnologias";
            case "ciências da natureza e suas tecnologias":
            case "ciencias da natureza e suas tecnologias":
                return "ciencias_da_natureza_e_suas_tecnologias";
            case "ciências humanas e sociais aplicadas":
            case "ciencias humanas e sociais aplicadas":
                return "ciencias_humanas_e_sociais_aplicadas";
            default:
                return removeAccentsAndFormat(area); // Fallback to generic formatting
        }
    }
}