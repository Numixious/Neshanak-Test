

import { Screen } from '../types';
import type { CurriculumItem } from './curriculum';

export const writingCurriculum: CurriculumItem[] = [
  {
    id: 'writing-signs',
    title: 'نشانه نویسی',
    icon: '✏️',
    description: 'تمرین نوشتن نشانه‌ها با روش‌های مختلف',
    targetScreen: Screen.MENU_CATEGORY,
    subItems: [
      { id: 'writing-signs-review', title: 'نشانه‌ها', description: 'یادآوری و مرور شکل نوشتاری نشانه‌ها', targetScreen: Screen.WRITING_SIGNS_LEARN },
      { id: 'writing-signs-mcq', title: 'املای دوگزینه‌ای', description: 'با شنیدن صدا، نشانه درست را انتخاب کن', targetScreen: Screen.WRITING_SIGNS_MCQ },
      { id: 'writing-signs-dictation', title: 'املای نشانه‌ها', description: 'با شنیدن صدا، نشانه را بنویس', targetScreen: Screen.WRITING_SIGNS_DICTATION },
    ],
  },
  {
    id: 'writing-combinations',
    title: 'ترکیب نویسی',
    icon: '✍️',
    description: 'تمرین نوشتن ترکیب‌های صدادار',
    targetScreen: Screen.MENU_CATEGORY,
    subItems: [
      { id: 'writing-combinations-mcq', title: 'املای دوگزینه‌ای', description: 'املای ترکیب‌ها به صورت چند گزینه‌ای', targetScreen: Screen.WRITING_COMBINATIONS_MCQ },
      { id: 'writing-combinations-dictation', title: 'املای ترکیبها', description: 'با شنیدن صدا، ترکیب را بنویس', targetScreen: Screen.WRITING_COMBINATIONS_DICTATION },
    ],
  },
  {
    id: 'writing-words',
    title: 'کلمه نویسی',
    icon: '📝',
    description: 'تمرین نوشتن کلمه‌های ساده و کاربردی',
    targetScreen: Screen.MENU_CATEGORY,
    subItems: [
      { id: 'writing-words-mcq', title: 'املای دوگزینه‌ای', description: 'املای کلمه‌ها به صورت چند گزینه‌ای', targetScreen: Screen.WRITING_WORDS_MCQ_MENU },
      { id: 'writing-words-dictation', title: 'املای کلمه‌ها', description: 'کلمه‌ای که می‌شنوی را بنویس', targetScreen: Screen.WRITING_WORDS_DICTATION_MENU },
      { id: 'writing-words-pictorial', title: 'املای تصویری', description: 'نام تصویری که می‌بینی را بنویس', targetScreen: Screen.CONTENT_PLACEHOLDER },
    ],
  },
  {
    id: 'writing-sentences',
    title: 'جمله نویسی',
    icon: '📄',
    description: 'تمرین ساختن و نوشتن جمله‌های کامل',
    targetScreen: Screen.MENU_CATEGORY,
    subItems: [
      { id: 'writing-sentences-unscramble', title: 'مرتب کن!', description: 'کلمات درهم‌ریخته را مرتب کن تا جمله بسازی', targetScreen: Screen.WRITING_SENTENCES_UNSCRAMBLE_MENU },
      { id: 'writing-sentences-find-mistakes', title: 'غلط‌ها را پیدا کن!', description: 'اشتباهات جمله را پیدا و درست کن', targetScreen: Screen.WRITING_SENTENCES_FIND_MISTAKES_MENU },
      { id: 'writing-sentences-freewrite', title: 'هرچه دوست داری بنویس!', description: 'با دیدن یک عکس، یک جمله درباره‌اش بنویس', targetScreen: Screen.WRITING },
    ],
  },
];