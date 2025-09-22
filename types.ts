import type { CurriculumItem } from './data/curriculum';
import { Story } from './data/fluentReadingData';

export enum Screen {
  HOME,
  READING_MENU,
  READING,
  WRITING,
  ALPHABET_GAME,
  MENU_CATEGORY,
  CONTENT_PLACEHOLDER,
  SIGNS_QUIZ,
  COMBINATIONS_VIEW,
  COMBINATIONS_QUIZ,
  WORD_READING_LEVEL,
  WORD_READING_QUIZ,
  SENTENCE_READING_LEVEL,
  SENTENCE_READING_QUIZ,
  FLUENT_READING_MENU,
  FLUENT_READING_STORY,
  COMPREHENSION_QUIZ,
  WRITING_MENU,
  LETTER_MATCHING_GAME,
  WRITING_SIGNS_MCQ,
  WRITING_SIGNS_LEARN,
  WRITING_SIGNS_DICTATION,
  WRITING_COMBINATIONS_MCQ,
  WRITING_COMBINATIONS_DICTATION,
  WRITING_WORDS_MCQ_MENU,
  WRITING_WORDS_MCQ_QUIZ,
  WRITING_WORDS_DICTATION_MENU,
  WRITING_WORDS_DICTATION_QUIZ,
  WRITING_SENTENCES_UNSCRAMBLE_MENU,
  WRITING_SENTENCES_UNSCRAMBLE_QUIZ,
  WRITING_SENTENCES_FIND_MISTAKES_MENU,
  WRITING_SENTENCES_FIND_MISTAKES_QUIZ,
  // New Screens
  LOGIN,
  REGISTER,
  PAYMENT,
  ADMIN_PANEL,
  TEACHERS_LIST,
  TEACHER_STUDENTS,
  USER_PROFILE,
}

export interface PaymentRecord {
  id: string;
  userId: string;
  planName: string;
  amount: number;
  trackingCode: string;
  timestamp: number;
}


export interface Teacher {
  id: string; // use referral code as ID
  firstName: string;
  lastName: string;
  referralCode: string;
  registeredAt: number;
  username?: string;
  password?: string;
}

export interface User {
  firstName: string;
  lastName: string;
  nationalId: string;
  password?: string;
  hasFreeAccess: boolean;
  isAdmin?: boolean;
  registeredAt: number;
  teacherReferralCode?: string;
}

export interface WordMcqQuestion {
  soundPrompt: string;
  soundToSpeak: string;
  correctAnswer: string;
  incorrectAnswer: string;
}

export interface WordQuizGroup {
  id: string;
  title: string;
  questions: WordMcqQuestion[];
}

export interface WordDictationQuestion {
  sound: string;
  answer: string;
}

export interface WordDictationGroup {
  id: string;
  title: string;
  questions: WordDictationQuestion[];
}

export interface SentenceUnscrambleGroup {
  id: string;
  title: string;
  sentences: string[];
}

export interface FindMistakeQuestion {
  sentence: string;
  answer: string;
}

export interface FindMistakeGroup {
  id: string;
  title: string;
  questions: FindMistakeQuestion[];
}


export type NavigationData = {
    menuItem: CurriculumItem;
    story?: Story;
    wordQuizGroup?: WordQuizGroup;
    wordDictationGroup?: WordDictationGroup;
    sentenceUnscrambleGroup?: SentenceUnscrambleGroup;
    findMistakeGroup?: FindMistakeGroup;
    teacher?: Teacher;
};

export type HistoryItem = {
  screen: Screen;
  data?: NavigationData;
};

export interface TestResult {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
}