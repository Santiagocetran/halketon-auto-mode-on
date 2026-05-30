import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell landing">
      <section className="landing__panel">
        <p className="eyebrow">Halketon Track 1</p>
        <h1>Memoria operativa sobre WhatsApp</h1>
        <p>
          Un dashboard simple para convertir compromisos cotidianos en tareas,
          vencimientos y seguimiento visible para direccion.
        </p>
        <Link className="primary-link" href="/dashboard">
          Abrir dashboard
        </Link>
      </section>
    </main>
  );
}

