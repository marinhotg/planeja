package com.planeja.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class PineconeConfig {

    @Value("${pinecone.api-key}")
    private String apiKey;

    @Value("${pinecone.index-name}")
    private String indexName;

    @Value("${pinecone.environment}")
    private String environment;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getIndexName() {
        return indexName;
    }

    public String getEnvironment() {
        return environment;
    }
}