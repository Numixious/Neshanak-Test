import { PaymentRecord, User } from '../types';

const PAYMENT_HISTORY_KEY = 'neshanak_payment_history';

export const savePaymentRecord = (paymentData: Omit<PaymentRecord, 'id'>) => {
    try {
        const newRecord: PaymentRecord = {
            id: `${Date.now()}-${paymentData.userId}`,
            ...paymentData,
        };

        const existingHistoryJSON = localStorage.getItem(PAYMENT_HISTORY_KEY);
        const allHistory: PaymentRecord[] = existingHistoryJSON ? JSON.parse(existingHistoryJSON) : [];

        allHistory.push(newRecord);

        localStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(allHistory));
    } catch (e) {
        console.error('Failed to save payment record.', e);
    }
};

export const getPaymentHistoryForUser = (userId: string): PaymentRecord[] => {
    try {
        const historyJSON = localStorage.getItem(PAYMENT_HISTORY_KEY);
        if (historyJSON) {
            const allHistory: PaymentRecord[] = JSON.parse(historyJSON);
            return allHistory
                .filter(record => record.userId === userId)
                .sort((a, b) => b.timestamp - a.timestamp);
        }
        return [];
    } catch (e) {
        console.error('Failed to retrieve payment history from localStorage', e);
        return [];
    }
};
