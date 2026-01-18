// js/medicamentos.js
// Lógica para ler a planilha BATMAN2.xlsx com ORDEM EXATA E PAGINAÇÃO NUMÉRICA 

document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURAÇÃO ---
    const EXCEL_FILE_NAME = 'BATMAN2.xlsx'; 
    const ITEMS_PER_PAGE = 10;

    // SEQUÊNCIA EXATA SOLICITADA
    const PRIORITY_COLUMNS = [
        'MEDICAÇÃO', 
        'MEDICAMENTO',
        'NOME DA MEDICAÇÃO',
        
        'UNIDADE',
        
        'FORMA DE APLICAÇÃO',
        'FORMA DE APLICACAO',
        
        'TUSS',
        'PRIMEIRA OPCAO',
        
        'CODIGO 02',
        'CODIGO 03',
        'CODIGO 04',
        'CODIGO 05'
    ];

    // Elementos
    const selectAba = document.getElementById('select-aba');
    const searchTermInput = document.getElementById('search-term');
    const searchButton = document.getElementById('search-button');
    const searchStatus = document.getElementById('search-status');
    const reloadBtn = document.getElementById('reload-excel-btn');
    
    const tableHead = document.getElementById('tabela-head');
    const tableBody = document.getElementById('tabela-body');
    const paginationControls = document.getElementById('pagination-controls');

    // Variáveis
    let workbook = null;
    let currentSheetData = []; 
    let filteredData = [];      
    let currentPage = 1;

    if (!selectAba) return;

    // --- INICIALIZAÇÃO ---
    initExcelLoader();

    function initExcelLoader() {
        loadSpecificExcelFile();
        setupEventListeners();
    }

    function setupEventListeners() {
        searchButton.addEventListener('click', () => aplicarFiltro());
        
        searchTermInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') aplicarFiltro();
        });

        selectAba.addEventListener('change', (e) => {
            const sheetName = e.target.value;
            if (sheetName && workbook) {
                carregarDadosDaAba(sheetName);
            } else {
                currentSheetData = [];
                filteredData = [];
                renderTable();
                searchStatus.innerHTML = '<p>Selecione uma aba para começar.</p>';
            }
        });

        reloadBtn.addEventListener('click', () => {
            location.reload(true);
        });
    }

    // --- CARREGAMENTO ---
    async function loadSpecificExcelFile() {
        searchStatus.innerHTML = `<p style="color: var(--batman-yellow);">Carregando ${EXCEL_FILE_NAME}...</p>`;
        selectAba.innerHTML = '<option>Carregando...</option>';
        selectAba.disabled = true;

        const timeStamp = new Date().getTime();
        const fileUrl = `${EXCEL_FILE_NAME}?v=${timeStamp}`;

        try {
            const response = await fetch(fileUrl, { cache: "no-store" });
            
            if (!response.ok) {
                throw new Error(`Arquivo ${EXCEL_FILE_NAME} não encontrado na raiz.`);
            }

            const arrayBuffer = await response.arrayBuffer();
            workbook = XLSX.read(arrayBuffer, { type: 'array' });

            populateSheetMenu(workbook.SheetNames);
            
            searchStatus.innerHTML = '<p style="color: var(--neon-green);">Planilha carregada! Selecione a categoria.</p>';
            if(window.atualizarStatusSistema) window.atualizarStatusSistema('stable');

        } catch (error) {
            console.error("Erro Excel:", error);
            searchStatus.innerHTML = `<p style="color: var(--neon-red);">ERRO: ${error.message}</p>`;
            selectAba.innerHTML = '<option>Erro</option>';
            if(window.atualizarStatusSistema) window.atualizarStatusSistema('offline');
        }
    }

    function populateSheetMenu(sheetNames) {
        selectAba.innerHTML = '<option value="">-- Selecione a Categoria --</option>';
        sheetNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            selectAba.appendChild(option);
        });
        selectAba.disabled = false;
    }

    // --- PROCESSAMENTO ---
    function carregarDadosDaAba(sheetName) {
        const worksheet = workbook.Sheets[sheetName];
        currentSheetData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        
        if (currentSheetData.length === 0) {
            searchStatus.innerHTML = '<p style="color: var(--neon-yellow);">Aba vazia.</p>';
        } else {
            searchStatus.innerHTML = `<p>Categoria <strong>${sheetName}</strong> carregada. ${currentSheetData.length} medicamentos.</p>`;
        }

        filteredData = [...currentSheetData];
        currentPage = 1;
        searchTermInput.value = ''; 
        
        renderTable();
    }

    // --- HELPERS ---
    function normalizarString(str) {
        if (!str) return '';
        return String(str).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    // --- FILTRO ---
    function aplicarFiltro() {
        const termo = normalizarString(searchTermInput.value);
        
        if (!termo) {
            filteredData = [...currentSheetData];
        } else {
            filteredData = currentSheetData.filter(row => {
                const rowString = Object.values(row).join(' ');
                return normalizarString(rowString).includes(termo);
            });
        }
        
        currentPage = 1;
        searchStatus.innerHTML = `<p>Exibindo ${filteredData.length} medicamentos.</p>`;
        renderTable();
    }

    // --- TABELA ---
    function renderTable() {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        paginationControls.style.display = 'none';

        if (filteredData.length === 0) {
            if (currentSheetData.length > 0) {
                tableBody.innerHTML = '<tr><td colspan="100%" style="text-align:center;">Nenhum resultado encontrado.</td></tr>';
            }
            return;
        }

        const rawKeys = Object.keys(filteredData[0]);
        const validKeys = rawKeys.filter(key => !key.startsWith('__EMPTY'));

        const colunasOrdenadas = validKeys.sort((a, b) => {
            const normA = normalizarString(a);
            const normB = normalizarString(b);
            let indexA = PRIORITY_COLUMNS.findIndex(p => normA.includes(normalizarString(p)));
            let indexB = PRIORITY_COLUMNS.findIndex(p => normB.includes(normalizarString(p)));

            if (indexA === -1) indexA = 99;
            if (indexB === -1) indexB = 99;
            
            if (indexA !== indexB) return indexA - indexB;
            return normA.localeCompare(normB);
        });

        const trHead = document.createElement('tr');
        colunasOrdenadas.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.toUpperCase();
            
            const normCol = normalizarString(col);
            if (normCol.includes('CODIGO') || normCol.includes('UNIDADE') || normCol.includes('FORMA') || normCol.includes('TUSS') || normCol.includes('OPCAO')) {
                th.classList.add('text-center');
            }
            trHead.appendChild(th);
        });
        tableHead.appendChild(trHead);

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const pageData = filteredData.slice(startIndex, endIndex);

        pageData.forEach(row => {
            const tr = document.createElement('tr');
            colunasOrdenadas.forEach(col => {
                const td = document.createElement('td');
                let val = row[col];
                
                td.textContent = val;
                
                const normCol = normalizarString(col);
                if (normCol.includes('CODIGO') || normCol.includes('UNIDADE') || normCol.includes('FORMA') || normCol.includes('TUSS') || normCol.includes('OPCAO')) {
                    td.classList.add('text-center');
                    if (!val || val === '' || val === '*') {
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

    // --- NOVA LÓGICA DE PAGINAÇÃO (NUMÉRICA) ---
    function renderPagination() {
        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        if (totalPages <= 1) return;

        paginationControls.innerHTML = '';
        paginationControls.style.display = 'flex';

        // Botão Anterior
        const btnPrev = createPageButton('Anterior', () => {
            if (currentPage > 1) { currentPage--; renderTable(); }
        });
        if (currentPage === 1) btnPrev.disabled = true;
        paginationControls.appendChild(btnPrev);

        // Lógica dos Números (Janela deslizante)
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

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

        // Botão Próxima
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