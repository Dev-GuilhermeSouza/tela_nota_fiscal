const notas = [
  {
    cliente: "Empresa X",
    titulo: "Consultoria Mensal",
    vencimento: "10/09/2025",
    status: "Pago",
    valor: "R$ 5.000,00",
    criacao: "01/09/2025"
  },
  {
    cliente: "Empresa Y",
    titulo: "Suporte Técnico",
    vencimento: "15/09/2025",
    status: "Em aberto",
    valor: "R$ 2.800,00",
    criacao: "05/09/2025"
  },
  {
    cliente: "Empresa Z",
    titulo: "Treinamento",
    vencimento: "05/09/2025",
    status: "Atrasado",
    valor: "R$ 3.200,00",
    criacao: "01/08/2025"
  }
];

const tabela = document.querySelector("#tabela-nfs tbody");
const mensagemVazia = document.getElementById("mensagem-vazia");
const inputBusca = document.getElementById("busca");
const thVencimento = document.querySelector("#tabela-nfs thead th:nth-child(5)");

let ordemAsc = true;

function carregarTabela(dados) {
  tabela.innerHTML = "";
  
  if (dados.length === 0) {
    mensagemVazia.style.display = "block";
    return;
  }

  mensagemVazia.style.display = "none";

  dados.forEach(nf => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nf.cliente}</td>
      <td>${nf.titulo}</td>
      <td>${nf.numeroNF || '12345'}</td>
      <td>${nf.valor}</td>
      <td>${nf.vencimento}</td>
      <td>${nf.boleto || '-'}</td>
      <td>
        <span class="status ${
          nf.status === "Pago"
            ? "pago"
            : nf.status === "Em aberto"
            ? "aberto"
            : "atrasado"
        }">${nf.status}</span>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

carregarTabela(notas);

inputBusca.addEventListener("input", () => {
  const termo = inputBusca.value.toLowerCase();
  const filtradas = notas.filter(nf =>
    (nf.numeroNF || '12345').toLowerCase().includes(termo) ||
    nf.titulo.toLowerCase().includes(termo) ||
    nf.cliente.toLowerCase().includes(termo) ||
    nf.status.toLowerCase().includes(termo) ||
    nf.valor.toLowerCase().includes(termo)
  );
  carregarTabela(filtradas);
});

thVencimento.style.cursor = "pointer";
thVencimento.addEventListener("click", () => {
  notas.sort((a, b) => {
    const [diaA, mesA, anoA] = a.vencimento.split('/');
    const [diaB, mesB, anoB] = b.vencimento.split('/');
    const dataA = new Date(`${anoA}-${mesA}-${diaA}`);
    const dataB = new Date(`${anoB}-${mesB}-${diaB}`);
    return ordemAsc ? dataA - dataB : dataB - dataA;
  });
  ordemAsc = !ordemAsc;
  carregarTabela(notas);
});

document.getElementById("btn-voltar-cadastro").addEventListener("click", () => {
  window.location.href = "../telaum/index.html";
});


