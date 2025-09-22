import React from 'react';
import { Screen, NavigationData } from '../types';
import { fluentReadingData, Story } from '../data/fluentReadingData';
import { CurriculumItem } from '../data/curriculum';
import { speak } from '../services/speechService';

interface FluentReadingMenuScreenProps {
  navigateTo: (screen: Screen, data?: NavigationData) => void;
}

const SoundIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
);

const FluentReadingMenuScreen: React.FC<FluentReadingMenuScreenProps> = ({ navigateTo }) => {
  
  const handleStoryClick = (story: Story) => {
    // We create a temporary CurriculumItem just for the title, as the story screen doesn't depend on a real curriculum item
    const menuItem: CurriculumItem = { id: story.id, title: story.title };
    navigateTo(Screen.FLUENT_READING_STORY, { menuItem, story });
  };

  const handleSoundClick = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    speak(title);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-jump-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-slate-100 mb-2">روان خوانی</h2>
        <p className="text-xl text-slate-600 dark:text-slate-400">یک داستان را برای خواندن انتخاب کن.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fluentReadingData.map((story) => (
          <button
            key={story.id}
            onClick={() => handleStoryClick(story)}
            className="group relative text-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:ring-2 hover:ring-brand-primary dark:hover:ring-brand-primary-light"
          >
            <button
                onClick={(e) => handleSoundClick(e, story.title)}
                aria-label={`صدای ${story.title} را پخش کن`}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full text-slate-400 hover:bg-brand-primary-light/20 hover:text-brand-primary dark:hover:bg-brand-primary/30 dark:hover:text-brand-primary-light z-10"
            >
                <SoundIcon className="w-8 h-8"/>
            </button>
            <h3 className="text-2xl font-bold text-brand-primary dark:text-brand-primary-light mb-2">{story.title}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FluentReadingMenuScreen;