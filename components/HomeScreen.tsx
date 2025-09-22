
import React from 'react';
import { Screen } from '../types';

interface HomeScreenProps {
  navigateTo: (screen: Screen) => void;
}

const BookOpenIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A9.735 9.735 0 006 21a9.707 9.707 0 005.25-1.533.75.75 0 000-1.28v-12a.75.75 0 000-1.28c-.37-.202-.78-.354-1.2-.467zM12.75 4.533c.42.113.83.265 1.2.467a.75.75 0 010 1.28v12a.75.75 0 010 1.28A9.707 9.707 0 0118 21a9.735 9.735 0 013.25-.555.75.75 0 01.5-.707V3.75a.75.75 0 01-.5-.707A9.735 9.735 0 0118 3a9.707 9.707 0 01-5.25 1.533z" />
    </svg>
);

const PencilIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
    </svg>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ navigateTo }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center animate-jump-in">
      <h2 className="text-4xl md:text-6xl font-extrabold text-brand-text dark:text-slate-100 mb-4">
        به نشانک خوش اومدی!
      </h2>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-16">آماده‌ای برای یادگیری و بازی؟</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <button
          onClick={() => navigateTo(Screen.READING_MENU)}
          className="group flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ring-4 ring-transparent hover:ring-brand-primary"
        >
          <BookOpenIcon className="w-20 h-20 mb-4 text-brand-primary dark:text-brand-primary-light transition-transform duration-300 group-hover:scale-110" />
          <h3 className="text-3xl font-extrabold text-brand-text dark:text-slate-100">می‌خواهم بخوانم</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-2">با بازی و داستان، خواندن یاد بگیر</p>
        </button>
        
        <button
          onClick={() => navigateTo(Screen.WRITING_MENU)}
          className="group flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ring-4 ring-transparent hover:ring-brand-secondary"
        >
          <PencilIcon className="w-20 h-20 mb-4 text-brand-secondary transition-transform duration-300 group-hover:scale-110" />
          <h3 className="text-3xl font-extrabold text-brand-text dark:text-slate-100">می‌خواهم بنویسم</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-2">نوشتن را با تمرین‌های جورواجور یاد بگیر</p>
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
