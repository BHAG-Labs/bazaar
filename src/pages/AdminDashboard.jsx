import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router';

const EMPTY_ISSUE = {
  title: '',
  subtitle: '',
  content: '',
  tags: '',
  highlights: '[]',
  published: false,
};

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('issues');
  const [issues, setIssues] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_ISSUE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadIssues();
      loadSubscribers();
    }
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/profile" replace />;

  async function loadIssues() {
    const { data } = await supabase
      .from('newsletter_issues')
      .select('*')
      .order('issue_number', { ascending: false });
    setIssues(data || []);
  }

  async function loadSubscribers() {
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    setSubscribers(data || []);
  }

  function startCreate() {
    setEditing('new');
    setForm(EMPTY_ISSUE);
    setError('');
  }

  function startEdit(issue) {
    setEditing(issue.id);
    setForm({
      title: issue.title,
      subtitle: issue.subtitle || '',
      content: issue.content,
      tags: (issue.tags || []).join(', '),
      highlights: JSON.stringify(issue.highlights || [], null, 2),
      published: issue.published,
    });
    setError('');
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY_ISSUE);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    let highlights;
    try {
      highlights = JSON.parse(form.highlights);
    } catch {
      setError('Highlights must be valid JSON array');
      setSaving(false);
      return;
    }

    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      content: form.content,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      highlights,
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editing === 'new') {
        const maxNum = issues.reduce((max, i) => Math.max(max, i.issue_number), 0);
        payload.issue_number = maxNum + 1;
        const { error: insertErr } = await supabase.from('newsletter_issues').insert(payload);
        if (insertErr) throw insertErr;
      } else {
        const { error: updateErr } = await supabase
          .from('newsletter_issues')
          .update(payload)
          .eq('id', editing);
        if (updateErr) throw updateErr;
      }
      setEditing(null);
      setForm(EMPTY_ISSUE);
      await loadIssues();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-surface-border">
        {['issues', 'subscribers'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors cursor-pointer ${
              tab === t
                ? 'text-brand-light border-b-2 border-brand'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t} {t === 'subscribers' && `(${subscribers.length})`}
          </button>
        ))}
      </div>

      {/* Issues Tab */}
      {tab === 'issues' && (
        <div>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">
                {editing === 'new' ? 'New Issue' : 'Edit Issue'}
              </h2>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
                <textarea
                  required
                  rows={12}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand transition-colors font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="Fundraising, Seed, VCs"
                  className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-white placeholder:text-slate-500 focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Highlights (JSON array)</label>
                <textarea
                  rows={3}
                  value={form.highlights}
                  onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand transition-colors font-mono text-sm"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 rounded accent-brand"
                />
                <span className="text-sm text-slate-300">Published</span>
              </label>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-2.5 rounded-xl border border-surface-border text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <button
                onClick={startCreate}
                className="mb-6 px-5 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition-colors cursor-pointer"
              >
                + New Issue
              </button>
              <div className="space-y-3">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-xl bg-surface-light border border-surface-border flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">#{issue.issue_number}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          issue.published
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {issue.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h3 className="font-medium mt-1 truncate">{issue.title}</h3>
                    </div>
                    <button
                      onClick={() => startEdit(issue)}
                      className="text-sm text-brand-light hover:text-brand transition-colors shrink-0 cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                ))}
                {issues.length === 0 && (
                  <p className="text-slate-500 text-center py-10">No issues yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Subscribers Tab */}
      {tab === 'subscribers' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-surface-border">
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Subscribed</th>
                <th className="pb-3 font-medium">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="text-slate-300">
                  <td className="py-3">{sub.email}</td>
                  <td className="py-3">{sub.name || '—'}</td>
                  <td className="py-3">{sub.role || '—'}</td>
                  <td className="py-3">{sub.subscribed_at && formatDate(sub.subscribed_at)}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      sub.active
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {sub.active ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">No subscribers yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
