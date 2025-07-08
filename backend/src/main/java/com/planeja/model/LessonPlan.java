package com.planeja.model;

import java.util.List;
import java.util.ArrayList;

public class LessonPlan {

    private String titulo;
    private List<String> objetivos;
    private String metodologia;
    private List<Atividade> atividades;
    private List<String> recursos;
    private String avaliacao;
    private String observacoesEJA;

    // Construtor padrão
    public LessonPlan() {
        this.objetivos = new ArrayList<>();
        this.atividades = new ArrayList<>();
        this.recursos = new ArrayList<>();
    }

    // Getters e Setters com validação básica
    public String getTitulo() {
        return titulo != null ? titulo : "";
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public List<String> getObjetivos() {
        return objetivos != null ? objetivos : new ArrayList<>();
    }

    public void setObjetivos(List<String> objetivos) {
        this.objetivos = objetivos != null ? objetivos : new ArrayList<>();
    }

    public String getMetodologia() {
        return metodologia != null ? metodologia : "";
    }

    public void setMetodologia(String metodologia) {
        this.metodologia = metodologia;
    }

    public List<Atividade> getAtividades() {
        return atividades != null ? atividades : new ArrayList<>();
    }

    public void setAtividades(List<Atividade> atividades) {
        this.atividades = atividades != null ? atividades : new ArrayList<>();
    }

    public List<String> getRecursos() {
        return recursos != null ? recursos : new ArrayList<>();
    }

    public void setRecursos(List<String> recursos) {
        this.recursos = recursos != null ? recursos : new ArrayList<>();
    }

    public String getAvaliacao() {
        return avaliacao != null ? avaliacao : "";
    }

    public void setAvaliacao(String avaliacao) {
        this.avaliacao = avaliacao;
    }

    public String getObservacoesEJA() {
        return observacoesEJA != null ? observacoesEJA : "";
    }

    public void setObservacoesEJA(String observacoesEJA) {
        this.observacoesEJA = observacoesEJA;
    }

    public static class Atividade {
        private String titulo;
        private String descricao;
        private String duracao;

        public String getTitulo() {
            return titulo != null ? titulo : "";
        }

        public void setTitulo(String titulo) {
            this.titulo = titulo;
        }

        public String getDescricao() {
            return descricao != null ? descricao : "";
        }

        public void setDescricao(String descricao) {
            this.descricao = descricao;
        }

        public String getDuracao() {
            return duracao != null ? duracao : "";
        }

        public void setDuracao(String duracao) {
            this.duracao = duracao;
        }
    }
}