export interface ComprehensionQuestion {
  paragraph: string;
  correctAnswer: string; // emoji
  incorrectAnswers: string[]; // array of 2 emojis
}

export const comprehensionQuizData: ComprehensionQuestion[] = [
    {
        paragraph: 'دوست من یک کتاب داستان دارد. ما با هم داستان می‌خوانیم.',
        correctAnswer: '📖',
        incorrectAnswers: ['🏠', '❄️']
    },
    {
        paragraph: 'برف سفید روی زمین نشسته است. هوا سرد و سردتر می‌شود.',
        correctAnswer: '❄️',
        incorrectAnswers: ['🔥', '💧']
    },
    {
        paragraph: 'خورشید هر صبح از پشت کوه‌ها طلوع می‌کند. نور خورشید زمین را گرم و روشن می‌کند.',
        correctAnswer: '☀️',
        incorrectAnswers: ['🌙', '🌸']
    },
    {
        paragraph: 'گل‌های رنگی در باغچه می‌رویند. پروانه‌ای روی گل می‌نشیند و پرواز می‌کند.',
        correctAnswer: '🦋',
        incorrectAnswers: ['☀️', '💧']
    },
    {
        paragraph: 'باران با قطره‌های کوچک می‌بارد. من چترم را باز می‌کنم و بیرون می‌روم.',
        correctAnswer: '☂️',
        incorrectAnswers: ['🔥', '❄️']
    },
    {
        paragraph: 'خورشید گرم در آسمان می‌تابد. من بستنی می‌خورم و لبخند می‌زنم.',
        correctAnswer: '🍦',
        incorrectAnswers: ['☀️', '❄️']
    },
    {
        paragraph: 'دوستم دستش را به من می‌دهد تا کمکم کند. ما با هم نقاشی می‌کشیم و بازی می‌کنیم.',
        correctAnswer: '🧑‍🤝‍🧑',
        incorrectAnswers: ['💧', '🔥']
    },
    {
        paragraph: 'دست‌هایم را با صابون می‌شویم تا تمیز بمانم. دندان‌هایم را صبح و شب مسواک می‌زنم.',
        correctAnswer: '🧼',
        incorrectAnswers: ['🔥', '💧']
    },
    {
        paragraph: 'تابستان گرم است و من بستنی می‌خورم. دوستانم با من بازی می‌کنند و می‌خندند.',
        correctAnswer: '☀️',
        incorrectAnswers: ['🌶️', '❄️']
    },
    {
        paragraph: 'گل‌های رنگی در بهار می‌رویند. باد شاخه‌ها را تکان می‌دهد.',
        correctAnswer: '🌸',
        incorrectAnswers: ['❄️', '🔥']
    },
    {
        paragraph: 'پرنده‌ها روی شاخه‌ها آواز می‌خوانند. خورشید زمین را گرم و روشن می‌کند.',
        correctAnswer: '🐦',
        incorrectAnswers: ['❄️', '🔥']
    },
    {
        paragraph: 'من کتاب‌های رنگی‌ام را دوست دارم. برگ‌های کتاب پر از تصاویر زیباست.',
        correctAnswer: '📚',
        incorrectAnswers: ['🐦', '💧']
    },
    {
        paragraph: 'باران می‌بارد و زمین را خیس می‌کند. من چترم را باز می‌کنم و زیر باران می‌روم.',
        correctAnswer: '💧',
        incorrectAnswers: ['🔥', '☀️']
    },
    {
        paragraph: 'من با دوست جدیدم بازی می‌کنم. ما با هم توپ بازی می‌کنیم.',
        correctAnswer: '⚽️',
        incorrectAnswers: ['🔥', '💧']
    },
    {
        paragraph: 'یک ماهی کوچک در آب شنا می‌کند. آب زلال و تمیز است.',
        correctAnswer: '🐟',
        incorrectAnswers: ['💧', '☁️']
    },
    {
        paragraph: 'من یک باغچه کوچک دارم. گل‌های قرمز و زرد در آن می‌کارم.',
        correctAnswer: '🪴',
        incorrectAnswers: ['🌹', '🔥']
    },
    {
        paragraph: 'خورشید در آسمان آبی می‌تابد. ابرها آرام آرام حرکت می‌کنند.',
        correctAnswer: '☁️',
        incorrectAnswers: ['☀️', '💧']
    }
];
