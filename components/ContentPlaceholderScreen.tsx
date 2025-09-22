import React from 'react';
import { CurriculumItem } from '../data/curriculum';

interface ContentPlaceholderScreenProps {
  item: CurriculumItem;
}

const ConstructionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
    </svg>
);

const ContentPlaceholderScreen: React.FC<ContentPlaceholderScreenProps> = ({ item }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-jump-in">
      <ConstructionIcon className="w-24 h-24 text-brand-accent mb-6" />
      <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-slate-100 mb-4">به زودی...</h2>
      <p className="text-xl text-slate-600 dark:text-slate-400">
        محتوای بخش «{item.title}» در حال آماده شدن است!
      </p>
    </div>
  );
};

export default ContentPlaceholderScreen;
