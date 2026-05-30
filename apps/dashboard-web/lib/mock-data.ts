export type TaskStatus = "pending" | "in_progress" | "blocked" | "done" | "cancelled";
export type TaskPriority = "low" | "normal" | "high" | "urgent";

export type Task = {
  id: string;
  ownerName: string | null;
  title: string;
  description: string;
  dueDate: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  confidence: number;
  source: "whatsapp" | "meeting";
};

export const mockTasks: Task[] = [
  {
    id: "task-1",
    ownerName: "Mateo",
    title: "Preparar informe",
    description: "Informe de avance para direccion.",
    dueDate: "2026-06-12",
    status: "pending",
    priority: "high",
    confidence: 0.94,
    source: "whatsapp"
  },
  {
    id: "task-2",
    ownerName: "Lucia",
    title: "Coordinar sponsors",
    description: "Cerrar lista de sponsors y confirmar contactos.",
    dueDate: "2026-06-09",
    status: "in_progress",
    priority: "normal",
    confidence: 0.89,
    source: "whatsapp"
  },
  {
    id: "task-3",
    ownerName: "Agus",
    title: "Resolver proveedor del salon",
    description: "Desbloquear confirmacion del proveedor.",
    dueDate: "2026-06-05",
    status: "blocked",
    priority: "urgent",
    confidence: 0.81,
    source: "whatsapp"
  },
  {
    id: "task-4",
    ownerName: "Mateo",
    title: "Enviar propuesta",
    description: "Mandar propuesta final del demo.",
    dueDate: "2026-06-04",
    status: "pending",
    priority: "high",
    confidence: 0.91,
    source: "meeting"
  },
  {
    id: "task-5",
    ownerName: null,
    title: "Confirmar responsables de mesa",
    description: "Falta asignar responsable.",
    dueDate: "2026-06-11",
    status: "pending",
    priority: "normal",
    confidence: 0.67,
    source: "meeting"
  }
];

export const mockMeetings = [
  {
    id: "meeting-1",
    title: "Demo planning",
    date: "2026-06-06",
    summary:
      "Se definieron compromisos para propuesta, proveedor, sponsors y revision del dashboard.",
    tasks: ["Enviar propuesta", "Coordinar proveedor", "Revisar dashboard"]
  },
  {
    id: "meeting-2",
    title: "Validacion ONG piloto",
    date: "2026-06-07",
    summary:
      "El flujo de WhatsApp queda como entrada primaria y el dashboard se valida con direccion.",
    tasks: ["Preparar mensajes de prueba", "Ajustar campos minimos", "Definir seguimiento"]
  }
];

export function getDashboardSummary(tasks: Task[]) {
  const today = new Date("2026-06-06T00:00:00-03:00");
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);

  const openTasks = tasks.filter((task) => !["done", "cancelled"].includes(task.status));
  const overdueTasks = openTasks.filter((task) => {
    if (!task.dueDate) return false;
    return new Date(`${task.dueDate}T00:00:00-03:00`) < today;
  });

  const dueThisWeek = openTasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(`${task.dueDate}T00:00:00-03:00`);
    return due >= today && due <= weekEnd;
  });

  const ownerMap = new Map<string, { name: string; total: number; overdue: number }>();

  for (const task of openTasks) {
    const name = task.ownerName ?? "Sin responsable";
    const current = ownerMap.get(name) ?? { name, total: 0, overdue: 0 };
    current.total += 1;
    if (overdueTasks.some((overdue) => overdue.id === task.id)) {
      current.overdue += 1;
    }
    ownerMap.set(name, current);
  }

  return {
    open: openTasks.length,
    overdue: overdueTasks.length,
    unowned: openTasks.filter((task) => !task.ownerName).length,
    dueThisWeek: dueThisWeek.length,
    loadByOwner: Array.from(ownerMap.values()).sort((a, b) => b.total - a.total),
    riskTasks: [...overdueTasks, ...dueThisWeek].slice(0, 5)
  };
}
