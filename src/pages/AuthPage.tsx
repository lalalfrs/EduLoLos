import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserRound } from 'lucide-react';
import { signUp, signIn } from '../lib/supabase';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onGuestAccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onGuestAccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password || (isSignUp && !displayName)) {
      setError('Semua field harus diisi');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await signUp(email, password, displayName);
      if (authError) {
        const message = authError.message.toLowerCase();
        if (message.includes('rate limit') || message.includes('over_email_send_rate_limit')) {
          setError('Batas pengiriman email Supabase sedang tercapai. Tunggu beberapa menit sebelum mencoba lagi, dan jangan tekan Daftar berulang kali.');
        } else if (message.includes('email_address_invalid')) {
          setError('Alamat email ditolak oleh Supabase. Gunakan email pribadi yang aktif, bukan alamat contoh atau email sementara.');
        } else if (message.includes('password')) {
          setError('Password harus memenuhi aturan keamanan Supabase. Gunakan minimal 6 karakter dengan kombinasi yang kuat.');
        } else if (message.includes('api lokal') || message.includes('database') || message.includes('server api') || message.includes('tidak terhubung')) {
          setError(authError.message);
        } else if (message.includes('email sudah terdaftar')) {
          setError('Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.');
        } else {
          setError(authError.message || 'Pendaftaran gagal. Periksa email dan koneksi Anda, lalu coba lagi.');
        }
      } else {
        setSuccess('Akun berhasil dibuat. Cek inbox dan folder spam untuk verifikasi email.');
        setTimeout(() => {
          setIsSignUp(false);
          setEmail('');
          setPassword('');
          setDisplayName('');
        }, 2000);
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        const message = authError.message.toLowerCase();
        if (message.includes('email not confirmed')) {
          setError('Email belum diverifikasi. Cek inbox atau folder spam untuk tautan verifikasi.');
        } else {
          setError('Email atau password tidak valid.');
        }
      } else {
        setSuccess('Login berhasil!');
        setTimeout(() => onAuthSuccess(), 250);
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-3xl shadow-2xl p-8 border border-surface-container">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center">
              <img src="/its-logo.svg" alt="EduLoLos" className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-on-surface font-display">EduLoLos</h1>
            <p className="text-sm text-on-surface-variant mt-2">Study Planner & Progress Tracker</p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="flex flex-col gap-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary text-xs">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : isSignUp ? 'Daftar' : 'Masuk'}
            </button>
          </form>

          <div className="mt-5">
            <div className="flex items-center gap-3" aria-hidden="true"><div className="h-px flex-1 bg-surface-container" /><span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">atau</span><div className="h-px flex-1 bg-surface-container" /></div>
            <button type="button" onClick={onGuestAccess} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-surface-container px-4 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-low"><UserRound className="h-4 w-4" />Lanjut sebagai Guest</button>
            <p className="mt-2 text-center text-[11px] text-on-surface-variant">Data guest hanya tersedia di perangkat ini dan tidak disinkronkan.</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                }}
                className="ml-1 font-bold text-primary hover:text-primary-container"
              >
                {isSignUp ? 'Masuk' : 'Daftar'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-on-surface-variant mt-6">
          EduLoLos • Persiapan UTBK/TKA yang Terstruktur
        </p>
      </div>
    </div>
  );
};
