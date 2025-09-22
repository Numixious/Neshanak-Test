import React, { useState, useEffect, useMemo } from 'react';
import { Screen, SentenceUnscrambleGroup } from '../types';
import { speak } from '../services/speechService';
import { saveTestResult } from '../../services/quizService';

// --- Icons ---
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16.5 6.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.375 10.5a1.875 1.875 0 00-3.038-1.423 4.503 4.503 0 00-8.674 0 1.875 1.875 0 00-3.038 1.423A6.375 6.375 0 003 16.125c0 2.28.913 4.413 2.502 5.952a.75.75 0 001.048-.028L8.625 20.25h6.75l2.073 1.8a.75.75 0 001.048.028A6.375 6.375 0 0021 16.125a6.375 6.375 0 00-2.625-5.625z" />
    </svg>
);

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

interface SentenceUnscrambleQuizScreenProps {
  navigateTo: (screen: Screen) => void;
  navigateBack: () => void;
  quizGroup: SentenceUnscrambleGroup;
}

const SentenceUnscrambleQuizScreen: React.FC<SentenceUnscrambleQuizScreenProps> = ({ navigateBack, quizGroup }) => {
    const [questions, setQuestions] = useState(() => shuffleArray(quizGroup.sentences));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [orderedWords, setOrderedWords] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);
    
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        if (currentQuestion) {
            const words = currentQuestion.split(' ');
            setOrderedWords(shuffleArray(words));
            setIsSubmitted(false);
            setFeedback(null);
        }
    }, [currentQuestion]);

    const handleDragEnter = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;
        
        const items = [...orderedWords];
        const draggedItemContent = items[draggedIndex];
        items.splice(draggedIndex, 1);
        items.splice(index, 0, draggedItemContent);
        
        setDraggedIndex(index);
        setOrderedWords(items);
    };

    // Desktop Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
        }
        if (feedback === 'incorrect') {
            setFeedback(null);
            setIsSubmitted(false);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    // Touch Device Handlers
    const handleTouchStart = (index: number) => {
        setDraggedIndex(index);
        if (feedback === 'incorrect') {
            setFeedback(null);
            setIsSubmitted(false);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (draggedIndex === null) return;
        e.preventDefault(); // Prevent page scroll

        const touch = e.touches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;

        if (targetElement && targetElement.dataset.index) {
            const targetIndex = parseInt(targetElement.dataset.index, 10);
            if (!isNaN(targetIndex)) {
                handleDragEnter(targetIndex);
            }
        }
    };

    const handleTouchEnd = () => {
        setDraggedIndex(null);
    };


    // Game Logic Handlers
    const handleCheck = () => {
        setIsSubmitted(true);
        const userAnswer = orderedWords.join(' ');
        if (userAnswer === currentQuestion) {
            setFeedback('correct');
            if (feedback !== 'correct') { // Prevent re-scoring
                setScore(s => s + 1);
            }
        } else {
            setFeedback('incorrect');
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

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
        } else {
            handleEndQuiz();
        }
    };

    const handleRestart = () => {
        setQuestions(shuffleArray(quizGroup.sentences));
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 animate-jump-in max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl">
                <TrophyIcon className="w-28 h-28 text-brand-accent mb-4" />
                <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-slate-100 mb-2">عالی بود!</h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">تو آزمون «{quizGroup.title}» را تمام کردی.</p>
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
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-jump-in">
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text dark:text-slate-100 mb-2">مرتب کن: {quizGroup.title}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">کلمه‌ها را بکش و جابه‌جا کن تا جمله درست شود.</p>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-8 shadow-inner">
                <div 
                    className="bg-brand-accent h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className={`bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl transition-all duration-300 ${feedback === 'incorrect' ? 'animate-shake-short' : ''} ${feedback === 'correct' ? 'ring-4 ring-green-500' : ''}`}>
                <div className="flex flex-wrap items-center justify-center gap-4 p-4 min-h-[100px] bg-slate-100 dark:bg-slate-700 rounded-2xl mb-8">
                   {orderedWords.map((word, index) => (
                       <div
                            key={`${word}-${index}-${currentQuestionIndex}`}
                            draggable={feedback !== 'correct'}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            onTouchStart={() => handleTouchStart(index)}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            data-index={index}
                            className={`px-6 py-3 bg-white dark:bg-slate-800 text-3xl font-bold text-brand-primary dark:text-brand-primary-light rounded-full transition-all duration-200 ${feedback !== 'correct' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} ${draggedIndex === index ? 'opacity-50 scale-95 shadow-2xl' : 'shadow-md'}`}
                       >
                           {word}
                       </div>
                   ))}
                </div>

                <div className="flex justify-center items-center gap-4">
                    {feedback !== 'correct' ? (
                        <button 
                            onClick={handleCheck}
                            className="px-10 py-4 text-xl font-bold text-white bg-brand-primary rounded-full shadow-lg hover:bg-cyan-700 transition-transform transform hover:scale-105"
                        >
                            بررسی کن
                        </button>
                    ) : (
                        <button 
                            onClick={handleNext}
                            className="px-10 py-4 text-xl font-bold text-white bg-brand-secondary rounded-full shadow-lg hover:bg-pink-500 transition-transform transform hover:scale-105 animate-bounce-in"
                        >
                            {currentQuestionIndex < questions.length - 1 ? "جمله بعدی" : "پایان آزمون"}
                        </button>
                    )}

                    {isSubmitted && (
                        <div className="flex items-center gap-2">
                           {feedback === 'correct' ? <CheckIcon className="w-10 h-10 text-green-500 animate-tada" /> : <XIcon className="w-10 h-10 text-red-500" />}
                           <p className={`text-xl font-bold ${feedback === 'correct' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                               {feedback === 'correct' ? 'آفرین!' : 'دوباره تلاش کن!'}
                           </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SentenceUnscrambleQuizScreen;