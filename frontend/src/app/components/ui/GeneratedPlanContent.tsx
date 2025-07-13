"use client";

import PageTitle from "./PageTitle";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLessonPlanById, deleteLessonPlan, toggleFavorite, GeneratedLessonPlan, ParsedGeneratedContent, submitFeedback } from '@/lib/api';

export default function GeneratedPlanContent() {
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedLessonPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // State for feedback
  const [rating, setRating] = useState(0); // Initialize with 0 or null, not 4
  const [comment, setComment] = useState("");
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const loadLessonPlan = async () => {
      const storedPlan = sessionStorage.getItem('generatedLessonPlan');
      console.log("useEffect: storedPlan from sessionStorage", storedPlan);

      if (storedPlan) {
        const parsedPlan: GeneratedLessonPlan = JSON.parse(storedPlan);
        console.log("useEffect: parsedPlan from sessionStorage", parsedPlan);

        // Attempt to fetch from DB to get the latest, or use stored if fetch fails
        try {
          const fetchedPlan = await fetchLessonPlanById(parsedPlan.id);
          console.log("useEffect: fetchedPlan from DB", fetchedPlan);
          setGeneratedPlan(fetchedPlan);
          // Check if feedback already exists in fetched plan
          if (fetchedPlan.rating !== null && fetchedPlan.rating !== undefined) {
            setRating(fetchedPlan.rating);
            setComment(fetchedPlan.feedbackText || "");
            setIsFeedbackSubmitted(true);
            console.log("useEffect: Feedback found in DB fetched plan. isFeedbackSubmitted set to true.", { rating: fetchedPlan.rating, feedbackText: fetchedPlan.feedbackText });
          } else {
            setRating(0);
            setComment("");
            setIsFeedbackSubmitted(false);
            console.log("useEffect: No feedback found in DB fetched plan. isFeedbackSubmitted set to false.");
          }
        } catch (err) {
          console.warn("Failed to fetch latest lesson plan from DB, using session storage.", err);
          setGeneratedPlan(parsedPlan);
          // If using stored, check its feedback
          if (parsedPlan.rating !== null && parsedPlan.rating !== undefined) {
            setRating(parsedPlan.rating);
            setComment(parsedPlan.feedbackText || "");
            setIsFeedbackSubmitted(true);
            console.log("useEffect: Feedback found in sessionStorage parsed plan. isFeedbackSubmitted set to true.", { rating: parsedPlan.rating, feedbackText: parsedPlan.feedbackText });
          } else {
            setRating(0);
            setComment("");
            setIsFeedbackSubmitted(false);
            console.log("useEffect: No feedback found in sessionStorage parsed plan. isFeedbackSubmitted set to false.");
          }
        } finally {
          setLoading(false);
          console.log("useEffect: Loading finished.");
        }
      } else {
        console.log("useEffect: No plan found in sessionStorage. Redirecting.");
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

  const handleFavorite = async () => {
    if (!generatedPlan || !generatedPlan.id) return;
    
    try {
      const updatedPlan = await toggleFavorite(generatedPlan.id);
      setGeneratedPlan(updatedPlan);
      // Update session storage with the updated plan
      sessionStorage.setItem('generatedLessonPlan', JSON.stringify(updatedPlan));
    } catch (err) {
      console.error('Erro ao favoritar plano:', err);
      alert('Erro ao favoritar o plano. Tente novamente.');
    }
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

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      alert("Por favor, selecione uma nota antes de avaliar.");
      return;
    }

    const feedbackData = {
      planId: generatedPlan.id,
      rating,
      comment,
    };

    console.log("Enviando feedback:", feedbackData);
    try {
      await submitFeedback(feedbackData);
      alert("Feedback enviado com sucesso!");
      // Update the local state and session storage with the new feedback
      const updatedPlan = { ...generatedPlan, rating, feedbackText: comment };
      setGeneratedPlan(updatedPlan);
      sessionStorage.setItem('generatedLessonPlan', JSON.stringify(updatedPlan));
      setIsFeedbackSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      alert("Erro ao enviar feedback. Por favor, tente novamente.");
    }
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
          <Image src={generatedPlan.favorited ? "/filled-heart.svg" : "/heart.svg"} alt="Favoritar" width={16} height={16} />
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

      <div className="w-full p-6 bg-gray-50 mt-6">
        {isFeedbackSubmitted ? (
          <div className="w-full p-4 bg-green-100 rounded-md">
            <p className="text-center text-green-800 font-medium mb-2">Você já avaliou este plano. Obrigado pelo feedback!</p>
            <div className="flex items-center justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  key={star}
                  src={star <= rating ? "/filled-star.svg" : "/star.svg"}
                  alt={`${star} star`}
                  width={24}
                  height={24}
                  className="mx-0.5"
                />
              ))}
            </div>
            {comment && <p className="text-center text-gray-700 text-sm">Comentário: {comment}</p>}
          </div>
        ) : (
          <>
            <h2 className="text-blue-700 text-xl font-bold mb-4">Avalie este plano de aula</h2>
            <div className="flex items-center mb-4">
              <span className="text-black text-base mr-2">Sua nota:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="w-6 h-6 relative mr-1">
                    <Image src={star <= rating ? "/filled-star.svg" : "/star.svg"} alt={`${star} star`} layout="fill" />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Deixe seu comentário..."
              className="w-full h-24 p-2 border border-gray-300 rounded-md mb-4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button
              onClick={handleFeedbackSubmit}
              className="w-full bg-blue-700 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-800"
            >
              Avaliar
            </button>
          </>
        )}
      </div>
    </>
  );
}