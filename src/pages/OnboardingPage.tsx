import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Target, Calendar, BookOpen } from 'lucide-react';
import { updateProfile } from '../lib/repository';

interface OnboardingPageProps {
  userId: string;
  displayName: string;
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ userId, displayName, onComplete }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    targetPTN: '',
    targetMajor: '',
    weeklyGoalMinutes: 300,
  });

  const steps = [
    {
      title: 'Selamat datang di EduLoLos!',
      subtitle: `Halo ${displayName}, mari kita atur target belajarmu untuk persiapan UTBK/TKA.`,
      icon: '📚',
    },
    {
      title: 'Sekolah Anda',
      subtitle: 'Asal sekolah Anda untuk personalisasi pengalaman belajar',
      icon: '🏫',
      field: 'school',
      type: 'text',
      placeholder: 'SMA Negeri 1 Surabaya',
    },
    {
      title: 'Target PTN / Program',
      subtitle: 'PTN dan program studi yang Anda targetkan',
      icon: '🎯',
      field: 'targetPTN',
      type: 'text',
      placeholder: 'Teknik Elektro - ITS',
    },
    {
      title: 'Target Program Studi',
      subtitle: 'Spesifik program atau jurusan yang diinginkan',
      icon: '📖',
      field: 'targetMajor',
      type: 'text',
      placeholder: 'Teknik Elektro',
    },
    {
      title: 'Target Belajar Mingguan',
      subtitle: 'Berapa menit per minggu yang ingin Anda belajar?',
      icon: '⏱️',
      field: 'weeklyGoalMinutes',
      type: 'number',
      placeholder: '300',
    },
    {
      title: 'Siap Memulai!',
      subtitle: 'Data Anda telah disimpan. Mari mulai perjalanan belajar Anda!',
      icon: '🚀',
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    if (isLastStep) {
      setLoading(true);
      try {
        await updateProfile(userId, {
          display_name: displayName,
          school: formData.school,
          targetPTN: formData.targetPTN,
          targetMajor: formData.targetMajor,
          weeklyGoalMinutes: parseInt(formData.weeklyGoalMinutes as any),
          onboarding_completed: true,
          updated_at: new Date(),
        });
        setTimeout(() => onComplete(), 1000);
      } catch (error) {
        console.error('Error completing onboarding:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            Langkah {step + 1} dari {steps.length}
          </p>
        </div>

        {/* Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-surface-container-lowest rounded-3xl shadow-2xl p-8 border border-surface-container"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{currentStep.icon}</div>
            <h2 className="text-2xl font-bold text-on-surface font-display mb-2">
              {currentStep.title}
            </h2>
            <p className="text-sm text-on-surface-variant">{currentStep.subtitle}</p>
          </div>

          {/* Form Field */}
          {currentStep.field && (
            <div className="mb-6">
              <input
                type={currentStep.type}
                name={currentStep.field}
                value={formData[currentStep.field as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={currentStep.placeholder}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-all"
              >
                Kembali
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-md hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLastStep ? 'Mulai Belajar' : 'Lanjut'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
