package com.planeja.dto;

import java.util.List;

public class ConfigurationResponse {
    private List<String> disciplines;
    private List<String> levels;
    private List<String> resources;
    private List<String> educationLevels;
    private List<String> ageRanges;
    private List<String> lifeContexts;
    private List<String> professionalAreas;
    private List<String> otherProfiles;

    // Getters and Setters
    public List<String> getDisciplines() {
        return disciplines;
    }

    public void setDisciplines(List<String> disciplines) {
        this.disciplines = disciplines;
    }

    public List<String> getLevels() {
        return levels;
    }

    public void setLevels(List<String> levels) {
        this.levels = levels;
    }

    public List<String> getResources() {
        return resources;
    }

    public void setResources(List<String> resources) {
        this.resources = resources;
    }

    public List<String> getEducationLevels() {
        return educationLevels;
    }

    public void setEducationLevels(List<String> educationLevels) {
        this.educationLevels = educationLevels;
    }

    public List<String> getAgeRanges() {
        return ageRanges;
    }

    public void setAgeRanges(List<String> ageRanges) {
        this.ageRanges = ageRanges;
    }

    public List<String> getLifeContexts() {
        return lifeContexts;
    }

    public void setLifeContexts(List<String> lifeContexts) {
        this.lifeContexts = lifeContexts;
    }

    public List<String> getProfessionalAreas() {
        return professionalAreas;
    }

    public void setProfessionalAreas(List<String> professionalAreas) {
        this.professionalAreas = professionalAreas;
    }

    public List<String> getOtherProfiles() {
        return otherProfiles;
    }

    public void setOtherProfiles(List<String> otherProfiles) {
        this.otherProfiles = otherProfiles;
    }
}
