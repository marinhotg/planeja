"use client";

import React from 'react';
import InputLabel from "./InputLabel";

interface FilterBoxProps {
  selectedDisciplineFilter: string;
  setSelectedDisciplineFilter: (discipline: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  disciplines: string[];
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
    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4 bg-blue-50 rounded-xl">

      {/* Filter by Favorites */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <input
          type="checkbox"
          id="favoritesFilter"
          className="w-5 h-5 rounded-[4px] text-blue-700 border-blue-700 focus:ring-blue-700"
          checked={showFavoritesOnly}
          onChange={(e) => setShowFavoritesOnly(e.target.checked)}
        />
        <InputLabel htmlFor="favoritesFilter" >Mostrar apenas favoritos</InputLabel>
      </div>
      
      {/* Filter by Discipline */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <InputLabel htmlFor="disciplineFilter" >Disciplina:</InputLabel>
        <select
          id="disciplineFilter"
          className="w-full md:w-48 p-2.5 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-blue-700"
          value={selectedDisciplineFilter}
          onChange={(e) => setSelectedDisciplineFilter(e.target.value)}
        >
          <option value="" className="text-gray-500">Todas</option>
          {disciplines.map((discipline) => (
            <option key={discipline} value={discipline}>
              {discipline}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <InputLabel htmlFor="sortBy">Ordenar por:</InputLabel>
        <select
          id="sortBy"
          className="w-full md:w-48 p-2.5 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-blue-700"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Data</option>
          <option value="name">Nome</option>
        </select>
      </div>
    </div>
  );
}
