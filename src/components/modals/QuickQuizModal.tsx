import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { FlashcardDeck } from '../../types';

interface QuickQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: FlashcardDeck | null;
}

export const QuickQuizModal: React.FC<QuickQuizModalProps> = ({
  isOpen,
  onClose,
  deck
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen || !deck) return null;

  const rawQuestions = deck.questions && deck.questions.length > 0 ? deck.questions : [];

  const quizQuestions = rawQuestions.length > 0
    ? rawQuestions.map((q, idx) => {
        const defaultOpts = [
          q.answer,
          `Opsi distractor 1 (${q.topic})`,
          `Opsi distractor 2 (${q.topic})`,
          `Opsi distractor 3 (${q.topic})`
        ];
        // deterministic shuffle based on index so correct answer stays attached
        const correctIndex = idx % 4;
        const shuffled = [...defaultOpts];
        const temp = shuffled[0];
        shuffled[0] = shuffled[correctIndex];
        shuffled[correctIndex] = temp;

        const explanation = q.steps && q.steps.length > 0
          ? q.steps.map(s => `${s.title}: ${s.description}`).join(' ')
          : q.hint || `Kunci Jawaban: ${q.answer}`;

        return {
          q: q.question,
          options: shuffled,
          correct: correctIndex,
          explanation: explanation
        };
      })
    : [
        {
          q: 'Di antara pilihan berikut, manakah ciri kalimat efektif dalam teks PBM?',
          options: ['Hemat kata & tidak ambigu', 'Menggunakan pleonasme', 'Mengulang subjek ganda', 'Tanpa tanda baca'],
          correct: 0,
          explanation: 'Kalimat efektif harus hemat kata, logis, dan tidak ambigu.'
        }
      ];

  const currentQ = quizQuestions[currentIdx] || quizQuestions[0];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-6 border border-surface-container max-h-[85vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container shrink-0">
          <div>
            <span className="text-[11px] font-bold text-primary uppercase">
              Mode Kuis Cepat • {deck.categoryLabel}
            </span>
            <h3 className="font-display font-bold text-base text-on-surface">
              {deck.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isFinished ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden pt-3">
            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5">
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant">
                <span>Soal {currentIdx + 1} dari {quizQuestions.length}</span>
                <span className="text-secondary">Skor: {score * 33.3 | 0} Poin</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden shrink-0">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-low">
                <p className="font-display font-semibold text-sm text-on-surface leading-relaxed">
                  {currentQ.q}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2">
                {currentQ.options.map((opt, i) => {
                  let btnStyle = 'bg-surface-container-low hover:bg-surface-container text-on-surface';
                  if (isAnswered) {
                    if (i === currentQ.correct) {
                      btnStyle = 'bg-secondary-container text-on-secondary-container font-bold border border-secondary';
                    } else if (selectedOption === i) {
                      btnStyle = 'bg-error-container text-on-error-container font-bold border border-error';
                    } else {
                      btnStyle = 'opacity-40 bg-surface-container-low text-on-surface';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      type="button"
                      className={`flex items-center justify-between p-3 rounded-xl text-xs text-left transition-all ${btnStyle}`}
                    >
                      <span className="pr-2">{opt}</span>
                      {isAnswered && i === currentQ.correct && (
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                      )}
                      {isAnswered && selectedOption === i && i !== currentQ.correct && (
                        <XCircle className="w-4 h-4 text-error shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation box */}
              {isAnswered && (
                <div className="p-3.5 rounded-xl bg-primary-fixed/30 text-xs text-on-surface leading-relaxed border-l-4 border-primary animate-in fade-in">
                  <span className="font-bold text-primary block mb-0.5">Penjelasan Singkat:</span>
                  {currentQ.explanation}
                </div>
              )}
            </div>

            {/* Next Button Footer (Always visible & clickable) */}
            {isAnswered && (
              <div className="flex justify-end pt-3 mt-2 border-t border-surface-container shrink-0">
                <button
                  onClick={handleNext}
                  type="button"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-all active:scale-95"
                >
                  <span>{currentIdx < quizQuestions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="flex-1 overflow-y-auto py-4 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary shadow-md shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <h4 className="font-display font-bold text-xl text-on-surface">
              Kuis Selesai! 🎉
            </h4>
            <p className="text-xs text-on-surface-variant max-w-xs">
              Kamu berhasil menjawab {score} dari {quizQuestions.length} soal dengan benar.
            </p>
            <div className="p-3 rounded-xl bg-surface-container-low w-full flex items-center justify-around my-2">
              <div className="flex flex-col">
                <span className="text-[11px] text-on-surface-variant">Akurasi</span>
                <span className="font-bold text-base text-secondary">{Math.round((score / quizQuestions.length) * 100)}%</span>
              </div>
              <div className="h-6 w-px bg-surface-container" />
              <div className="flex flex-col">
                <span className="text-[11px] text-on-surface-variant">XP Diperoleh</span>
                <span className="font-bold text-base text-primary">+{score * 25} XP</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 w-full shrink-0">
              <button
                onClick={handleRestart}
                type="button"
                className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Kuis</span>
              </button>
              <button
                onClick={onClose}
                type="button"
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-md hover:bg-primary-container"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
