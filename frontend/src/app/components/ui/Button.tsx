import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`px-7 py-3 bg-blue-700 rounded-xl inline-flex justify-center items-center gap-2 text-center text-white text-lg font-semibold leading-loose hover:bg-blue-800 transition-colors duration-200 cursor-pointer ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}