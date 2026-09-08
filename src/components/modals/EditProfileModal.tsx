import React, { useState, useEffect } from 'react';
import { X, User, Target, Award, Sparkles, School, Upload, RotateCcw, Check, Image as ImageIcon } from 'lucide-react';
import { UserProfile } from '../../types';
import { ASSET_IMAGES, INITIAL_USER } from '../../data/mockData';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

const PRESET_AVATARS = [
  {
    id: 'its-logo',
    label: 'Logo ITS (Resmi)',
    url: '/its-logo.svg',
    description: 'Institut Teknologi Sepuluh Nopember'
  },
  {
    id: 'anonymous',
    label: 'Foto Anonym',
    url: '/anonymous-avatar.svg',
    description: 'Profil Siluet Anonim'
  },
  {
    id: 'student-avatar',
    label: 'Avatar Siswa',
    url: ASSET_IMAGES.profile,
    description: 'Foto Pejuang UTBK'
  }
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile
}) => {
  const [name, setName] = useState(user.name);
  const [targetCampus, setTargetCampus] = useState(user.targetCampus || 'ITS');
  const [targetMajor, setTargetMajor] = useState(user.targetMajor || 'Teknik Elektro');
  const [targetPTN, setTargetPTN] = useState(user.targetPTN);
  const [school, setSchool] = useState(user.school);
  const [avatar, setAvatar] = useState(user.avatar || '/its-logo.svg');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  
  // Numerical target fields
  const [daysUntilUTBK, setDaysUntilUTBK] = useState(user.daysUntilUTBK || 78);
  const [dailyTargetSessions, setDailyTargetSessions] = useState(user.dailyTargetSessions || 5);
  const [passingGrade, setPassingGrade] = useState(user.passingGrade || 680);
  const [targetScore, setTargetScore] = useState(user.targetScore || 730);
  const [lastTOScore, setLastTOScore] = useState(user.lastTOScore || user.currentScore || 692);

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name);
      setTargetCampus(user.targetCampus || 'ITS');
      setTargetMajor(user.targetMajor || 'Teknik Elektro');
      setTargetPTN(user.targetPTN || `${user.targetMajor || 'Teknik Elektro'} - ${user.targetCampus || 'ITS'}`);
      setSchool(user.school || 'SMA Negeri 1 Surabaya');
      setAvatar(user.avatar || '/its-logo.svg');
      setDaysUntilUTBK(user.daysUntilUTBK || 78);
      setDailyTargetSessions(user.dailyTargetSessions || 5);
      setPassingGrade(user.passingGrade || 680);
      setTargetScore(user.targetScore || 730);
      setLastTOScore(user.lastTOScore || user.currentScore || 692);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file foto maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customAvatarUrl.trim()) return;
    setAvatar(customAvatarUrl.trim());
    setCustomAvatarUrl('');
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan semua profil & target ke data default awal?')) {
      onSaveProfile(INITIAL_USER);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama pejuang UTBK wajib diisi.');
      return;
    }

    const compiledTargetPTN = targetPTN.trim() || `${targetMajor.trim()} - ${targetCampus.trim()}`;

    const updated: UserProfile = {
      ...user,
      name: name.trim(),
      school: school.trim() || 'SMA Negeri 1 Surabaya',
      targetPTN: compiledTargetPTN,
      targetMajor: targetMajor.trim() || 'Teknik Elektro',
      targetCampus: targetCampus.trim() || 'ITS',
      avatar: avatar,
      daysUntilUTBK: Number(daysUntilUTBK) || 78,
      dailyTargetSessions: Number(dailyTargetSessions) || 5,
      passingGrade: Number(passingGrade) || 680,
      targetScore: Number(targetScore) || 730,
      lastTOScore: Number(lastTOScore) || 692,
      currentScore: Number(lastTOScore) || 692
    };

    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-7 border border-surface-container max-h-[90vh] flex flex-col justify-between overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-on-surface">
                Personalisasi Akun & Target PTN
              </h3>
              <p className="text-xs text-on-surface-variant">
                Atur foto profil, target jurusan, dan komitmen skor UTBK
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

        {/* Scrollable Form Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 pr-1 flex flex-col gap-5">
          {/* SECTION 1: FOTO PROFIL / AVATAR SELECTOR */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-low border border-surface-container/60">
            <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>Foto Profil & Avatar</span>
            </label>

            <div className="flex items-center gap-4">
              {/* Active Avatar Preview */}
              <div className="relative shrink-0">
                <img
                  src={avatar}
                  alt="Profile Avatar Preview"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-fixed shadow-md bg-surface-container-lowest"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary ring-2 ring-white" />
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs font-bold text-on-surface">
                  Pilih Preset Foto atau Unggah Foto Sendiri
                </span>
                <span className="text-[11px] text-on-surface-variant leading-relaxed">
                  Bisa gunakan Logo ITS resmi, avatar anonim, atau link foto sendiri.
                </span>
              </div>
            </div>

            {/* Avatar Preset Options Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = avatar === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAvatar(preset.url)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      isSelected
                        ? 'border-primary bg-primary-fixed/30 ring-2 ring-primary/20 shadow-sm'
                        : 'border-surface-container bg-surface-container-lowest hover:bg-surface-container'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-10 h-10 rounded-full object-cover border border-surface-container"
                      />
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-on-surface line-clamp-1">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Upload File / Custom URL Input */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-surface-container/60">
              <label className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0">
                <Upload className="w-3.5 h-3.5 text-primary" />
                <span>Upload Foto HP/Laptop</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-1.5 w-full">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="Atau tempel URL gambar..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors shrink-0"
                >
                  Pakai
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: IDENTITAS SISWA & KAMPUS IMPIAN */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Identitas & Target Masuk PTN
            </label>

            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Nama Lengkap Siswa <span className="text-tertiary">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Muhammad Hilal Alfaris"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
                required
              />
            </div>

            {/* Kampus & Jurusan Impian */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">
                  Kampus Impian (Singkatan)
                </label>
                <input
                  type="text"
                  value={targetCampus}
                  onChange={(e) => {
                    const newCampus = e.target.value;
                    setTargetCampus(newCampus);
                    setTargetPTN(`${targetMajor} - ${newCampus}`);
                  }}
                  placeholder="ITS (Institut Teknologi Sepuluh Nopember)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">
                  Jurusan Impian
                </label>
                <input
                  type="text"
                  value={targetMajor}
                  onChange={(e) => {
                    const newMajor = e.target.value;
                    setTargetMajor(newMajor);
                    setTargetPTN(`${newMajor} - ${targetCampus}`);
                  }}
                  placeholder="Teknik Elektro"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
                  required
                />
              </div>
            </div>

            {/* Combined Target PTN String */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Label Rincian Target PTN Lengkap
              </label>
              <input
                type="text"
                value={targetPTN}
                onChange={(e) => setTargetPTN(e.target.value)}
                placeholder="Teknik Elektro - ITS (Institut Teknologi Sepuluh Nopember)"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* School / Status */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Asal Sekolah / Status Pejuang
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="SMA Negeri 1 Surabaya"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* SECTION 3: TARGET ANGKA & SKOR UTBK */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Komitmen Sesi & Target Skor SNBT
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-on-surface-variant">
                  Countdown UTBK (Hari)
                </label>
                <input
                  type="number"
                  value={daysUntilUTBK}
                  onChange={(e) => setDaysUntilUTBK(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-surface-container text-center"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-on-surface-variant">
                  Target Sesi Belajar/Hari
                </label>
                <input
                  type="number"
                  value={dailyTargetSessions}
                  onChange={(e) => setDailyTargetSessions(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-surface-container text-center text-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-on-surface-variant truncate">
                  Passing Grade
                </label>
                <input
                  type="number"
                  value={passingGrade}
                  onChange={(e) => setPassingGrade(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-surface-container text-center"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-on-surface-variant truncate">
                  Target Skor
                </label>
                <input
                  type="number"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-surface-container text-center text-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-on-surface-variant truncate">
                  Skor TO Terakhir
                </label>
                <input
                  type="number"
                  value={lastTOScore}
                  onChange={(e) => setLastTOScore(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-surface-container text-center text-secondary"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-container shrink-0 mt-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1 text-xs font-semibold text-tertiary hover:underline"
            title="Reset profil kembali ke awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Profil</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-all active:scale-95"
            >
              Simpan Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
