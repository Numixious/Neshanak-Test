import { User, TestResult, Teacher } from '../types';

const USER_PREFIX = 'neshanak_user_';
const RESULTS_KEY = 'neshanak_test_results';
const TEACHERS_KEY = 'neshanak_teachers';


export const getAllUsers = (): User[] => {
  const users: User[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(USER_PREFIX)) {
      try {
        const userData = JSON.parse(localStorage.getItem(key)!);
        const user: User = {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            nationalId: userData.nationalId,
            password: userData.password,
            hasFreeAccess: userData.hasFreeAccess || false,
            registeredAt: userData.registeredAt || Date.now(),
            teacherReferralCode: userData.teacherReferralCode,
        };
        users.push(user);
      } catch (e) {
        console.error(`Failed to parse user from localStorage with key: ${key}`, e);
      }
    }
  }
  return users.sort((a, b) => b.registeredAt - a.registeredAt);
};

export const updateUser = (user: User): boolean => {
    try {
        const key = `${USER_PREFIX}${user.nationalId}`;
        const existingUserJSON = localStorage.getItem(key);
        if(!existingUserJSON) return false;

        const existingUser = JSON.parse(existingUserJSON);
        const updatedUser = { ...existingUser, ...user };

        localStorage.setItem(key, JSON.stringify(updatedUser));
        return true;
    } catch (e) {
        console.error('Failed to update user in localStorage', e);
        return false;
    }
};

export const deleteUser = (nationalId: string): boolean => {
    try {
        const key = `${USER_PREFIX}${nationalId}`;
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Failed to delete user from localStorage', e);
        return false;
    }
};

export const createUser = (firstName: string, lastName: string, nationalId: string, hasFreeAccess: boolean): { success: boolean, message: string } => {
    try {
        if (!firstName.trim() || !lastName.trim()) {
            return { success: false, message: 'نام و نام خانوادگی الزامی است.' };
        }
        if (!nationalId.trim()) {
            return { success: false, message: 'کد ملی الزامی است.' };
        }
        if (!/^\d+$/.test(nationalId)) {
            return { success: false, message: 'کد ملی باید فقط شامل اعداد باشد.' };
        }

        const key = `${USER_PREFIX}${nationalId}`;
        if (localStorage.getItem(key)) {
            return { success: false, message: 'کاربری با این کد ملی از قبل وجود دارد.' };
        }
        
        const newUser: User = {
            firstName,
            lastName,
            nationalId,
            hasFreeAccess,
            registeredAt: Date.now(),
            password: nationalId, // Default password is the national ID
        };
        
        localStorage.setItem(key, JSON.stringify(newUser));
        return { success: true, message: 'کاربر با موفقیت ایجاد شد.' };

    } catch (e) {
        console.error('Failed to create user in localStorage', e);
        return { success: false, message: 'خطایی در ایجاد کاربر رخ داد.' };
    }
};

export const getAllTestResults = (): TestResult[] => {
    try {
        const resultsJSON = localStorage.getItem(RESULTS_KEY);
        if (resultsJSON) {
            const results: TestResult[] = JSON.parse(resultsJSON);
            return results.sort((a, b) => b.timestamp - a.timestamp);
        }
        return [];
    } catch (e) {
        console.error('Failed to retrieve test results from localStorage', e);
        return [];
    }
};

export const getAllTeachers = (): Teacher[] => {
    try {
      const teachersJSON = localStorage.getItem(TEACHERS_KEY);
      if (teachersJSON) {
        const teachers: Teacher[] = JSON.parse(teachersJSON);
        return teachers.sort((a, b) => b.registeredAt - a.registeredAt);
      }
      return [];
    } catch (e) {
      console.error('Failed to retrieve teachers from localStorage', e);
      return [];
    }
  };
  
const generateReferralCode = (): string => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const generateStrongPassword = (): string => {
    const length = 10;
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()";
    const all = lower + upper + numbers + symbols;

    let password = "";
    // Ensure the password has at least one of each character type
    password += lower.charAt(Math.floor(Math.random() * lower.length));
    password += upper.charAt(Math.floor(Math.random() * upper.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    // Fill the rest of the password length with random characters
    for (let i = password.length; i < length; i++) {
        password += all.charAt(Math.floor(Math.random() * all.length));
    }

    // Shuffle the characters to avoid a predictable pattern
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};
  
export const createTeacher = (firstName: string, lastName: string): { success: boolean, message: string, teacher?: Teacher } => {
    if (!firstName.trim() || !lastName.trim()) {
        return { success: false, message: 'نام و نام خانوادگی الزامی است.' };
    }
    try {
        const allTeachers = getAllTeachers();
        let newCode;
        do {
            newCode = generateReferralCode();
        } while (allTeachers.some(t => t.referralCode === newCode));

        const username = `teacher_${newCode.slice(-4)}`;
        const password = generateStrongPassword();

        const newTeacher: Teacher = {
            id: newCode,
            firstName,
            lastName,
            referralCode: newCode,
            registeredAt: Date.now(),
            username,
            password,
        };

        allTeachers.push(newTeacher);
        localStorage.setItem(TEACHERS_KEY, JSON.stringify(allTeachers));
        return { success: true, message: 'مدرس با موفقیت ایجاد شد.', teacher: newTeacher };
    } catch (e) {
        console.error('Failed to create teacher', e);
        return { success: false, message: 'خطایی در ایجاد مدرس رخ داد.' };
    }
};