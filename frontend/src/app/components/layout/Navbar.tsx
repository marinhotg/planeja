"use client";

import { useRouter } from 'next/navigation';

interface NavbarProps {
  onBack?: () => void;
  onClear?: () => void;
  title: string;
}

export default function Navbar({ onBack, onClear, title }: NavbarProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full max-w-[800px] h-14">
      <div className="flex justify-between items-center h-full px-6">
        <button
          onClick={handleBackClick}
          className="text-blue-600 text-sm font-semibold font-inter hover:text-blue-800 transition-colors duration-200 cursor-pointer"
        >
          Voltar
        </button>

        <h1 className="text-neutral-800 text-2xl font-bold font-inter text-center flex-1">
          {title}
        </h1>

        <button
          onClick={onClear}
          className="text-blue-600 text-sm font-semibold font-inter hover:text-blue-800 transition-colors duration-200 cursor-pointer"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}