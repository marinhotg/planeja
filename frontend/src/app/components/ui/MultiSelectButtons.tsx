"use client";

import { useState } from 'react';
import InputLabel from "./InputLabel";

interface MultiSelectButtonsProps {
  label: string;
  options: readonly string[];
  selectedOptions: string[];
  onChange: (option: string) => void;
  onAddNewOption?: (option: string) => void; // Optional prop to handle new option logic
}

export default function MultiSelectButtons({ label, options, selectedOptions, onChange, onAddNewOption }: MultiSelectButtonsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newOption, setNewOption] = useState('');

  const handleAddNew = () => {
    const trimmedOption = newOption.trim();
    if (trimmedOption && onAddNewOption) {
      if (options.map(opt => opt.toLowerCase()).includes(trimmedOption.toLowerCase())) {
        alert('Esta opção já existe.');
        return;
      }
      onAddNewOption(trimmedOption);
      setNewOption('');
      setIsAdding(false);
    }
  };

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-2">
      <InputLabel>{label}</InputLabel>
      <div className="flex flex-wrap gap-2 items-center">
        {options.map((option) => (
          <button
            key={option}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors duration-200 hover:bg-blue-200 cursor-pointer ${
              selectedOptions.includes(option)
                ? 'bg-blue-700 text-white'
                : 'bg-indigo-50 text-blue-600'
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
        {onAddNewOption && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold hover:bg-blue-600"
          >
            {isAdding ? '−' : '+'}
          </button>
        )}
      </div>
      {isAdding && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
            placeholder="Nova opção"
          />
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg"
          >
            Adicionar
          </button>
        </div>
      )}
    </div>
  );
}
