import React from 'react';
import { savePaymentRecord } from '../services/paymentService';
import { User } from '../types';

interface PaymentScreenProps {
  onPaymentSuccess: () => void;
}

const CheckIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  );

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onPaymentSuccess }) => {

  const handlePaymentClick = (planName: string, amount: number) => {
      const storedUser = localStorage.getItem('neshanakUser');
      if (!storedUser) {
        alert('خطا: کاربر وارد نشده است. لطفاً دوباره وارد شوید.');
        return;
      }

      try {
        const currentUser: User = JSON.parse(storedUser);
        const trackingCode = `ZP-${Date.now()}`;
        
        savePaymentRecord({
          userId: currentUser.nationalId,
          planName,
          amount,
          trackingCode,
          timestamp: Date.now()
        });

        // Update user's access status
        const updatedUser = { ...currentUser, hasFreeAccess: true };
        localStorage.setItem('neshanakUser', JSON.stringify(updatedUser));

        alert(`پرداخت شما برای ${planName} با موفقیت شبیه‌سازی شد!\nکد رهگیری: ${trackingCode}\n\nشما اکنون دسترسی کامل دارید.`);
        onPaymentSuccess();
      } catch (error) {
        console.error("Payment simulation failed:", error);
        alert('متاسفانه در فرآیند پرداخت مشکلی پیش آمد.');
      }
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-8 text-center animate-slide-in-fwd-center">
      <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-slate-100 mb-4">یک طرح را انتخاب کنید</h2>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl">برای دسترسی کامل به تمام بخش‌های آموزشی و بازی‌های نشانک، لطفا یکی از طرح‌های زیر را فعال کنید.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Plan 1 */}
        <div className="flex flex-col p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border-2 border-transparent transition-all duration-300 hover:border-brand-primary hover:shadow-2xl hover:-translate-y-2">
            <h3 className="text-3xl font-extrabold text-brand-text dark:text-slate-100">طرح ۱ ماهه</h3>
            <p className="text-4xl font-bold text-brand-primary dark:text-brand-primary-light my-6">
                ۵۰,۰۰۰ <span className="text-lg text-slate-500 dark:text-slate-400">تومان</span>
            </p>
            <ul className="text-right space-y-3 text-lg text-slate-600 dark:text-slate-300 mb-8 flex-grow">
                <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>دسترسی کامل به بخش خواندن</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>دسترسی کامل به بخش نوشتن</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>بازی‌های تعاملی نامحدود</span></li>
            </ul>
            <button onClick={() => handlePaymentClick('طرح ۱ ماهه', 50000)} className="w-full py-4 text-xl font-bold rounded-full bg-[#FFC107] text-slate-800 hover:bg-amber-400 transition-colors shadow-md hover:shadow-lg">
                پرداخت با زرین‌پال
            </button>
        </div>

        {/* Plan 2 - Popular */}
        <div className="relative flex flex-col p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-4 border-brand-primary dark:border-brand-primary-light transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-primary text-white text-sm font-bold rounded-full">محبوب‌ترین</div>
            <h3 className="text-3xl font-extrabold text-brand-text dark:text-slate-100">طرح ۶ ماهه</h3>
            <p className="text-4xl font-bold text-brand-primary dark:text-brand-primary-light my-6">
                ۲۵۰,۰۰۰ <span className="text-lg text-slate-500 dark:text-slate-400">تومان</span>
            </p>
             <ul className="text-right space-y-3 text-lg text-slate-600 dark:text-slate-300 mb-8 flex-grow">
                <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>دسترسی کامل به بخش خواندن</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>دسترسی کامل به بخش نوشتن</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>بازی‌های تعاملی نامحدود</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>پشتیبانی ویژه</span></li>
            </ul>
            <button onClick={() => handlePaymentClick('طرح ۶ ماهه', 250000)} className="w-full py-4 text-xl font-bold rounded-full bg-[#FFC107] text-slate-800 hover:bg-amber-400 transition-colors shadow-md hover:shadow-lg">
                پرداخت با زرین‌پال
            </button>
        </div>

        {/* Plan 3 */}
        <div className="flex flex-col p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border-2 border-transparent transition-all duration-300 hover:border-brand-primary hover:shadow-2xl hover:-translate-y-2">
            <h3 className="text-3xl font-extrabold text-brand-text dark:text-slate-100">طرح ۱ ساله</h3>
            <p className="text-4xl font-bold text-brand-primary dark:text-brand-primary-light my-6">
                ۴۵۰,۰۰۰ <span className="text-lg text-slate-500 dark:text-slate-400">تومان</span>
            </p>
            <ul className="text-right space-y-3 text-lg text-slate-600 dark:text-slate-300 mb-8 flex-grow">
                 <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>دسترسی کامل به بخش خواندن</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>دسترسی کامل به بخش نوشتن</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>بازی‌های تعاملی نامحدود</span></li>
                <li className="flex items-center gap-3"><CheckIcon className="w-6 h-6 text-green-500" /><span>پشتیبانی ویژه</span></li>
            </ul>
             <button onClick={() => handlePaymentClick('طرح ۱ ساله', 450000)} className="w-full py-4 text-xl font-bold rounded-full bg-[#FFC107] text-slate-800 hover:bg-amber-400 transition-colors shadow-md hover:shadow-lg">
                پرداخت با زرین‌پال
            </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentScreen;