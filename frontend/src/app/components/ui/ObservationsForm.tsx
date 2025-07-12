"use client";

import { useState } from 'react';
import Navbar from "../layout/Navbar";
import PageTitle from "./PageTitle";
import Button from "./Button";
import { useRouter } from 'next/navigation';
import { generateLessonPlan, saveLessonPlan, LessonPlanRequest, GeneratedLessonPlan } from '@/lib/api';
import { useSession } from 'next-auth/react';

export default function ObservationsForm() {
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleClear = () => {
    setObservations('');
  };

  const handleAdvance = async () => {
    setLoading(true);
    try {
      if (!session || !session.user || !session.user.id) {
        throw new Error("User not authenticated.");
      }

      const definitionData = JSON.parse(sessionStorage.getItem('lessonPlanDefinition') || '{}');
      const profileData = JSON.parse(sessionStorage.getItem('lessonPlanProfile') || '{}');

      const lessonPlanRequest: LessonPlanRequest = {
        ...definitionData,
        ...profileData,
        observacoes: observations,
        userId: session.user.id, // Add userId here
      };

      const generatedPlan = await generateLessonPlan(lessonPlanRequest);
      
      const lessonPlanToSave: GeneratedLessonPlan = {
        ...generatedPlan,
        userId: session.user.id, 
        classProfileId: generatedPlan.classProfileId || undefined,
        classSize: generatedPlan.classSize || undefined,
        educationLevels: generatedPlan.educationLevels || [],
        ageRanges: generatedPlan.ageRanges || [],
        lifeContexts: generatedPlan.lifeContexts || [],
        professionalAreas: generatedPlan.professionalAreas || [],
        otherProfiles: generatedPlan.otherProfiles || [],
        generatedContent: generatedPlan.generatedContent, // Correctly assign the already stringified content
      };

      const savedLessonPlan = await saveLessonPlan(lessonPlanToSave);
      
      sessionStorage.setItem('generatedLessonPlan', JSON.stringify(savedLessonPlan));
      router.push('/generated-plan');
    } catch (error) {
      alert('Erro ao gerar ou salvar plano de aula. Por favor, tente novamente.');
      console.error('Failed to generate or save lesson plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Personalize seu plano de aula" subtitle="Template > Aula > Perfil da turma > Observações" />

      <Navbar title="Observações" onClear={handleClear} />

      <div className="w-full px-4 py-6 flex flex-col justify-start items-start gap-4">
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
