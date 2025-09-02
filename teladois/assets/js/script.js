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
const filtroStatus = document.getElementById("filtroStatus");
const thVencimento = document.querySelector("#tabela-nfs thead th:nth-child(5)");
let ordemAsc = true;
let graficoRosca;

function parseValor(valorStr) {
  return parseFloat(valorStr.replace("R$", "").replace(/\./g, "").replace(",", "."));
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function diasParaVencimento(dataStr) {
  const [dia, mes, ano] = dataStr.split('/');
  const venc = new Date(`${ano}-${mes}-${dia}`);
  return Math.ceil((venc - new Date()) / (1000 * 60 * 60 * 24));
}

function carregarTabela(dados) {
  tabela.innerHTML = "";

  if (dados.length === 0) {
    mensagemVazia.style.display = "block";
    return;
  }
  mensagemVazia.style.display = "none";

  dados.forEach(nf => {
    const diasRestantes = diasParaVencimento(nf.vencimento);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nf.cliente}</td>
      <td>${nf.titulo}</td>
      <td>${nf.numeroNF || '---'}</td>
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
  const valores = dados.map(nf => parseValor(nf.valor));
  const totalValor = valores.reduce((acc, val) => acc + val, 0);
  const valorMedio = total > 0 ? totalValor / total : 0;

  document.getElementById("totalNotas").textContent = total;
  document.getElementById("valorTotal").textContent = formatarMoeda(totalValor);
  document.getElementById("valorMedio").textContent = formatarMoeda(valorMedio);

  const vencimentosFuturos = dados
    .map(nf => {
      const [d, m, a] = nf.vencimento.split('/');
      return new Date(`${a}-${m}-${d}`);
    })
    .filter(d => d > new Date())
    .sort((a, b) => a - b);

  document.getElementById("proximoVencimento").textContent =
    vencimentosFuturos[0] ? vencimentosFuturos[0].toLocaleDateString('pt-BR') : "--";

  if (valores.length) {
    document.getElementById("maiorValor").textContent = formatarMoeda(Math.max(...valores));
    document.getElementById("menorValor").textContent = formatarMoeda(Math.min(...valores));
  } else {
    document.getElementById("maiorValor").textContent = "--";
    document.getElementById("menorValor").textContent = "--";
  }

  const diasArray = dados
    .map(nf => diasParaVencimento(nf.vencimento))
    .filter(v => v > 0);

  const mediaDias = diasArray.length
    ? (diasArray.reduce((a, b) => a + b, 0) / diasArray.length).toFixed(0)
    : "--";

  document.getElementById("mediaDias").textContent = mediaDias !== "--" ? `${mediaDias} dias` : "--";
}

function atualizarPlacarStatus(dados) {
  const grupos = { "Pago": [], "Em aberto": [], "Atrasado": [] };

  dados.forEach(nf => {
    if (grupos[nf.status]) grupos[nf.status].push(parseValor(nf.valor));
  });

  document.getElementById("qtdPagas").textContent = grupos["Pago"].length;
  document.getElementById("totalPagas").textContent = formatarMoeda(grupos["Pago"].reduce((a,b) => a+b,0));

  document.getElementById("qtdAbertas").textContent = grupos["Em aberto"].length;
  document.getElementById("totalAbertas").textContent = formatarMoeda(grupos["Em aberto"].reduce((a,b) => a+b,0));

  document.getElementById("qtdAtrasadas").textContent = grupos["Atrasado"].length;
  document.getElementById("totalAtrasadas").textContent = formatarMoeda(grupos["Atrasado"].reduce((a,b) => a+b,0));
}

function gerarGraficoRosca(dados) {
  const statusContagem = { "Pago": 0, "Em aberto": 0, "Atrasado": 0 };
  dados.forEach(nf => { if (statusContagem[nf.status] !== undefined) statusContagem[nf.status]++; });

  if (graficoRosca) graficoRosca.destroy();

  const ctx = document.getElementById('graficoPizza');
  if (!ctx) return;

  graficoRosca = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: Object.values(statusContagem),
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
      }]
    }
  });
}

function atualizarDashboard(dados) {
  carregarTabela(dados);
  atualizarIndicadores(dados);
  atualizarPlacarStatus(dados);
  gerarGraficoRosca(dados);
}

inputBusca.addEventListener("input", () => {
  const termo = inputBusca.value.toLowerCase();
  const filtradas = notas.filter(nf =>
    (nf.numeroNF || '').toLowerCase().includes(termo) ||
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
    const [dA, mA, aA] = a.vencimento.split('/');
    const [dB, mB, aB] = b.vencimento.split('/');
    const dataA = new Date(`${aA}-${mA}-${dA}`);
    const dataB = new Date(`${aB}-${mB}-${dB}`);
    return ordemAsc ? dataA - dataB : dataB - dataA;
  });
  ordemAsc = !ordemAsc;
  atualizarDashboard(notas);
});

document.getElementById("btn-voltar-cadastro").addEventListener("click", () => {
  window.location.href = "telaum/index.html";
});

atualizarDashboard(notas);
