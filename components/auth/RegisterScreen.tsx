import React, { useState } from 'react';
import { Screen, User } from '../../types';
import * as adminService from '../../services/adminService';

interface RegisterScreenProps {
  onRegister: (user: User) => void;
  navigateTo: (screen: Screen) => void;
}

const SparrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22.16,7.57a1,1,0,0,0-1.05.09l-4.5,3.18-1.55-3.3a1,1,0,0,0-.9-.56H3a1,1,0,0,0,0,2h9.45l2.42,5.13-3.6,1.6A1,1,0,0,0,11,17.2a6,6,0,1,0,8.49-8.49A1,1,0,0,0,22.16,7.57ZM17,19a4,4,0,1,1,4-4A4,4,0,0,1,17,19Z" />
    </svg>
);

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, navigateTo }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !nationalId || !password) {
      setError('لطفاً تمام اطلاعات خواسته شده را وارد کنید.');
      return;
    }
    
    const existingUser = localStorage.getItem(`neshanak_user_${nationalId}`);
    if (existingUser) {
      setError('این کد ملی قبلاً ثبت‌نام کرده است.');
      return;
    }

    let hasFreeAccess = false;
    let teacherCode: string | undefined = undefined;
    const trimmedReferralCode = referralCode.trim();
  
    if (trimmedReferralCode) {
        if (trimmedReferralCode === '200') {
            hasFreeAccess = true;
        } else {
            const allTeachers = adminService.getAllTeachers();
            const teacher = allTeachers.find(t => t.referralCode === trimmedReferralCode);
            if (teacher) {
                hasFreeAccess = true;
                teacherCode = teacher.referralCode;
            } else {
                setError('کد معرف وارد شده معتبر نیست.');
                return;
            }
        }
    }

    const newUser: User = {
      firstName,
      lastName,
      nationalId,
      password,
      hasFreeAccess,
      teacherReferralCode: teacherCode,
      registeredAt: Date.now(),
    };
    
    localStorage.setItem(`neshanak_user_${nationalId}`, JSON.stringify(newUser));

    onRegister(newUser);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center animate-jump-in">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
            <SparrowIcon className="w-16 h-16 text-brand-primary dark:text-brand-primary-light" />
            <h2 className="text-4xl font-extrabold text-brand-text dark:text-slate-100 mt-2">
                ساخت حساب کاربری
            </h2>
        </div>
        
        {error && (
            <div className="p-3 mb-4 text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/50 rounded-lg">
                {error}
            </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="نام"
            className="w-full p-4 text-xl text-right border-2 bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 border-brand-primary-light dark:border-brand-primary rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition duration-300"
            required
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="نام خانوادگی"
            className="w-full p-4 text-xl text-right border-2 bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 border-brand-primary-light dark:border-brand-primary rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition duration-300"
            required
          />
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
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="کد معرف (اختیاری)"
            className="w-full p-4 text-xl text-right border-2 bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 border-brand-primary-light dark:border-brand-primary rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition duration-300"
          />
          <button
            type="submit"
            className="w-full py-4 px-6 mt-4 text-2xl font-bold text-white bg-brand-primary rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            ثبت‌نام
          </button>
        </form>
        <p className="mt-6 text-slate-600 dark:text-slate-400">
          قبلاً ثبت‌نام کردی؟{' '}
          <button onClick={() => navigateTo(Screen.LOGIN)} className="font-bold text-brand-secondary hover:underline">
            وارد شو
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;