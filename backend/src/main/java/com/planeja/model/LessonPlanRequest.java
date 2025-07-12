package com.planeja.model;

import java.util.List;

public class LessonPlanRequest {
    private String disciplina;
    private String nivel;
    private String tema;
    private Integer duracao;
    private Integer quantidade;
    private List<String> recursos;
    private Integer tamanho;
    private List<String> escolarizacao;
    private List<String> faixas;
    private List<String> contextos;
    private List<String> profissoes;
    private List<String> outrosPerfis;
    private String observacoes;
    private Boolean salvarPerfil;
    private String nomePerfil;

    // Getters and Setters
    public String getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(String disciplina) {
        this.disciplina = disciplina;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public String getTema() {
        return tema;
    }

    public void setTema(String tema) {
        this.tema = tema;
    }

    public Integer getDuracao() {
        return duracao;
    }

    public void setDuracao(Integer duracao) {
        this.duracao = duracao;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public List<String> getRecursos() {
        return recursos;
    }

    public void setRecursos(List<String> recursos) {
        this.recursos = recursos;
    }

    public Integer getTamanho() {
        return tamanho;
    }

    public void setTamanho(Integer tamanho) {
        this.tamanho = tamanho;
    }

    public List<String> getEscolarizacao() {
        return escolarizacao;
    }

    public void setEscolarizacao(List<String> escolarizacao) {
        this.escolarizacao = escolarizacao;
    }

    public List<String> getFaixas() {
        return faixas;
    }

    public void setFaixas(List<String> faixas) {
        this.faixas = faixas;
    }

    public List<String> getContextos() {
        return contextos;
    }

    public void setContextos(List<String> contextos) {
        this.contextos = contextos;
    }

    public List<String> getProfissoes() {
        return profissoes;
    }

    public void setProfissoes(List<String> profissoes) {
        this.profissoes = profissoes;
    }

    public List<String> getOutrosPerfis() {
        return outrosPerfis;
    }

    public void setOutrosPerfis(List<String> outrosPerfis) {
        this.outrosPerfis = outrosPerfis;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Boolean getSalvarPerfil() {
        return salvarPerfil;
    }

    public void setSalvarPerfil(Boolean salvarPerfil) {
        this.salvarPerfil = salvarPerfil;
    }

    public String getNomePerfil() {
        return nomePerfil;
    }

    public void setNomePerfil(String nomePerfil) {
        this.nomePerfil = nomePerfil;
    }
}
