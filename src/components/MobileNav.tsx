import React from 'react';
import { LayoutDashboard, Timer, Layers, CalendarDays } from 'lucide-react';
import { NavPage } from '../types';

interface MobileNavProps {
  currentPage: NavPage;
  onSelectPage: (page: NavPage) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onSelectPage
}) => {
  const navItems: { id: NavPage; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'pomodoro-focus',
      label: 'Pomodoro',
      icon: <Timer className="w-5 h-5" />
    },
    {
      id: 'flashcard-dan-kuis',
      label: 'Flashcard',
      icon: <Layers className="w-5 h-5" />
    },
    {
      id: 'jadwal-dan-target',
      label: 'Jadwal',
      icon: <CalendarDays className="w-5 h-5" />
    }
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container shadow-[0_-2px_12px_rgba(0,0,0,0.05)] px-2 py-1.5 transition-colors"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onSelectPage(item.id)}
              type="button"
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[64px] rounded-xl transition-all ${
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-colors ${
                  isActive ? 'bg-primary-fixed text-primary' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-display">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
