// Datos de ejemplo (mock) para desarrollar la UI sin backend real.
// Reemplazar por llamadas reales (Supabase/PostgreSQL) cuando el backend esté listo.
// Un conjunto más completo de ejemplos vive en /demo/index.html; este archivo
// arranca con un subconjunto representativo para cada tipo definido en types/index.ts.

import type {
  Oportunidad,
  Convocatoria,
  AgenteIA,
  Notificacion,
  Usuario,
  Plan,
} from "@/types";

export const OPORTUNIDADES: Oportunidad[] = [
  {
    id: "op1",
    titulo: "Fondo de Innovación Tecnológica para PyMEs",
    entidad: "Banco Interamericano de Desarrollo",
    categoria: "Innovación",
    pais: "Regional (LatAm)",
    montoMin: 20000,
    montoMax: 150000,
    moneda: "USD",
    apertura: "2026-03-01",
    cierre: "2026-11-30",
    estado: "Abierta",
    descripcion:
      "Financiamiento no reembolsable para proyectos de innovación tecnológica liderados por pequeñas y medianas empresas.",
    requisitos: ["PyME constituida", "Mínimo 2 años de operación", "Plan de innovación"],
  },
  {
    id: "op2",
    titulo: "Convocatoria de Economía Circular",
    entidad: "Ministerio de Ambiente",
    categoria: "Sostenibilidad",
    pais: "Colombia",
    montoMin: 10000,
    montoMax: 60000,
    moneda: "USD",
    apertura: "2026-05-01",
    cierre: "2026-12-15",
    estado: "Abierta",
    descripcion:
      "Apoyo a iniciativas que reduzcan residuos y promuevan modelos de economía circular.",
    requisitos: ["Persona jurídica", "Diagnóstico ambiental"],
  },
  {
    id: "op3",
    titulo: "BID Lab — Soluciones de Bajo Costo para Zonas Rurales",
    entidad: "BID Lab",
    categoria: "Inclusión",
    pais: "Regional (LatAm)",
    montoMin: 30000,
    montoMax: 200000,
    moneda: "USD",
    apertura: "2026-04-10",
    cierre: "2026-08-12",
    estado: "Cierra pronto",
    descripcion:
      "Financiamiento para soluciones tecnológicas de bajo costo dirigidas a comunidades rurales.",
    requisitos: ["Prototipo funcional", "Modelo de impacto social"],
  },
];

export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: "conv1",
    oportunidadId: "op3",
    titulo: "Lentes Inteligentes de Bajo Costo para Zonas Rurales",
    entidad: "BID Lab",
    estado: "En preparación",
    progreso: 62,
    fechaLimite: "2026-08-12",
    equipo: [
      { id: "u1", nombre: "Erick Prende", rol: "Líder de proyecto" },
      { id: "u2", nombre: "Ana Torres", rol: "Ingeniera" },
    ],
    tareas: [
      { id: "t1", titulo: "Redactar resumen ejecutivo", completada: true },
      { id: "t2", titulo: "Adjuntar cartas de respaldo", completada: false },
    ],
    checklist: [
      { id: "c1", titulo: "Formulario técnico", estado: "Completado" },
      { id: "c2", titulo: "Presupuesto detallado", estado: "En progreso" },
      { id: "c3", titulo: "Anexos legales", estado: "Pendiente" },
    ],
    documentos: [
      { id: "d1", nombre: "Propuesta técnica.pdf", tipo: "PDF", version: 3, actualizadoEn: "2026-07-01" },
    ],
    presupuesto: [
      { id: "p1", categoria: "Personal", monto: 40000, moneda: "USD" },
      { id: "p2", categoria: "Equipos", monto: 25000, moneda: "USD" },
    ],
    historial: [
      { id: "h1", fecha: "2026-06-15", descripcion: "Proyecto creado", autor: "Erick Prende" },
    ],
  },
];

export const AGENTES: AgenteIA[] = [
  {
    id: "a1",
    nombre: "Redactor de Propuestas",
    especialidad: "Redacción técnica",
    descripcion: "Ayuda a estructurar y redactar secciones clave de la propuesta.",
  },
  {
    id: "a2",
    nombre: "Analista de Presupuesto",
    especialidad: "Finanzas",
    descripcion: "Revisa la coherencia y razonabilidad del presupuesto presentado.",
  },
  {
    id: "a3",
    nombre: "Evaluador de Impacto",
    especialidad: "Evaluación",
    descripcion: "Estima la probabilidad de éxito según criterios históricos de la convocatoria.",
  },
];

export const NOTIFICACIONES: Notificacion[] = [
  {
    id: "n1",
    canal: "recordatorio",
    titulo: "Cierre próximo",
    detalle: "La convocatoria BID Lab cierra en 15 días.",
    fecha: "2026-07-28",
    leida: false,
  },
];

export const USUARIOS: Usuario[] = [
  { id: "u1", nombre: "Erick Prende", email: "ericemprende@gmail.com", rol: "Admin", activo: true },
];

export const PLANES: Plan[] = [
  {
    id: "free",
    nombre: "Gratis",
    precioMensual: 0,
    limiteConvocatorias: 2,
    caracteristicas: ["2 convocatorias activas", "1 usuario", "Soporte por comunidad"],
  },
  {
    id: "pro",
    nombre: "Pro",
    precioMensual: 49,
    limiteConvocatorias: 20,
    caracteristicas: ["20 convocatorias activas", "5 usuarios", "Agentes IA ilimitados", "Soporte prioritario"],
  },
];
