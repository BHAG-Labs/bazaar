// Legal pages for Bazaar.
//
// IMPORTANT: This is a working draft suitable for a soft pre-launch state.
// Before you publicly launch the print edition or accept paid sponsorships,
// have an Indian IP / media lawyer review every section. The DPDP Act 2023,
// IT Rules 2021, PRGI Act 2023, and Consumer Protection Authority guidelines
// (sponsored content disclosure) all apply.

import { useParams } from 'react-router';

const PRODUCT = {
  name: 'Bazaar',
  url: 'https://bazaar.bhaglabs.com',
  contact: 'bazaar@bhaglabs.com',
  description: 'a weekly newsletter on India\'s startup, VC, and policy economy',
};

const ENTITY = {
  name: 'BHAG Labs',
  // TODO: update once Pvt. Ltd. is incorporated (Phase 3, ~Month 6).
  // legal: 'BHAG Labs Private Limited',
  // cin: 'UXXXXXDLYYYYPTCXXXXXX',
  legal: 'BHAG Labs (sole proprietorship of Kartikeya Sharma, pre-incorporation)',
  address: 'Delhi NCT, India',
  jurisdiction: 'Delhi, India',
};

const CONTACTS = {
  privacy: 'privacy@bhaglabs.com',
  grievance: 'grievance@bhaglabs.com',
  legal: 'legal@bhaglabs.com',
  editor: 'editor@bhaglabs.com',
  security: 'security@bhaglabs.com',
};

const GRIEVANCE_OFFICER = {
  name: 'Kartikeya Sharma',
  designation: 'Founder & Editor',
  email: CONTACTS.grievance,
  hours: 'Mon–Fri 10:00–18:00 IST',
};

const LAST_UPDATED = '1 May 2026';

// ---------------------------------------------------------------------------

