import Link from "next/link";
import { mockTasks } from "@/lib/mock-data";

export default function TasksPage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Task Capture</p>
          <h1>Tareas</h1>
        </div>
        <nav className="nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/tasks">Tareas</Link>
          <Link href="/meetings">Reuniones</Link>
        </nav>
      </header>

      <section className="panel">
        <div className="panel__header">
          <h2>Compromisos detectados</h2>
          <span>{mockTasks.length} registros</span>
        </div>
        <div className="table">
          <div className="table__head">
            <span>Tarea</span>
            <span>Responsable</span>
            <span>Fecha</span>
            <span>Estado</span>
            <span>Conf.</span>
          </div>
          {mockTasks.map((task) => (
            <div className="table__row" key={task.id}>
              <span>{task.title}</span>
              <span>{task.ownerName ?? "Sin dueno"}</span>
              <span>{task.dueDate ?? "-"}</span>
              <span>{task.status.replace("_", " ")}</span>
              <span>{Math.round(task.confidence * 100)}%</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

