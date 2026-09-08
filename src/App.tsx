import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { NavPage, TaskItem, UserProfile } from './types';
import { getSession, onAuthStateChange, signOut } from './lib/supabase';
import { getProfile, getUserTasks, updateProfile, createTask, updateTask, deleteTask } from './lib/repository';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { DashboardView } from './components/DashboardView';
import { PomodoroView } from './components/PomodoroView';
import { FlashcardView } from './components/FlashcardView';
import { ScheduleView } from './components/ScheduleView';
import { LiveTutorModal } from './components/modals/LiveTutorModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';

const emptyUser: UserProfile = {
  name: '', school: '', targetPTN: '', targetMajor: '', targetCampus: '', avatar: '/its-logo.svg',
  streakDays: 0, daysUntilUTBK: 0, readinessPercent: 0, lastTOScore: 0, currentScore: 0,
  passingGrade: 0, targetScore: 0, dailyCompletedSessions: 0, dailyTargetSessions: 0,
  totalQuestionsSolved: 0, solvedYesterday: 0, focusHours: 0,
};

const mapProfile = (profile: any): UserProfile => ({
  ...emptyUser,
  name: profile?.display_name || '',
  school: profile?.school || '',
  targetPTN: profile?.target_ptn || profile?.targetPTN || '',
  targetMajor: profile?.target_major || profile?.targetMajor || '',
  targetCampus: profile?.target_campus || profile?.targetCampus || '',
});

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLiveTutorOpen, setIsLiveTutorOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [session, setSession] = useState<any>(undefined);
  const [user, setUser] = useState<UserProfile>(emptyUser);
  const [dailyTasks, setDailyTasks] = useState<TaskItem[]>([]);
  const [onboardingRequired, setOnboardingRequired] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (authUser: any) => {
    if (!authUser) { setSession(null); setLoading(false); return; }
    setSession(authUser);
    const profile = await getProfile(authUser.id);
    setUser(mapProfile(profile));
    setOnboardingRequired(!profile?.onboarding_completed);
    const tasks = await getUserTasks(authUser.id);
    setDailyTasks(tasks.map((task: any) => ({
      id: task.id, title: task.title, completed: task.completed,
      subtitle: task.subject || undefined, badge: task.completed ? 'Selesai' : 'Berjalan',
    })));
    setLoading(false);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('edulolos-theme');
    const dark = savedTheme === 'dark';
    setIsDarkMode(dark);
    document.documentElement.classList.toggle('dark', dark);
    getSession().then((currentSession) => loadUserData(currentSession?.user));
    const { data } = onAuthStateChange((authUser) => loadUserData(authUser));
    return () => data.subscription.unsubscribe();
  }, []);

  const handleToggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    document.documentElement.classList.toggle('dark', nextMode);
    localStorage.setItem('edulolos-theme', nextMode ? 'dark' : 'light');
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    if (session) await updateProfile(session.id, {
      display_name: updatedUser.name, school: updatedUser.school,
      target_ptn: updatedUser.targetPTN, target_major: updatedUser.targetMajor,
      target_campus: updatedUser.targetCampus, updated_at: new Date().toISOString(),
    });
  };

  const handleToggleTask = async (taskId: string) => {
    const task = dailyTasks.find((item) => item.id === taskId);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    setDailyTasks((items) => items.map((item) => item.id === taskId ? updated : item));
    await updateTask(taskId, { completed: updated.completed });
  };

  const handleSaveTask = async (task: TaskItem) => {
    if (!session) return;
    if (dailyTasks.some((item) => item.id === task.id)) {
      await updateTask(task.id, { title: task.title, completed: task.completed, subject: task.subtitle || '' });
      setDailyTasks((items) => items.map((item) => item.id === task.id ? task : item));
    } else {
      const created = await createTask(session.id, task);
      if (created) setDailyTasks((items) => [{ ...task, id: created.id }, ...items]);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setDailyTasks((items) => items.filter((item) => item.id !== taskId));
    await deleteTask(taskId);
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface">Memuat EduLoLos...</div>;
  if (!session) return <AuthPage onAuthSuccess={() => getSession().then((currentSession) => loadUserData(currentSession?.user))} />;
  if (onboardingRequired) return <OnboardingPage userId={session.id} displayName={user.name || session.email?.split('@')[0] || ''} onComplete={() => loadUserData(session)} />;

  const completedSessionCount = dailyTasks.filter((task) => task.completed).length;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body transition-colors duration-300">
      <Sidebar currentPage={currentPage} onSelectPage={setCurrentPage} daysRemaining={user.daysUntilUTBK} targetPTN={user.targetPTN} targetMajor={user.targetMajor} />
      <Header isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode} streakDays={user.streakDays} completedSessions={completedSessionCount} targetSessions={user.dailyTargetSessions} user={user} onOpenEditProfile={() => setIsEditProfileOpen(true)} />
      <main id="main-viewport" className="flex-1 lg:pl-72 pt-16 pb-20 lg:pb-10 px-4 md:px-8 max-w-7xl w-full mx-auto">
        <div className="py-4 md:py-6">
          <AnimatePresence mode="wait">
            {currentPage === 'dashboard' && <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><DashboardView onNavigate={setCurrentPage} onOpenLiveTutor={() => setIsLiveTutorOpen(true)} tasks={dailyTasks} onToggleTask={handleToggleTask} onSaveTask={handleSaveTask} onDeleteTask={handleDeleteTask} user={user} onOpenEditProfile={() => setIsEditProfileOpen(true)} /></motion.div>}
            {currentPage === 'pomodoro-focus' && <motion.div key="pomodoro-focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PomodoroView /></motion.div>}
            {currentPage === 'flashcard-dan-kuis' && <motion.div key="flashcard-dan-kuis" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><FlashcardView /></motion.div>}
            {currentPage === 'jadwal-dan-target' && <motion.div key="jadwal-dan-target" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ScheduleView onNavigate={setCurrentPage} /></motion.div>}
          </AnimatePresence>
        </div>
      </main>
      <MobileNav currentPage={currentPage} onSelectPage={setCurrentPage} />
      <LiveTutorModal isOpen={isLiveTutorOpen} onClose={() => setIsLiveTutorOpen(false)} />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} user={user} onSaveProfile={handleUpdateUser} />
      <button onClick={() => signOut()} className="fixed bottom-4 right-4 z-40 rounded-xl bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface">Keluar</button>
    </div>
  );
};

export default App;

