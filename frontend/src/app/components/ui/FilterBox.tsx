"use client";

import React from 'react';
import InputLabel from './InputLabel';

interface FilterBoxProps {
  selectedDisciplineFilter: string;
  setSelectedDisciplineFilter: (discipline: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  disciplines: string[]; // This will now be passed from DashboardContent
}

export default function FilterBox({
  selectedDisciplineFilter,
  setSelectedDisciplineFilter,
  showFavoritesOnly,
  setShowFavoritesOnly,
  sortBy,
  setSortBy,
  disciplines,
}: FilterBoxProps) {

  return (
    <div className="w-full px-4 py-6 flex flex-col justify-start items-start gap-4">
      {/* Filter by Discipline */}
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <InputLabel htmlFor="disciplineFilter">Filtrar por Disciplina</InputLabel>
        <div className="relative w-full">
          <select
            id="disciplineFilter"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            value={selectedDisciplineFilter}
            onChange={(e) => setSelectedDisciplineFilter(e.target.value)}
          >
            <option value="">Todas as Disciplinas</option>
            {disciplines.map((discipline) => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show Favorites Only */}
      <div className="self-stretch py-4 inline-flex justify-start items-center gap-3">
        <input
          type="checkbox"
          id="showFavoritesOnly"
          className="w-5 h-5 rounded-[4px] text-blue-700 border-gray-300 focus:ring-blue-700"
          checked={showFavoritesOnly}
          onChange={(e) => setShowFavoritesOnly(e.target.checked)}
        />
        <InputLabel htmlFor="showFavoritesOnly">Mostrar apenas favoritos</InputLabel>
      </div>

      {/* Sort By */}
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <InputLabel htmlFor="sortBy">Ordenar por</InputLabel>
        <div className="relative w-full">
          <select
            id="sortBy"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Data (mais recente)</option>
            <option value="name">Nome (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
