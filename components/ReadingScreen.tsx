import React, { useState, useCallback } from 'react';
import { generateStory } from '../services/geminiService';
import Spinner from './shared/Spinner';
import { speak } from '../services/speechService';

const topics = [
  { id: 'animals', name: 'حیوانات', emoji: '🐶' },
  { id: 'friendship', name: 'دوستی', emoji: '🧑‍🤝‍🧑' },
  { id: 'space', name: 'فضا', emoji: '🚀' },
  { id: 'magic', name: 'جادو', emoji: '🧙' },
  { id: 'school', name: 'مدرسه', emoji: '🏫'},
  { id: 'family', name: 'خانواده', emoji: '👨‍👩‍👧‍👦'},
];

const SoundIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
);

const ReadingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState('');
  const [error, setError] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleTopicSelect = useCallback(async (topicId: string, topicName: string) => {
    setIsLoading(true);
    setStory('');
    setError('');
    setSelectedTopic(topicName);
    try {
      const generatedStory = await generateStory(topicId);
      setStory(generatedStory);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-text dark:text-slate-100 mb-2">بیا با هم داستان بخوانیم!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">یک موضوع رو انتخاب کن تا برات یه داستان قشنگ بسازم.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleTopicSelect(topic.id, topic.name)}
            disabled={isLoading}
            className="flex items-center gap-3 px-6 py-3 text-xl font-bold text-white bg-brand-primary rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300 transform hover:-translate-y-1 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <span>{topic.emoji}</span>
            <span>{topic.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl min-h-[300px] flex items-center justify-center">
        {isLoading ? (
          <Spinner text={`دارم یک داستان قشنگ در مورد ${selectedTopic} می‌سازم...`} size="lg" />
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400">
            <p className="text-2xl mb-2">(＞﹏＜)</p>
            <p className="font-bold">{error}</p>
          </div>
        ) : story ? (
          <div>
            <p className="text-2xl/loose md:text-3xl/loose text-brand-text dark:text-slate-200 font-medium text-right whitespace-pre-wrap">
              {story}
            </p>
          </div>
        ) : (
          <p className="text-2xl text-slate-500 dark:text-slate-400">اینجا داستان تو نمایش داده می‌شه!</p>
        )}
      </div>
    </div>
  );
};

export default ReadingScreen;