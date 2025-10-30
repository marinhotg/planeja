package com.planeja.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class PingScheduler {

    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedRate = 600000) // 10 minutes
    public void ping() {
        try {
            restTemplate.getForObject("http://localhost:8080/ping", String.class);
        } catch (Exception e) {
            // Log the exception
        }
    }
}