function Page({ title, kicker, children }) {
  return (
    <article className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="mb-8 pb-6 border-b border-charcoal/10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ochre mb-2">{kicker}</p>
        <h1 className="font-heading font-bold text-3xl md:text-5xl text-charcoal leading-tight">{title}</h1>
        <p className="text-xs text-charcoal/50 mt-3">Last updated: {LAST_UPDATED}</p>
      </div>
      <div className="prose prose-sm md:prose-base max-w-none text-charcoal/80 leading-relaxed space-y-5
                      [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-charcoal [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:mt-10 [&_h2]:mb-3
                      [&_h3]:font-heading [&_h3]:font-semibold [&_h3]:text-charcoal [&_h3]:text-base [&_h3]:mt-6 [&_h3]:mb-2
                      [&_a]:text-terracotta [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:marker:text-ochre">
        {children}
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------

function Privacy() {
  return (
    <Page kicker="Privacy" title="Privacy Policy">
      <p>
        This policy explains what personal data {PRODUCT.name} collects, why we collect it,
        and the rights you have under India's Digital Personal Data Protection Act, 2023 (DPDP Act).
        It applies to <a href={PRODUCT.url}>{PRODUCT.url}</a> and to mail you receive from us.
      </p>

      <h2>Who is the data fiduciary</h2>
      <p>
        {ENTITY.legal}, operating as {ENTITY.name} ({PRODUCT.name}). For any privacy-related
        request, contact our Data Protection contact at <a href={`mailto:${CONTACTS.privacy}`}>{CONTACTS.privacy}</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Email address and name</strong> — when you subscribe.</li>
        <li><strong>Reader preferences</strong> — which AI columnists you choose to receive.</li>
        <li><strong>Usage data</strong> — pages visited, links clicked, open and click events on email (aggregated where possible, never sold).</li>
        <li><strong>Submitted content</strong> — story tips, letters to the editor, comments.</li>
        <li><strong>Payment metadata</strong> — only if/when you become a paid subscriber: name, billing email, and payment-gateway transaction IDs. Card numbers and bank details never touch our servers; they remain with the gateway (Razorpay).</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To deliver the newsletter you subscribed to.</li>
        <li>To personalise which columns you receive based on your preferences.</li>
        <li>To respond to messages you send us.</li>
        <li>To improve the publication (aggregate analytics only).</li>
        <li>To comply with applicable Indian law and lawful requests.</li>
      </ul>

      <h2>What we do NOT do</h2>
      <ul>
        <li>We do not sell your data to anyone, ever.</li>
        <li>We do not run third-party advertising networks; sponsorship is a flat plain-text block, no tracking.</li>
        <li>We do not use your data to train external AI models.</li>
      </ul>

      <h2>Sub-processors</h2>
      <p>
        We use a small number of vetted vendors to operate the service: Supabase (database, hosted in Mumbai region),
        Resend / Amazon SES (email delivery), Substack (Phase 1 distribution), and Google Cloud Platform (compute, Mumbai region).
        Each vendor is contractually bound to protect your data.
      </p>

      <h2>Your rights under the DPDP Act</h2>
      <ul>
        <li><strong>Right to access</strong> a copy of your data.</li>
        <li><strong>Right to correction</strong> of inaccurate data.</li>
        <li><strong>Right to erasure</strong> ("delete my account").</li>
        <li><strong>Right to withdraw consent</strong> at any time.</li>
        <li><strong>Right to grievance redressal</strong> (see our <a href="/grievance">Grievance page</a>).</li>
      </ul>
      <p>
        To exercise any of these, email <a href={`mailto:${CONTACTS.privacy}`}>{CONTACTS.privacy}</a>.
        We respond within 72 hours for erasure / withdrawal-of-consent requests, and within 7 days for others.
      </p>

      <h2>Retention</h2>
      <p>
        Subscriber records are retained for as long as your subscription is active and for up to 6 months after
        you unsubscribe (so we can comply with anti-spam and audit obligations). Aggregate analytics are retained indefinitely.
      </p>

      <h2>Security</h2>
      <p>
        Data is encrypted in transit (TLS) and at rest. Access to production data is limited to the founder and is
        logged. To report a vulnerability, write to <a href={`mailto:${CONTACTS.security}`}>{CONTACTS.security}</a>.
      </p>

      <h2>Children</h2>
      <p>
        {PRODUCT.name} is not directed at users under 18 and we do not knowingly collect data from children.
      </p>

      <h2>Updates to this policy</h2>
      <p>
        We will email subscribers when we make material changes. Minor edits (typos, clarifications) are reflected here
        with the "Last updated" date above.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions: <a href={`mailto:${CONTACTS.privacy}`}>{CONTACTS.privacy}</a><br />
        Grievances under IT Rules 2021: see <a href="/grievance">Grievance page</a>.
      </p>
    </Page>
  );
}

// ---------------------------------------------------------------------------

function Terms() {
  return (
    <Page kicker="Legal" title="Terms of Service">
      <p>
        These terms govern your use of {PRODUCT.name} (<a href={PRODUCT.url}>{PRODUCT.url}</a>).
        By subscribing or accessing the site, you agree to these terms.
      </p>

      <h2>1. The service</h2>
      <p>
        {PRODUCT.name} is {PRODUCT.description}, published by {ENTITY.legal}.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be 18 or older, or have your guardian's consent, to subscribe. By using the service you confirm
        the information you provide is accurate.
      </p>

      <h2>3. Acceptable use</h2>
      <ul>
        <li>Do not attempt to disrupt the service, scrape it at scale, or republish content commercially without permission.</li>
        <li>Do not impersonate {PRODUCT.name} or any of its writers.</li>
        <li>Do not abuse the contact, tip-line, or grievance channels for spam.</li>
      </ul>

      <h2>4. Intellectual property</h2>
      <p>
        All editorial content — including AI-drafted columns, photographs, illustrations, and the {PRODUCT.name} brand —
        is owned by {ENTITY.name} unless otherwise credited. You may share short excerpts with attribution.
        For syndication or republication rights, write to <a href={`mailto:${CONTACTS.legal}`}>{CONTACTS.legal}</a>.
      </p>

      <h2>5. AI-drafted content disclosure</h2>
      <p>
        Many columns in {PRODUCT.name} are drafted by AI personalities and edited by a human editor.
        See our <a href="/disclosure">Editorial Disclosure</a> for the full policy. Reporting cited in any column
        is verified against primary sources before publication.
      </p>

      <h2>6. Sponsored content</h2>
      <p>
        Sponsored sections are clearly labelled "Presented by" and carry no editorial influence.
        We comply with the Central Consumer Protection Authority Guidelines for Prevention of Misleading
        Advertisements, 2022.
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        {PRODUCT.name} is journalism and analysis, not financial, legal, or tax advice. Information is
        provided "as is" without warranties. Decisions you make based on what you read here are your own.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {ENTITY.name}'s total liability arising out of or related to
        the service is limited to the amount you have paid to {ENTITY.name} in the 12 months preceding the claim,
        or ₹1,000, whichever is greater. We are not liable for indirect, consequential, or punitive damages.
      </p>

      <h2>9. Termination</h2>
      <p>
        You may unsubscribe at any time using the link in any email or by writing to us. We may suspend or terminate
        access for violations of these terms; we will tell you why.
      </p>

      <h2>10. Governing law and disputes</h2>
      <p>
        These terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the
        courts at {ENTITY.jurisdiction}.
      </p>

      <h2>11. Changes</h2>
      <p>
        We will notify subscribers by email of material changes at least 14 days before they take effect.
      </p>

      <h2>12. Contact</h2>
      <p>
        <a href={`mailto:${CONTACTS.legal}`}>{CONTACTS.legal}</a> for legal queries; <a href={`mailto:${PRODUCT.contact}`}>{PRODUCT.contact}</a> for everything else.
      </p>
    </Page>
  );
}

// ---------------------------------------------------------------------------

function Grievance() {
  return (
    <Page kicker="Compliance" title="Grievance Officer">
      <p>
        In compliance with the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>,
        and the <strong>Digital Personal Data Protection Act, 2023</strong>, {ENTITY.name} ({PRODUCT.name}) designates a
        Grievance Officer to address complaints from users and readers.
      </p>

      <h2>Officer</h2>
      <p>
        <strong>{GRIEVANCE_OFFICER.name}</strong>, {GRIEVANCE_OFFICER.designation}<br />
        Email: <a href={`mailto:${GRIEVANCE_OFFICER.email}`}>{GRIEVANCE_OFFICER.email}</a><br />
        Address: {ENTITY.address}<br />
        Hours: {GRIEVANCE_OFFICER.hours}
      </p>

      <h2>What you can file</h2>
      <ul>
        <li>Requests to take down content that violates Rule 3(1)(b) of the IT Rules 2021.</li>
        <li>Complaints about defamatory, obscene, or copyrighted content.</li>
        <li>Personal data complaints under the DPDP Act 2023 (access, correction, erasure, withdrawal of consent).</li>
        <li>Editorial corrections and complaints about factual errors.</li>
      </ul>

      <h2>How we respond</h2>
      <ul>
        <li><strong>Acknowledgement:</strong> within 24 hours.</li>
        <li><strong>Resolution:</strong> within 15 days for IT-Rules grievances; within 72 hours for DPDP erasure or consent-withdrawal requests; within 7 days for other DPDP requests.</li>
        <li><strong>Escalation:</strong> if you are not satisfied with the resolution, you may file a complaint with the Data Protection Board of India once it is operational, or with the Grievance Appellate Committee under the IT Rules.</li>
      </ul>

      <h2>What we ask of you</h2>
      <p>
        Please include in your email: your full name, the URL or issue number of the content in question, the
        specific provision you believe is violated, and any supporting evidence. This helps us respond faster.
      </p>
    </Page>
  );
}

// ---------------------------------------------------------------------------

function Disclosure() {
  return (
    <Page kicker="Editorial" title="AI & Editorial Disclosure">
      <p>
        {PRODUCT.name} is unusual: most columns are drafted by AI personalities — Naina Kapoor, Vikram Iyer,
        Priya Srinivasan, Arjun Malhotra — and edited by a human editor before publication.
        This page explains exactly how that works and what we promise readers.
      </p>

      <h2>The personalities are fictional. The reporting is not.</h2>
      <p>
        Each personality has a name, voice, and consistent point of view. None of them is a real person. Their
        bylines exist to give the writing a recognisable register, the way a magazine's columnists do — but every
        fact, number, and quote in their work is grounded in primary sources.
      </p>

      <h2>How a column is made</h2>
      <ul>
        <li><strong>Research.</strong> An AI research agent ingests RSS feeds, regulatory circulars, deal-room data, and field tips, and produces a weekly brief grounded in primary sources.</li>
        <li><strong>Draft.</strong> The personality's AI agent writes a draft against that brief in its assigned voice.</li>
        <li><strong>Editorial pass.</strong> A second model checks for voice consistency, factual risks, and forbidden phrasing.</li>
        <li><strong>Human edit.</strong> A human editor reviews, fact-checks against the cited sources, and approves or sends back for revision. Nothing is published without this step.</li>
      </ul>

      <h2>What we will never do</h2>
      <ul>
        <li>We will never claim a column was written by a real human columnist when it was AI-drafted.</li>
        <li>We will never fabricate quotes, deal numbers, or sources.</li>
        <li>We will never present sponsored content without a "Presented by" label.</li>
        <li>We will never refuse to correct a factual error.</li>
      </ul>

      <h2>Corrections policy</h2>
      <p>
        If we publish an error, we correct it in-line with a strikethrough in the live archive and announce it in
        the next issue under "Corrections". If you spot one, write to <a href={`mailto:${CONTACTS.editor}`}>{CONTACTS.editor}</a>.
      </p>

      <h2>Editorial independence</h2>
      <p>
        Sponsors do not see columns before publication and have no influence over editorial content. {ENTITY.name}
        maintains a public charter for the autonomous newsroom agent (Ekam) that funds future research; you can
        read the full charter at{' '}
        <a href="/ekam">/ekam</a>.
      </p>

      <h2>Named-person rules</h2>
      <p>
        Any claim about a named individual or company must be backed by at least one public source. The gossip
        column requires two sources and is human-reviewed line by line.
      </p>

      <h2>Questions</h2>
      <p>
        Editorial: <a href={`mailto:${CONTACTS.editor}`}>{CONTACTS.editor}</a><br />
        Tips: <a href="mailto:tips@bhaglabs.com">tips@bhaglabs.com</a>
      </p>
    </Page>
  );
}

// ---------------------------------------------------------------------------

const PAGES = {
  privacy: Privacy,
  terms: Terms,
  grievance: Grievance,
  disclosure: Disclosure,
};

export default function LegalPage({ kind }) {
  // `kind` can come from a prop OR from the URL pathname for flexibility.
  const params = useParams();
  const resolved = kind || params.kind;
  const Component = PAGES[resolved];
  if (!Component) {
    return (
      <Page kicker="404" title="Not found">
        <p>This legal page does not exist. Try <a href="/privacy">Privacy</a>, <a href="/terms">Terms</a>, <a href="/grievance">Grievance</a>, or <a href="/disclosure">AI Disclosure</a>.</p>
      </Page>
    );
  }
  return <Component />;
}
