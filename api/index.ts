import type { VercelRequest, VercelResponse } from '@vercel/node';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.NEON_POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL, ssl: { rejectUnauthorized: false } });
const cookieName = 'edulolos_session';

function send(res: VercelResponse, status: number, body?: unknown) {
  if (status === 204) return res.status(status).end();
  return res.status(status).json(body);
}
function token(req: VercelRequest) { return req.headers.cookie?.match(new RegExp(`${cookieName}=([^;]+)`))?.[1]; }
async function userId(req: VercelRequest) {
  const session = token(req);
  if (!session) return null;
  const result = await pool.query('SELECT user_id FROM sessions WHERE id = $1 AND expires_at > NOW()', [session]);
  return result.rows[0]?.user_id || null;
}
async function adminId(req: VercelRequest) {
  const id = await userId(req);
  if (!id) return null;
  const result = await pool.query('SELECT id FROM users WHERE id = $1 AND is_admin = TRUE', [id]);
  return result.rows[0]?.id || null;
}
const adminTables: Record<string, string> = { users: 'users', profiles: 'profiles', study_tasks: 'study_tasks', study_sessions: 'study_sessions', reminders: 'reminders', flashcard_decks: 'flashcard_decks', flashcards: 'flashcards' };
function setSession(res: VercelResponse, id: string) {
  res.setHeader('Set-Cookie', `${cookieName}=${id}; HttpOnly; Path=/; SameSite=Lax; Max-Age=2592000${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}
async function createSession(res: VercelResponse, id: string) {
  const session = randomUUID();
  await pool.query('INSERT INTO sessions (id,user_id,expires_at) VALUES ($1,$2,NOW() + INTERVAL \'30 days\')', [session, id]);
  setSession(res, session);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const queryPath = req.query.path;
  const queryValue = Array.isArray(queryPath) ? queryPath.join('/') : String(queryPath || '');
  const urlPath = String(req.url || '').split('?')[0].replace(/^\/+/, '');
  const rawPath = (queryValue || urlPath).replace(/^\/+/, '');
  const path = rawPath.replace(/^api\//, '');
  try {
    if (path === 'health' && req.method === 'GET') { await pool.query('SELECT 1'); return send(res, 200, { ok: true, database: 'connected' }); }
    if (path === 'auth/signup' && req.method === 'POST') {
      const email = String(req.body?.email || '').toLowerCase().trim();
      const password = String(req.body?.password || '');
      const displayName = String(req.body?.displayName || '').trim();
      if (!email || !displayName || password.length < 6) return send(res, 400, { error: 'Nama, email, dan password minimal 6 karakter wajib diisi.' });
      const id = randomUUID();
      const client = await pool.connect();
      try { await client.query('BEGIN'); await client.query('INSERT INTO users (id,email,password_hash) VALUES ($1,$2,$3)', [id, email, await bcrypt.hash(password, 12)]); await client.query('INSERT INTO profiles (id,display_name) VALUES ($1,$2)', [id, displayName]); await client.query('COMMIT'); } catch (error: any) { await client.query('ROLLBACK'); return send(res, error.code === '23505' ? 409 : 500, { error: error.code === '23505' ? 'Email sudah terdaftar.' : 'Database tidak dapat menyelesaikan pendaftaran.' }); } finally { client.release(); }
      await createSession(res, id); return send(res, 201, { user: { id, email } });
    }
    if (path === 'auth/signin' && req.method === 'POST') {
      const email = String(req.body?.email || '').toLowerCase().trim(); const password = String(req.body?.password || '');
      const result = await pool.query('SELECT id,email,password_hash FROM users WHERE email=$1', [email]); const user = result.rows[0];
      if (!user || !(await bcrypt.compare(password, user.password_hash))) return send(res, 401, { error: 'Email atau password salah.' });
      await createSession(res, user.id); return send(res, 200, { user: { id: user.id, email: user.email } });
    }
    if (path === 'auth/signout' && req.method === 'POST') { const session = token(req); if (session) await pool.query('DELETE FROM sessions WHERE id=$1', [session]); res.setHeader('Set-Cookie', `${cookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`); return send(res, 204); }
    if (path === 'auth/session' && req.method === 'GET') { const id = await userId(req); if (!id) return send(res, 200, { user: null }); const result = await pool.query('SELECT id,email,is_admin FROM users WHERE id=$1', [id]); return send(res, 200, { user: result.rows[0] || null }); }
    const adminMatch = path.match(/^admin\/([^/]+)(?:\/([^/]+))?$/);
    if (adminMatch) {
      const admin = await adminId(req); if (!admin) return send(res, 403, { error: 'Akses admin diperlukan.' });
      const table = adminTables[adminMatch[1]]; const rowId = adminMatch[2]; if (!table) return send(res, 404, { error: 'Tabel tidak diizinkan.' });
      if (req.method === 'GET' && !rowId) { const columns = table === 'users' ? 'id,email,is_admin,created_at' : '*'; const result = await pool.query(`SELECT ${columns} FROM ${table} ORDER BY created_at DESC LIMIT 500`); return send(res, 200, { rows: result.rows }); }
      if (req.method === 'DELETE' && rowId) { if (table === 'users' && rowId === admin) return send(res, 400, { error: 'Akun admin aktif tidak dapat dihapus.' }); await pool.query(`DELETE FROM ${table} WHERE id = $1`, [rowId]); return send(res, 204); }
      if (req.method === 'PATCH' && rowId) {
        const blocked = new Set(['id', 'created_at', 'updated_at', 'password_hash']);
        const keys = Object.keys(req.body || {}).filter((key) => !blocked.has(key));
        if (!keys.length) return send(res, 400, { error: 'Tidak ada perubahan.' });
        const values = keys.map((key) => req.body[key]);
        const result = await pool.query(`UPDATE ${table} SET ${keys.map((key, index) => `"${key}" = $${index + 1}`).join(', ')} WHERE id = $${keys.length + 1} RETURNING *`, [...values, rowId]);
        return send(res, 200, { row: result.rows[0] });
      }
      if (table === 'users' && req.method === 'POST' && rowId === 'reset-password') {
        const password = String(req.body?.password || '');
        if (password.length < 6) return send(res, 400, { error: 'Password baru minimal 6 karakter.' });
        if (req.body?.userId === admin) return send(res, 400, { error: 'Gunakan akun lain untuk mereset password admin aktif.' });
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [await bcrypt.hash(password, 12), req.body?.userId]);
        return send(res, 200, { ok: true });
      }
      return send(res, 405, { error: 'Method tidak didukung.' });
    }
    if (path === 'profile' && req.method === 'GET') { const id = await userId(req); if (!id) return send(res, 401, { error: 'Unauthorized' }); const result = await pool.query('SELECT * FROM profiles WHERE id=$1', [id]); return send(res, 200, { profile: result.rows[0] || null }); }
    return send(res, 404, { error: 'Route tidak ditemukan.' });
  } catch (error) { console.error('[EduLoLos] Production API error:', error); return send(res, 500, { error: 'Server gagal memproses permintaan.' }); }
}
