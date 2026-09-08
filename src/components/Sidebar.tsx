import React from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  Layers, 
  CalendarDays, 
  BadgeCheck, 
  Clock 
} from 'lucide-react';
import { NavPage } from '../types';
import { ASSET_IMAGES } from '../data/mockData';

interface SidebarProps {
  currentPage: NavPage;
  onSelectPage: (page: NavPage) => void;
  daysRemaining: number;
  targetPTN?: string;
  targetMajor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  daysRemaining,
  targetPTN = 'Teknik Elektro ITS',
  targetMajor = 'Teknik Elektro - ITS 2025'
}) => {
  const navItems: { id: NavPage; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'pomodoro-focus',
      label: 'Pomodoro Focus',
      icon: <Timer className="w-5 h-5" />
    },
    {
      id: 'flashcard-dan-kuis',
      label: 'Flashcard & Kuis',
      icon: <Layers className="w-5 h-5" />
    },
    {
      id: 'jadwal-dan-target',
      label: 'Jadwal & Target',
      icon: <CalendarDays className="w-5 h-5" />
    }
  ];

  return (
    <aside 
      id="main-sidebar" 
      className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-40 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container/60 transition-colors"
    >
      <div className="flex flex-col">
        {/* Brand Logo Header */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <img
            src={ASSET_IMAGES.logo}
            alt="EduLolos UTBK Platform Logo"
            className="h-9 w-auto object-contain"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xl text-primary tracking-tight">
                EduLolos
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                UTBK
              </span>
            </div>
            <span className="text-xs font-semibold text-secondary">
              Target PTN Impian
            </span>
          </div>
        </div>

        {/* Days Countdown Chip Card */}
        <div className="px-4 py-2">
          <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container/50">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-on-surface">
                UTBK SNBT
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
              {daysRemaining} Hari Lagi
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 px-4 mt-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => onSelectPage(item.id)}
                type="button"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-[0_4px_20px_rgba(139,92,246,0.35)] scale-[1.01]'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-on-surface-variant'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Target PTN Box */}
      <div className="p-4">
        <div className="p-4 rounded-xl bg-surface-container flex items-center gap-3 border border-surface-container-high/40">
          <BadgeCheck className="w-7 h-7 text-secondary shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-on-surface">
              Target Jurusan
            </div>
            <div className="text-xs font-bold text-on-surface-variant truncate" title={targetMajor || targetPTN}>
              {targetMajor || targetPTN}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
