import React, { useState, useMemo, useRef } from 'react';
import { signsQuizData } from '../data/signsQuizData';
import { speak } from '../services/speechService';

const alphabet = signsQuizData.map(q => q.letter);

// --- Individual Game Components ---

// Game for 'آ'
const FireExtinguishGame: React.FC = () => {
    const fires = useMemo(() => [1, 2, 3], []);
    const [extinguished, setExtinguished] = useState<number[]>([]);

    const handleExtinguish = (index: number) => {
        if (extinguished.includes(index)) return;
        speak('آ');
        setExtinguished(prev => [...prev, index]);
    };
    
    const allExtinguished = extinguished.length === fires.length;

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="absolute top-4 right-4 text-7xl">🪣</div>
            <div className="flex gap-12 relative z-10">
                {fires.map((fire, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleExtinguish(index)}
                        className={`text-8xl transition-all duration-300 ${extinguished.includes(index) ? 'opacity-0 scale-50' : 'hover:scale-110'}`}
                    >
                        🔥
                    </button>
                ))}
            </div>
             <div className="absolute flex gap-12">
                 {fires.map((fire, index) => (
                     <div key={index} className={`text-8xl transition-opacity duration-500 ${extinguished.includes(index) ? 'opacity-100 animate-jump-in' : 'opacity-0'}`}>
                        💨
                     </div>
                 ))}
            </div>
             {allExtinguished && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in z-20">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">👍</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">آفرین! آتش خاموش شد!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ب'
const BalloonGame: React.FC = () => {
    const [popped, setPopped] = useState(false);

    const handlePop = () => {
        if (popped) return;
        speak('ب');
        setPopped(true);
    };

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            {popped ? (
                <div className="text-9xl animate-tada">💥</div>
            ) : (
                <button onClick={handlePop} className="relative group animate-bounce-in">
                    <div className="w-48 h-64 bg-red-500 rounded-full rounded-b-lg group-hover:scale-105 transition-transform duration-300"
                         style={{ clipPath: 'ellipse(40% 50% at 50% 50%)' }}>
                    </div>
                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-red-600"></div>
                </button>
            )}
        </div>
    );
};

