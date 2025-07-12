"use client";

import Image from "next/image";
import Navbar from "../layout/Navbar";
import PageTitle from "./PageTitle";
import { useState } from 'react';
import Button from "./Button";
import { useRouter } from 'next/navigation';

export default function TemplateSelectionForm() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTemplateClick = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleAdvance = () => {
    if (!selectedTemplate) {
      setError("Por favor, selecione um template para avançar.");
      return;
    }
    // Logic to save selected template if needed
    router.push('/class-definition');
  };

  return (
    <>
      <PageTitle title="Personalize seu plano de aula" subtitle="Template" />

      <Navbar onClear={() => setSelectedTemplate(null)} title="Escolha um template" />

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 w-full">
        {/* Template Resumido */}
        <div
          className={`flex-1 bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 border-2 ${selectedTemplate === 'resumido' ? 'border-blue-700' : 'border-transparent'} hover:border-blue-700 cursor-pointer transition-all duration-200`}
          onClick={() => handleTemplateClick('resumido')}
        >
          <h2 className="text-blue-900 text-2xl font-bold text-center">Plano de aula resumido</h2>
          <ul className="list-none space-y-2">
            <li className="flex items-center text-blue-700">
              <Image src="/checkmark-icon.svg" alt="Check" width={16} height={16} className="mr-2" />
              Objetivo geral
            </li>
            <li className="flex items-center text-blue-700">
              <Image src="/checkmark-icon.svg" alt="Check" width={16} height={16} className="mr-2" />
              Habilidades da BNCC
            </li>
            <li className="flex items-center text-blue-700">
              <Image src="/checkmark-icon.svg" alt="Check" width={16} height={16} className="mr-2" />
              Conteúdo resumido
            </li>
            <li className="flex items-center text-blue-700">
              <Image src="/checkmark-icon.svg" alt="Check" width={16} height={16} className="mr-2" />
              Duração e recursos necessários
            </li>
          </ul>
        </div>

        {/* Template Detalhado */}
        <div
          className={`flex-1 bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 border-2 ${selectedTemplate === 'detalhado' ? 'border-blue-700' : 'border-transparent'} hover:border-blue-700 cursor-pointer transition-all duration-200`}
          onClick={() => handleTemplateClick('detalhado')}
        >
          <h2 className="text-blue-900 text-2xl font-bold text-center">Plano de aula detalhado</h2>
          <ul className="list-none space-y-2">
            <li className="flex items-center text-blue-700">
              <Image src="/checkmark-icon.svg" alt="Check" width={16} height={16} className="mr-2" />
              Objetivo geral
            </li>
            <li className="flex items-center text-blue-700">
              <Image src="/checkmark-icon.svg" alt="Check" width={16} height={16} className="mr-2" />
              Habilidades da BNCC
            </li>
            <li className="flex items-center text-blue-700">
              <Image src="/checkmark-icon.svg" alt="Check" width={16} height={16} className="mr-2" />
              Conteúdo completo
            </li>
            <li className="flex items-center text-blue-700">
              <Image src="/checkmark-icon.svg" alt="Check" width={16} height={16} className="mr-2" />
              Metodologia sugerida
            </li>
            <li className="flex items-center text-blue-700">
              <Image src="/checkmark-icon.svg" alt="Check" width={16} height={16} className="mr-2" />
              Critérios de avaliação
            </li>
            <li className="flex items-center text-blue-700">
              <Image src="/checkmark-icon.svg" alt="Check" width={16} height={16} className="mr-2" />
              Duração e recursos necessários
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full">
        {error && <p className="text-red-500 text-sm mb-8 text-center">{error}</p>}
        <Button className="w-full" onClick={handleAdvance}>Avançar</Button>
      </div>
    </>
  );
}