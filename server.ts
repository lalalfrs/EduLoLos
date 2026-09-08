import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';

const { Pool } = pg;
const app = express();
const port = Number(process.env.API_PORT || 4000);
const databaseUrl = process.env.DATABASE_URL || process.env.NEON_POSTGRES_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error('[EduLoLos API] DATABASE_URL belum tersedia. Salin NEON_POSTGRES_URL dari environment project ke file .env lokal.');
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
pool.on('error', (error) => console.error('[EduLoLos API] Database connection error:', error.message));
const cookie = 'edulolos_session';
app.use(express.json());
app.use(cookieParser());
app.use((_req, res, next) => { res.setHeader('Access-Control-Allow-Origin', process.env.APP_ORIGIN || 'http://localhost:3000'); res.setHeader('Access-Control-Allow-Credentials', 'true'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS'); if (_req.method === 'OPTIONS') return res.sendStatus(204); next(); });
const getAuth = async (req: express.Request) => { const token = req.cookies[cookie]; if (!token) return null; const result = await pool.query('SELECT user_id FROM sessions WHERE id = $1 AND expires_at > NOW()', [token]); return result.rows[0]?.user_id || null; };
const requireAuth = async (req: express.Request, res: express.Response) => { const userId = await getAuth(req); if (!userId) { res.status(401).json({ error: 'Unauthenticated' }); return null; } return userId; };
const startSession = async (res: express.Response, userId: string) => { const id = randomBytes(32).toString('hex'); await pool.query("INSERT INTO sessions (id,user_id,expires_at) VALUES ($1,$2,NOW() + INTERVAL '7 days')", [id, userId]); res.cookie(cookie, id, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 604800000 }); };
app.post('/api/auth/signup', async (req, res) => { try { const email = String(req.body.email || '').toLowerCase().trim(); const password = String(req.body.password || ''); const displayName = String(req.body.displayName || ''); if (!email || password.length < 6) return res.status(400).json({ error: 'Email dan password minimal 6 karakter wajib diisi.' }); const id = randomUUID(); await pool.query('INSERT INTO users (id,email,password_hash) VALUES ($1,$2,$3)', [id, email, await bcrypt.hash(password, 12)]); await pool.query('INSERT INTO profiles (id,display_name) VALUES ($1,$2)', [id, displayName]); await startSession(res, id); res.status(201).json({ user: { id, email } }); } catch (e: any) { res.status(e.code === '23505' ? 409 : 500).json({ error: e.code === '23505' ? 'Email sudah terdaftar.' : 'Pendaftaran gagal.' }); } });
app.post('/api/auth/signin', async (req, res) => { const email = String(req.body.email || '').toLowerCase().trim(); const result = await pool.query('SELECT id,email,password_hash FROM users WHERE email = $1', [email]); const user = result.rows[0]; if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.password_hash))) return res.status(401).json({ error: 'Email atau password tidak valid.' }); await startSession(res, user.id); res.json({ user: { id: user.id, email: user.email } }); });
app.post('/api/auth/signout', async (req, res) => { const token = req.cookies[cookie]; if (token) await pool.query('DELETE FROM sessions WHERE id = $1', [token]); res.clearCookie(cookie); res.sendStatus(204); });
app.get('/api/auth/session', async (req, res) => { const userId = await getAuth(req); if (!userId) return res.json({ user: null }); const result = await pool.query('SELECT id,email FROM users WHERE id = $1', [userId]); res.json({ user: result.rows[0] || null }); });
app.get('/api/profiles/:id', async (req, res) => { const userId = await requireAuth(req, res); if (!userId || userId !== req.params.id) return; const result = await pool.query('SELECT * FROM profiles WHERE id = $1', [userId]); res.json(result.rows[0] || null); });
app.patch('/api/profiles/:id', async (req, res) => { const userId = await requireAuth(req, res); if (!userId || userId !== req.params.id) return; const allowed = ['display_name','school','target_ptn','target_major','target_campus','onboarding_completed']; const fields = Object.keys(req.body).filter((key) => allowed.includes(key)); if (fields.length) await pool.query(`UPDATE profiles SET ${fields.map((f, i) => `${f} = $${i + 1}`).join(', ')}, updated_at = NOW() WHERE id = $${fields.length + 1}`, [...fields.map((f) => req.body[f]), userId]); const result = await pool.query('SELECT * FROM profiles WHERE id = $1', [userId]); res.json(result.rows[0]); });
const tables: Record<string, string> = { tasks: 'study_tasks', sessions: 'study_sessions', reminders: 'reminders', decks: 'flashcard_decks', cards: 'flashcards' };
app.get('/api/:resource', async (req, res) => { const userId = await requireAuth(req, res); const table = tables[req.params.resource]; if (!userId || !table) return res.status(404).json({ error: 'Not found' }); const result = await pool.query(`SELECT * FROM ${table} WHERE user_id = $1 ORDER BY created_at DESC`, [userId]); res.json(result.rows); });
app.post('/api/:resource', async (req, res) => { const userId = await requireAuth(req, res); const table = tables[req.params.resource]; if (!userId || !table) return res.status(404).json({ error: 'Not found' }); const allowed = Object.keys(req.body).filter((key) => !['id','user_id','created_at','updated_at'].includes(key)); const keys = ['id','user_id',...allowed]; const values = [randomUUID(), userId,...allowed.map((key) => req.body[key])]; const placeholders = values.map((_, i) => `$${i + 1}`).join(','); const result = await pool.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders}) RETURNING *`, values); res.status(201).json(result.rows[0]); });
app.patch('/api/:resource/:id', async (req, res) => { const userId = await requireAuth(req, res); const table = tables[req.params.resource]; if (!userId || !table) return res.status(404).json({ error: 'Not found' }); const keys = Object.keys(req.body).filter((key) => !['id','user_id','created_at','updated_at'].includes(key)); if (!keys.length) return res.status(400).json({ error: 'Tidak ada perubahan.' }); const values = keys.map((key) => req.body[key]); const result = await pool.query(`UPDATE ${table} SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(', ')} WHERE id = $${keys.length + 1} AND user_id = $${keys.length + 2} RETURNING *`, [...values, req.params.id, userId]); res.json(result.rows[0]); });
app.delete('/api/:resource/:id', async (req, res) => { const userId = await requireAuth(req, res); const table = tables[req.params.resource]; if (!userId || !table) return res.status(404).json({ error: 'Not found' }); await pool.query(`DELETE FROM ${table} WHERE id = $1 AND user_id = $2`, [req.params.id, userId]); res.sendStatus(204); });
app.listen(port, () => console.log(`EduLoLos Neon API listening on http://localhost:${port}`));
