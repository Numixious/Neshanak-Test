export interface WordQuizQuestion {
  word: string;
  correctAnswer: string; // emoji
  incorrectAnswers: string[]; // array of 2 emojis
}

export const wordReadingQuizData: WordQuizQuestion[] = [
    { word: 'موز', correctAnswer: '🍌', incorrectAnswers: ['🍓', '😠'] },
    { word: 'سگ', correctAnswer: '🐶', incorrectAnswers: ['🦊', '🐱'] },
    { word: 'ماه', correctAnswer: '🌙', incorrectAnswers: ['☀️', '⭐'] },
    { word: 'ساعت', correctAnswer: '⌚️', incorrectAnswers: ['👟', '📖'] },
    { word: 'کفش', correctAnswer: '👟', incorrectAnswers: ['📖', '🏠'] },
    { word: 'کتاب', correctAnswer: '📖', incorrectAnswers: ['🏠', '☀️'] },
    { word: 'خانه', correctAnswer: '🏠', incorrectAnswers: ['☀️', '🌹'] },
    { word: 'خورشید', correctAnswer: '☀️', incorrectAnswers: ['❄️', '🌹'] },
    { word: 'گل', correctAnswer: '🌹', incorrectAnswers: ['🌵', '🌲'] },
    { word: 'درخت', correctAnswer: '🌳', incorrectAnswers: ['✈️', '🏀'] },
    { word: 'هواپیما', correctAnswer: '✈️', incorrectAnswers: ['🏀', '☂️'] },
    { word: 'توپ', correctAnswer: '🏀', incorrectAnswers: ['☂️', '🐞'] },
    { word: 'سیب', correctAnswer: '🍎', incorrectAnswers: ['🍇', '🐝'] },
    { word: 'زنبور', correctAnswer: '🐝', incorrectAnswers: ['🐠', '🔥'] },
    { word: 'باران', correctAnswer: '🌧️', incorrectAnswers: ['🔥', '🚗'] },
    { word: 'ماشین', correctAnswer: '🚗', incorrectAnswers: ['✈️', '💡'] },
    { word: 'چراغ', correctAnswer: '💡', incorrectAnswers: ['🌊', '🍃'] },
    { word: 'دریا', correctAnswer: '🌊', incorrectAnswers: ['🍃', '🕊️'] },
    { word: 'برگ', correctAnswer: '🍃', incorrectAnswers: ['🕊️', '🔥'] },
    { word: 'کبوتر', correctAnswer: '🕊️', incorrectAnswers: ['🔥', '🎈'] },
    { word: 'بادکنک', correctAnswer: '🎈', incorrectAnswers: ['🐘', '🍆'] },
    { word: 'فیل', correctAnswer: '🐘', incorrectAnswers: ['🍆', '🐸'] },
    { word: 'بادمجان', correctAnswer: '🍆', incorrectAnswers: ['🐸', '🍓'] },
];
