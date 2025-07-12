export interface LessonPlanRequest {
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
}

export interface ParsedGeneratedContent {
  title: string;
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
  userId: string; // Assuming userId will be passed from frontend or derived from auth
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function generateLessonPlan(lessonPlanData: LessonPlanRequest): Promise<GeneratedLessonPlan> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lesson-plans/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonPlanData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate lesson plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    throw error;
  }
}

export async function saveLessonPlan(lessonPlanData: GeneratedLessonPlan): Promise<GeneratedLessonPlan> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lesson-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonPlanData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save lesson plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving lesson plan:', error);
    throw error;
  }
}

export async function fetchLessonPlanById(id: string): Promise<GeneratedLessonPlan> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lesson-plans/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch lesson plan by ID');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching lesson plan by ID:', error);
    throw error;
  }
}

export async function fetchLessonPlans(): Promise<GeneratedLessonPlan[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lesson-plans`);
    if (!response.ok) {
      throw new Error('Failed to fetch lesson plans');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    throw error;
  }
}

export async function deleteLessonPlan(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lesson-plans/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete lesson plan');
    }
  } catch (error) {
    console.error('Error deleting lesson plan:', error);
    throw error;
  }
}

export async function fetchClassProfiles(): Promise<ClassProfile[]> {
  try {
    // In a real app, you'd filter by userId on the backend
    const response = await fetch(`${API_BASE_URL}/api/class-profiles`);
    if (!response.ok) {
      throw new Error('Failed to fetch class profiles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching class profiles:', error);
    throw error;
  }
}

export async function createClassProfile(profileData: ClassProfileRequest): Promise<ClassProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/class-profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create class profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating class profile:', error);
    throw error;
  }
}

export async function updateClassProfile(id: string, profileData: ClassProfileRequest): Promise<ClassProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/class-profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update class profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating class profile:', error);
    throw error;
  }
}

export async function deleteClassProfile(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/class-profiles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete class profile');
    }
  } catch (error) {
    console.error('Error deleting class profile:', error);
    throw error;
  }
}

export async function fetchClassProfileById(id: string): Promise<ClassProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/class-profiles/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch class profile by ID');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching class profile by ID:', error);
    throw error;
  }
}

export async function fetchConfigurations(): Promise<ConfigurationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/configurations`);
    if (!response.ok) {
      throw new Error('Failed to fetch configurations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching configurations:', error);
    throw error;
  }
}
