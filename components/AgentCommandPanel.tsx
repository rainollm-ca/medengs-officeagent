'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AgentTask, ClinicRole } from '../lib/domain';

const commands: Array<Pick<AgentTask, 'title' | 'ownerRole' | 'priority' | 'patientChart'>> = [
  {
    title: 'New patient call: capture reason, insurance, preferred times, then queue callback + intake link',
    ownerRole: 'receptionist',
    priority: 'high',
  },
  {
    title: 'WhatsApp opt-in: prepare secure medical-history link with minimal PHI-safe message',
    ownerRole: 'manager',
    priority: 'medium',
  },
  {
    title: 'Emergency pain/swelling call: ask approved red-flag questions and escalate same-day task',
    ownerRole: 'clinician',
    priority: 'high',
    patientChart: 'P-1027',
  },
  {
    title: 'Staff clock-in: record receptionist start time, break plan, and opening checklist',
    ownerRole: 'receptionist',
    priority: 'medium',
  },
];

type ReviewTask = AgentTask & {
  id: string;
  status: 'queued_for_staff_review';
  requiresHumanApproval: boolean;
  createdAt: string;
};

type TaskApiResponse = {
  tasks?: ReviewTask[];
  task?: ReviewTask;
  error?: { message: string };
};

const roleLabels: Record<ClinicRole, string> = {
  owner: 'Owner',
  manager: 'Manager',
  receptionist: 'Reception',
  clinician: 'Clinician',
  auditor: 'Auditor',
};

export function AgentCommandPanel() {
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [selectedCommand, setSelectedCommand] = useState(commands[0]);
  const [customTitle, setCustomTitle] = useState(commands[0].title);
  const [ownerRole, setOwnerRole] = useState<ClinicRole>(commands[0].ownerRole);
  const [patientChart, setPatientChart] = useState(commands[0].patientChart ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetch('/api/agent/tasks')
      .then(async (response) => response.json() as Promise<TaskApiResponse>)
      .then((data) => {
        if (isMounted && data.tasks) setTasks(data.tasks);
      })
      .catch(() => {
        if (isMounted) setMessage('Demo task queue is unavailable right now.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const queuedCount = useMemo(() => tasks.length, [tasks.length]);

  function chooseCommand(command: typeof commands[number]) {
    setSelectedCommand(command);
    setCustomTitle(command.title);
    setOwnerRole(command.ownerRole);
    setPatientChart(command.patientChart ?? '');
    setMessage('');
  }

  async function queueTask() {
    setIsSubmitting(true);
    setMessage('');

    const payload = {
      title: customTitle,
      ownerRole,
      priority: selectedCommand.priority,
      patientChart: patientChart.trim() || undefined,
      requiresHumanApproval: true,
    };

    try {
      const response = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json() as TaskApiResponse;

      if (!response.ok || !data.task) {
        setMessage(data.error?.message ?? 'Could not queue that task.');
        return;
      }

      setTasks((current) => [data.task as ReviewTask, ...current]);
      setMessage('Queued for staff review. No patient message or file action will run until approved.');
    } catch {
      setMessage('Could not reach the demo task API.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel command-panel">
      <div>
        <p className="eyebrow">Flowgent command mode</p>
        <h2>Receptionist-first AI, always queued for review</h2>
        <p>
          Every command maps to auditable clinic tools: calls, WhatsApp drafts, patient links,
          documents, employee admin, insurance prep, and staff approval gates.
        </p>
        <div className="task-composer" aria-label="Create staff-review task">
          <label htmlFor="agent-task-title">Task to queue</label>
          <textarea
            id="agent-task-title"
            value={customTitle}
            onChange={(event) => setCustomTitle(event.target.value)}
            rows={3}
          />
          <div className="form-row">
            <label htmlFor="agent-task-role">Owner</label>
            <select
              id="agent-task-role"
              value={ownerRole}
              onChange={(event) => setOwnerRole(event.target.value as ClinicRole)}
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <label htmlFor="agent-task-chart">Chart</label>
            <input
              id="agent-task-chart"
              value={patientChart}
              onChange={(event) => setPatientChart(event.target.value.toUpperCase())}
              placeholder="Optional, e.g. P-1027"
            />
          </div>
          <button className="primary action-button" type="button" onClick={queueTask} disabled={isSubmitting}>
            {isSubmitting ? 'Queueing…' : 'Queue for staff review'}
          </button>
          {message ? <p className="status-note" role="status">{message}</p> : null}
        </div>
      </div>
      <div className="command-box">
        <span>Try:</span>
        {commands.map((command) => (
          <button key={command.title} type="button" onClick={() => chooseCommand(command)}>
            {command.title}
          </button>
        ))}
        <div className="queued-tasks" aria-live="polite">
          <strong>{queuedCount} task{queuedCount === 1 ? '' : 's'} queued for review</strong>
          {tasks.slice(0, 4).map((task) => (
            <article key={task.id}>
              <span>{task.priority.toUpperCase()} · {roleLabels[task.ownerRole]}</span>
              <p>{task.title}</p>
              <small>{task.patientChart ? `${task.patientChart} · ` : ''}Human approval required</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
