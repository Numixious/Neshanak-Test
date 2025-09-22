import React from 'react';
import { speak } from '../services/speechService';
import { alphabetData, AlphabetItem } from '../data/alphabetData';

const AlphabetCard: React.FC<{ item: AlphabetItem }> = ({ item }) => {
    const handleCardClick = () => {
        speak(item.sound);
    };

    return (
        <button 
            onClick={handleCardClick}
            className="group perspective-1000 bg-white dark:bg-slate-800 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:scale-105"
        >
            <div className="flex flex-col h-full p-4 items-center justify-between">
                <div className="flex justify-between w-full">
                    <span className="text-4xl">{item.emoji}</span>
                    <span className="text-4xl font-bold text-brand-primary dark:text-brand-primary-light">{item.letterForms}</span>
                </div>
                <div className="flex-grow flex items-center justify-center">
                    {/* Placeholder for potential image if needed */}
                </div>
                <div className="w-full text-center">
                    <p className="text-2xl font-semibold text-brand-text dark:text-slate-200">{item.word}</p>
                </div>
            </div>
        </button>
    );
};

const AlphabetGameScreen: React.FC = () => {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-jump-in">
            <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text dark:text-slate-100 mb-2">جدول الفبای فارسی</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">روی هر کارت کلیک کن تا صدا و کلمه‌اش رو یاد بگیری!</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {alphabetData.map(item => (
                    <AlphabetCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default AlphabetGameScreen;
