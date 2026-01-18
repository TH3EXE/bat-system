// js/layout.js
// GERENCIADOR DE LAYOUT (MENU COMPLETO) 

const ROUTES = [
    { name: "DASHBOARD", url: "busca.html", icon: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>' },
    { name: "FERRAMENTAS", url: "ferramentas.html", icon: '<path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>' },
    { name: "BUSCA AVANÇADA", url: "pesquisa.html", icon: '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>' },
    { name: "FRASEOLOGIA", url: "fraseologia.html", icon: '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>' },
    { name: "ZONAS / MAPA", url: "zonas.html", icon: '<path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5z"/>' },
    { name: "INFILTRAÇÃO", url: "infiltracao.html", icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h2v5z"/>' },
    { name: "PRESTADORES", url: "prestadores.html", icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.5 12h-3v-3.5h3V15zm0-5h-3V6.5h3V10zm5 5h-3v-3.5h3V15zm0-5h-3V6.5h3V10z"/>' },
    { name: "TERAPIAS", url: "terapias.html", icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>' },
    { name: "MEDICAMENTOS", url: "medicamentos.html", icon: '<path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>' },
    { name: "FORNECIMENTO", url: "fornecimento.html", icon: '<path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>' },
    { name: "INFORMAÇÕES", url: "informacoes.html", icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>' }
];

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    
    // Remove elementos antigos de navegação antes de processar
    const oldNav = document.querySelector('.main-navigation');
    if (oldNav) oldNav.remove();
    
    const oldHeader = document.querySelector('header.app-header');
    if (oldHeader && oldHeader.querySelector('.main-navigation')) {
        const mainNav = oldHeader.querySelector('.main-navigation');
        if (mainNav) mainNav.remove();
    }
    
    // Salva o conteúdo original (Main) - apenas o que está dentro de <main> ou body direto
    let pageContent = '';
    const mainContent = body.querySelector('main') || body.querySelector('.app-container');
    if (mainContent) {
        pageContent = mainContent.innerHTML;
    } else {
        // Se não houver main, pega tudo exceto header e nav
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = body.innerHTML;
        const headerToRemove = tempDiv.querySelector('header');
        const navToRemove = tempDiv.querySelector('.main-navigation');
        if (headerToRemove) headerToRemove.remove();
        if (navToRemove) navToRemove.remove();
        pageContent = tempDiv.innerHTML;
    }
    
    const currentPage = window.location.pathname.split("/").pop() || "busca.html";

    // Reconstrói o corpo com o Layout Grid
    body.innerHTML = `
        <header class="app-header">
            <div class="header-left" style="display:flex; align-items:center; gap:10px;">
                <button class="menu-toggle-mobile" id="menu-toggle" aria-label="Menu">☰</button>
                <svg class="bat-logo-small" style="width:20px; height:20px; color:#E8B923;" fill="currentColor" viewBox="0 0 512 512"><path d="M256,23.11c-131.79,0-238.16,92-238.16,205.51,0,80.12,48.24,150.15,116.32,185.74-5.32-2.31-29-14.7-27.11-41.48,1.38-19.12,14.65-42.34,32.32-35.84,10.6,3.9,13,16,16.51,20.8,4.71,6.48,12.72,12.21,21.5,14.54,14.62,3.89,32.48,1.49,43.2-12.22,17.4-22.3,16.27-56.1,16.27-56.1s43.51-17.1,83.87-17.1c40.37,0,83.87,17.1,83.87,17.1s-1.13,33.8,16.27,56.1c10.72,13.71,28.58,16.11,43.2,12.22,8.78-2.33,16.79-8.06,21.5-14.54,3.52-4.82,5.92-16.9,16.51-20.8,17.67-6.5,30.94,16.72,32.32,35.84,1.89,26.78-21.79,39.17-27.11,41.48,68.08-35.59,116.32-105.62,116.32-185.74C494.16,115.11,387.79,23.11,256,23.11Z"/></svg>
                <span style="color:#E8B923; font-weight:900; letter-spacing:0.5px; font-family:'Rajdhani', sans-serif; font-size:0.9rem;">WAYNETECHOS</span>
                <div class="system-status" style="margin-left:15px; display:flex; gap:12px; font-size:0.65rem; color:#888;">
                    <div class="status-item"><span class="status-dot"></span> ONLINE</div>
                    <div class="status-item" id="clock-display">--:--</div>
                </div>
            </div>
            <div class="header-right" style="display:flex; gap:10px; align-items:center;">
                <div style="text-align:right; font-size:0.65rem; color:#888;">OPERADOR<br><strong style="color:#fff; font-size:0.7rem;">BRUCE.W</strong></div>
                <button class="btn-logout" onclick="sessionStorage.clear(); window.location.href='index.html'" style="background:transparent; border:1px solid #E8B923; color:#FF3131; padding:0.25rem 0.6rem; cursor:pointer; font-size:0.65rem;">SAIR</button>
            </div>
        </header>
        
        <div class="sidebar-overlay" id="sidebar-overlay"></div>

        <div class="main-layout" style="display:flex; height:calc(100vh - 60px);">
            <aside class="app-sidebar">
                <div style="padding:15px; font-size:0.65rem; color:#E8B923; border-bottom:1px solid #E8B923;">NAVEGAÇÃO</div>
                <div class="sidebar-nav" style="overflow-y:auto; flex:1;">
                    ${ROUTES.map(r => `
                        <a href="${r.url}" class="nav-link ${currentPage === r.url ? 'active' : ''}">
                            <svg viewBox="0 0 24 24" fill="currentColor">${r.icon}</svg>
                            ${r.name}
                        </a>
                    `).join('')}
                </div>
            </aside>

            <main class="app-content">
                ${pageContent}
            </main>
        </div>

        <div class="bat-signal-background"></div>
    `;

    setInterval(() => {
        const el = document.getElementById('clock-display');
        if(el) el.textContent = new Date().toLocaleTimeString('pt-BR');
    }, 1000);
    
    // Inicializar stats do dashboard se existir
    setTimeout(() => {
        if (typeof initDashboardStats === 'function') {
            initDashboardStats();
        }
    }, 100);

    // Funcionalidade do menu hambúrguer para desktop e mobile
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (menuToggle && sidebar && overlay) {
        // Função para verificar se é mobile
        const isMobile = () => window.innerWidth <= 768;
        
        // Função para toggle do sidebar
        const toggleSidebar = () => {
            if (isMobile()) {
                // Mobile: usa overlay e animação de slide
                sidebar.classList.toggle('mobile-open');
                overlay.classList.toggle('active');
            } else {
                // Desktop: apenas mostra/oculta o sidebar
                sidebar.classList.toggle('desktop-hidden');
            }
        };
        
        menuToggle.addEventListener('click', toggleSidebar);
        
        // Overlay só funciona no mobile
        overlay.addEventListener('click', () => {
            if (isMobile()) {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
            }
        });
        
        // Fechar sidebar ao clicar em um link no mobile
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMobile()) {
                    sidebar.classList.remove('mobile-open');
                    overlay.classList.remove('active');
                }
            });
        });
        
        // Ajustar comportamento ao redimensionar a janela
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (!isMobile()) {
                    // Desktop: remove classes mobile e garante sidebar visível
                    sidebar.classList.remove('mobile-open');
                    overlay.classList.remove('active');
                } else {
                    // Mobile: remove classe desktop-hidden
                    sidebar.classList.remove('desktop-hidden');
                }
            }, 250);
        });
    }
});