// Game for 'پ'
const CottonGame: React.FC = () => {
    const [collected, setCollected] = useState<number[]>([]);
    const basketRef = useRef<HTMLDivElement>(null);
    const dotRefs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];

    const handleCollect = (index: number) => {
        if (collected.includes(index)) return;
        
        const dotRef = dotRefs[index].current;
        const basketRefCurrent = basketRef.current;

        if (dotRef && basketRefCurrent) {
            const dotRect = dotRef.getBoundingClientRect();
            const basketRect = basketRefCurrent.getBoundingClientRect();
            const x = basketRect.left - dotRect.left + (basketRect.width / 2) - (dotRect.width / 2);
            const y = basketRect.top - dotRect.top + (basketRect.height / 2) - (dotRect.height / 2);
            dotRef.style.setProperty('--target-x', `${x}px`);
            dotRef.style.setProperty('--target-y', `${y}px`);
        }

        speak('پ');
        setCollected(prev => [...prev, index]);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative animate-jump-in">
            <div className="relative text-[20rem] font-extrabold text-brand-primary dark:text-brand-primary-light">
                <span className="opacity-50">پ</span>
                {/* Dots */}
                {[0, 1, 2].map(i => (
                    <button
                        key={i}
                        ref={dotRefs[i]}
                        onClick={() => handleCollect(i)}
                        className={`absolute w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center ${collected.includes(i) ? 'animate-collect-cotton' : 'hover:scale-110 transition-transform'}`}
                        style={{
                            bottom: '55px',
                            left: `${45 + i * 25}%`,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <span className="text-3xl">☁️</span>
                    </button>
                ))}
            </div>
            <div ref={basketRef} className="absolute bottom-4 right-4 text-7xl">🧺</div>
            {collected.length === 3 && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">🎉</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">عالی بود!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ت'
const BallGame: React.FC = () => {
    const balls = useMemo(() => [
        { letter: 'ت', correct: true }, { letter: 'ب', correct: false },
        { letter: 'پ', correct: false }, { letter: 'ت', correct: true },
        { letter: 'ت', correct: true }, { letter: 'ن', correct: false }
    ].sort(() => Math.random() - 0.5), []);
    
    const [kicked, setKicked] = useState<number[]>([]);
    const [shaking, setShaking] = useState<number | null>(null);

    const handleKick = (index: number) => {
        if (kicked.includes(index)) return;
        
        if (!balls[index].correct) {
            setShaking(index);
            setTimeout(() => setShaking(null), 300);
            return;
        }
        speak('ت');
        setKicked(prev => [...prev, index]);
    };
    
    const allFound = kicked.length === balls.filter(b => b.correct).length;

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="grid grid-cols-3 gap-8">
                {balls.map((ball, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleKick(index)}
                        className={`relative text-7xl transition-all duration-300 ${kicked.includes(index) ? 'opacity-0 scale-50 -translate-y-20' : 'hover:scale-110'} ${shaking === index ? 'animate-shake-short' : ''}`}
                    >
                        ⚽
                        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white drop-shadow-lg">{ball.letter}</span>
                    </button>
                ))}
            </div>
             {allFound && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">🥅</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">گل! آفرین!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ث'
const TriangleGame: React.FC = () => {
    const shapes = useMemo(() => [
        { type: 'triangle', emoji: '🔺' }, { type: 'square', emoji: '🟥' },
        { type: 'circle', emoji: '🔵' }, { type: 'triangle', emoji: '🔺' },
        { type: 'triangle', emoji: '🔺' }, { type: 'circle', emoji: '🔵' },
    ].sort(() => Math.random() - 0.5), []);
    
    const [found, setFound] = useState<number[]>([]);

    const handleFind = (index: number) => {
        if (found.includes(index) || shapes[index].type !== 'triangle') return;
        speak('ث');
        setFound(prev => [...prev, index]);
    };
    
    const allFound = found.length === shapes.filter(s => s.type === 'triangle').length;

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="grid grid-cols-3 gap-8">
                {shapes.map((shape, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleFind(index)}
                        className={`text-7xl transition-all duration-300 ${found.includes(index) ? 'transform scale-125 opacity-100' : 'opacity-70 hover:opacity-100 hover:scale-110'}`}
                    >
                        {shape.emoji}
                    </button>
                ))}
            </div>
             {allFound && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in z-20">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">👍</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">مثلث‌ها رو پیدا کردی!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};


// Game for 'ج'
const EggHatchGame: React.FC = () => {
    const initialEggs = useMemo(() => [
        { letter: 'ج', correct: true }, { letter: 'ح', correct: false },
        { letter: 'چ', correct: false }, { letter: 'ج', correct: true },
        { letter: 'خ', correct: false }, { letter: 'ج', correct: true }
    ].sort(() => Math.random() - 0.5), []);
    
    const [hatched, setHatched] = useState<number[]>([]);

    const handleHatch = (index: number) => {
        if (hatched.includes(index) || !initialEggs[index].correct) return;
        speak('ج');
        setHatched(prev => [...prev, index]);
    };
    
    const allFound = hatched.length === initialEggs.filter(e => e.correct).length;

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="grid grid-cols-3 gap-6">
                {initialEggs.map((egg, index) => (
                    <button key={index} onClick={() => handleHatch(index)} className="relative w-28 h-36 rounded-full bg-orange-100 dark:bg-slate-600 shadow-md hover:scale-105 transition-transform flex items-center justify-center">
                        {!hatched.includes(index) ? (
                            <span className="text-5xl font-bold text-slate-500 dark:text-slate-300">{egg.letter}</span>
                        ) : (
                             <div className="text-7xl animate-chick-emerge">🐥</div>
                        )}
                         {!egg.correct && !hatched.includes(index) && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-4xl">❌</span>
                            </div>
                         )}
                    </button>
                ))}
            </div>
            {allFound && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">🎉</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">آفرین!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'چ'
const LightUpGame: React.FC = () => {
    const letters = useMemo(() => ['خ', 'ح', 'ج', 'چ', 'ح', 'چ', 'خ', 'ج', 'چ'].sort(() => Math.random() - 0.5), []);
    const [lit, setLit] = useState<number[]>([]);

    const handleLightUp = (index: number) => {
        if (letters[index] !== 'چ' || lit.includes(index)) return;
        speak('چ');
        setLit(prev => [...prev, index]);
    };
    
    const allFound = lit.length === letters.filter(l => l === 'چ').length;

    return (
         <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="grid grid-cols-3 gap-8">
                {letters.map((letter, index) => (
                    <button key={index} onClick={() => handleLightUp(index)} className="relative text-8xl font-extrabold text-brand-primary/50 dark:text-brand-primary-light/50">
                        {letter}
                        {letter === 'چ' && (
                            <>
                                <div className={`absolute w-5 h-5 rounded-full top-[105px] left-1/2 -translate-x-1/2 bg-gray-400 ${lit.includes(index) ? 'bg-yellow-300 animate-pulse-glow' : ''}`}></div>
                                <div className={`absolute w-5 h-5 rounded-full top-[105px] left-[30%] -translate-x-1/2 bg-gray-400 ${lit.includes(index) ? 'bg-yellow-300 animate-pulse-glow' : ''}`}></div>
                                <div className={`absolute w-5 h-5 rounded-full top-[105px] left-[70%] -translate-x-1/2 bg-gray-400 ${lit.includes(index) ? 'bg-yellow-300 animate-pulse-glow' : ''}`}></div>
                            </>
                        )}
                    </button>
                ))}
            </div>
             {allFound && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">💡</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">روشن شد!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ح'
const SnailRaceGame: React.FC = () => {
    const snails = useMemo(() => [
        { letter: 'ح', correct: true }, { letter: 'ج', correct: false },
        { letter: 'خ', correct: false }, { letter: 'ح', correct: true }
    ].sort(() => Math.random() - 0.5), []);
    const [moved, setMoved] = useState<number[]>([]);

    const handleMove = (index: number) => {
        if (moved.includes(index) || !snails[index].correct) return;
        speak('ح');
        setMoved(prev => [...prev, index]);
    };
    
     const allFound = moved.length === snails.filter(s => s.correct).length;

    return (
        <div className="w-full h-full flex flex-col items-start justify-around relative animate-jump-in p-4 overflow-hidden">
            {snails.map((snail, index) => (
                <button 
                    key={index} 
                    onClick={() => handleMove(index)}
                    className={`relative text-8xl flex items-center ${moved.includes(index) ? 'animate-move-snail' : 'hover:translate-x-2 transition-transform'}`}
                >
                    <span>🐌</span>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 text-4xl font-bold text-slate-600">{snail.letter}</span>
                </button>
            ))}
             {allFound && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">🏁</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">به خط پایان رسید!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'خ'
const RabbitCarrotGame: React.FC = () => {
    const tiles = useMemo(() => [
        { letter: 'خ', correct: true }, { letter: 'ح', correct: false }, { letter: 'ج', correct: false },
        { letter: 'خ', correct: true }, { letter: 'ح', correct: false }, { letter: 'خ', correct: true }
    ].sort(() => Math.random() - 0.5), []);
    const [found, setFound] = useState<number[]>([]);

    const handleDig = (index: number) => {
        if (found.includes(index) || !tiles[index].correct) return;
        speak('خ');
        setFound(prev => [...prev, index]);
    };

    const allFound = found.length === tiles.filter(t => t.correct).length;

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="absolute top-4 left-4 text-7xl">🐇</div>
            <div className="grid grid-cols-3 gap-6">
                {tiles.map((tile, index) => (
                    <button key={index} onClick={() => handleDig(index)} className="relative w-28 h-28 rounded-lg bg-yellow-900/40 dark:bg-yellow-900/80 shadow-md hover:scale-105 transition-transform flex items-center justify-center">
                        {!found.includes(index) ? (
                            <span className="text-5xl font-bold text-white/70">{tile.letter}</span>
                        ) : (
                            <div className="text-7xl animate-chick-emerge">🥕</div>
                        )}
                        {!tile.correct && !found.includes(index) && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-4xl">❌</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
            {allFound && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">🥕</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">چه خرگوش زرنگی!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'د'
const DoorGame: React.FC = () => {
    const doors = useMemo(() => [
        { letter: 'د', correct: true }, { letter: 'ر', correct: false },
        { letter: 'د', correct: true }, { letter: 'ذ', correct: false }
    ].sort(() => Math.random() - 0.5), []);
    const [opened, setOpened] = useState<number[]>([]);

    const handleOpen = (index: number) => {
        if (opened.includes(index) || !doors[index].correct) return;
        speak('د');
        setOpened(prev => [...prev, index]);
    };

    const allOpened = opened.length === doors.filter(d => d.correct).length;

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="grid grid-cols-2 gap-8">
                {doors.map((door, index) => (
                    <button key={index} onClick={() => handleOpen(index)} className="relative w-32 h-48 rounded-lg bg-yellow-800 dark:bg-yellow-900 shadow-lg perspective-1000">
                        <div className={`w-full h-full bg-yellow-700 dark:bg-yellow-800 rounded-lg flex items-center justify-center transition-transform duration-500 ${opened.includes(index) ? '[transform:rotateY(-120deg)]' : 'hover:scale-105'}`} style={{ transformOrigin: 'left' }}>
                            <span className="text-6xl font-bold text-white/50">{door.letter}</span>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[18px] w-4 h-4 rounded-full bg-yellow-900 dark:bg-yellow-950"></div>
                        {opened.includes(index) && <div className="absolute inset-0 flex items-center justify-center text-6xl animate-jump-in">✨</div>}
                    </button>
                ))}
            </div>
            {allOpened && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">🎉</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">همه درها باز شد!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ذ'
const PopcornGame: React.FC = () => {
    const kernels = useMemo(() => [{letter: 'ذ'}, {letter: 'د'}, {letter: 'ذ'}, {letter: 'ز'}, {letter: 'ذ'}].sort(() => Math.random() - 0.5), []);
    const [popped, setPopped] = useState<number[]>([]);

    const handlePop = (index: number) => {
        if (kernels[index].letter !== 'ذ' || popped.includes(index)) return;
        speak('ذ');
        setPopped(prev => [...prev, index]);
    };
    
    const allPopped = popped.length === kernels.filter(k => k.letter === 'ذ').length;

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="w-64 h-64 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center">
                {kernels.map((kernel, index) => (
                    <button key={index} onClick={() => handlePop(index)} className={`absolute text-5xl font-bold text-yellow-900 transition-all duration-300 ${popped.includes(index) ? 'opacity-0 scale-150' : 'hover:scale-110'}`} style={{transform: `rotate(${index * 72}deg) translate(80px) rotate(-${index * 72}deg)`}}>
                        {popped.includes(index) ? '🍿' : kernel.letter}
                    </button>
                ))}
            </div>
            {allPopped && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">🍿</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">چه ذرت خوشمزه‌ای!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ر'
const RainbowGame: React.FC = () => {
    const colors = useMemo(() => ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'], []);
    const [colored, setColored] = useState<number[]>([]);

    const handleColor = (index: number) => {
        if (colored.includes(index)) return;
        speak('ر');
        setColored(prev => [...prev, index]);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 relative animate-jump-in">
            <div className="relative w-80 h-40">
                {colors.map((color, index) => (
                    <div
                        key={color}
                        className="absolute top-0 left-0 w-full h-full border-solid rounded-t-full transition-all duration-500"
                        style={{
                            borderWidth: '15px',
                            borderColor: colored.includes(index) ? color : 'transparent',
                            transform: `scale(${1 - index * 0.1})`,
                        }}
                    ></div>
                ))}
            </div>
            <div className="flex gap-4">
                {colors.map((color, index) => (
                    <button
                        key={index}
                        onClick={() => handleColor(index)}
                        className={`w-12 h-12 rounded-full text-white font-bold text-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${colored.includes(index) ? 'opacity-20 cursor-not-allowed' : 'hover:scale-110'}`}
                        style={{ backgroundColor: color }}
                    >
                        ر
                    </button>
                ))}
            </div>
        </div>
    );
};

// Game for 'ز'
const BeeGame: React.FC = () => {
    const flowers = useMemo(() => [{letter: 'ز'}, {letter: 'ر'}, {letter: 'ز'}, {letter: 'د'}, {letter: 'ز'}].sort(() => Math.random() - 0.5), []);
    const [visited, setVisited] = useState<number[]>([]);

    const handleVisit = (index: number) => {
        if(flowers[index].letter !== 'ز' || visited.includes(index)) return;
        speak('ز');
        setVisited(prev => [...prev, index]);
    };

    const allVisited = visited.length === flowers.filter(f => f.letter === 'ز').length;

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="absolute top-4 left-4 text-7xl">🐝</div>
            <div className="flex gap-8">
                {flowers.map((flower, index) => (
                    <button key={index} onClick={() => handleVisit(index)} className={`relative text-8xl transition-transform duration-300 ${visited.includes(index) ? 'scale-125' : 'hover:scale-110'}`}>
                        {visited.includes(index) ? '🌻' : '🌸'}
                        <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-yellow-900">{flower.letter}</span>
                    </button>
                ))}
            </div>
             {allVisited && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">🍯</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">چه زنبور پرکاری!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ژ'
const JellyGame: React.FC = () => {
    const jellies = useMemo(() => [{letter: 'ژ'}, {letter: 'ز'}, {letter: 'ژ'}, {letter: 'ش'}, {letter: 'ژ'}].sort(() => Math.random() - 0.5), []);
    const [wobbled, setWobbled] = useState<number[]>([]);

    const handleWobble = (index: number) => {
        if (jellies[index].letter !== 'ژ' || wobbled.includes(index)) return;
        speak('ژ');
        setWobbled(prev => [...prev, index]);
    };

    return (
        <div className="w-full h-full flex items-center justify-center gap-6 relative animate-jump-in">
            {jellies.map((jelly, index) => (
                <button key={index} onClick={() => handleWobble(index)} className={`relative text-8xl transition-transform duration-300 hover:scale-105 ${wobbled.includes(index) ? 'animate-shake' : ''}`}>
                    🍮
                    <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white drop-shadow-lg">{jelly.letter}</span>
                </button>
            ))}
        </div>
    );
};


// Game for 'س'
const ApplePickingGame: React.FC = () => {
    const [picked, setPicked] = useState<number[]>([]);
    const apples = useMemo(() => [
        { top: '15%', left: '20%' }, { top: '30%', left: '60%' },
        { top: '40%', left: '30%' }, { top: '55%', left: '75%' }
    ], []);

    const handlePick = (index: number) => {
        if (picked.includes(index)) return;
        speak('س');
        setPicked(prev => [...prev, index]);
    };
    
    const allPicked = picked.length === apples.length;

    return (
        <div className="w-full h-full flex flex-col items-center justify-between relative animate-jump-in overflow-hidden">
            <div className="relative w-full h-3/4">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] text-green-600">🌳</div>
                 {apples.map((pos, index) => (
                     <button
                        key={index}
                        onClick={() => handlePick(index)}
                        className={`absolute text-6xl transition-all duration-700 ease-in-out ${picked.includes(index) ? 'top-[120%] !left-[45%] scale-50 opacity-0' : 'hover:scale-110'}`}
                        style={{ top: pos.top, left: pos.left }}
                     >
                        🍎
                     </button>
                 ))}
            </div>
            <div className="relative text-8xl mb-4">
                🧺
                <span className="absolute top-0 right-2 text-2xl font-bold text-black bg-white/70 px-2 rounded-full">{picked.length}</span>
            </div>
             {allPicked && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">🧺</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">همه سیب‌ها رو چیدی!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ش'
const CandleGame: React.FC = () => {
    const candles = useMemo(() => [1, 2, 3, 4], []);
    const [blownOut, setBlownOut] = useState<number[]>([]);

    const handleBlowOut = (index: number) => {
        if (blownOut.includes(index)) return;
        speak('ش');
        setBlownOut(prev => [...prev, index]);
    };

    return (
        <div className="w-full h-full flex items-center justify-center gap-8 relative animate-jump-in">
            {candles.map((_, index) => (
                <button key={index} onClick={() => handleBlowOut(index)} className="text-8xl transition-transform duration-300 hover:scale-110">
                    {blownOut.includes(index) ? '💨' : '🕯️'}
                </button>
            ))}
        </div>
    );
};

// Game for 'ص' and 'ض'
const BubbleGame: React.FC<{ targetLetter: 'ص' | 'ض' }> = ({ targetLetter }) => {
    const letters = useMemo(() => [targetLetter, 'س', targetLetter, 'ز', targetLetter, 'ش'].sort(() => Math.random() - 0.5), [targetLetter]);
    const [popped, setPopped] = useState<number[]>([]);

    const handlePop = (index: number) => {
        if(letters[index] !== targetLetter || popped.includes(index)) return;
        speak(targetLetter);
        setPopped(prev => [...prev, index]);
    };
    
    const allPopped = popped.length === letters.filter(l => l === targetLetter).length;

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
             <div className="absolute bottom-4 left-4 text-7xl">🧼</div>
            <div className="grid grid-cols-3 gap-8">
                {letters.map((letter, index) => (
                    <button key={index} onClick={() => handlePop(index)} className={`relative text-8xl text-cyan-300 transition-all duration-300 ${popped.includes(index) ? 'opacity-0 scale-150' : 'hover:scale-110'}`}>
                        <span className="opacity-50">⚪</span>
                        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white drop-shadow-lg">{letter}</span>
                    </button>
                ))}
            </div>
             {allPopped && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">🎉</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">آفرین! حباب‌ها ترکیدند!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ط' and 'ظ'
const DishGame: React.FC<{ targetLetter: 'ط' | 'ظ' }> = ({ targetLetter }) => {
    const otherLetter = targetLetter === 'ط' ? 'ت' : 'ز';
    const dishes = useMemo(() => [{letter: targetLetter}, {letter: otherLetter}, {letter: targetLetter}, {letter: 'د'}, {letter: targetLetter}].sort(() => Math.random() - 0.5), [targetLetter, otherLetter]);
    const [cleaned, setCleaned] = useState<number[]>([]);
    
    const handleClean = (index: number) => {
        if (dishes[index].letter !== targetLetter || cleaned.includes(index)) return;
        speak(targetLetter);
        setCleaned(prev => [...prev, index]);
    };

    return (
        <div className="w-full h-full flex items-center justify-center gap-6 relative animate-jump-in">
            {dishes.map((dish, index) => (
                <button key={index} onClick={() => handleClean(index)} className={`relative text-8xl transition-all duration-500 hover:scale-105 ${cleaned.includes(index) ? 'rotate-[360deg]' : ''}`}>
                    <span className={cleaned.includes(index) ? '' : 'grayscale opacity-60'}>🍽️</span>
                    <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-slate-600 dark:text-slate-200">{dish.letter}</span>
                    {cleaned.includes(index) && <span className="absolute text-5xl animate-spin-and-grow">✨</span>}
                </button>
            ))}
        </div>
    );
};

// Game for 'ع'
const GlassesGame: React.FC = () => {
    const [found, setFound] = useState(false);
    const handleFind = () => {
        if (found) return;
        speak('ع');
        setFound(true);
    };
    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="relative text-[12rem]">
                <span className={found ? 'grayscale' : ''}>🦉</span>
                <button onClick={handleFind} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl transition-all duration-500 ${found ? 'opacity-0 scale-50' : 'hover:scale-110'}`}>
                    ❓
                </button>
                {found && <div className="absolute top-[35%] left-1/2 -translate-x-1/2 text-8xl animate-bounce-in">👓</div>}
            </div>
        </div>
    );
};


// Game for 'غ' and 'ق'
const FrogLockGame: React.FC<{ gameType: 'frog' | 'lock'}> = ({ gameType }) => {
    const targetLetter = gameType === 'frog' ? 'غ' : 'ق';
    const otherLetter = gameType === 'frog' ? 'ق' : 'غ';
    const items = useMemo(() => [{letter: targetLetter}, {letter: otherLetter}, {letter: targetLetter}, {letter: 'ف'}, {letter: targetLetter}].sort(() => Math.random() - 0.5), [targetLetter, otherLetter]);
    const [activated, setActivated] = useState<number[]>([]);

    const handleActivate = (index: number) => {
        if (items[index].letter !== targetLetter || activated.includes(index)) return;
        speak(targetLetter);
        setActivated(prev => [...prev, index]);
    };

    const allActivated = activated.length === items.filter(i => i.letter === targetLetter).length;
    const emoji = gameType === 'frog' ? '🐸' : '🔒';
    const activeEmoji = gameType === 'frog' ? '🐸' : '🔓';


    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="flex gap-8">
                {items.map((item, index) => (
                     <button key={index} onClick={() => handleActivate(index)} className={`relative text-8xl transition-transform duration-300 ${activated.includes(index) ? 'scale-110' : 'hover:scale-110 grayscale'}`}>
                        {activated.includes(index) ? activeEmoji : emoji}
                        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white drop-shadow-md">{item.letter}</span>
                    </button>
                ))}
            </div>
             {allActivated && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">{gameType === 'frog' ? '🏆' : '💎'}</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">آفرین!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ف'
const ElephantGame: React.FC = () => {
    const [sprayed, setSprayed] = useState(false);
    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <button onClick={() => { speak('ف'); setSprayed(true); setTimeout(() => setSprayed(false), 1000)}} className="text-[10rem]">🐘</button>
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/4 text-6xl text-blue-400 transition-opacity duration-500 ${sprayed ? 'opacity-100 animate-tada' : 'opacity-0'}`}>💧</div>
            <div className={`absolute right-12 bottom-12 text-8xl ${sprayed ? 'animate-bounce-in' : ''}`}>{sprayed ? '🌸' : '🌱'}</div>
        </div>
    );
};

// Game for 'ک'
const KeyGame: React.FC = () => {
    const keys = useMemo(() => [{letter: 'ک'}, {letter: 'گ'}, {letter: 'ک'}].sort(() => Math.random() - 0.5), []);
    const [unlocked, setUnlocked] = useState(false);
    const handleUnlock = (letter: string) => {
        if(letter !== 'ک' || unlocked) return;
        speak('ک');
        setUnlocked(true);
    };

    return (
         <div className="w-full h-full flex flex-col items-center justify-center gap-12 relative animate-jump-in">
            <div className={`text-9xl transition-transform duration-500 ${unlocked ? 'animate-tada' : ''}`}>{unlocked ? '💎' : '📦'}</div>
            <div className="flex gap-8">
                {keys.map((key, index) => (
                    <button key={index} onClick={() => handleUnlock(key.letter)} className="text-8xl transition-transform duration-300 hover:scale-110">
                        🔑
                         <span className="absolute top-0 right-0 text-3xl font-bold text-yellow-800">{key.letter}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Game for 'گ'
const WateringGame: React.FC = () => {
    const [watered, setWatered] = useState<number[]>([]);
    const flowers = useMemo(() => [1, 2, 3, 4, 5], []);

    const handleWater = (index: number) => {
        if (watered.includes(index)) return;
        speak('گ');
        setWatered(prev => [...prev, index]);
    };
    
    const allWatered = watered.length === flowers.length;

    return (
        <div className="w-full h-full flex items-center justify-center relative animate-jump-in">
            <div className="flex items-end justify-center gap-8">
                <div className="absolute top-4 right-4 text-7xl animate-bounce">💧</div>
                {flowers.map((_, index) => (
                    <button key={index} onClick={() => handleWater(index)} className="flex flex-col items-center gap-2">
                         <div className={`text-8xl transition-all duration-500 transform ${watered.includes(index) ? 'scale-110' : 'scale-100 grayscale'}`}>
                            {watered.includes(index) ? '🌸' : '🌱'}
                         </div>
                         <div className="w-20 h-10 bg-yellow-900/70 rounded-t-lg"></div>
                    </button>
                ))}
            </div>
             {allWatered && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">💐</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">چه باغچه قشنگی!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'ل'
const TurtleGame: React.FC = () => {
    const [moved, setMoved] = useState(false);
    return (
        <div className="w-full h-full flex items-center justify-start p-8 relative animate-jump-in">
            <button onClick={() => { if(!moved) { speak('ل'); setMoved(true); }}} className={`text-[8rem] transition-transform duration-[2000ms] ease-in-out ${moved ? 'translate-x-[300%]' : 'hover:scale-105'}`}>🐢</button>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl">🥬</div>
        </div>
    );
};

// Game for 'م'
const FishGame: React.FC = () => {
    const fish = useMemo(() => [{letter: 'م'}, {letter: 'ن'}, {letter: 'م'}, {letter: 'ب'}, {letter: 'م'}].sort(() => Math.random() - 0.5), []);
    const [caught, setCaught] = useState<number[]>([]);
    
    const handleCatch = (index: number) => {
        if (fish[index].letter !== 'م' || caught.includes(index)) return;
        speak('م');
        setCaught(prev => [...prev, index]);
    };

    return (
        <div className="w-full h-full flex items-center justify-center gap-6 relative animate-jump-in">
            {fish.map((f, index) => (
                <button key={index} onClick={() => handleCatch(index)} className={`relative text-8xl transition-all duration-300 ${caught.includes(index) ? 'opacity-20 -translate-y-24' : 'hover:scale-110'}`}>
                    🐠
                    <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">{f.letter}</span>
                </button>
            ))}
             <div className="absolute -top-10 left-1/2 text-8xl -translate-x-1/2">🎣</div>
        </div>
    );
};


// Game for 'ن'
const BakingGame: React.FC = () => {
    const [doughs, setDoughs] = useState([1, 2, 3]);
    const [baked, setBaked] = useState<number[]>([]);
    
    const handleBake = (dough: number) => {
        if (!doughs.includes(dough)) return;
        speak('ن');
        setDoughs(d => d.filter(item => item !== dough));
        setTimeout(() => {
            setBaked(b => [...b, dough]);
        }, 800);
    };

    const allBaked = baked.length === 3;

    return (
        <div className="w-full h-full flex flex-col items-center justify-around relative animate-jump-in p-4">
            <div className="flex gap-4 min-h-[70px]">
                {doughs.map(d => (
                    <button key={d} onClick={() => handleBake(d)} className="text-6xl animate-bounce-in hover:scale-110 transition-transform">⚪</button>
                ))}
            </div>
            <div className="relative w-48 h-48 bg-orange-300 dark:bg-orange-900 rounded-full flex items-center justify-center shadow-inner">
                <div className="w-24 h-24 bg-black/50 rounded-full border-4 border-stone-600"></div>
                <div className="absolute text-5xl font-bold text-white/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">ن</div>
            </div>
            <div className="flex gap-4 min-h-[80px]">
                {baked.map(b => (
                    <div key={b} className="text-7xl animate-bounce-in">🍞</div>
                ))}
            </div>
             {allBaked && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl animate-jump-in">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                        <p className="text-6xl animate-tada">👨‍🍳</p>
                        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">نان داغ و تازه!</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

// Game for 'و'
const WeightliftingGame: React.FC = () => {
    const [lifted, setLifted] = useState(false);
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 relative animate-jump-in">
            <div className="text-9xl">{lifted ? '🏋️' : '🧍'}</div>
            <button onClick={() => { speak('و'); setLifted(l => !l); }} className={`px-6 py-3 rounded-full text-white font-bold text-2xl shadow-lg transition-colors ${lifted ? 'bg-red-500' : 'bg-green-500'}`}>
                {lifted ? 'بذار زمین' : 'بلند کن'}
            </button>
        </div>
    );
};

// Game for 'ه'
const GiftGame: React.FC = () => {
    const gifts = useMemo(() => [1,2,3], []);
    const [opened, setOpened] = useState<number[]>([]);
    const handleOpen = (index: number) => {
        if (opened.includes(index)) return;
        speak('ه');
        setOpened(prev => [...prev, index]);
    };
    return (
        <div className="w-full h-full flex items-center justify-center gap-8 relative animate-jump-in">
            {gifts.map((_, index) => (
                <button key={index} onClick={() => handleOpen(index)} className="text-8xl transition-transform duration-300 hover:scale-110">
                    {opened.includes(index) ? '🌟' : '🎁'}
                </button>
            ))}
        </div>
    );
};


// Game for 'ی'
const IceCubeGame: React.FC = () => {
    const cubes = useMemo(() => [1,2,3,4], []);
    const [cracked, setCracked] = useState<number[]>([]);
    const handleCrack = (index: number) => {
        if(cracked.includes(index)) return;
        speak('ی');
        setCracked(prev => [...prev, index]);
    };
    return (
        <div className="w-full h-full flex items-center justify-center gap-6 relative animate-jump-in">
            {cubes.map((_, index) => (
                <button key={index} onClick={() => handleCrack(index)} className="text-8xl transition-all duration-300 hover:scale-110">
                    {cracked.includes(index) ? '❄️' : '🧊'}
                </button>
            ))}
        </div>
    );
};


const LetterMatchingGameScreen: React.FC = () => {
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    const handleLetterSelect = (letter: string) => {
        setSelectedLetter(letter);
        let introText = '';
        switch(letter) {
            case 'آ': introText = "آ مثل آتش! روی آتش‌ها بزن تا خاموش بشن."; break;
            case 'ب': introText = "ب مثل بادکنک! بزن روش تا بترکه!"; break;
            case 'پ': introText = "پ مثل پنبه! پنبه‌ها رو توی سبد جمع کن."; break;
            case 'ت': introText = "ت مثل توپ! به توپ‌هایی که حرف «ت» دارند ضربه بزن."; break;
            case 'ث': introText = "ث مثل مثلث! مثلث‌ها را پیدا کن."; break;
            case 'ج': introText = "ج مثل جوجه! روی تخم‌مرغ‌های درست کلیک کن تا جوجه بشن."; break;
            case 'چ': introText = "چ مثل چراغ! چراغ‌ها رو روشن کن."; break;
            case 'ح': introText = "ح مثل حلزون! حلزون‌ها رو به خط پایان برسون."; break;
            case 'خ': introText = "خ مثل خرگوش! روی حرف «خ» کلیک کن تا هویج پیدا کنی."; break;
            case 'د': introText = "د مثل در! درهایی که حرف «د» دارند رو باز کن."; break;
            case 'ذ': introText = "ذ مثل ذرت! روی ذرت‌های درست بزن تا پخته بشن."; break;
            case 'ر': introText = "ر مثل رنگین‌کمان! روی قطره‌ها بزن تا رنگین‌کمان کامل بشه."; break;
            case 'ز': introText = "ز مثل زنبور! به زنبور کمک کن تا گل‌ها رو پیدا کنه."; break;
            case 'ژ': introText = "ژ مثل ژله! روی ژله‌ها بزن تا تکان بخورند."; break;
            case 'س': introText = "س مثل سیب! سیب‌ها رو از درخت بچین و در سبد جمع کن."; break;
            case 'ش': introText = "ش مثل شمع! شمع‌ها را فوت کن."; break;
            case 'ص': introText = "ص مثل صابون! حباب‌های درست را بترکان."; break;
            case 'ض': introText = "ض مثل فضا! حباب‌های درست را بترکان."; break;
            case 'ط': introText = "ط مثل طوطی! ظرف‌های درست را تمیز کن."; break;
            case 'ظ': introText = "ظ مثل ظرف! ظرف‌های درست را تمیز کن."; break;
            case 'ع': introText = "ع مثل عینک! عینک جغد را پیدا کن."; break;
            case 'غ': introText = "غ مثل قورباغه! به قورباغه کمک کن."; break;
            case 'ف': introText = "ف مثل فیل! فیل به گل‌ها آب می‌دهد."; break;
      
            case 'ق': introText = "ق مثل قفل! قفل‌ها را باز کن."; break;
            case 'ک': introText = "ک مثل کلید! کلید درست را پیدا کن."; break;
            case 'گ': introText = "گ مثل گل! به گل‌ها آب بده تا شاداب شوند."; break;
            case 'ل': introText = "ل مثل لاک‌پشت! به لاک‌پشت کمک کن به کاهو برسد."; break;
            case 'م': introText = "م مثل ماهی! ماهی‌های درست را بگیر."; break;
            case 'ن': introText = "ن مثل نان! نان‌ها را داخل تنور بزن تا بپزند."; break;
            case 'و': introText = "و مثل ورزش! ورزشکار را تشویق کن."; break;
            case 'ه': introText = "ه مثل هدیه! کادوها را باز کن."; break;
            case 'ی': introText = "ی مثل یخ! یخ‌ها را آب کن."; break;
            default: introText = `حرف «${letter}» رو انتخاب کردی.`;
        }
        speak(introText);
    };

    const renderGame = () => {
        if (!selectedLetter) {
            return (
                <div className="text-center animate-jump-in">
                    <p className="text-2xl text-slate-500 dark:text-slate-400">یک حرف را برای شروع بازی انتخاب کن!</p>
                    <p className="text-8xl mt-4">👇</p>
                </div>
            );
        }

        switch (selectedLetter) {
            case 'آ': return <FireExtinguishGame />;
            case 'ب': return <BalloonGame />;
            case 'پ': return <CottonGame />;
            case 'ت': return <BallGame />;
            case 'ث': return <TriangleGame />;
            case 'ج': return <EggHatchGame />;
            case 'چ': return <LightUpGame />;
            case 'ح': return <SnailRaceGame />;
            case 'خ': return <RabbitCarrotGame />;
            case 'د': return <DoorGame />;
            case 'ذ': return <PopcornGame />;
            case 'ر': return <RainbowGame />;
            case 'ز': return <BeeGame />;
            case 'ژ': return <JellyGame />;
            case 'س': return <ApplePickingGame />;
            case 'ش': return <CandleGame />;
            case 'ص': return <BubbleGame targetLetter="ص" />;
            case 'ض': return <BubbleGame targetLetter="ض" />;
            case 'ط': return <DishGame targetLetter="ط" />;
            case 'ظ': return <DishGame targetLetter="ظ" />;
            case 'ع': return <GlassesGame />;
            case 'غ': return <FrogLockGame gameType="frog" />;
            case 'ف': return <ElephantGame />;
            case 'ق': return <FrogLockGame gameType="lock" />;
            case 'ک': return <KeyGame />;
            case 'گ': return <WateringGame />;
            case 'ل': return <TurtleGame />;
            case 'م': return <FishGame />;
            case 'ن': return <BakingGame />;
            case 'و': return <WeightliftingGame />;
            case 'ه': return <GiftGame />;
            case 'ی': return <IceCubeGame />;
            default: return <div/>;
        }
    };
    
    return (
        <div className="w-full max-w-5xl mx-auto p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text dark:text-slate-100">بازی با نشانه‌ها</h2>
                {selectedLetter && (
                    <button onClick={() => setSelectedLetter(null)} className="px-4 py-2 bg-brand-secondary text-white font-bold rounded-full text-sm hover:bg-pink-500 transition-colors">انتخاب حرف جدید</button>
                )}
            </div>

            {/* Game Board */}
            <div key={selectedLetter} className="flex-grow bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
                {renderGame()}
            </div>

            {/* Alphabet Selector */}
            <div className="flex-shrink-0 pt-6">
                <div className="grid grid-cols-8 sm:grid-cols-9 md:grid-cols-12 gap-2">
                    {alphabet.map(letter => (
                        <button
                            key={letter}
                            onClick={() => handleLetterSelect(letter)}
                            className={`aspect-square flex items-center justify-center text-2xl font-bold rounded-lg shadow-md transition-all duration-200 
                                ${selectedLetter === letter 
                                    ? 'bg-brand-primary text-white scale-110 ring-4 ring-brand-primary-light' 
                                    : 'bg-white dark:bg-slate-700 text-brand-text dark:text-slate-200 hover:bg-brand-primary-light/50 dark:hover:bg-brand-primary/40'
                                }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LetterMatchingGameScreen;