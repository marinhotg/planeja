package com.planeja.controller;

import com.planeja.dto.ConfigurationResponse;
import com.planeja.service.ConfigurationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/configurations")
public class ConfigurationController {

    @Autowired
    private ConfigurationService configurationService;

    @GetMapping
    public ConfigurationResponse getConfigurations() {
        return configurationService.getConfigurations();
    }
}
