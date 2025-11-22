// js/global.js
// Lógica Global: 2 Menus (Sistema e Usuário), Status e Tempo

document.addEventListener('DOMContentLoaded', () => {

    // 1. VERIFICAÇÃO DE LOGIN
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');
    
    if (!userRole && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
        window.location.href = 'index.html';
        return;
    }

    // 2. CONSTRUÇÃO DO HEADER (BOTÕES E MENUS)
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
        userMenu.innerHTML = `
            <button class="menu-toggle app-button" id="btn-config">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="16" height="16"><path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-46.5 0-69.7l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14.2L465.6 93.3c-1.6-5.6-7.2-9.2-13.1-8.1l-48.4 11.1c-14.3-11.2-29.8-20.7-46.3-28.1L347 11.2C345.8 5.4 340.2 1 334.2 1H177.8c-6 0-11.6 4.4-12.8 10.2L154.2 68.1C137.7 75.5 122.2 85 107.9 96.2L59.5 85.1c-5.9-1.1-11.5 2.5-13.1 8.1L19 182.5c-1.6 5.6.6 11.4 5.5 14.2l42.6 24.6c-4.3 23.2-4.3 46.5 0 69.7l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14.2l27.1 89.2c1.6 5.6 7.2 9.2 13.1 8.1l48.4-11.1c14.3 11.2 29.8 20.7 46.3 28.1l10.8 56.9c1.2 5.8 6.8 10.2 12.8 10.2h156.4c6 0 11.6-4.4 12.8-10.2l10.8-56.9c16.5-7.4 32-16.9 46.3-28.1l48.4 11.1c5.9 1.1 11.5-2.5 13.1-8.1l27.1-89.2c1.6-5.6-.6-11.4-5.5-14.2zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/></svg>
                <span class="menu-toggle-text">CONFIGURAÇÕES</span>
            </button>
            <div class="dropdown-content" id="user-dropdown">
                <div class="user-info-item"><span>OPERADOR:</span><strong id="user-name">${userName || '...'}</strong></div>
                <div class="user-info-item"><span>ENTRADA:</span><strong id="login-time">...</strong></div>
                <div class="user-info-item"><span>SESSÃO:</span><strong id="session-timer">00:00:00</strong></div>
                <div class="user-info-item"><span>TEMPO TOTAL:</span><strong id="total-time">...</strong></div>
                <button id="logout-button" class="app-button">SAIR</button>
            </div>
        `;

        actionsContainer.appendChild(sysMenu);
        actionsContainer.appendChild(userMenu);
        header.appendChild(actionsContainer);

        setupMenuEvents();
    }

    // --- 3. LÓGICA DOS MENUS ---
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
    }

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

    // --- 5. TEMPO DE USO ---
    const loginTimeEl = document.getElementById('login-time');
    const totalTimeEl = document.getElementById('total-time');
    const sessionTimerEl = document.getElementById('session-timer');

    if (loginTimeEl) loginTimeEl.textContent = sessionStorage.getItem('sessionStartTime') || new Date().toLocaleTimeString();
    if (!sessionStorage.getItem('sessionStartTime')) sessionStorage.setItem('sessionStartTime', new Date().toLocaleString());

    let totalUsageSeconds = parseInt(localStorage.getItem('totalUsageSeconds') || '0');
    let currentSessionSeconds = 0;

    setInterval(() => {
        currentSessionSeconds++;
        if (sessionTimerEl) sessionTimerEl.textContent = formatTimeHMS(currentSessionSeconds);
        
        totalUsageSeconds++;
        if (totalUsageSeconds % 5 === 0) localStorage.setItem('totalUsageSeconds', totalUsageSeconds);
        
        if (totalTimeEl) totalTimeEl.textContent = formatTimeHours(totalUsageSeconds);
    }, 1000);

    function formatTimeHMS(s) {
        const h = String(Math.floor(s / 3600)).padStart(2, '0');
        const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
        const sec = String(Math.floor(s % 60)).padStart(2, '0');
        return `${h}:${m}:${sec}`;
    }
    function formatTimeHours(s) {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        return `${h}h ${m}m`;
    }
});