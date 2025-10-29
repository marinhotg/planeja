package com.planeja.config;

import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.ai.transformers.TransformersEmbeddingClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmbeddingConfig {

    // Temporarily commented out to avoid GitHub rate limit issues
    // The embedding model download from GitHub is failing with 429 error
    // TODO: Re-enable when the rate limit is lifted or use a local model

    // @Bean
    // public EmbeddingClient embeddingClient() {
    //     return new TransformersEmbeddingClient();
    // }
}
