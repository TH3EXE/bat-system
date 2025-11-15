// js/fraseologia.js
// Lógica carregada APENAS na página fraseologia.html

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENTOS DA PÁGINA DE FRASEOLOGIA ---
    const copyButton = document.getElementById('copy-fraseologia-button');
    const outputFraseologiaText = document.getElementById('fraseologia-output');

    // Sub-Abas
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanels = document.querySelectorAll('.sub-tab-panel');

    // Painel Negativas
    const selectNegativas = document.getElementById('select-negativas');
    const inputsNegativasDiv = document.getElementById('inputs-negativas');
    // Painel Autorização
    const inputsAutorizacaoDiv = document.getElementById('inputs-autorizacao');
    // Painel Finalização
    const selectFinalizacao = document.getElementById('select-finalizacao');
    const inputsFinalizacaoDiv = document.getElementById('inputs-finalizacao');
    // Botões de Gerar
    const btnsGerar = document.querySelectorAll('.btn-gerar');

    // --- 2. INICIALIZAÇÃO DA PÁGINA ---
    function initFraseologia() {
        if (!copyButton) return; // Garante que estamos na página certa

        console.log("Página de Fraseologia Inicializada.");
        initFraseologiaTabs(); 
        setupEventListenersFraseologia();
    }

    function setupEventListenersFraseologia() {
        // Lógica de clique nas Sub-Abas
        subTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSubTabId = button.dataset.subtab;
                subTabButtons.forEach(btn => btn.classList.remove('active'));
                subTabPanels.forEach(panel => panel.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(targetSubTabId).classList.add('active');
                outputFraseologiaText.value = ''; // Limpa o output
            });
        });

        // Eventos de mudança dos Selects
        selectNegativas.addEventListener('change', () => {
            const chave = selectNegativas.value;
            prepararInputsDinamicos(DADOS_RESTRICOES[chave], inputsNegativasDiv, "negativas");
        });
        selectFinalizacao.addEventListener('change', () => {
            const chave = selectFinalizacao.value;
            prepararInputsDinamicos(FERRAMENTAS_FINALIZACAO[chave], inputsFinalizacaoDiv, "finalizacao");
        });
        
        // Listener para TODOS os botões "Gerar"
        btnsGerar.forEach(button => {
            button.addEventListener('click', gerarFraseologia);
        });

        // Listener do botão Copiar
        copyButton.addEventListener('click', copiarFraseologia);
    }

    // --- 3. FUNÇÕES DE FRASEOLOGIA ---

    // Função única de inicialização para todos os painéis
    function initFraseologiaTabs() {
        // Popula o dropdown de Negativas
        selectNegativas.innerHTML = '<option value="">Selecione uma negativa...</option>';
        for (const chave in DADOS_RESTRICOES) {
            const option = document.createElement('option');
            option.value = chave;
            option.textContent = DADOS_RESTRICOES[chave].nome;
            selectNegativas.appendChild(option);
        }

        // Popula o dropdown de Finalização
        selectFinalizacao.innerHTML = '<option value="">Selecione uma finalização...</option>';
        for (const chave in FERRAMENTAS_FINALIZACAO) {
            const option = document.createElement('option');
            option.value = chave;
            option.textContent = FERRAMENTAS_FINALIZACAO[chave].nome;
            selectFinalizacao.appendChild(option);
        }

        // Prepara o painel de Autorização
        const label = document.createElement('label');
        label.textContent = 'Quantos procedimentos?';
        
        const inputQtde = document.createElement('input');
        inputQtde.type = 'number';
        inputQtde.id = 'input-quantidade-procedimentos'; 
        inputQtde.value = '1';
        inputQtde.min = '1';

        const dynamicContainer = document.createElement('div');
        dynamicContainer.id = 'dynamic-procedure-inputs';

        inputQtde.addEventListener('change', popularInputsAutorizacao);
        
        inputsAutorizacaoDiv.appendChild(label);
        inputsAutorizacaoDiv.appendChild(inputQtde);
        inputsAutorizacaoDiv.appendChild(dynamicContainer);

        popularInputsAutorizacao(); // Popula pela primeira vez
    }

    // Função genérica para criar inputs (Negativas e Finalização)
    function prepararInputsDinamicos(item, containerDiv, tipo) {
        containerDiv.innerHTML = ''; 
        if (!item) return;

        if (item.campos && item.campos.length > 0) {
            item.campos.forEach(campo => {
                const nomeCampo = campo.replace(/[{}]/g, ''); 
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = `Preencha: ${nomeCampo}`;
                input.id = `input-${tipo}-${nomeCampo}`; 
                containerDiv.appendChild(input);
            });
        }
    }

    // =====================================
    // ATUALIZAÇÃO: Lógica dos Blocos Organizados
    // =====================================
    function popularInputsAutorizacao() {
        const container = document.getElementById('dynamic-procedure-inputs');
        container.innerHTML = ''; 

        const quantidade = document.getElementById('input-quantidade-procedimentos').value;
        if (quantidade < 1) return; 

        for (let i = 1; i <= quantidade; i++) {
            
            // 1. Cria o Bloco (div)
            const block = document.createElement('div');
            block.className = 'procedure-block'; // Adiciona a nova classe CSS
            
            // 2. Cria o Label (Procedimento 1:)
            const groupLabel = document.createElement('label');
            groupLabel.textContent = `Procedimento ${i}:`;
            
            // 3. Cria os 3 Inputs
            const inputProc = document.createElement('input');
            inputProc.type = 'text';
            inputProc.id = `input-autorizacao-procedimento-${i}`;
            inputProc.placeholder = `Nome do Procedimento ${i}`;

            const inputSenha = document.createElement('input');
            inputSenha.type = 'text';
            inputSenha.id = `input-autorizacao-senha-${i}`;
            inputSenha.placeholder = `Senha ${i}`;

            const inputPrest = document.createElement('input');
            inputPrest.type = 'text';
            inputPrest.id = `input-autorizacao-prestador-${i}`;
            inputPrest.placeholder = `Prestador ${i}`;
            
            // 4. Adiciona tudo DENTRO do bloco
            block.appendChild(groupLabel);
            block.appendChild(inputProc);
            block.appendChild(inputSenha);
            block.appendChild(inputPrest);
            
            // 5. Adiciona o bloco pronto ao container
            container.appendChild(block);
        }
    }

    // Função única que gera a fraseologia
    function gerarFraseologia(event) {
        const tipo = event.target.dataset.tipo; 
        let textoGerado = '';

        try {
            switch (tipo) {
                case 'negativas': {
                    const chave = selectNegativas.value;
                    if (!chave) throw new Error('Selecione uma negativa.');
                    
                    const item = DADOS_RESTRICOES[chave];
                    textoGerado = item.fraseologia;

                    if (item.campos && item.campos.length > 0) {
                        item.campos.forEach(campo => {
                            const nomeCampo = campo.replace(/[{}]/g, '');
                            const inputValor = document.getElementById(`input-negativas-${nomeCampo}`).value;
                            if (!inputValor) throw new Error(`Preencha o campo: ${nomeCampo}`);
                            
                            const regex = new RegExp(campo.replace('{', '\\{').replace('}', '\\}'), 'g');
                            textoGerado = textoGerado.replace(regex, inputValor.toUpperCase());
                        });
                    }
                    break;
                }

                case 'autorizacao': {
                    const item = FRASEOLOGIA_POSITIVA;
                    const quantidade = document.getElementById('input-quantidade-procedimentos').value;
                    
                    textoGerado = item.header; 
                    let corpoFraseologia = '';

                    for (let i = 1; i <= quantidade; i++) {
                        const proc = document.getElementById(`input-autorizacao-procedimento-${i}`).value.toUpperCase();
                        const senha = document.getElementById(`input-autorizacao-senha-${i}`).value.toUpperCase();
                        const prest = document.getElementById(`input-autorizacao-prestador-${i}`).value.toUpperCase();
                        
                        if (!proc || !senha || !prest) throw new Error(`Preencha todos os campos do Procedimento ${i}.`);

                        corpoFraseologia += `\nPROCEDIMENTO: ${proc}\nSENHA: ${senha}\nPRESTADOR: ${prest}`;
                        if (i < quantidade) {
                            corpoFraseologia += "\n=================";
                        }
                    }

                    textoGerado += corpoFraseologia; 
                    textoGerado += item.footer; 
                    break;
                }

                case 'finalizacao': {
                    const chave = selectFinalizacao.value;
                    if (!chave) throw new Error('Selecione uma finalização.');

                    const item = FERRAMENTAS_FINALIZACAO[chave];
                    textoGerado = item.fraseologia;

                    if (item.campos && item.campos.length > 0) {
                        item.campos.forEach(campo => {
                            const nomeCampo = campo.replace(/[{}]/g, '');
                            const inputValor = document.getElementById(`input-finalizacao-${nomeCampo}`).value;
                            if (!inputValor) throw new Error(`Preencha o campo: ${nomeCampo}`);
                            
                            const regex = new RegExp(campo.replace('{', '\\{').replace('}', '\\}'), 'g');
                            textoGerado = textoGerado.replace(regex, inputValor.toUpperCase());
                        });
                    }
                    break;
                }

                case 'reembolso': {
                    textoGerado = FERRAMENTAS_TEXTO.REEMBOLSO.fraseologia;
                    break;
                }
            }
            
            outputFraseologiaText.value = textoGerado.trim();

        } catch (error) {
            alert(error.message); // Mostra um alerta se um campo não for preenchido
        }
    }

    function copiarFraseologia() {
        const texto = outputFraseologiaText.value;
        if (!texto) return;

        navigator.clipboard.writeText(texto).then(() => {
            alert('Texto copiado para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar texto:', err);
            alert('Erro ao copiar.');
        });
    }

    // --- 4. INICIA A PÁGINA ---
    initFraseologia();

});