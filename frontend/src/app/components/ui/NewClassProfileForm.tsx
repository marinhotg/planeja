"use client";

import { useState, useEffect } from 'react';
import Navbar from '../layout/Navbar';
import PageTitle from './PageTitle';
import Button from './Button';
import InputLabel from './InputLabel';
import TextInput from './TextInput';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClassProfile, updateClassProfile, fetchClassProfileById, ClassProfileRequest, fetchConfigurations, ConfigurationResponse } from '@/lib/api';

export default function NewClassProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = searchParams.get('id');

  const [profileName, setProfileName] = useState('');
  const [classSize, setClassSize] = useState<number | null>(null);
  const [selectedEducationLevels, setSelectedEducationLevels] = useState<string[]>([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  const [selectedLifeContexts, setSelectedLifeContexts] = useState<string[]>([]);
  const [selectedProfessionalAreas, setSelectedProfessionalAreas] = useState<string[]>([]);
  const [selectedOtherProfiles, setSelectedOtherProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configurations, setConfigurations] = useState<ConfigurationResponse | null>(null); // Store fetched configurations
  const [loadingConfigs, setLoadingConfigs] = useState(true);
  const [errorConfigs, setErrorConfigs] = useState<string | null>(null);

  // Mock user ID for now - replace with actual authenticated user ID
  const MOCK_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"; 

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

  useEffect(() => {
    if (profileId) {
      const loadProfile = async () => {
        try {
          setLoading(true);
          const profile = await fetchClassProfileById(profileId);
          setProfileName(profile.profileName);
          setClassSize(profile.size || null);
          setSelectedEducationLevels(profile.educationLevels || []);
          setSelectedAgeRanges(profile.ageRanges || []);
          setSelectedLifeContexts(profile.lifeContexts || []);
          setSelectedProfessionalAreas(profile.professionalAreas || []);
          setSelectedOtherProfiles(profile.otherProfiles || []);
        } catch (err) {
          setError('Failed to load profile for editing.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadProfile();
    }
  }, [profileId]);

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

  const handleClear = () => {
    setProfileName('');
    setClassSize(null);
    setSelectedEducationLevels([]);
    setSelectedAgeRanges([]);
    setSelectedLifeContexts([]);
    setSelectedProfessionalAreas([]);
    setSelectedOtherProfiles([]);
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      alert("Please enter a profile name.");
      return;
    }

    setLoading(true);
    setError(null);

    const profileData: ClassProfileRequest = {
      userId: MOCK_USER_ID,
      profileName,
      size: classSize || undefined,
      educationLevels: selectedEducationLevels.length > 0 ? selectedEducationLevels : undefined,
      ageRanges: selectedAgeRanges.length > 0 ? selectedAgeRanges : undefined,
      lifeContexts: selectedLifeContexts.length > 0 ? selectedLifeContexts : undefined,
      professionalAreas: selectedProfessionalAreas.length > 0 ? selectedProfessionalAreas : undefined,
      otherProfiles: selectedOtherProfiles.length > 0 ? selectedOtherProfiles : undefined,
    };

    try {
      if (profileId) {
        await updateClassProfile(profileId, profileData);
        alert("Profile updated successfully!");
      } else {
        await createClassProfile(profileData);
        alert("Profile created successfully!");
      }
      router.push('/manage-class-profiles');
    } catch (err) {
      setError('Failed to save profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navbarTitle = profileId ? "Editar perfil" : "Novo perfil";

  if (loadingConfigs || (loading && profileId)) {
    return <p className="text-center text-gray-500 w-full">Loading...</p>;
  }

  if (errorConfigs || error) {
    return <p className="text-center text-red-500 w-full">Error: {errorConfigs || error}</p>;
  }

  return (
    <>
      <PageTitle title="Gerenciar perfis de turma" subtitle="" />

      <Navbar title={navbarTitle} onClear={handleClear} />

      <div className="w-full px-4 py-4 flex flex-col justify-start items-start gap-4 mt-[-1rem]">
        {/* Nome do Perfil */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel htmlFor="profileName">Nome do Perfil</InputLabel>
          <TextInput
            id="profileName"
            type="text"
            placeholder="Ex: Turma EJA Noturno"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

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
            disabled={loading}
          />
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        {/* Nível de escolarização */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel>Nível de escolarização</InputLabel>
          <div className="flex flex-wrap gap-2">
            {educationLevels.map((level) => (
              <button
                key={level}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors duration-200 hover:bg-blue-100 cursor-pointer ${selectedEducationLevels.includes(level) ? 'bg-blue-700 text-white' : 'bg-indigo-50 text-blue-600'}`}
                onClick={() => handleMultiSelectChange(setSelectedEducationLevels, level)}
                disabled={loading}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        {/* Faixa etária */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel>Faixa etária</InputLabel>
          <div className="flex flex-wrap gap-2">
            {ageRanges.map((range) => (
              <button
                key={range}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors duration-200 hover:bg-blue-100 cursor-pointer ${selectedAgeRanges.includes(range) ? 'bg-blue-700 text-white' : 'bg-indigo-50 text-blue-600'}`}
                onClick={() => handleMultiSelectChange(setSelectedAgeRanges, range)}
                disabled={loading}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        {/* Contexto de vida */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel>Contexto de vida</InputLabel>
          <div className="flex flex-wrap gap-2">
            {lifeContexts.map((context) => (
              <button
                key={context}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors duration-200 hover:bg-blue-100 cursor-pointer ${selectedLifeContexts.includes(context) ? 'bg-blue-700 text-white' : 'bg-indigo-50 text-blue-600'}`}
                onClick={() => handleMultiSelectChange(setSelectedLifeContexts, context)}
                disabled={loading}
              >
                {context}
              </button>
            ))}
          </div>
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        {/* Área profissional */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel>Área profissional</InputLabel>
          <div className="flex flex-wrap gap-2">
            {professionalAreas.map((area) => (
              <button
                key={area}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors duration-200 hover:bg-blue-100 cursor-pointer ${selectedProfessionalAreas.includes(area) ? 'bg-blue-700 text-white' : 'bg-indigo-50 text-blue-600'}`}
                onClick={() => handleMultiSelectChange(setSelectedProfessionalAreas, area)}
                disabled={loading}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        {/* Outros perfis relevantes */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel>Outros perfis relevantes</InputLabel>
          <div className="flex flex-wrap gap-2">
            {otherProfiles.map((profile) => (
              <button
                key={profile}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors duration-200 hover:bg-blue-100 cursor-pointer ${selectedOtherProfiles.includes(profile) ? 'bg-blue-700 text-white' : 'bg-indigo-50 text-blue-600'}`}
                onClick={() => handleMultiSelectChange(setSelectedOtherProfiles, profile)}
                disabled={loading}
              >
                {profile}
              </button>
            ))}
          </div>
        </div>

        <Button className="w-full mt-8" onClick={handleSaveProfile} disabled={loading}>
          {loading ? (profileId ? 'Updating...' : 'Creating...') : 'Salvar'}
        </Button>
      </div>
    </>
  );
}