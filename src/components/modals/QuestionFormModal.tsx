import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, HelpCircle, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { FlashcardQuestion } from '../../types';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuestion: (question: FlashcardQuestion) => void;
  initialQuestion?: FlashcardQuestion | null;
  deckCategory?: string;
  deckCategoryLabel?: string;
}

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitQuestion,
  initialQuestion,
  deckCategory = 'tps-pk',
  deckCategoryLabel = 'Pengetahuan Kuantitatif'
}) => {
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [subtest, setSubtest] = useState(deckCategoryLabel);
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('HOTS Level 4');
  const [targetSeconds, setTargetSeconds] = useState(45);
  const [hint, setHint] = useState('');
  const [steps, setSteps] = useState<{ title: string; description: string }[]>([
    { title: 'Langkah 1: Analisis Konsep', description: '' }
  ]);

  useEffect(() => {
    if (initialQuestion) {
      setQuestionText(initialQuestion.question);
      setAnswerText(initialQuestion.answer);
      setSubtest(initialQuestion.subtest);
      setTopic(initialQuestion.topic);
      setLevel(initialQuestion.level);
      setTargetSeconds(initialQuestion.targetSeconds || 45);
      setHint(initialQuestion.hint || '');
      setSteps(initialQuestion.steps && initialQuestion.steps.length > 0
        ? initialQuestion.steps
        : [{ title: 'Langkah 1: Pembahasan', description: '' }]);
    } else {
      setQuestionText('');
      setAnswerText('');
      setSubtest(deckCategoryLabel);
      setTopic('');
      setLevel('HOTS Level 4');
      setTargetSeconds(45);
      setHint('');
      setSteps([
        { title: 'Langkah 1: Analisis Konsep Kunci', description: '' },
        { title: 'Langkah 2: Eksekusi Perhitungan Cepat', description: '' }
      ]);
    }
  }, [initialQuestion, isOpen, deckCategoryLabel]);

  if (!isOpen) return null;

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      { title: `Langkah ${prev.length + 1}: Konfirmasi Hasil`, description: '' }
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: 'title' | 'description', value: string) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [field]: value } : step))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !answerText.trim()) {
      alert('Pertanyaan dan jawaban akhir wajib diisi.');
      return;
    }

    const compiledQuestion: FlashcardQuestion = {
      id: initialQuestion ? initialQuestion.id : `q-${Date.now()}`,
      subtest: subtest.trim() || 'TPS / TKA UTBK',
      topic: topic.trim() || 'Konsep Esensial',
      level: level,
      category: deckCategory,
      targetSeconds: Number(targetSeconds) || 45,
      question: questionText.trim(),
      hint: hint.trim() || 'Gunakan metode eliminasi cepat dan perhatikan kata kunci.',
      answer: answerText.trim(),
      steps: steps.filter((s) => s.description.trim() !== '')
    };

    if (compiledQuestion.steps.length === 0) {
      compiledQuestion.steps = [
        { title: 'Langkah 1: Pembahasan Solusi', description: answerText.trim() }
      ];
    }

    onSubmitQuestion(compiledQuestion);
    onClose();
  };

  const isEditing = Boolean(initialQuestion);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-surface-container my-8 max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-on-surface">
                {isEditing ? 'Edit Kartu Pertanyaan' : 'Tambah Kartu Soal Baru'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Sesuaikan konsep, rumus kilat, dan tahapan pembahasan HOTS
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 py-4 flex flex-col gap-4">
          {/* Question Text */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Pertanyaan / Soal UTBK <span className="text-tertiary">*</span>
            </label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Misal: Sebuah kawat berarus 5A berada dalam medan magnet 0.4 T secara tegak lurus..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed font-medium"
              required
            />
          </div>

          {/* Answer Text */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Kunci Jawaban Akhir <span className="text-tertiary">*</span>
            </label>
            <input
              type="text"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Misal: F/L = 2 N/m atau x = 5"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
              required
            />
          </div>

          {/* 3-Column Metadata: Subtest, Topic, Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Subtes
              </label>
              <input
                type="text"
                value={subtest}
                onChange={(e) => setSubtest(e.target.value)}
                placeholder="TKA Fisika Saintek"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Topik Materi
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Gaya Lorentz & Medan Magnet"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Tingkat HOTS
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="HOTS Level 2">HOTS Level 2 (Menengah)</option>
                <option value="HOTS Level 3">HOTS Level 3 (Tinggi)</option>
                <option value="HOTS Level 4">HOTS Level 4 (Kompleks)</option>
                <option value="HOTS Level 5">HOTS Level 5 (Olimpiade/Sangat Sulit)</option>
              </select>
            </div>
          </div>

          {/* Hint & Target Time */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3 flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Petunjuk Cepat (Trik Eliminasi 15 Detik)
              </label>
              <input
                type="text"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Gunakan rumus F = B × I × L × sin(θ)..."
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Target Detik
              </label>
              <input
                type="number"
                min="10"
                max="180"
                value={targetSeconds}
                onChange={(e) => setTargetSeconds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
              />
            </div>
          </div>

          {/* Dynamic Steps Section */}
          <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Langkah-Langkah Solusi Bertahap
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Langkah</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {steps.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                      placeholder={`Langkah ${idx + 1}: Judul Langkah`}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-xs font-bold text-primary border border-surface-container flex-1"
                    />
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-tertiary transition-colors"
                        title="Hapus langkah"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                    placeholder="Uraikan penjelasan dan penurunan rumus..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-surface-container leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container shrink-0 mt-2">
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
              {isEditing ? 'Simpan Perubahan' : 'Tambahkan ke Dek'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
