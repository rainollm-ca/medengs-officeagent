const commands = [
  'Send new patient package to patient P-1027',
  'Convert this uploaded paper form to a branded digital form',
  'Create implant consent link and route PDF to reception@clinic.ca',
  'Show important communications and follow-ups due today',
];

export function AgentCommandPanel() {
  return (
    <section className="panel command-panel">
      <div>
        <p className="eyebrow">OfficeAgent command mode</p>
        <h2>Task-focused AI, not generic chat</h2>
        <p>
          Every command maps to auditable clinic tools: forms, PDFs, cloud files, patient links,
          follow-ups, and staff approval gates.
        </p>
      </div>
      <div className="command-box">
        <span>Try:</span>
        {commands.map((command) => (
          <button key={command}>{command}</button>
        ))}
      </div>
    </section>
  );
}
