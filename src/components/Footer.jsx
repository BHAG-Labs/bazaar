export default function Footer() {
  return (
    <footer className="section-dark py-12 px-6 md:px-8 mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="font-heading font-bold text-2xl text-cream mb-1">Bazaar</div>
            <div className="font-subheading text-base text-ochre mb-3">बाज़ार</div>
            <p className="text-xs text-cream/50 max-w-sm mb-4">
              India's startup, VC, and policy economy — one Sunday email.
            </p>
            <p className="text-[11px] text-cream/40 leading-relaxed">
              A BHAG Labs publication.
              <br />
              <a href="https://bhaglabs.com" className="hover:text-cream transition-colors">bhaglabs.com</a>
            </p>
          </div>

          {/* Editorial / readers */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-ochre mb-4">Write to us</h4>
            <ul className="space-y-2 text-xs text-cream/60">
              <li>
                <a href="mailto:editor@bhaglabs.com" className="hover:text-cream transition-colors">editor@bhaglabs.com</a>
                <span className="block text-cream/35 text-[10px] mt-0.5">Letters to the editor, corrections</span>
              </li>
              <li>
                <a href="mailto:tips@bhaglabs.com" className="hover:text-cream transition-colors">tips@bhaglabs.com</a>
                <span className="block text-cream/35 text-[10px] mt-0.5">Story tips, leaks, scoops</span>
              </li>
              <li>
                <a href="mailto:bazaar@bhaglabs.com" className="hover:text-cream transition-colors">bazaar@bhaglabs.com</a>
                <span className="block text-cream/35 text-[10px] mt-0.5">General reader mail</span>
              </li>
              <li>
                <a href="mailto:sponsors@bhaglabs.com" className="hover:text-cream transition-colors">sponsors@bhaglabs.com</a>
                <span className="block text-cream/35 text-[10px] mt-0.5">Sponsor an issue</span>
              </li>
            </ul>
          </div>

          {/* Legal / compliance */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-ochre mb-4">Legal</h4>
            <ul className="space-y-2 text-xs text-cream/60">
              <li>
                <a href="/grievance" className="hover:text-cream transition-colors">Grievance Officer</a>
                <span className="block text-cream/35 text-[10px] mt-0.5">
                  <a href="mailto:grievance@bhaglabs.com" className="hover:text-cream">grievance@bhaglabs.com</a> · 15-day SLA
                </span>
              </li>
              <li>
                <a href="/privacy" className="hover:text-cream transition-colors">Privacy Policy</a>
                <span className="block text-cream/35 text-[10px] mt-0.5">
                  <a href="mailto:privacy@bhaglabs.com" className="hover:text-cream">privacy@bhaglabs.com</a> · DPDP requests
                </span>
              </li>
              <li>
                <a href="/terms" className="hover:text-cream transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="/disclosure" className="hover:text-cream transition-colors">AI & Editorial Disclosure</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="rule-gold opacity-30 mb-6" />

        {/* Cross-product nav */}
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-cream/50 uppercase tracking-wider mb-6">
          <a href="https://bhaglabs.com" className="hover:text-cream transition-colors">BHAG Labs</a>
          <a href="https://neev.bhaglabs.com" className="hover:text-cream transition-colors">Neev</a>
          <a href="https://hissa.bhaglabs.com" className="hover:text-cream transition-colors">Hissa</a>
          <a href="https://pitchwala.bhaglabs.com" className="hover:text-cream transition-colors">Pitchwala</a>
          <a href="https://yantra.bhaglabs.com" className="hover:text-cream transition-colors">Yantra</a>
          <span className="text-ochre/60">Bazaar</span>
        </nav>

        {/* Imprint — required by PRGI Act 2023 once the print edition launches.
            Until print is live, this is a soft placeholder. */}
        <p className="text-[10px] text-cream/30 leading-relaxed mb-4 max-w-3xl">
          Columns in Bazaar are drafted by AI personalities based on real research and edited by a
          human editor. Personalities are fictional; the reporting they cite is not.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-cream/40">&copy; {new Date().getFullYear()} BHAG Labs Pvt. Ltd.</p>
          <div className="diamond-divider text-ochre/30 max-w-[60px]">
            <span className="text-xs select-none">&#9670;</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
