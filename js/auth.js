// js/auth.js

// Espera a página (index.html) carregar
document.addEventListener('DOMContentLoaded', () => {
    
    // Pega os elementos do HTML
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    // Se o usuário já está logado, manda ele direto para a página de busca
    // (Também corrigido de 'app.html' para 'busca.html')
    if (sessionStorage.getItem('userRole')) {
        window.location.href = 'busca.html';
        return;
    }

    // Evento de clique no botão "CONECTAR"
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const username = usernameInput.value;
        const password = passwordInput.value;

        // --- LÓGICA DE AUTENTICAÇÃO "FALSA" ---
        
        let userRole = null;

        if (username === 'BATMAN' && password === 'BATMAN666') {
            userRole = 'ADM'; // Define o papel como Administrador
        } else if (username === 'OPERADOR' && password === '123') {
            userRole = 'OPERADOR';
        }
        // Adicione mais operadores aqui...

        // -----------------------------------------

        if (userRole) {
            // SUCESSO!
            errorMessage.textContent = 'CONECTANDO...';
            
            sessionStorage.setItem('userRole', userRole);
            sessionStorage.setItem('userName', username);

            const loginTime = new Date().toLocaleString('pt-BR');
            localStorage.setItem('lastLoginTime', loginTime);

            let loginCount = parseInt(localStorage.getItem('loginCount') || '0');
            loginCount++;
            localStorage.setItem('loginCount', loginCount);

            // =========================================================
            // CORREÇÃO ESTÁ AQUI
            // O sistema agora redireciona para 'busca.html'
            // =========================================================
            window.location.href = 'busca.html';

        } else {
            // FALHA!
            errorMessage.textContent = 'ERRO: Operador ou Senha inválidos.';
            passwordInput.value = ''; // Limpa a senha
        }
    });
});