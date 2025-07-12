"use client";

import PageTitle from "./PageTitle";
import Button from "./Button";
import PlanCard from "./PlanCard";
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import FilterBox from "./FilterBox";
import { fetchLessonPlans, deleteLessonPlan, ParsedGeneratedContent } from '@/lib/api';

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
            favorited: false, // Assuming false for now, as no backend field for this
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

  const handleDownload = (id: string) => {
    console.log(`Baixar plano ${id}`);
    alert("Download functionality not yet implemented.");
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

  const handleFavorite = (id: string) => {
    console.log(`Favoritar plano ${id}`);
    // For now, favorited is a local state. If persistence is needed, update backend.
    setPlans(plans.map(plan =>
      plan.id === id ? { ...plan, favorited: !plan.favorited } : plan
    ));
    alert("Favorite functionality is local only. Not persisted to backend.");
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
    return <p className="text-center text-gray-500 w-full">Loading lesson plans...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 w-full">Error: {error}</p>;
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
            />
          ))}
        </div>
      </div>
    </>
  );
}
