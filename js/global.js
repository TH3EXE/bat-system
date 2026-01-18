// js/global.js
// SISTEMA CENTRAL: AUTENTICAÇÃO, LAYOUT E MONITORAMENTO

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. LÓGICA DE LOGIN (Apenas na tela de login)
    // ============================================================
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        // Limpa sessão antiga ao abrir a tela de login 
        sessionStorage.clear();

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const userField = document.getElementById('username');
            const passField = document.getElementById('password');
            const btn = document.querySelector('.btn-access-tech');
            const btnText = document.querySelector('.btn-text');

            const user = userField.value.trim().toUpperCase();
            const pass = passField.value.trim().toUpperCase(); // Converte senha para upper para evitar erro de caixa

            // Efeito Visual de Processamento
            const originalText = btnText.textContent;
            btnText.textContent = "AUTENTICANDO...";
            btn.style.opacity = "0.8";
            btn.style.cursor = "wait";

            setTimeout(() => {
                // --- VERIFICAÇÃO DE CREDENCIAIS ---
                if (user === 'BATMAN' && pass === 'BATMAN666') {
                    // SUCESSO
                    sessionStorage.setItem('userRole', 'admin');
                    sessionStorage.setItem('userName', 'BRUCE WAYNE'); // Nome que aparece no sistema
                    sessionStorage.setItem('sessionStartTime', new Date().toLocaleString());
                    
                    // Feedback Visual Positivo
                    btnText.textContent = "ACESSO CONCEDIDO";
                    btn.style.borderColor = "var(--neon-green)";
                    btn.style.color = "var(--neon-green)";
                    
                    // Redirecionamento
                    setTimeout(() => {
                        window.location.href = 'busca.html';
                    }, 800);

                } else {
                    // ERRO
                    alert("ALERTA DE SEGURANÇA: Credenciais não reconhecidas.");
                    
                    // Reset Visual
                    btnText.textContent = originalText;
                    btn.style.borderColor = "var(--bat-yellow)";
                    btn.style.color = "#000";
                    btn.style.opacity = "1";
                    btn.style.cursor = "pointer";
                    passField.value = ""; // Limpa senha
                    passField.focus();
                }
            }, 1000); // Delay "dramático" de 1 segundo
        });
        
        // Se estiver na tela de login, para por aqui (não carrega header nem monitoramento)
        return;
    }

    // ============================================================
    // 2. SEGURANÇA DE PÁGINAS INTERNAS (Barreira de Acesso)
    // ============================================================
    
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');
    
    // Se tentar acessar qualquer página interna sem logar, chuta de volta pro login
    if (!userRole) {
        window.location.href = 'index.html';
        return;
    }

    // ============================================================
    // 3. CONSTRUÇÃO DO HEADER (BOTÕES E MENUS)
    // ============================================================
    const header = document.querySelector('.app-header');
    // Remove elementos antigos se existirem para recriar limpo
    const oldActions = document.querySelector('.header-actions');
    if (oldActions) oldActions.remove();
    const oldUserMenu = document.querySelector('.user-menu');
    if (oldUserMenu) oldUserMenu.remove();

    if (header) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'header-actions';

        // --- BOTÃO 1: SISTEMA (PAINEL DE MONITORAMENTO) ---
        const sysMenu = document.createElement('div');
        sysMenu.className = 'header-menu';
        sysMenu.innerHTML = `
            <button class="menu-toggle app-button" id="btn-system">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="16" height="16"><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>
                <span class="menu-toggle-text">SISTEMA</span>
            </button>
            <div class="dropdown-content" id="system-dropdown">
                <div class="panel-info-item">
                    <span>STATUS:</span>
                    <div style="display:flex;align-items:center;">
                        <div id="panel-status-dot" class="status-led status-green"></div>
                        <strong id="panel-status-text" style="color:var(--neon-green)">ONLINE</strong>
                    </div>
                </div>
                <div class="panel-info-item">
                    <span>PING:</span>
                    <strong id="panel-ping">-- ms</strong>
                </div>
                <div class="panel-info-item">
                    <span>LOCAL:</span>
                    <strong id="panel-geo">DETECTANDO...</strong>
                </div>
                <div class="panel-info-item">
                    <span>SERVIDOR:</span>
                    <strong>SRV-01 (BR)</strong>
                </div>
            </div>
        `;

        // --- BOTÃO 2: CONFIGURAÇÕES (USUÁRIO) ---
        const userMenu = document.createElement('div');
        userMenu.className = 'header-menu';
        const isLightMode = localStorage.getItem('theme') === 'light';
        userMenu.innerHTML = `
            <button class="menu-toggle app-button" id="btn-config">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="16" height="16"><path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-46.5 0-69.7l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14.2L465.6 93.3c-1.6-5.6-7.2-9.2-13.1-8.1l-48.4 11.1c-14.3-11.2-29.8-20.7-46.3-28.1L347 11.2C345.8 5.4 340.2 1 334.2 1H177.8c-6 0-11.6 4.4-12.8 10.2L154.2 68.1C137.7 75.5 122.2 85 107.9 96.2L59.5 85.1c-5.9-1.1-11.5 2.5-13.1 8.1L19 182.5c-1.6 5.6.6 11.4 5.5 14.2l42.6 24.6c-4.3 23.2-4.3 46.5 0 69.7l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14.2l27.1 89.2c1.6 5.6 7.2 9.2 13.1 8.1l48.4-11.1c14.3 11.2 29.8 20.7 46.3 28.1l10.8 56.9c1.2 5.8 6.8 10.2 12.8 10.2h156.4c6 0 11.6-4.4 12.8-10.2l10.8-56.9c16.5-7.4 32-16.9 46.3-28.1l48.4 11.1c5.9 1.1 11.5-2.5 13.1-8.1l27.1-89.2c1.6-5.6-.6-11.4-5.5-14.2zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/></svg>
                <span class="menu-toggle-text">CONFIGURAÇÕES</span>
            </button>
            <div class="dropdown-content" id="user-dropdown">
                <div class="user-info-item"><span>OPERADOR:</span><strong id="user-name">${userName || '...'}</strong></div>
                <div class="user-info-item" style="justify-content: center; border-bottom: none; padding: 0.5rem 0;">
                    <button id="theme-toggle" class="app-button" style="width: 100%; margin: 0.5rem 0;">
                        ${isLightMode ? '🌙 MODO ESCURO' : '☀️ MODO CLARO'}
                    </button>
                </div>
                <button id="logout-button" class="app-button">SAIR</button>
            </div>
        `;

        actionsContainer.appendChild(sysMenu);
        actionsContainer.appendChild(userMenu);
        header.appendChild(actionsContainer);

        setupMenuEvents();
    }

    // --- LÓGICA DOS MENUS ---
    function setupMenuEvents() {
        const btnSystem = document.getElementById('btn-system');
        const dropSystem = document.getElementById('system-dropdown');
        const btnConfig = document.getElementById('btn-config');
        const dropConfig = document.getElementById('user-dropdown');
        const btnLogout = document.getElementById('logout-button');

        function closeAll(except) {
            if(dropSystem && dropSystem !== except) dropSystem.classList.remove('active');
            if(dropConfig && dropConfig !== except) dropConfig.classList.remove('active');
        }

        if (btnSystem) {
            btnSystem.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = dropSystem.classList.contains('active');
                closeAll();
                if (!isActive) dropSystem.classList.add('active');
            });
        }

        if (btnConfig) {
            btnConfig.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = dropConfig.classList.contains('active');
                closeAll();
                if (!isActive) dropConfig.classList.add('active');
            });
        }

        window.addEventListener('click', () => closeAll());

        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                sessionStorage.clear();
                window.location.href = 'index.html';
            });
        }
        
        // Toggle de tema (Dark/Light)
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = localStorage.getItem('theme') || 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                localStorage.setItem('theme', newTheme);
                applyTheme(newTheme);
                
                // Atualiza o texto do botão
                themeToggle.textContent = newTheme === 'dark' ? '☀️ MODO CLARO' : '🌙 MODO ESCURO';
            });
        }
        
        // Aplica o tema salvo ao carregar
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTimeout(() => {
            applyTheme(savedTheme);
            // Reaplica após um delay para garantir que todos os elementos foram renderizados
            setTimeout(() => applyTheme(savedTheme), 500);
        }, 100);
    }
    
    // Aplicar tema quando a página carregar completamente
    window.addEventListener('load', () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTimeout(() => applyTheme(savedTheme), 300);
    });
    
    // Observer para aplicar tema quando novos elementos forem adicionados (layout.js)
    const themeObserver = new MutationObserver(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            setTimeout(() => applyTheme('light'), 200);
        }
    });
    
    // Observar mudanças no body
    if (document.body) {
        themeObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Função para aplicar o tema - VERSÃO COMPLETA
    function applyTheme(theme) {
        const root = document.documentElement;
        const body = document.body;
        
        // Remove classes anteriores
        body.classList.remove('light-mode', 'dark-mode');
        
        if (theme === 'light') {
            // Modo Claro - Aplicar em TODOS os elementos
            body.classList.add('light-mode');
            root.style.setProperty('--batman-black', '#ffffff');
            root.style.setProperty('--batman-grey', '#f5f5f5');
            root.style.setProperty('--batman-light-grey', '#333333');
            body.style.backgroundColor = '#ffffff';
            body.style.color = '#333333';
            
            // Função auxiliar para aplicar cores em elementos
            const applyLightColors = (selector, bgColor, textColor) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    try {
                        const currentBg = getComputedStyle(el).backgroundColor;
                        const isDark = currentBg.includes('rgb(0') || 
                                      currentBg.includes('rgb(10') ||
                                      currentBg.includes('rgb(17') ||
                                      currentBg.includes('rgb(20') ||
                                      currentBg.includes('rgb(33') ||
                                      currentBg.includes('rgb(51');
                        if (isDark || !currentBg || currentBg === 'rgba(0, 0, 0, 0)') {
                            el.style.setProperty('background-color', bgColor, 'important');
                        }
                        if (textColor) {
                            const currentColor = getComputedStyle(el).color;
                            if (currentColor.includes('rgb(176') || 
                                currentColor.includes('rgb(179') ||
                                currentColor.includes('rgb(255, 255, 255)') ||
                                currentColor.includes('rgb(192')) {
                                el.style.setProperty('color', textColor, 'important');
                            }
                        }
                    } catch(e) {
                        // Ignora erros
                    }
                });
            };
            
            // Aplicar recursivamente em todos os elementos filhos
            const applyToAllChildren = (parent) => {
                if (!parent) return;
                const children = parent.querySelectorAll('*');
                children.forEach(child => {
                    try {
                        const bg = getComputedStyle(child).backgroundColor;
                        const color = getComputedStyle(child).color;
                        const isDarkBg = bg.includes('rgb(0') || bg.includes('rgb(10') || bg.includes('rgb(17') || bg.includes('rgb(20') || bg.includes('rgb(33') || bg.includes('rgb(51');
                        const isLightText = color.includes('rgb(176') || color.includes('rgb(179') || color.includes('rgb(192');
                        
                        if (isDarkBg && !child.classList.contains('bat-signal-logo') && !child.classList.contains('bat-signal-container')) {
                            child.style.setProperty('background-color', '#f5f5f5', 'important');
                        }
                        if (isLightText) {
                            child.style.setProperty('color', '#333333', 'important');
                        }
                    } catch(e) {
                        // Ignora erros
                    }
                });
            };
            
            // Aplicar em todos os elementos
            applyLightColors('.app-header', '#ffffff', '#333333');
            applyLightColors('.app-sidebar', '#f5f5f5', '#333333');
            applyLightColors('.app-content', '#ffffff', '#333333');
            applyLightColors('.dropdown-content', '#ffffff', '#333333');
            applyLightColors('.dashboard-card, .card', '#f5f5f5', '#333333');
            applyLightColors('.panel, .module, .container, .box, .section', '#f5f5f5', '#333333');
            applyLightColors('table', '#ffffff', '#333333');
            applyLightColors('tr', '#f5f5f5', '#333333');
            applyLightColors('td, th', '#f5f5f5', '#333333');
            applyLightColors('.result-card, .item-card', '#f5f5f5', '#333333');
            applyLightColors('.tool-module, .info-container', '#f5f5f5', '#333333');
            applyLightColors('.toolbar, .toolbar-btn', '#f5f5f5', '#333333');
            applyLightColors('.list-item, .note-item', '#f5f5f5', '#333333');
            applyLightColors('.search-box, .filter-box', '#ffffff', '#333333');
            
            // Aplicar recursivamente no conteúdo principal
            const appContent = document.querySelector('.app-content');
            if (appContent) {
                applyToAllChildren(appContent);
            }
            
            // Inputs
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(i => {
                i.style.backgroundColor = '#ffffff';
                i.style.color = '#333333';
                i.style.borderColor = '#E8B923';
            });
            
            // Links (exceto nav e cards)
            const links = document.querySelectorAll('a:not(.nav-link):not(.dashboard-card):not(.sidebar-nav a)');
            links.forEach(link => {
                const color = getComputedStyle(link).color;
                if (color.includes('rgb(176') || color.includes('rgb(179')) {
                    link.style.color = '#E8B923';
                }
            });
            
        } else {
            // Modo Escuro (padrão) - Resetar tudo
            body.classList.add('dark-mode');
            root.style.setProperty('--batman-black', '#0a0a0a');
            root.style.setProperty('--batman-grey', '#333333');
            root.style.setProperty('--batman-light-grey', '#b0b0b0');
            body.style.backgroundColor = '#0a0a0a';
            body.style.color = '#b0b0b0';
            
            // Resetar estilos inline para voltar ao padrão
            const resetElements = document.querySelectorAll('.app-header, .app-sidebar, .app-content, .dropdown-content, .dashboard-card, .card, .panel, .module, .container, .box, .section, table, tr, td, th, .result-card, .item-card, .tool-module, .info-container');
            resetElements.forEach(el => {
                el.style.backgroundColor = '';
                el.style.color = '';
            });
            
            // Headers e sidebars específicos
            const headers = document.querySelectorAll('.app-header');
            headers.forEach(h => {
                h.style.backgroundColor = '#000000';
                h.style.color = '#b0b0b0';
            });
            
            const sidebars = document.querySelectorAll('.app-sidebar');
            sidebars.forEach(s => s.style.backgroundColor = '#000000');
            
            const contents = document.querySelectorAll('.app-content');
            contents.forEach(c => {
                c.style.backgroundColor = '#0a0a0a';
                c.style.color = '#b0b0b0';
            });
            
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(d => {
                d.style.backgroundColor = '#000000';
                d.style.color = '#b0b0b0';
            });
            
            const cards = document.querySelectorAll('.dashboard-card, .card');
            cards.forEach(c => {
                c.style.backgroundColor = '#000000';
                c.style.color = '#b0b0b0';
            });
            
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(i => {
                i.style.backgroundColor = '#000000';
                i.style.color = '#fff';
                i.style.borderColor = '#E8B923';
            });
        }
    }
    
    // Dashboard Stats - Estatísticas do Painel
    window.initDashboardStats = function() {
        const uptimeEl = document.getElementById('system-uptime');
        const networkEl = document.getElementById('network-status');
        
        if (uptimeEl) {
            let uptimeSeconds = parseInt(localStorage.getItem('systemUptime') || '0');
            setInterval(() => {
                uptimeSeconds++;
                localStorage.setItem('systemUptime', uptimeSeconds);
                const hours = Math.floor(uptimeSeconds / 3600);
                const minutes = Math.floor((uptimeSeconds % 3600) / 60);
                const seconds = uptimeSeconds % 60;
                uptimeEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }, 1000);
        }
        
        if (networkEl) {
            const checkNetwork = () => {
                const isOnline = navigator.onLine;
                networkEl.textContent = isOnline ? 'ONLINE' : 'OFFLINE';
                networkEl.style.color = isOnline ? 'var(--neon-green)' : 'var(--neon-red)';
            };
            checkNetwork();
            setInterval(checkNetwork, 5000);
            window.addEventListener('online', checkNetwork);
            window.addEventListener('offline', checkNetwork);
        }
    };
    
    // Inicializar stats do dashboard após um delay para garantir que o layout.js já carregou
    setTimeout(() => {
        if (document.getElementById('system-uptime')) {
            window.initDashboardStats();
        }
    }, 500);

    // --- 4. MONITORAMENTO (Ping e Geo) ---
    obterLocalizacaoReal();
    function obterLocalizacaoReal() {
        const locDisplay = document.getElementById('panel-geo');
        if (!locDisplay) return;

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    let city = data.address.city || data.address.town || data.address.municipality || "BR";
                    let state = data.address.state_district || data.address.state || "";
                    if(state) city += ` - ${state.substring(0,2).toUpperCase()}`;
                    locDisplay.textContent = city.toUpperCase();
                } catch (e) {
                    locDisplay.textContent = "BR (GPS)";
                }
            }, () => locDisplay.textContent = "BR (N/A)");
        } else {
            locDisplay.textContent = "BR (N/A)";
        }
    }

    function medirPing() {
        const start = Date.now();
        const pingDisplay = document.getElementById('panel-ping');
        const dot = document.getElementById('panel-status-dot');
        const txt = document.getElementById('panel-status-text');

        fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
            .then(() => {
                const latency = Date.now() - start;
                if(pingDisplay) {
                    pingDisplay.textContent = `${latency}ms`;
                    pingDisplay.style.color = latency < 300 ? 'var(--neon-green)' : 'var(--neon-yellow)';
                }
                if(dot && txt) {
                    if(latency < 300) {
                        dot.className = 'status-led status-green';
                        txt.textContent = 'ONLINE';
                        txt.style.color = 'var(--neon-green)';
                    } else {
                        dot.className = 'status-led status-yellow';
                        txt.textContent = 'INSTÁVEL';
                        txt.style.color = 'var(--neon-yellow)';
                    }
                }
            })
            .catch(() => {
                if(pingDisplay) { pingDisplay.textContent = 'OFF'; pingDisplay.style.color = 'var(--neon-red)'; }
                if(dot && txt) {
                    dot.className = 'status-led status-red';
                    txt.textContent = 'OFFLINE';
                    txt.style.color = 'var(--neon-red)';
                }
            });
    }
    setInterval(medirPing, 5000);
    setTimeout(medirPing, 1000);

    // Tempo de uso removido conforme solicitado
});
