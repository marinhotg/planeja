package com.planeja.model;

import java.util.List;

public class BNCCContent {

    private String id;
    private String type;
    private String area;
    private String etapa;
    private String ano;
    private List<String> codigos;
    private String content;
    private double score;
    private boolean adaptavelEJA;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getEtapa() {
        return etapa;
    }

    public void setEtapa(String etapa) {
        this.etapa = etapa;
    }

    public String getAno() {
        return ano;
    }

    public void setAno(String ano) {
        this.ano = ano;
    }

    public List<String> getCodigos() {
        return codigos;
    }

    public void setCodigos(List<String> codigos) {
        this.codigos = codigos;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public boolean isAdaptavelEJA() {
        return adaptavelEJA;
    }

    public void setAdaptavelEJA(boolean adaptavelEJA) {
        this.adaptavelEJA = adaptavelEJA;
    }
}
