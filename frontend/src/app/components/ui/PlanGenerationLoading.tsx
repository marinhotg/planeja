import React, { useState, useEffect, useMemo } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PlanGenerationLoadingProps {
  isVisible: boolean;
}

export default function PlanGenerationLoading({ isVisible }: PlanGenerationLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  
  const steps = useMemo(() => [
    {
      title: "Consultando BNCC...",
      description: "Buscando habilidades e competências relevantes",
      baseDuration: 8000,
      minDuration: 6000,
      maxDuration: 12000,
      progressSpeed: 1.2 // Mais lento no início
    },
    {
      title: "Analisando perfil da turma...",
      description: "Considerando características dos estudantes",
      baseDuration: 6000,
      minDuration: 4000,
      maxDuration: 10000,
      progressSpeed: 1.5
    },
    {
      title: "Montando atividades...",
      description: "Criando sequência didática personalizada",
      baseDuration: 12000,
      minDuration: 8000,
      maxDuration: 18000,
      progressSpeed: 0.8 // Mais lento (etapa mais complexa)
    },
    {
      title: "Definindo metodologia...",
      description: "Aplicando princípios da andragogia",
      baseDuration: 7000,
      minDuration: 5000,
      maxDuration: 11000,
      progressSpeed: 1.3
    },
    {
      title: "Finalizando plano...",
      description: "Organizando conteúdo e recursos",
      baseDuration: 5000,
      minDuration: 3000,
      maxDuration: 8000,
      progressSpeed: 2.0 // Mais rápido no final
    }
  ], []);

  useEffect(() => {
          if (!isVisible) {
        setCurrentStep(0);
        setStepProgress(0);
        return;
      }

    // Tempo variável para cada etapa baseado na complexidade
    const currentStepData = steps[currentStep];
    const actualDuration = Math.random() * 
      (currentStepData.maxDuration - currentStepData.minDuration) + 
      currentStepData.minDuration;

    // Progresso interno de cada etapa com velocidade variável
    const stepProgressInterval = setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }

        // Progresso mais lento no início e mais rápido no final
        const progressRatio = prev / 100;
        const speedMultiplier = currentStepData.progressSpeed * (1 + progressRatio * 0.5);

        const nextProgress = prev + (Math.random() * 2 + 1) * speedMultiplier;
        return Math.min(nextProgress, 100);
      });
    }, 150);

    // Transição para próxima etapa quando progresso chegar a 100%
    const stepTransitionInterval = setInterval(() => {
      if (stepProgress >= 100) {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            setStepProgress(0);
            return prev + 1;
          }
          return prev;
        });
      }
    }, 100);

    // Fallback: transição automática após tempo máximo
    const fallbackInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          setStepProgress(0);
          return prev + 1;
        }
        return prev;
      });
    }, actualDuration);

    return () => {
      clearInterval(stepProgressInterval);
      clearInterval(stepTransitionInterval);
      clearInterval(fallbackInterval);
    };
  }, [isVisible, steps, currentStep, stepProgress]);

  // Progresso total considerando etapa atual + progresso interno
  const totalProgress = Math.min(((currentStep + Math.min(stepProgress, 100) / 100) / steps.length) * 100, 100);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-white/60 transition-all" />
      <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mb-6">
            <LoadingSpinner size="large" color="blue" className="mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Gerando seu plano de aula
            </h2>
            <p className="text-gray-600 text-sm">
              Isso pode levar alguns minutos...
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                  index === currentStep
                    ? 'bg-blue-50 border border-blue-200 shadow-sm scale-105'
                    : index < currentStep
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {index < currentStep ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : index === currentStep ? (
                    <div className="relative">
                      <LoadingSpinner size="small" color="blue" />
                      {/* Indicador de progresso interno */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-600 rounded-full opacity-75 animate-ping"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium text-sm transition-colors duration-300 ${
                    index === currentStep ? 'text-blue-700' : 
                    index < currentStep ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs transition-colors duration-300 ${
                    index === currentStep ? 'text-blue-600' : 
                    index < currentStep ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                  {/* Barra de progresso interna para etapa atual */}
                  {index === currentStep && (
                    <div className="mt-2">
                      <div className="w-full bg-blue-200 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full transition-all duration-300 ease-out relative"
                          style={{ width: `${Math.min(stepProgress, 100)}%` }}
                        >
                          {/* Efeito de brilho na barra de progresso */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 mt-1 font-medium">
                        {Math.round(Math.min(stepProgress, 100))}% desta etapa
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${Math.min(totalProgress, 100)}%` }}
              >
                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              {Math.round(Math.min(totalProgress, 100))}% concluído
            </p>
          </div>

          {/* Mensagem motivacional dinâmica */}
          <div className="mt-4 text-xs text-gray-400 italic">
            {currentStep < 2 && "Analisando informações e requisitos..."}
            {currentStep >= 2 && currentStep < 3 && "Criando atividades personalizadas..."}
            {currentStep >= 3 && currentStep < 4 && "Aplicando metodologias educacionais..."}
            {currentStep >= 4 && "Finalizando e organizando o conteúdo..."}
          </div>

          {/* Indicador de tempo estimado */}
          <div className="mt-2 text-xs text-gray-400">
            {currentStep < steps.length - 1 ? 
              `Etapa ${currentStep + 1} de ${steps.length}` : 
              "Finalizando..."
            }
          </div>
        </div>
      </div>
    </div>
  );
} 
