// Tipo base para perfil de turma
export interface BaseClassProfile {
  size?: number;
  educationLevels?: string[];
  ageRanges?: string[];
  lifeContexts?: string[];
  professionalAreas?: string[];
  otherProfiles?: string[];
}

// Tipo usado nos modais e componentes UI
export interface UIClassProfile extends BaseClassProfile {
  userId?: string;
  profileName?: string;
}

// Type guard para verificar se um perfil tem as propriedades obrigatórias
export function isCompleteProfile(profile: UIClassProfile): profile is UIClassProfile & { userId: string; profileName: string } {
  return Boolean(
    profile && 
    typeof profile === 'object' &&
    'userId' in profile && 
    'profileName' in profile && 
    typeof profile.userId === 'string' && 
    typeof profile.profileName === 'string' &&
    profile.userId.length > 0 &&
    profile.profileName.length > 0
  );
}