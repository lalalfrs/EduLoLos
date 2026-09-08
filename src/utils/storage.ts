import { FlashcardDeck, ScheduleSession, TaskItem, UserProfile } from '../types';
import { 
  INITIAL_USER, 
  FLASHCARD_DECKS, 
  INITIAL_SCHEDULE_SESSIONS, 
  INITIAL_DAILY_TASKS, 
  INITIAL_HABITS, 
  INITIAL_FOCUS_CHECKLIST 
} from '../data/mockData';

const KEYS = {
  USER: 'edulolos_user_profile_v2',
  DECKS: 'edulolos_flashcard_decks_v2',
  SCHEDULE: 'edulolos_schedule_sessions_v2',
  DAILY_TASKS: 'edulolos_daily_tasks_v2',
  HABITS: 'edulolos_habits_v2',
  CHECKLIST: 'edulolos_focus_checklist_v2'
};

export const storage = {
  // USER PROFILE
  getUser: (): UserProfile => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...INITIAL_USER,
          ...parsed
        };
      }
    } catch (e) {
      console.error('Failed to parse user profile', e);
    }
    return INITIAL_USER;
  },
  saveUser: (user: UserProfile) => {
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user profile', e);
    }
  },

  // FLASHCARD DECKS (including their customized questions)
  getDecks: (): FlashcardDeck[] => {
    try {
      const data = localStorage.getItem(KEYS.DECKS);
      if (data) {
        const parsed: FlashcardDeck[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure deck-eyd-v is present even for existing browser caches
          const hasEydDeck = parsed.some(d => d.id === 'deck-eyd-v');
          if (!hasEydDeck) {
            const eydDeck = FLASHCARD_DECKS.find(d => d.id === 'deck-eyd-v');
            if (eydDeck) {
              const updated = [eydDeck, ...parsed];
              storage.saveDecks(updated);
              return updated;
            }
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse flashcard decks', e);
    }
    return FLASHCARD_DECKS;
  },
  saveDecks: (decks: FlashcardDeck[]) => {
    try {
      localStorage.setItem(KEYS.DECKS, JSON.stringify(decks));
    } catch (e) {
      console.error('Failed to save flashcard decks', e);
    }
  },
  resetDecks: () => {
    try {
      localStorage.removeItem(KEYS.DECKS);
    } catch (e) {
      console.error('Failed to reset flashcard decks', e);
    }
    return FLASHCARD_DECKS;
  },

  // SCHEDULE SESSIONS
  getSchedule: (): ScheduleSession[] => {
    try {
      const data = localStorage.getItem(KEYS.SCHEDULE);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse schedule', e);
    }
    return INITIAL_SCHEDULE_SESSIONS;
  },
  saveSchedule: (sessions: ScheduleSession[]) => {
    try {
      localStorage.setItem(KEYS.SCHEDULE, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save schedule', e);
    }
  },
  getSessions: (): ScheduleSession[] => {
    return storage.getSchedule();
  },
  saveSessions: (sessions: ScheduleSession[]) => {
    storage.saveSchedule(sessions);
  },

  // DAILY TASKS
  getDailyTasks: (): TaskItem[] => {
    try {
      const data = localStorage.getItem(KEYS.DAILY_TASKS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse daily tasks', e);
    }
    return INITIAL_DAILY_TASKS;
  },
  saveDailyTasks: (tasks: TaskItem[]) => {
    try {
      localStorage.setItem(KEYS.DAILY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save daily tasks', e);
    }
  },
  getTasks: (): TaskItem[] => {
    return storage.getDailyTasks();
  },
  saveTasks: (tasks: TaskItem[]) => {
    storage.saveDailyTasks(tasks);
  },

  // HABITS
  getHabits: (): TaskItem[] => {
    try {
      const data = localStorage.getItem(KEYS.HABITS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse habits', e);
    }
    return INITIAL_HABITS;
  },
  saveHabits: (habits: TaskItem[]) => {
    try {
      localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits', e);
    }
  },

  // POMODORO FOCUS CHECKLIST
  getChecklist: (): TaskItem[] => {
    try {
      const data = localStorage.getItem(KEYS.CHECKLIST);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse focus checklist', e);
    }
    return INITIAL_FOCUS_CHECKLIST;
  },
  saveChecklist: (items: TaskItem[]) => {
    try {
      localStorage.setItem(KEYS.CHECKLIST, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save focus checklist', e);
    }
  },
  getFocusChecklist: (): TaskItem[] => {
    return storage.getChecklist();
  },
  saveFocusChecklist: (items: TaskItem[]) => {
    storage.saveChecklist(items);
  }
};
