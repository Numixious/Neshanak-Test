import React, { useState, useEffect } from 'react';
import { Screen, NavigationData, Teacher } from '../types';
import * as adminService from '../services/adminService';
import Spinner from './shared/Spinner';

interface TeachersListScreenProps {
  navigateTo: (screen: Screen, data?: NavigationData) => void;
}

const TeachersListScreen: React.FC<TeachersListScreenProps> = ({ navigateTo }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTeachers(adminService.getAllTeachers());
    setIsLoading(false);
  }, []);

  const handleTeacherClick = (teacher: Teacher) => {
    navigateTo(Screen.TEACHER_STUDENTS, { menuItem: { id: 'teacher_students', title: '' }, teacher });
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner text="در حال بارگذاری..." size="lg" />
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 md:p-8 text-center animate-jump-in">
      <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-slate-100 mb-4">اسامی مدرسین</h2>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">برای مشاهده‌ی لیست دانش‌آموزان، روی نام مدرس کلیک کنید.</p>

      {teachers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
          {teachers.map(teacher => (
               <button
                  key={teacher.id}
                  onClick={() => handleTeacherClick(teacher)}
                  className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center text-center min-h-[150px]"
              >
                  <div className="text-5xl mb-4">👨‍🏫</div>
                  <h3 className="text-2xl font-bold text-brand-primary dark:text-brand-primary-light">
                      {teacher.firstName} {teacher.lastName}
                  </h3>
              </button>
          ))}
        </div>
      ) : (
        <p className="text-xl text-slate-500 dark:text-slate-400">در حال حاضر مدرسی ثبت نشده است.</p>
      )}
    </div>
  );
};

export default TeachersListScreen;
