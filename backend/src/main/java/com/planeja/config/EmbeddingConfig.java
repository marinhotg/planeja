package com.planeja.config;

import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.ai.transformers.TransformersEmbeddingClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmbeddingConfig {

    @Bean
    public EmbeddingClient embeddingClient() {
        return new TransformersEmbeddingClient();
    }
}
