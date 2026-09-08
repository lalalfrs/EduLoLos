import React, { useState, useEffect } from 'react';
import { X, Edit, Layers, Tag } from 'lucide-react';
import { FlashcardDeck } from '../../types';

interface EditDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: FlashcardDeck | null;
  onUpdateDeck: (updated: FlashcardDeck) => void;
}

export const EditDeckModal: React.FC<EditDeckModalProps> = ({
  isOpen,
  onClose,
  deck,
  onUpdateDeck
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('pbm');
  const [tag, setTag] = useState('');

  useEffect(() => {
    if (deck) {
      setTitle(deck.title);
      setSubtitle(deck.subtitle);
      setCategory(deck.category || 'pbm');
      setTag(deck.tag);
    }
  }, [deck, isOpen]);

  if (!isOpen || !deck) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Nama dek flashcard wajib diisi.');
      return;
    }

    const categoryLabel = 
      category === 'pbm' ? 'Pemahaman Bacaan & Menulis' : 
      category === 'literasi-indo' ? 'Literasi Bahasa Indonesia' : 
      category === 'literasi-inggris' ? 'Literasi Bahasa Inggris' : 
      'Subtes Lainnya';

    const updated: FlashcardDeck = {
      ...deck,
      title: title.trim(),
      subtitle: subtitle.trim() || deck.subtitle,
      category,
      categoryLabel,
      tag: tag.trim() || deck.tag
    };

    onUpdateDeck(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-surface-container">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-on-surface">
                Edit Dek Flashcard
              </h3>
              <p className="text-xs text-on-surface-variant">
                Perbarui nama dek, deskripsi, atau subtes
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
              Judul Dek
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">
              Kategori / Subtes
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
            >
              <option value="pbm">Pemahaman Bacaan & Menulis (PBM)</option>
              <option value="literasi-indo">Literasi Bahasa Indonesia</option>
              <option value="literasi-inggris">Literasi Bahasa Inggris</option>
              <option value="lainnya">Subtes Lainnya (TPS / Saintek)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">
              Tag / Label Prioritas
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Misal: Prioritas ITS, HOTS, Favorit"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
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
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
