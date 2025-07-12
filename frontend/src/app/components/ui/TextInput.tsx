import React from 'react';

export default function TextInput({ className, placeholder, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 placeholder-gray-500 ${className || ''}`}
      placeholder={placeholder}
      {...props}
    />
  );
}
