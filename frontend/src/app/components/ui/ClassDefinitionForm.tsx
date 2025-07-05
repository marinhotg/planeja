"use client";

import { useState } from 'react';
import Image from "next/image";
import Navbar from "../layout/Navbar";
import PageTitle from "./PageTitle";
import Button from "./Button";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";

export default function ClassDefinitionForm() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedClassTheme, setSelectedClassTheme] = useState<string | null>(null);
  const [classDuration, setClassDuration] = useState<number | null>(null);
  const [classQuantity, setClassQuantity] = useState<number | null>(null);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  const disciplines = ['Matemática', 'Português', 'História', 'Geografia', 'Ciências', 'Artes', 'Educação Física'];
  const levels = ['Nível I', 'Nível II', 'Nível III'];
  const resources = [
    'Quadro e giz/lousa',
    'Projetor',
    'TV/DVD',
    'Livros',
    'Computadores',
    'Papel e canetas',
  ];

  const themesByDiscipline: { [key: string]: string[] } = {
    'Matemática': ['Álgebra', 'Geometria', 'Cálculo'],
    'Português': ['Gramática', 'Literatura', 'Redação'],
    'História': ['Antiguidade', 'Idade Média', 'Brasil Colonial'],
    'Geografia': ['Geografia Física', 'Geografia Humana', 'Cartografia'],
    'Ciências': ['Biologia', 'Química', 'Física'],
    'Artes': ['Pintura', 'Escultura', 'Música'],
    'Educação Física': ['Esportes', 'Dança', 'Saúde'],
  };

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

  return (
    <>
      <PageTitle title="Personalize seu plano de aula" subtitle="Aula" />

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

        {/* Recursos disponíveis */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <InputLabel>Recursos disponíveis</InputLabel>
          <div className="flex flex-wrap gap-2">
            {resources.map((resource) => (
              <button
                key={resource}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors duration-200 ${selectedResources.includes(resource) ? 'bg-blue-700 text-white' : 'bg-indigo-50 text-blue-600'}`}
                onClick={() => handleResourceChange(resource)}
              >
                {resource}
              </button>
            ))}
          </div>
        </div>

        <Button className="w-full mt-8">Avançar</Button>
      </div>
    </>
  );
}