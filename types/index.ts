// Tipos centrales del dominio de Nubeletech 2.0.
// Reflejan la forma de los datos mock usados en la demo (ver /demo/index.html)
// y son el contrato que luego consumirá la capa real de datos (Supabase, etc.).

export type EstadoOportunidad =
  | "Por revisar" // recién ingestada por un conector automático, aún sin validar
  | "Abierta"
  | "Cierra pronto"
  | "Próxima"
  | "Cerrada";

export interface Oportunidad {
  id: string;
  titulo: string;
  entidad: string;
  categoria: string;
  pais: string;
  montoMin: number;
  montoMax: number;
  moneda: string;
  apertura: string; // ISO date
  cierre: string; // ISO date
  estado: EstadoOportunidad;
  descripcion: string;
  requisitos: string[];
  fuenteUrl?: string;
  /** Id del conector que la trajo (p. ej. "grants.gov", "secop"). Ausente = capturada manualmente. */
  fuente?: string;
}

export type EstadoConvocatoria =
  | "Explorando"
  | "En preparación"
  | "En revisión"
  | "Enviada"
  | "En evaluación"
  | "Ganada"
  | "Rechazada";

export interface MiembroEquipo {
  id: string;
  nombre: string;
  rol: string;
  avatarColor?: string;
}

export interface TareaConvocatoria {
  id: string;
  titulo: string;
  responsableId?: string;
  fechaLimite?: string;
  completada: boolean;
}

export interface ItemChecklist {
  id: string;
  titulo: string;
  estado: "Pendiente" | "En progreso" | "Completado";
}

export interface DocumentoConvocatoria {
  id: string;
  nombre: string;
  tipo: string;
  version: number;
  actualizadoEn: string;
}

export interface RubroPresupuesto {
  id: string;
  categoria: string;
  monto: number;
  moneda: string;
}

export interface EventoHistorial {
  id: string;
  fecha: string;
  descripcion: string;
  autor?: string;
}

export interface Convocatoria {
  id: string;
  oportunidadId: string;
  titulo: string;
  entidad: string;
  estado: EstadoConvocatoria;
  progreso: number; // 0-100, fuente única de verdad para el anillo de progreso
  fechaLimite: string;
  equipo: MiembroEquipo[];
  tareas: TareaConvocatoria[];
  checklist: ItemChecklist[];
  documentos: DocumentoConvocatoria[];
  presupuesto: RubroPresupuesto[];
  historial: EventoHistorial[];
}

export interface AgenteIA {
  id: string;
  nombre: string;
  especialidad: string;
  descripcion: string;
  icono?: string;
}

export type CanalNotificacion = "sistema" | "recordatorio" | "ia" | "equipo";

export interface Notificacion {
  id: string;
  canal: CanalNotificacion;
  titulo: string;
  detalle: string;
  fecha: string;
  leida: boolean;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: "Admin" | "Editor" | "Miembro" | "Visor";
  activo: boolean;
}

export interface Plan {
  id: string;
  nombre: string;
  precioMensual: number;
  limiteConvocatorias: number;
  caracteristicas: string[];
}
