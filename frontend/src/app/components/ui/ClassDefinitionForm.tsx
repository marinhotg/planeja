"use client";

import { useState, useEffect } from 'react';
import Navbar from "../layout/Navbar";
import PageTitle from "./PageTitle";
import Button from "./Button";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import { useRouter } from 'next/navigation';
import { fetchConfigurations, ConfigurationResponse } from '@/lib/api';
import MultiSelectButtons from "./MultiSelectButtons";
import LoadingSpinner from "./LoadingSpinner";

export default function ClassDefinitionForm() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedClassTheme, setSelectedClassTheme] = useState<string | null>(null);
  const [classDuration, setClassDuration] = useState<number | null>(null);
  const [classQuantity, setClassQuantity] = useState<number | null>(null);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [configurations, setConfigurations] = useState<ConfigurationResponse | null>(null); // Store fetched configurations
  const [loadingConfigs, setLoadingConfigs] = useState(true);
  const [errorConfigs, setErrorConfigs] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

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

  const disciplines = configurations?.disciplines || [];
  const levels = configurations?.levels || [];
  const resources = configurations?.resources || [];

  const handleResourceChange = (resource: string) => {
    setSelectedResources((prev) =>
      prev.includes(resource) ? prev.filter((r) => r !== resource) : [...prev, resource]
    );
  };

  const handleAddNewResource = (resource: string) => {
    if (configurations) {
      const newResources = [...configurations.resources, resource];
      setConfigurations({ ...configurations, resources: newResources });
      setSelectedResources([...selectedResources, resource]);
    }
  };

  const handleClear = () => {
    setSelectedDiscipline(null);
    setSelectedLevel(null);
    setSelectedClassTheme(null);
    setClassDuration(null);
    setClassQuantity(null);
    setSelectedResources([]);
  };

  const handleAdvance = () => {
    if (
      !selectedDiscipline ||
      !selectedLevel ||
      !selectedClassTheme ||
      !classDuration ||
      classDuration <= 0 ||
      !classQuantity ||
      classQuantity <= 0
    ) {
      setFormError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setFormError(null);

    const classDefinitionData = {
      disciplina: selectedDiscipline,
      nivel: selectedLevel,
      tema: selectedClassTheme,
      duracao: classDuration,
      quantidade: classQuantity,
      recursos: selectedResources,
    };
    sessionStorage.setItem('lessonPlanDefinition', JSON.stringify(classDefinitionData));
    router.push('/class-profile');
  };

  if (loadingConfigs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" color="blue" className="mx-auto mb-4" />
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (errorConfigs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro: {errorConfigs}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTitle title="Personalize seu plano de aula" subtitle="Template   >   Aula" />

      <Navbar title="Detalhes da aula" onClear={handleClear} />

      <div className="w-full px-4 py-6 flex flex-col justify-start items-start gap-4">
        {/* Disciplina */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel htmlFor="discipline">Disciplina</InputLabel>
          <div className="relative w-full">
            <select
              id="discipline"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={selectedDiscipline || ''}
              onChange={(e) => {
                setSelectedDiscipline(e.target.value);
                setSelectedClassTheme(null); // Reset theme when discipline changes
              }}
            >
              <option value="" className="text-gray-500">Selecione uma disciplina</option>
              {disciplines.map((discipline) => (
                <option key={discipline} value={discipline}>
                  {discipline}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        {/* Nível */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel htmlFor="level">Nível</InputLabel>
          <div className="relative w-full">
            <select
              id="level"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={selectedLevel || ''}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="" className="text-gray-500">Selecione um nível educacional</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        {/* Tema da aula */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel htmlFor="classTheme">Tema da aula</InputLabel>
          <TextInput
            id="classTheme"
            type="text"
            placeholder="Ex: Operações básicas, Gramática, História do Brasil..."
            value={selectedClassTheme || ''}
            onChange={(e) => setSelectedClassTheme(e.target.value)}
          />
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        {/* Duração da aula */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel htmlFor="classDuration">Duração da aula (minutos)</InputLabel>
          <TextInput
            id="classDuration"
            type="number"
            placeholder="Ex: 50"
            value={classDuration === null ? '' : classDuration}
            onChange={(e) => setClassDuration(e.target.value === '' ? null : Number(e.target.value))}
            min="0"
          />
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        {/* Quantidade de aulas */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel htmlFor="classQuantity">Quantidade de aulas</InputLabel>
          <TextInput
            id="classQuantity"
            type="number"
            placeholder="Ex:2"
            value={classQuantity === null ? '' : classQuantity}
            onChange={(e) => setClassQuantity(e.target.value === '' ? null : Number(e.target.value))}
            min="1"
          />
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        <MultiSelectButtons
          label="Recursos disponíveis"
          options={resources}
          selectedOptions={selectedResources}
          onChange={handleResourceChange}
          onAddNewOption={handleAddNewResource}
        />

        <div className="w-full">
          {formError && <p className="text-red-500 text-sm mb-8 text-center">{formError}</p>}
          <Button className="w-full" onClick={handleAdvance}>Avançar</Button>
        </div>
      </div>
    </>
  );
}