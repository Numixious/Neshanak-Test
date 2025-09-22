import React, { useState, useEffect } from 'react';
import { Screen, NavigationData, HistoryItem, User, Teacher } from './types';
import { CurriculumItem } from './data/curriculum';
import HomeScreen from './components/HomeScreen';
import ReadingScreen from './components/ReadingScreen';
import WritingScreen from './components/WritingScreen';
import Header from './components/shared/Header';
import AlphabetGameScreen from './components/AlphabetGameScreen';
import MenuCategoryScreen from './components/MenuCategoryScreen';
import ContentPlaceholderScreen from './components/ContentPlaceholderScreen';
import ReadingMenuScreen from './components/ReadingMenuScreen';
import SignsQuizScreen from './components/SignsQuizScreen';
import CombinationsScreen from './components/CombinationsScreen';
import CombinationsQuizScreen from './components/CombinationsQuizScreen';
import WordReadingScreen from './components/WordReadingScreen';
import WordReadingQuizScreen from './components/WordReadingQuizScreen';
import SentenceReadingScreen from './components/SentenceReadingScreen';
import SentenceReadingQuizScreen from './components/SentenceReadingQuizScreen';
import FluentReadingMenuScreen from './components/FluentReadingMenuScreen';
import FluentReadingStoryScreen from './components/FluentReadingStoryScreen';
import ComprehensionQuizScreen from './components/ComprehensionQuizScreen';
import { cancelSpeech } from './services/speechService';
import WritingMenuScreen from './components/WritingMenuScreen';
import LetterMatchingGameScreen from './components/LetterMatchingGameScreen';
import WritingSignsMcqScreen from './components/WritingSignsMcqScreen';
import WritingSignsLearnScreen from './components/WritingSignsLearnScreen';
import WritingSignsDictationScreen from './components/WritingSignsDictationScreen';
import WritingCombinationsMcqScreen from './components/WritingCombinationsMcqScreen';
import WritingCombinationsDictationScreen from './components/WritingCombinationsDictationScreen';
import WritingWordsMcqMenuScreen from './components/WritingWordsMcqMenuScreen';
import WritingWordsMcqQuizScreen from './components/WritingWordsMcqQuizScreen';
import WritingWordsDictationMenuScreen from './components/WritingWordsDictationMenuScreen';
import WritingWordsDictationQuizScreen from './components/WritingWordsDictationQuizScreen';
import SentenceUnscrambleMenuScreen from './components/SentenceUnscrambleMenuScreen';
import SentenceUnscrambleQuizScreen from './components/SentenceUnscrambleQuizScreen';
import FindMistakesMenuScreen from './components/FindMistakesMenuScreen';
import FindMistakesQuizScreen from './components/FindMistakesQuizScreen';
import Spinner from './components/shared/Spinner';
import LoginScreen from './components/auth/LoginScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import PaymentScreen from './components/PaymentScreen';
import AdminPanelScreen from './components/admin/AdminPanelScreen';
import TeachersListScreen from './components/TeachersListScreen';
import TeacherStudentsScreen from './components/TeacherStudentsScreen';
import UserProfileScreen from './components/UserProfileScreen';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('neshanakUser');
        if (storedUser) {
            const user: User = JSON.parse(storedUser);
            setCurrentUser(user);
            if (user.isAdmin || user.hasFreeAccess) {
                setHistory([{ screen: Screen.HOME }]);
            } else {
                setHistory([{ screen: Screen.PAYMENT }]);
            }
        } else {
            setHistory([{ screen: Screen.LOGIN }]);
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('neshanakUser');
        setHistory([{ screen: Screen.LOGIN }]);
    }
    setIsLoading(false);
  }, []);

  const navigateTo = (screen: Screen, data?: NavigationData) => {
    cancelSpeech();
    if (screen === Screen.HOME) {
      if (!currentUser) {
        setHistory([{ screen: Screen.LOGIN }]);
      } else if (!currentUser.hasFreeAccess && !currentUser.isAdmin) {
        setHistory([{ screen: Screen.PAYMENT }]);
      }
      else {
        setHistory([{ screen: Screen.HOME }]);
      }
    } else if (screen === Screen.LOGIN) {
      setHistory([{ screen: Screen.LOGIN }]);
    } else {
      setHistory(prev => [...prev, { screen, data }]);
    }
  };

  const handleLogin = (user: User) => {
    if (!user.isAdmin) {
        localStorage.setItem('neshanakUser', JSON.stringify(user));
    }
    setCurrentUser(user);
    cancelSpeech();
    if (user.isAdmin) {
        setHistory([{ screen: Screen.ADMIN_PANEL }]);
    } else if (user.hasFreeAccess) {
        setHistory([{ screen: Screen.HOME }]);
    } else {
        setHistory([{ screen: Screen.PAYMENT }]);
    }
  };

  const handleLogout = () => {
      cancelSpeech();
      localStorage.removeItem('neshanakUser');
      setCurrentUser(null);
      navigateTo(Screen.LOGIN);
  };
  
  const handlePaymentSuccess = () => {
    const storedUser = localStorage.getItem('neshanakUser');
    if (storedUser) {
        try {
            const user: User = JSON.parse(storedUser);
            setCurrentUser(user);
            navigateTo(Screen.HOME);
        } catch (error) {
            console.error("Failed to re-login after payment", error);
            handleLogout();
        }
    }
  };


  const currentHistoryItem = history.length > 0 ? history[history.length - 1] : null;
  const currentScreen = currentHistoryItem?.screen;
  const currentData = currentHistoryItem?.data;
  const activeItem = currentData?.menuItem ?? null;
  const activeStory = currentData?.story ?? null;
  const activeTeacher = currentData?.teacher ?? null;

  const navigateBack = () => {
    cancelSpeech();
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const renderScreen = () => {
    if (!currentHistoryItem) return null;

    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} navigateTo={navigateTo} />;
      case Screen.REGISTER:
        return <RegisterScreen onRegister={handleLogin} navigateTo={navigateTo} />;
      case Screen.PAYMENT:
        return <PaymentScreen onPaymentSuccess={handlePaymentSuccess} />;
      case Screen.ADMIN_PANEL:
        return <AdminPanelScreen />;
      case Screen.TEACHERS_LIST:
        return <TeachersListScreen navigateTo={navigateTo} />;
      case Screen.TEACHER_STUDENTS:
        return activeTeacher ? <TeacherStudentsScreen teacher={activeTeacher} /> : <TeachersListScreen navigateTo={navigateTo} />;
      case Screen.READING_MENU:
        return <ReadingMenuScreen navigateTo={navigateTo} />;
      case Screen.WRITING_MENU:
        return <WritingMenuScreen navigateTo={navigateTo} />;
      case Screen.READING:
        return <ReadingScreen />;
      case Screen.WRITING:
        return <WritingScreen />;
      case Screen.ALPHABET_GAME:
        return <AlphabetGameScreen />;
      case Screen.LETTER_MATCHING_GAME:
        return <LetterMatchingGameScreen />;
      case Screen.USER_PROFILE:
        return <UserProfileScreen currentUser={currentUser} />;
      case Screen.MENU_CATEGORY:
        return activeItem ? <MenuCategoryScreen category={activeItem} navigateTo={navigateTo} /> : <HomeScreen navigateTo={navigateTo} />;
      case Screen.CONTENT_PLACEHOLDER:
        return activeItem ? <ContentPlaceholderScreen item={activeItem} /> : <HomeScreen navigateTo={navigateTo} />;
      case Screen.SIGNS_QUIZ:
        return <SignsQuizScreen navigateTo={navigateTo} navigateBack={navigateBack} />;
      case Screen.COMBINATIONS_VIEW:
        return activeItem ? <CombinationsScreen item={activeItem} /> : <HomeScreen navigateTo={navigateTo} />;
      case Screen.COMBINATIONS_QUIZ:
        return <CombinationsQuizScreen navigateTo={navigateTo} navigateBack={navigateBack} />;
      case Screen.WORD_READING_LEVEL:
        return activeItem ? <WordReadingScreen item={activeItem} /> : <HomeScreen navigateTo={navigateTo} />;
      case Screen.WORD_READING_QUIZ:
        return <WordReadingQuizScreen navigateTo={navigateTo} navigateBack={navigateBack} />;
      case Screen.SENTENCE_READING_LEVEL:
        return activeItem ? <SentenceReadingScreen item={activeItem} /> : <HomeScreen navigateTo={navigateTo} />;
      case Screen.SENTENCE_READING_QUIZ:
        return <SentenceReadingQuizScreen navigateTo={navigateTo} navigateBack={navigateBack} />;
      case Screen.FLUENT_READING_MENU:
        return <FluentReadingMenuScreen navigateTo={navigateTo} />;
      case Screen.FLUENT_READING_STORY:
        return activeStory ? <FluentReadingStoryScreen story={activeStory} /> : <FluentReadingMenuScreen navigateTo={navigateTo} />;
      case Screen.COMPREHENSION_QUIZ:
        return <ComprehensionQuizScreen navigateTo={navigateTo} navigateBack={navigateBack} />;
      case Screen.WRITING_SIGNS_MCQ:
        return <WritingSignsMcqScreen navigateTo={navigateTo} navigateBack={navigateBack} />;
      case Screen.WRITING_SIGNS_LEARN:
        return <WritingSignsLearnScreen />;
      case Screen.WRITING_SIGNS_DICTATION:
        return <WritingSignsDictationScreen navigateTo={navigateTo} navigateBack={navigateBack} />;
      case Screen.WRITING_COMBINATIONS_MCQ:
        return <WritingCombinationsMcqScreen navigateTo={navigateTo} navigateBack={navigateBack} />;
      case Screen.WRITING_COMBINATIONS_DICTATION:
        return <WritingCombinationsDictationScreen navigateTo={navigateTo} navigateBack={navigateBack} />;
      case Screen.WRITING_WORDS_MCQ_MENU:
        return <WritingWordsMcqMenuScreen navigateTo={navigateTo} />;
      case Screen.WRITING_WORDS_MCQ_QUIZ:
        return currentData?.wordQuizGroup ? <WritingWordsMcqQuizScreen navigateTo={navigateTo} navigateBack={navigateBack} quizGroup={currentData.wordQuizGroup} /> : <WritingMenuScreen navigateTo={navigateTo} />;
      case Screen.WRITING_WORDS_DICTATION_MENU:
        return <WritingWordsDictationMenuScreen navigateTo={navigateTo} />;
      case Screen.WRITING_WORDS_DICTATION_QUIZ:
        return currentData?.wordDictationGroup ? <WritingWordsDictationQuizScreen navigateTo={navigateTo} navigateBack={navigateBack} quizGroup={currentData.wordDictationGroup} /> : <WritingMenuScreen navigateTo={navigateTo} />;
      case Screen.WRITING_SENTENCES_UNSCRAMBLE_MENU:
        return <SentenceUnscrambleMenuScreen navigateTo={navigateTo} />;
      case Screen.WRITING_SENTENCES_UNSCRAMBLE_QUIZ:
        return currentData?.sentenceUnscrambleGroup ? <SentenceUnscrambleQuizScreen navigateTo={navigateTo} navigateBack={navigateBack} quizGroup={currentData.sentenceUnscrambleGroup} /> : <WritingMenuScreen navigateTo={navigateTo} />;
      case Screen.WRITING_SENTENCES_FIND_MISTAKES_MENU:
        return <FindMistakesMenuScreen navigateTo={navigateTo} />;
      case Screen.WRITING_SENTENCES_FIND_MISTAKES_QUIZ:
        return currentData?.findMistakeGroup ? <FindMistakesQuizScreen navigateTo={navigateTo} navigateBack={navigateBack} quizGroup={currentData.findMistakeGroup} /> : <WritingMenuScreen navigateTo={navigateTo} />;
      case Screen.HOME:
      default:
        return <HomeScreen navigateTo={navigateTo} />;
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-background dark:bg-slate-900">
            <Spinner text="در حال بارگذاری..." size="lg" />
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-brand-text dark:text-slate-200 flex flex-col">
      <Header navigateTo={navigateTo} navigateBack={navigateBack} history={history} currentUser={currentUser} logout={handleLogout} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {renderScreen()}
      </main>
      <footer className="text-center p-4 text-slate-500 dark:text-slate-400 text-sm flex-shrink-0">
        ساخته شده با ❤️ برای همه بچه‌های ایران
      </footer>
    </div>
  );
};

export default App;
