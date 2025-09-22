import React from 'react';
import { Screen, NavigationData } from '../types';
import { curriculum, CurriculumItem } from '../data/curriculum';
import { speak } from '../services/speechService';

interface ReadingMenuScreenProps {
  navigateTo: (screen: Screen, data?: NavigationData) => void;
}

const SoundIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
);

const Card: React.FC<{ item: CurriculumItem, onClick: () => void }> = ({ item, onClick }) => {
    const handleSoundClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation when clicking the sound icon
        speak(item.title);
    };

    return (
        <button
            onClick={onClick}
            className="relative group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center text-center"
        >
            <button
                onClick={handleSoundClick}
                aria-label={`صدای ${item.title} را پخش کن`}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full text-slate-400 hover:bg-brand-primary-light/20 hover:text-brand-primary dark:hover:bg-brand-primary/30 dark:hover:text-brand-primary-light z-10"
            >
                <SoundIcon className="w-8 h-8"/>
            </button>
            <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
            <h3 className="text-2xl font-bold text-brand-text dark:text-slate-100 mb-2">{item.title}</h3>
            {item.description && <p className="text-slate-600 dark:text-slate-400 flex-grow">{item.description}</p>}
        </button>
    );
};


const ReadingMenuScreen: React.FC<ReadingMenuScreenProps> = ({ navigateTo }) => {
  
  const handleItemClick = (item: CurriculumItem) => {
      speak(item.title);
      const screen = item.targetScreen || Screen.CONTENT_PLACEHOLDER;
      navigateTo(screen, { menuItem: item });
  };
  
  return (
    <div className="flex flex-col items-center p-4 md:p-8 text-center animate-jump-in">
      <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-slate-100 mb-4">چه چیزی دوست داری بخوانی؟</h2>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">یک بخش را برای شروع انتخاب کن.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl">
        {curriculum.map(item => (
            <Card key={item.id} item={item} onClick={() => handleItemClick(item)} />
        ))}
      </div>
    </div>
  );
};

export default ReadingMenuScreen;