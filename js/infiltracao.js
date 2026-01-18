// js/infiltracao.js
// Lógica para a página infiltracao.html (Versão com Sub-Abas) 

document.addEventListener('DOMContentLoaded', () => {

    // Pega os elementos da página
    const searchInput = document.getElementById('prestador-search-input');
    const noResultsMsg = document.getElementById('prestador-no-results');
    
    // Elementos das Sub-abas
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanels = document.querySelectorAll('.sub-tab-panel');

    if (!searchInput) return; // Sai se não estiver na página certa

    // Função para normalizar strings (remove acentos, minúsculas)
    function normalizarString(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // =====================================
    // ATUALIZAÇÃO: Função de filtro corrigida
    // =====================================
    function filtrarTabelaAtiva() {
        const searchTerm = normalizarString(searchInput.value);
        let matchesFound = 0;

        // 1. CORREÇÃO: O seletor estava errado. 
        //    Este seletor agora encontra corretamente o painel ativo (SP ou RJ).
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
        // (A lógica antiga que escondia a seção inteira foi removida)
        if (matchesFound === 0 && searchTerm !== '') {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }
    }

    // Adiciona o evento de 'input' (tempo real) à barra de pesquisa
    searchInput.addEventListener('input', filtrarTabelaAtiva);

    // Adiciona o evento de clique nas Sub-Abas
    subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSubTabId = button.dataset.subtab;

            // Troca as abas
            subTabButtons.forEach(btn => btn.classList.remove('active'));
            subTabPanels.forEach(panel => panel.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(targetSubTabId).classList.add('active');

            // Limpa a pesquisa anterior e refiltra (para mostrar a tabela completa)
            // searchInput.value = ''; // Opcional: descomente para limpar a pesquisa ao trocar de aba
            filtrarTabelaAtiva();
        });
    });
});