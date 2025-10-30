"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const Target = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2}></circle>
    <circle cx="12" cy="12" r="6" strokeWidth={2}></circle>
    <circle cx="12" cy="12" r="2" strokeWidth={2}></circle>
  </svg>
)

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Zap = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" strokeWidth={2}></polygon>
  </svg>
)

const translations = {
  pt: {
    free: "100% Gratuito • Sem Limitações",
    heroTitle1: "A união entre o que o professor",
    heroTitle2: "precisa",
    heroTitle3: "e o que o aluno",
    heroTitle4: "merece",
    heroDescription:
      "O PlanEJA é uma plataforma inteligente de geração automática de planos de aula para a Educação de Jovens e Adultos (EJA), feita para apoiar quem ensina e transformar a experiência de quem aprende.",
    startNow: "Comece Agora - É Grátis",
    totallyFree: "Totalmente gratuito",
    alignedBNCC: "Alinhado à BNCC",
    plansInSeconds: "Planos em segundos",
    whyDifferent: "Por que o PlanEJA é diferente?",
    whyDescription:
      "Sabemos que as turmas da EJA são marcadas por histórias de vida diversas, diferentes níveis de escolaridade e desafios únicos.",
    smartPersonalization: "Personalização Inteligente",
    smartPersonalizationDesc:
      "Planos adaptados ao perfil da turma, respeitando heterogeneidade e contexto social específico.",
    instantGeneration: "Geração Instantânea",
    instantGenerationDesc:
      "Em segundos, receba um plano completo com objetivos, conteúdos contextualizados e metodologias ativas.",
    alignedTitle: "Alinhado à BNCC",
    alignedDesc: "Garantia de qualidade e relevância do ensino, seguindo diretrizes da Base Nacional Comum Curricular.",
    howWorks: "Como funciona?",
    howWorksDesc: "Simples, rápido e eficiente em apenas 3 passos",
    step1Title: "Informe os Parâmetros",
    step1Desc: "Tema da aula, duração, recursos disponíveis e perfil da turma",
    step2Title: "IA Gera o Plano",
    step2Desc: "Nossa inteligência artificial cria um plano personalizado em segundos",
    step3Title: "Aplique na Sala",
    step3Desc: "Receba o plano completo pronto para usar com seus alunos",
    ctaTitle: "PlanEJA: Planeje com agilidade, ensine com propósito",
    ctaDescription:
      "Transforme a experiência de ensino na EJA. Seus alunos merecem o melhor, e você merece as melhores ferramentas.",
    startNowBtn: "Começar Agora",
    login: "Entrar",
  },
  es: {
    free: "100% Gratuito • Sin Limitaciones",
    heroTitle1: "La unión entre lo que el profesor",
    heroTitle2: "necesita",
    heroTitle3: "y lo que el alumno",
    heroTitle4: "merece",
    heroDescription:
      "PlanEJA es una plataforma inteligente de generación automática de planes de clase para la Educación de Jóvenes y Adultos (EJA), hecha para apoyar a quien enseña y transformar la experiencia de quien aprende.",
    startNow: "Comience Ahora - Es Gratis",
    totallyFree: "Totalmente gratuito",
    alignedBNCC: "Alineado a la BNCC",
    plansInSeconds: "Planes en segundos",
    whyDifferent: "¿Por qué PlanEJA es diferente?",
    whyDescription:
      "Sabemos que las clases de EJA están marcadas por historias de vida diversas, diferentes niveles de escolaridad y desafíos únicos.",
    smartPersonalization: "Personalización Inteligente",
    smartPersonalizationDesc:
      "Planes adaptados al perfil de la clase, respetando heterogeneidad y contexto social específico.",
    instantGeneration: "Generación Instantánea",
    instantGenerationDesc:
      "En segundos, reciba un plan completo con objetivos, contenidos contextualizados y metodologías activas.",
    alignedTitle: "Alineado a la BNCC",
    alignedDesc:
      "Garantía de calidad y relevancia de la enseñanza, siguiendo directrices de la Base Nacional Común Curricular.",
    howWorks: "¿Cómo funciona?",
    howWorksDesc: "Simple, rápido y eficiente en solo 3 pasos",
    step1Title: "Informe los Parámetros",
    step1Desc: "Tema de la clase, duración, recursos disponibles y perfil de la clase",
    step2Title: "IA Genera el Plan",
    step2Desc: "Nuestra inteligencia artificial crea un plan personalizado en segundos",
    step3Title: "Aplique en el Aula",
    step3Desc: "Reciba el plan completo listo para usar con sus alumnos",
    ctaTitle: "PlanEJA: Planifique con agilidad, enseñe con propósito",
    ctaDescription:
      "Transforme la experiencia de enseñanza en EJA. Sus alumnos merecen lo mejor, y usted merece las mejores herramientas.",
    startNowBtn: "Comenzar Ahora",
    login: "Entrar",
  },
}

