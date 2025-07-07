"use client";

import PageTitle from "./PageTitle";
import Image from "next/image";
import { useState } from 'react';

export default function GeneratedPlanContent() {
  const [generatedPlan, setGeneratedPlan] = useState({
    type: "resumido",
    title: "Plano de Aula: Introdução à Álgebra",
    sections: [
      {
        title: "Turma",
        content: "Nível II",
      },
      {
        title: "Objetivo",
        content: "Introduzir os conceitos fundamentais de álgebra, incluindo variáveis, expressões e equações simples.",
      },
      {
        title: "Habilidades da BNCC",
        content: "Matemática - Álgebra: (EF07MA01) Compreender o conceito de variável e a representação de expressões algébricas.",
      },
      {
        title: "Conteúdo resumido",
        content: "Variáveis e constantes; Expressões algébricas; Equações do 1º grau (introdução).",
      },
      {
        title: "Duração e Recursos Necessários",
        content: "Duração: 50 minutos. Recursos: Quadro e giz/lousa, Livros didáticos, Cadernos e canetas.",
      },
    ],
  });

  const handleDownload = () => {
    console.log("Baixar plano");
    // Implement download logic
  };

  const handleDelete = () => {
    console.log("Deletar plano");
    // Implement delete logic
  };

  const handleFavorite = () => {
    console.log("Favoritar plano");
    // Implement favorite logic
  };

  return (
    <>
      <PageTitle title="Personalize seu plano de aula" subtitle="" />

      <div className="w-full h-14 relative bg-white flex justify-center items-center">
        <h1 className="text-neutral-800 text-2xl font-bold text-center">Resultado do plano de aula gerado</h1>
      </div>

      <div className="w-full flex justify-center items-center gap-6 mb-4">
        <button onClick={handleDownload} className="w-9 h-9 relative bg-sky-100 rounded-[100px] flex justify-center items-center cursor-pointer hover:bg-sky-200">
          <Image src="/download.svg" alt="Baixar" width={16} height={16} />
        </button>
        <button onClick={handleDelete} className="w-9 h-9 relative bg-sky-100 rounded-[100px] flex justify-center items-center cursor-pointer hover:bg-sky-200">
          <Image src="/trash.svg" alt="Deletar" width={16} height={16} />
        </button>
        <button onClick={handleFavorite} className="w-9 h-9 relative bg-sky-100 rounded-[100px] flex justify-center items-center cursor-pointer hover:bg-sky-200">
          <Image src="/heart.svg" alt="Favoritar" width={16} height={16} />
        </button>
      </div>

      <div className="w-full p-6 bg-gray-50 min-h-[300px] overflow-y-auto">
        <h2 className="text-blue-700 text-xl font-bold mb-4">{generatedPlan.title}</h2>
        {generatedPlan.sections.map((section, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <h3 className="text-blue-700 text-lg font-semibold mb-1">{section.title}:</h3>
            <p className="text-black text-base leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}