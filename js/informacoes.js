// js/informacoes.js
// Lógica e dados para a página informacoes.html

// --- BASE DE DADOS DAS INFORMAÇÕES BÁSICAS ---
const INFO_DATA = [
    {
        "FLUXO": "PROCEDIMENTO NÃO IDENTIFICADO EM GUIA",
        "CODIGO": "1990047",
        "OBSERVACAO": "A DEFINIR",
        "OBSERVACAO_02": "PROCEDIMENTO DESCRITO NA GUIA DE FORMA ILEGÍVEL OU FORA DO PADRÃO."
    },
    {
        "FLUXO": "GUIA INCOMPLETA",
        "CODIGO": "80223923",
        "OBSERVACAO": "GUIA COM FALTA DE INFORMAÇÃO",
        "OBSERVACAO_02": "EXEMPLO> GUIA APRESENTADA SEM DADOS OBRIGATÓRIOS COMO CARIMBO, CRM, NOME DO MÉDICO SOLICITANTE, NOME DO BENEFICIÁRIO E/OU ASSINATURA DO MÉDICO. NECESSÁRIO REENVIO COM TODAS AS INFORMAÇÕES PREENCHIDAS CORRETAMENTE."
    },
    {
        "FLUXO": "MÉDICO NÃO LOCALIZADO BASE HAPVIDA",
        "CODIGO": "99800147330",
        "OBSERVACAO": "TRANSCRIÇÃO – USADA NA BASE HAPVIDA",
        "OBSERVACAO_02": "MÉDICO SOLICITANTE NÃO IDENTIFICADO NA BASE HAPVIDA. REGISTRO LANÇADO COMO TRANSCRIÇÃO PARA CONTROLE INTERNO. RECOMENDADO CONFIRMAR OU ATUALIZAR OS DADOS DO PROFISSIONAL."
    },
    {
        "FLUXO": "MÉDICO NÃO LOCALIZADO NA BASE NDI – SP",
        "CODIGO": "1187 / 259990739",
        "OBSERVACAO": "TRANSCRIÇÃO – USADA NA BASE NDI – SÃO PAULO",
        "OBSERVACAO_02": "MÉDICO SOLICITANTE NÃO IDENTIFICADO NA BASE NDI - SÃO PAULO. LANÇADO COMO TRANSCRIÇÃO."
    },
    {
        "FLUXO": "MÉDICO NÃO LOCALIZADO NA BASE NDI – RJ",
        "CODIGO": "41231 / 25999542",
        "OBSERVACAO": "TRANSCRIÇÃO – USADA NA BASE NDI – RIO DE JANEIRO",
        "OBSERVACAO_02": "MÉDICO SOLICITANTE NÃO IDENTIFICADO NA BASE NDI - RIO DE JANEIRO. LANÇADO COMO TRANSCRIÇÃO."
    },
    {
        "FLUXO": "INTERNAÇÃO CLÍNICA – GERAL E CLÍNICA MÉDICA",
        "CODIGO": "01990004",
        "OBSERVACAO": "TELA INTERNAÇÃO",
        "OBSERVACAO_02": "EXEMPLO> PROCEDIMENTO DIRECIONADO PARA AMBIENTE HOSPITALAR VIA TELA DE INTERNAÇÃO. EXEMPLO COMUM: ENDOSCOPIA COM NECESSIDADE DE ESTRUTURA CLÍNICA/HOSPITALAR. AVALIAÇÃO MÉDICA OBRIGATÓRIA PARA AUTORIZAÇÃO."
    },
    {
        "FLUXO": "BUSCA DE PRESTADOR",
        "CODIGO": "72184571000134",
        "OBSERVACAO": "CREDENCIAMENTO MÉDICO",
        "OBSERVACAO_02": "EXEMPLO> SOLICITAÇÃO RELACIONADA À AUSÊNCIA DE PRESTADOR CREDENCIADO PARA DETERMINADA REGIÃO. PROCEDIMENTO CLASSIFICADO COMO BUSCA ATIVA PARA VIABILIZAR ATENDIMENTO NA LOCALIDADE INFORMADA."
    },
    {
        "FLUXO": "TELECONSULTA DIGITAL",
        "CODIGO": "127304670",
        "OBSERVACAO": "TELECONSULTA",
        "OBSERVACAO_02": "EXEMPLO> SOLICITAÇÃO REFERE-SE À TROCA DE PRESTADOR PARA REALIZAÇÃO VIA TELECONSULTA. ENCAMINHADO CONFORME DISPONIBILIDADE DA REDE DIGITAL PARA ATENDIMENTO REMOTO."
    }
];
// --- FIM DA BASE DE DADOS ---


