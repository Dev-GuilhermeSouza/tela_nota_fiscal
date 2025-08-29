const getCampo = id => document.getElementById(id);

function toggleModal(id, mostrar) {
  getCampo(id).style.display = mostrar ? "flex" : "none";
}

function salvarDados() {
  const camposObrigatorios = [
    "razao", "cnpj", "descricao", "valor", "aliquota",
    "codigoServico", "cliente", "email", "assunto",
    "mensagem", "nfNumero", "dataEmissao", "situacao", "EmitirBoleto"
  ];

  let formularioValido = true;

  camposObrigatorios.forEach(id => {
    const campo = getCampo(id);
    campo.classList.remove("campo-erro");

    if (!campo.value.trim()) {
      campo.classList.add("campo-erro");
      formularioValido = false;
    }
  });

  if (!formularioValido) {
    toggleModal("erroModal", true);
    return;
  }

  const dados = camposObrigatorios.reduce((obj, id) => {
    obj[id] = getCampo(id).value.trim();
    return obj;
  }, {});

  console.log("Dados salvos:", dados);

  toggleModal("successModal", true);
}

function fecharModal() {
  toggleModal("successModal", false);
  window.location.href = "../teladois/index.html";
}

function fecharErroModal() {
  toggleModal("erroModal", false);
}
