import React, { useState } from 'react';
import { X, Send, Video, MessageSquare, CheckCircle2, User, Sparkles } from 'lucide-react';
import { ASSET_IMAGES } from '../../data/mockData';

interface LiveTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveTutorModal: React.FC<LiveTutorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'Kak Dimas (Tutor ITB)',
      text: 'Halo Rania! Selamat datang di sesi Live Tanya Tutor. Ada soal Fisika atau Matematika Saintek yang bikin mentok hari ini?',
      time: '19:02',
      isTutor: true
    },
    {
      id: 'm-2',
      sender: 'Rania (Anda)',
      text: 'Halo Kak! Saya masih sering bingung bedain rumus simpul ujung terikat dan ujung bebas pada gelombang stasioner.',
      time: '19:04',
      isTutor: false
    },
    {
      id: 'm-3',
      sender: 'Kak Dimas (Tutor ITB)',
      text: 'Kuncinya gampang: Ujung terikat selalu mulai dari SIMPUL di x=0. Sedangkan ujung bebas selalu mulai dari PERUT di x=0! Jadi letak simpul ujung terikat: x = (n - 1) × (λ/2).',
      time: '19:05',
      isTutor: true
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: `m-${Date.now()}`,
      sender: 'Rania (Anda)',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTutor: false
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulated quick answer from Kak Dimas
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-resp-${Date.now()}`,
          sender: 'Kak Dimas (Tutor ITB)',
          text: 'Catatan bagus! Ingat juga untuk selalu cek apakah di soal dimintanya jarak dari ujung pantul atau jarak antar simpul yang berdekatan (selalu λ/2). Semangat terus ya!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isTutor: true
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-xl w-full p-5 border border-surface-container flex flex-col h-[520px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={ASSET_IMAGES.mentor}
                alt="Kak Dimas Tutor ITB"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary-fixed"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-secondary ring-2 ring-surface-container-lowest animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-base text-on-surface">
                  Live Tanya Tutor ITB
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Kak Dimas • Mahasiswa STEI ITB 2022
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

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 px-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.isTutor ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant mb-1 px-1">
                <span className="font-semibold">{m.sender}</span>
                <span>• {m.time}</span>
              </div>
              <div
                className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  m.isTutor
                    ? 'bg-surface-container text-on-surface rounded-tl-sm border border-surface-container-high/60'
                    : 'bg-primary text-on-primary rounded-tr-sm shadow-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSendMessage} className="pt-3 border-t border-surface-container flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanyakan rumus, cara cepat, atau soal HOTS..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all active:scale-95 shadow-sm"
            title="Kirim Pesan"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
