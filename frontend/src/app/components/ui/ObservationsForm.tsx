"use client";

import { useState } from 'react';
import Navbar from "../layout/Navbar";
import PageTitle from "./PageTitle";
import Button from "./Button";
import InputLabel from "./InputLabel";
import { useRouter } from 'next/navigation';

export default function ObservationsForm() {
  const [observations, setObservations] = useState('');
  const router = useRouter();

  const handleClear = () => {
    setObservations('');
  };

  const handleAdvance = () => {
    // Logic to save observations data if needed
    // This is the last page, so no navigation for now
    console.log("Avançar para a próxima etapa (finalizar)");
  };

  return (
    <>
      <PageTitle title="Personalize seu plano de aula" subtitle="Observações" />

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
          ></textarea>
        </div>

        <Button className="w-full mt-8" onClick={handleAdvance}>Avançar</Button>
      </div>
    </>
  );
}