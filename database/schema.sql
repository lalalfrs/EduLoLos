CREATE DATABASE IF NOT EXISTS edulolos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edulolos;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) PRIMARY KEY,
  display_name VARCHAR(120) NOT NULL DEFAULT '',
  school VARCHAR(160) NOT NULL DEFAULT '',
  target_ptn VARCHAR(160) NOT NULL DEFAULT '',
  target_major VARCHAR(160) NOT NULL DEFAULT '',
  target_campus VARCHAR(160) NOT NULL DEFAULT '',
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_profiles_user FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  id CHAR(64) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sessions_user (user_id),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS study_tasks (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(160) NOT NULL DEFAULT '',
  scheduled_for DATETIME NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tasks_user (user_id),
  CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS study_sessions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  duration_minutes INT NOT NULL,
  questions_answered INT NOT NULL DEFAULT 0,
  questions_correct INT NOT NULL DEFAULT 0,
  source VARCHAR(100) NOT NULL DEFAULT 'manual',
  ended_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_study_sessions_user (user_id),
  CONSTRAINT fk_study_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reminders (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  reminder_time TIME NOT NULL,
  days_of_week JSON NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reminders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flashcard_decks (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_decks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flashcards (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  deck_id CHAR(36) NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  mastered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cards_deck FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE
);

CREATE INDEX idx_cards_deck ON flashcards(deck_id);

-- Import this file with: mysql -u root -p < database/schema.sql
-- Edit this file as the local database source of truth, then re-import in development.
