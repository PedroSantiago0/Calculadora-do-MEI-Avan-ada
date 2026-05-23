const formulario = document.getElementById("form-calculadora");
const inputFaturamento = document.getElementById("faturamento");
const selectAtividade = document.getElementById("atividade");
const resultado = document.getElementById("resultado");
const mensagemErro = document.getElementById("mensagem-erro");

function obterDadosFormulario() {
  return {
    faturamento: Number(inputFaturamento.value),
    atividade: selectAtividade.value
  };
}

function validarDados(faturamento, atividade) {
  if (!faturamento || faturamento <= 0) {
    return "Digite um faturamento mensal válido.";
  }

  if (!atividade) {
    return "Selecione o tipo de atividade.";
  }

  return "";
}

function calcularDas(atividade) {
  const valoresDas = {
    comercio: 76.90,
    servico: 80.90,
    industria: 77.90
  };

  return valoresDas[atividade];
}

function exibirResultado(faturamento, atividade, das) {
  const faturamentoAnual = faturamento * 12;

  resultado.innerHTML = `
    <h2>Resultado</h2>
    <p><strong>Atividade:</strong> ${atividade}</p>
    <p><strong>Faturamento anual estimado:</strong> R$ ${faturamentoAnual.toFixed(2)}</p>
    <p><strong>DAS mensal estimado:</strong> R$ ${das.toFixed(2)}</p>
  `;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  mensagemErro.textContent = "";
  resultado.innerHTML = "";

  const { faturamento, atividade } = obterDadosFormulario();
  const erro = validarDados(faturamento, atividade);

  if (erro) {
    mensagemErro.textContent = erro;
    return;
  }

  const das = calcularDas(atividade);
  exibirResultado(faturamento, atividade, das);
});