import React from 'react';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const RetroButton: React.FC<RetroButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "font-pixel text-xs sm:text-sm px-4 py-3 sm:px-6 sm:py-4 transition-transform active:translate-y-1 active:shadow-none border-2 sm:border-4 border-black shadow-hard uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-retro-orange text-retro-dark hover:bg-retro-yellow",
    secondary: "bg-retro-blue text-white hover:bg-retro-teal",
    danger: "bg-retro-pink text-retro-dark hover:bg-red-400"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? "LOADING..." : children}
    </button>
  );
};

export default RetroButton;