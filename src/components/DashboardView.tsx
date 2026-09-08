import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  TrendingUp, 
  Brain, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Target, 
  School, 
  HelpCircle,
  Video,
  ListTodo,
  Check,
  Award,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import { TaskItem, NavPage, UserProfile } from '../types';
import { ASSET_IMAGES, INITIAL_USER } from '../data/mockData';
import { soundManager } from '../utils/audioSynthesizer';
import { TaskModal } from './modals/TaskModal';

interface DashboardViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenLiveTutor: () => void;
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onSaveTask?: (task: TaskItem) => void;
  onDeleteTask?: (taskId: string) => void;
  user?: UserProfile;
  onOpenEditProfile?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenLiveTutor,
  tasks,
  onToggleTask,
  onSaveTask,
  onDeleteTask,
  user = INITIAL_USER,
  onOpenEditProfile
}) => {
  // Mini Pomodoro State
  const [miniPomoMode, setMiniPomoMode] = useState<'tps' | 'break'>('tps');
  const [miniTimeLeft, setMiniTimeLeft] = useState(25 * 60);
  const [isMiniRunning, setIsMiniRunning] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(true);

  // Task Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);

  // Total time for percentage circle
  const miniTotalTime = miniPomoMode === 'tps' ? 25 * 60 : 5 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isMiniRunning && miniTimeLeft > 0) {
      interval = setInterval(() => {
        setMiniTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (miniTimeLeft === 0) {
      setIsMiniRunning(false);
      alert(miniPomoMode === 'tps' ? '🎉 Waktu fokus selesai! Ambil jeda 5 menit.' : '🔔 Istirahat tuntas, siap fokus lagi?');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMiniRunning, miniTimeLeft, miniPomoMode]);

  const toggleMiniTimer = () => {
    setIsMiniRunning(!isMiniRunning);
  };

  const resetMiniTimer = () => {
    setIsMiniRunning(false);
    setMiniTimeLeft(miniTotalTime);
  };

  const handleModeChange = (mode: 'tps' | 'break') => {
    setMiniPomoMode(mode);
    setIsMiniRunning(false);
    setMiniTimeLeft(mode === 'tps' ? 25 * 60 : 5 * 60);
  };

  const toggleSound = () => {
    const next = !isSoundActive;
    setIsSoundActive(next);
    if (next) {
      soundManager.playSound('rain');
    } else {
      soundManager.stopSound();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress circle offset (circumference ~ 264)
  const miniProgress = (miniTotalTime - miniTimeLeft) / miniTotalTime;
  const miniStrokeOffset = 264 - miniProgress * 264;

  const completedCount = tasks.filter((t) => t.completed).length;
  const taskProgressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  const handleOpenAddTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: TaskItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTaskClick = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus target belajar harian ini?')) {
      if (onDeleteTask) {
        onDeleteTask(taskId);
      }
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-full overflow-x-hidden">
      {/* Subtle Ambient Glow Orbs */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-10 left-1/4 w-96 h-72 bg-primary-fixed-dim/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-48 right-10 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* MAIN BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* LEFT & CENTER COLUMN (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
            {/* 1. HERO WELCOME CARD */}
            <div 
              id="hero-welcome-card"
              className="relative overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm p-5 md:p-8 flex flex-col justify-between border border-surface-container/60 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                <div className="flex flex-col gap-2 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-semibold">
                      <Target className="w-3.5 h-3.5" />
                      <span>Target Impian: {user.targetPTN}</span>
                    </div>
                    {onOpenEditProfile && (
                      <button
                        type="button"
                        onClick={onOpenEditProfile}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high text-xs font-medium transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Profil</span>
                      </button>
                    )}
                  </div>

                  <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface tracking-tight leading-tight">
                    Halo {user.name}! <span className="text-primary">Tetap semangat</span> menuju {user.targetCampus} ⚡
                  </h1>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Target jurusan: <strong>{user.targetMajor}</strong>. Konsistensi belajarmu sangat impresif. Pertahankan ritme latihan soal Fisika & TKA serta evaluasi flashcard hari ini!
                  </p>
                </div>

                {/* Readiness Circular Indicator */}
                <div className="flex items-center md:flex-col justify-center bg-surface-container-low rounded-2xl p-3.5 sm:p-4 gap-2 shrink-0 border border-surface-container/50 max-w-full">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-surface-dim"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-secondary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="85, 100"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      />
                    </svg>
                    <span className="absolute font-display font-extrabold text-base text-on-surface">
                      85%
                    </span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="text-[11px] font-bold text-on-surface">Kesiapan UTBK</span>
                    <span className="text-[10px] text-secondary font-semibold">Taraf Aman Tinggi</span>
                  </div>
                </div>
              </div>

              {/* Quick Jump Action Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 mt-6 border-t border-surface-container/50 min-w-0">
                <button
                  type="button"
                  onClick={() => onNavigate('flashcard-dan-kuis')}
                  className="p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-1 border border-transparent hover:border-primary/20 min-w-0"
                >
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1 truncate">
                    <Brain className="w-3.5 h-3.5 shrink-0" /> Flashcard & Kuis
                  </span>
                  <span className="text-xs text-on-surface font-semibold truncate">Kuis Fisika & Elektro</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('pomodoro-focus')}
                  className="p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-1 border border-transparent hover:border-primary/20 min-w-0"
                >
                  <span className="text-[11px] font-bold text-secondary flex items-center gap-1 truncate">
                    <Clock className="w-3.5 h-3.5 shrink-0" /> Pomodoro Arena
                  </span>
                  <span className="text-xs text-on-surface font-semibold truncate">Mulai Sesi Fokus</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('jadwal-dan-target')}
                  className="p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-1 border border-transparent hover:border-primary/20 min-w-0"
                >
                  <span className="text-[11px] font-bold text-tertiary flex items-center gap-1 truncate">
                    <Calendar className="w-3.5 h-3.5 shrink-0" /> Jadwal & Target
                  </span>
                  <span className="text-xs text-on-surface font-semibold truncate">Target Skor {user.targetScore}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenLiveTutor}
                  className="p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-1 border border-transparent hover:border-primary/20 min-w-0"
                >
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1 truncate">
                    <Video className="w-3.5 h-3.5 shrink-0" /> Tanya Tutor
                  </span>
                  <span className="text-xs text-on-surface font-semibold truncate">Live Room Aktif</span>
                </button>
              </div>
            </div>

            {/* 2. TARGET BELAJAR HARI INI (CHECKLIST WITH FULL CRUD) */}
            <div 
              id="target-belajar-checklist"
              className="rounded-3xl bg-surface-container-lowest shadow-sm p-5 sm:p-6 flex flex-col gap-4 border border-surface-container/60 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-secondary" />
                  <h2 className="font-display font-bold text-lg text-on-surface">
                    Target Belajar Hari Ini
                  </h2>
                  <span className="text-xs text-on-surface-variant font-normal">
                    ({completedCount}/{tasks.length} Selesai)
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* Progress Pill */}
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${taskProgressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-secondary whitespace-nowrap">
                      {taskProgressPercent}%
                    </span>
                  </div>

                  {/* Add Task Button */}
                  <button
                    type="button"
                    onClick={handleOpenAddTask}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary-container transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Target</span>
                  </button>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="flex flex-col gap-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-surface-container-low/60 hover:bg-surface-container transition-all cursor-pointer border border-transparent hover:border-surface-container gap-2 sm:gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div 
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                          task.completed
                            ? 'bg-secondary text-white'
                            : 'border-2 border-outline-variant bg-surface-container-lowest group-hover:border-primary'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span
                          className={`text-sm font-medium truncate ${
                            task.completed ? 'line-through opacity-60 text-on-surface-variant' : 'text-on-surface'
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant truncate">
                          <span className="truncate">{task.subtitle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 shrink-0 self-end sm:self-auto">
                      <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> +{task.xp || 50} XP
                      </span>

                      {/* Edit Task */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditTask(task, e)}
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors"
                        title="Edit Target Ini"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Task */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteTaskClick(task.id, e)}
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-tertiary transition-colors"
                        title="Hapus Target Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. JADWAL BELAJAR PEKAN INI (AGENDA SNAPSHOT) */}
            <div 
              id="jadwal-agenda-snapshot"
              className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-4 border border-surface-container/60 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="font-display font-bold text-lg text-on-surface">
                    Jadwal Belajar Pekan Ini
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('jadwal-dan-target')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Lihat Jadwal Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Study Time Blocks for Today */}
              <div className="flex flex-col gap-2.5 mt-1">
                {/* Block 1 */}
                <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-surface-container/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-10 rounded-full bg-primary shrink-0" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-on-surface">
                          TKA: Fisika Rangkaian Listrik & Induksi Faraday
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">
                          Prioritas Elektro ITS
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" /> 16:00 - 17:30 WIB (90 Menit)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('pomodoro-focus')}
                    className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center gap-1 shadow-sm hover:bg-primary-container transition-colors shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Masuk Sesi
                  </button>
                </div>

                {/* Block 2 */}
                <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-surface-container/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-10 rounded-full bg-secondary shrink-0" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-on-surface">
                          TPS: Penalaran Matematika & Kuantitatif HOTS
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                          Intensif Malam
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" /> 19:30 - 21:00 WIB (90 Menit)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Pengingat telah diaktifkan untuk sesi TPS malam!')}
                    className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-semibold text-xs flex items-center gap-1 transition-colors shrink-0"
                  >
                    Ingatkan Sesi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col gap-6 min-w-0">
            {/* INTERACTIVE MINI POMODORO WIDGET */}
            <div 
              id="mini-pomodoro-widget"
              className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 flex flex-col items-center relative overflow-hidden border border-surface-container/60 transition-colors"
            >
              <div className="w-full flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-on-surface font-display">
                    Pomodoro Focus
                  </span>
                </div>
                {/* Audio Toggle */}
                <button
                  type="button"
                  onClick={toggleSound}
                  title="Toggle Ambience Lo-Fi"
                  className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  {isSoundActive ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-secondary" />
                      <span>Lo-Fi On</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-outline" />
                      <span>Mute</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mode Tabs */}
              <div className="w-full grid grid-cols-2 p-1 bg-surface-container-low rounded-xl mb-3">
                <button
                  type="button"
                  onClick={() => handleModeChange('tps')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    miniPomoMode === 'tps'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  TPS Focus (25m)
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('break')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    miniPomoMode === 'break'
                      ? 'bg-surface-container-lowest text-secondary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Istirahat (5m)
                </button>
              </div>

              {/* Circular Countdown Dial */}
              <div className="relative w-44 h-44 my-2 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-surface-container-high"
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                  />
                  <circle
                    className={`transition-all duration-300 ${
                      miniPomoMode === 'tps' ? 'text-primary' : 'text-secondary'
                    }`}
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray="264"
                    strokeDashoffset={miniStrokeOffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display font-extrabold text-3xl text-on-surface tabular-nums">
                    {formatTime(miniTimeLeft)}
                  </span>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mt-0.5">
                    {miniPomoMode === 'tps' ? 'Fokus Sesi 1' : 'Istirahat'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 mt-2 w-full">
                <button
                  type="button"
                  onClick={toggleMiniTimer}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary-container transition-all shadow-[0_0_16px_rgba(107,56,212,0.3)] active:scale-95"
                >
                  {isMiniRunning ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{miniTimeLeft < miniTotalTime ? 'Lanjutkan' : 'Mulai Belajar'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetMiniTimer}
                  className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors shrink-0 active:scale-95"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SKOR TO & EVALUASI */}
            <div 
              id="tryout-evaluation-card"
              className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-4 border border-surface-container/60 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <h2 className="font-display font-bold text-base text-on-surface">
                    Skor TO & Evaluasi
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                  TO Akbar #4
                </span>
              </div>

              {/* Score Value Box */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-on-surface-variant">Skor Terakhir Anda</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-display font-extrabold text-2xl text-on-surface">
                      {user.currentScore || 685}
                    </span>
                    <span className="text-xs text-on-surface-variant font-normal">/ 1000</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1 text-xs text-secondary font-bold">
                    <TrendingUp className="w-3.5 h-3.5" /> +35 Poin
                  </span>
                  <span className="text-[11px] text-on-surface-variant">vs TO #3 Pekan Lalu</span>
                </div>
              </div>

              {/* Target info */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex justify-between items-center text-xs text-on-surface-variant">
                  <span>Target {user.targetCampus}</span>
                  <span className="font-bold text-on-surface">{user.targetScore || 720}+ Poin</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.min(100, ((user.currentScore || 685) / (user.targetScore || 720)) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] text-secondary font-semibold">
                  Hanya terpaut {(user.targetScore || 720) - (user.currentScore || 685)} poin dari target aman!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal for Add / Edit Target */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSaveTask={(savedTask) => {
          if (onSaveTask) {
            onSaveTask(savedTask);
          }
        }}
        initialTask={taskToEdit}
      />
    </div>
  );
};
