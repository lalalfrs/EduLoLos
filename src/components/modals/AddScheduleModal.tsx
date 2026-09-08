import React, { useState, useEffect } from 'react';
import { X, CalendarPlus, Clock, BookOpen, AlertCircle, Edit3 } from 'lucide-react';
import { ScheduleSession } from '../../types';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSession: (session: ScheduleSession) => void;
  initialSession?: ScheduleSession | null;
  onUpdateSession?: (session: ScheduleSession) => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onClose,
  onAddSession,
  initialSession,
  onUpdateSession
}) => {
  const [subtest, setSubtest] = useState('TPS - Penalaran Kuantitatif');
  const [day, setDay] = useState('Senin');
  const [timeRange, setTimeRange] = useState('16:00 - 17:30');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialSession) {
      setSubtest(initialSession.subtest || 'TPS - Penalaran Kuantitatif');
      setDay(initialSession.day || 'Senin');
      setTimeRange(initialSession.timeRange || '16:00 - 17:30');
      setTitle(initialSession.title || '');
      setDescription(initialSession.description || '');
    } else {
      setSubtest('TPS - Penalaran Kuantitatif');
      setDay('Senin');
      setTimeRange('16:00 - 17:30');
      setTitle('');
      setDescription('');
    }
  }, [initialSession, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(initialSession);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Silakan masukkan judul sesi belajar.');
      return;
    }

    if (isEditing && initialSession && onUpdateSession) {
      const updated: ScheduleSession = {
        ...initialSession,
        day: day,
        timeRange: timeRange || '16:00 - 17:30',
        title: title.trim(),
        description: description.trim() || 'Drill materi dan latihan soal terfokus',
        subtest: subtest
      };
      onUpdateSession(updated);
    } else {
      const newSession: ScheduleSession = {
        id: `sched-${Date.now()}`,
        day: day,
        timeRange: timeRange || '16:00 - 17:30',
        title: title.trim(),
        description: description.trim() || 'Drill materi dan latihan soal terfokus',
        subtest: subtest,
        durationMinutes: 90,
        status: 'upcoming',
        badge: 'Jadwal Harian'
      };
      onAddSession(newSession);
    }

    onClose();
  };

  return (
    <div 
      id="schedule-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 border border-surface-container relative">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <CalendarPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-on-surface">
                {isEditing ? 'Edit Sesi Belajar' : 'Tambah Slot Belajar'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Atur jadwal intensif UTBK mingguanmu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">
              Mata Uji / Subtes
            </label>
            <select
              value={subtest}
              onChange={(e) => setSubtest(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="TPS - Penalaran Kuantitatif">TPS - Penalaran Kuantitatif</option>
              <option value="TPS - Pemahaman Bacaan & Menulis">TPS - Pemahaman Bacaan & Menulis</option>
              <option value="TPS - Penalaran Umum">TPS - Penalaran Umum</option>
              <option value="Literasi Bahasa Indonesia">Literasi Bahasa Indonesia</option>
              <option value="Literasi Bahasa Inggris">Literasi Bahasa Inggris</option>
              <option value="Penalaran Matematika">Penalaran Matematika</option>
              <option value="TKA Fisika Listrik & Magnet (ITS)">TKA Fisika Listrik & Magnet (ITS)</option>
              <option value="TKA Fisika Lanjutan">TKA Fisika Lanjutan</option>
              <option value="TKA Kimia & Biologi">TKA Kimia & Biologi</option>
              <option value="Try Out Akbar UTBK">Try Out Akbar UTBK</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Hari
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
              >
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Waktu
              </label>
              <input
                type="text"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                placeholder="Misal: 16:00 - 17:30"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">
              Judul Sesi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Misal: Drill Soal Geometri & Aljabar Dasar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 font-semibold"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">
              Catatan / Target Butir Soal
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Misal: Bedah 20 butir soal tipe HOTS dan catat trik cepat eliminasi pilihan jawaban."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-all active:scale-95"
            >
              {isEditing ? 'Simpan Perubahan' : 'Jadwalkan Sesi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
