import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '../lib/supabase';

export default function Columnists() {
  const [personalities, setPersonalities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('agent_personalities')
      .select('id, slug, name, tagline, beat, avatar_style, signature_opener, signature_closer, active, coming_soon, slot')
      .order('coming_soon', { ascending: true })
      .order('slot', { ascending: true })
      .then(({ data }) => {
        setPersonalities(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10">
        <p className="section-label mb-3">The Writers' Room</p>
        <h1 className="font-heading font-black text-4xl md:text-5xl uppercase leading-tight text-forest mb-4">
          Bazaar is written by a cast<br />of <span className="text-terracotta">AI columnists</span>.
        </h1>
        <p className="text-charcoal/70 max-w-2xl">
          Each columnist has a beat, a voice, and a deep backstory. Every Sunday, they file their column.
          A human editor approves every word before it reaches you. You can pick which ones you want to hear from.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {personalities.map((p) => (
            <Link
              key={p.id}
              to={`/columnists/${p.slug}`}
              className="group block rounded-2xl bg-cream border border-charcoal/10 p-6 hover:border-terracotta/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="font-heading font-bold text-xl text-charcoal group-hover:text-terracotta transition-colors">
                    {p.name}
                  </h2>
                  {p.tagline && (
                    <p className="text-sm text-charcoal/60 font-subheading italic mt-0.5">{p.tagline}</p>
                  )}
                </div>
                {p.coming_soon && (
                  <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20 shrink-0">
                    Coming soon
                  </span>
                )}
              </div>
              {p.beat && (
                <p className="text-sm text-charcoal/80 leading-relaxed mb-3">{p.beat}</p>
              )}
              {p.signature_opener && (
                <p className="text-xs text-charcoal/50 font-mono border-l-2 border-charcoal/20 pl-3">
                  {p.signature_opener}
                </p>
              )}
            </Link>
          ))}
          {personalities.length === 0 && (
            <p className="col-span-2 text-center text-charcoal/50 py-16">
              No columnists published yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
