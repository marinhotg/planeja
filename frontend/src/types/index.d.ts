interface LessonPlanRequest {
  disciplina: string;
  nivel: string;
  tema: string;
  duracao: number;
  quantidade: number;
  recursos: string[];
  tamanho: number;
  escolarizacao: string[];
  faixas: string[];
  contextos: string[];
  profissoes: string[];
  outrosPerfis: string[];
  observacoes: string;
  salvarPerfil: boolean;
  nomePerfil: string;
}

interface GeneratedLessonPlan {
  titulo: string;
  objetivoGeral: string;
  habilidadesTrabalhadas: string[];
  metodologia: string;
  atividades: {
    titulo: string;
    descricao: string;
    duracao: string;
  }[];
  recursosNecessarios: string[];
  metodosDeAvaliacao: string;
}

interface ClassProfile {
  id?: number;
  name: string;
  size: number;
  education: string[];
  age: string[];
  life: string[];
  professional: string[];
  other: string[];
}
