import { TestResult, User } from '../types';

const RESULTS_KEY = 'neshanak_test_results';

export const saveTestResult = (resultData: Omit<TestResult, 'id' | 'userId'>) => {
    try {
        const currentUserJSON = localStorage.getItem('neshanakUser');
        if (!currentUserJSON) {
            // Not logged in, don't save.
            return;
        }

        const currentUser: User = JSON.parse(currentUserJSON);
        // Don't save results for admin
        if (currentUser.isAdmin) {
            return;
        }

        const newResult: TestResult = {
            id: `${Date.now()}-${currentUser.nationalId}`,
            userId: currentUser.nationalId,
            ...resultData,
        };

        const existingResultsJSON = localStorage.getItem(RESULTS_KEY);
        const allResults: TestResult[] = existingResultsJSON ? JSON.parse(existingResultsJSON) : [];

        allResults.push(newResult);

        localStorage.setItem(RESULTS_KEY, JSON.stringify(allResults));

    } catch (e) {
        console.error('Failed to save test result.', e);
    }
};
