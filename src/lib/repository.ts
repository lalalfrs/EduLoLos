import { TaskItem, FlashcardDeck, FlashcardQuestion } from '../types';
import { request } from './supabase';

const resource = <T>(name: string) => ({
  list: (userId: string) => request<T[]>(`/api/${name}`),
  create: (body: any) => request<T>(`/api/${name}`, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => request<T>(`/api/${name}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => request<void>(`/api/${name}/${id}`, { method: 'DELETE' }),
});
const tasks = resource<any>('tasks');
const decks = resource<any>('decks');
const cards = resource<any>('cards');
const sessions = resource<any>('sessions');
const reminders = resource<any>('reminders');

export const getProfile = (userId: string) => request<any>(`/api/profiles/${userId}`);
export const updateProfile = (userId: string, updates: any) => request<any>(`/api/profiles/${userId}`, { method: 'PATCH', body: JSON.stringify(updates) });
export const completeOnboarding = (userId: string) => updateProfile(userId, { onboarding_completed: true });
export const getUserTasks = async (userId: string): Promise<TaskItem[]> => tasks.list(userId);
export const createTask = (userId: string, task: any) => tasks.create({ title: task.title, subject: task.subject || task.subtitle || '', scheduled_for: task.scheduled_for || null, duration_minutes: task.duration_minutes || 30, completed: task.completed || false });
export const updateTask = (id: string, updates: any) => tasks.update(id, { ...updates, updated_at: new Date().toISOString() });
export const deleteTask = (id: string) => tasks.remove(id);
export const getUserDecks = (userId: string): Promise<FlashcardDeck[]> => decks.list(userId);
export const createDeck = (userId: string, name: string, description = '') => decks.create({ name, description });
export const updateDeck = (id: string, updates: any) => decks.update(id, updates);
export const deleteDeck = (id: string) => decks.remove(id);
export const getDeckCards = (deckId: string): Promise<FlashcardQuestion[]> => request<any[]>(`/api/cards`).then((items) => items.filter((item) => item.deck_id === deckId));
export const createCard = (userId: string, deckId: string, front: string, back: string) => cards.create({ deck_id: deckId, front, back, mastered: false });
export const updateCard = (id: string, updates: any) => cards.update(id, updates);
export const deleteCard = (id: string) => cards.remove(id);
export const recordStudySession = (userId: string, data: any) => sessions.create({ ...data, ended_at: new Date().toISOString() });
export const getUserStudySessions = (userId: string, limit = 100) => sessions.list(userId).then((items) => items.slice(0, limit));
export const getWeeklyStats = (userId: string) => sessions.list(userId).then((items) => items.filter((item) => new Date(item.created_at).getTime() >= Date.now() - 7 * 86400000));
export const getUserReminders = (userId: string) => reminders.list(userId);
export const createReminder = (userId: string, title: string, reminder_time: string, days_of_week = [1,2,3,4,5]) => reminders.create({ title, reminder_time, days_of_week, enabled: true });
export const updateReminder = (id: string, updates: any) => reminders.update(id, updates);
export const deleteReminder = (id: string) => reminders.remove(id);
