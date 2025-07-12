"use client";

import React, { useState, useEffect } from 'react';
import Button from './Button';
import { fetchClassProfiles, ClassProfile } from '@/lib/api';

interface ProfileSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (profile: ClassProfile) => void;
}

export default function ProfileSelectionModal({ isOpen, onClose, onSelectProfile }: ProfileSelectionModalProps) {
  const [savedProfiles, setSavedProfiles] = useState<ClassProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) { // Only fetch when the modal is open
      const loadProfiles = async () => {
        try {
          setLoading(true);
          const data = await fetchClassProfiles();
          setSavedProfiles(data);
        } catch (err) {
          setError('Failed to load saved profiles.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadProfiles();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
          <p className="text-center text-gray-500">Loading saved profiles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
          <p className="text-center text-red-500">Error: {error}</p>
          <Button onClick={onClose} className="w-full mt-4">Fechar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-blue-700 text-2xl font-bold mb-4">Escolher Perfil Salvo</h2>
        {savedProfiles.length === 0 ? (
          <p className="text-center text-gray-500 mb-6">Nenhum perfil salvo encontrado.</p>
        ) : (
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
                <h3 className="text-blue-700 font-semibold">{profile.profileName}</h3>
                <p className="text-gray-600 text-sm">Tamanho: {profile.size || 'N/A'}</p>
                <p className="text-gray-600 text-sm">Nível: {profile.educationLevels?.join(', ') || 'N/A'}</p>
              </li>
            ))}
          </ul>
        )}
        <Button onClick={onClose} className="w-full">Fechar</Button>
      </div>
    </div>
  );
}