import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Play, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { FlashcardDeck, FlashcardQuestion } from '../../types';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: FlashcardDeck;
  onSelectQuestion: (index: number) => void;
  onOpenAddQuestion: () => void;
  onOpenEditQuestion: (question: FlashcardQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
  onResetQuestions: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  deck,
  onSelectQuestion,
  onOpenAddQuestion,
  onOpenEditQuestion,
  onDeleteQuestion,
  onResetQuestions
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  if (!isOpen) return null;

  const questions = deck.questions || [];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || q.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 border border-surface-container my-6 max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[11px] font-bold">
                  {deck.categoryLabel}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {questions.length} Total Soal
                </span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-on-surface mt-0.5">
                Bank Soal: {deck.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onOpenAddQuestion}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Soal</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 py-3 border-b border-surface-container shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci soal, topik, rumus, atau jawaban..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
            >
              <option value="all">Semua Tingkat HOTS</option>
              <option value="HOTS Level 2">HOTS Level 2</option>
              <option value="HOTS Level 3">HOTS Level 3</option>
              <option value="HOTS Level 4">HOTS Level 4</option>
              <option value="HOTS Level 5">HOTS Level 5</option>
            </select>

            <button
              type="button"
              onClick={onResetQuestions}
              title="Reset ke soal bawaan sistem"
              className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-xs flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Default</span>
            </button>
          </div>
        </div>

        {/* Questions List (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 flex flex-col gap-3 min-h-[300px]">
          {filteredQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-on-surface-variant">
              <Sparkles className="w-10 h-10 text-primary mb-3 opacity-40" />
              <p className="font-bold text-sm text-on-surface">Tidak ada soal yang sesuai</p>
              <p className="text-xs text-on-surface-variant max-w-sm mt-1">
                Ubah kata kunci pencarian atau buat kartu soal baru dengan menekan tombol &quot;Tambah Soal&quot;.
              </p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const originalIndex = questions.findIndex((item) => item.id === q.id);
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container/80 border border-surface-container transition-all flex flex-col gap-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-surface-container-highest text-on-surface text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[10px] font-bold">
                        {q.subtest}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold">
                        {q.level}
                      </span>
                      <span className="text-[11px] font-medium text-on-surface-variant">
                        • {q.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectQuestion(originalIndex);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Kerjakan di Stage Flashcard"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Latihan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenEditQuestion(q)}
                        className="p-1.5 rounded-lg hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors"
                        title="Edit Pertanyaan Ini"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Yakin ingin menghapus kartu soal ini dari dek?')) {
                            onDeleteQuestion(q.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-surface-container-highest text-on-surface-variant hover:text-tertiary transition-colors"
                        title="Hapus Pertanyaan Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="text-xs sm:text-sm text-on-surface font-medium leading-relaxed">
                    {q.question}
                  </div>

                  {/* Answer Preview & Quick Hint */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                      <span className="text-on-surface font-bold">
                        Jawaban: {q.answer}
                      </span>
                    </div>
                    {q.hint && (
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] truncate max-w-md">
                        <Sparkles className="w-3 h-3 text-tertiary shrink-0" />
                        <span className="italic truncate">{q.hint}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-container shrink-0">
          <span className="text-xs text-on-surface-variant">
            Menampilkan {filteredQuestions.length} dari {questions.length} kartu di dek ini
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
