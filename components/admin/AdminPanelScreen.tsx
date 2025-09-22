import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, TestResult, Teacher } from '../../types';
import * as adminService from '../../services/adminService';
import Spinner from '../shared/Spinner';

// --- Icons ---
const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 21h16.5M16.5 3.75h.008v.008H16.5V3.75z" />
    </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.318.232-.645.335-.972a4.875 4.875 0 005.12-3.283l.295-.922c.052-.162.1- .329.143-.495a2.525 2.525 0 00-4.116-2.886A4.875 4.875 0 0011.333 6c-1.55 0-2.958.5-4.04 1.332a4.875 4.875 0 00-5.405 2.223C2.15 11.217 2 11.614 2 12c0 1.55.5 2.958 1.332 4.04A4.875 4.875 0 008.624 21a12.318 12.318 0 016.376-1.872z" />
    </svg>
);

const TestResultsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);


const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md flex items-center gap-4">
        <div className="bg-brand-primary-light/30 dark:bg-brand-primary/50 p-4 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">{title}</p>
            <p className="text-4xl font-bold text-brand-text dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const DashboardTab: React.FC<{ users: User[] }> = ({ users }) => {
    const stats = useMemo(() => {
        const totalUsers = users.length;
        const freeAccessUsers = users.filter(u => u.hasFreeAccess).length;
        const paidUsers = totalUsers - freeAccessUsers;
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recentRegistrations = users.filter(u => u.registeredAt > oneWeekAgo).length;

        return { totalUsers, freeAccessUsers, paidUsers, recentRegistrations };
    }, [users]);

    return (
        <div className="space-y-6 animate-jump-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="کل کاربران" value={stats.totalUsers} icon={<UsersIcon className="w-8 h-8 text-brand-primary" />} />
                <StatCard title="کاربران رایگان" value={stats.freeAccessUsers} icon={<UsersIcon className="w-8 h-8 text-green-600" />} />
                <StatCard title="کاربران ویژه" value={stats.paidUsers} icon={<UsersIcon className="w-8 h-8 text-amber-500" />} />
                <StatCard title="ثبت‌نام هفته اخیر" value={stats.recentRegistrations} icon={<UsersIcon className="w-8 h-8 text-sky-500" />} />
             </div>
        </div>
    );
};

