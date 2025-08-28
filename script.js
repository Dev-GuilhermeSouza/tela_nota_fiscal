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
}
