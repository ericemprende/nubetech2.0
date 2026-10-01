import type { Oportunidad } from "@/types";
import type { SourceConnector } from "./types";
import { pick, pickNumber } from "./normalize";

/**
 * Conector de GlobalGiving (proyectos/campañas de ONGs que buscan financiamiento).
 * API pública con registro de desarrollador gratuito.
 * https://www.globalgiving.org/api/
 *
 * Endpoint y autenticación confirmados:
 * GET https://api.globalgiving.org/api/public/projectservice/all/projects?api_key=...
 * Header "Accept: application/json" para pedir JSON (por defecto puede devolver XML).
 *
 * Requiere una API key gratuita — registrarse en https://www.globalgiving.org/api/
 * y configurar GLOBALGIVING_API_KEY en el entorno. Sin esa variable, el
 * conector lanza un error explicativo en vez de fallar en silencio.
 *
 * IMPORTANTE: no se pudo confirmar el esquema exacto de un proyecto en la
 * respuesta desde este entorno (sin salida de red). El mapeo de abajo usa los
 * nombres de campo públicamente documentados en el pasado para esta API
 * (title, summary, organization.name, goal, url, id) con fallbacks
 * defensivos — revisar con una respuesta real antes de confiar en producción.
 * Además, GlobalGiving es más "financiamiento vía donaciones/crowdfunding de
 * ONGs" que "convocatorias" en el sentido clásico — es un complemento, no la
 * fuente principal.
 */

const PROJECTS_URL = "https://api.globalgiving.org/api/public/projectservice/all/projects";

export const globalGivingConnector: SourceConnector = {
  id: "globalgiving",
  nombre: "GlobalGiving",
  async fetchOportunidades() {
    return fetchGlobalGiving();
  },
};

export async function fetchGlobalGiving(): Promise<Oportunidad[]> {
  const apiKey = process.env.GLOBALGIVING_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta GLOBALGIVING_API_KEY en el entorno. Registrarse gratis en https://www.globalgiving.org/api/ para obtener una."
    );
  }

  const url = new URL(PROJECTS_URL);
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GlobalGiving respondió ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const proyectos: Record<string, unknown>[] = json?.projects?.project ?? [];

  return proyectos.map(mapOportunidad);
}

function mapOportunidad(p: Record<string, unknown>): Oportunidad {
  const id = pick(p, ["id"]);
  const organizacion =
    typeof p.organization === "object" && p.organization !== null
      ? pick(p.organization as Record<string, unknown>, ["name"])
      : pick(p, ["organizationName"]);

  return {
    id: `globalgiving:${id || pick(p, ["title"])}`,
    titulo: pick(p, ["title"], "Proyecto en GlobalGiving"),
    entidad: organizacion || "ONG en GlobalGiving",
    categoria: "Financiamiento vía crowdfunding (ONG)",
    pais: pick(p, ["countryName", "country"], "Internacional"),
    montoMin: 0,
    montoMax: pickNumber(p, ["goal", "funding"]),
    moneda: "USD",
    apertura: "",
    cierre: "",
    estado: "Por revisar",
    descripcion: pick(p, ["summary"], "Ver detalle completo en GlobalGiving."),
    requisitos: [],
    fuenteUrl: id ? `https://www.globalgiving.org/projects/${id}/` : "https://www.globalgiving.org/",
    fuente: "globalgiving",
  };
}
