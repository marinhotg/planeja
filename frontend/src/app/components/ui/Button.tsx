interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  className = "",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-12 px-4 py-3 bg-blue-600 rounded-xl flex justify-center items-center gap-2 overflow-hidden transition-all duration-200 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 ${className}`}
    >
      <span className="text-white text-base font-semibold font-inter">
        {children}
      </span>
    </button>
  );
}
