import React, { useState } from 'react';
import { 
  Flame, 
  AlarmClock, 
  Sun, 
  Moon, 
  Bell, 
  Check, 
  X, 
  Sparkles,
  UserCheck,
  Edit3
} from 'lucide-react';
import { ASSET_IMAGES, INITIAL_USER } from '../data/mockData';
import { UserProfile } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  streakDays: number;
  completedSessions: number;
  targetSessions: number;
  user?: UserProfile;
  onOpenEditProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  streakDays,
  completedSessions,
  targetSessions,
  user = INITIAL_USER,
  onOpenEditProfile,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Sesi Pomodoro Selesai!',
      desc: 'Kamu baru saja menuntaskan 25 menit fokus latihan TKA Fisika.',
      time: '10 menit lalu',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Live Tanya Tutor ITS Dimulai Pukul 19:00',
      desc: 'Kak Dimas standby untuk bedah soal HOTS Induksi Elektromagnetik & TPS.',
      time: '1 jam lalu',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Streak 14 Hari Dipertahankan!',
      desc: 'Hebat Muhammad Hilal! Konsistensi belajarmu membawa peluang lolos makin tinggi.',
      time: 'Kemarin',
      read: true
    }
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <header 
      id="main-header"
      className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 px-4 md:px-6 flex items-center justify-between border-b border-surface-container/60 transition-colors"
    >
      {/* Left Streak & Target indicators */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Streak Badge */}
        <div 
          id="streak-badge"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant shadow-sm border border-surface-container-high/30"
          title="Daily Study Streak"
        >
          <Flame className="w-4 h-4 text-tertiary fill-tertiary animate-bounce" />
          <span className="font-display font-bold text-xs text-on-surface">
            {streakDays}
          </span>
          <span className="text-[11px] font-semibold text-on-surface-variant hidden sm:inline">
            Hari Beruntun
          </span>
        </div>

        {/* Daily Session Target Badge */}
        <div 
          id="daily-target-badge"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant shadow-sm border border-surface-container-high/30"
          title="Target Sesi Belajar Hari Ini"
        >
          <AlarmClock className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-xs text-on-surface">
            {completedSessions}/{targetSessions}
          </span>
          <span className="text-[11px] font-semibold text-on-surface-variant hidden sm:inline">
            Sesi Fokus
          </span>
        </div>
      </div>

      {/* Right Controls: Dark Mode Toggle, Notifications & User Avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle Button */}
        <button
          id="theme-toggle-btn"
          type="button"
          onClick={onToggleDarkMode}
          className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-on-surface-variant" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant relative transition-colors"
            title="Pemberitahuan"
          >
            <Bell className="w-4 h-4" />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary"></span>
            )}
          </button>

          {/* Notification Popup Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-surface-container-lowest shadow-2xl border border-surface-container p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-on-surface">Pemberitahuan</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllRead}
                    type="button"
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Tandai dibaca
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    type="button"
                    className="text-on-surface-variant hover:text-on-surface"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl transition-colors ${
                      n.read ? 'bg-surface-container-low/40' : 'bg-primary-fixed/20 border-l-2 border-primary'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-bold text-on-surface">{n.title}</span>
                      <span className="text-[10px] text-on-surface-variant whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge (Clickable for editing profile) */}
        <button
          type="button"
          onClick={onOpenEditProfile}
          id="user-profile-badge" 
          className="flex items-center gap-2.5 pl-1 p-1 rounded-2xl hover:bg-surface-container transition-all group text-left"
          title="Klik untuk Edit Profil & Target PTN"
        >
          <div className="relative">
            <img
              src={user.avatar || ASSET_IMAGES.profile}
              alt={`${user.name} Profile`}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover ring-2 ring-primary-fixed group-hover:ring-primary transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                {user.name}
              </span>
              <Edit3 className="w-3 h-3 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-[11px] text-on-surface-variant leading-tight truncate max-w-[140px]">
              {user.targetPTN || user.school}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
