package com.planeja.dto;

import java.util.List;

public class GeminiLessonPlanResponse {
    private String titulo;
    private String objetivoGeral;
    private List<String> habilidadesTrabalhadas;
    private String metodologia;
    private List<Atividade> atividades;
    private List<String> recursosNecessarios;
    private String metodosDeAvaliacao;

    // Getters and Setters
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getObjetivoGeral() {
        return objetivoGeral;
    }

    public void setObjetivoGeral(String objetivoGeral) {
        this.objetivoGeral = objetivoGeral;
    }

    public List<String> getHabilidadesTrabalhadas() {
        return habilidadesTrabalhadas;
    }

    public void setHabilidadesTrabalhadas(List<String> habilidadesTrabalhadas) {
        this.habilidadesTrabalhadas = habilidadesTrabalhadas;
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

    public List<String> getRecursosNecessarios() {
        return recursosNecessarios;
    }

    public void setRecursosNecessarios(List<String> recursosNecessarios) {
        this.recursosNecessarios = recursosNecessarios;
    }

    public String getMetodosDeAvaliacao() {
        return metodosDeAvaliacao;
    }

    public void setMetodosDeAvaliacao(String metodosDeAvaliacao) {
        this.metodosDeAvaliacao = metodosDeAvaliacao;
    }

    public static class Atividade {
        private String titulo;
        private String duracao;
        private String descricao;

        // Getters and Setters
        public String getTitulo() {
            return titulo;
        }

        public void setTitulo(String titulo) {
            this.titulo = titulo;
        }

        public String getDuracao() {
            return duracao;
        }

        public void setDuracao(String duracao) {
            this.duracao = duracao;
        }

        public String getDescricao() {
            return descricao;
        }

        public void setDescricao(String descricao) {
            this.descricao = descricao;
        }
    }
}
