import React, { useState, useEffect } from 'react';
import { User, PaymentRecord } from '../types';
import * as paymentService from '../services/paymentService';
import Spinner from './shared/Spinner';

interface UserProfileScreenProps {
  currentUser: User | null;
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ currentUser }) => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const history = paymentService.getPaymentHistoryForUser(currentUser.nationalId);
      setPaymentHistory(history);
    }
    setIsLoading(false);
  }, [currentUser]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;
  }
  
  if (!currentUser) {
    return <div className="text-center text-xl text-red-500 p-8">خطا: اطلاعات کاربری یافت نشد.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-jump-in">
      <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text dark:text-slate-100 mb-8 text-center">پنل کاربری</h2>

      {/* User Info Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-2xl font-bold text-brand-primary dark:text-brand-primary-light mb-4 border-b-2 border-slate-200 dark:border-slate-700 pb-2">مشخصات شما</h3>
        <div className="space-y-3 text-lg">
          <p><span className="font-semibold text-slate-500 dark:text-slate-400">نام:</span> {currentUser.firstName}</p>
          <p><span className="font-semibold text-slate-500 dark:text-slate-400">نام خانوادگی:</span> {currentUser.lastName}</p>
          <p><span className="font-semibold text-slate-500 dark:text-slate-400">کد ملی:</span> {currentUser.nationalId}</p>
        </div>
      </div>

      {/* Payment History Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold text-brand-primary dark:text-brand-primary-light mb-4 border-b-2 border-slate-200 dark:border-slate-700 pb-2">سابقه پرداخت</h3>
        {paymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 font-semibold">طرح</th>
                  <th className="p-3 font-semibold">مبلغ (تومان)</th>
                  <th className="p-3 font-semibold">کد رهگیری</th>
                  <th className="p-3 font-semibold">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map(record => (
                  <tr key={record.id} className="border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                    <td className="p-3">{record.planName}</td>
                    <td className="p-3">{record.amount.toLocaleString('fa-IR')}</td>
                    <td className="p-3 font-mono text-sm">{record.trackingCode}</td>
                    <td className="p-3">{new Date(record.timestamp).toLocaleDateString('fa-IR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-4">
            هیچ سابقه‌ی پرداختی برای شما ثبت نشده است.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfileScreen;
