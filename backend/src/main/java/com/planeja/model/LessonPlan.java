package com.planeja.model;

import java.util.List;
import java.util.ArrayList;

public class LessonPlan {

    private String titulo;
    private String objetivoGeral;
    private List<String> habilidadesTrabalhadas;
    private String metodologia;
    private List<Atividade> atividades;
    private List<String> recursosNecessarios;
    private String metodosDeAvaliacao;

    public LessonPlan() {
        this.habilidadesTrabalhadas = new ArrayList<>();
        this.atividades = new ArrayList<>();
        this.recursosNecessarios = new ArrayList<>();
    }

    public String getTitulo() {
        return titulo != null ? titulo : "";
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getObjetivoGeral() {
        return objetivoGeral != null ? objetivoGeral : "";
    }

    public void setObjetivoGeral(String objetivoGeral) {
        this.objetivoGeral = objetivoGeral;
    }

    public List<String> getHabilidadesTrabalhadas() {
        return habilidadesTrabalhadas != null ? habilidadesTrabalhadas : new ArrayList<>();
    }

    public void setHabilidadesTrabalhadas(List<String> habilidadesTrabalhadas) {
        this.habilidadesTrabalhadas = habilidadesTrabalhadas != null ? habilidadesTrabalhadas : new ArrayList<>();
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

    public List<String> getRecursosNecessarios() {
        return recursosNecessarios != null ? recursosNecessarios : new ArrayList<>();
    }

    public void setRecursosNecessarios(List<String> recursosNecessarios) {
        this.recursosNecessarios = recursosNecessarios != null ? recursosNecessarios : new ArrayList<>();
    }

    public String getMetodosDeAvaliacao() {
        return metodosDeAvaliacao != null ? metodosDeAvaliacao : "";
    }

    public void setMetodosDeAvaliacao(String metodosDeAvaliacao) {
        this.metodosDeAvaliacao = metodosDeAvaliacao;
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