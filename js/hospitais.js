// js/hospitais.js
// Lógica para a página hospitais.html
// (Controle das Sub-Abas + Lógica de Pesquisa)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENTOS DA PÁGINA ---
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanels = document.querySelectorAll('.sub-tab-panel');
    
    // Elementos da Pesquisa
    const searchInput = document.getElementById('hospitais-search-input');
    const noResultsMsg = document.getElementById('hospitais-no-results');

    if (!searchInput) return; // Sai se não estiver na página certa

    // --- 2. FUNÇÕES ---

    // Função para normalizar strings (remove acentos, minúsculas)
    function normalizarString(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Função principal de filtro (em tempo real)
    function filtrarTabelasAtivas() {
        const searchTerm = normalizarString(searchInput.value);
        let matchesFound = 0;

        // 1. Descobre qual aba está ativa
        // ATUALIZAÇÃO: Seletor agora busca qualquer painel ativo
        const activePanel = document.querySelector('.sub-tab-panel.active');
        if (!activePanel) return; 
        
        // 2. Pega todas as linhas (tr) APENAS da tabela ativa
        const rows = activePanel.querySelectorAll("tbody tr");

        // 3. Filtra as linhas
        rows.forEach(row => {
            const rowText = normalizarString(row.textContent);
            
            // Verifica se o texto da linha inclui o termo pesquisado
            if (searchTerm === '' || rowText.includes(searchTerm)) {
                row.style.display = ""; // Mostra a linha
                matchesFound++;
            } else {
                row.style.display = "none"; // Esconde a linha
            }
        });

        // 4. Mostra ou esconde a mensagem "Nenhum resultado"
        if (matchesFound === 0 && searchTerm !== '') {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }
    }

    // --- 3. EVENT LISTENERS ---

    // Adiciona o evento de 'input' (tempo real) à barra de pesquisa
    searchInput.addEventListener('input', filtrarTabelasAtivas);

    // Adiciona o evento de clique nas Sub-Abas
    subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSubTabId = button.dataset.subtab;

            // Troca as abas
            subTabButtons.forEach(btn => btn.classList.remove('active'));
            subTabPanels.forEach(panel => panel.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(targetSubTabId).classList.add('active');

            // Limpa a pesquisa anterior e refiltra
            // searchInput.value = ''; // Opcional: descomente para limpar
            filtrarTabelasAtivas();
        });
    });
    
    // Roda o filtro uma vez no início (para o caso de a pesquisa estar preenchida)
    filtrarTabelasAtivas();
});
function copyCardInfo() {
    const card = document.getElementById('card-hospital');
    const title = card.querySelector('h3').innerText;
    const items = card.querySelectorAll('.info-list li');
    
    let textToCopy = `${title}\n${'-'.repeat(25)}\n`;
    
    items.forEach(item => {
        // Limpa espaços extras para manter a formatação bonita
        textToCopy += item.innerText.replace(/\n/g, ' ').trim() + '\n';
    });

    navigator.clipboard.writeText(textToCopy).then(() => {
        const btn = card.querySelector('.btn-copy');
        const originalText = btn.innerText;
        
        btn.innerText = "✓ Copiado!";
        btn.classList.add('success');
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('success');
        }, 2000);
    });
}

function copyCardInfo(button) {
    // Localiza o card pai do botão que foi clicado
    const card = button.closest('.prestador-card');
    
    // Captura o título
    const title = card.querySelector('h3').innerText;
    
    // Captura todos os itens da lista
    const items = card.querySelectorAll('.info-list li');
    
    // Monta o texto formatado
    let textToCopy = `📋 DADOS DO PRESTADOR\n`;
    textToCopy += `---------------------------\n`;
    textToCopy += `NOME: ${title}\n`;
    
    items.forEach(item => {
        textToCopy += item.innerText.trim() + '\n';
    });

    // Função de cópia com suporte a navegadores antigos (fallback)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showFeedback(button);
        });
    } else {
        // Fallback usando um elemento temporário
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showFeedback(button);
        } catch (err) {
            console.error('Erro ao copiar', err);
        }
        document.body.removeChild(textArea);
    }
}

// Altera o visual do botão por 2 segundos para confirmar a cópia
function showFeedback(btn) {
    const originalText = btn.innerText;
    btn.innerText = "✓ COPIADO COM SUCESSO!";
    btn.classList.add('success');
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove('success');
    }, 2000);
}
