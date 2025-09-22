export interface QuizQuestion {
    letter: string;
    correctAnswer: string;
    incorrectAnswer: string;
}

export const signsQuizData: QuizQuestion[] = [
    { letter: 'آ', correctAnswer: 'صدای آ', incorrectAnswer: 'صدای اَ' },
    { letter: 'ب', correctAnswer: 'صدای ب', incorrectAnswer: 'صدای پ' },
    { letter: 'پ', correctAnswer: 'صدای پ', incorrectAnswer: 'صدای ب' },
    { letter: 'ت', correctAnswer: 'صدای ت', incorrectAnswer: 'صدای ط' },
    { letter: 'ث', correctAnswer: 'صدای ث', incorrectAnswer: 'صدای س' },
    { letter: 'ج', correctAnswer: 'صدای ج', incorrectAnswer: 'صدای چ' },
    { letter: 'چ', correctAnswer: 'صدای چ', incorrectAnswer: 'صدای ج' },
    { letter: 'ح', correctAnswer: 'صدای ح', incorrectAnswer: 'صدای ه' },
    { letter: 'خ', correctAnswer: 'صدای خ', incorrectAnswer: 'صدای ق' },
    { letter: 'د', correctAnswer: 'صدای د', incorrectAnswer: 'صدای ذ' },
    { letter: 'ذ', correctAnswer: 'صدای ذ', incorrectAnswer: 'صدای ز' },
    { letter: 'ر', correctAnswer: 'صدای ر', incorrectAnswer: 'صدای ل' },
    { letter: 'ز', correctAnswer: 'صدای ز', incorrectAnswer: 'صدای ذ' },
    { letter: 'ژ', correctAnswer: 'صدای ژ', incorrectAnswer: 'صدای ج' },
    { letter: 'س', correctAnswer: 'صدای س', incorrectAnswer: 'صدای ص' },
    { letter: 'ش', correctAnswer: 'صدای ش', incorrectAnswer: 'صدای س' },
    { letter: 'ص', correctAnswer: 'صدای ص', incorrectAnswer: 'صدای س' },
    { letter: 'ض', correctAnswer: 'صدای ض', incorrectAnswer: 'صدای ز' },
    { letter: 'ط', correctAnswer: 'صدای ط', incorrectAnswer: 'صدای ت' },
    { letter: 'ظ', correctAnswer: 'صدای ظ', incorrectAnswer: 'صدای ز' },
    { letter: 'ع', correctAnswer: 'صدای ع', incorrectAnswer: 'صدای ا' },
    { letter: 'غ', correctAnswer: 'صدای غ', incorrectAnswer: 'صدای ق' },
    { letter: 'ف', correctAnswer: 'صدای ف', incorrectAnswer: 'صدای ق' },
    { letter: 'ق', correctAnswer: 'صدای ق', incorrectAnswer: 'صدای غ' },
    { letter: 'ک', correctAnswer: 'صدای ک', incorrectAnswer: 'صدای ق' },
    { letter: 'گ', correctAnswer: 'صدای گ', incorrectAnswer: 'صدای ک' },
    { letter: 'ل', correctAnswer: 'صدای ل', incorrectAnswer: 'صدای ر' },
    { letter: 'م', correctAnswer: 'صدای م', incorrectAnswer: 'صدای ن' },
    { letter: 'ن', correctAnswer: 'صدای ن', incorrectAnswer: 'صدای م' },
    { letter: 'و', correctAnswer: 'صدای و', incorrectAnswer: 'صدای او' },
    { letter: 'ه', correctAnswer: 'صدای ه', incorrectAnswer: 'صدای ح' },
    { letter: 'ی', correctAnswer: 'صدای ی', incorrectAnswer: 'صدای ای' },
];
