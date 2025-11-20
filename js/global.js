// js/global.js
// Lógica global e Menu de Configurações

// 1. DEFINIÇÃO GLOBAL (Para estar disponível imediatamente)
window.atualizarStatusSistema = function(status) {
    const statusLight = document.getElementById('status-light');
    if (!statusLight) return; // Se o elemento ainda não existir, ignora (segurança)

    statusLight.className = 'status-indicator'; // Reseta classes
    
    if (status === 'stable') {
        statusLight.classList.add('status-green');
        statusLight.title = 'Sistema Estável';
    } else if (status === 'unstable') {
        statusLight.classList.add('status-yellow');
        statusLight.title = 'Carregando / Instabilidade';
    } else {
        statusLight.classList.add('status-red');
        statusLight.title = 'Erro / Offline';
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // --- 2. VERIFICAÇÃO DE LOGIN ---
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');
    
    // Se não estiver na tela de login e não tiver usuário, manda pro login
    if (!userRole && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
        return;
    }

    // --- 3. ELEMENTOS GLOBAIS ---
    const userNameEl = document.getElementById('user-name');
    const loginTimeEl = document.getElementById('login-time');
    const loginCountEl = document.getElementById('login-count');
    const sessionTimerEl = document.getElementById('session-timer');
    const logoutButton = document.getElementById('logout-button');
    
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownContent = document.getElementById('user-menu-dropdown');

    // --- 4. PREENCHIMENTO DE DADOS ---
    if (userNameEl && userName) userNameEl.textContent = userName;
    if (loginTimeEl) loginTimeEl.textContent = localStorage.getItem('lastLoginTime') || 'N/A';
    if (loginCountEl) loginCountEl.textContent = localStorage.getItem('loginCount') || '1';

    // Timer da Sessão
    let sessionSeconds = 0; 
    if (sessionTimerEl) {
        setInterval(() => {
            sessionSeconds++; 
            const h = String(Math.floor(sessionSeconds / 3600)).padStart(2, '0');
            const m = String(Math.floor((sessionSeconds % 3600) / 60)).padStart(2, '0');
            const s = String(Math.floor(sessionSeconds % 60)).padStart(2, '0');
            sessionTimerEl.textContent = `${h}:${m}:${s}`;
        }, 1000);
    }

    // Define status inicial como estável
    window.atualizarStatusSistema('stable');

    // --- 5. EVENTOS (Menu e Logout) ---
    
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.clear(); 
            window.location.href = 'index.html';
        });
    }
    
    if (menuToggle && dropdownContent) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique feche o menu imediatamente
            dropdownContent.classList.toggle('active');
        });
        
        // Fecha ao clicar fora
        window.addEventListener('click', (e) => {
            if (dropdownContent.classList.contains('active')) {
                if (!dropdownContent.contains(e.target) && !menuToggle.contains(e.target)) {
                    dropdownContent.classList.remove('active');
                }
            }
        });
    }
});