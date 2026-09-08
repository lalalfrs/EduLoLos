import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  RotateCw, 
  Star, 
  Lightbulb, 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  PenTool, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  Play, 
  PieChart, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  Bookmark,
  Edit3,
  Trash2,
  ListOrdered
} from 'lucide-react';
import { FlashcardDeck, FlashcardQuestion } from '../types';
import { storage } from '../utils/storage';
import { 
  FLASHCARD_DECKS, 
  QUESTIONS_PBM, 
  QUESTIONS_LITERASI_INDO, 
  QUESTIONS_LITERASI_INGGRIS, 
  SAMPLE_QUESTIONS 
} from '../data/mockData';
import { ScratchpadModal } from './modals/ScratchpadModal';
import { QuickQuizModal } from './modals/QuickQuizModal';
import { AddDeckModal } from './modals/AddDeckModal';
import { EditDeckModal } from './modals/EditDeckModal';
import { QuestionFormModal } from './modals/QuestionFormModal';
import { QuestionBankModal } from './modals/QuestionBankModal';

export const FlashcardView: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => storage.getDecks());
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck>(() => {
    const loaded = storage.getDecks();
    return loaded[0] || FLASHCARD_DECKS[0];
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Flashcard interaction state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [bookmarkedCards, setBookmarkedCards] = useState<Record<string, boolean>>({});

  // Modals state
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [showEditDeck, setShowEditDeck] = useState(false);
  const [deckToEdit, setDeckToEdit] = useState<FlashcardDeck | null>(null);

  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<FlashcardQuestion | null>(null);

  const [quizDeck, setQuizDeck] = useState<FlashcardDeck | null>(null);

  // Synchronize decks to storage whenever modified
  const updateDecksState = (newDecks: FlashcardDeck[]) => {
    setDecks(newDecks);
    storage.saveDecks(newDecks);
    // Also update active deck reference
    const updatedActive = newDecks.find((d) => d.id === activeDeck.id);
    if (updatedActive) {
      setActiveDeck(updatedActive);
    } else if (newDecks.length > 0) {
      setActiveDeck(newDecks[0]);
    }
  };

  // Category fallback questions mapper
  const getCategoryFallbackQuestions = (cat?: string): FlashcardQuestion[] => {
    if (cat === 'pbm') return QUESTIONS_PBM;
    if (cat === 'literasi-indo') return QUESTIONS_LITERASI_INDO;
    if (cat === 'literasi-inggris') return QUESTIONS_LITERASI_INGGRIS;
    return QUESTIONS_PBM;
  };

  // Deck questions (ensure category specific fallback so never empty or mixed)
  const currentQuestions = activeDeck.questions && activeDeck.questions.length > 0 
    ? activeDeck.questions 
    : getCategoryFallbackQuestions(activeDeck.category);
  const safeIndex = cardIndex >= currentQuestions.length ? 0 : cardIndex;
  const currentCard = currentQuestions[safeIndex] || currentQuestions[0];

  // Key listener for Spacebar flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCardIndex((prev) => (prev + 1) % currentQuestions.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCardIndex((prev) => (prev - 1 + currentQuestions.length) % currentQuestions.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setShowHint(false);
    const randomIdx = Math.floor(Math.random() * currentQuestions.length);
    setCardIndex(randomIdx);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRateCard = (rating: 'hard' | 'doubt' | 'easy') => {
    // Spaced repetition response: advance and slightly boost mastery
    let delta = rating === 'easy' ? 2 : rating === 'doubt' ? 0 : -2;
    const newMastery = Math.min(100, Math.max(10, activeDeck.masteryPercent + delta));
    const updatedDeck: FlashcardDeck = {
      ...activeDeck,
      masteryPercent: newMastery
    };
    const newDecks = decks.map((d) => (d.id === activeDeck.id ? updatedDeck : d));
    updateDecksState(newDecks);
    handleNext();
  };

  // DECK CRUD
  const handleAddDeck = (newDeck: FlashcardDeck) => {
    const newDecks = [newDeck, ...decks];
    updateDecksState(newDecks);
    setActiveDeck(newDeck);
    setCardIndex(0);
    setIsFlipped(false);
  };

  const handleUpdateDeck = (updatedDeck: FlashcardDeck) => {
    const newDecks = decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d));
    updateDecksState(newDecks);
  };

  const handleDeleteDeck = (deckId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (decks.length <= 1) {
      alert('Tidak dapat menghapus semua dek. Sisakan minimal 1 dek aktif.');
      return;
    }
    if (confirm('Yakin ingin menghapus dek ini beserta semua pertanyaannya?')) {
      const newDecks = decks.filter((d) => d.id !== deckId);
      updateDecksState(newDecks);
      if (activeDeck.id === deckId) {
        setActiveDeck(newDecks[0]);
        setCardIndex(0);
      }
    }
  };

  // QUESTION CRUD (within activeDeck)
  const handleSaveQuestion = (question: FlashcardQuestion) => {
    const existingIndex = activeDeck.questions.findIndex((q) => q.id === question.id);
    let updatedQuestions: FlashcardQuestion[];

    if (existingIndex >= 0) {
      // UPDATE
      updatedQuestions = activeDeck.questions.map((q) => (q.id === question.id ? question : q));
    } else {
      // CREATE
      updatedQuestions = [question, ...activeDeck.questions];
    }

    const updatedDeck: FlashcardDeck = {
      ...activeDeck,
      questions: updatedQuestions,
      totalCards: updatedQuestions.length
    };

    const newDecks = decks.map((d) => (d.id === activeDeck.id ? updatedDeck : d));
    updateDecksState(newDecks);

    if (existingIndex >= 0) {
      setCardIndex(existingIndex);
    } else {
      setCardIndex(0);
    }
    setIsFlipped(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (activeDeck.questions.length <= 1) {
      alert('Dek harus memiliki minimal 1 kartu soal.');
      return;
    }
    const updatedQuestions = activeDeck.questions.filter((q) => q.id !== questionId);
    const updatedDeck: FlashcardDeck = {
      ...activeDeck,
      questions: updatedQuestions,
      totalCards: updatedQuestions.length
    };

    const newDecks = decks.map((d) => (d.id === activeDeck.id ? updatedDeck : d));
    updateDecksState(newDecks);
    setCardIndex((prev) => Math.min(prev, updatedQuestions.length - 1));
    setIsFlipped(false);
  };

  const handleResetQuestions = () => {
    if (confirm('Kembalikan bank soal dek ini ke default sistem?')) {
      const resetDeckList = storage.resetDecks();
      setDecks(resetDeckList);
      const restored = resetDeckList.find((d) => d.id === activeDeck.id) || resetDeckList[0];
      setActiveDeck(restored);
      setCardIndex(0);
    }
  };

  // Filtered Decks for Grid
  const filteredDecks = decks.filter((deck) => {
    const matchesCat = activeCategory === 'all' || deck.category === activeCategory;
    const matchesSearch = deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deck.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      if (decks.length > 0) {
        setActiveDeck(decks[0]);
        setCardIndex(0);
        setIsFlipped(false);
        setShowHint(false);
      }
    } else {
      const matchingDeck = decks.find((d) => d.category === catId);
      if (matchingDeck) {
        setActiveDeck(matchingDeck);
        setCardIndex(0);
        setIsFlipped(false);
        setShowHint(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-surface-container">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
              Flashcard Belajar UTBK
            </span>
            <span className="text-xs font-semibold text-secondary">
              PBM & Literasi Fokus
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-on-surface mt-1">
            Flashcard PBM & Literasi Bahasa
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
            Fokus belajar Pemahaman Bacaan & Menulis (PBM), Literasi Bahasa Indonesia, dan Literasi Bahasa Inggris.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi atau kata kunci..."
              className="pl-9 pr-3.5 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 w-44 sm:w-56"
            />
          </div>

          {/* Buat Dek Baru Button */}
          <button
            type="button"
            onClick={() => setShowAddDeck(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Dek Baru</span>
          </button>
        </div>
      </div>

      {/* SUBTEST FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', label: `Semua Dek (${decks.length})` },
          { id: 'pbm', label: 'Pemahaman Bacaan & Menulis (PBM)' },
          { id: 'literasi-indo', label: 'Literasi Bahasa Indonesia' },
          { id: 'literasi-inggris', label: 'Literasi Bahasa Inggris' }
        ].map((pill) => (
          <button
            key={pill.id}
            type="button"
            onClick={() => handleSelectCategory(pill.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === pill.id
                ? 'bg-primary text-on-primary shadow-sm scale-102'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* MAIN FLASHCARD WORKSPACE & DECK CARDS (GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER: INTERACTIVE FLASHCARD STAGE (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* STAGE HEADER TOOLBAR: DECK INFO & QUESTION ACTIONS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 font-bold text-sm">
                <Layers className="w-4 h-4" />
              </span>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-on-surface truncate">
                    {activeDeck.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold shrink-0">
                    {currentQuestions.length} Soal
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant truncate">
                  {activeDeck.subtitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
              {/* Question Bank Manager */}
              <button
                type="button"
                onClick={() => setShowQuestionBank(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors"
                title="Kelola & Daftar Semua Soal di Dek Ini"
              >
                <ListOrdered className="w-3.5 h-3.5 text-primary" />
                <span>Bank Soal</span>
              </button>

              {/* Add Question to Active Deck */}
              <button
                type="button"
                onClick={() => {
                  setQuestionToEdit(null);
                  setShowQuestionForm(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-bold shadow-sm transition-all"
                title="Tambah Kartu Pertanyaan Baru ke Dek Ini"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Soal</span>
              </button>
            </div>
          </div>

          {/* 3D FLIPPABLE FLASHCARD CONTAINER */}
          <div className="flex flex-col gap-4">
            <div
              id="active-flashcard"
              onClick={handleFlip}
              className="relative w-full min-h-[390px] md:min-h-[430px] rounded-3xl cursor-pointer select-none transition-all duration-500 perspective-1000 group"
            >
              <div
                className={`relative w-full h-full min-h-[390px] md:min-h-[430px] rounded-3xl p-6 md:p-8 flex flex-col justify-between border shadow-sm transition-all duration-500 ${
                  isFlipped
                    ? 'bg-surface-container-lowest border-primary shadow-[0_0_30px_rgba(107,56,212,0.15)]'
                    : 'bg-surface-container-lowest border-surface-container hover:border-primary/50'
                }`}
              >
                {/* FRONT FACE */}
                {!isFlipped ? (
                  <div className="flex flex-col justify-between h-full gap-4">
                    {/* Top Metadata & Edit/Delete Controls for Current Card */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">
                          {currentCard.subtest}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                          {currentCard.topic}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                          {currentCard.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1 mr-1">
                          <Clock className="w-3.5 h-3.5 text-primary" /> {currentCard.targetSeconds || 45}d
                        </span>

                        {/* Edit Current Card */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuestionToEdit(currentCard);
                            setShowQuestionForm(true);
                          }}
                          className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                          title="Edit Kartu Pertanyaan Ini"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Current Card */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Hapus pertanyaan ini dari dek?')) {
                              handleDeleteQuestion(currentCard.id);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-tertiary transition-colors"
                          title="Hapus Kartu Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Bookmark Toggle */}
                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(currentCard.id, e)}
                          className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-amber-500 transition-colors ml-1"
                          title="Tandai Favorit"
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${
                              bookmarkedCards[currentCard.id] ? 'fill-amber-500 text-amber-500' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="my-auto py-6">
                      <p className="font-display font-bold text-xl md:text-2xl text-on-surface text-center leading-relaxed">
                        {currentCard.question}
                      </p>
                    </div>

                    {/* Hint Drawer (Clickable without flipping) */}
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(!showHint);
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-primary transition-colors self-center"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>{showHint ? 'Sembunyikan Petunjuk' : 'Petunjuk Cepat (Trik 15 Detik)'}</span>
                        {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {showHint && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="p-3.5 rounded-xl bg-amber-500/10 text-xs text-on-surface leading-relaxed border-l-4 border-amber-500 animate-in fade-in"
                        >
                          <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">Trik Eliminasi:</span>
                          {currentCard.hint}
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-2 text-[11px] text-on-surface-variant text-center pt-2">
                        <RotateCw className="w-3 h-3 text-primary animate-spin" />
                        <span>Klik kartu atau tekan <kbd className="px-1.5 py-0.5 rounded bg-surface-container border font-mono">Spasi</kbd> untuk melihat pembahasan</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* BACK FACE */
                  <div className="flex flex-col justify-between h-full gap-4 animate-in fade-in">
                    {/* Header Solution */}
                    <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                        <span className="font-display font-bold text-sm text-on-surface">
                          Kunci Jawaban & Solusi Kilat
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">
                          {currentCard.subtest}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuestionToEdit(currentCard);
                            setShowQuestionForm(true);
                          }}
                          className="px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface-variant hover:text-primary flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>

                    {/* Answer Highlight */}
                    <div className="p-4 rounded-2xl bg-secondary-container/40 border border-secondary/30 flex items-center justify-between">
                      <span className="text-xs text-on-secondary-container font-semibold">Hasil Akhir:</span>
                      <span className="font-display font-extrabold text-xl text-secondary">
                        {currentCard.answer}
                      </span>
                    </div>

                    {/* Step by Step breakdown */}
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-48 pr-1 scrollbar-none">
                      {currentCard.steps && currentCard.steps.map((step, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-surface-container-low text-xs">
                          <span className="font-bold text-primary block mb-0.5">{step.title}</span>
                          <span className="text-on-surface leading-relaxed">{step.description}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-on-surface-variant text-center pt-1 border-t border-surface-container">
                      <span>Klik kartu lagi untuk membalik ke pertanyaan</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SPACED REPETITION RATING BUTTONS (SM-2) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container">
              <span className="text-xs font-semibold text-on-surface-variant">
                Seberapa paham kamu dengan soal ini?
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleRateCard('hard')}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Sulit (Ulangi)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('doubt')}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-surface-container text-on-surface font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-container-high active:scale-95 transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ragu (Besok)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('easy')}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mudah (Paham)</span>
                </button>
              </div>
            </div>

            {/* DECK NAVIGATION CONTROLS */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors active:scale-95"
                  title="Kartu Sebelumnya"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-on-surface">
                  Kartu {safeIndex + 1} dari {currentQuestions.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors active:scale-95"
                  title="Kartu Berikutnya"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
                  title="Acak Urutan Kartu"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Acak</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowScratchpad(true)}
                  className="px-3 py-2 rounded-xl bg-primary-fixed hover:bg-primary-fixed-dim text-primary text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
                  title="Buka Papan Corat-Coret Rumus"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Scratchpad</span>
                </button>
              </div>
            </div>
          </div>

          {/* KOLEKSI DEK FLASHCARD GRID (WITH FULL CRUD) */}
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-on-surface">
                  Koleksi Dek Flashcard Aktif
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Pilih dek untuk dipelajari, edit rincian dek, atau tambah kartu baru
                </p>
              </div>
              <span className="text-xs font-bold text-primary">
                {filteredDecks.length} Dek Tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDecks.map((deck) => {
                const isSelected = activeDeck.id === deck.id;
                const deckQuestionCount = deck.questions?.length || 0;
                return (
                  <div
                    key={deck.id}
                    className={`rounded-3xl overflow-hidden bg-surface-container-lowest border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 shadow-md'
                        : 'border-surface-container hover:border-surface-container-high'
                    }`}
                  >
                    {/* Deck Cover Image & Tags */}
                    <div className="relative h-32 w-full overflow-hidden bg-surface-container group">
                      <img
                        src={deck.image}
                        alt={deck.altText}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${deck.tagColor || 'bg-primary text-on-primary'}`}>
                          {deck.tag}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                          {deckQuestionCount} Kartu Soal
                        </span>
                      </div>
                    </div>

                    {/* Deck Body */}
                    <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                            {deck.categoryLabel}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeckToEdit(deck);
                                setShowEditDeck(true);
                              }}
                              className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                              title="Edit Rincian Dek"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteDeck(deck.id, e)}
                              className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-tertiary transition-colors"
                              title="Hapus Dek Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-display font-bold text-sm text-on-surface line-clamp-1">
                          {deck.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant line-clamp-2">
                          {deck.subtitle}
                        </p>
                      </div>

                      {/* Mastery Progress Bar */}
                      <div className="flex flex-col gap-1 pt-1">
                        <div className="flex justify-between text-[11px] text-on-surface-variant">
                          <span>Tingkat Hafal</span>
                          <span className="font-bold text-on-surface">{deck.masteryPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full transition-all duration-500"
                            style={{ width: `${deck.masteryPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDeck(deck);
                            setCardIndex(0);
                            setIsFlipped(false);
                          }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                          }`}
                        >
                          {isSelected ? 'Sedang Dipelajari' : 'Pilih Dek'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuizDeck(deck)}
                          className="px-3 py-1.5 rounded-xl bg-secondary-container text-on-secondary-container text-xs font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
                          title="Mulai Kuis Cepat"
                        >
                          Kuis Cepat
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: MASTERY TELEMETRY & SCORES (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* SPACED REPETITION STATUS BOX */}
          <div 
            id="spaced-repetition-box"
            className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-3 border border-surface-container/60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-tertiary" />
                <h3 className="font-display font-bold text-base text-on-surface">
                  Spaced Repetition
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                Hari Ini
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col gap-2">
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-3xl text-tertiary">
                  {Math.max(12, currentQuestions.length)}
                </span>
                <span className="text-xs text-on-surface-variant">Kartu Perlu Diulang</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Kartu ini berada di ambang kurva lupa (forgetting curve). Mengulangnya sekarang memperkuat memori jangka panjang hingga 80% untuk ujian SNBT.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
                className="mt-1 w-full py-2 rounded-xl bg-tertiary text-on-tertiary font-bold text-xs shadow hover:opacity-90 transition-opacity text-center"
              >
                Mulai Review Dek Sekarang
              </button>
            </div>
          </div>

          {/* MASTERY DONUT CHART */}
          <div 
            id="mastery-donut-card"
            className="rounded-3xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-4 border border-surface-container/60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-secondary" />
                <h3 className="font-display font-bold text-base text-on-surface">
                  Tingkat Penguasaan
                </h3>
              </div>
              <span className="text-xs font-bold text-secondary">{activeDeck.masteryPercent}% Akurasi</span>
            </div>

            {/* Circular Donut Diagram */}
            <div className="flex items-center justify-center my-2">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Circle 1: Gray Background */}
                  <path
                    className="text-surface-dim"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  {/* Circle 2: Paham (Secondary) */}
                  <path
                    className="text-secondary transition-all duration-1000"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${activeDeck.masteryPercent}, 100`}
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display font-extrabold text-2xl text-on-surface leading-none">
                    {Math.round((activeDeck.masteryPercent / 100) * currentQuestions.length)}
                  </span>
                  <span className="text-[10px] text-on-surface-variant mt-0.5">Soal Dikuasai</span>
                </div>
              </div>
            </div>

            {/* Breakdown Legend */}
            <div className="flex flex-col gap-2 pt-2 border-t border-surface-container text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  <span className="text-on-surface-variant">Kategori Mantap / Paham</span>
                </div>
                <span className="font-bold text-on-surface">{activeDeck.masteryPercent}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-on-surface-variant">Ragu / Review Ulang</span>
                </div>
                <span className="font-bold text-on-surface">{100 - activeDeck.masteryPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Add Deck Modal */}
      <AddDeckModal
        isOpen={showAddDeck}
        onClose={() => setShowAddDeck(false)}
        onAddDeck={handleAddDeck}
      />

      {/* 2. Edit Deck Modal */}
      <EditDeckModal
        isOpen={showEditDeck}
        onClose={() => {
          setShowEditDeck(false);
          setDeckToEdit(null);
        }}
        deck={deckToEdit}
        onUpdateDeck={handleUpdateDeck}
      />

      {/* 3. Question Form Modal (Create / Edit Question) */}
      <QuestionFormModal
        isOpen={showQuestionForm}
        onClose={() => {
          setShowQuestionForm(false);
          setQuestionToEdit(null);
        }}
        onSubmitQuestion={handleSaveQuestion}
        initialQuestion={questionToEdit}
        deckCategory={activeDeck.category}
        deckCategoryLabel={activeDeck.categoryLabel}
      />

      {/* 4. Question Bank Modal (Manage all questions in active deck) */}
      <QuestionBankModal
        isOpen={showQuestionBank}
        onClose={() => setShowQuestionBank(false)}
        deck={activeDeck}
        onSelectQuestion={(idx) => {
          setCardIndex(idx);
          setIsFlipped(false);
        }}
        onOpenAddQuestion={() => {
          setQuestionToEdit(null);
          setShowQuestionForm(true);
        }}
        onOpenEditQuestion={(q) => {
          setQuestionToEdit(q);
          setShowQuestionForm(true);
        }}
        onDeleteQuestion={handleDeleteQuestion}
        onResetQuestions={handleResetQuestions}
      />

      {/* 5. Scratchpad Modal */}
      <ScratchpadModal
        isOpen={showScratchpad}
        onClose={() => setShowScratchpad(false)}
      />

      {/* 6. Quick Quiz Modal */}
      {quizDeck && (
        <QuickQuizModal
          isOpen={Boolean(quizDeck)}
          onClose={() => setQuizDeck(null)}
          deck={quizDeck}
        />
      )}
    </div>
  );
};
