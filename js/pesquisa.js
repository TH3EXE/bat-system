// js/pesquisa.js
// Lógica para ler MÚLTIPLOS arquivos Excel (BATMAN.xlsx, BATMAN1.xlsx, etc.)
// ATUALIZADO: Com sistema Anti-Cache para forçar a leitura de novos arquivos

document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURAÇÃO ---
    const BASE_FILENAME = 'BATMAN'; // Prefixo obrigatório dos arquivos
    const ITEMS_PER_PAGE = 10;

    // Colunas prioritárias na ordem solicitada
    const PRIORITY_COLUMNS = [
        'PROCEDIMENTO', 
        'ESPECIALIDADE', 
        'TUSS', 
        'AMB', 
        'OBSERVAÇÃO'
    ];

    // Elementos
    const selectAba = document.getElementById('select-aba');
    const searchTermInput = document.getElementById('search-term');
    const searchButton = document.getElementById('search-button');
    const searchStatus = document.getElementById('search-status');
    const resultsContainer = document.getElementById('results-container');
    const reloadBtn = document.getElementById('reload-excel-btn');
    
    const tableHead = document.getElementById('tabela-head');
    const tableBody = document.getElementById('tabela-body');
    const paginationControls = document.getElementById('pagination-controls');

    // Variáveis de Estado
    let allLoadedData = {}; 
    let currentSheetData = []; 
    let filteredData = [];      
    let currentPage = 1;

    if (!selectAba) return;

    // --- INICIALIZAÇÃO ---
    initExcelLoader();

    function initExcelLoader() {
        loadAllExcelFiles();
        setupEventListeners();
    }

    function setupEventListeners() {
        searchButton.addEventListener('click', () => aplicarFiltro());
        
        searchTermInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') aplicarFiltro();
        });

        selectAba.addEventListener('change', (e) => {
            const selection = e.target.value;
            if (selection && allLoadedData[selection]) {
                currentSheetData = allLoadedData[selection];
                filteredData = [...currentSheetData];
                currentPage = 1;
                searchTermInput.value = ''; 
                
                searchStatus.innerHTML = `<p>Base <strong>${selection}</strong> selecionada. ${currentSheetData.length} registros.</p>`;
                renderTable();
            } else {
                currentSheetData = [];
                filteredData = [];
                renderTable();
                searchStatus.innerHTML = '<p>Selecione uma base de dados para começar.</p>';
            }
        });

        reloadBtn.addEventListener('click', () => {
            // Recarrega forçando limpeza de cache
            location.reload(true);
        });
    }

    // --- CARREGAMENTO MÚLTIPLO DE ARQUIVOS ---
    async function loadAllExcelFiles() {
        searchStatus.innerHTML = '<p style="color: var(--batman-yellow);">Escaneando arquivos de dados...</p>';
        selectAba.innerHTML = '<option>Carregando...</option>';
        selectAba.disabled = true;

        let fileIndex = 0;
        let filesLoadedCount = 0;
        allLoadedData = {}; 

        // Timestamp para evitar cache (Força o navegador a buscar o arquivo novo)
        const timeStamp = new Date().getTime();

        // Loop infinito que para apenas quando não encontra o próximo arquivo
        while (true) {
            // Gera nomes: BATMAN.xlsx, BATMAN1.xlsx, BATMAN2.xlsx ...
            const fileNameBase = (fileIndex === 0) ? `${BASE_FILENAME}.xlsx` : `${BASE_FILENAME}${fileIndex}.xlsx`;
            
            // Adiciona código anti-cache na URL
            const fileUrl = `${fileNameBase}?v=${timeStamp}`;
            
            try {
                // Tenta buscar o arquivo
                const response = await fetch(fileUrl, { cache: "no-store" });
                
                // Se o arquivo não existe (Erro 404), paramos a busca
                if (!response.ok) {
                    if (fileIndex === 0) {
                        console.warn("Arquivo principal (BATMAN.xlsx) não encontrado.");
                    }
                    break; // Sai do loop
                }

                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                // Processa todas as abas deste arquivo
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                    
                    if (data.length > 0) {
                        // Cria um nome único: "NomeAba [Arquivo]"
                        const uniqueName = `${sheetName} [${fileNameBase}]`;
                        allLoadedData[uniqueName] = data;
                    }
                });

                console.log(`Carregado: ${fileNameBase}`);
                filesLoadedCount++;
                fileIndex++; // Tenta o próximo número (BATMAN1 -> BATMAN2...)

            } catch (error) {
                console.warn(`Parando leitura em ${fileNameBase}:`, error);
                break; 
            }
        }

        // Finalização
        if (filesLoadedCount > 0) {
            populateMenu();
            searchStatus.innerHTML = `<p style="color: var(--neon-green);">Sistema carregou ${filesLoadedCount} arquivo(s) automaticamente!</p>`;
            if (window.atualizarStatusSistema) window.atualizarStatusSistema('stable');
        } else {
            searchStatus.innerHTML = `<p style="color: var(--neon-red);">Nenhum arquivo de dados encontrado.</p>`;
            selectAba.innerHTML = '<option>Erro: Sem dados</option>';
            if (window.atualizarStatusSistema) window.atualizarStatusSistema('offline');
        }
    }

    function populateMenu() {
        selectAba.innerHTML = '<option value="">-- Selecione uma Base de Dados --</option>';
        
        const keys = Object.keys(allLoadedData);
        if (keys.length === 0) {
            selectAba.innerHTML = '<option value="">Nenhuma aba com dados encontrada</option>';
            return;
        }

        keys.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key; 
            selectAba.appendChild(option);
        });
        
        selectAba.disabled = false;
    }

    // --- FUNÇÕES DE BUSCA ---

    function normalizarString(str) {
        if (!str) return '';
        return String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function aplicarFiltro() {
        const termo = searchTermInput.value.toLowerCase().trim();
        
        if (!termo) {
            filteredData = [...currentSheetData];
        } else {
            filteredData = currentSheetData.filter(row => {
                const rowString = Object.values(row).join(' ').toLowerCase();
                const normalizedRow = rowString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const normalizedTerm = termo.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return normalizedRow.includes(normalizedTerm);
            });
        }
        
        currentPage = 1;
        searchStatus.innerHTML = `<p>Exibindo ${filteredData.length} resultados.</p>`;
        renderTable();
    }

    // --- RENDERIZAÇÃO DA TABELA ---
    function renderTable() {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        paginationControls.innerHTML = '';
        paginationControls.style.display = 'none';

        if (filteredData.length === 0) {
            if (currentSheetData.length > 0) {
                tableBody.innerHTML = '<tr><td colspan="100%" style="text-align:center;">Nenhum resultado encontrado.</td></tr>';
            }
            return;
        }

        // 1. Limpeza e Ordenação das Colunas
        const rawKeys = Object.keys(filteredData[0]);
        const validKeys = rawKeys.filter(key => !key.startsWith('__EMPTY'));

        const orderMap = {
            'PROCEDIMENTO': 1, 'PROCEDIMENTOS': 1,
            'ESPECIALIDADE': 2,
            'TUSS': 3,
            'AMB': 4,
            'OBSERVAÇÃO': 5, 'OBSERVACAO': 5, 'OBS': 5
        };

        const colunasOrdenadas = validKeys.sort((a, b) => {
            const ka = a.toUpperCase().trim();
            const kb = b.toUpperCase().trim();
            const rankA = orderMap[ka] || 99; 
            const rankB = orderMap[kb] || 99;
            return rankA - rankB;
        });

        // Gera Cabeçalho
        const trHead = document.createElement('tr');
        colunasOrdenadas.forEach(col => {
            const th = document.createElement('th');
            let displayName = col.toUpperCase();
            if(displayName === 'PROCEDIMENTOS') displayName = 'PROCEDIMENTO';
            
            th.textContent = displayName;
            
            if (['TUSS', 'AMB', 'ESPECIALIDADE'].includes(displayName)) {
                th.classList.add('text-center');
            }
            trHead.appendChild(th);
        });
        tableHead.appendChild(trHead);

        // 2. Paginação
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const pageData = filteredData.slice(startIndex, endIndex);

        // 3. Gera Linhas
        pageData.forEach(row => {
            const tr = document.createElement('tr');
            colunasOrdenadas.forEach(col => {
                const td = document.createElement('td');
                let val = row[col];
                td.textContent = val;
                
                const colUpper = col.toUpperCase();
                if (['TUSS', 'AMB', 'ESPECIALIDADE'].includes(colUpper)) {
                    td.classList.add('text-center');
                    if (!val || val === '') {
                        td.textContent = 'X';
                        td.classList.add('no-service');
                    }
                }
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });

        renderPagination();
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        if (totalPages <= 1) return;

        paginationControls.style.display = 'flex';

        const btnPrev = createPageButton('Anterior', () => {
            if (currentPage > 1) { currentPage--; renderTable(); }
        });
        if (currentPage === 1) btnPrev.disabled = true;
        paginationControls.appendChild(btnPrev);

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

        if (startPage > 1) {
            paginationControls.appendChild(createPageButton('1', () => { currentPage = 1; renderTable(); }));
            if (startPage > 2) {
                const span = document.createElement('span');
                span.textContent = '...';
                span.style.color = 'var(--batman-yellow)';
                span.style.alignSelf = 'center';
                paginationControls.appendChild(span);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = createPageButton(i, () => {
                currentPage = i;
                renderTable();
            });
            if (i === currentPage) btn.classList.add('active');
            paginationControls.appendChild(btn);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const span = document.createElement('span');
                span.textContent = '...';
                span.style.color = 'var(--batman-yellow)';
                span.style.alignSelf = 'center';
                paginationControls.appendChild(span);
            }
            paginationControls.appendChild(createPageButton(totalPages, () => { currentPage = totalPages; renderTable(); }));
        }

        const btnNext = createPageButton('Próxima', () => {
            if (currentPage < totalPages) { currentPage++; renderTable(); }
        });
        if (currentPage === totalPages) btnNext.disabled = true;
        paginationControls.appendChild(btnNext);
    }

    function createPageButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = 'page-btn'; 
        btn.addEventListener('click', onClick);
        return btn;
    }
});