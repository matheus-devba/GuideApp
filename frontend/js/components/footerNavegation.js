export function renderFooter() {
  // Evita renderizar o footer mais de uma vez se já existir na tela
  if (document.querySelector(".app-footer-nav")) return;

  const currentPath = window.location.pathname;

  const html = `
  <footer class="app-footer-nav">
    <nav class="footer-nav-container">
      <ul class="footer-nav-list">
        
        <li class="footer-nav-item">
          <a href="/home" class="footer-nav-link ${currentPath.includes('/home') ? 'active' : ''}">
            <img src="/assets/icons/home.png" alt="Home" class="footer-nav-icon">
            <span class="footer-nav-text">Home</span>
          </a>
        </li>

        <li class="footer-nav-item">
          <a href="/pesquisa" class="footer-nav-link ${currentPath.includes('/pesquisa') ? 'active' : ''}">
            <img src="/assets/icons/search.png" alt="Pesquisa" class="footer-nav-icon">
            <span class="footer-nav-text">Pesquisa</span>
          </a>
        </li>

        <li class="footer-nav-item">
          <a href="/lojasAll" class="footer-nav-link store-mode ${currentPath.includes('/lojasAll') || currentPath.includes('/lojas/') ?  'active' : ''}">
            <img src="/assets/icons/varejo.png" alt="Modo Loja" class="footer-nav-icon">
            <span class="footer-nav-text">Modo Loja</span>
          </a>
        </li>

      </ul>
    </nav>
  </footer>
  `;

  // Insere o HTML diretamente no final da página
  document.body.insertAdjacentHTML("beforeend", html);
}