"use client";

import { useState } from 'react';
import Navbar from "../layout/Navbar";
import PageTitle from "./PageTitle";
import Button from "./Button";
import { useRouter } from 'next/navigation';
import { generateLessonPlan } from '@/lib/api';

export default function ObservationsForm() {
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClear = () => {
    setObservations('');
  };

  const handleAdvance = async () => {
    setLoading(true);
    try {
      const definitionData = JSON.parse(sessionStorage.getItem('lessonPlanDefinition') || '{}');
      const profileData = JSON.parse(sessionStorage.getItem('lessonPlanProfile') || '{}');

      const lessonPlanRequest = {
        ...definitionData,
        ...profileData,
        observacoes: observations,
      };

      const generatedPlan = await generateLessonPlan(lessonPlanRequest);
      sessionStorage.setItem('generatedLessonPlan', JSON.stringify(generatedPlan));
      router.push('/generated-plan');
    } catch (error) {
      alert('Erro ao gerar plano de aula. Por favor, tente novamente.');
      console.error('Failed to generate lesson plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Personalize seu plano de aula" subtitle="Template > Aula > Perfil da turma > Observações" />

      <Navbar title="Observações" onClear={handleClear} />

      <div className="w-full px-4 py-6 flex flex-col justify-start items-start gap-4">
        {/* Campo de Observações */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <textarea
            id="observations"
            className="w-full h-36 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:focus:ring-blue-700 placeholder-gray-500"
            placeholder="Inserção livre de informações que o professor considera importantes (ex: necessidades específicas de alunos, limitações do espaço físico, sugestões pessoais)"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>

        <Button className="w-full mt-8" onClick={handleAdvance} disabled={loading}>
          {loading ? 'Gerando plano...' : 'Avançar'}
        </Button>
      </div>
    </>
  );
}