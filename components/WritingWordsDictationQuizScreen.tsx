import React, { useState, useEffect, useRef } from 'react';
import { Screen, WordDictationGroup } from '../types';
import { speak } from '../services/speechService';
import { saveTestResult } from '../../services/quizService';

// --- Icons ---
const SoundIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06z" />
    </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16.5 6.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.375 10.5a1.875 1.875 0 00-3.038-1.423 4.503 4.503 0 00-8.674 0 1.875 1.875 0 00-3.038 1.423A6.375 6.375 0 003 16.125c0 2.28.913 4.413 2.502 5.952a.75.75 0 001.048-.028L8.625 20.25h6.75l2.073 1.8a.75.75 0 001.048.028A6.375 6.375 0 0021 16.125a6.375 6.375 0 00-2.625-5.625z" />
    </svg>
);

// Function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

interface WritingWordsDictationQuizScreenProps {
  navigateTo: (screen: Screen) => void;
  navigateBack: () => void;
  quizGroup: WordDictationGroup;
}

const WritingWordsDictationQuizScreen: React.FC<WritingWordsDictationQuizScreenProps> = ({ navigateTo, navigateBack, quizGroup }) => {
    const [questions, setQuestions] = useState(() => shuffleArray(quizGroup.questions));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentQuestion = questions[currentQuestionIndex];
    
    useEffect(() => {
        if (currentQuestion) {
            speak(currentQuestion.sound);
            inputRef.current?.focus();
        }
    }, [currentQuestion]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (isSubmitted) {
            setIsSubmitted(false);
            setIsCorrect(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setIsSubmitted(true);
        if (inputValue.trim() === currentQuestion.answer) {
            setIsCorrect(true);
            if (isCorrect === null) { // only add score if it wasn't already correct on a retry
               setScore(s => s + 1);
            }
        } else {
            setIsCorrect(false);
        }
    };

    const handleEndQuiz = () => {
        saveTestResult({
            quizId: quizGroup.id,
            quizTitle: quizGroup.title,
            score: score,
            totalQuestions: questions.length,
            timestamp: Date.now(),
        });
        setShowResult(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setInputValue('');
            setIsCorrect(null);
            setIsSubmitted(false);
        } else {
            handleEndQuiz();
        }
    };

    const handleRestart = () => {
        setQuestions(shuffleArray(quizGroup.questions));
        setCurrentQuestionIndex(0);
        setScore(0);
        setInputValue('');
        setIsCorrect(null);
        setIsSubmitted(false);
        setShowResult(false);
    };

    const getInputClass = () => {
        if (!isSubmitted) return 'border-brand-primary-light dark:border-brand-primary focus:ring-brand-accent';
        if (isCorrect) return 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-4 ring-green-300 animate-tada';
        return 'border-red-500 bg-red-50 dark:bg-red-900/20 ring-4 ring-red-300 animate-shake';
    };
    
    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 animate-jump-in max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl">
                <TrophyIcon className="w-28 h-28 text-brand-accent mb-4" />
                <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-slate-100 mb-2">عالی بود!</h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">تو املای «{quizGroup.title}» را تمام کردی.</p>
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
        <div className="w-full max-w-2xl mx-auto p-4 md:p-8 animate-jump-in">
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text dark:text-slate-100 mb-2">املای کلمه‌ها: {quizGroup.title}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">کلمه‌ای که می‌شنوی را در جای خالی بنویس.</p>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-8 shadow-inner">
                <div 
                    className="bg-brand-accent h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl">
                <button
                    onClick={() => speak(currentQuestion.sound)}
                    className="w-full flex items-center justify-center gap-4 mb-8 bg-slate-100 dark:bg-slate-700 p-6 rounded-2xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors animate-pulse-glow"
                >
                    <SoundIcon className="w-12 h-12 text-brand-secondary"/>
                </button>
                
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        disabled={isCorrect === true}
                        className={`w-full max-w-md text-center p-4 text-5xl font-bold border-4 rounded-2xl focus:ring-4 focus:border-transparent transition duration-300 dark:text-slate-100 dark:placeholder-slate-400 ${getInputClass()}`}
                        placeholder="اینجا بنویس"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        dir="rtl"
                    />
                    
                    {isCorrect !== true && (
                        <button
                            type="submit"
                            className="w-full md:w-1/2 mx-auto mt-4 py-3 px-6 text-xl font-bold text-white bg-brand-primary rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300 transform hover:-translate-y-1 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            disabled={!inputValue.trim()}
                        >
                           بررسی کن
                        </button>
                    )}
                </form>
                
                {isCorrect === true && (
                    <div className="mt-8 text-center animate-jump-in">
                        <button
                            onClick={handleNextQuestion}
                            className="px-10 py-4 text-xl font-bold text-white bg-brand-secondary rounded-full shadow-lg hover:bg-pink-500 transition-transform transform hover:scale-105"
                        >
                            {currentQuestionIndex < questions.length - 1 ? "بعدی" : "پایان آزمون"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WritingWordsDictationQuizScreen;