document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('info-search-input');
    const infoContainer = document.getElementById('info-container');
    const noResultsMsg = document.getElementById('info-no-results');

    if (!searchInput) return; // Garante que estamos na página correta

    // Adiciona o evento de 'input' (tempo real) à barra de pesquisa
    searchInput.addEventListener('input', renderInfoBlocos);

    // Função para normalizar strings (remove acentos, minúsculas)
    function normalizarString(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Função para destacar o texto da pesquisa
    function highlightText(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, `<mark class="highlight">$1</mark>`);
    }

    // Função principal para desenhar os blocos na tela
    function renderInfoBlocos() {
        const searchTerm = normalizarString(searchInput.value);
        
        // Limpa o container
        infoContainer.innerHTML = '';
        let matchesFound = 0;

        // Loop sobre os dados
        INFO_DATA.forEach(item => {
            const fluxo = item.FLUXO;
            const codigo = item.CODIGO;
            const obs1 = item.OBSERVACAO;
            const obs2 = item.OBSERVACAO_02;
            
            // Combina todo o texto para pesquisar
            const fullText = normalizarString(`${fluxo} ${codigo} ${obs1} ${obs2}`);

            // Verifica se o termo de pesquisa está no bloco
            if (searchTerm === '' || fullText.includes(searchTerm)) {
                matchesFound++;

                // Cria o Bloco
                const bloco = document.createElement('div');
                bloco.className = 'info-bloco'; // Nova classe CSS
                
                // 1. Título (Fluxo)
                const titulo = document.createElement('h4');
                titulo.innerHTML = highlightText(fluxo, searchTerm);
                bloco.appendChild(titulo);

                // 2. Código
                const codigoBloco = document.createElement('div');
                codigoBloco.className = 'codigo-item'; // Reutiliza estilo
                codigoBloco.innerHTML = `
                    <span>CÓDIGO(S):</span>
                    <strong class="text-center">${highlightText(codigo, searchTerm)}</strong>
                `;
                bloco.appendChild(codigoBloco);

                // 3. Observação 1
                const obs1Bloco = document.createElement('div');
                obs1Bloco.className = 'info-item'; // Nova classe
                obs1Bloco.innerHTML = `
                    <span>OBSERVAÇÃO:</span>
                    <p>${highlightText(obs1, searchTerm)}</p>
                `;
                bloco.appendChild(obs1Bloco);
                
                // 4. Observação 2 (com estilo de destaque)
                const obs2Bloco = document.createElement('div');
                obs2Bloco.className = 'observacao-bloco'; // Reutiliza estilo
                obs2Bloco.innerHTML = `
                    <strong>OBSERVAÇÃO 02:</strong>
                    <p>${highlightText(obs2, searchTerm)}</p>
                `;
                bloco.appendChild(obs2Bloco);

                // Adiciona o bloco pronto ao container
                infoContainer.appendChild(bloco);
            }
        });
        
        // Mostra ou esconde a mensagem "Nenhum resultado"
        if (matchesFound === 0 && searchTerm !== '') {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }
    }
    
    // Renderiza todos os blocos na primeira vez que a página carrega
    renderInfoBlocos();
});