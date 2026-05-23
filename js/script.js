const formulario = document.getElementById("form-calculadora");

const camposFormulario = {
  faturamento: document.getElementById("faturamento"),
  atividade: document.getElementById("atividade")
};

const elementosInterface = {
  resultado: document.getElementById("resultado"),
  mensagemErro: document.getElementById("mensagem-erro")
};

/**
 * Obtém os dados preenchidos no formulário
 */
function obterDadosFormulario() {
  return {
    faturamentoMensal: Number(camposFormulario.faturamento.value),
    tipoAtividade: camposFormulario.atividade.value
  };
}

/**
 * Valida os dados inseridos pelo usuário
 */
function validarFormulario(faturamentoMensal, tipoAtividade) {

  if (!faturamentoMensal || faturamentoMensal <= 0) {
    return "Digite um faturamento mensal válido.";
  }

  if (!tipoAtividade) {
    return "Selecione um tipo de atividade.";
  }

  return "";
}

/**
 * Calcula o valor estimado do DAS
 */
function calcularValorDas(tipoAtividade) {

  const tabelaDas = {
    comercio: 76.90,
    servico: 80.90,
    industria: 77.90
  };

  return tabelaDas[tipoAtividade];
}

/**
 * Formata valores monetários em Real
 */
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/**
 * Limpa mensagens anteriores da tela
 */
function limparInterface() {
  elementosInterface.mensagemErro.textContent = "";
  elementosInterface.resultado.innerHTML = "";
}

/**
 * Exibe mensagem de erro para o usuário
 */
function exibirMensagemErro(mensagem) {
  elementosInterface.mensagemErro.textContent = mensagem;
}

/**
 * Exibe o resultado final do cálculo
 */
function exibirResultado(faturamentoMensal, tipoAtividade, valorDas) {

  const faturamentoAnual = faturamentoMensal * 12;

  elementosInterface.resultado.innerHTML = `
    <h2>Resultado do cálculo</h2>

    <p>
      <strong>Tipo de atividade:</strong>
      ${tipoAtividade}
    </p>

    <p>
      <strong>Faturamento anual:</strong>
      ${formatarMoeda(faturamentoAnual)}
    </p>

    <p>
      <strong>DAS mensal estimado:</strong>
      ${formatarMoeda(valorDas)}
    </p>
  `;
}

/**
 * Evento principal do formulário
 */
formulario.addEventListener("submit", function (evento) {

  evento.preventDefault();

  limparInterface();

  elementosInterface.resultado.innerHTML = `
    <p>Calculando valores...</p>
  `;

  const {
    faturamentoMensal,
    tipoAtividade
  } = obterDadosFormulario();

  const erroValidacao = validarFormulario(
    faturamentoMensal,
    tipoAtividade
  );

  if (erroValidacao) {

    limparInterface();

    exibirMensagemErro(erroValidacao);

    return;
  }

  const valorDas = calcularValorDas(tipoAtividade);

  setTimeout(() => {

    exibirResultado(
      faturamentoMensal,
      tipoAtividade,
      valorDas
    );

  }, 500);

});