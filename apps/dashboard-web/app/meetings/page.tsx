import Link from "next/link";
import { mockMeetings } from "@/lib/mock-data";

export default function MeetingsPage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Meeting Memory</p>
          <h1>Reuniones</h1>
        </div>
        <nav className="nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/tasks">Tareas</Link>
          <Link href="/meetings">Reuniones</Link>
        </nav>
      </header>

      <section className="dashboard-grid">
        {mockMeetings.map((meeting) => (
          <article className="panel" key={meeting.id}>
            <div className="panel__header">
              <h2>{meeting.title}</h2>
              <span>{meeting.date}</span>
            </div>
            <p className="panel-copy">{meeting.summary}</p>
            <div className="task-list compact">
              {meeting.tasks.map((task) => (
                <div className="task-row" key={task}>
                  <strong>{task}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

