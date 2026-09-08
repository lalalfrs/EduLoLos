import React, { useEffect, useState } from 'react';

const tables = ['users', 'profiles', 'study_tasks', 'study_sessions', 'reminders', 'flashcard_decks', 'flashcards'];

type Row = Record<string, unknown>;

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [table, setTable] = useState(tables[0]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (selected = table) => {
    setLoading(true); setError('');
    try {
      const response = await fetch(`/api/admin/${selected}`, { credentials: 'include' });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Gagal memuat data.');
      setRows(body.rows || []);
    } catch (err) { setError(err instanceof Error ? err.message : 'Gagal memuat data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(table); }, [table]);

  const remove = async (id: string) => {
    if (!window.confirm('Hapus data ini dari database?')) return;
    const response = await fetch(`/api/admin/${table}/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!response.ok) { const body = await response.json(); setError(body.error || 'Gagal menghapus data.'); return; }
    setRows((current) => current.filter((row) => String(row.id) !== id));
  };

  const update = async (row: Row) => {
    const editable = Object.fromEntries(Object.entries(row).filter(([key]) => !['id', 'created_at', 'updated_at', 'password_hash'].includes(key)));
    const response = await fetch(`/api/admin/${table}/${row.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(editable) });
    if (!response.ok) { const body = await response.json(); setError(body.error || 'Gagal menyimpan data.'); return; }
    await load(table);
  };

  return <section className="min-h-screen bg-surface p-5 text-on-surface md:p-8">
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Admin database</p><h1 className="text-3xl font-black">Kelola data EduLoLos</h1></div>
        <button type="button" onClick={onClose} className="rounded-xl bg-surface-container px-4 py-2 font-bold">Kembali ke aplikasi</button>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">{tables.map((item) => <button key={item} type="button" onClick={() => setTable(item)} className={`rounded-xl px-4 py-2 text-sm font-bold ${table === item ? 'bg-primary text-on-primary' : 'bg-surface-container'}`}>{item}</button>)}</div>
      {error && <p role="alert" className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-error">{error}</p>}
      <div className="overflow-auto rounded-2xl bg-surface-container p-4">
        {loading ? <p>Memuat data...</p> : rows.length === 0 ? <p className="text-on-surface-variant">Tidak ada data.</p> : <table className="min-w-full text-left text-sm"><thead><tr>{Object.keys(rows[0]).filter((key) => key !== 'password_hash').map((key) => <th key={key} className="border-b border-outline/20 px-3 py-3 font-bold">{key}</th>)}<th className="border-b border-outline/20 px-3 py-3">Aksi</th></tr></thead><tbody>{rows.map((row) => <tr key={String(row.id)}>{Object.entries(row).filter(([key]) => key !== 'password_hash').map(([key, value]) => <td key={key} className="border-b border-outline/10 px-3 py-3 align-top"><input aria-label={`${key} ${row.id}`} defaultValue={value == null ? '' : String(value)} readOnly={['id', 'created_at', 'updated_at'].includes(key)} onChange={(event) => { row[key] = event.target.value; }} className="min-w-32 rounded-lg bg-surface px-2 py-1 text-xs" /></td>)}<td className="flex gap-2 border-b border-outline/10 px-3 py-3"><button type="button" onClick={() => update(row)} className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-on-primary">Simpan</button><button type="button" onClick={() => remove(String(row.id))} className="rounded-lg bg-error/15 px-3 py-1 text-xs font-bold text-error">Hapus</button></td></tr>)}</tbody></table>}
      </div>
    </div>
  </section>;
};
export default AdminPanel;
