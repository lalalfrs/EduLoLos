import React, { useMemo } from 'react';
import { Download, FileJson, Flame, Target, TrendingUp } from 'lucide-react';
import type { UserProfile } from '../types';

export interface ProgressSession {
  created_at: string;
  duration_minutes: number;
  questions_answered: number;
  questions_correct: number;
}

interface ProgressPanelProps {
  sessions: ProgressSession[];
  user: UserProfile;
  onExport: (format: 'json' | 'csv') => void;
}

const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const ProgressPanel: React.FC<ProgressPanelProps> = ({ sessions, user, onExport }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(now.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const daySessions = sessions.filter((session) => session.created_at.slice(0, 10) === key);
      return {
        label: dayLabels[date.getDay()],
        minutes: daySessions.reduce((sum, session) => sum + session.duration_minutes, 0),
        questions: daySessions.reduce((sum, session) => sum + session.questions_answered, 0),
        date: key,
      };
    });
    const questions = sessions.reduce((sum, session) => sum + session.questions_answered, 0);
    const correct = sessions.reduce((sum, session) => sum + session.questions_correct, 0);
    return { days, totalMinutes: sessions.reduce((sum, session) => sum + session.duration_minutes, 0), questions, accuracy: questions ? Math.round((correct / questions) * 100) : 0 };
  }, [sessions]);

  const maxMinutes = Math.max(...stats.days.map((day) => day.minutes), 1);

  return (
    <section className="rounded-3xl bg-surface-container-lowest border border-surface-container/60 p-5 md:p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Tracking progres</p>
          <h2 className="mt-1 text-xl font-display font-bold text-on-surface">Perkembangan belajarmu</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Ringkasan aktivitas 7 hari terakhir dari sesi yang tersimpan.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onExport('json')} className="inline-flex items-center gap-2 rounded-xl bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface"><FileJson className="h-4 w-4" /> JSON</button>
          <button type="button" onClick={() => onExport('csv')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-on-primary"><Download className="h-4 w-4" /> CSV</button>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-surface-container-low p-4"><ClockIcon /><strong>{stats.totalMinutes}m</strong><span>Total fokus</span></div>
        <div className="rounded-2xl bg-surface-container-low p-4"><Target className="h-4 w-4 text-secondary" /><strong>{stats.questions}</strong><span>Soal dikerjakan</span></div>
        <div className="rounded-2xl bg-surface-container-low p-4"><TrendingUp className="h-4 w-4 text-tertiary" /><strong>{stats.accuracy}%</strong><span>Akurasi</span></div>
        <div className="rounded-2xl bg-surface-container-low p-4"><Flame className="h-4 w-4 text-primary" /><strong>{user.streakDays} hari</strong><span>Streak saat ini</span></div>
      </div>
      <div className="mt-6 flex h-36 items-end gap-2 md:gap-4">
        {stats.days.map((day) => <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full max-w-10 rounded-t-lg bg-primary/80 transition-all" style={{ height: `${Math.max((day.minutes / maxMinutes) * 100, day.minutes ? 10 : 3)}%` }} title={`${day.minutes} menit`} /><span className="text-[10px] font-semibold text-on-surface-variant">{day.label}</span></div>)}
      </div>
    </section>
  );
};

const ClockIcon = () => <span className="mb-1 block h-4 w-4 rounded-full border-2 border-primary" aria-hidden="true" />;
