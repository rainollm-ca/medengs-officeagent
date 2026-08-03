import Link from 'next/link';
import { getProfileReadiness } from '../../lib/clinic-profile';
import { readClinicProfile } from '../../lib/clinic-profile-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function SetupPage() {
  const { profile, persistence } = readClinicProfile('smile-north-dental');
  const readiness = getProfileReadiness(profile);
  const enabledChannels = profile.channels.filter((channel) => channel.enabled);
  const enabledWorkflows = profile.workflows.filter((workflow) => workflow.enabled);

  return (
    <main className="dashboard">
      <nav>
        <Link href="/" className="brand"><span className="brand-mark">F</span> Flowgent by MedEngs</Link>
        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/pilot">Pilot</a>
          <a href="/clinical-notes">Notes</a>
        </div>
      </nav>

      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Clinic operating profile</p>
          <h1>One setup file powers every dental workflow.</h1>
          <p className="lead">
            This profile becomes the source for greetings, forms, phone scripts, WhatsApp boundaries,
            staff approvals, hours, languages, and pilot readiness.
          </p>
        </div>
        <div className="stats-row">
          <div className="stat stat-good"><span>Channels</span><strong>{readiness.enabledChannelCount}</strong></div>
          <div className="stat stat-good"><span>Workflows</span><strong>{readiness.enabledWorkflowCount}</strong></div>
          <div className="stat stat-warn"><span>Blockers</span><strong>{readiness.blockers.length}</strong></div>
          <div className={persistence.durable ? 'stat stat-good' : 'stat stat-warn'}>
            <span>Profile</span>
            <strong>{persistence.durable ? 'Saved' : 'Default'}</strong>
          </div>
        </div>
      </header>

      <section className="dashboard-grid compact-grid">
        <article className="panel">
          <p className="eyebrow">Identity</p>
          <h2>{profile.identity.name}</h2>
          <div className="setup-fields">
            <span>Slug</span><strong>{profile.identity.slug}</strong>
            <span>Phone</span><strong>{profile.identity.primaryPhone}</strong>
            <span>Email</span><strong>{profile.identity.contactEmail}</strong>
            <span>Timezone</span><strong>{profile.identity.timezone}</strong>
            <span>Languages</span><strong>{profile.identity.languages.join(', ')}</strong>
            <span>Tenant</span><strong>{persistence.tenantSlug}</strong>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Approval policy</p>
          <h2>Human authority stays explicit</h2>
          <div className="setup-fields">
            <span>Patient messages</span><strong>{profile.approvalPolicy.patientMessages.replace('_', ' ')}</strong>
            <span>Clinical notes</span><strong>{profile.approvalPolicy.clinicalNotes.replace('_', ' ')}</strong>
            <span>PMS writes</span><strong>{profile.approvalPolicy.pmsWrites}</strong>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <p className="eyebrow">Enabled channels</p>
          <h2>Reception inputs</h2>
          {enabledChannels.map((channel) => (
            <div className="audit-row" key={channel.key}>
              <span>{channel.status.replace('_', ' ')}</span>
              <strong>{channel.label}</strong>
              <em>{channel.key.replace('_', ' ')}</em>
            </div>
          ))}
        </article>

        <article className="panel">
          <p className="eyebrow">Enabled workflows</p>
          <h2>What the clinic can sell first</h2>
          {enabledWorkflows.map((workflow) => (
            <div className="audit-row" key={workflow.key}>
              <span>{workflow.ownerRole}</span>
              <strong>{workflow.label}</strong>
              <em>{workflow.key.replaceAll('_', ' ')}</em>
            </div>
          ))}
        </article>

        <article className="panel wide">
          <p className="eyebrow">Pilot blockers</p>
          <h2>Do these before using real clinic data</h2>
          <div className="boundary-list">
            {readiness.blockers.map((blocker) => (
              <span key={blocker}>{blocker}</span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
