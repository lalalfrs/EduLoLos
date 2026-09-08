import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Plus, Edit3, Award } from 'lucide-react';
import { TaskItem } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: TaskItem) => void;
  initialTask?: TaskItem | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  initialTask
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [xp, setXp] = useState(50);
  const [badge, setBadge] = useState('Berjalan');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setSubtitle(initialTask.subtitle || '');
      setXp(initialTask.xp || 50);
      setBadge(initialTask.badge || 'Berjalan');
    } else {
      setTitle('');
      setSubtitle('');
      setXp(50);
      setBadge('Berjalan');
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(initialTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Judul target belajar wajib diisi.');
      return;
    }

    const task: TaskItem = {
      id: initialTask ? initialTask.id : `task-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Target fokus persiapan UTBK & TKA',
      completed: initialTask ? initialTask.completed : false,
      xp: Number(xp) || 50,
      badge: badge
    };

    onSaveTask(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-surface-container">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <CheckSquare className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-on-surface">
                {isEditing ? 'Edit Target Belajar' : 'Tambah Target Harian'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Susun milestone dan perolehan XP harianmu
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
              Nama Target / Aktivitas
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Misal: Kerjakan 20 Soal HOTS Induksi Faraday"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">
              Keterangan / Estimasi
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Misal: Target akurasi 85% • 30 menit fokus"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Reward XP
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Status Badge
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs font-medium border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="Berjalan">Berjalan ⏳</option>
                <option value="Prioritas">Prioritas 🔥</option>
                <option value="Terkunci">Terkunci 🔒</option>
                <option value="Selesai">Selesai ✅</option>
              </select>
            </div>
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
              {isEditing ? 'Simpan Target' : 'Tambah Target'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
