// js/busca.js
// Lógica carregada APENAS na página busca.html

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. VARIÁVEIS GLOBAIS DA BUSCA ---
    let dadosDaAbaAtual = [];
    let mapaAbas = {};

    // --- 2. ELEMENTOS DA PÁGINA DE BUSCA ---
    const selectAba = document.getElementById('select-aba');
    const searchTermInput = document.getElementById('search-term');
    const searchButton = document.getElementById('search-button');
    const searchStatus = document.getElementById('search-status');
    const resultsContainer = document.getElementById('results-container');
    const downloadLink = document.getElementById('download-planilha-link');

    // --- 3. INICIALIZAÇÃO DA PÁGINA DE BUSCA ---
    function initBusca() {
        if (!selectAba) return; // Garante que estamos na página certa

        console.log("Página de Busca Inicializada.");
        downloadLink.href = 'BATMAN.xlsx';
        carregarOpcoesDeAbas(); 
        setupEventListenersBusca();
    }

    function setupEventListenersBusca() {
        searchButton.addEventListener('click', executarBusca);
        searchTermInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') executarBusca();
        });
        selectAba.addEventListener('change', carregarDadosDaAba);
    }

    // --- 4. FUNÇÕES DE DADOS E BUSCA ---

    async function carregarOpcoesDeAbas() {
        selectAba.innerHTML = '<option value="">Carregando setores...</option>';

        try {
            const response = await fetch('data/manifest.json');
            if (!response.ok) {
                // Se o arquivo não for encontrado (Erro 404)
                throw new Error('manifest.json não encontrado (Erro 404)');
            }
            mapaAbas = await response.json();

            selectAba.innerHTML = '<option value="">Selecione um setor...</option>';

            for (const nomeAmigavel in mapaAbas) {
                const caminhoJson = mapaAbas[nomeAmigavel];
                
                const option = document.createElement('option');
                option.value = caminhoJson; 
                option.textContent = nomeAmigavel; 
                selectAba.appendChild(option);
            }
            // Chama a função global de status
            window.atualizarStatusSistema('stable');

        } catch (error) {
            console.error('Erro ao carregar manifesto:', error);
            
            // =====================================
            // ATUALIZAÇÃO: Nova Mensagem de Erro
            // =====================================
            let mensagemErro = `ERRO: Não foi possível carregar os dados (manifest.json).`;
            if (window.location.protocol === 'file:') {
                // Se estiver local (file://)
                mensagemErro += ` Por favor, use a extensão "Live Server".`;
            } else {
                // Se estiver no GitHub (https://)
                mensagemErro += ` Verifique se a pasta 'data' foi enviada ao GitHub.`;
            }
            
            selectAba.innerHTML = `<option value="">ERRO NOS DADOS</option>`;
            searchStatus.innerHTML = `<p>${mensagemErro}</p>`;
            window.atualizarStatusSistema('offline'); 
            // =====================================
            // FIM DA ATUALIZAÇÃO
            // =====================================
        }
    }
    
    async function carregarDadosDaAba() {
        const caminhoJson = selectAba.value;
        if (!caminhoJson) {
            dadosDaAbaAtual = [];
            return;
        }

        searchStatus.innerHTML = `<p>Carregando dados do setor '${selectAba.options[selectAba.selectedIndex].text}'...</p>`;
        window.atualizarStatusSistema('unstable'); 

        try {
            const response = await fetch(caminhoJson);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            dadosDaAbaAtual = await response.json(); 
            searchStatus.innerHTML = `<p>Dados carregados. Pronto para buscar em ${dadosDaAbaAtual.length} registros.</p>`;
            window.atualizarStatusSistema('stable'); 
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            searchStatus.innerHTML = `<p>Erro ao carregar dados do setor. Verifique o console.</p>`;
            window.atualizarStatusSistema('offline'); 
        }
    }

    function executarBusca() {
        const termo = searchTermInput.value.trim();
        const nomeAba = selectAba.options[selectAba.selectedIndex].text;

        if (!termo) {
            searchStatus.innerHTML = `<p>Por favor, digite um termo para buscar.</p>`;
            return;
        }
        if (dadosDaAbaAtual.length === 0) {
            searchStatus.innerHTML = `<p>Selecione um setor e espere os dados carregarem.</p>`;
            return;
        }

        searchStatus.innerHTML = `<p>Buscando por "${termo}" em "${nomeAba}"...</p>`;
        const startTime = performance.now(); 

        const termoNormalizado = normalizarString(termo);

        const resultados = dadosDaAbaAtual.filter(linha => {
            const valoresLinha = Object.values(linha).join(' ');
            const valoresNormalizados = normalizarString(valoresLinha);
            return valoresNormalizados.includes(termoNormalizado);
        });

        const endTime = performance.now();
        const tempoBusca = ((endTime - startTime) / 1000).toFixed(3);

        mostrarResultados(resultados, termo, tempoBusca);
    }

    function normalizarString(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function mostrarResultados(resultados, termo, tempo) {
        resultsContainer.innerHTML = ''; 

        if (resultados.length === 0) {
            searchStatus.innerHTML = `<p>Nenhum resultado encontrado para "${termo}". (Busca em ${tempo}s)</p>`;
            return;
        }

        searchStatus.innerHTML = `<p>${resultados.length} resultados encontrados para "${termo}". (Busca em ${tempo}s)</p>`;

        resultados.forEach(linha => {
            const card = document.createElement('div');
            card.className = 'result-card';
            
            let cardHTML = '';
            for (const chave in linha) {
                if (linha[chave] && linha[chave] !== 'nan') {
                    cardHTML += `<p><strong>${chave}:</strong> ${linha[chave]}</p>`;
                }
            }
            card.innerHTML = cardHTML;
            resultsContainer.appendChild(card);
        });
    }

    // --- 5. INICIA A PÁGINA ---
    initBusca();
});