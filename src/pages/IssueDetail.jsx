import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { supabase } from '../lib/supabase';

function renderContent(content) {
  if (!content) return null;
  const blocks = content.split('\n\n');
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="text-xl font-bold mt-8 mb-3 text-white">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={i} className="text-2xl font-bold mt-8 mb-3 text-white">
          {trimmed.slice(2)}
        </h1>
      );
    }

    const lines = trimmed.split('\n');
    const isList = lines.every((l) => /^(\d+\.\s|- \*\*|- )/.test(l.trim()));
    if (isList) {
      const isOrdered = /^\d+\./.test(lines[0].trim());
      const Tag = isOrdered ? 'ol' : 'ul';
      return (
        <Tag key={i} className={`space-y-2 my-4 ${isOrdered ? 'list-decimal' : 'list-disc'} list-inside`}>
          {lines.map((line, j) => {
            const text = line.replace(/^(\d+\.\s|- )/, '');
            return (
              <li key={j} className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{
                __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
              }} />
            );
          })}
        </Tag>
      );
    }

    return (
      <p key={i} className="text-slate-300 leading-relaxed my-4" dangerouslySetInnerHTML={{
        __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
      }} />
    );
  });
}

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjacentIssues, setAdjacentIssues] = useState({ prev: null, next: null });

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('newsletter_issues')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();
      setIssue(data);

      if (data) {
        const [prev, next] = await Promise.all([
          supabase
            .from('newsletter_issues')
            .select('id, title, issue_number')
            .eq('published', true)
            .lt('issue_number', data.issue_number)
            .order('issue_number', { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from('newsletter_issues')
            .select('id, title, issue_number')
            .eq('published', true)
            .gt('issue_number', data.issue_number)
            .order('issue_number', { ascending: true })
            .limit(1)
            .single(),
        ]);
        setAdjacentIssues({ prev: prev.data, next: next.data });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">Issue not found</h2>
        <Link to="/archive" className="text-brand-light hover:text-brand transition-colors">
          Back to Archive
        </Link>
      </div>
    );
  }

  const highlights = Array.isArray(issue.highlights) ? issue.highlights : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link to="/archive" className="text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6 inline-block">
        &larr; Back to Archive
      </Link>

      <div className="mb-8">
        <span className="text-sm text-brand-light font-medium">Issue #{issue.issue_number}</span>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">{issue.title}</h1>
        {issue.subtitle && <p className="text-lg text-slate-400">{issue.subtitle}</p>}
        {issue.published_at && (
          <p className="text-sm text-slate-500 mt-3">{formatDate(issue.published_at)}</p>
        )}
      </div>

      {highlights.length > 0 && (
        <div className="rounded-xl bg-brand/5 border border-brand/20 p-5 mb-8">
          <h3 className="text-sm font-semibold text-brand-light mb-3 uppercase tracking-wider">Key Highlights</h3>
          <ul className="space-y-2">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-light shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <article className="prose-invert">{renderContent(issue.content)}</article>

      {issue.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-surface-border">
          {issue.tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-brand/10 text-brand-light border border-brand/20">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-4 mt-10 pt-6 border-t border-surface-border">
        {adjacentIssues.prev ? (
          <Link to={`/issue/${adjacentIssues.prev.id}`} className="p-4 rounded-xl bg-surface-light border border-surface-border hover:border-brand/40 transition-colors">
            <span className="text-xs text-slate-500">Previous</span>
            <p className="text-sm font-medium mt-1 text-slate-300">#{adjacentIssues.prev.issue_number} {adjacentIssues.prev.title}</p>
          </Link>
        ) : <div />}
        {adjacentIssues.next ? (
          <Link to={`/issue/${adjacentIssues.next.id}`} className="p-4 rounded-xl bg-surface-light border border-surface-border hover:border-brand/40 transition-colors text-right">
            <span className="text-xs text-slate-500">Next</span>
            <p className="text-sm font-medium mt-1 text-slate-300">{adjacentIssues.next.title} #{adjacentIssues.next.issue_number}</p>
          </Link>
        ) : <div />}
      </div>

      {/* Subscribe CTA */}
      <div className="mt-12 p-8 rounded-2xl bg-surface-light border border-surface-border text-center">
        <h3 className="text-xl font-bold mb-2">Don&apos;t miss the next issue</h3>
        <p className="text-slate-400 mb-4">Get Bazaar in your inbox every Sunday.</p>
        <Link
          to="/"
          className="inline-flex px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition-colors"
        >
          Subscribe for free
        </Link>
      </div>
    </div>
  );
}
