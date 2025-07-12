"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PageTitle from './PageTitle';
import Navbar from '../layout/Navbar';
import Button from './Button';
import { useRouter } from 'next/navigation';
import { fetchClassProfiles, deleteClassProfile, ClassProfile } from '@/lib/api';

export default function ManageClassProfilesContent() {
  const [classProfiles, setClassProfiles] = useState<ClassProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

   

  useEffect(() => {
    const loadClassProfiles = async () => {
      try {
        setLoading(true);
        const data = await fetchClassProfiles();
        setClassProfiles(data);
      } catch (err) {
        setError('Failed to load class profiles.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadClassProfiles();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/new-class-profile?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      try {
        await deleteClassProfile(id);
        setClassProfiles(classProfiles.filter(profile => profile.id !== id));
      } catch (err) {
        alert('Failed to delete class profile.');
        console.error(err);
      }
    }
  };

  const handleClear = () => {
    // Implement clear logic if needed (e.g., clear filters)
    console.log("Limpar filtros/seleções");
  };

  const handleAddNewProfile = () => {
    router.push('/new-class-profile');
  };

  if (loading) {
    return <p className="text-center text-gray-500 w-full">Loading profiles...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 w-full">Error: {error}</p>;
  }

  return (
    <>
      <PageTitle title="Gerenciar perfis de turma" subtitle="" />

      <Navbar title="Perfis de turma salvos" onClear={handleClear} showBack={false} showClear={false} />

      <div className="w-full px-4 py-6 flex flex-col justify-start items-start gap-4">
        {classProfiles.length === 0 ? (
          <p className="text-center text-gray-500 w-full">Nenhum perfil de turma salvo.</p>
        ) : (
          <ul className="w-full space-y-4">
            {classProfiles.map((profile) => (
              <li key={profile.id} className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm">
                <div>
                  <h3 className="text-blue-700 text-lg font-semibold">{profile.profileName}</h3>
                  <p className="text-gray-600 text-sm">Tamanho: {profile.size || 'N/A'}</p>
                  {/* You might want to display more details here based on your needs */}
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

        <Button className="w-full mt-8" onClick={handleAddNewProfile}>Adicionar novo perfil</Button>
      </div>
    </>
  );
}
