import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { supabase } from '../lib/supabase';

const ROLES = [
  'Founder',
  'Student',
  'Investor/Angel',
  'Faculty/Mentor',
  'Accelerator Manager',
  'Curious Observer',
];

export default function Landing() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [issues, setIssues] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [issueCount, setIssueCount] = useState(0);

  useEffect(() => {
    supabase
      .from('newsletter_issues')
      .select('id, issue_number, title, subtitle, tags, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setIssues(data || []));

    supabase
      .from('newsletter_issues')
      .select('id', { count: 'exact', head: true })
      .eq('published', true)
      .then(({ count }) => setIssueCount(count || 0));

    supabase
      .from('newsletter_subscribers')
      .select('id', { count: 'exact', head: true })
      .eq('active', true)
      .then(({ count }) => setSubscriberCount(count || 0));
  }, []);

  async function handleSubscribe(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, name: name || null, role: role || null });
      if (insertError) {
        if (insertError.code === '23505') {
          setError('This email is already subscribed!');
        } else {
          throw insertError;
        }
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand-light text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            Free, every Sunday
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            India&apos;s Startup Economy.
            <br />
            <span className="text-brand-light">One Email. Every Sunday.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">
            Funding signals you can act on. Regulatory shifts that affect your runway.
            Actionable deals — not just headlines.
          </p>

          {submitted ? (
            <div className="max-w-md mx-auto rounded-2xl bg-surface-light border border-brand/30 p-8">
              <div className="w-14 h-14 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">You&apos;re in!</h3>
              <p className="text-slate-400">Check your inbox this Sunday for Bazaar.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-white placeholder:text-slate-500 focus:outline-none focus:border-brand transition-colors"
              />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-white placeholder:text-slate-500 focus:outline-none focus:border-brand transition-colors"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-border text-white focus:outline-none focus:border-brand transition-colors appearance-none"
              >
                <option value="">What describes you best?</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Subscribing...' : 'Subscribe — it\u2019s free'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Subscribers', value: subscriberCount.toLocaleString() },
            { label: 'Issues published', value: issueCount },
            { label: 'Price', value: 'Free, always' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-xl bg-surface-light border border-surface-border">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Issues */}
      {issues.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Issues</h2>
            <Link to="/archive" className="text-sm text-brand-light hover:text-brand transition-colors">
              View all &rarr;
            </Link>
          </div>
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
                    <h3 className="text-lg font-semibold mt-1 group-hover:text-brand-light transition-colors">
                      {issue.title}
                    </h3>
                    {issue.subtitle && (
                      <p className="text-sm text-slate-400 mt-1">{issue.subtitle}</p>
                    )}
                    {issue.tags?.length > 0 && (
                      <div className="flex gap-2 mt-3">
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
        </section>
      )}
    </div>
  );
}
