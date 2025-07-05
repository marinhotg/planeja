"use client";

import { useRouter } from 'next/navigation';

interface NavbarProps {
  onBack?: () => void;
  onClear?: () => void;
  title: string;
  showBack?: boolean;
  showClear?: boolean;
}

export default function Navbar({ onBack, onClear, title, showBack = true, showClear = true }: NavbarProps) {
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
        {showBack ? (
          <button
            onClick={handleBackClick}
            className="text-blue-600 text-sm font-semibold font-inter hover:text-blue-800 transition-colors duration-200 cursor-pointer"
          >
            Voltar
          </button>
        ) : (
          <div className="w-[50px]"></div> // Placeholder to maintain spacing
        )}

        <h1 className="text-neutral-800 text-2xl font-bold font-inter text-center flex-1">
          {title}
        </h1>

        {showClear ? (
          <button
            onClick={onClear}
            className="text-blue-600 text-sm font-semibold font-inter hover:text-blue-800 transition-colors duration-200 cursor-pointer"
          >
            Limpar
          </button>
        ) : (
          <div className="w-[50px]"></div> // Placeholder to maintain spacing
        )}
      </div>
    </div>
  );
}
