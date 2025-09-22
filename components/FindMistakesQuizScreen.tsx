import React, { useState, useEffect, useRef } from 'react';
import { Screen, FindMistakeGroup } from '../types';
import { speak } from '../services/speechService';
import { saveTestResult } from '../../services/quizService';

// --- Icons ---
const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16.5 6.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.375 10.5a1.875 1.875 0 00-3.038-1.423 4.503 4.503 0 00-8.674 0 1.875 1.875 0 00-3.038 1.423A6.375 6.375 0 003 16.125c0 2.28.913 4.413 2.502 5.952a.75.75 0 001.048-.028L8.625 20.25h6.75l2.073 1.8a.75.75 0 001.048.028A6.375 6.375 0 0021 16.125a6.375 6.375 0 00-2.625-5.625z" />
    </svg>
);

const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

interface FindMistakesQuizScreenProps {
  navigateTo: (screen: Screen) => void;
  navigateBack: () => void;
  quizGroup: FindMistakeGroup;
}

const FindMistakesQuizScreen: React.FC<FindMistakesQuizScreenProps> = ({ navigateTo, navigateBack, quizGroup }) => {
    const [questions, setQuestions] = useState(() => shuffleArray(quizGroup.questions));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [incorrectAttempts, setIncorrectAttempts] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const currentQuestion = questions[currentQuestionIndex];
    
    useEffect(() => {
        if (currentQuestion) {
            setInputValue(currentQuestion.sentence);
            setIsSubmitted(false);
            setFeedback(null);
            setIncorrectAttempts(0);
            textareaRef.current?.focus();
        }
    }, [currentQuestion]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        if (isSubmitted) {
            setIsSubmitted(false);
            setFeedback(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setIsSubmitted(true);
        if (inputValue.trim() === currentQuestion.answer) {
            setFeedback('correct');
            if (feedback !== 'correct') { // Prevent re-scoring on retry
               setScore(s => s + 1);
            }
        } else {
            setFeedback('incorrect');
            setIncorrectAttempts(prev => prev + 1);
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
        } else {
            handleEndQuiz();
        }
    };

    const handleRestart = () => {
        setQuestions(shuffleArray(quizGroup.questions));
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
    };

    const getInputClass = () => {
        if (!isSubmitted) return 'border-brand-primary-light dark:border-brand-primary focus:ring-brand-accent';
        if (feedback === 'correct') return 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-4 ring-green-300 animate-tada';
        if (feedback === 'incorrect') return 'border-red-500 bg-red-50 dark:bg-red-900/20 ring-4 ring-red-300 animate-shake-short';
        return 'border-brand-primary-light dark:border-brand-primary';
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
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8 animate-jump-in">
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text dark:text-slate-100 mb-2">غلط‌ها را پیدا کن: {quizGroup.title}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">اشتباه املایی جمله زیر را پیدا کن و شکل درست آن را بنویس.</p>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-8 shadow-inner">
                <div 
                    className="bg-brand-accent h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl">
                <div className="mb-6 bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">جمله با غلط املایی:</p>
                  <p className="text-3xl font-bold text-center text-brand-text dark:text-slate-200">{currentQuestion.sentence}</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        disabled={feedback === 'correct'}
                        className={`w-full text-center p-4 text-3xl font-bold border-4 rounded-2xl focus:ring-4 focus:border-transparent transition-all duration-300 dark:text-slate-100 dark:placeholder-slate-400 min-h-[120px] ${getInputClass()}`}
                        placeholder="شکل درست را اینجا بنویس..."
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        dir="rtl"
                    />
                    
                    {feedback !== 'correct' ? (
                        <button
                            type="submit"
                            className="w-full md:w-1/2 mx-auto mt-4 py-3 px-6 text-xl font-bold text-white bg-brand-primary rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300 transform hover:-translate-y-1 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            disabled={!inputValue.trim()}
                        >
                           بررسی کن
                        </button>
                    ) : (
                      <div className="mt-8 text-center animate-jump-in">
                        <button
                            onClick={handleNextQuestion}
                            className="px-10 py-4 text-xl font-bold text-white bg-brand-secondary rounded-full shadow-lg hover:bg-pink-500 transition-transform transform hover:scale-105"
                        >
                            {currentQuestionIndex < questions.length - 1 ? "بعدی" : "پایان آزمون"}
                        </button>
                    </div>
                    )}
                </form>
                
                {feedback === 'incorrect' && isSubmitted && incorrectAttempts >= 3 && (
                    <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border-r-4 border-green-500 rounded-lg animate-jump-in">
                        <p className="text-lg font-semibold text-green-800 dark:text-green-300">شکل درست این است:</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-200 mt-1">{currentQuestion.answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindMistakesQuizScreen;