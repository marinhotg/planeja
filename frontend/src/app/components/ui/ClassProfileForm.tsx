"use client";

import { useState, useEffect } from 'react';
import Navbar from "../layout/Navbar";
import PageTitle from "./PageTitle";
import Button from "./Button";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import ProfileSelectionModal from './ProfileSelectionModal';
import { useRouter } from 'next/navigation';
import { fetchConfigurations, ConfigurationResponse } from '@/lib/api';
import MultiSelectButtons from "./MultiSelectButtons";
import { UIClassProfile, isCompleteProfile } from '@/types/profile';

export default function ClassProfileForm() {
  const [classSize, setClassSize] = useState<number | null>(null);
  const [selectedEducationLevels, setSelectedEducationLevels] = useState<string[]>([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  const [selectedLifeContexts, setSelectedLifeContexts] = useState<string[]>([]);
  const [selectedProfessionalAreas, setSelectedProfessionalAreas] = useState<string[]>([]);
  const [selectedOtherProfiles, setSelectedOtherProfiles] = useState<string[]>([]);
  const [saveProfile, setSaveProfile] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [configurations, setConfigurations] = useState<ConfigurationResponse | null>(null);
  const [loadingConfigs, setLoadingConfigs] = useState(true);
  const [errorConfigs, setErrorConfigs] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadConfigurations = async () => {
      try {
        setLoadingConfigs(true);
        const configs = await fetchConfigurations();
        setConfigurations(configs);
      } catch (err) {
        setErrorConfigs('Failed to load configurations.');
        console.error(err);
      } finally {
        setLoadingConfigs(false);
      }
    };
    loadConfigurations();
  }, []);

  const educationLevels = configurations?.educationLevels || [];
  const ageRanges = configurations?.ageRanges || [];
  const lifeContexts = configurations?.lifeContexts || [];
  const professionalAreas = configurations?.professionalAreas || [];
  const otherProfiles = configurations?.otherProfiles || [];

  const handleMultiSelectChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleAddNewOption = (field: keyof ConfigurationResponse, value: string) => {
    if (configurations) {
      const newOptions = [...(configurations[field] as string[]), value];
      setConfigurations({ ...configurations, [field]: newOptions });

      switch (field) {
        case 'educationLevels':
          setSelectedEducationLevels([...selectedEducationLevels, value]);
          break;
        case 'ageRanges':
          setSelectedAgeRanges([...selectedAgeRanges, value]);
          break;
        case 'lifeContexts':
          setSelectedLifeContexts([...selectedLifeContexts, value]);
          break;
        case 'professionalAreas':
          setSelectedProfessionalAreas([...selectedProfessionalAreas, value]);
          break;
        case 'otherProfiles':
          setSelectedOtherProfiles([...selectedOtherProfiles, value]);
          break;
      }
    }
  };

  const handleClear = () => {
    setClassSize(null);
    setSelectedEducationLevels([]);
    setSelectedAgeRanges([]);
    setSelectedLifeContexts([]);
    setSelectedProfessionalAreas([]);
    setSelectedOtherProfiles([]);
    setSaveProfile(false);
    setProfileNameInput('');
  };

  // Função handleSelectProfile usando o type guard compartilhado
  const handleSelectProfile = (profile: UIClassProfile) => {
    if (isCompleteProfile(profile)) {
      setClassSize(profile.size || null);
      setSelectedEducationLevels(profile.educationLevels || []);
      setSelectedAgeRanges(profile.ageRanges || []);
      setSelectedLifeContexts(profile.lifeContexts || []);
      setSelectedProfessionalAreas(profile.professionalAreas || []);
      setSelectedOtherProfiles(profile.otherProfiles || []);
      setProfileNameInput(profile.profileName);
      setSaveProfile(true);
    } else {
      console.error('Profile is missing userId or profileName properties', profile);
      alert('Erro: Perfil inválido selecionado. Verifique se o perfil contém todas as informações necessárias.');
    }
  };

  const handleAdvance = () => {
    if (saveProfile && profileNameInput.trim() === '') {
      alert("Por favor, insira um nome para o perfil.");
      return;
    }

    const classProfileData = {
      tamanho: classSize,
      escolarizacao: selectedEducationLevels,
      faixas: selectedAgeRanges,
      contextos: selectedLifeContexts,
      profissoes: selectedProfessionalAreas,
      outrosPerfis: selectedOtherProfiles,
      salvarPerfil: saveProfile,
      nomePerfil: profileNameInput,
    };
    sessionStorage.setItem('lessonPlanProfile', JSON.stringify(classProfileData));
    router.push('/observations');
  };

  if (loadingConfigs) {
    return <p className="text-center text-gray-500 w-full">Loading configurations...</p>;
  }

  if (errorConfigs) {
    return <p className="text-center text-red-500 w-full">Error: {errorConfigs}</p>;
  }

  return (
    <>
      <PageTitle title="Personalize seu plano de aula" subtitle="Template > Aula > Perfil da turma" />

      <Navbar title="Perfil da turma" onClear={handleClear} />

      <div className="w-full px-4 py-4 flex flex-col justify-start items-start gap-4 mt-[-1rem]">
        {/* Escolher perfil salvo */}
        <div className="self-stretch px-4 bg-black/0 rounded-xl inline-flex justify-center items-center gap-2 overflow-hidden">
          <button onClick={() => setIsModalOpen(true)} className="text-blue-700 text-lg font-semibold underline cursor-pointer">Escolher perfil salvo</button>
        </div>

        {/* Tamanho */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel htmlFor="classSize">Tamanho</InputLabel>
          <TextInput
            id="classSize"
            type="number"
            placeholder="Ex: 20"
            value={classSize === null ? '' : classSize}
            onChange={(e) => setClassSize(Number(e.target.value))}
            min="1"
          />
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        <MultiSelectButtons
          label="Nível de escolarização"
          options={educationLevels}
          selectedOptions={selectedEducationLevels}
          onChange={(value) => handleMultiSelectChange(setSelectedEducationLevels, value)}
          onAddNewOption={(value) => handleAddNewOption('educationLevels', value)}
        />
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        <MultiSelectButtons
          label="Faixa etária"
          options={ageRanges}
          selectedOptions={selectedAgeRanges}
          onChange={(value) => handleMultiSelectChange(setSelectedAgeRanges, value)}
          onAddNewOption={(value) => handleAddNewOption('ageRanges', value)}
        />
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        <MultiSelectButtons
          label="Contexto de vida"
          options={lifeContexts}
          selectedOptions={selectedLifeContexts}
          onChange={(value) => handleMultiSelectChange(setSelectedLifeContexts, value)}
          onAddNewOption={(value) => handleAddNewOption('lifeContexts', value)}
        />
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        <MultiSelectButtons
          label="Área profissional"
          options={professionalAreas}
          selectedOptions={selectedProfessionalAreas}
          onChange={(value) => handleMultiSelectChange(setSelectedProfessionalAreas, value)}
          onAddNewOption={(value) => handleAddNewOption('professionalAreas', value)}
        />
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        <MultiSelectButtons
          label="Outros perfis relevantes"
          options={otherProfiles}
          selectedOptions={selectedOtherProfiles}
          onChange={(value) => handleMultiSelectChange(setSelectedOtherProfiles, value)}
          onAddNewOption={(value) => handleAddNewOption('otherProfiles', value)}
        />

        {/* Salvar perfil */}
        <div className="self-stretch py-4 inline-flex justify-start items-center gap-3">
          <input
            type="checkbox"
            id="saveProfileCheckbox"
            className="w-5 h-5 rounded-[4px] text-blue-700 border-gray-300 focus:ring-blue-700"
            checked={saveProfile}
            onChange={(e) => setSaveProfile(e.target.checked)}
          />
          <InputLabel htmlFor="saveProfileCheckbox">Salvar <span className="text-blue-600 font-semibold">Perfil de turma</span>.</InputLabel>
        </div>

        {saveProfile && (
          <div className="self-stretch flex flex-col justify-start items-start gap-2 mt-4">
            <InputLabel htmlFor="profileNameInput">Nome do perfil</InputLabel>
            <TextInput
              id="profileNameInput"
              type="text"
              placeholder="Ex: Meu Perfil de Turma"
              value={profileNameInput}
              onChange={(e) => setProfileNameInput(e.target.value)}
            />
          </div>
        )}

        <Button className="w-full mt-8" onClick={handleAdvance}>Avançar</Button>
      </div>

      <ProfileSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProfile={handleSelectProfile}
      />
    </>
  );
}