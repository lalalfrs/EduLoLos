import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  Play, 
  Plus, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Target, 
  Flame, 
  Check, 
  Sparkles, 
  GraduationCap, 
  TrendingUp, 
  AlertCircle,
  FileDown,
  Share2,
  Edit3,
  Trash2
} from 'lucide-react';
import { ScheduleSession, TaskItem, NavPage, UserProfile } from '../types';
import { storage } from '../utils/storage';
import { AddScheduleModal } from './modals/AddScheduleModal';

interface ScheduleViewProps {
  onNavigate: (page: NavPage) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onNavigate }) => {
  const [sessions, setSessions] = useState<ScheduleSession[]>(() => storage.getSessions());
  const [habits, setHabits] = useState<TaskItem[]>(() => storage.getHabits());
  const [user, setUser] = useState<UserProfile>(() => storage.getUser());
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<ScheduleSession | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');

  const updateSessionsState = (newSessions: ScheduleSession[]) => {
    setSessions(newSessions);
    storage.saveSessions(newSessions);
  };

  const updateHabitsState = (newHabits: TaskItem[]) => {
    setHabits(newHabits);
    storage.saveHabits(newHabits);
  };

  // SESSION CRUD
  const handleSaveSession = (savedSession: ScheduleSession) => {
    const existingIndex = sessions.findIndex((s) => s.id === savedSession.id);
    if (existingIndex >= 0) {
      const updated = sessions.map((s) => (s.id === savedSession.id ? savedSession : s));
      updateSessionsState(updated);
    } else {
      updateSessionsState([savedSession, ...sessions]);
    }
    setSessionToEdit(null);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus sesi belajar ini dari jadwal?')) {
      const updated = sessions.filter((s) => s.id !== sessionId);
      updateSessionsState(updated);
    }
  };

  const handleToggleSessionStatus = (sessionId: string) => {
    const updated = sessions.map((s) => {
      if (s.id === sessionId) {
        const nextStatus = s.status === 'completed' ? 'upcoming' : 'completed';
        return { ...s, status: nextStatus as 'completed' | 'upcoming' | 'ongoing' };
      }
      return s;
    });
    updateSessionsState(updated);
  };

  // HABIT CRUD
  const toggleHabit = (id: string) => {
    const updated = habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h));
    updateHabitsState(updated);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    const newHabit: TaskItem = {
      id: `habit-${Date.now()}`,
      title: newHabitTitle.trim(),
      completed: false
    };
    updateHabitsState([...habits, newHabit]);
    setNewHabitTitle('');
  };

  const handleDeleteHabit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = habits.filter((h) => h.id !== id);
    updateHabitsState(updated);
  };

  const handleExportPDF = () => {
    setShowExportMenu(false);
    alert('📄 Ringkasan Jadwal Belajar UTBK telah diunduh (Format PDF).');
  };

  const handleSyncCalendar = () => {
    setShowExportMenu(false);
    alert('📅 Jadwal Belajar berhasil disinkronkan ke kalender perangkat!');
  };

  // Filtered sessions
  const filteredSessions = selectedDayFilter === 'all'
    ? sessions
    : sessions.filter((s) => s.day.toLowerCase().includes(selectedDayFilter.toLowerCase()));

  const completedSessionCount = sessions.filter((s) => s.status === 'completed').length;
  const sessionPercent = Math.round((completedSessionCount / (sessions.length || 1)) * 100);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* HEADER WITH WEEK NAVIGATOR & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-surface-container">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
              Time-Blocking Belajar
            </span>
            <span className="text-xs font-semibold text-secondary">
              Jadwal Belajar Harian Mingguan
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface mt-1">
            Jadwal Belajar Harian (Senin - Minggu)
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
            Atur dan kelola sesi belajar harianmu kapan saja (Tambah, Edit, Hapus, & Tandai Selesai).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 relative self-start md:self-auto flex-wrap">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-surface-container-lowest shadow-xl border border-surface-container p-2 z-50 animate-in fade-in">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container text-left"
                >
                  <FileDown className="w-4 h-4 text-primary" />
                  <span>Download PDF Jadwal</span>
                </button>
                <button
                  type="button"
                  onClick={handleSyncCalendar}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container text-left"
                >
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>Sync Google Calendar</span>
                </button>
              </div>
            )}
          </div>

          {/* Tambah Jadwal Button */}
          <button
            type="button"
            onClick={() => {
              setSessionToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow-md hover:bg-primary-container transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jadwal</span>
          </button>
        </div>
      </div>

      {/* RECURRING DAY FILTER STRIP (SENIN - MINGGU) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', label: 'Semua Hari', count: sessions.length },
          { id: 'senin', label: 'Senin', count: sessions.filter(s => s.day.toLowerCase() === 'senin').length },
          { id: 'selasa', label: 'Selasa', count: sessions.filter(s => s.day.toLowerCase() === 'selasa').length },
          { id: 'rabu', label: 'Rabu', count: sessions.filter(s => s.day.toLowerCase() === 'rabu').length },
          { id: 'kamis', label: 'Kamis', count: sessions.filter(s => s.day.toLowerCase() === 'kamis').length },
          { id: 'jumat', label: 'Jumat', count: sessions.filter(s => s.day.toLowerCase() === 'jumat').length },
          { id: 'sabtu', label: 'Sabtu', count: sessions.filter(s => s.day.toLowerCase() === 'sabtu').length },
          { id: 'minggu', label: 'Minggu', count: sessions.filter(s => s.day.toLowerCase() === 'minggu').length }
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedDayFilter(item.id)}
            className={`flex flex-col items-center py-2.5 px-4 rounded-2xl border transition-all whitespace-nowrap min-w-[95px] ${
              selectedDayFilter === item.id
                ? 'bg-primary text-on-primary border-primary shadow-md scale-102 font-bold'
                : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container font-medium'
            }`}
          >
            <span className="text-xs uppercase tracking-wide">{item.label}</span>
            <span className={`text-[10px] mt-0.5 ${selectedDayFilter === item.id ? 'opacity-90' : 'text-on-surface-variant'}`}>
              {item.count} Sesi
            </span>
          </button>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SCHEDULE SESSIONS LIST (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-on-surface">
              {selectedDayFilter === 'all' ? 'Daftar Seluruh Sesi Belajar Harian' : `Jadwal Hari ${selectedDayFilter.charAt(0).toUpperCase() + selectedDayFilter.slice(1)}`}
            </h2>
            <span className="text-xs font-semibold text-secondary">
              {sessionPercent}% Selesai ({completedSessionCount}/{sessions.length})
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {filteredSessions.length === 0 ? (
              <div className="p-8 rounded-3xl bg-surface-container-low text-center border border-dashed border-surface-container flex flex-col items-center gap-2">
                <Calendar className="w-8 h-8 text-on-surface-variant/50" />
                <p className="text-xs font-medium text-on-surface-variant">Belum ada sesi belajar untuk hari ini.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSessionToEdit(null);
                    setIsAddModalOpen(true);
                  }}
                  className="mt-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                >
                  + Tambah Jadwal Sekarang
                </button>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`rounded-3xl p-5 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    session.status === 'completed'
                      ? 'bg-surface-container-low/80 border-surface-container/60 opacity-90'
                      : 'bg-surface-container-lowest border-surface-container hover:shadow-sm'
                  }`}
                >
                  {/* Left Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleSessionStatus(session.id)}
                      title={session.status === 'completed' ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
                        session.status === 'completed'
                          ? 'bg-secondary-container text-secondary'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {session.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-on-surface">
                          {session.subtest || session.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">
                          Hari {session.day}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">
                          {session.timeRange || session.time || 'Waktu Fleksibel'}
                        </span>
                      </div>

                      <h3 className="text-xs font-semibold text-on-surface mt-1">
                        {session.title}
                      </h3>

                      {session.description && (
                        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                          {session.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-on-surface-variant mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-primary">
                          <Target className="w-3 h-3" /> {session.badge || 'Sesi Belajar'}
                        </span>
                        <span>•</span>
                        <span>Estimasi {session.durationMinutes || 90} menit</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Controls */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {/* Edit Session */}
                    <button
                      type="button"
                      onClick={() => {
                        setSessionToEdit(session);
                        setIsAddModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit Sesi Jadwal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Session */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-tertiary transition-colors"
                      title="Hapus Sesi Jadwal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {session.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => onNavigate('pomodoro-focus')}
                        className="px-3 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary-container transition-all active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Mulai</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TARGET METRICS & HABIT TRACKER (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* TARGET BELAJAR HARI INI CARD */}
          <div 
            id="target-belajar-hari-ini"
            className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-4 border border-surface-container/60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-base text-on-surface">
                  Target Belajar Hari Ini
                </h3>
              </div>
              <span className="text-xs font-bold text-secondary">88% Tercapai</span>
            </div>

            {/* Circular Hour Gauge */}
            <div className="flex items-center justify-around p-4 rounded-2xl bg-surface-container-low">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-dim"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="88, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display font-extrabold text-lg text-on-surface">3.5j</span>
                  <span className="text-[10px] text-on-surface-variant">/ 4.0j</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <span className="text-[11px] text-on-surface-variant">Latihan Soal</span>
                  <span className="font-display font-bold text-sm text-on-surface">45 / 50 Soal</span>
                  <div className="w-24 bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-0.5">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] text-on-surface-variant">Flashcard Review</span>
                  <span className="font-display font-bold text-sm text-on-surface">30 / 30 Kartu</span>
                  <div className="w-24 bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-0.5">
                    <div className="bg-primary h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* HABIT BELAJAR & DISIPLIN CHECKLIST WITH CRUD */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant">
                  Habit Disiplin SNBT
                </span>
                <span className="text-[11px] font-semibold text-secondary">
                  {habits.filter((h) => h.completed).length}/{habits.length} Tuntas
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center transition-all shrink-0 ${
                          habit.completed ? 'bg-secondary text-white' : 'border border-outline bg-surface-container-lowest'
                        }`}
                      >
                        {habit.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs truncate ${
                          habit.completed ? 'line-through text-on-surface-variant opacity-60' : 'text-on-surface font-medium'
                        }`}
                      >
                        {habit.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {habit.completed && (
                        <span className="text-[10px] font-bold text-secondary mr-1">Tuntas</span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteHabit(habit.id, e)}
                        className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-surface-container-high text-on-surface-variant hover:text-tertiary transition-all"
                        title="Hapus habit ini"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Habit Form */}
              <form onSubmit={handleAddHabit} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="Tambah habit baru..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs shadow-sm transition-all"
                  title="Tambah habit"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* PREDIKSI KELULUSAN PTN (TEKNIK ELEKTRO ITS 2025) */}
          <div 
            id="prediksi-its-card"
            className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-4 border border-surface-container/60"
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-base text-on-surface">
                  Prediksi Kelulusan PTN
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                88% Aman
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-on-surface">
                Pilihan 1: {user.targetPTN}
              </span>
              <span className="text-xs text-on-surface-variant">
                Pusat UTBK Institut Teknologi Sepuluh Nopember (ITS Surabaya)
              </span>
            </div>

            {/* Score Comparison Gauge */}
            <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Skor Rerata Saat Ini:</span>
                <span className="font-bold text-on-surface">{user.currentScore || 685} Poin</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Passing Grade Elektro ITS:</span>
                <span className="font-bold text-secondary">680 Poin</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Target Ambisius Hilal:</span>
                <span className="font-bold text-primary">{user.targetScore || 725} Poin</span>
              </div>

              {/* Linear Gauge Bar */}
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden relative mt-1">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${((user.currentScore || 685) / 800) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant">
                <span>0</span>
                <span className="text-secondary font-bold">PG 680</span>
                <span>800</span>
              </div>
            </div>

            {/* AI Diagnostic */}
            <div className="p-3.5 rounded-2xl bg-primary-fixed/30 border-l-4 border-primary text-xs text-on-surface leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Diagnostik AI:</strong> Skor kamu ({user.currentScore} poin) sudah melampaui passing grade reguler <strong>Teknik Elektro ITS</strong> (+5 poin). Tingkatkan latihan pada subtes TKA Fisika & Rangkaian Listrik (+15 poin lagi) untuk mengamankan peringkat top 5% kuota SNBT!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT SCHEDULE MODAL */}
      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSessionToEdit(null);
        }}
        onAddSession={handleSaveSession}
        initialSession={sessionToEdit}
      />
    </div>
  );
};
