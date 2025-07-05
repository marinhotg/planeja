"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Navbar from "../layout/Navbar";
import PageTitle from "./PageTitle";
import Button from "./Button";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import { useRouter, useSearchParams } from 'next/navigation';

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

  const educationLevels = [
    'Reintegração escolar',
    'Multissérie',
    'Interesse em temas práticos',
    'Alfabetização',
    'Experiência com tecnologia',
  ];

  const ageRanges = [
    'Jovens (15 a 24 anos)',
    'Adultos (25 a 59 anos)',
    'Idosos (60+ anos)',
  ];

  const lifeContexts = [
    'Trabalhadores noturnos',
    'Desempregados',
    'Mães',
    'Pais',
    'Cuidadores familiares',
    'Migrantes/recém-chegados',
  ];

  const professionalAreas = [
    'Comércio e Vendas',
    'Construção Civil',
    'Transporte e Logística',
    'Serviços Gerais',
    'Alimentação',
    'Agricultura',
    'Cuidado e Saúde',
    'Administração / Escritório',
  ];

  const otherProfiles = [
    'Pessoas com deficiência',
    'Povos originários',
    'Pessoas privadas de liberdade',
    'Refugiados',
    'Estrangeiros',
  ];

  // Mock data for editing
  useEffect(() => {
    if (profileId) {
      // In a real application, you would fetch profile data here
      const mockProfile = {
        name: "Turma de Edição",
        size: 22,
        education: ['Alfabetização'],
        age: ['Adultos (25 a 59 anos)'],
        life: ['Trabalhadores noturnos'],
        professional: ['Comércio e Vendas'],
        other: ['Refugiados'],
      };
      setProfileName(mockProfile.name);
      setClassSize(mockProfile.size);
      setSelectedEducationLevels(mockProfile.education);
      setSelectedAgeRanges(mockProfile.age);
      setSelectedLifeContexts(mockProfile.life);
      setSelectedProfessionalAreas(mockProfile.professional);
      setSelectedOtherProfiles(mockProfile.other);
    }
  }, [profileId]);

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

  const handleSaveProfile = () => {
    console.log("Salvar/Atualizar perfil:", {
      profileId,
      profileName,
      classSize,
      selectedEducationLevels,
      selectedAgeRanges,
      selectedLifeContexts,
      selectedProfessionalAreas,
      selectedOtherProfiles,
    });
    // Implement save/update logic
    router.push('/manage-class-profiles');
  };

  const pageTitle = profileId ? "Editar Perfil de Turma" : "Criar Novo Perfil de Turma";
  const navbarTitle = profileId ? "Editar Perfil" : "Novo Perfil";

  return (
    <>
      <PageTitle title={pageTitle} subtitle="" />

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
              >
                {profile}
              </button>
            ))}
          </div>
        </div>

        <Button className="w-full mt-8" onClick={handleSaveProfile}>Salvar Perfil</Button>
      </div>
    </>
  );
}