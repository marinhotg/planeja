"use client";

import PageTitle from "./PageTitle";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLessonPlanById, deleteLessonPlan, GeneratedLessonPlan, ParsedGeneratedContent } from '@/lib/api';

export default function GeneratedPlanContent() {
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedLessonPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadLessonPlan = async () => {
      const storedPlan = sessionStorage.getItem('generatedLessonPlan');
      if (storedPlan) {
        const parsedPlan: GeneratedLessonPlan = JSON.parse(storedPlan);
        // Attempt to fetch from DB to get the latest, or use stored if fetch fails
        try {
          const fetchedPlan = await fetchLessonPlanById(parsedPlan.id);
          setGeneratedPlan(fetchedPlan);
        } catch (err) {
          console.warn("Failed to fetch latest lesson plan from DB, using session storage.", err);
          setGeneratedPlan(parsedPlan);
        } finally {
          setLoading(false);
        }
      } else {
        // If no plan is found, redirect back or show a message
        router.push('/observations'); // Redirect to the previous step
      }
    };
    loadLessonPlan();
  }, [router]);

  const handleDownload = () => {
    console.log("Baixar plano");
    // Implement download logic
    alert("Download functionality not yet implemented.");
  };

  const handleDelete = async () => {
    if (!generatedPlan || !generatedPlan.id) return;
    if (confirm("Are you sure you want to delete this lesson plan?")) {
      try {
        setLoading(true);
        await deleteLessonPlan(generatedPlan.id);
        alert("Lesson plan deleted successfully!");
        sessionStorage.removeItem('generatedLessonPlan'); // Clear from session storage
        router.push('/dashboard'); // Redirect to a relevant page after deletion
      } catch (err) {
        setError('Failed to delete lesson plan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFavorite = () => {
    console.log("Favoritar plano");
    // Implement favorite logic (e.g., update a field in the DB)
    alert("Favorite functionality not yet implemented.");
  };

  if (loading) {
    return <p className="text-center text-gray-500 w-full">Loading lesson plan...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 w-full">Error: {error}</p>;
  }

  if (!generatedPlan) {
    return null; // Should ideally not happen if redirected
  }

  // Parse the generatedContent string into an object
  let parsedContent: ParsedGeneratedContent;
  try {
    parsedContent = JSON.parse(generatedPlan.generatedContent);
  } catch (e) {
    console.error("Failed to parse generatedContent JSON:", e);
    setError("Failed to display lesson plan content due to parsing error.");
    return null; // Or display an error message to the user
  }

  // Transform backend response to frontend display structure
  const transformedPlan = {
    title: parsedContent.titulo,
    sections: [
      { title: "Objetivo Geral", content: parsedContent.objetivoGeral },
      { title: "Habilidades da BNCC", content: parsedContent.habilidadesTrabalhadas?.join('; ') || '' },
      { title: "Metodologia", content: parsedContent.metodologia },
      { title: "Atividades", content: parsedContent.atividades?.map((activity: { titulo: string; duracao: string; descricao: string }) => `${activity.titulo} (${activity.duracao}): ${activity.descricao}`).join('\n') || '' },
      { title: "Recursos Necessários", content: parsedContent.recursosNecessarios?.join(', ') || '' },
      { title: "Métodos de Avaliação", content: parsedContent.metodosDeAvaliacao },
    ],
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
        <h2 className="text-blue-700 text-xl font-bold mb-4">{transformedPlan.title}</h2>
        {transformedPlan.sections.map((section: { title: string; content: string }, index: number) => (
          <div key={index} className="mb-4 last:mb-0">
            <h3 className="text-blue-700 text-lg font-semibold mb-1">{section.title}:</h3>
            <p className="text-black text-base leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{section.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}