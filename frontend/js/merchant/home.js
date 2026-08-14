import { btnShare } from '../components/shareButton.js'
import { verificarUser, getLojaId, insertNomeDaLoja, verificacaoUsuario } from "../services/requisicoesMerchant.js";
import { API_BASE_URL } from "../api/config.js"
import { requestJSON } from "../components/responseJSON.js";
import { Eventos } from "../utils/eventos.js";



export async function initHome() {
  const verificar = await verificacaoUsuario();
  if (!verificar) return; // Se for false (não logado), para a execução aqui.

  const menuItem = document.querySelector('.menu-item.home');
  if (menuItem) {
    menuItem.classList.add('selected-item');
  }


  const lojaId = await getLojaId()
  if(!lojaId) return

  await insertNomeDaLoja(lojaId.id)
    btnShare(`/lojas/${lojaId.id}?loja_id=${lojaId.id}`,
        "Olha o que achei no Guide",
        "Confira a minha loja no Guide:"
    )

    const responseLoja = await fetch(`${API_BASE_URL}/api/lojas/${lojaId.id}`);
    const loja = await responseLoja.json()

    const containerEl = document.getElementById('painel-loja')


    renderImagePreview(loja.logo_url, loja.banner_url)
    await renderPainel(loja.id, containerEl)


    // link loja
    const linkLoja = document.querySelector('.link-loja')
    linkLoja.addEventListener('click', (e) => {
        e.preventDefault()
        const url = `${API_BASE_URL}/lojas/${lojaId.id}?loja_id=${lojaId.id}`;
        window.open(url, '_blank');
    })
    
}



function renderImagePreview(logo, banner) {

    const logoImage = document.querySelector(".logo-media")
    const bannerImage = document.querySelector(".banner-media")

    if (logoImage) {
            logoImage.src= logo
   
    }

    if (bannerImage) {
            bannerImage.src = banner
            
    }
}

// Função principal: busca os eventos da loja, processa e desenha o painel
// dentro do elemento HTML que você passar (ex: document.getElementById('painel')).
async function renderPainel(loja_id, containerEl) {
  const eventos = await requestJSON(`${API_BASE_URL}/api/eventos/${loja_id}`);

  // 2. Agrupa os eventos por tipo, já garantindo que todas as chaves existam
  //    (mesmo que vazias), pra não dar erro de "undefined" mais na frente.
  const eventosPorTipo = Object.fromEntries(Object.values(Eventos).map((t) => [t, []]));
  eventos.forEach((evento) => {
    eventosPorTipo[evento.tipo_evento]?.push(evento);
  });

  // 3. Calcula os 3 números principais do topo do painel
  //    (visitas na loja, produtos visualizados, interesses gerados)
  const visitas =
    eventosPorTipo.VIEW_LOJA.length + eventosPorTipo.VIEW_LOJA_HOME.length;

  const produtosVisualizados =
    eventosPorTipo.VIEW_PRODUTO.length + eventosPorTipo.VIEW_PRODUTO_HOME.length;

  const interesses =
    eventosPorTipo.INTERESSE_PRODUTO.length +
    eventosPorTipo.INTERESSE_PRODUTO_HOME.length +
    eventosPorTipo.INTERESSE_LISTA.length +
    eventosPorTipo.INTERESSE_LISTA_HOME.length;

  // 4. Calcula de onde vieram os visitantes.
  const visitasLoja = [...eventosPorTipo.VIEW_LOJA, ...eventosPorTipo.VIEW_LOJA_HOME];
  const origemInterna = visitasLoja.filter((e) => e.tipo_evento === 'VIEW_LOJA').length;
  const origemExterna = visitasLoja.filter((e) => e.tipo_evento === 'VIEW_LOJA_HOME').length;


  // 5. Junta os eventos de produto (views e interesses) num só lugar,
  //    pra conseguir agrupar por produto_id em seguida.
  const viewsProduto = [...eventosPorTipo.VIEW_PRODUTO, ...eventosPorTipo.VIEW_PRODUTO_HOME];
  const interessesProduto = [
    ...eventosPorTipo.INTERESSE_PRODUTO,
    ...eventosPorTipo.INTERESSE_PRODUTO_HOME,
  ];

  // Conta quantas views e quantos interesses cada produto_id recebeu
  const statsPorProduto = {}; // { [produto_id]: { views: n, interesses: n } }

  viewsProduto.forEach((e) => {
    if (!statsPorProduto[e.produto_id]) statsPorProduto[e.produto_id] = { views: 0, interesses: 0 };
    statsPorProduto[e.produto_id].views++;
  });

  interessesProduto.forEach((e) => {
    if (!statsPorProduto[e.produto_id]) statsPorProduto[e.produto_id] = { views: 0, interesses: 0 };
    statsPorProduto[e.produto_id].interesses++;
  });

  // 6. Busca o nome de cada produto na API (em paralelo, uma vez só por produto)
  const produtoIds = Object.keys(statsPorProduto);
  const produtos = await Promise.all(
    produtoIds.map((id) => requestJSON(`${API_BASE_URL}/api/produtos/${id}`))
  );

  // Junta nome + estatísticas num único array, já ordenado do mais visto pro menos visto
  const ranking = produtos
    .map((produto) => ({
      nome: produto.nome, // ajuste aqui se o campo tiver outro nome na sua API
      views: statsPorProduto[produto.id].views,
      interesses: statsPorProduto[produto.id].interesses,
      // intenção = % de quem viu o produto e demonstrou interesse
      intencao: statsPorProduto[produto.id].views
        ? (statsPorProduto[produto.id].interesses / statsPorProduto[produto.id].views) * 100
        : 0,
    }))
    .sort((a, b) => b.views - a.views);

  const top3MaisVistos = ranking.slice(0, 3);

  // Ranking separado por maior intenção (% de interesse), só produtos com pelo menos 1 view
  const topIntencao = [...ranking]
    .filter((p) => p.views > 0)
    .sort((a, b) => b.intencao - a.intencao)
    .slice(0, 3);

  // 7. Monta o HTML final e injeta no container
  containerEl.innerHTML = `
    <div class="painel">

      <!-- Bloco 1: números principais -->
      <section class="painel-secao painel-kpis">
        <h2 class="painel-titulo">Desempenho da loja</h2>
        <div class="kpi-grid">
          ${kpiCard(visitas, 'Visitas')}
          ${kpiCard(produtosVisualizados, 'Produtos visualizados')}
          ${kpiCard(interesses, 'Interesses')}
        </div>
      </section>

      <!-- Bloco 2: origem dos visitantes -->
      <section class="painel-secao">
        <h2 class="painel-titulo">De onde vieram seus visitantes?</h2>
        ${origemItem('Compartilhamento do link da loja', origemInterna)}
        ${origemItem('Descoberta pelo Guide', origemExterna)}
      </section>

      <!-- Bloco 3: funil -->
      <section class="painel-secao">
        <h2 class="painel-titulo">Funil</h2>
        <div class="funil">
          ${funilEtapa('Visitas à loja', visitas)}
          ${funilSeta()}
          ${funilEtapa('Visualizações de produtos', produtosVisualizados)}
          ${funilSeta()}
          ${funilEtapa('Interesse', interesses)}
        </div>
      </section>

      <!-- Bloco 4: produtos mais vistos -->
      <section class="painel-secao">
        <h2 class="painel-titulo">Produtos mais vistos</h2>
        ${tabelaProdutos(top3MaisVistos)}
      </section>

      <!-- Bloco 5: maior intenção de compra -->
      <section class="painel-secao">
        <h2 class="painel-titulo">Maior intenção</h2>
        ${topIntencao.map((p) => intencaoItem(p.nome, p.intencao)).join('')}
      </section>

    </div>
  `;
}

