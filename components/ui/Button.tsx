import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-glow',
    secondary: 'bg-dark-800 text-white border-2 border-dark-600 hover:bg-dark-700 hover:border-primary-600/50',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-600/30',
    ghost: 'bg-transparent text-gray-300 hover:bg-dark-800 hover:text-white',
    outline: 'bg-transparent text-primary-500 border-2 border-primary-600 hover:bg-primary-600 hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[50px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
