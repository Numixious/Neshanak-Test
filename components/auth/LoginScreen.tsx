import React, { useState } from 'react';
import { Screen, User } from '../../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  navigateTo: (screen: Screen) => void;
}

const SparrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22.16,7.57a1,1,0,0,0-1.05.09l-4.5,3.18-1.55-3.3a1,1,0,0,0-.9-.56H3a1,1,0,0,0,0,2h9.45l2.42,5.13-3.6,1.6A1,1,0,0,0,11,17.2a6,6,0,1,0,8.49-8.49A1,1,0,0,0,22.16,7.57ZM17,19a4,4,0,1,1,4-4A4,4,0,0,1,17,19Z" />
    </svg>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, navigateTo }) => {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nationalId || !password) {
      setError('لطفاً کد ملی و رمز عبور را وارد کنید.');
      return;
    }

    // Hardcoded admin credentials
    if (nationalId === '10001000' && password === '@10001000') {
      // FIX: Add missing firstName and lastName properties to the admin user object.
      const adminUser: User = {
        firstName: 'Admin',
        lastName: 'User',
        nationalId: '10001000',
        hasFreeAccess: true,
        isAdmin: true,
        registeredAt: Date.now(),
      };
      onLogin(adminUser);
      return;
    }

    const storedUser = localStorage.getItem(`neshanak_user_${nationalId}`);
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        if (user.password === password) {
            onLogin(user);
        } else {
            setError('رمز عبور اشتباه است.');
        }
      } catch (e) {
         setError('اطلاعات کاربر نامعتبر است.');
      }
    } else {
      setError('کاربری با این مشخصات یافت نشد.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center animate-jump-in">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
            <SparrowIcon className="w-16 h-16 text-brand-primary dark:text-brand-primary-light" />
            <h2 className="text-4xl font-extrabold text-brand-text dark:text-slate-100 mt-2">
                ورود به نشانک
            </h2>
        </div>
        
        {error && (
            <div className="p-3 mb-4 text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/50 rounded-lg">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            placeholder="کد ملی"
            className="w-full p-4 text-xl text-right border-2 bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 border-brand-primary-light dark:border-brand-primary rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition duration-300"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            className="w-full p-4 text-xl text-right border-2 bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 border-brand-primary-light dark:border-brand-primary rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition duration-300"
            required
          />
          <button
            type="submit"
            className="w-full py-4 px-6 mt-4 text-2xl font-bold text-white bg-brand-primary rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            ورود
          </button>
        </form>
        <p className="mt-6 text-slate-600 dark:text-slate-400">
          حساب کاربری نداری؟{' '}
          <button onClick={() => navigateTo(Screen.REGISTER)} className="font-bold text-brand-secondary hover:underline">
            ثبت‌نام کن
          </button>
        </p>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={() => navigateTo(Screen.TEACHERS_LIST)} className="text-slate-600 dark:text-slate-400 hover:underline">
                بخش مدرسین
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;