// ------------------------------------------------------------
// Funções pequenas só pra montar pedaços de HTML repetidos.
// Separar assim deixa o bloco principal acima mais fácil de ler.
// ------------------------------------------------------------

// Card simples com número grande + label embaixo (estilo do print do PowerBI)
function kpiCard(numero, label) {
  return `
    <div class="kpi-card">
      <span class="kpi-numero">${numero}</span>
      <span class="kpi-label">${label}</span>
    </div>
  `;
}

// Linha de "de onde vieram os visitantes": label + número alinhado à direita
function origemItem(label, valor) {
  return `
    <div class="linha-dado">
      <span class="linha-label">${label}</span>
      <span class="linha-valor">${valor}</span>
    </div>
  `;
}

// Uma etapa do funil (nome da etapa + número grande embaixo)
function funilEtapa(label, valor) {
  return `
    <div class="funil-etapa">
      <span class="funil-label">${label}</span>
      <span class="funil-valor">${valor}</span>
    </div>
  `;
}

// Seta simples entre as etapas do funil
function funilSeta() {
  return `<div class="funil-seta">↓</div>`;
}

// Tabela simples de produtos mais vistos
function tabelaProdutos(lista) {
  if (lista.length === 0) {
    return `<p class="painel-vazio">Ainda não há dados suficientes.</p>`;
  }
  const linhas = lista
    .map(
      (p) => `
      <tr>
        <td>${p.nome}</td>
        <td>${p.views}</td>
        <td>${p.interesses}</td>
      </tr>
    `
    )
    .join('');

  return `
    <table class="painel-tabela">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Views</th>
          <th>Interesses</th>
        </tr>
      </thead>
      <tbody>${linhas}</tbody>
    </table>
  `;
}

// Linha de "maior intenção": nome do produto + porcentagem
function intencaoItem(nome, porcentagem) {
  return `
    <div class="linha-dado">
      <span class="linha-label">${nome}</span>
      <span class="linha-valor">${porcentagem.toFixed(1)}%</span>
    </div>
  `;
}
