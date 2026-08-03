import Link from 'next/link';
import { AgentCommandPanel } from '../../components/AgentCommandPanel';
import { StatCard } from '../../components/StatCard';
import { getReadinessChecks, summarizeReadiness } from '../../lib/production-readiness';
import { agentTasks, auditEvents, integrationStatuses, patients, receptionWorkflows } from '../../lib/sample-data';

export default function DashboardPage() {
  const readinessChecks = getReadinessChecks();
  const readiness = summarizeReadiness(readinessChecks);

  return (
    <main className="dashboard">
      <nav>
        <Link href="/" className="brand">MedEngs OfficeAgent</Link>
        <a href="/pilot">Pilot offer</a>
        <a href="/setup">Clinic setup</a>
        <a href="/clinical-notes">Dental notes copilot</a>
      </nav>

      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Reception command centre</p>
          <h1>Calls, WhatsApp, forms, documents, time clock, and staff approvals</h1>
        </div>
        <div className="stats-row">
          <StatCard label="First-contact tasks" value="12" tone="warn" />
          <StatCard label="Approval queue" value="5" tone="warn" />
          <StatCard label="Hours saved demo" value="3.2h" tone="good" />
        </div>
      </header>

      <section className="dashboard-grid compact-grid">
        <div className="panel wide">
          <h2>Omnichannel reception queue</h2>
          {receptionWorkflows.map((workflow) => (
            <div className="audit-row" key={`${workflow.channel}-${workflow.intent}`}>
              <span>{workflow.channel.replace('_', ' ')}</span>
              <strong>{workflow.title}</strong>
              <em>{workflow.staffApproval}</em>
            </div>
          ))}
        </div>

        <div className="panel wide">
          <h2>Connected services</h2>
          {integrationStatuses.map((integration) => (
            <div className="audit-row" key={integration.name}>
              <span>{integration.status.replace('_', ' ')}</span>
              <strong>{integration.name}</strong>
              <em>{integration.boundary}</em>
            </div>
          ))}
        </div>
      </section>

      <AgentCommandPanel />

      <section className="dashboard-grid">
        <div className="panel">
          <h2>Patient admin memory</h2>
          {patients.map((patient) => (
            <div className="patient-row" key={patient.chartNumber}>
              <div>
                <strong>{patient.chartNumber} · {patient.name}</strong>
                <span>{patient.contact}</span>
              </div>
              <div className="flag-list">
                {patient.flags.map((flag) => <em className={`flag ${flag.severity}`} key={flag.label}>{flag.label}</em>)}
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>Assigned tasks</h2>
          {agentTasks.map((task) => (
            <div className="task-row" key={task.title}>
              <strong>{task.title}</strong>
              <span>{task.ownerRole} · {task.priority}{task.patientChart ? ` · ${task.patientChart}` : ''}</span>
            </div>
          ))}
        </div>

        <div className="panel wide">
          <h2>Production readiness</h2>
          <p className={`readiness readiness-${readiness.status}`}>Gate status: {readiness.status.toUpperCase()} · {readiness.passed} passing · {readiness.failed} failing</p>
          {readinessChecks.map((check) => (
            <div className="audit-row" key={check.name}>
              <span>{check.status.toUpperCase()}</span>
              <strong>{check.name}</strong>
              <em>{check.detail}</em>
            </div>
          ))}
        </div>

        <div className="panel wide">
          <h2>Audit trail</h2>
          {auditEvents.map((event) => (
            <div className="audit-row" key={`${event.action}-${event.timestamp}`}>
              <span>{event.timestamp}</span>
              <strong>{event.action}</strong>
              <em>{event.actor}{event.patientChart ? ` · ${event.patientChart}` : ''}</em>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
