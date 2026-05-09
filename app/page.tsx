import Link from 'next/link';
import { AgentCommandPanel } from '../components/AgentCommandPanel';
import { StatCard } from '../components/StatCard';
import { formTemplates } from '../lib/sample-data';

const features = [
  'Clinic account memory: logo, forms, staff roles, policies, routing emails',
  'AI-generated and AI-refined dental forms with branded PDF output',
  'Secure patient links scoped to one task with expiry and approval controls',
  'Patient admin index with tasks, flags, follow-ups, and file references',
  'Clinic-owned cloud storage through Google Drive, OneDrive, SharePoint, or S3',
  'Canadian privacy posture: PHIPA/PIPEDA-conscious, audit logs, no AI training',
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <nav>
          <div className="brand">MedEngs OfficeAgent</div>
          <Link href="/dashboard">View demo dashboard</Link>
        </nav>
        <div className="hero-grid">
          <div>
            <p className="eyebrow">AI back office for dental clinics</p>
            <h1>Forms, PDFs, patient links, cloud files, and follow-ups — under one clinic account.</h1>
            <p className="lead">
              A comprehensive dental office AI agent that does real admin work beyond ChatGPT:
              generates and refines forms, edits branded PDFs, remembers patient admin context,
              flags important communications, and stores files safely in clinic-controlled cloud storage.
            </p>
            <div className="cta-row">
              <Link className="primary" href="/dashboard">Open MVP demo</Link>
              <Link className="secondary" href="/dashboard">See workflow</Link>
            </div>
          </div>
          <div className="hero-card">
            <StatCard label="MVP wedge" value="AI forms + PDFs" tone="good" />
            <StatCard label="Launch model" value="PMS-agnostic" />
            <StatCard label="Clinic data" value="Cloud-owned" tone="warn" />
          </div>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Core capabilities</p>
        <div className="feature-grid">
          {features.map((feature) => <article key={feature}>{feature}</article>)}
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
    </main>
  );
}
