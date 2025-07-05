import React from 'react';

interface InputLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

export default function InputLabel({ children, htmlFor }: InputLabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-black text-base font-normal leading-tight">
      {children}
    </label>
  );
}
