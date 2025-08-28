function salvarDados() {
  const dados = {
    razao: document.getElementById("razao").value,
    cnpj: document.getElementById("cnpj").value,
    descricao: document.getElementById("descricao").value,
    valor: document.getElementById("valor").value,
    aliquota: document.getElementById("aliquota").value,
    codigoServico: document.getElementById("codigoServico").value,
    cliente: document.getElementById("cliente").value,
    email: document.getElementById("email").value,
    assunto: document.getElementById("assunto").value,
    mensagem: document.getElementById("mensagem").value,
    nfNumero: document.getElementById("nfNumero").value,
    dataEmissao: document.getElementById("dataEmissao").value,
    situacao: document.getElementById("situacao").value,
    emitirBoleto: document.getElementById("EmitirBoleto").value
  };

  console.log("Dados salvos:", dados);


  document.getElementById("successModal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("successModal").style.display = "none";

  window.location.href = '../teladois/index.html';
}

function salvarDados() {
  const camposObrigatorios = [
    "razao", "cnpj", "descricao", "valor", "aliquota",
    "codigoServico", "cliente", "email", "assunto",
    "mensagem", "nfNumero", "dataEmissao", "situacao", "EmitirBoleto"
  ];

  let formularioValido = true;

  camposObrigatorios.forEach(id => {
    document.getElementById(id).classList.remove("campo-erro");
  });

  camposObrigatorios.forEach(id => {
    const campo = document.getElementById(id);
    if (!campo.value.trim()) {
      campo.classList.add("campo-erro");
      formularioValido = false;
    }
  });

  if (!formularioValido) {
    alert("Preencha todos os campos obrigatórios antes de salvar.");
    return;
  }

  const dados = {
    razao: document.getElementById("razao").value,
    cnpj: document.getElementById("cnpj").value,
    descricao: document.getElementById("descricao").value,
    valor: document.getElementById("valor").value,
    aliquota: document.getElementById("aliquota").value,
    codigoServico: document.getElementById("codigoServico").value,
    cliente: document.getElementById("cliente").value,
    email: document.getElementById("email").value,
    assunto: document.getElementById("assunto").value,
    mensagem: document.getElementById("mensagem").value,
    nfNumero: document.getElementById("nfNumero").value,
    dataEmissao: document.getElementById("dataEmissao").value,
    situacao: document.getElementById("situacao").value,
    emitirBoleto: document.getElementById("EmitirBoleto").value
  };

  console.log("Dados salvos:", dados);

  document.getElementById("successModal").style.display = "flex";
}
