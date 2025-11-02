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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          border-2 border-gray-300 rounded-lg px-4 py-3 text-base
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          ${error ? 'border-red-500' : ''}
          ${widthStyle}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
