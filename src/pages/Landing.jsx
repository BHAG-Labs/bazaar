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
  const [step, setStep] = useState(1); // 1 = email, 2 = pick columnists, 3 = done
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [issues, setIssues] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [issueCount, setIssueCount] = useState(0);

  const [personalities, setPersonalities] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

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

    supabase
      .from('agent_personalities')
      .select('id, slug, name, tagline, beat, coming_soon, slot')
      .order('coming_soon', { ascending: true })
      .order('slot', { ascending: true })
      .then(({ data }) => {
        const list = data || [];
        setPersonalities(list);
        // default-select every active (non-coming-soon) personality
        setSelectedIds(new Set(list.filter((p) => !p.coming_soon).map((p) => p.id)));
      });
  }, []);

  function nextStep(e) {
    e.preventDefault();
    setError('');
    if (!email) return;
    setStep(2);
  }

  function togglePersonality(id) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  async function handleSubscribe() {
    setError('');
    setSubmitting(true);
    try {
      const { data: sub, error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, name: name || null, role: role || null })
        .select('id')
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This email is already subscribed!');
          setSubmitting(false);
          return;
        }
        throw insertError;
      }

      if (sub && selectedIds.size > 0) {
        const rows = [...selectedIds].map((pid) => ({
          subscriber_id: sub.id,
          personality_id: pid,
          enabled: true,
        }));
        await supabase.from('subscriber_personality_preferences').insert(rows);
      }

      setStep(3);
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
      <section className="relative overflow-hidden paper-texture">
        <div className="max-w-3xl mx-auto px-4 pt-20 pb-16 text-center relative z-10">
          <div className="diamond-divider text-charcoal/40 max-w-[80px] mx-auto mb-8">
            <span className="text-xs select-none">&#9670;</span>
          </div>
          <p className="section-label mb-6">India&apos;s Weekly Startup Newsletter — Free, Always</p>
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.95] tracking-tight text-forest mb-6">
            India&apos;s Startup Economy.<br />
            <span className="text-terracotta">One Email. Every Sunday.</span>
          </h1>
          <p className="text-base md:text-lg text-charcoal/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Written by a cast of AI columnists, edited by humans. Pick the voices you want in your inbox.
          </p>

          {step === 1 && (
            <form onSubmit={nextStep} className="max-w-md mx-auto space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-editorial w-full"
              />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-editorial w-full"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-editorial w-full"
              >
                <option value="">What describes you best?</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {error && <p className="text-terracotta text-sm">{error}</p>}
              <button type="submit" className="btn-terracotta w-full">
                Next — pick your columnists →
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="max-w-2xl mx-auto text-left">
              <p className="section-label mb-2 text-center">Step 2 of 2</p>
              <h2 className="font-heading text-2xl md:text-3xl text-forest text-center mb-2">
                Pick your columnists.
              </h2>
              <p className="text-sm text-charcoal/60 text-center mb-6">
                You&apos;ll only get columns from the voices you select. Change this anytime from your profile.
              </p>

              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {personalities.map((p) => {
                  const checked = selectedIds.has(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={p.coming_soon}
                      onClick={() => togglePersonality(p.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        p.coming_soon
                          ? 'border-charcoal/10 bg-cream/50 opacity-60 cursor-not-allowed'
                          : checked
                          ? 'border-terracotta bg-terracotta/5'
                          : 'border-charcoal/10 bg-cream hover:border-terracotta/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <div className="font-heading font-bold text-charcoal">{p.name}</div>
                          {p.tagline && (
                            <div className="text-xs italic text-terracotta">{p.tagline}</div>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                          checked ? 'bg-terracotta border-terracotta' : 'border-charcoal/30'
                        }`}>
                          {checked && (
                            <svg className="w-3 h-3 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      {p.beat && (
                        <p className="text-xs text-charcoal/60 leading-snug mt-1">{p.beat}</p>
                      )}
                      {p.coming_soon && (
                        <span className="inline-block mt-2 text-[9px] uppercase tracking-widest text-terracotta">
                          Coming soon
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {error && <p className="text-terracotta text-sm text-center mb-3">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubscribe}
                  className="btn-terracotta flex-[2] disabled:opacity-50"
                >
                  {submitting ? 'Subscribing…' : `Subscribe (${selectedIds.size} columnist${selectedIds.size === 1 ? '' : 's'})`}
                </button>
              </div>
              <p className="text-xs text-charcoal/50 text-center mt-4">
                Prefer to read them first? <Link to="/columnists" className="underline">Visit the writers&apos; room →</Link>
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-md mx-auto rounded-2xl bg-cream border border-terracotta/30 p-8">
              <div className="w-14 h-14 rounded-full bg-terracotta/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-forest mb-2">You&apos;re in.</h3>
              <p className="text-charcoal/70">
                Check your inbox this Sunday for your first issue of Bazaar,
                curated to the {selectedIds.size} columnist{selectedIds.size === 1 ? '' : 's'} you picked.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Subscribers', value: subscriberCount.toLocaleString() },
            { label: 'Issues published', value: issueCount },
            { label: 'Columnists', value: personalities.filter((p) => !p.coming_soon).length },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-xl bg-cream border border-charcoal/10">
              <div className="text-2xl font-heading font-bold text-forest">{stat.value}</div>
              <div className="text-xs uppercase tracking-wider text-charcoal/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Issues */}
      {issues.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-forest">Recent issues</h2>
            <Link to="/archive" className="text-sm text-terracotta hover:text-terracotta-dark transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="space-y-4">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                to={`/issue/${issue.id}`}
                className="block p-6 rounded-xl bg-cream border border-charcoal/10 hover:border-terracotta/40 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs text-charcoal/50 font-medium">#{issue.issue_number}</span>
                    <h3 className="text-lg font-heading font-semibold mt-1 text-forest group-hover:text-terracotta transition-colors">
                      {issue.title}
                    </h3>
                    {issue.subtitle && (
                      <p className="text-sm text-charcoal/60 mt-1">{issue.subtitle}</p>
                    )}
                    {issue.tags?.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {issue.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-charcoal/50 whitespace-nowrap mt-1">
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
