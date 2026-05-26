import http from "k6/http";
import { sleep, check, group } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";

//  Métricas customizadas 
const tempoResposta    = new Trend("tempo_resposta_ms");
const taxaErros        = new Rate("taxa_erros");
const totalRequisicoes = new Counter("total_requisicoes");

//  URL base (localhost por padrão) 
const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";


export const options = {
  stages: [
    { duration: "30s", target: 5  }, // aquecimento
    { duration: "1m",  target: 20 }, // carga normal
    { duration: "30s", target: 50 }, // subida para o pico
    { duration: "1m",  target: 50 }, // sustentação do pico
    { duration: "30s", target: 0  }, // cool-down
  ],

  // Critérios de aprovação/reprovação do teste
  thresholds: {
    // 95% das requisições devem responder em menos de 500ms
    http_req_duration: ["p(95)<500"],
    // Menos de 1% de erros
    taxa_erros: ["rate<0.01"],
    // Tempo médio menor que 200ms
    tempo_resposta_ms: ["avg<200"],
  },
};

// Cenário executado por cada usuário virtual 
export default function () {

  // Grupo 1: carregamento da página principal
  group("Pagina principal", () => {
    const res = http.get(BASE_URL);

    tempoResposta.add(res.timings.duration);
    totalRequisicoes.add(1);

    const ok = check(res, {
      "status 200":          (r) => r.status === 200,
      "tem titulo MEI":      (r) => r.body.includes("Calculadora MEI"),
      "tem formulario":      (r) => r.body.includes("form-calculadora"),
      "resposta abaixo 500ms": (r) => r.timings.duration < 500,
    });

    taxaErros.add(!ok);
  });

  sleep(1); // pausa entre grupos (simula comportamento humano)

  // Grupo 2: carregamento dos assets estáticos
  group("Assets estaticos", () => {
    const css = http.get(`${BASE_URL}/css/style.css`);
    const js  = http.get(`${BASE_URL}/js/script.js`);

    check(css, {
      "CSS status 200": (r) => r.status === 200,
      "CSS abaixo 200ms": (r) => r.timings.duration < 200,
    });

    check(js, {
      "JS status 200": (r) => r.status === 200,
      "JS abaixo 200ms": (r) => r.timings.duration < 200,
    });

    totalRequisicoes.add(2);
    sleep(0.5);
  });

}

//  Relatório exibido no terminal ao final 
export function handleSummary(data) {
  const p95  = data.metrics.http_req_duration?.values?.["p(95)"];
  const avg  = data.metrics.http_req_duration?.values?.avg;
  const erros = data.metrics.taxa_erros?.values?.rate ?? 0;
  const total = data.metrics.total_requisicoes?.values?.count ?? 0;

  const fmt = (v, unit) =>
    typeof v === "number" ? v.toFixed(1) + unit : "N/A";

  const linha = (label, valor) =>
    `║  ${label.padEnd(24)}${valor.padEnd(20)}║`;

  const aprovado = erros < 0.01 && p95 < 500;

  return {
    "k6/resultado.json": JSON.stringify(data, null, 2),
    stdout: `
╔══════════════════════════════════════════════╗
║       RESULTADO — TESTE DE CARGA MEI         ║
╠══════════════════════════════════════════════╣
${linha("Total de requisições:", String(total))}
${linha("Tempo médio (avg):", fmt(avg, "ms"))}
${linha("Percentil 95 (p95):", fmt(p95, "ms"))}
${linha("Taxa de erros:", fmt(erros * 100, "%"))}
╠══════════════════════════════════════════════╣
║  Resultado: ${aprovado ? "✅ APROVADO" : "❌ REPROVADO"}                      ║
╚══════════════════════════════════════════════╝
`,
  };
}