
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-solid border-brand-primary dark:border-brand-primary-light border-t-transparent`}
      ></div>
      {text && <p className="text-brand-text dark:text-slate-300 text-lg font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default Spinner;