const UserManagementTab: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newUserId, setNewUserId] = useState('');
    const [newUserFreeAccess, setNewUserFreeAccess] = useState(false);
    const [userFeedback, setUserFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
    const [newTeacherFirstName, setNewTeacherFirstName] = useState('');
    const [newTeacherLastName, setNewTeacherLastName] = useState('');
    const [teacherFeedback, setTeacherFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const loadData = useCallback(() => {
        setIsLoading(true);
        setUsers(adminService.getAllUsers());
        setTeachers(adminService.getAllTeachers());
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleToggleAccess = (user: User) => {
        const updatedUser = { ...user, hasFreeAccess: !user.hasFreeAccess };
        adminService.updateUser(updatedUser);
        loadData();
    };

    const handleDeleteUser = (nationalId: string) => {
        if (window.confirm(`آیا از حذف کاربر ${nationalId} مطمئن هستید؟`)) {
            adminService.deleteUser(nationalId);
            loadData();
        }
    };
    
    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const result = adminService.createUser(newFirstName, newLastName, newUserId, newUserFreeAccess);
        setUserFeedback({ type: result.success ? 'success' : 'error', message: result.message });
        if (result.success) {
            setNewFirstName('');
            setNewLastName('');
            setNewUserId('');
            setNewUserFreeAccess(false);
            setShowAddUserForm(false);
            loadData();
        }
    };
    
    const handleAddTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        const result = adminService.createTeacher(newTeacherFirstName, newTeacherLastName);
        setTeacherFeedback({ type: result.success ? 'success' : 'error', message: result.message });
        if (result.success && result.teacher) {
            alert(
`مدرس با موفقیت ایجاد شد!
نام کاربری: ${result.teacher.username}
رمز عبور: ${result.teacher.password}
کد معرف: ${result.teacher.referralCode}
لطفا این اطلاعات را در جای امنی ذخیره کنید.`
            );
            setNewTeacherFirstName('');
            setNewTeacherLastName('');
            setShowAddTeacherForm(false);
            loadData();
        }
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('کپی شد!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    if (isLoading) return <Spinner text="در حال بارگذاری..." />;

    return (
        <div className="space-y-12 animate-jump-in">
            {/* Teacher Management */}
            <section>
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">مدیریت مدرسین</h3>
                    <button onClick={() => setShowAddTeacherForm(s => !s)} className="px-4 py-2 bg-brand-secondary text-white font-bold rounded-full hover:bg-pink-500 transition-colors">
                        {showAddTeacherForm ? 'لغو' : 'افزودن مدرس جدید'}
                    </button>
                </div>
                {showAddTeacherForm && (
                    <form onSubmit={handleAddTeacher} className="mt-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg space-y-4">
                         <h4 className="text-lg font-semibold">فرم مدرس جدید</h4>
                         <div className="flex flex-col md:flex-row gap-4">
                             <input type="text" value={newTeacherFirstName} onChange={e => setNewTeacherFirstName(e.target.value)} placeholder="نام" className="flex-grow p-2 rounded-md dark:bg-slate-800" required/>
                             <input type="text" value={newTeacherLastName} onChange={e => setNewTeacherLastName(e.target.value)} placeholder="نام خانوادگی" className="flex-grow p-2 rounded-md dark:bg-slate-800" required/>
                             <button type="submit" className="px-4 py-2 bg-green-500 text-white font-bold rounded-full">ایجاد مدرس</button>
                         </div>
                         {teacherFeedback && <p className={`text-sm ${teacherFeedback.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{teacherFeedback.message}</p>}
                    </form>
                )}
                <div className="mt-4 overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-md">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                                <th className="p-4 font-semibold">نام مدرس</th>
                                <th className="p-4 font-semibold">اطلاعات ورود</th>
                                <th className="p-4 font-semibold">کد معرف</th>
                                <th className="p-4 font-semibold">تاریخ ثبت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map(teacher => (
                                <tr key={teacher.id} className="border-t border-slate-200 dark:border-slate-700">
                                    <td className="p-4">{`${teacher.firstName} ${teacher.lastName}`}</td>
                                    <td className="p-4 font-mono text-sm">
                                        <div>
                                            <span className="text-xs text-slate-500">نام کاربری:</span> {teacher.username || '---'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">رمز عبور:</span>
                                            {teacher.password ? '••••••••' : '---'}
                                            {teacher.password && (
                                                <button onClick={() => copyToClipboard(teacher.password!)} className="text-sky-500 hover:text-sky-700" title="کپی کردن رمز عبور">
                                                    <CopyIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono">
                                        <div className="flex items-center gap-2">
                                            <span>{teacher.referralCode}</span>
                                            <button onClick={() => copyToClipboard(teacher.referralCode)} className="text-sky-500 hover:text-sky-700" title="کپی کردن کد معرف">
                                                <CopyIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">{new Date(teacher.registeredAt).toLocaleDateString('fa-IR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {teachers.length === 0 && <p className="p-4 text-center text-slate-500">مدرسی یافت نشد.</p>}
                </div>
            </section>

            {/* User Management */}
            <section>
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">مدیریت کاربران</h3>
                    <button onClick={() => setShowAddUserForm(s => !s)} className="px-4 py-2 bg-brand-primary text-white font-bold rounded-full hover:bg-cyan-700 transition-colors">
                        {showAddUserForm ? 'لغو' : 'افزودن کاربر جدید'}
                    </button>
                </div>
                {showAddUserForm && (
                    <form onSubmit={handleAddUser} className="mt-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg space-y-4">
                         <h4 className="text-lg font-semibold">فرم کاربر جدید</h4>
                         <div className="flex flex-col md:flex-row gap-4">
                             <input type="text" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} placeholder="نام" className="flex-grow p-2 rounded-md dark:bg-slate-800" required/>
                             <input type="text" value={newLastName} onChange={e => setNewLastName(e.target.value)} placeholder="نام خانوادگی" className="flex-grow p-2 rounded-md dark:bg-slate-800" required/>
                             <input type="tel" value={newUserId} onChange={e => setNewUserId(e.target.value.replace(/\D/g, ''))} placeholder="کد ملی" className="flex-grow p-2 rounded-md dark:bg-slate-800" required/>
                             <label className="flex items-center gap-2">
                                 <input type="checkbox" checked={newUserFreeAccess} onChange={e => setNewUserFreeAccess(e.target.checked)} className="w-5 h-5"/>
                                 <span>دسترسی رایگان</span>
                             </label>
                             <button type="submit" className="px-4 py-2 bg-green-500 text-white font-bold rounded-full">ایجاد</button>
                         </div>
                         {userFeedback && <p className={`text-sm ${userFeedback.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{userFeedback.message}</p>}
                    </form>
                )}
                <div className="mt-4 overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-md">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                                <th className="p-4 font-semibold">نام</th>
                                <th className="p-4 font-semibold">کد ملی</th>
                                <th className="p-4 font-semibold">کد معرف</th>
                                <th className="p-4 font-semibold">دسترسی رایگان</th>
                                <th className="p-4 font-semibold">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.nationalId} className="border-t border-slate-200 dark:border-slate-700">
                                    <td className="p-4">{`${user.firstName} ${user.lastName}`}</td>
                                    <td className="p-4">{user.nationalId}</td>
                                    <td className="p-4 font-mono">{user.teacherReferralCode || '---'}</td>
                                    <td className="p-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={user.hasFreeAccess} onChange={() => handleToggleAccess(user)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => handleDeleteUser(user.nationalId)} className="text-red-500 hover:text-red-700 font-semibold">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {users.length === 0 && <p className="p-4 text-center text-slate-500">کاربری یافت نشد.</p>}
                </div>
            </section>
        </div>
    );
};

const TestResultsTab: React.FC = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [studentFilter, setStudentFilter] = useState('');
    const [quizFilter, setQuizFilter] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setResults(adminService.getAllTestResults());
        setUsers(adminService.getAllUsers());
        setIsLoading(false);
    }, []);

    const userMap = useMemo(() => {
        return users.reduce((acc, user) => {
            acc[user.nationalId] = `${user.firstName} ${user.lastName}`.trim();
            return acc;
        }, {} as Record<string, string>);
    }, [users]);
    
    const filteredResults = useMemo(() => {
        return results.filter(result => {
            const studentName = userMap[result.userId] || '';
            const studentMatch = studentFilter ? result.userId.includes(studentFilter) || studentName.includes(studentFilter) : true;
            const quizMatch = quizFilter ? result.quizTitle.toLowerCase().includes(quizFilter.toLowerCase()) : true;
            return studentMatch && quizMatch;
        });
    }, [results, studentFilter, quizFilter, userMap]);

    if (isLoading) return <Spinner text="در حال بارگذاری نتایج..." />;

    return (
        <div className="space-y-6 animate-jump-in">
             <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg flex flex-col md:flex-row gap-4">
                <input 
                    type="text" 
                    placeholder="فیلتر بر اساس نام یا کد ملی دانش‌آموز..." 
                    value={studentFilter}
                    onChange={e => setStudentFilter(e.target.value)}
                    className="flex-grow p-2 rounded-md dark:bg-slate-800"
                />
                 <input 
                    type="text" 
                    placeholder="فیلتر بر اساس نام آزمون..." 
                    value={quizFilter}
                    onChange={e => setQuizFilter(e.target.value)}
                    className="flex-grow p-2 rounded-md dark:bg-slate-800"
                />
            </div>

            <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-md">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 dark:bg-slate-900">
                        <tr>
                            <th className="p-4 font-semibold">دانش‌آموز</th>
                            <th className="p-4 font-semibold">کد ملی</th>
                            <th className="p-4 font-semibold">نام آزمون</th>
                            <th className="p-4 font-semibold">نمره</th>
                            <th className="p-4 font-semibold">تاریخ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.map(result => (
                            <tr key={result.id} className="border-t border-slate-200 dark:border-slate-700">
                                <td className="p-4">{userMap[result.userId] || 'نامشخص'}</td>
                                <td className="p-4 font-mono">{result.userId}</td>
                                <td className="p-4">{result.quizTitle}</td>
                                <td className="p-4 font-bold">{`${result.score} / ${result.totalQuestions}`}</td>
                                <td className="p-4">{new Date(result.timestamp).toLocaleString('fa-IR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredResults.length === 0 && <p className="p-4 text-center text-slate-500">نتیجه‌ای یافت نشد.</p>}
            </div>
        </div>
    );
};


const AdminPanelScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        setUsers(adminService.getAllUsers());
    }, [activeTab]); // Refresh users when tab changes, e.g., after adding a new user

    const tabs = [
        { id: 'dashboard', name: 'داشبورد', icon: <DashboardIcon className="w-6 h-6" /> },
        { id: 'users', name: 'مدیریت', icon: <UsersIcon className="w-6 h-6" /> },
        { id: 'results', name: 'نتایج آزمون‌ها', icon: <TestResultsIcon className="w-6 h-6" /> },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text dark:text-slate-100 mb-8 text-center">پنل مدیریت</h2>
            
            <div className="mb-8 border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                ? 'border-brand-primary text-brand-primary dark:border-brand-primary-light dark:text-brand-primary-light'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-600'
                            } flex items-center gap-2 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-lg transition-colors`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div>
                {activeTab === 'dashboard' && <DashboardTab users={users} />}
                {activeTab === 'users' && <UserManagementTab />}
                {activeTab === 'results' && <TestResultsTab />}
            </div>
        </div>
    );
};

export default AdminPanelScreen;