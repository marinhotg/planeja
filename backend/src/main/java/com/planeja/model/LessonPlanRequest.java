package com.planeja.model;

import java.util.List;

public class LessonPlanRequest {
    private String disciplina;
    private String nivel;
    private String tema;
    private String duracao;
    private String quantidade;
    private List<String> recursos;
    private String tamanho;
    private List<String> escolarizacao;
    private List<String> faixas;
    private List<String> contextos;
    private List<String> profissoes;
    private String observacoes;

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

    public String getDuracao() {
        return duracao;
    }

    public void setDuracao(String duracao) {
        this.duracao = duracao;
    }

    public String getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(String quantidade) {
        this.quantidade = quantidade;
    }

    public List<String> getRecursos() {
        return recursos;
    }

    public void setRecursos(List<String> recursos) {
        this.recursos = recursos;
    }

    public String getTamanho() {
        return tamanho;
    }

    public void setTamanho(String tamanho) {
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

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}