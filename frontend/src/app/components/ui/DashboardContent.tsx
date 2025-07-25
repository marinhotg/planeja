"use client";

import PageTitle from "./PageTitle";
import Button from "./Button";
import PlanCard from "./PlanCard";
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import FilterBox from "./FilterBox";
import { fetchLessonPlans, deleteLessonPlan, toggleFavorite, ParsedGeneratedContent, fetchLessonPlanById } from '@/lib/api';
import { generatePDF, PDFPlanData } from '@/lib/pdfGenerator';
import LoadingSpinner from "./LoadingSpinner";

interface DisplayPlan {
  id: string;
  title: string;
  subtitle: string;
  discipline: string;
  date: string;
  favorited: boolean; // Assuming favorited is a local state for now
}

export default function DashboardContent() {
  const [plans, setPlans] = useState<DisplayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const router = useRouter();

  const [selectedDisciplineFilter, setSelectedDisciplineFilter] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('date'); // 'name' or 'date'
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const disciplines = ['Matemática', 'Português', 'História', 'Geografia', 'Ciências', 'Artes', 'Educação Física'];

  useEffect(() => {
    const loadLessonPlans = async () => {
      try {
        setLoading(true);
        const fetchedPlans = await fetchLessonPlans();
        const displayPlans: DisplayPlan[] = fetchedPlans.map(plan => {
          let parsedContent: ParsedGeneratedContent | null = null;
          try {
            parsedContent = JSON.parse(plan.generatedContent);
          } catch (e) {
            console.error("Failed to parse generatedContent for plan", plan.id, e);
          }

          return {
            id: plan.id,
            title: parsedContent?.titulo || plan.theme, // Use parsed titulo or theme as fallback
            subtitle: plan.level, // Using level as subtitle for now
            discipline: plan.discipline,
            date: new Date(plan.generationTimestamp).toLocaleDateString(),
            favorited: plan.favorited || false,
          };
        });
        setPlans(displayPlans);
      } catch (err) {
        setError('Failed to load lesson plans.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLessonPlans();
  }, []);

  const handleView = (id: string) => {
    // Store the ID in session storage so GeneratedPlanContent can fetch it
    sessionStorage.setItem('generatedLessonPlan', JSON.stringify({ id: id }));
    router.push('/generated-plan');
  };

  const handleDownload = async (id: string) => {
    try {
      setDownloadingId(id);
      
      // Fetch the complete lesson plan data
      const lessonPlan = await fetchLessonPlanById(id);
      
      // Parse the generatedContent string into an object
      let parsedContent: ParsedGeneratedContent;
      try {
        parsedContent = JSON.parse(lessonPlan.generatedContent);
      } catch (e) {
        console.error("Failed to parse generatedContent JSON:", e);
        alert("Erro ao processar o conteúdo do plano para download.");
        return;
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

      const pdfData: PDFPlanData = {
        title: transformedPlan.title,
        discipline: lessonPlan.discipline,
        level: lessonPlan.level,
        theme: lessonPlan.theme,
        durationMinutes: lessonPlan.durationMinutes,
        quantity: lessonPlan.quantity,
        resources: lessonPlan.resources,
        sections: transformedPlan.sections,
      };

      await generatePDF(pdfData);
      alert("PDF gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lesson plan?')) {
      try {
        await deleteLessonPlan(id);
        setPlans(plans.filter(plan => plan.id !== id));
      } catch (err) {
        alert('Failed to delete lesson plan.');
        console.error(err);
      }
    }
  };

  const handleFavorite = async (id: string) => {
    try {
      const updatedPlan = await toggleFavorite(id);
      setPlans(plans.map(plan =>
        plan.id === id ? { ...plan, favorited: updatedPlan.favorited || false } : plan
      ));
    } catch (err) {
      console.error('Erro ao favoritar plano:', err);
      alert('Erro ao favoritar o plano. Tente novamente.');
    }
  };

  const handleGenerateNewPlan = () => {
    router.push('/template-selection');
  };

  const filteredAndSortedPlans = useMemo(() => {
    let filtered = plans;

    if (selectedDisciplineFilter) {
      filtered = filtered.filter(plan => plan.discipline === selectedDisciplineFilter);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(plan => plan.favorited);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  }, [plans, selectedDisciplineFilter, showFavoritesOnly, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" color="blue" className="mx-auto mb-4" />
          <p className="text-gray-600">Carregando planos de aula...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTitle title="Meus planos de aula" subtitle="" />

      <div className="w-full p-6 bg-white flex flex-col justify-start items-center gap-6">
        <Button className="w-full" onClick={handleGenerateNewPlan}>Gerar novo plano de aula</Button>
      </div>

      <div className="w-full text-center justify-center text-neutral-800 text-2xl font-bold">Planos de aula gerados anteriormente</div>

      <div className="w-full flex justify-center mb-4">
        <button onClick={() => setShowFilters(!showFilters)} className="text-blue-700 underline cursor-pointer">
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      {showFilters && (
        <FilterBox
          selectedDisciplineFilter={selectedDisciplineFilter}
          setSelectedDisciplineFilter={setSelectedDisciplineFilter}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          sortBy={sortBy}
          setSortBy={setSortBy}
          disciplines={disciplines}
        />
      )}

      <div className="flex justify-center w-full">
        {plans.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Você ainda não gerou nenhum plano de aula.</p>
            <p>Clique em <span className="text-blue-700 font-semibold cursor-pointer" onClick={handleGenerateNewPlan}>Gerar novo plano de aula</span> para começar!</p>
          </div>
        ) : filteredAndSortedPlans.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Nenhum plano encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full justify-items-center">
            {filteredAndSortedPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                id={plan.id}
                title={plan.title}
                subtitle={plan.subtitle}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onFavorite={handleFavorite}
                favorited={plan.favorited}
                isDownloading={downloadingId === plan.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
