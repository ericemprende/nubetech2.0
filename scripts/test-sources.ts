// Prueba de humo (sin red real) para los conectores de lib/sources.
// Mockea global.fetch con respuestas de ejemplo fieles a la documentación
// oficial de cada API (ver comentarios en cada archivo de conector para las
// fuentes) y valida que la normalización a `Oportunidad` produce campos
// sensatos. Esto NO reemplaza probar contra las APIs reales (bloqueadas
// desde este entorno de desarrollo) — correr `npm run test:sources` de nuevo
// una vez desplegado o en una máquina con salida de red abierta.
//
// Uso: npx tsx scripts/test-sources.ts

import assert from "node:assert/strict";
import { fetchGrantsGov } from "../lib/sources/grants-gov";
import { fetchSecop } from "../lib/sources/secop";
import { fetchTed } from "../lib/sources/ted";
import { fetchIadb } from "../lib/sources/iadb";
import { fetchGlobalGiving } from "../lib/sources/globalgiving";
import { deduplicarOportunidades } from "../lib/sources/dedupe";

type FetchMock = (url: string, init?: RequestInit) => Promise<Response>;

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Error",
    json: async () => body,
  } as Response;
}

async function conMockFetch(mock: FetchMock, run: () => Promise<void>) {
  const original = global.fetch;
  // @ts-expect-error -- sustitución deliberada para la prueba
  global.fetch = mock;
  try {
    await run();
  } finally {
    global.fetch = original;
  }
}

let pruebas = 0;
function ok(nombre: string) {
  pruebas++;
  console.log(`  ✓ ${nombre}`);
}

async function testGrantsGov() {
  console.log("Grants.gov");
  await conMockFetch(
    async () =>
      jsonResponse({
        errorcode: 0,
        msg: "Webservice Succeeds",
        data: {
          hitCount: 1,
          oppHits: [
            {
              id: "219999",
              number: "TEST-ABC-20231011-OPP1",
              title: "Fondo de prueba para innovación rural",
              agencyCode: "HHS",
              agencyName: "Health & Human Services",
              openDate: "10/11/2023",
              closeDate: "12/01/2026",
              oppStatus: "posted",
              docType: "synopsis",
            },
          ],
        },
      }),
    async () => {
      const oportunidades = await fetchGrantsGov();
      assert.equal(oportunidades.length, 1);
      const [op] = oportunidades;
      assert.equal(op.id, "grantsgov:219999");
      assert.equal(op.estado, "Abierta");
      assert.equal(op.apertura, "2023-10-11");
      assert.equal(op.cierre, "2026-12-01");
      assert.equal(op.pais, "Estados Unidos");
      ok("mapea oppHits a Oportunidad con fechas ISO y estado correcto");
    }
  );
}

async function testSecop() {
  console.log("SECOP II");
  await conMockFetch(
    async () =>
      jsonResponse([
        {
          id_del_proceso: "CO1.BDOS.1234567",
          nombre_entidad: "Alcaldía de Bogotá",
          descripci_n_del_procedimiento: "Suministro de equipos tecnológicos",
          fecha_de_publicacion_del: "2026-06-01T00:00:00.000",
          fecha_de_recepcion_de: "2026-07-15T00:00:00.000",
          precio_base: "150000000",
          estado_del_procedimiento: "Convocada",
          urlproceso: "https://www.secop.gov.co/proceso/123",
        },
      ]),
    async () => {
      const oportunidades = await fetchSecop();
      assert.equal(oportunidades.length, 1);
      const [op] = oportunidades;
      assert.equal(op.entidad, "Alcaldía de Bogotá");
      assert.equal(op.estado, "Abierta");
      assert.equal(op.montoMax, 150000000);
      assert.equal(op.apertura, "2026-06-01");
      ok("mapea una fila de datos.gov.co con los nombres de columna esperados");
    }
  );
}

