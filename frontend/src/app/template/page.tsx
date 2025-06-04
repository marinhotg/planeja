"use client";

import { useState } from "react";
import Header from "@/app/components/layout/Header";
import Navbar from "@/app/components/layout/Navbar";
import PlanCard from "@/app/components/ui/PlanCard";
import Button from "@/app/components/ui/Button";

type PlanType = "resumido" | "detalhado" | null;

export default function TemplatePage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("detalhado");

  const resumidoFeatures = [
    "Full library access",
    "Copy, paste to Figma",
    "Regular updates",
    "Desktop and mobile",
    "Premium support",
  ];

  const detalhadoFeatures = [
    "Full library access",
    "Copy, paste to Figma",
    "Regular updates",
    "Desktop and mobile",
    "Premium support",
  ];

  const handlePlanSelect = (planType: PlanType) => {
    setSelectedPlan(planType);
  };

  const handleClear = () => {
    setSelectedPlan(null);
  };

  const handleBack = () => {
    console.log("Voltar");
  };

  const handleAdvance = () => {
    if (selectedPlan) {
      console.log("Avançar com plano:", selectedPlan);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-2">
            <h1 className="text-blue-600 text-4xl font-bold font-inter mb-2">
              Personalize seu plano de aula
            </h1>
            <p className="text-blue-600 text-base font-inter">Personalize</p>
          </div>

          <Navbar onBack={handleBack} onClear={handleClear} />

          <div className="flex justify-center gap-8 mt-12 mb-12">
            <PlanCard
              title="Plano de aula resumido"
              features={resumidoFeatures}
              isSelected={selectedPlan === "resumido"}
              onClick={() => handlePlanSelect("resumido")}
            />
            <PlanCard
              title="Plano de aula detalhado"
              features={detalhadoFeatures}
              isSelected={selectedPlan === "detalhado"}
              onClick={() => handlePlanSelect("detalhado")}
            />
          </div>

          <div className="flex justify-center">
            <Button
              className="w-full max-w-md"
              onClick={handleAdvance}
              disabled={!selectedPlan}
            >
              Avançar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
