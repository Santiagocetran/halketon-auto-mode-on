import Link from "next/link";
import { getDashboardSummary, mockTasks } from "@/lib/mock-data";

export default function DashboardPage() {
  const summary = getDashboardSummary(mockTasks);

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Operational Memory</p>
          <h1>Dashboard</h1>
        </div>
        <nav className="nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/tasks">Tareas</Link>
          <Link href="/meetings">Reuniones</Link>
        </nav>
      </header>

      <section className="metrics-grid" aria-label="Metricas principales">
        <Metric label="Tareas abiertas" value={summary.open} />
        <Metric label="Vencidas" value={summary.overdue} tone="danger" />
        <Metric label="Sin responsable" value={summary.unowned} />
        <Metric label="Esta semana" value={summary.dueThisWeek} />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel__header">
            <h2>Carga por persona</h2>
            <span>{summary.loadByOwner.length} personas</span>
          </div>
          <div className="load-list">
            {summary.loadByOwner.map((owner) => (
              <div className="load-row" key={owner.name}>
                <div>
                  <strong>{owner.name}</strong>
                  <span>{owner.overdue} vencidas</span>
                </div>
                <div className="bar" aria-hidden="true">
                  <span style={{ width: `${Math.min(owner.total * 12, 100)}%` }} />
                </div>
                <b>{owner.total}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <h2>Riesgo inmediato</h2>
            <span>Proximos 7 dias</span>
          </div>
          <div className="task-list compact">
            {summary.riskTasks.map((task) => (
              <article className="task-row" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.ownerName ?? "Sin responsable"} · {task.dueDate}</span>
                </div>
                <StatusPill status={task.status} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  tone = "default"
}: {
  label: string;
  value: number;
  tone?: "default" | "danger";
}) {
  return (
    <div className={`metric metric--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return <span className={`status status--${status}`}>{status.replace("_", " ")}</span>;
}