async function testTed() {
  console.log("TED");
  await conMockFetch(
    async () =>
      jsonResponse({
        notices: [
          {
            "publication-number": "477851-2026",
            "notice-title": { eng: "Servicios de consultoría en IA" },
            "buyer-name": { eng: "Ministerio de Economía" },
            "buyer-country": "DEU",
            "publication-date": "2026-05-01",
            deadline: "2099-01-01", // futura a propósito para probar estado "Abierta"
            "total-value": 500000,
            "total-value-cur": "EUR",
          },
        ],
      }),
    async () => {
      const oportunidades = await fetchTed();
      assert.equal(oportunidades.length, 1);
      const [op] = oportunidades;
      assert.equal(op.titulo, "Servicios de consultoría en IA");
      assert.equal(op.estado, "Abierta");
      assert.equal(op.fuenteUrl, "https://ted.europa.eu/en/notice/-/detail/477851-2026");
      ok("resuelve campos multilingües y calcula estado por fecha límite");
    }
  );
}

async function testIadb() {
  console.log("BID");
  await conMockFetch(
    async () =>
      jsonResponse({
        success: true,
        result: {
          fields: [{ id: "Project Number", type: "text" }],
          records: [
            {
              "Project Number": "CO-L1234",
              "Project Name": "Modernización de transporte urbano",
              Country: "Colombia",
              Sector: "Transporte",
              "Total Cost": "80000000",
              "Approval Date": "2025-03-10",
              "Project Status": "Implementation",
            },
          ],
        },
      }),
    async () => {
      const oportunidades = await fetchIadb();
      assert.equal(oportunidades.length, 1);
      const [op] = oportunidades;
      assert.equal(op.estado, "Por revisar");
      assert.equal(op.pais, "Colombia");
      assert.equal(op.montoMax, 80000000);
      ok("mapea un registro CKAN y siempre lo deja en Por revisar (es histórico, no un llamado abierto)");
    }
  );
}

async function testGlobalGiving() {
  console.log("GlobalGiving");
  process.env.GLOBALGIVING_API_KEY = "dummy-key-para-prueba";
  await conMockFetch(
    async () =>
      jsonResponse({
        projects: {
          project: [
            {
              id: "12345",
              title: "Agua limpia para comunidades rurales",
              summary: "Acceso a agua potable en zonas rurales.",
              organization: { name: "Fundación Agua Para Todos" },
              goal: "25000",
              countryName: "Colombia",
            },
          ],
        },
      }),
    async () => {
      const oportunidades = await fetchGlobalGiving();
      assert.equal(oportunidades.length, 1);
      const [op] = oportunidades;
      assert.equal(op.entidad, "Fundación Agua Para Todos");
      assert.equal(op.montoMax, 25000);
      ok("mapea un proyecto de GlobalGiving usando la api_key del entorno");
    }
  );
}

async function testDedupe() {
  console.log("Deduplicación");
  const base = {
    titulo: "Fondo X",
    entidad: "Entidad Y",
    categoria: "Test",
    pais: "Test",
    montoMin: 0,
    montoMax: 0,
    moneda: "USD",
    apertura: "",
    cierre: "2026-01-01",
    estado: "Abierta" as const,
    descripcion: "",
    requisitos: [],
  };
  const resultado = deduplicarOportunidades([
    { ...base, id: "fuente1:1" },
    { ...base, id: "fuente1:1" }, // mismo id exacto
    { ...base, id: "fuente2:999" }, // id distinto, pero mismo título/entidad/cierre
  ]);
  assert.equal(resultado.length, 1);
  ok("colapsa duplicados por id y por título+entidad+cierre");
}

async function main() {
  await testGrantsGov();
  await testSecop();
  await testTed();
  await testIadb();
  await testGlobalGiving();
  await testDedupe();
  console.log(`\n${pruebas} pruebas OK.`);
}

main().catch((err) => {
  console.error("\n✗ Falló una prueba:", err);
  process.exit(1);
});
