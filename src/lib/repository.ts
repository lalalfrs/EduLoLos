import { supabase } from './supabase';
import { UserProfile, TaskItem, FlashcardDeck, FlashcardQuestion } from '../types';

// ============ PROFILES ============
export async function getProfile(userId: string): Promise<any> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) console.error('Error fetching profile:', error);
  return data;
}

export async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) console.error('Error updating profile:', error);
  return data;
}

export async function completeOnboarding(userId: string) {
  return updateProfile(userId, { onboarding_completed: true, updated_at: new Date() });
}

// ============ STUDY TASKS ============
export async function getUserTasks(userId: string): Promise<TaskItem[]> {
  const { data, error } = await supabase
    .from('study_tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) console.error('Error fetching tasks:', error);
  return data || [];
}

export async function createTask(userId: string, task: Omit<TaskItem, 'id'> & { subject?: string; scheduled_for?: string; duration_minutes?: number }): Promise<any> {
  const { data, error } = await supabase
    .from('study_tasks')
    .insert({
      user_id: userId,
      title: task.title,
      subject: task.subject || '',
      scheduled_for: task.scheduled_for || null,
      duration_minutes: task.duration_minutes || 30,
      completed: task.completed || false,
    })
    .select()
    .single();
  
  if (error) console.error('Error creating task:', error);
  return data;
}

export async function updateTask(taskId: string, updates: any): Promise<any> {
  const { data, error } = await supabase
    .from('study_tasks')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) console.error('Error updating task:', error);
  return data;
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('study_tasks')
    .delete()
    .eq('id', taskId);
  
  if (error) console.error('Error deleting task:', error);
}

// ============ FLASHCARD DECKS ============
export async function getUserDecks(userId: string): Promise<FlashcardDeck[]> {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) console.error('Error fetching decks:', error);
  return data || [];
}

export async function createDeck(userId: string, name: string, description: string = ''): Promise<any> {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .insert({
      user_id: userId,
      name,
      description,
    })
    .select()
    .single();
  
  if (error) console.error('Error creating deck:', error);
  return data;
}

export async function updateDeck(deckId: string, updates: any): Promise<any> {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .update(updates)
    .eq('id', deckId)
    .select()
    .single();
  
  if (error) console.error('Error updating deck:', error);
  return data;
}

export async function deleteDeck(deckId: string) {
  const { error } = await supabase
    .from('flashcard_decks')
    .delete()
    .eq('id', deckId);
  
  if (error) console.error('Error deleting deck:', error);
}

// ============ FLASHCARDS ============
export async function getDeckCards(deckId: string): Promise<FlashcardQuestion[]> {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at', { ascending: true });
  
  if (error) console.error('Error fetching flashcards:', error);
  return data || [];
}

export async function createCard(userId: string, deckId: string, front: string, back: string): Promise<any> {
  const { data, error } = await supabase
    .from('flashcards')
    .insert({
      user_id: userId,
      deck_id: deckId,
      front,
      back,
      mastered: false,
    })
    .select()
    .single();
  
  if (error) console.error('Error creating flashcard:', error);
  return data;
}

export async function updateCard(cardId: string, updates: any): Promise<any> {
  const { data, error } = await supabase
    .from('flashcards')
    .update(updates)
    .eq('id', cardId)
    .select()
    .single();
  
  if (error) console.error('Error updating flashcard:', error);
  return data;
}

export async function deleteCard(cardId: string) {
  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', cardId);
  
  if (error) console.error('Error deleting flashcard:', error);
}

// ============ STUDY SESSIONS (Progress Tracking) ============
export async function recordStudySession(userId: string, sessionData: {
  duration_minutes: number;
  questions_answered: number;
  questions_correct: number;
  source: string;
}): Promise<any> {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: userId,
      duration_minutes: sessionData.duration_minutes,
      questions_answered: sessionData.questions_answered,
      questions_correct: sessionData.questions_correct,
      source: sessionData.source,
      ended_at: new Date(),
    })
    .select()
    .single();
  
  if (error) console.error('Error recording study session:', error);
  return data;
}

export async function getUserStudySessions(userId: string, limit: number = 100): Promise<any[]> {
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) console.error('Error fetching study sessions:', error);
  return data || [];
}

export async function getWeeklyStats(userId: string): Promise<any> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('study_sessions')
    .select('created_at, duration_minutes')
    .eq('user_id', userId)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  if (error) console.error('Error fetching weekly stats:', error);
  return data || [];
}

// ============ REMINDERS ============
export async function getUserReminders(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('reminder_time', { ascending: true });
  
  if (error) console.error('Error fetching reminders:', error);
  return data || [];
}

export async function createReminder(userId: string, title: string, reminderTime: string, daysOfWeek: number[] = [1, 2, 3, 4, 5]): Promise<any> {
  const { data, error } = await supabase
    .from('reminders')
    .insert({
      user_id: userId,
      title,
      reminder_time: reminderTime,
      days_of_week: daysOfWeek,
      enabled: true,
    })
    .select()
    .single();
  
  if (error) console.error('Error creating reminder:', error);
  return data;
}

export async function updateReminder(reminderId: string, updates: any): Promise<any> {
  const { data, error } = await supabase
    .from('reminders')
    .update(updates)
    .eq('id', reminderId)
    .select()
    .single();
  
  if (error) console.error('Error updating reminder:', error);
  return data;
}

export async function deleteReminder(reminderId: string) {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', reminderId);
  
  if (error) console.error('Error deleting reminder:', error);
}
