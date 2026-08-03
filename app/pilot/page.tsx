import Link from 'next/link';

const launchItems = [
  {
    label: 'Week 1',
    title: 'Branded intake forms',
    detail: 'Convert existing clinic PDFs into mobile-friendly forms with signature capture, PDF delivery, and staff review.',
  },
  {
    label: 'Week 2',
    title: 'Lead capture queue',
    detail: 'Route missed-call, website, and WhatsApp inquiries into one reception task list without writing to the PMS.',
  },
  {
    label: 'Week 3',
    title: 'Daily admin summary',
    detail: 'Summarize incomplete forms, new-patient requests, urgent flags, and follow-ups for reception.',
  },
];

const boundaries = [
  'No autonomous clinical advice',
  'No live PMS write in the pilot',
  'Staff approval before patient messages',
  'Demo data until clinic agreements are ready',
];

export default function PilotOfferPage() {
  return (
    <main>
      <nav>
        <Link href="/" className="brand"><span className="brand-mark">F</span> Flowgent by MedEngs</Link>
        <div className="nav-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/clinical-notes">Notes</Link>
        </div>
      </nav>

      <section className="hero pilot-hero">
        <div>
          <p className="eyebrow">Paid pilot offer</p>
          <h1>Launch clinic automation before full SaaS.</h1>
          <p className="lead">
            The fastest monetizable package is branded intake forms, lead capture, staff-review tasks,
            and daily reception summaries. It sells as a managed automation service while the deeper
            AI receptionist platform matures.
          </p>
          <div className="cta-row">
            <Link className="primary" href="/dashboard">Open demo queue</Link>
            <Link className="secondary" href="/">Review product shell</Link>
          </div>
        </div>
        <aside className="hero-card pilot-pricing" aria-label="Pilot pricing">
          <span className="pill">Recommended first offer</span>
          <strong>CAD $750-$2,000 setup</strong>
          <p>Plus CAD $149-$399/month managed automation.</p>
          <small>AI phone/WhatsApp add-on after pilot validation: CAD $300-$750/month.</small>
        </aside>
      </section>

      <section className="section">
        <p className="eyebrow">Pilot sequence</p>
        <h2>Start with workflows clinics already buy</h2>
        <div className="cards">
          {launchItems.map((item) => (
            <article className="card" key={item.title}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section pilot-band">
        <div>
          <p className="eyebrow">Safety boundary</p>
          <h2>Sell the admin layer, not a PMS replacement</h2>
          <p>
            Flowgent should sit around Dentrix, ClearDent, Tracker, Open Dental, or whichever PMS the clinic
            already uses. The pilot proves capture, routing, paperwork, and receptionist time savings first.
          </p>
        </div>
        <div className="boundary-list">
          {boundaries.map((boundary) => (
            <span key={boundary}>{boundary}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
