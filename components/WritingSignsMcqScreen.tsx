import React, { useState, useEffect, useMemo, useRef } from 'react';
import { writingSignsMcqData } from '../data/writingSignsMcqData';
import { Screen } from '../types';
import { speak } from '../services/speechService';
import Spinner from './shared/Spinner';
import { saveTestResult } from '../../services/quizService';

// --- Icons ---
const SoundIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06z" />
    </svg>
);

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

interface WritingSignsMcqScreenProps {
  navigateTo: (screen: Screen) => void;
  navigateBack: () => void;
}

const WritingSignsMcqScreen: React.FC<WritingSignsMcqScreenProps> = ({ navigateTo, navigateBack }) => {
    const [questions, setQuestions] = useState(() => shuffleArray(writingSignsMcqData).slice(0, 10));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const answerOptions = useMemo(() => {
        if (!currentQuestion) return [];
        return shuffleArray([currentQuestion.correctAnswer, currentQuestion.incorrectAnswer]);
    }, [currentQuestion]);

    const playSound = async (text: string) => {
        if (isSpeaking) return;
        setIsSpeaking(true);
        await speak(text);
        setIsSpeaking(false);
    };

    useEffect(() => {
        if (currentQuestion) {
            playSound(currentQuestion.soundToSpeak);
        }
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
            quizId: 'writing-signs-mcq',
            quizTitle: 'املای دو‌گزینه‌ای نشانه‌ها',
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
        setQuestions(shuffleArray(writingSignsMcqData).slice(0, 10));
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowResult(false);
    };

    const getButtonClass = (answer: string) => {
        if (!isAnswered) {
            return "bg-white dark:bg-slate-800 hover:bg-brand-primary-light/50 dark:hover:bg-brand-primary/50";
        }
        if (answer === currentQuestion.correctAnswer) {
            return "bg-green-500 text-white transform scale-105 ring-4 ring-green-300";
        }
        if (answer === selectedAnswer && answer !== currentQuestion.correctAnswer) {
            return "bg-red-500 text-white";
        }
        return "bg-white/50 dark:bg-slate-800/50 opacity-70";
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 animate-jump-in max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl">
                <TrophyIcon className="w-28 h-28 text-brand-accent mb-4" />
                <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-slate-100 mb-2">آفرین!</h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">تو آزمون رو تموم کردی.</p>
                <p className="text-2xl font-bold text-brand-text dark:text-slate-200 mb-10">
                    امتیاز تو: <span className="text-brand-primary dark:text-brand-primary-light text-3xl">{score}</span> از <span className="text-brand-primary dark:text-brand-primary-light text-3xl">{questions.length}</span>
                </p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRestart}
                        className="px-8 py-3 text-xl font-bold text-white bg-brand-primary rounded-full shadow-lg hover:bg-cyan-700 transition-transform transform hover:scale-105"
                    >
                        دوباره
                    </button>
                    <button
                        onClick={navigateBack}
                        className="px-8 py-3 text-xl font-bold text-brand-secondary bg-transparent border-2 border-brand-secondary rounded-full hover:bg-brand-secondary hover:text-white transition-all"
                    >
                        بازگشت به منو
                    </button>
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
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text dark:text-slate-100 mb-2">املای دو‌گزینه‌ای نشانه‌ها</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">دانش‌آموز خوبم، صدای زیر برای کدام نشانه است؟ روی آن کلیک کن.</p>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-8 shadow-inner">
                <div 
                    className="bg-brand-accent h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl">
                <button
                    onClick={() => playSound(currentQuestion.soundToSpeak)}
                    disabled={isSpeaking}
                    className="w-full flex items-center justify-center gap-4 mb-8 bg-slate-100 dark:bg-slate-700 p-6 rounded-2xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-70"
                >
                    {isSpeaking ? <Spinner size="sm" /> : <SoundIcon className="w-10 h-10 text-brand-secondary"/>}
                    <p className="text-4xl font-extrabold text-brand-text dark:text-slate-100">{currentQuestion.soundPrompt}</p>
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                    {answerOptions.map((answer) => (
                        <button
                            key={answer}
                            onClick={() => handleAnswerClick(answer)}
                            disabled={isAnswered || isSpeaking}
                            className={`relative w-full aspect-square p-4 rounded-2xl shadow-lg transition-all duration-300 flex justify-center items-center ${getButtonClass(answer)}`}
                        >
                            <span className="text-8xl font-bold text-brand-primary dark:text-brand-primary-light">{answer}</span>
                            {isAnswered && answer === currentQuestion.correctAnswer && <CheckIcon className="absolute top-3 right-3 w-9 h-9 text-white bg-green-600 rounded-full p-1" />}
                            {isAnswered && selectedAnswer === answer && answer !== currentQuestion.correctAnswer && <XIcon className="absolute top-3 right-3 w-9 h-9 text-white bg-red-600 rounded-full p-1" />}
                        </button>
                    ))}
                </div>
                
                {isAnswered && (
                    <div className="mt-8 text-center animate-jump-in">
                        <button
                            onClick={handleNextQuestion}
                            disabled={isSpeaking}
                            className="px-10 py-4 text-xl font-bold text-white bg-brand-secondary rounded-full shadow-lg hover:bg-pink-500 transition-transform transform hover:scale-105 disabled:bg-slate-400"
                        >
                            {currentQuestionIndex < questions.length - 1 ? "بعدی" : "پایان آزمون"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WritingSignsMcqScreen;