import React, { useState, useEffect, useMemo } from 'react';
import { comprehensionQuizData } from '../data/comprehensionQuizData';
import { Screen } from '../types';
import { speak } from '../services/speechService';
import { saveTestResult } from '../../services/quizService';

interface ComprehensionQuizScreenProps {
  navigateTo: (screen: Screen) => void;
  navigateBack: () => void;
}

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16.5 6.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.375 10.5a1.875 1.875 0 00-3.038-1.423 4.503 4.503 0 00-8.674 0 1.875 1.875 0 00-3.038 1.423A6.375 6.375 0 003 16.125c0 2.28.913 4.413 2.502 5.952a.75.75 0 001.048-.028L8.625 20.25h6.75l2.073 1.8a.75.75 0 001.048.028A6.375 6.375 0 0021 16.125a6.375 6.375 0 00-2.625-5.625z" />
    </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
);

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

const emojiToWordMap: Record<string, string[]> = {
    '📖': ['کتاب'],
    '❄️': ['برف'],
    '☀️': ['خورشید', 'تابستان'],
    '🦋': ['پروانه‌ای', 'پروانه'],
    '☂️': ['چترم', 'چتر'],
    '🍦': ['بستنی'],
    '🧑‍🤝‍🧑': ['دوستم', 'دوستانم'],
    '🧼': ['صابون'],
    '🌸': ['گل‌های', 'گل'],
    '🐦': ['پرنده‌ها', 'پرنده'],
    '📚': ['کتاب‌های', 'کتاب'],
    '💧': ['باران', 'قطره‌های', 'آب'],
    '⚽️': ['توپ'],
    '🐟': ['ماهی'],
    '🪴': ['باغچه'],
    '☁️': ['ابرها', 'ابر'],
};

const findTargetWord = (paragraph: string, emoji: string): string | null => {
    const possibleWords = emojiToWordMap[emoji];
    if (!possibleWords) return null;

    for (const word of possibleWords) {
        if (paragraph.includes(word)) {
            return word;
        }
    }
    return null;
};

const renderHighlightedParagraph = (paragraph: string, emoji: string) => {
    const targetWord = findTargetWord(paragraph, emoji);
    if (!targetWord) {
        return <>{paragraph}</>;
    }

    const parts = paragraph.split(targetWord);
    
    return (
        <span>
            {parts.map((part, index) => (
                <React.Fragment key={index}>
                    {part}
                    {index < parts.length - 1 && (
                        <span className="text-brand-secondary dark:text-brand-accent font-bold">
                            {targetWord}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </span>
    );
};

const ComprehensionQuizScreen: React.FC<ComprehensionQuizScreenProps> = ({ navigateTo, navigateBack }) => {
    const [questions, setQuestions] = useState(() => shuffleArray(comprehensionQuizData));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const answerOptions = useMemo(() => {
        if (!currentQuestion) return [];
        return shuffleArray([currentQuestion.correctAnswer, ...currentQuestion.incorrectAnswers]);
    }, [currentQuestion]);

    const handleAnswerClick = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        if (answer === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleEndQuiz = () => {
        saveTestResult({
            quizId: 'comprehension-quiz',
            quizTitle: 'خودآزمایی درک مطلب',
            score: score,
            totalQuestions: questions.length,
            timestamp: Date.now(),
        });
        setShowResult(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedAnswer(null);
        } else {
            handleEndQuiz();
        }
    };
    
    const handleRestart = () => {
        setQuestions(shuffleArray(comprehensionQuizData));
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowResult(false);
    };

    const getButtonClass = (option: string) => {
        if (!isAnswered) {
            return "bg-white dark:bg-slate-800 hover:bg-brand-primary-light/20 dark:hover:bg-brand-primary/30 transform hover:scale-105";
        }
        if (option === currentQuestion.correctAnswer) {
            return "bg-green-100 dark:bg-green-900/50 ring-4 ring-green-500 transform scale-105";
        }
        if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
            return "bg-red-100 dark:bg-red-900/50 opacity-50";
        }
        return "bg-white/50 dark:bg-slate-800/50 opacity-50";
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 animate-jump-in max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl">
                <TrophyIcon className="w-28 h-28 text-brand-accent mb-4" />
                <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-slate-100 mb-2">آفرین!</h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">تو آزمون درک مطلب رو تموم کردی.</p>
                <p className="text-2xl font-bold text-brand-text dark:text-slate-200 mb-10">
                    امتیاز تو: <span className="text-brand-primary dark:text-brand-primary-light text-3xl">{score}</span> از <span className="text-brand-primary dark:text-brand-primary-light text-3xl">{questions.length}</span>
                </p>
                <div className="flex items-center gap-4">
                    <button onClick={handleRestart} className="px-8 py-3 text-xl font-bold text-white bg-brand-primary rounded-full shadow-lg hover:bg-cyan-700 transition-transform transform hover:scale-105">دوباره</button>
                    <button onClick={navigateBack} className="px-8 py-3 text-xl font-bold text-brand-secondary bg-transparent border-2 border-brand-secondary rounded-full hover:bg-brand-secondary hover:text-white transition-all">بازگشت به منو</button>
                </div>
            </div>
        );
    }
    
    if(!currentQuestion) {
        return <div className="text-center p-8">سؤالی برای نمایش وجود ندارد.</div>
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8 animate-jump-in">
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text dark:text-slate-100 mb-2">خودآزمایی درک مطلب</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400">متن را بخوان و گزینه درست را انتخاب کن.</p>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-8 shadow-inner">
                <div className="bg-brand-accent h-4 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl">
                <div className="flex justify-center items-center mb-10 p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl min-h-[100px]">
                    <p className="text-2xl/relaxed md:text-3xl/relaxed font-semibold text-brand-text dark:text-slate-100 text-center">
                        {renderHighlightedParagraph(currentQuestion.paragraph, currentQuestion.correctAnswer)}
                    </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    {answerOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleAnswerClick(option)}
                            disabled={isAnswered}
                            className={`relative aspect-square flex items-center justify-center p-4 rounded-2xl shadow-lg transition-all duration-300 ${getButtonClass(option)}`}
                        >
                            <span className="text-7xl md:text-8xl">{option}</span>
                             {isAnswered && option === currentQuestion.correctAnswer && <CheckCircleIcon className="absolute -top-3 -right-3 w-10 h-10 text-green-500 bg-white rounded-full" />}
                             {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && <XCircleIcon className="absolute -top-3 -right-3 w-10 h-10 text-red-500 bg-white rounded-full" />}
                        </button>
                    ))}
                </div>
                
                {isAnswered && (
                    <div className="mt-8 text-center animate-jump-in">
                        <button onClick={handleNextQuestion} className="px-10 py-4 text-xl font-bold text-white bg-brand-secondary rounded-full shadow-lg hover:bg-pink-500 transition-transform transform hover:scale-105">
                            {currentQuestionIndex < questions.length - 1 ? "بعدی" : "پایان آزمون"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ComprehensionQuizScreen;
