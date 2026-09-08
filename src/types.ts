export type NavPage = 'dashboard' | 'pomodoro-focus' | 'flashcard-dan-kuis' | 'jadwal-dan-target';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

export type AmbienceType = 'rain' | 'cafe' | 'alpha' | 'mute';

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  xp?: number;
  subtitle?: string;
  badge?: string;
  tag?: string;
}

export interface FlashcardQuestion {
  id: string;
  subtest: string;
  topic: string;
  level: string;
  question: string;
  hint: string;
  answer: string;
  steps: {
    title: string;
    description: string;
  }[];
  category: string;
  targetSeconds: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryLabel: string;
  totalCards: number;
  masteryPercent: number;
  tag: string;
  tagColor?: string;
  image: string;
  altText: string;
  questions: FlashcardQuestion[];
}

export interface ScheduleSession {
  id: string;
  day: string;
  dateStr?: string;
  timeRange?: string;
  time?: string;
  title?: string;
  subject?: string;
  description?: string;
  topic?: string;
  target?: string;
  subtest?: string;
  duration?: number;
  durationMinutes?: number;
  status: 'completed' | 'active' | 'upcoming' | 'ongoing';
  badge?: string;
  resultBadge?: string;
  scoreText?: string;
  weight?: string;
  isToday?: boolean;
}

export interface WeeklyStudyStat {
  day: string;
  shortDay: string;
  hours: number;
  heightPx: number;
  isToday?: boolean;
}

export interface UserProfile {
  name: string;
  school: string;
  targetPTN: string;
  targetMajor?: string;
  targetCampus?: string;
  avatar?: string;
  streakDays: number;
  daysUntilUTBK: number;
  readinessPercent: number;
  lastTOScore: number;
  currentScore?: number;
  passingGrade: number;
  targetScore: number;
  dailyCompletedSessions: number;
  dailyTargetSessions: number;
  totalQuestionsSolved: number;
  solvedYesterday: number;
  focusHours: number;
}
