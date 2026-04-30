import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { supabase } from '../lib/supabase';

export default function Archive() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('newsletter_issues')
      .select('id, issue_number, title, subtitle, tags, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setIssues(data || []);
        setLoading(false);
      });
  }, []);

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Archive</h1>
      <p className="text-slate-400 mb-10">Every issue of Bazaar, from day one.</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : issues.length === 0 ? (
        <p className="text-slate-500 text-center py-20">No issues published yet.</p>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              to={`/issue/${issue.id}`}
              className="block p-6 rounded-xl bg-surface-light border border-surface-border hover:border-brand/40 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium">#{issue.issue_number}</span>
                  <h2 className="text-lg font-semibold mt-1 group-hover:text-brand-light transition-colors">
                    {issue.title}
                  </h2>
                  {issue.subtitle && (
                    <p className="text-sm text-slate-400 mt-1">{issue.subtitle}</p>
                  )}
                  {issue.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {issue.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand-light border border-brand/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap mt-1">
                  {issue.published_at && formatDate(issue.published_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
