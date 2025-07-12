"use client";

import PageTitle from "./PageTitle";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneratedPlanContent() {
  const [generatedPlan, setGeneratedPlan] = useState<{
    title: string;
    sections: { title: string; content: string }[];
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedPlan = sessionStorage.getItem('generatedLessonPlan');
    if (storedPlan) {
      const parsedPlan = JSON.parse(storedPlan);
      // Transform backend response to frontend display structure
      const transformedPlan = {
        title: parsedPlan.titulo,
        sections: [
          { title: "Objetivo Geral", content: parsedPlan.objetivoGeral },
          { title: "Habilidades da BNCC", content: parsedPlan.habilidadesTrabalhadas.join('; ') },
          { title: "Metodologia", content: parsedPlan.metodologia },
          { title: "Atividades", content: parsedPlan.atividades.map((activity: { titulo: string; duracao: string; descricao: string }) => `${activity.titulo} (${activity.duracao}): ${activity.descricao}`).join('\n') },
          { title: "Recursos Necessários", content: parsedPlan.recursosNecessarios.join(', ') },
          { title: "Métodos de Avaliação", content: parsedPlan.metodosDeAvaliacao },
        ],
      };
      setGeneratedPlan(transformedPlan);
    } else {
      // If no plan is found, redirect back or show a message
      router.push('/observations'); // Redirect to the previous step
    }
  }, [router]);

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

  if (!generatedPlan) {
    return null; // Or a loading spinner
  }

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
        {generatedPlan.sections.map((section: { title: string; content: string }, index: number) => (
          <div key={index} className="mb-4 last:mb-0">
            <h3 className="text-blue-700 text-lg font-semibold mb-1">{section.title}:</h3>
            <p className="text-black text-base leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{section.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}