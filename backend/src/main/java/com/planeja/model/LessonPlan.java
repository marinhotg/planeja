package com.planeja.model;

import java.util.List;

public class LessonPlan {
    private String titulo;
    private List<String> objetivos;
    private String metodologia;
    private List<Atividade> atividades;
    private List<String> recursos;
    private String avaliacao;
    private String observacoesEJA;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public List<String> getObjetivos() {
        return objetivos;
    }

    public void setObjetivos(List<String> objetivos) {
        this.objetivos = objetivos;
    }

    public String getMetodologia() {
        return metodologia;
    }

    public void setMetodologia(String metodologia) {
        this.metodologia = metodologia;
    }

    public List<Atividade> getAtividades() {
        return atividades;
    }

    public void setAtividades(List<Atividade> atividades) {
        this.atividades = atividades;
    }

    public List<String> getRecursos() {
        return recursos;
    }

    public void setRecursos(List<String> recursos) {
        this.recursos = recursos;
    }

    public String getAvaliacao() {
        return avaliacao;
    }

    public void setAvaliacao(String avaliacao) {
        this.avaliacao = avaliacao;
    }

    public String getObservacoesEJA() {
        return observacoesEJA;
    }

    public void setObservacoesEJA(String observacoesEJA) {
        this.observacoesEJA = observacoesEJA;
    }

    public static class Atividade {
        private String titulo;
        private String descricao;
        private String duracao;

        
        public String getTitulo() {
            return titulo;
        }

        public void setTitulo(String titulo) {
            this.titulo = titulo;
        }

        public String getDescricao() {
            return descricao;
        }

        public void setDescricao(String descricao) {
            this.descricao = descricao;
        }

        public String getDuracao() {
            return duracao;
        }

        public void setDuracao(String duracao) {
            this.duracao = duracao;
        }
    }
}
