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
    <div className="w-full max-w-xs mx-auto p-4 bg-blue-100 rounded-lg shadow-md flex flex-col gap-3 text-sm">

      {/* Show Favorites Only */}
      <div className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          id="showFavoritesOnly"
          className="w-4 h-4 rounded text-blue-700 border-blue-300 focus:ring-blue-700"
          checked={showFavoritesOnly}
          onChange={(e) => setShowFavoritesOnly(e.target.checked)}
        />
        <InputLabel htmlFor="showFavoritesOnly">Apenas favoritos</InputLabel>
      </div>

      {/* Filter by Discipline */}
      <div className="flex flex-col gap-1">
        <InputLabel htmlFor="disciplineFilter">Disciplina</InputLabel>
        <div className="relative w-full">
          <select
            id="disciplineFilter"
            className="w-full p-1.5 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-blue-700"
            value={selectedDisciplineFilter}
            onChange={(e) => setSelectedDisciplineFilter(e.target.value)}
          >
            <option value="">Todas</option>
            {disciplines.map((discipline) => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort By */}
      <div className="flex flex-col gap-1">
        <InputLabel htmlFor="sortBy">Ordenar por</InputLabel>
        <div className="relative w-full">
          <select
            id="sortBy"
            className="w-full p-1.5 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-blue-700"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Data</option>
            <option value="name">Nome</option>
          </select>
        </div>
      </div>
    </div>
  );
}
