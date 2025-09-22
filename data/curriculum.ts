import { Screen } from '../types';

export interface CurriculumItem {
  id: string;
  title: string;
  description?: string;
  icon?: string; // emoji
  targetScreen?: Screen;
  subItems?: CurriculumItem[];
}

export const curriculum: CurriculumItem[] = [
  {
    id: 'signs',
    title: 'نشانه ها',
    icon: '🔤',
    description: 'یادگیری و بازی با حروف الفبا',
    targetScreen: Screen.MENU_CATEGORY,
    subItems: [
      { id: 'signs-learn', title: 'یادگیری نشانه‌ها', description: 'با شکل و صدای حروف آشنا شو', targetScreen: Screen.ALPHABET_GAME },
      { id: 'signs-game', title: 'بازی با نشانه‌ها', description: 'با حروف الفبا بازی کن', targetScreen: Screen.LETTER_MATCHING_GAME },
      { id: 'signs-quiz', title: 'خودآزمایی نشانه‌ها', description: 'دانسته‌هایت را بسنج', targetScreen: Screen.SIGNS_QUIZ },
    ],
  },
  {
    id: 'combinations',
    title: 'ترکیب‌ها',
    icon: '🔗',
    description: 'یادگیری ترکیب صداها با هم',
    targetScreen: Screen.MENU_CATEGORY,
    subItems: [
      { id: 'combinations-aa', title: 'آ', targetScreen: Screen.COMBINATIONS_VIEW },
      { id: 'combinations-oo', title: 'او', targetScreen: Screen.COMBINATIONS_VIEW },
      { id: 'combinations-ae', title: 'اَ', targetScreen: Screen.COMBINATIONS_VIEW },
      { id: 'combinations-o2', title: 'اُ', targetScreen: Screen.COMBINATIONS_VIEW },
      { id: 'combinations-e', title: 'اِ', targetScreen: Screen.COMBINATIONS_VIEW },
      { id: 'combinations-iy', title: 'ای', targetScreen: Screen.COMBINATIONS_VIEW },
      { id: 'combinations-quiz', title: 'خودآزمایی ترکیب‌ها', targetScreen: Screen.COMBINATIONS_QUIZ },
    ],
  },
  {
    id: 'word-reading',
    title: 'کلمه خوانی',
    icon: '📖',
    description: 'تمرین خواندن کلمه‌های ساده',
    targetScreen: Screen.MENU_CATEGORY,
    subItems: [
      { id: 'word-reading-1', title: 'سطح یک', targetScreen: Screen.WORD_READING_LEVEL },
      { id: 'word-reading-2', title: 'سطح دو', targetScreen: Screen.WORD_READING_LEVEL },
      { id: 'word-reading-3', title: 'سطح سه', targetScreen: Screen.WORD_READING_LEVEL },
      { id: 'word-reading-4', title: 'سطح چهار', targetScreen: Screen.WORD_READING_LEVEL },
      { id: 'word-reading-quiz', title: 'خودآزمایی کلمه‌خوانی', targetScreen: Screen.WORD_READING_QUIZ },
    ],
  },
  {
    id: 'sentence-reading',
    title: 'جمله خوانی',
    icon: '📃',
    description: 'تمرین خواندن جمله‌های کوتاه',
    targetScreen: Screen.MENU_CATEGORY,
    subItems: [
      { id: 'sentence-reading-1', title: 'سطح یک', targetScreen: Screen.SENTENCE_READING_LEVEL },
      { id: 'sentence-reading-2', title: 'سطح دو', targetScreen: Screen.SENTENCE_READING_LEVEL },
      { id: 'sentence-reading-3', title: 'سطح سه', targetScreen: Screen.SENTENCE_READING_LEVEL },
      { id: 'sentence-reading-4', title: 'سطح چهار', targetScreen: Screen.SENTENCE_READING_LEVEL },
      { id: 'sentence-reading-quiz', title: 'خودآزمایی جمله‌خوانی', targetScreen: Screen.SENTENCE_READING_QUIZ },
    ],
  },
  {
    id: 'fluent-reading',
    title: 'روان خوانی',
    icon: '📚',
    description: 'داستان‌های کوتاه بخوان و روان‌تر شو',
    targetScreen: Screen.FLUENT_READING_MENU,
  },
  {
    id: 'comprehension',
    title: 'درک مطلب',
    icon: '🧠',
    description: 'ببین چقدر از داستان را فهمیدی',
    targetScreen: Screen.COMPREHENSION_QUIZ,
  },
];