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
const filtroStatus = document.getElementById("filtroStatus");

let ordemAsc = true;
let graficoRosca;

function carregarTabela(dados) {
  tabela.innerHTML = "";

  if (dados.length === 0) {
    mensagemVazia.style.display = "block";
    return;
  }
  mensagemVazia.style.display = "none";

  const hoje = new Date();

  dados.forEach(nf => {
    const tr = document.createElement("tr");

    const [dia, mes, ano] = nf.vencimento.split('/');
    const venc = new Date(`${ano}-${mes}-${dia}`);
    const diasRestantes = Math.ceil((venc - hoje) / (1000 * 60 * 60 * 24));

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
      <td class="dias-restantes">${diasRestantes > 0 ? `${diasRestantes} dias` : 'Vencido'}</td>
    `;
    tabela.appendChild(tr);
  });
}

function atualizarIndicadores(dados) {
  const total = dados.length;
  const valores = dados.map(nf => parseFloat(nf.valor.replace("R$", "").replace(/\./g, "").replace(",", ".")));
  const totalValor = valores.reduce((acc, val) => acc + val, 0);
  const valorMedio = total > 0 ? totalValor / total : 0;

  const vencimentosFuturos = dados
    .map(nf => {
      const [d, m, a] = nf.vencimento.split('/');
      return new Date(`${a}-${m}-${d}`);
    })
    .filter(d => d > new Date())
    .sort((a, b) => a - b);

  document.getElementById("totalNotas").textContent = total;
  document.getElementById("valorTotal").textContent = `R$ ${totalValor.toFixed(2)}`;
  document.getElementById("valorMedio").textContent = `R$ ${valorMedio.toFixed(2)}`;
  document.getElementById("proximoVencimento").textContent = vencimentosFuturos[0] ? vencimentosFuturos[0].toLocaleDateString('pt-BR') : "--";

  const maior = Math.max(...valores);
  const menor = Math.min(...valores);
  document.getElementById("maiorValor").textContent = `R$ ${maior.toFixed(2)}`;
  document.getElementById("menorValor").textContent = `R$ ${menor.toFixed(2)}`;

  const diasArray = dados.map(nf => {
    const [dia, mes, ano] = nf.vencimento.split('/');
    return Math.ceil((new Date(`${ano}-${mes}-${dia}`) - new Date()) / (1000 * 60 * 60 * 24));
  }).filter(v => v > 0);

  const mediaDias = diasArray.length ? (diasArray.reduce((a,b) => a+b, 0) / diasArray.length).toFixed(0) : "--";
  document.getElementById("mediaDias").textContent = mediaDias !== "--" ? `${mediaDias} dias` : "--";
}

function gerarGraficoRosca(dados) {
  const statusContagem = { "Pago": 0, "Em aberto": 0, "Atrasado": 0 };
  dados.forEach(nf => {
    if (statusContagem[nf.status] !== undefined) statusContagem[nf.status]++;
  });

  if (graficoRosca) graficoRosca.destroy();

  const ctx = document.getElementById('graficoPizza');
  if (!ctx) return;

  graficoRosca = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusContagem),
      datasets: [{
        data: Object.values(statusContagem),
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Distribuição de Status' },
        legend: { position: 'bottom' }
      }
    }
  });
}

function atualizarDashboard(dados) {
  carregarTabela(dados);
  atualizarIndicadores(dados);
  gerarGraficoRosca(dados);
}

inputBusca.addEventListener("input", () => {
  const termo = inputBusca.value.toLowerCase();
  const filtradas = notas.filter(nf =>
    (nf.numeroNF || '12345').toLowerCase().includes(termo) ||
    nf.titulo.toLowerCase().includes(termo) ||
    nf.cliente.toLowerCase().includes(termo) ||
    nf.status.toLowerCase().includes(termo) ||
    nf.valor.toLowerCase().includes(termo)
  );
  atualizarDashboard(filtradas);
});

filtroStatus.addEventListener("change", function () {
  const filtro = this.value;
  const notasFiltradas = filtro ? notas.filter(nf => nf.status === filtro) : notas;
  atualizarDashboard(notasFiltradas);
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
  atualizarDashboard(notas);
});

document.getElementById("btn-voltar-cadastro").addEventListener("click", () => {
  window.location.href = "../telaum/index.html";
});

atualizarDashboard(notas);
