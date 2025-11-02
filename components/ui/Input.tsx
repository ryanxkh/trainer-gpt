import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}: InputProps) {
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthStyle}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          bg-dark-850 border-2 border-dark-700 rounded-xl px-5 py-4 text-base text-white placeholder-gray-500
          focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
          transition-all duration-300
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${widthStyle}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
