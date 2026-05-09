import Link from 'next/link';
import { AgentCommandPanel } from '../../components/AgentCommandPanel';
import { StatCard } from '../../components/StatCard';
import { getReadinessChecks, summarizeReadiness } from '../../lib/production-readiness';
import { agentTasks, auditEvents, patients } from '../../lib/sample-data';

export default function DashboardPage() {
  const readinessChecks = getReadinessChecks();
  const readiness = summarizeReadiness(readinessChecks);

  return (
    <main className="dashboard">
      <nav>
        <Link href="/" className="brand">MedEngs OfficeAgent</Link>
        <span>Smile North Dental · Pro plan</span>
      </nav>

      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Clinic inbox</p>
          <h1>Today’s forms, patient flags, and follow-ups</h1>
        </div>
        <div className="stats-row">
          <StatCard label="Incomplete forms" value="7" tone="warn" />
          <StatCard label="Important flags" value="3" tone="warn" />
          <StatCard label="PDFs routed" value="18" tone="good" />
        </div>
      </header>

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
