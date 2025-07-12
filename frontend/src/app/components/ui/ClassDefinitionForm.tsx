"use client";

import { useState, useEffect } from 'react';
import Navbar from "../layout/Navbar";
import PageTitle from "./PageTitle";
import Button from "./Button";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import { useRouter } from 'next/navigation';
import { fetchConfigurations, ConfigurationResponse } from '@/lib/api';

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
  const themesByDiscipline = configurations?.themesByDiscipline || {};

  const handleResourceChange = (resource: string) => {
    setSelectedResources((prev) =>
      prev.includes(resource) ? prev.filter((r) => r !== resource) : [...prev, resource]
    );
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
    return <p className="text-center text-gray-500 w-full">Loading configurations...</p>;
  }

  if (errorConfigs) {
    return <p className="text-center text-red-500 w-full">Error: {errorConfigs}</p>;
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
              <option value="" className="text-gray-500">Selecione um nível</option>
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
          <div className="relative w-full">
            <select
              id="classTheme"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={selectedClassTheme || ''}
              onChange={(e) => setSelectedClassTheme(e.target.value)}
              disabled={!selectedDiscipline} // Disable if no discipline is selected
            >
              <option value="" className="text-gray-500">{selectedDiscipline ? 'Selecione um tema' : 'Selecione uma disciplina primeiro'}</option>
              {selectedDiscipline && themesByDiscipline[selectedDiscipline]?.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
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
            onChange={(e) => setClassDuration(Number(e.target.value))}
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
            onChange={(e) => setClassQuantity(Number(e.target.value))}
            min="1"
          />
        </div>
        <div className="self-stretch border-b border-gray-200 my-2"></div>

        {/* Recursos disponíveis */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel>Recursos disponíveis</InputLabel>
          <div className="flex flex-wrap gap-2">
            {resources.map((resource) => (
              <button
                key={resource}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors duration-200 hover:bg-blue-100 cursor-pointer ${selectedResources.includes(resource) ? 'bg-blue-700 text-white' : 'bg-indigo-50 text-blue-600'}`}
                onClick={() => handleResourceChange(resource)}
              >
                {resource}
              </button>
            ))}
          </div>
        </div>

      <Button className="w-full mt-8" onClick={handleAdvance}>Avançar</Button>
      </div>
    </>
  );
}