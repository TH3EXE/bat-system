// js/global.js
// Este script é carregado em TODAS as páginas (busca.html e fraseologia.html)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. VERIFICAÇÃO DE LOGIN ---
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');
    
    // Se não estiver logado, chuta de volta para o login
    if (!userRole) {
        window.location.href = 'index.html';
        return;
    }

    // --- 2. ELEMENTOS GLOBAIS (HEADER) ---
    const statusLight = document.getElementById('status-light');
    const userNameEl = document.getElementById('user-name');
    const loginTimeEl = document.getElementById('login-time'); // Para "ENTRADA"
    const loginCountEl = document.getElementById('login-count');
    const logoutButton = document.getElementById('logout-button'); // <-- Pega o botão SAIR
    const sessionTimerEl = document.getElementById('session-timer'); // Para "SESSÃO"

    // --- 3. INICIALIZAÇÃO ---
    
    // Preenche as informações do usuário no cabeçalho
    if (userNameEl) userNameEl.textContent = userName;
    if (loginTimeEl) loginTimeEl.textContent = localStorage.getItem('lastLoginTime') || 'N/A';
    if (loginCountEl) loginCountEl.textContent = localStorage.getItem('loginCount') || '1';

    // Inicia os timers
    iniciarTimers();

    // --- ATUALIZAÇÃO: Configura o botão de logout ---
    if (logoutButton) {
        logoutButton.addEventListener('click', fazerLogout); // <-- Adiciona o evento de clique
    }
    
    // --- 4. FUNÇÕES GLOBAIS ---
    
    // --- ATUALIZAÇÃO: Esta é a função que faz o logout ---
    function fazerLogout() {
        // 1. Limpa os dados da sessão (quem está logado)
        sessionStorage.clear(); 
        // 2. Redireciona o usuário de volta para a tela de login
        window.location.href = 'index.html';
    }
    
    // Função para formatar segundos em HH:MM:SS
    function formatTime(seconds) {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(Math.floor(seconds % 60)).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    // Lógica do timer de sessão (simplificada)
    function iniciarTimers() {
        let sessionSeconds = 0; 
        if (sessionTimerEl) sessionTimerEl.textContent = formatTime(sessionSeconds);
        
        setInterval(() => {
            sessionSeconds++; 
            if (sessionTimerEl) sessionTimerEl.textContent = formatTime(sessionSeconds);
        }, 1000);

        atualizarStatusSistema('stable');
    }

    // Função global de status
    window.atualizarStatusSistema = function(status) {
        if (!statusLight) return;
        statusLight.className = 'status-indicator'; 
        if (status === 'stable') {
            statusLight.classList.add('status-green');
            statusLight.title = 'Sistema Estável';
        } else if (status === 'unstable') {
            statusLight.classList.add('status-yellow');
            statusLight.title = 'Sistema com Instabilidade (Carregando...)';
        } else {
            statusLight.classList.add('status-red');
            statusLight.title = 'Sistema Fora do Ar (Erro)';
        }
    }
});