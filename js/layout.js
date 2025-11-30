// assets/js/layout.js
// GERENCIADOR CENTRAL DE LAYOUT E NAVEGAÇÃO
// "Um anel para a todos governar" - Se o menu quebrar, a culpa é deste arquivo.

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
});

// ============================================================
// 🔧 CONFIGURAÇÃO DAS ABAS (M E X A   A Q U I)
// ============================================================
// Para criar uma aba nova:
// 1. Crie o arquivo .html na pasta /pages
// 2. Adicione uma linha nesta lista abaixo. Fim.
const SYSTEM_ROUTES = [
    { name: "INÍCIO", url: "inicio.html" },
    { name: "FERRAMENTAS", url: "ferramentas.html" },
    { name: "BUSCA AVANÇADA", url: "pesquisa.html" },
    { name: "FRASEOLOGIAS", url: "fraseologia.html" },
    { name: "ZONAS & MAPA", url: "zonas.html" },
    { name: "INFILTRAÇÃO", url: "infiltracao.html" },
    { name: "HOSPITAIS", url: "hospitais.html" },
    { name: "TERAPIAS", url: "terapias.html" },
    { name: "MEDICAMENTOS", url: "medicamentos.html" },
    { name: "FORNECIMENTO", url: "fornecimento.html" },
    { name: "INFORMAÇÕES", url: "informacoes.html" }
];

function renderHeader() {
    const placeholder = document.getElementById('app-header-placeholder');
    if (!placeholder) return; // Se não tem o placeholder (ex: login), não faz nada.

    // Descobre qual página está aberta para deixar o botão "Aceso"
    const path = window.location.pathname;
    const page = path.split("/").pop();

    // Monta os links HTML
    let navLinksHTML = '';
    SYSTEM_ROUTES.forEach(route => {
        const activeClass = (page === route.url) ? 'active' : '';
        // Nota: Como os HTMLs estão na mesma pasta (/pages), o link é direto.
        navLinksHTML += `<a href="${route.url}" class="nav-link ${activeClass}">${route.name}</a>`;
    });

    // Monta o Cabeçalho Completo (Logo + Menu + Usuário)
    placeholder.innerHTML = `
        <div class="app-header">
            <div class="logo-title">
                <svg class="bat-logo-small" fill="#E8B923" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256,23.11c-131.79,0-238.16,92-238.16,205.51,0,80.12,48.24,150.15,116.32,185.74-5.32-2.31-29-14.7-27.11-41.48,1.38-19.12,14.65-42.34,32.32-35.84,10.6,3.9,13,16,16.51,20.8,4.71,6.48,12.72,12.21,21.5,14.54,14.62,3.89,32.48,1.49,43.2-12.22,17.4-22.3,16.27-56.1,16.27-56.1s43.51-17.1,83.87-17.1c40.37,0,83.87,17.1,83.87,17.1s-1.13,33.8,16.27,56.1c10.72,13.71,28.58,16.11,43.2,12.22,8.78-2.33,16.79-8.06,21.5-14.54,3.52-4.82,5.92-16.9,16.51-20.8,17.67-6.5,30.94,16.72,32.32,35.84,1.89,26.78-21.79,39.17-27.11,41.48,68.08-35.59,116.32-105.62,116.32-185.74C494.16,115.11,387.79,23.11,256,23.11Z" /></svg>
                <h2>BAT-SYSTEM</h2>
            </div>
            
            <nav class="main-navigation">
                ${navLinksHTML}
            </nav>
            
            <div class="user-menu">
                <button class="menu-toggle app-button" id="btn-user-menu">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="16" height="16"><path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-46.5 0-69.7l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14.2L465.6 93.3c-1.6-5.6-7.2-9.2-13.1-8.1l-48.4 11.1c-14.3-11.2-29.8-20.7-46.3-28.1L347 11.2C345.8 5.4 340.2 1 334.2 1H177.8c-6 0-11.6 4.4-12.8 10.2L154.2 68.1C137.7 75.5 122.2 85 107.9 96.2L59.5 85.1c-5.9-1.1-11.5 2.5-13.1 8.1L19 182.5c-1.6 5.6.6 11.4 5.5 14.2l42.6 24.6c-4.3 23.2-4.3 46.5 0 69.7l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14.2l27.1 89.2c1.6 5.6 7.2 9.2 13.1 8.1l48.4-11.1c14.3 11.2 29.8 20.7 46.3 28.1l10.8 56.9c1.2 5.8 6.8 10.2 12.8 10.2h156.4c6 0 11.6-4.4 12.8-10.2l10.8-56.9c16.5-7.4 32-16.9 46.3-28.1l48.4 11.1c5.9 1.1 11.5-2.5 13.1-8.1l27.1-89.2c1.6-5.6-.6-11.4-5.5-14.2zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/></svg>
                    <span class="menu-toggle-text">CONFIGURAÇÕES</span>
                </button>
                <div class="dropdown-content" id="user-menu-dropdown">
                    <div class="user-info-item"><span>OPERADOR:</span><strong id="user-name">...</strong></div>
                    <div class="user-info-item"><span>ENTRADA:</span><strong id="login-time">...</strong></div>
                    <div class="user-info-item"><span>SESSÃO:</span><strong id="session-timer">00:00:00</strong></div>
                    <div class="user-info-item"><span>LOGINS:</span><strong id="login-count">...</strong></div>
                    <button id="logout-button" class="app-button">SAIR</button>
                </div>
            </div>
        </div>
    `;

    // Reativar os eventos do menu de usuário (pois o HTML foi reescrito)
    initHeaderEvents();
}

function initHeaderEvents() {
    const btn = document.getElementById('btn-user-menu');
    const menu = document.getElementById('user-menu-dropdown');
    const logout = document.getElementById('logout-button');

    if(btn) {
        btn.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        };
        window.onclick = () => menu.classList.remove('active');
    }
    if(logout) {
        logout.onclick = () => {
            sessionStorage.clear();
            // Ajuste o caminho do logout se necessário
            window.location.href = "../index.html"; 
        };
    }
}