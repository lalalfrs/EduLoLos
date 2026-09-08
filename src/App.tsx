import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { NavPage, TaskItem, UserProfile } from './types';
import { storage } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { DashboardView } from './components/DashboardView';
import { PomodoroView } from './components/PomodoroView';
import { FlashcardView } from './components/FlashcardView';
import { ScheduleView } from './components/ScheduleView';
import { LiveTutorModal } from './components/modals/LiveTutorModal';
import { EditProfileModal } from './components/modals/EditProfileModal';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLiveTutorOpen, setIsLiveTutorOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // User Profile & Daily Tasks with persistent local storage
  const [user, setUser] = useState<UserProfile>(() => storage.getUser());
  const [dailyTasks, setDailyTasks] = useState<TaskItem[]>(() => storage.getTasks());

  // Initialize theme from system or preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('edulolos-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edulolos-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edulolos-theme', 'light');
    }
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    storage.saveUser(updatedUser);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = dailyTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setDailyTasks(updated);
    storage.saveTasks(updated);
  };

  const handleSaveTask = (task: TaskItem) => {
    const existingIndex = dailyTasks.findIndex((t) => t.id === task.id);
    let updated: TaskItem[];
    if (existingIndex >= 0) {
      updated = dailyTasks.map((t) => (t.id === task.id ? task : t));
    } else {
      updated = [task, ...dailyTasks];
    }
    setDailyTasks(updated);
    storage.saveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = dailyTasks.filter((t) => t.id !== taskId);
    setDailyTasks(updated);
    storage.saveTasks(updated);
  };

  const completedSessionCount = dailyTasks.filter((t) => t.completed).length + 2;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        daysRemaining={user.daysUntilUTBK || 45}
        targetPTN={user.targetPTN}
        targetMajor={user.targetMajor}
      />

      {/* Top Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        streakDays={user.streakDays || 14}
        completedSessions={completedSessionCount}
        targetSessions={user.dailyTargetSessions || 4}
        user={user}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main 
        id="main-viewport"
        className="flex-1 lg:pl-72 pt-16 pb-20 lg:pb-10 px-4 md:px-8 max-w-7xl w-full mx-auto"
      >
        <div className="py-4 md:py-6">
          <AnimatePresence mode="wait">
            {currentPage === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardView
                  onNavigate={setCurrentPage}
                  onOpenLiveTutor={() => setIsLiveTutorOpen(true)}
                  tasks={dailyTasks}
                  onToggleTask={handleToggleTask}
                  onSaveTask={handleSaveTask}
                  onDeleteTask={handleDeleteTask}
                  user={user}
                  onOpenEditProfile={() => setIsEditProfileOpen(true)}
                />
              </motion.div>
            )}

            {currentPage === 'pomodoro-focus' && (
              <motion.div
                key="pomodoro-focus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PomodoroView />
              </motion.div>
            )}

            {currentPage === 'flashcard-dan-kuis' && (
              <motion.div
                key="flashcard-dan-kuis"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FlashcardView />
              </motion.div>
            )}

            {currentPage === 'jadwal-dan-target' && (
              <motion.div
                key="jadwal-dan-target"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ScheduleView onNavigate={setCurrentPage} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
      />

      {/* Global Live Tutor Mentorship Modal */}
      <LiveTutorModal
        isOpen={isLiveTutorOpen}
        onClose={() => setIsLiveTutorOpen(false)}
      />

      {/* Edit Profile & Target PTN Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSaveProfile={handleUpdateUser}
      />
    </div>
  );
};

export default App;
