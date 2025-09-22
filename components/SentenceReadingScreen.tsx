import React from 'react';
import { CurriculumItem } from '../data/curriculum';
import { sentenceReadingData } from '../data/sentenceReadingData';
import { speak } from '../services/speechService';

const SoundIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
);

interface SentenceReadingScreenProps {
  item: CurriculumItem;
}

const SentenceReadingScreen: React.FC<SentenceReadingScreenProps> = ({ item }) => {
  const levelData = sentenceReadingData[item.id];

  if (!levelData) {
    return <div className="text-center p-8">محتوای این بخش یافت نشد.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-jump-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-text dark:text-slate-100 mb-2">{levelData.title}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">روی هر جمله کلیک کن تا صدایش را بشنوی.</p>
      </div>

      <div className="flex flex-col gap-4">
        {levelData.sentences.map((sentence, index) => (
          <button
            key={`${sentence}-${index}`}
            onClick={() => speak(sentence)}
            className="group w-full flex items-center justify-between text-right p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brand-accent"
          >
            <span className="flex-1 text-2xl/relaxed md:text-3xl/relaxed font-bold text-brand-text dark:text-slate-200">{sentence}</span>
            <SoundIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 transition-colors group-hover:text-brand-secondary ml-4" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SentenceReadingScreen;