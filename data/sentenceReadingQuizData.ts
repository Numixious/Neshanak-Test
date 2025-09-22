export interface SentenceQuizQuestion {
  sentence: string;
  correctAnswer: string; // emoji
  incorrectAnswers: string[]; // array of 2 emojis
}

export const sentenceReadingQuizData: SentenceQuizQuestion[] = [
    { sentence: 'من یک سیب قرمز در دست دارم.', correctAnswer: '🍎', incorrectAnswers: ['🍓', '⚽️'] },
    { sentence: 'گربه کوچک روی صندلی نشسته است.', correctAnswer: '🐈', incorrectAnswers: ['😠', '🏠'] },
    { sentence: 'من چترم را باز کردم چون باران میبارد.', correctAnswer: '☂️', incorrectAnswers: ['🔥', '☀️'] },
    { sentence: 'صبح خورشید از پشت کوه بالا می‌آید.', correctAnswer: '☀️', incorrectAnswers: ['🌙', '⛰️'] },
    { sentence: 'من با دوست خوبم فوتبال بازی می‌کنم.', correctAnswer: '⚽️', incorrectAnswers: ['🥅', '🏀'] },
    { sentence: 'پرنده ها در آسمان پرواز می‌کنند.', correctAnswer: '🐦', incorrectAnswers: ['🐟', '✈️'] },
    { sentence: 'من هر روز دستهایم را با صابون میشویم.', correctAnswer: '🧼', incorrectAnswers: ['💖', '🧴'] },
    { sentence: 'در باغ گلهای رنگی زیاد است.', correctAnswer: '🌸', incorrectAnswers: ['🌷', '🌳'] },
    { sentence: 'زمستان برف روی زمین نشسته است.', correctAnswer: '❄️', incorrectAnswers: ['🔥', '☃️'] },
    { sentence: 'من یک کتاب داستان زیبا دارم.', correctAnswer: '📖', incorrectAnswers: ['📚', '📝'] },
    { sentence: 'مادرم برایم نان و پنیر آماده کرد.', correctAnswer: '🍞', incorrectAnswers: ['🧀', '🧈'] },
    { sentence: 'ماهی در آب شنا می‌کند.', correctAnswer: '🐟', incorrectAnswers: ['🌊', '🐠'] },
    { sentence: 'خورشید آسمان را روشن کرده است.', correctAnswer: '☀️', incorrectAnswers: ['🌦️', '☁️'] },
    { sentence: 'من یک موز زرد در دست دارم.', correctAnswer: '🍌', incorrectAnswers: ['🍓', '🍇'] },
    { sentence: 'سگ کوچک کنار در خانه خوابیده است.', correctAnswer: '🐶', incorrectAnswers: ['😴', '🏠'] },
    { sentence: 'ابرهای خاکستری باران می‌آورند.', correctAnswer: '☁️', incorrectAnswers: ['🌧️', '☀️'] },
    { sentence: 'ماه در آسمان می‌درخشد.', correctAnswer: '🌙', incorrectAnswers: ['✨', '🌟'] },
    { sentence: 'من با مداد نقاشی می‌کشم.', correctAnswer: '✏️', incorrectAnswers: ['🎨', '🖍️'] },
    { sentence: 'پدرم برایم یک دوچرخه خریده است.', correctAnswer: '🚲', incorrectAnswers: ['🚗', '🛴'] },
    { sentence: 'در تابستان هوا خیلی گرم است.', correctAnswer: '🥵', incorrectAnswers: ['🥶', '🌡️'] },
    { sentence: 'پرنده روی شاخه درخت نشسته است.', correctAnswer: '🐦', incorrectAnswers: ['🌳', '🌿'] },
    { sentence: 'من هر روز صبح شیر می‌نوشم.', correctAnswer: '🥛', incorrectAnswers: ['☀️', '☕'] },
    { sentence: 'خرگوش در باغچه هویج می‌خورد.', correctAnswer: '🐰', incorrectAnswers: ['🥕', '🥬'] },
    { sentence: 'گلهای قرمز در باغ باز شده‌اند.', correctAnswer: '🌹', incorrectAnswers: ['🌷', '🌺'] },
    { sentence: 'من با دستمال بینی‌ام را پاک کردم.', correctAnswer: '🤧', incorrectAnswers: ['🧼', '🗑️'] },
    { sentence: 'یک پروانه رنگارنگ روی گل نشسته است.', correctAnswer: '🦋', incorrectAnswers: ['🌺', '🐞'] },
    { sentence: 'من هر روز آب می‌نوشم تا سالم بمانم.', correctAnswer: '💧', incorrectAnswers: ['🔥', '💪'] },
    { sentence: 'یک ماشین قرمز در خیابان حرکت می‌کند.', correctAnswer: '🚗', incorrectAnswers: ['🚲', '🛣️'] },
    { sentence: 'خرس بزرگی در جنگل راه می‌رود.', correctAnswer: '🐻', incorrectAnswers: ['🐯', '🌳'] },
    { sentence: 'سیب روی میز است و من آن را برمی‌دارم.', correctAnswer: '🍎', incorrectAnswers: ['🥕', '🙋‍♀️'] },
    { sentence: 'باد شاخه‌های درخت را تکان می‌دهد.', correctAnswer: '🌬️', incorrectAnswers: ['🌳', '🍃'] },
    { sentence: 'هواپیما در آسمان پرواز می‌کند.', correctAnswer: '✈️', incorrectAnswers: ['🚁', '🚀'] },
    { sentence: 'بچه‌ها آدم‌برفی درست می‌کنند.', correctAnswer: '☃️', incorrectAnswers: ['🌸', '❄️'] },
    { sentence: 'یک موش کوچک در سوراخ خانه‌اش پنهان شد.', correctAnswer: '🐭', incorrectAnswers: ['🧀', '🕳️'] },
    { sentence: 'من با خواهرم نقاشی کشیدم و رنگ‌آمیزی کردم.', correctAnswer: '🎨', incorrectAnswers: ['🖼️', '🧑‍🤝‍🧑'] },
    { sentence: 'صبحانه‌ام تخم‌مرغ و نان بود.', correctAnswer: '🍳', incorrectAnswers: ['🍞', '🥓'] },
    { sentence: 'یک خرگوش سفید در چمن‌ها می‌پرد.', correctAnswer: '🐇', incorrectAnswers: ['🌳', '🌿'] }
];
