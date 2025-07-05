"use client";

import { useState } from 'react';
import Image from "next/image";
import PageTitle from "./PageTitle";
import Navbar from "../layout/Navbar";
import Button from "./Button";
import { useRouter } from 'next/navigation';

export default function ManageClassProfilesContent() {
  // Mock data for demonstration
  const [classProfiles, setClassProfiles] = useState([
    { id: 1, name: 'Turma A - Fundamental I', description: 'Tamanho: 25, Nível: Alfabetização' },
    { id: 2, name: 'Turma B - EJA Jovens', description: 'Tamanho: 15, Nível: Reintegração escolar' },
    { id: 3, name: 'Turma C - EJA Adultos', description: 'Tamanho: 30, Nível: Multissérie' },
  ]);

  const router = useRouter();

  const handleEdit = (id: number) => {
    console.log(`Editar perfil ${id}`);
    router.push(`/new-class-profile?id=${id}`); // Navigate to new class profile page for editing
  };

  const handleDelete = (id: number) => {
    setClassProfiles(classProfiles.filter(profile => profile.id !== id));
    console.log(`Deletar perfil ${id}`);
  };

  const handleClear = () => {
    // Implement clear logic if needed
    console.log("Limpar filtros/seleções");
  };

  const handleAddNewProfile = () => {
    router.push('/new-class-profile');
  };

  return (
    <>
      <PageTitle title="Gerenciar Perfis de Turma" subtitle="" />

      <Navbar title="Perfis de Turma Salvos" onClear={handleClear} showBack={false} showClear={false} />

      <div className="w-full px-4 py-6 flex flex-col justify-start items-start gap-4">
        {classProfiles.length === 0 ? (
          <p className="text-center text-gray-500 w-full">Nenhum perfil de turma salvo.</p>
        ) : (
          <ul className="w-full space-y-4">
            {classProfiles.map((profile) => (
              <li key={profile.id} className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm">
                <div>
                  <h3 className="text-blue-700 text-lg font-semibold">{profile.name}</h3>
                  <p className="text-gray-600 text-sm">{profile.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(profile.id)} className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 cursor-pointer">
                    <Image src="/edit.svg" alt="Editar" width={16} height={16} />
                  </button>
                  <button onClick={() => handleDelete(profile.id)} className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 cursor-pointer">
                    <Image src="/trash.svg" alt="Deletar" width={16} height={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Button className="w-full mt-8" onClick={handleAddNewProfile}>Adicionar Novo Perfil</Button>
      </div>
    </>
  );
}