export default function PlanEJALanding() {
  const [language, setLanguage] = useState<"pt" | "es">("pt")
  const t = translations[language]
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="PlanEJA Logo" width={40} height={40} className="rounded-lg" />
            <span className="text-2xl font-bold text-gray-900">PlanEJA</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 border rounded-md p-1 bg-gray-50">
              <button
                onClick={() => setLanguage("pt")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === "pt" ? "bg-green-600 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🇧🇷 PT
              </button>
              <button
                onClick={() => setLanguage("es")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === "es" ? "bg-green-600 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🇪🇸 ES
              </button>
            </div>
            <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors" onClick={() => router.push("/login")}>
              {t.login}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 lg:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200">
                  {t.free}
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl text-gray-900">
                  {t.heroTitle1} <span className="text-green-600">{t.heroTitle2}</span> {t.heroTitle3}{" "}
                  <span className="text-blue-600">{t.heroTitle4}</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">{t.heroDescription}</p>
                <div className="flex flex-col sm:flex-row gap-4" >
                  <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-md transition-colors" onClick={() => router.push("/login")}>
                    {t.startNow}
                  </button>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{t.totallyFree}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{t.alignedBNCC}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{t.plansInSeconds}</span>
                  </div>
                </div>
              </div>
              <div className="relative flex justify-center items-center">
                <Image src="/logo.png" alt="PlanEJA Logo" width={300} height={300} className="rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t.whyDifferent}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.whyDescription}</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-white p-6 shadow-sm hover:border-green-200 transition-colors">
                <Users className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.smartPersonalization}</h3>
                <p className="text-gray-600">{t.smartPersonalizationDesc}</p>
              </div>

              <div className="rounded-lg border bg-white p-6 shadow-sm hover:border-blue-200 transition-colors">
                <Zap className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.instantGeneration}</h3>
                <p className="text-gray-600">{t.instantGenerationDesc}</p>
              </div>

              <div className="rounded-lg border bg-white p-6 shadow-sm hover:border-orange-200 transition-colors">
                <Target className="h-10 w-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.alignedTitle}</h3>
                <p className="text-gray-600">{t.alignedDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t.howWorks}</h2>
              <p className="text-xl text-gray-600">{t.howWorksDesc}</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{t.step1Title}</h3>
                <p className="text-gray-600">{t.step1Desc}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{t.step2Title}</h3>
                <p className="text-gray-600">{t.step2Desc}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{t.step3Title}</h3>
                <p className="text-gray-600">{t.step3Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold sm:text-4xl">{t.ctaTitle}</h2>
              <p className="text-xl opacity-90">{t.ctaDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center" onClick={() => router.push("/login")}>
                <button className="px-8 py-3 bg-white text-green-600 hover:bg-gray-100 text-lg font-medium rounded-md transition-colors">
                  {t.startNowBtn}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-900 flex justify-center items-center">
        <Image src="/logo.png" alt="PlanEJA logo" width={80} height={29} />
      </footer>
    </div>
  )
}
