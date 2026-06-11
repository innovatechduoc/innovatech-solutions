// lib/utils.ts (o app/utils.ts)

export const normalizeStatus = (status: string) => {
  if (status === "Completado") return "Finalizado";
  if (status === "En Tiempo" || status === "Riesgo Leve") return "En Progreso";
  if (
    status === "Planificación" ||
    status === "En Progreso" ||
    status === "Finalizado"
  ) {
    return status;
  }
  return "Planificación";
};

export const calcularProgreso = (estado: string) => {
  const estadoNormalizado = normalizeStatus(estado);
  if (estadoNormalizado === "Planificación") return 0;
  if (estadoNormalizado === "En Progreso") return 50;
  if (estadoNormalizado === "Finalizado") return 100;
  return 0;
};

export const getInitials = (email: string | null) => {
  if (!email) return "US";
  let s = email.trim();
  if (s.includes("@")) {
    s = s.split("@")[0].replace(/[._]/g, " ");
  }
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "US";
  return parts
    .map((p) => p[0].toUpperCase())
    .join("")
    .slice(0, 2);
};
