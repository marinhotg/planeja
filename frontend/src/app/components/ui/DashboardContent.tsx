"use client";

import Image from "next/image";
import PageTitle from "./PageTitle";
import Button from "./Button";
import PlanCard from "./PlanCard";
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import InputLabel from "./InputLabel";
import FilterBox from "./FilterBox";

export default function DashboardContent() {
  // Mock data for demonstration
  const [plans, setPlans] = useState([
    { id: 1, title: 'Plano de Matemática - Nível I', subtitle: 'Álgebra', discipline: 'Matemática', date: '2024-01-15', favorited: false },
    { id: 2, title: 'Plano de Português - Nível II', subtitle: 'Gramática', discipline: 'Português', date: '2024-02-20', favorited: true },
    { id: 3, title: 'Plano de História - Nível III', subtitle: 'Antiguidade', discipline: 'História', date: '2024-03-10', favorited: false },
    { id: 4, title: 'Plano de Ciências - Nível I', subtitle: 'Biologia', discipline: 'Ciências', date: '2024-04-05', favorited: true },
    { id: 5, title: 'Plano de Artes - Nível II', subtitle: 'Pintura', discipline: 'Artes', date: '2024-05-01', favorited: false },
    { id: 6, title: 'Plano de Educação Física - Nível III', subtitle: 'Esportes', discipline: 'Educação Física', date: '2024-06-12', favorited: false },
  ]);

  const router = useRouter();

  const [selectedDisciplineFilter, setSelectedDisciplineFilter] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('date'); // 'name' or 'date'
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const disciplines = ['Matemática', 'Português', 'História', 'Geografia', 'Ciências', 'Artes', 'Educação Física'];

  const handleView = (id: number) => {
    console.log(`Visualizar plano ${id}`);
    router.push('/generated-plan');
  };

  const handleDownload = (id: number) => {
    console.log(`Baixar plano ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Deletar plano ${id}`);
  };

  const handleFavorite = (id: number) => {
    setPlans(plans.map(plan =>
      plan.id === id ? { ...plan, favorited: !plan.favorited } : plan
    ));
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