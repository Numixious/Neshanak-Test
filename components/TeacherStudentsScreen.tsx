import React, { useState, useEffect } from 'react';
import { Teacher, User } from '../types';
import * as adminService from '../services/adminService';
import Spinner from './shared/Spinner';

interface TeacherStudentsScreenProps {
  teacher: Teacher;
}

const TeacherStudentsScreen: React.FC<TeacherStudentsScreenProps> = ({ teacher }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allUsers = adminService.getAllUsers();
    const teacherStudents = allUsers.filter(user => user.teacherReferralCode === teacher.referralCode);
    setStudents(teacherStudents);
    setIsLoading(false);
  }, [teacher]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner text="در حال بارگذاری لیست دانش‌آموزان..." size="lg" />
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-jump-in">
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-text dark:text-slate-100 mb-2">
                دانش‌آموزان مدرس: {teacher.firstName} {teacher.lastName}
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">کد معرف: <span className="font-mono font-bold">{teacher.referralCode}</span></p>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-md">
            <table className="w-full text-right">
                <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                        <th className="p-4 font-semibold">نام</th>
                        <th className="p-4 font-semibold">نام خانوادگی</th>
                        <th className="p-4 font-semibold">کد ملی</th>
                        <th className="p-4 font-semibold">تاریخ ثبت نام</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.nationalId} className="border-t border-slate-200 dark:border-slate-700">
                            <td className="p-4">{student.firstName}</td>
                            <td className="p-4">{student.lastName}</td>
                            <td className="p-4 font-mono">{student.nationalId}</td>
                            <td className="p-4">{new Date(student.registeredAt).toLocaleDateString('fa-IR')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {students.length === 0 && <p className="p-4 text-center text-slate-500">این مدرس هنوز دانش‌آموزی ندارد.</p>}
        </div>
    </div>
  );
};

export default TeacherStudentsScreen;
