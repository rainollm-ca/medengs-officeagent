type StatCardProps = {
  label: string;
  value: string;
  tone?: 'default' | 'good' | 'warn';
};

export function StatCard({ label, value, tone = 'default' }: StatCardProps) {
  return (
    <div className={`stat stat-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
