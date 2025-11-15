// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    // Se já estiver logado, manda para a tela de apresentação
    if (sessionStorage.getItem('userRole')) {
        // ATUALIZADO: Aponta para a nova página de apresentação
        window.location.href = 'busca.html'; 
        return;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const username = usernameInput.value;
        const password = passwordInput.value;
        
        let userRole = null;

        if (username === 'BATMAN' && password === 'BATMAN666') {
            userRole = 'ADM';
        } else if (username === 'OPERADOR' && password === '123') {
            userRole = 'OPERADOR';
        }
        // ... (outros usuários)

        if (userRole) {
            errorMessage.textContent = 'CONECTANDO...';
            
            sessionStorage.setItem('userRole', userRole);
            sessionStorage.setItem('userName', username);

            const loginTime = new Date().toLocaleString('pt-BR');
            localStorage.setItem('lastLoginTime', loginTime);

            let loginCount = parseInt(localStorage.getItem('loginCount') || '0');
            loginCount++;
            localStorage.setItem('loginCount', loginCount);

            // ATUALIZADO: Aponta para a nova página de apresentação
            window.location.href = 'busca.html';

        } else {
            errorMessage.textContent = 'ERRO: Operador ou Senha inválidos.';
            passwordInput.value = ''; 
        }
    });
});