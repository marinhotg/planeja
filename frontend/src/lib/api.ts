import axios from 'axios';
import { getSession } from 'next-auth/react';

export interface LessonPlanRequest {
  userId: string;
  disciplina: string;
  nivel: string;
  tema: string;
  duracao: number;
  quantidade: number;
  recursos: string[];
  tamanho?: number;
  escolarizacao?: string[];
  faixas?: string[];
  contextos?: string[];
  profissoes?: string[];
  outrosPerfis?: string[];
  observacoes: string;
  salvarPerfil?: boolean;
  nomePerfil?: string;
}

export interface GeneratedLessonPlan {
  id: string;
  userId: string;
  discipline: string;
  level: string;
  theme: string;
  durationMinutes: number;
  quantity: number;
  resources: string[];
  classProfileId?: string;
  classSize?: number;
  educationLevels?: string[];
  ageRanges?: string[];
  lifeContexts?: string[];
  professionalAreas?: string[];
  otherProfiles?: string[];
  observations: string;
  generatedContent: string; // This will be a JSON string
  generationTimestamp: string;
  rating?: number;
  feedbackText?: string;
}

export interface FeedbackRequest {
  planId: string;
  rating: number;
  comment: string;
}

export interface ParsedGeneratedContent {
  titulo: string;
  objetivoGeral: string;
  habilidadesTrabalhadas: string[];
  metodologia: string;
  atividades: Array<{
    titulo: string;
    duracao: string;
    descricao: string;
  }>;
  recursosNecessarios: string[];
  metodosDeAvaliacao: string;
}

export interface ClassProfile {
  id: string;
  userId: string;
  profileName: string;
  size?: number;
  educationLevels?: string[];
  ageRanges?: string[];
  lifeContexts?: string[];
  professionalAreas?: string[];
  otherProfiles?: string[];
}

export interface ClassProfileRequest {
  profileName: string;
  size?: number;
  educationLevels?: string[];
  ageRanges?: string[];
  lifeContexts?: string[];
  professionalAreas?: string[];
  otherProfiles?: string[];
}

export interface ConfigurationResponse {
  disciplines: string[];
  levels: string[];
  resources: string[];
  themesByDiscipline: { [key: string]: string[] };
  educationLevels: string[];
  ageRanges: string[];
  lifeContexts: string[];
  professionalAreas: string[];
  otherProfiles: string[];
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session && session.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export const generateLessonPlan = async (lessonPlanData: LessonPlanRequest): Promise<GeneratedLessonPlan> => {
  const response = await api.post('/api/lesson-plans/generate', lessonPlanData);
  return response.data;
};

export const saveLessonPlan = async (lessonPlanData: GeneratedLessonPlan): Promise<GeneratedLessonPlan> => {
  const response = await api.post('/api/lesson-plans', lessonPlanData);
  return response.data;
};

export const fetchLessonPlanById = async (id: string): Promise<GeneratedLessonPlan> => {
  const response = await api.get(`/api/lesson-plans/${id}`);
  return response.data;
};

export const fetchLessonPlans = async (): Promise<GeneratedLessonPlan[]> => {
  const response = await api.get('/api/lesson-plans');
  return response.data;
};

export const deleteLessonPlan = async (id: string): Promise<void> => {
  await api.delete(`/api/lesson-plans/${id}`);
};

export const fetchClassProfiles = async (): Promise<ClassProfile[]> => {
  const response = await api.get('/api/class-profiles');
  return response.data;
};

export const createClassProfile = async (profileData: ClassProfileRequest): Promise<ClassProfile> => {
  const response = await api.post('/api/class-profiles', profileData);
  return response.data;
};

export const updateClassProfile = async (id: string, profileData: ClassProfileRequest): Promise<ClassProfile> => {
  const response = await api.put(`/api/class-profiles/${id}`, profileData);
  return response.data;
};

export const deleteClassProfile = async (id: string): Promise<void> => {
  await api.delete(`/api/class-profiles/${id}`);
};

export const fetchClassProfileById = async (id: string): Promise<ClassProfile> => {
  const session = await getSession();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not authenticated.");
  }
  const response = await api.get(`/api/class-profiles/${id}?userId=${session.user.id}`);
  return response.data;
};

export const fetchConfigurations = async (): Promise<ConfigurationResponse> => {
  const response = await api.get('/api/configurations');
  return response.data;
};

export const submitFeedback = async (feedbackData: FeedbackRequest): Promise<void> => {
  await api.put(`/api/lesson-plans/${feedbackData.planId}/feedback`, { rating: feedbackData.rating, feedbackText: feedbackData.comment });
};