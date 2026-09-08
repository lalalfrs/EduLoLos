const configuredApi = (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, '');
const isProduction = Boolean((import.meta as any).env?.PROD);
const isLocalApi = configuredApi?.includes('localhost') || configuredApi?.includes('127.0.0.1');
const API_BASE = configuredApi && (!isProduction || !isLocalApi) ? configuredApi : isProduction ? '' : 'http://localhost:4000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: options.signal || controller.signal,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(body?.error || `Request gagal (${response.status})`);
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }
    return body as T;
  } catch (error: any) {
    if (error?.name === 'AbortError') throw new Error('Server API tidak merespons. Periksa deployment API dan environment Neon.');
    if (error instanceof TypeError) throw new Error(API_BASE === '' ? 'API production tidak terhubung. Pastikan route /api dan environment Neon tersedia.' : 'API lokal tidak terhubung. Jalankan npm run api dan pastikan port 4000 aktif.');
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export const signUp = async (email: string, password: string, displayName: string) => {
  try { return { data: await request<{ user: any }>('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, displayName }) }), error: null }; }
  catch (error: any) { return { data: null, error }; }
};
export const signIn = async (email: string, password: string) => {
  try { return { data: await request<{ user: any }>('/api/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) }), error: null }; }
  catch (error: any) { return { data: null, error }; }
};
export const signOut = () => request('/api/auth/signout', { method: 'POST' });
export const getSession = async () => { const data = await request<{ user: any | null }>('/api/auth/session'); return data.user ? { user: data.user } : null; };
export const getUser = async () => (await getSession())?.user || null;
export const onAuthStateChange = (callback: (user: any) => void) => ({ data: { subscription: { unsubscribe: () => undefined } } });
export { request };
