import React from 'react';
import { Screen, HistoryItem, User } from '../../types';
import ThemeToggleButton from './ThemeToggleButton';

interface HeaderProps {
  navigateTo: (screen: Screen) => void;
  navigateBack: () => void;
  history: HistoryItem[];
  currentUser: User | null;
  logout: () => void;
}

const HomeIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
    </svg>
);

const SparrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22.16,7.57a1,1,0,0,0-1.05.09l-4.5,3.18-1.55-3.3a1,1,0,0,0-.9-.56H3a1,1,0,0,0,0,2h9.45l2.42,5.13-3.6,1.6A1,1,0,0,0,11,17.2a6,6,0,1,0,8.49-8.49A1,1,0,0,0,22.16,7.57ZM17,19a4,4,0,1,1,4-4A4,4,0,0,1,17,19Z" />
    </svg>
);

const BackIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
    </svg>
);

const LogoutIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  );

const AdminIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 5.25h5.9c-.15-1.002-.932-1.664-1.85-1.664h.001zM9 7.5v1.5a.75.75 0 01-1.5 0v-1.5h-3a3 3 0 00-3 3v6a3 3 0 003 3h9a3 3 0 003-3v-6a3 3 0 00-3-3h-3z" clipRule="evenodd" />
    <path d="M12 9a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 9zm-2.25-.75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5h-.008zM14.25.75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5h-.008z" />
  </svg>
);

const UserProfileIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ navigateTo, navigateBack, history, currentUser, logout }) => {
  const currentScreen = history.length > 0 ? history[history.length - 1].screen : null;
  const showNavButtons = currentUser && !currentUser.isAdmin && history.length > 1 && ![Screen.PAYMENT, Screen.LOGIN, Screen.REGISTER].includes(currentScreen!);
  const isTeacherSection = !currentUser && history.length > 1 && (currentScreen === Screen.TEACHERS_LIST || currentScreen === Screen.TEACHER_STUDENTS);


  return (
    <header className="w-full p-4 flex justify-end sm:justify-between items-center bg-white/50 dark:bg-slate-900/70 backdrop-blur-sm shadow-md rounded-b-2xl sticky top-0 z-50">
      <div className="hidden sm:flex items-center gap-3">
        <SparrowIcon className="w-10 h-10 text-brand-primary dark:text-brand-primary-light" />
        <h1 className="text-4xl font-extrabold text-brand-primary dark:text-brand-primary-light">نشانک</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {showNavButtons && (
          <>
            <button
              onClick={navigateBack}
              className="flex items-center justify-center gap-2 bg-white text-brand-primary hover:bg-brand-primary hover:text-white dark:bg-slate-800 dark:text-brand-primary-light dark:hover:bg-brand-primary-light dark:hover:text-slate-900 transition-all duration-300 font-bold p-3 sm:py-2 sm:px-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="بازگشت"
            >
              <BackIcon className="w-6 h-6" />
              <span className="hidden sm:inline">بازگشت</span>
            </button>
            <button
              onClick={() => navigateTo(Screen.HOME)}
              className="flex items-center justify-center gap-2 bg-white text-brand-secondary hover:bg-brand-secondary hover:text-white dark:bg-slate-800 dark:text-brand-secondary dark:hover:bg-brand-secondary dark:hover:text-white transition-all duration-300 font-bold p-3 sm:py-2 sm:px-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="خانه"
            >
                <HomeIcon className="w-6 h-6" />
                <span className="hidden sm:inline">خانه</span>
            </button>
          </>
        )}
        {isTeacherSection && (
           <>
            <button
              onClick={navigateBack}
              className="flex items-center justify-center gap-2 bg-white text-brand-primary hover:bg-brand-primary hover:text-white dark:bg-slate-800 dark:text-brand-primary-light dark:hover:bg-brand-primary-light dark:hover:text-slate-900 transition-all duration-300 font-bold p-3 sm:py-2 sm:px-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="بازگشت"
            >
              <BackIcon className="w-6 h-6" />
              <span className="hidden sm:inline">بازگشت</span>
            </button>
             <button
                onClick={() => navigateTo(Screen.LOGIN)}
                className="flex items-center justify-center gap-2 bg-white text-red-500 hover:bg-red-500 hover:text-white dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white transition-all duration-300 font-bold p-3 sm:py-2 sm:px-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                aria-label="خروج"
            >
                <LogoutIcon className="w-6 h-6" />
                <span className="hidden sm:inline">خروج</span>
            </button>
           </>
        )}
        {currentUser?.isAdmin && (
            <button
              onClick={() => navigateTo(Screen.ADMIN_PANEL)}
              className="flex items-center justify-center gap-2 bg-white text-brand-primary hover:bg-brand-primary hover:text-white dark:bg-slate-800 dark:text-brand-primary-light dark:hover:bg-brand-primary-light dark:hover:text-slate-900 transition-all duration-300 font-bold p-3 sm:py-2 sm:px-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="پنل مدیریت"
            >
              <AdminIcon className="w-6 h-6" />
              <span className="hidden sm:inline">پنل مدیریت</span>
            </button>
        )}
        {currentUser && !currentUser.isAdmin && (
             <button
                onClick={() => navigateTo(Screen.USER_PROFILE)}
                className="flex items-center justify-center gap-2 bg-white text-brand-primary hover:bg-brand-primary hover:text-white dark:bg-slate-800 dark:text-brand-primary-light dark:hover:bg-brand-primary-light dark:hover:text-slate-900 transition-all duration-300 font-bold p-3 sm:py-2 sm:px-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                aria-label="پنل کاربری"
            >
                <UserProfileIcon className="w-6 h-6" />
                <span className="hidden sm:inline">پنل کاربری</span>
            </button>
        )}
        {currentUser && (
             <button
                onClick={logout}
                className="flex items-center justify-center gap-2 bg-white text-red-500 hover:bg-red-500 hover:text-white dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white transition-all duration-300 font-bold p-3 sm:py-2 sm:px-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                aria-label="خروج"
            >
                <LogoutIcon className="w-6 h-6" />
                <span className="hidden sm:inline">خروج</span>
            </button>
        )}
        <ThemeToggleButton />
      </div>
    </header>
  );
};

export default Header;