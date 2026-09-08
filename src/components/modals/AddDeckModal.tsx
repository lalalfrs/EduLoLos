import React, { useState } from 'react';
import { X, PlusCircle, Layers } from 'lucide-react';
import { FlashcardDeck } from '../../types';
import { 
  ASSET_IMAGES, 
  QUESTIONS_PBM, 
  QUESTIONS_LITERASI_INDO, 
  QUESTIONS_LITERASI_INGGRIS, 
  SAMPLE_QUESTIONS 
} from '../../data/mockData';

interface AddDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDeck: (deck: FlashcardDeck) => void;
}

export const AddDeckModal: React.FC<AddDeckModalProps> = ({
  isOpen,
  onClose,
  onAddDeck
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('pbm');
  const [tag, setTag] = useState('Baru');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Silakan masukkan nama dek flashcard.');
      return;
    }

    const categoryLabel =
      category === 'pbm' ? 'Pemahaman Bacaan & Menulis' :
      category === 'literasi-indo' ? 'Literasi Bahasa Indonesia' :
      category === 'literasi-inggris' ? 'Literasi Bahasa Inggris' :
      'Subtes Lainnya';

    const categoryQuestions = 
      category === 'pbm' ? QUESTIONS_PBM :
      category === 'literasi-indo' ? QUESTIONS_LITERASI_INDO :
      category === 'literasi-inggris' ? QUESTIONS_LITERASI_INGGRIS :
      SAMPLE_QUESTIONS;

    const newDeck: FlashcardDeck = {
      id: `deck-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Kumpulan kartu materi & konsep kunci',
      category: category,
      categoryLabel: categoryLabel,
      totalCards: categoryQuestions.length,
      masteryPercent: 0,
      tag: tag || 'Baru',
      tagColor: 'bg-primary-container text-on-primary-container',
      image: ASSET_IMAGES.deckLogic,
      altText: 'Custom Flashcard Deck',
      questions: categoryQuestions
    };

    onAddDeck(newDeck);
    setTitle('');
    setSubtitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-6 border border-surface-container">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-on-surface">
                Buat Dek Flashcard Baru
              </h3>
              <p className="text-xs text-on-surface-variant">
                Susun kartu hafalan rumus & konsep kunci
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
              placeholder="Misal: Rumus Cepat Matriks & Transformasi Geometri"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
            >
              <option value="pbm">Pemahaman Bacaan & Menulis (PBM)</option>
              <option value="literasi-indo">Literasi Bahasa Indonesia</option>
              <option value="literasi-inggris">Literasi Bahasa Inggris</option>
              <option value="lainnya">Subtes Lainnya (TPS / Saintek)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Trik eliminasi ordo matriks dan rotasi 90 derajat."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-md hover:bg-primary-container transition-all"
            >
              Buat Dek
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
