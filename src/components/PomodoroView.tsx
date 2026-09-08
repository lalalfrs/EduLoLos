import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Radio, 
  Sliders, 
  Sparkles, 
  Brain, 
  CheckSquare, 
  Plus, 
  Check, 
  Clock, 
  Flame, 
  CloudRain, 
  Coffee, 
  Waves, 
  VolumeOff,
  Quote,
  Trash2
} from 'lucide-react';
import { PomodoroMode, AmbienceType, TaskItem } from '../types';
import { ASSET_IMAGES, INITIAL_FOCUS_CHECKLIST, WEEKLY_FOCUS_STATS } from '../data/mockData';
import { storage } from '../utils/storage';
import { soundManager } from '../utils/audioSynthesizer';

export const PomodoroView: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [customMinutes, setCustomMinutes] = useState(45);
  const [showCustomModal, setShowCustomModal] = useState(false);
  
  // Timer durations
  const getDuration = (m: PomodoroMode) => {
    switch (m) {
      case 'focus': return 25 * 60;
      case 'shortBreak': return 5 * 60;
      case 'longBreak': return 15 * 60;
      case 'custom': return customMinutes * 60;
    }
  };

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(3);
  const totalCycles = 4;

  // Ambience Audio
  const [ambience, setAmbience] = useState<AmbienceType>('rain');
  const [volume, setVolume] = useState(70);

  // Active Task and Checklist with storage persistence
  const [activeTaskTitle, setActiveTaskTitle] = useState('Pemantapan Rumus Fisika & Rangkaian Listrik ITS');
  const [checklist, setChecklist] = useState<TaskItem[]>(() => storage.getFocusChecklist());
  const [newChecklistText, setNewChecklistText] = useState('');

  const updateChecklistState = (items: TaskItem[]) => {
    setChecklist(items);
    storage.saveFocusChecklist(items);
  };

  // Start initial audio on load if desired
  useEffect(() => {
    soundManager.setVolume(volume);
    soundManager.playSound(ambience);
    return () => {
      soundManager.stopSound();
    };
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'focus') {
        const nextCycle = cycle < totalCycles ? cycle + 1 : 1;
        setCycle(nextCycle);
        alert('🎉 Sesi Fokus Selesai! Saatnya istirahat sejenak.');
        setMode(nextCycle === totalCycles ? 'longBreak' : 'shortBreak');
        setTimeLeft(nextCycle === totalCycles ? 15 * 60 : 5 * 60);
      } else {
        alert('⏰ Waktu istirahat selesai. Siap mulai sesi fokus berikutnya?');
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, cycle]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const skipSession = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setMode('shortBreak');
      setTimeLeft(5 * 60);
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
      setCycle((c) => (c < totalCycles ? c + 1 : 1));
    }
  };

  const switchMode = (newMode: PomodoroMode) => {
    if (newMode === 'custom') {
      setShowCustomModal(true);
      return;
    }
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getDuration(newMode));
  };

  const handleSelectAmbience = (type: AmbienceType) => {
    setAmbience(type);
    soundManager.playSound(type);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundManager.setVolume(newVol);
  };

  const toggleChecklist = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updateChecklistState(updated);
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem: TaskItem = {
      id: `chk-${Date.now()}`,
      title: newChecklistText.trim(),
      completed: false
    };
    updateChecklistState([...checklist, newItem]);
    setNewChecklistText('');
  };

  const handleDeleteChecklist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = checklist.filter((item) => item.id !== id);
    updateChecklistState(updated);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentTotal = getDuration(mode);
  const progressRatio = (currentTotal - timeLeft) / currentTotal;
  const strokeDashoffset = 754 - progressRatio * 754; // radius 120, circumference ~ 753.98

  return (
    <div className="flex flex-col w-full gap-6">
      {/* HEADER ROOM TAG & PULSE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-surface-container">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
              Deep Focus Room
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              Mode Siap Tempur SNBT
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface mt-1">
            Pomodoro Focus Arena
          </h1>
        </div>

        {/* Siklus Pomodoro Indicator */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low border border-surface-container self-start md:self-auto">
          <span className="text-xs font-semibold text-on-surface-variant">Siklus Pomodoro:</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < cycle
                    ? 'bg-secondary'
                    : i === cycle
                    ? 'bg-primary ring-2 ring-primary-fixed ring-offset-1 ring-offset-surface-container-low animate-pulse'
                    : 'bg-surface-container-highest'
                }`}
                title={`Siklus ${i} dari ${totalCycles}`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-primary ml-1">
            {cycle} / {totalCycles}
          </span>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: MAIN DIAL & AMBIENCE VS TASKS & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: TIMER & SOUNDS (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* MAIN TIMER CARD */}
          <div 
            id="pomodoro-dial-card"
            className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 md:p-8 flex flex-col items-center border border-surface-container/60 relative overflow-hidden"
          >
            {/* Mode Navigation Pills */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container-low border border-surface-container max-w-full overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => switchMode('focus')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  mode === 'focus'
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Fokus Belajar (25m)
              </button>
              <button
                type="button"
                onClick={() => switchMode('shortBreak')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  mode === 'shortBreak'
                    ? 'bg-secondary text-on-secondary shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Istirahat Singkat (5m)
              </button>
              <button
                type="button"
                onClick={() => switchMode('longBreak')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  mode === 'longBreak'
                    ? 'bg-tertiary text-on-tertiary shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Istirahat Panjang (15m)
              </button>
              <button
                type="button"
                onClick={() => switchMode('custom')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  mode === 'custom'
                    ? 'bg-primary-container text-on-primary-container shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Custom ({customMinutes}m)
              </button>
            </div>

            {/* LARGE CIRCULAR TIMER DIAL */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 my-8 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
                {/* Background Ring */}
                <circle
                  className="text-surface-container-high"
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                />
                {/* Active Gradient Ring */}
                <circle
                  className={`transition-all duration-300 ${
                    mode === 'focus'
                      ? 'text-primary'
                      : mode === 'shortBreak'
                      ? 'text-secondary'
                      : mode === 'longBreak'
                      ? 'text-tertiary'
                      : 'text-primary-container'
                  }`}
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray="754"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Details */}
              <div className="absolute flex flex-col items-center text-center">
                <span className="font-display font-extrabold text-5xl md:text-6xl text-on-surface tracking-tight tabular-nums">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs font-bold text-secondary uppercase tracking-widest mt-2">
                  {mode === 'focus'
                    ? 'Sesi Fokus TPS & TKA'
                    : mode === 'shortBreak'
                    ? 'Istirahat Singkat'
                    : 'Istirahat Panjang'}
                </span>
                <span className="text-[11px] text-on-surface-variant mt-1">
                  Target Skor: STEI-ITB 720+
                </span>
              </div>
            </div>

            {/* ACTION CONTROLS */}
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={resetTimer}
                className="w-12 h-12 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-all active:scale-95 shadow-sm"
                title="Reset Sesi"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={toggleTimer}
                className="px-8 py-3.5 rounded-2xl bg-primary text-on-primary font-display font-bold text-base flex items-center gap-2.5 shadow-[0_0_24px_rgba(107,56,212,0.4)] hover:bg-primary-container transition-all active:scale-95"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Jeda Sesi</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{timeLeft < getDuration(mode) ? 'Lanjutkan Fokus' : 'Mulai Fokus'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={skipSession}
                className="w-12 h-12 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-all active:scale-95 shadow-sm"
                title="Lewati Sesi"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* STUDY AMBIENCE & AUDIO BGM */}
          <div 
            id="audio-ambience-card"
            className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-4 border border-surface-container/60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-base text-on-surface">
                  Study Ambience & Audio BGM
                </h2>
              </div>
              <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" /> Web Audio Engine
              </span>
            </div>

            {/* Audio Mode Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'rain', label: 'Lo-Fi Rain', desc: 'Hujan rintik di kafe', icon: <CloudRain className="w-4 h-4" /> },
                { id: 'cafe', label: 'Cafe Noise', desc: 'Tenang perpustakaan', icon: <Coffee className="w-4 h-4" /> },
                { id: 'alpha', label: 'Alpha Waves', desc: 'Binaural beats 10Hz', icon: <Waves className="w-4 h-4" /> },
                { id: 'mute', label: 'Hening Total', desc: 'Mute suara latar', icon: <VolumeOff className="w-4 h-4" /> }
              ].map((item) => {
                const isActive = ambience === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectAmbience(item.id as AmbienceType)}
                    className={`p-3 rounded-2xl flex flex-col text-left transition-all border ${
                      isActive
                        ? 'bg-primary-fixed/40 border-primary text-primary shadow-sm scale-[1.02]'
                        : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={isActive ? 'text-primary' : 'text-on-surface-variant'}>
                        {item.icon}
                      </span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="font-bold text-xs text-on-surface">{item.label}</span>
                    <span className="text-[10px] text-on-surface-variant mt-0.5 leading-tight">{item.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Volume Slider Bar */}
            <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-2xl">
              <button
                type="button"
                onClick={() => handleSelectAmbience(ambience === 'mute' ? 'rain' : 'mute')}
                className="text-on-surface-variant hover:text-on-surface"
              >
                {ambience === 'mute' || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4 text-primary" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="flex-1 accent-primary h-1.5 bg-surface-container-high rounded-lg cursor-pointer"
              />
              <span className="text-xs font-bold text-on-surface-variant w-9 text-right">
                {volume}%
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE TASK, STATS, & INSPIRATION (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* ACTIVE TASK CARD */}
          <div 
            id="active-task-card"
            className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-4 border border-surface-container/60"
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-secondary" />
                <h2 className="font-display font-bold text-base text-on-surface">
                  Target Sesi Aktif
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                TPS & TKA
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-on-surface-variant">Topik Utama:</span>
              <input
                type="text"
                value={activeTaskTitle}
                onChange={(e) => setActiveTaskTitle(e.target.value)}
                className="font-display font-bold text-base text-on-surface bg-surface-container-low px-3 py-2 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Checklist of Subtasks */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-on-surface-variant">
                Langkah Eksekusi ({checklist.filter(c => c.completed).length}/{checklist.length} Selesai)
              </span>

              <div className="flex flex-col gap-1.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center transition-all shrink-0 ${
                          item.completed ? 'bg-secondary text-white' : 'border border-outline bg-surface-container-lowest'
                        }`}
                      >
                        {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs truncate ${
                          item.completed ? 'line-through text-on-surface-variant opacity-60' : 'text-on-surface font-medium'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteChecklist(item.id, e)}
                      className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-surface-container-high text-on-surface-variant hover:text-tertiary transition-all shrink-0"
                      title="Hapus langkah ini"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Subtask Input */}
              <form onSubmit={handleAddChecklist} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="Tambah sub-task baru..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs shadow-sm transition-all"
                  title="Tambah"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* WEEKLY FOCUS STATS BAR CHART */}
          <div 
            id="weekly-focus-stats-card"
            className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-4 border border-surface-container/60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-tertiary fill-tertiary" />
                <h2 className="font-display font-bold text-base text-on-surface">
                  Statistik Fokus Mingguan
                </h2>
              </div>
              <span className="text-xs font-bold text-primary">15.8 Jam Total</span>
            </div>

            {/* Interactive 7-Day Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2 bg-surface-container-low rounded-2xl">
              {WEEKLY_FOCUS_STATS.map((stat, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                    {stat.hours}j
                  </span>
                  <div
                    className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                      stat.isToday
                        ? 'bg-primary shadow-[0_0_12px_rgba(107,56,212,0.4)]'
                        : 'bg-surface-container-high hover:bg-primary-fixed'
                    }`}
                    style={{ height: `${stat.heightPx}%` }}
                  />
                  <span className={`text-[10px] uppercase font-bold mt-1 ${stat.isToday ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {stat.shortDay}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-surface-container">
              <span>Rata-rata: 2.6 Jam/Hari</span>
              <span className="text-secondary font-bold">Konsistensi 94%</span>
            </div>
          </div>

          {/* MINDSET JUARA SNBT QUOTE */}
          <div 
            id="mindset-quote-card"
            className="rounded-3xl bg-gradient-to-br from-primary-fixed/60 via-surface-container-low to-secondary-container/40 p-6 flex flex-col gap-2 border border-primary-fixed/40 relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Quote className="w-4 h-4" />
              <span>Mindset Juara SNBT</span>
            </div>
            <p className="font-display font-semibold text-sm text-on-surface italic leading-relaxed">
              "Disiplin adalah jembatan antara impian STEI-ITB dan kenyataan kelulusan. Selesaikan satu sesi pomodoro ini dengan kesadaran penuh."
            </p>
            <span className="text-[11px] text-on-surface-variant font-medium">
              — Catatan Motivasi Rania Azzahra
            </span>
          </div>

          {/* VISUAL DESK CARDS (ASSETS FROM USER'S MOCKUP) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden relative group h-28 border border-surface-container">
              <img
                src={ASSET_IMAGES.desk1}
                alt="Suasana Tenang"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                <span className="text-xs font-bold text-white">Suasana Tenang</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group h-28 border border-surface-container">
              <img
                src={ASSET_IMAGES.desk2}
                alt="Konsistensi Rutin"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                <span className="text-xs font-bold text-white">Konsistensi Rutin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM TIME MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-6 max-w-xs w-full border border-surface-container">
            <h3 className="font-display font-bold text-base text-on-surface mb-2">
              Atur Durasi Fokus Kustom
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Pilih durasi sesi belajar yang kamu butuhkan (misal untuk simulasi 90 menit UTBK).
            </p>
            <div className="flex items-center justify-center gap-3 my-4">
              <button
                type="button"
                onClick={() => setCustomMinutes(Math.max(5, customMinutes - 5))}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-lg font-bold"
              >
                -
              </button>
              <span className="font-display font-extrabold text-2xl text-primary w-20 text-center">
                {customMinutes} m
              </span>
              <button
                type="button"
                onClick={() => setCustomMinutes(Math.min(180, customMinutes + 5))}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-lg font-bold"
              >
                +
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-on-surface-variant"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('custom');
                  setTimeLeft(customMinutes * 60);
                  setIsRunning(false);
                  setShowCustomModal(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
