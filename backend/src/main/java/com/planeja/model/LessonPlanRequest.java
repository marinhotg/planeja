package com.planeja.model;

import java.util.List;

public class LessonPlanRequest {
    private String disciplina;
    private String tema;
    private String perfilTurma;
    private String duracao;
    private List<String> recursos;
    private String observacoes;

    public String getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(String disciplina) {
        this.disciplina = disciplina;
    }

    public String getTema() {
        return tema;
    }

    public void setTema(String tema) {
        this.tema = tema;
    }

    public String getPerfilTurma() {
        return perfilTurma;
    }

    public void setPerfilTurma(String perfilTurma) {
        this.perfilTurma = perfilTurma;
    }

    public String getDuracao() {
        return duracao;
    }

    public void setDuracao(String duracao) {
        this.duracao = duracao;
    }

    public List<String> getRecursos() {
        return recursos;
    }

    public void setRecursos(List<String> recursos) {
        this.recursos = recursos;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
