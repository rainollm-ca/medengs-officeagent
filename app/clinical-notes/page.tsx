import Link from 'next/link';
import { StatCard } from '../../components/StatCard';
import { dentalNoteTemplates } from '../../lib/sample-data';

export default function ClinicalNotesPage() {
  return (
    <main className="dashboard">
      <nav>
        <Link href="/" className="brand"><span className="brand-mark">F</span> Flowgent by MedEngs</Link>
        <div className="nav-links">
          <Link href="/dashboard">Reception dashboard</Link>
          <Link href="/">Product</Link>
        </div>
      </nav>

      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Dentist medical notes copilot</p>
          <h1>Clinical note drafts that stay provider-controlled.</h1>
          <p className="lead">
            A dental-note workspace for exams, hygiene, emergencies, procedures, and post-op calls.
            Flowgent structures notes from approved templates and leaves diagnosis, treatment decisions,
            and final signature to the dentist or hygienist.
          </p>
        </div>
        <div className="stats-row">
          <StatCard label="Templates" value={String(dentalNoteTemplates.length)} tone="good" />
          <StatCard label="Approval" value="Provider" tone="warn" />
          <StatCard label="AI scope" value="Draft only" />
        </div>
      </header>

      <section className="section note-workbench">
        <div className="panel note-editor-preview">
          <p className="eyebrow">Provider review workspace</p>
          <h2>Emergency exam note draft</h2>
          <div className="note-lines">
            <p><strong>Chief concern</strong><span>Patient reports lower-right pain and swelling since yesterday.</span></p>
            <p><strong>Red flags</strong><span>Swelling present · fever not confirmed · same-day review recommended.</span></p>
            <p><strong>Provider fields</strong><span className="placeholder">Diagnosis, radiographic interpretation, treatment plan, signature.</span></p>
          </div>
        </div>
        <div className="panel approval-rail">
          <span className="pill warn">Draft only</span>
          <h3>AI cannot finalize clinical notes.</h3>
          <p>Dentist or hygienist approval is required before chart export. Missing clinical details stay blank instead of being invented.</p>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Note templates</p>
        <div className="cards">
          {dentalNoteTemplates.map((template) => (
            <article className="card" key={template.name}>
              <span>{template.workflow.replace('_', ' ')}</span>
              <h3>{template.name}</h3>
              <p>{template.sections.join(' · ')}</p>
              <small>{template.approvalOwner.toUpperCase()} approval · {template.safetyBoundary}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Production guardrails</p>
        <div className="feature-grid">
          <article>No diagnosis generation. Missing clinical details stay blank for provider completion.</article>
          <article>No autonomous patient clinical advice. Red flags escalate to staff immediately.</article>
          <article>Every finalized note needs provider review, timestamp, audit log, and chart export path.</article>
        </div>
      </section>
    </main>
  );
}
