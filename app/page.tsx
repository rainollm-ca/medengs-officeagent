import Link from 'next/link';
import { AgentCommandPanel } from '../components/AgentCommandPanel';
import { StatCard } from '../components/StatCard';
import { clinicSetupSteps, formTemplates, integrationStatuses, receptionWorkflows } from '../lib/sample-data';

const features = [
  'First-contact AI receptionist for phone, web chat, WhatsApp, email drafts, and walk-in tasks',
  'Web setup wizard: logo, colours, hours, services, staff contacts, policies, forms, and routing rules',
  'Reception inbox for new patients, emergencies, insurance, recalls, no-shows, records, and staff approvals',
  'AI-generated and AI-refined documents, forms, consent packets, referrals, and branded PDFs',
  'Employee clock-in/out, breaks, daily checklists, and manager-reviewed time export',
  'Canadian privacy posture: PHIPA/PIPEDA-conscious, CASL-aware, audit logs, no AI training',
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <nav>
          <div className="brand"><span className="brand-mark">F</span> Flowgent by MedEngs</div>
          <div className="nav-links">
            <a href="#workflows">Workflows</a>
            <a href="/pilot">Pilot</a>
            <a href="/setup">Setup</a>
            <a href="/clinical-notes">Notes</a>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </nav>
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Receptionist-first dental OS · Canada-ready</p>
            <h1>The AI front desk for Canadian dental clinics.</h1>
            <p className="lead">
              Setup from the web by uploading clinic branding and office rules. Flowgent answers first,
              captures patient/admin intent, prepares documents and form links, queues staff approvals,
              and connects phone, web, WhatsApp, and daily reception work into one audited inbox.
            </p>
            <div className="trust-strip" aria-label="Product guardrails">
              <span>PHIPA/PIPEDA-conscious</span>
              <span>CASL-aware messaging</span>
              <span>Provider approval for notes</span>
            </div>
            <div className="cta-row">
              <Link className="primary" href="/dashboard">Open production demo</Link>
              <a className="secondary" href="/setup">Clinic setup profile</a>
              <a className="secondary" href="/pilot">View paid pilot offer</a>
              <a className="secondary" href="/clinical-notes">Dental notes copilot</a>
            </div>
          </div>
          <div className="hero-card product-console" aria-label="Flowgent live demo preview">
            <div className="console-header">
              <span className="status-dot" />
              <strong>Smile North Dental</strong>
              <small>Live reception queue</small>
            </div>
            <StatCard label="First contact" value="Phone + Web + WhatsApp" tone="good" />
            <StatCard label="Launch model" value="PMS-agnostic" />
            <StatCard label="Safety" value="Staff approval first" tone="warn" />
            <div className="mini-inbox">
              <article><span>URGENT</span><strong>Pain + swelling call</strong><small>Dentist review queued</small></article>
              <article><span>WHATSAPP</span><strong>Medical history link</strong><small>Consent check required</small></article>
              <article><span>TIME CLOCK</span><strong>Receptionist clock-in</strong><small>Manager export ready</small></article>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="workflows">
        <p className="eyebrow">Web clinic setup</p>
        <h2>From logo upload to AI receptionist playbook</h2>
        <div className="cards">
          {clinicSetupSteps.map((step) => (
            <article className="card" key={step.title}>
              <span>Setup</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <small>Output: {step.output}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Core capabilities</p>
        <div className="feature-grid">
          {features.map((feature) => <article key={feature}>{feature}</article>)}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Reception workflows</p>
        <h2>Built around how Canadian dental offices actually run</h2>
        <div className="workflow-list">
          {receptionWorkflows.map((workflow) => (
            <article className="workflow-row" key={`${workflow.channel}-${workflow.intent}`}>
              <span>{workflow.channel.replace('_', ' ').toUpperCase()}</span>
              <strong>{workflow.title}</strong>
              <p>{workflow.aiAction}</p>
              <small>{workflow.staffApproval} · {workflow.safetyNote}</small>
            </article>
          ))}
        </div>
      </section>

      <AgentCommandPanel />

      <section className="section">
        <p className="eyebrow">Dental form library</p>
        <div className="cards">
          {formTemplates.map((template) => (
            <article className="card" key={template.name}>
              <span>{template.category}</span>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <small>{template.aiActions.join(' · ')}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Integrations</p>
        <div className="cards">
          {integrationStatuses.map((integration) => (
            <article className="card" key={integration.name}>
              <span>{integration.status.replace('_', ' ')}</span>
              <h3>{integration.name}</h3>
              <p>{integration.purpose}</p>
              <small>{integration.boundary}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
