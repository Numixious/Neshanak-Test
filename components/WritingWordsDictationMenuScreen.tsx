import React from 'react';
import { Screen, NavigationData, WordDictationGroup } from '../types';
import { writingWordsDictationData } from '../data/writingWordsDictationData';
import { speak } from '../services/speechService';

interface WritingWordsDictationMenuScreenProps {
  navigateTo: (screen: Screen, data?: NavigationData) => void;
}

const SoundIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
);

const WritingWordsDictationMenuScreen: React.FC<WritingWordsDictationMenuScreenProps> = ({ navigateTo }) => {
  
  const handleItemClick = (group: WordDictationGroup) => {
      navigateTo(Screen.WRITING_WORDS_DICTATION_QUIZ, { 
          menuItem: { id: group.id, title: group.title },
          wordDictationGroup: group 
      });
  };

  const handleSoundClick = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    speak(title);
  };
  
  return (
    <div className="flex flex-col items-center p-4 md:p-8 text-center animate-jump-in">
      <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-slate-100 mb-4">املای کلمه‌ها</h2>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">یک بخش را برای شروع آزمون انتخاب کن.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
        {writingWordsDictationData.map(group => (
             <button
                key={group.id}
                onClick={() => handleItemClick(group)}
                className="relative group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center text-center"
            >
                <button
                    onClick={(e) => handleSoundClick(e, group.title)}
                    aria-label={`صدای ${group.title} را پخش کن`}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full text-slate-400 hover:bg-brand-primary-light/20 hover:text-brand-primary dark:hover:bg-brand-primary/30 dark:hover:text-brand-primary-light opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <SoundIcon className="w-8 h-8"/>
                </button>
                <h3 className="text-2xl font-bold text-brand-primary dark:text-brand-primary-light mb-2">{group.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 flex-grow">
                    {group.questions.map(q => q.answer).slice(0, 3).join(' - ')} ...
                </p>
            </button>
        ))}
      </div>
    </div>
  );
};

export default WritingWordsDictationMenuScreen;