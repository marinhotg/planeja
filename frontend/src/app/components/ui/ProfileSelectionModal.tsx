"use client";

import React from 'react';
import Button from './Button';

interface ProfileSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (profile: any) => void; // Replace 'any' with a proper type for your profile
}

export default function ProfileSelectionModal({ isOpen, onClose, onSelectProfile }: ProfileSelectionModalProps) {
  // Mock data for saved profiles
  const savedProfiles = [
    { id: 1, name: 'Perfil Padrão EJA', size: 20, education: ['Alfabetização'], age: ['Adultos (25 a 59 anos)'], life: ['Trabalhadores noturnos'], professional: ['Serviços Gerais'], other: [] },
    { id: 2, name: 'Perfil Jovens e Tecnologia', size: 18, education: ['Experiência com tecnologia'], age: ['Jovens (15 a 24 anos)'], life: [], professional: ['Comércio e Vendas'], other: [] },
    { id: 3, name: 'Perfil Multissérie Rural', size: 12, education: ['Multissérie'], age: ['Jovens (15 a 24 anos)', 'Adultos (25 a 59 anos)'], life: ['Agricultura'], professional: [], other: ['Povos originários'] },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-blue-700 text-2xl font-bold mb-4">Escolher Perfil Salvo</h2>
        <ul className="space-y-3 mb-6 max-h-80 overflow-y-auto">
          {savedProfiles.map((profile) => (
            <li
              key={profile.id}
              className="p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                onSelectProfile(profile);
                onClose();
              }}
            >
              <h3 className="text-blue-700 font-semibold">{profile.name}</h3>
              <p className="text-gray-600 text-sm">Tamanho: {profile.size}</p>
              <p className="text-gray-600 text-sm">Nível: {profile.education.join(', ')}</p>
            </li>
          ))}
        </ul>
        <Button onClick={onClose} className="w-full">Fechar</Button>
      </div>
    </div>
  );
}
