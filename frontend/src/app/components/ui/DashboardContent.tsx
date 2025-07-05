"use client";

import Image from "next/image";
import PageTitle from "./PageTitle";
import Button from "./Button";
import PlanCard from "./PlanCard";
import { useRouter } from 'next/navigation';

export default function DashboardContent() {
  // Mock data for demonstration
  const plans = [
    { id: 1, title: 'Plano de Matemática - Nível I', subtitle: 'Álgebra' },
    { id: 2, title: 'Plano de Português - Nível II', subtitle: 'Gramática' },
    { id: 3, title: 'Plano de História - Nível III', subtitle: 'Antiguidade' },
    { id: 4, title: 'Plano de Ciências - Nível I', subtitle: 'Biologia' },
    { id: 5, title: 'Plano de Artes - Nível II', subtitle: 'Pintura' },
    { id: 6, title: 'Plano de Educação Física - Nível III', subtitle: 'Esportes' },
  ];

  const router = useRouter();

  const handleView = (id: number) => {
    console.log(`Visualizar plano ${id}`);
    router.push('/generated-plan'); // Navigate to the generated plan page
  };

  const handleDownload = (id: number) => {
    console.log(`Baixar plano ${id}`);
    // Implement download logic
  };

  const handleDelete = (id: number) => {
    console.log(`Deletar plano ${id}`);
    // Implement delete logic
  };

  const handleFavorite = (id: number) => {
    console.log(`Favoritar plano ${id}`);
    // Implement favorite logic
  };

  const handleGenerateNewPlan = () => {
    router.push('/template-selection');
  };

  return (
    <>
      <PageTitle title="Meus planos de aula" subtitle="" />

      <div className="w-full p-6 bg-white flex flex-col justify-start items-center gap-6">
        <Button className="w-full" onClick={handleGenerateNewPlan}>Gerar novo plano de aula</Button>
      </div>

      <div className="w-full text-center justify-center text-neutral-800 text-2xl font-bold">Planos de aula gerados anteriormente</div>

      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full justify-items-center">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              title={plan.title}
              subtitle={plan.subtitle}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onFavorite={handleFavorite}
            />
          ))}
        </div>
      </div>
    </>
  );
}