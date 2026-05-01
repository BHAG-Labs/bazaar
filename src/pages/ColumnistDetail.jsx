import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { supabase } from '../lib/supabase';

export default function ColumnistDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: pers } = await supabase
        .from('agent_personalities')
        .select('*')
        .eq('slug', slug)
        .single();
      setP(pers);
      if (pers) {
        const { data: cols } = await supabase
          .from('agent_columns')
          .select('id, title, issue_id, published_at')
          .eq('personality_id', pers.id)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(10);
        setColumns(cols || []);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!p) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl text-charcoal mb-3">Columnist not found</h1>
        <Link to="/columnists" className="text-terracotta underline">Back to the writers' room</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link to="/columnists" className="text-xs uppercase tracking-[0.15em] text-charcoal/60 hover:text-terracotta transition-colors">
        ← The writers' room
      </Link>

      <div className="mt-6 mb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading font-black text-4xl md:text-5xl uppercase text-forest leading-tight">
              {p.name}
            </h1>
            {p.tagline && (
              <p className="text-lg text-terracotta font-subheading italic mt-1">{p.tagline}</p>
            )}
          </div>
          {p.coming_soon && (
            <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20 shrink-0">
              Coming soon
            </span>
          )}
        </div>

        {p.beat && (
          <div className="mt-6">
            <p className="section-label mb-2">Beat</p>
            <p className="text-charcoal/80 leading-relaxed">{p.beat}</p>
          </div>
        )}
      </div>

      <section className="mb-10 rounded-2xl border border-charcoal/10 bg-cream p-6">
        <p className="section-label mb-3">Backstory</p>
        <p className="text-charcoal/80 leading-relaxed whitespace-pre-line">{p.backstory}</p>
      </section>

      <section className="mb-10 grid md:grid-cols-2 gap-5">
        <div className="rounded-xl border border-charcoal/10 p-5">
          <p className="section-label mb-2">Voice</p>
          <p className="text-sm text-charcoal/80 leading-relaxed">{p.voice_spec}</p>
        </div>
        <div className="rounded-xl border border-charcoal/10 p-5 space-y-3">
          {p.signature_opener && (
            <div>
              <p className="section-label mb-1">Typical opener</p>
              <p className="text-sm italic text-charcoal/80">{p.signature_opener}</p>
            </div>
          )}
          {p.signature_closer && (
            <div>
              <p className="section-label mb-1">Sign-off</p>
              <p className="text-sm italic text-charcoal/80">{p.signature_closer}</p>
            </div>
          )}
          {p.forbidden_phrases?.length > 0 && (
            <div>
              <p className="section-label mb-1">Will never write</p>
              <p className="text-xs font-mono text-charcoal/60">
                {p.forbidden_phrases.join(' · ')}
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <p className="section-label mb-4">Recent columns</p>
        {columns.length === 0 ? (
          <p className="text-charcoal/50 text-sm">
            {p.coming_soon ? 'Hasn\u2019t filed yet \u2014 debut coming soon.' : 'No columns published yet.'}
          </p>
        ) : (
          <div className="space-y-3">
            {columns.map((c) => (
              <Link
                key={c.id}
                to={`/issue/${c.issue_id}`}
                className="block p-4 rounded-xl border border-charcoal/10 hover:border-terracotta/40 transition-colors"
              >
                <h3 className="font-medium text-charcoal group-hover:text-terracotta">{c.title}</h3>
                {c.published_at && (
                  <p className="text-xs text-charcoal/50 mt-1">
                    {new Date(c.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="mt-12 rounded-2xl bg-forest text-cream p-6 text-center">
        <p className="font-heading text-xl mb-2">Want {p.name.split(' ')[0]} in your inbox?</p>
        <p className="text-sm text-cream/70 mb-4">
          Subscribe to Bazaar and pick the columnists you want to hear from.
        </p>
        <Link to="/" className="btn-terracotta">Subscribe</Link>
      </div>
    </div>
  );
}
