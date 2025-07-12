"use client";

import PageTitle from "./PageTitle";
import Image from "next/image";
import { useState } from 'react';

export default function GeneratedPlanContent() {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState({
    id: "mock-plan-123", // Mock ID for API call
    type: "resumido",
    title: "Plano de Aula: Introdução à Álgebra",
    sections: [
      {
        title: "Turma",
        content: "Nível II",
      },
      {
        title: "Objetivo geral",
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
        title: "Metodologia",
        content: "blablabla",
      },
      {
        title: "Atividades",
        content: "blablabla",
      },
      {
        title: "Método de avaliação",
        content: "blablabla",
      },
      {
        title: "Recursos Necessários",
        content: "Quadro e giz/lousa, Livros didáticos, Cadernos e canetas.",
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
    // Implement feedback submit logic

    setIsFeedbackSubmitted(true);
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

      <div className="w-full p-6 bg-gray-50 mt-6">
        {isFeedbackSubmitted ? (
          <div className="w-full p-4 bg-green-100 rounded-md">
          <p className="text-center text-green-800 font-medium">Você enviou sua avaliação. Obrigado pelo feedback!</p>
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