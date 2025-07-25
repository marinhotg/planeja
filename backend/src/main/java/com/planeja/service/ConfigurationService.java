package com.planeja.service;

import com.planeja.dto.ConfigurationResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ConfigurationService {

    public ConfigurationResponse getConfigurations() {
        ConfigurationResponse config = new ConfigurationResponse();

        // Disciplines
        config.setDisciplines(Arrays.asList(
                "Matemática", "Português", "História", "Geografia", "Ciências", "Artes", "Educação Física"
        ));

        // Levels
        config.setLevels(Arrays.asList(
                "Nível I - Ensino Fundamental - Etapa 1 (1º ao 5º ano)",
                "Nível II - Ensino Fundamental - Etapa 2 (6º ao 9º ano)", 
                "Nível III - Ensino Médio"
        ));

        // Resources
        config.setResources(Arrays.asList(
                "Quadro e giz/lousa", "Projetor", "TV/DVD", "Livros", "Computadores", "Papel e canetas"
        ));

        // Education Levels
        config.setEducationLevels(Arrays.asList(
                "Reintegração escolar", "Multissérie", "Interesse em temas práticos", "Alfabetização", "Experiência com tecnologia"
        ));

        // Age Ranges
        config.setAgeRanges(Arrays.asList(
                "Jovens (15 a 24 anos)", "Adultos (25 a 59 anos)", "Idosos (60+ anos)"
        ));

        // Life Contexts
        config.setLifeContexts(Arrays.asList(
                "Trabalhadores noturnos", "Desempregados", "Mães", "Pais", "Cuidadores familiares", "Migrantes/recém-chegados"
        ));

        // Professional Areas
        config.setProfessionalAreas(Arrays.asList(
                "Comércio e Vendas", "Construção Civil", "Transporte e Logística", "Serviços Gerais", "Alimentação", "Agricultura", "Cuidado e Saúde", "Administração / Escritório"
        ));

        // Other Profiles
        config.setOtherProfiles(Arrays.asList(
                "Pessoas com deficiência", "Povos originários", "Pessoas privadas de liberdade", "Refugiados", "Estrangeiros"
        ));

        return config;
    }
}
