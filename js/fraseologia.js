// js/fraseologia.js
// Lógica de Fraseologia (Port do mkacete.py)

document.addEventListener('DOMContentLoaded', () => {
    const subTabContainer = document.querySelector('.sub-tab-navigation');
    const outputTextarea = document.getElementById('fraseologia-output');
    const copyButton = document.getElementById('copy-fraseologia-button');
    const data = window.FRASEOLOGIAS_DATA;

    if (!subTabContainer || !data) return;

    initTabs();
    initMenus();
    setupButtons();
    setupCopy();

    // --- GERENCIAMENTO DE ABAS ---
    function initTabs() {
        const tabs = document.querySelectorAll('.sub-tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.sub-tab-button').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.sub-tab-panel').forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(tab.dataset.subtab).classList.add('active');
                outputTextarea.value = ''; // Limpa ao trocar
            });
        });
    }

    // --- INICIALIZAÇÃO DOS MENUS ---
    function initMenus() {
        // 1. Negativas
        setupDropdown('select-negativas', 'inputs-negativas', data.negativas);
        
        // 2. Finalização
        setupDropdown('select-finalizacao', 'inputs-finalizacao', data.finalizacao);

        // 3. Autorização (Lógica especial de lista)
        setupAutorizacao();

        // 4. Reembolso (Texto estático)
        document.getElementById('inputs-reembolso').innerHTML = '<p><em>Este texto não requer preenchimento adicional.</em></p>';
    }

    // --- FUNÇÕES AUXILIARES ---
    function setupDropdown(selectId, containerId, items) {
        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '';
        items.forEach(item => {
            const option = new Option(item.nome, item.id);
            select.appendChild(option);
        });

        // Ao mudar a seleção, gera os inputs baseados no template
        select.addEventListener('change', () => {
            const item = items.find(i => i.id === select.value);
            if (item) generateInputsFromTemplate(containerId, item.template);
        });

        // Dispara para o primeiro item
        if (items.length > 0) {
            generateInputsFromTemplate(containerId, items[0].template);
        }
    }

    // A MÁGICA: Lê o texto, acha {variavel} e cria o input
    function generateInputsFromTemplate(containerId, template) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        const regex = /\{([^}]+)\}/g;
        let match;
        const foundVars = new Set(); 

        while ((match = regex.exec(template)) !== null) {
            const varName = match[1];
            if (!foundVars.has(varName)) {
                foundVars.add(varName);
                
                const wrapper = document.createElement('div');
                wrapper.className = 'input-wrapper';
                
                const label = document.createElement('label');
                label.textContent = varName.replace(/_/g, ' ').toUpperCase() + ':';
                label.innerHTML += ' <span style="color: var(--neon-red)">*</span>'; 

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'dynamic-input';
                input.dataset.var = varName; 
                input.placeholder = `Digite ${varName.replace(/_/g, ' ')}...`;

                input.addEventListener('input', () => input.classList.remove('input-error'));

                wrapper.appendChild(label);
                wrapper.appendChild(input);
                container.appendChild(wrapper);
            }
        }
        
        if (foundVars.size === 0) {
            container.innerHTML = '<p><em>Nenhum campo adicional necessário.</em></p>';
        }
    }

    // --- LÓGICA ESPECÍFICA DE AUTORIZAÇÃO (ATUALIZADA COM QUANTIDADE) ---
    function setupAutorizacao() {
        const container = document.getElementById('inputs-autorizacao');
        container.innerHTML = '';

        // --- NOVO: Controles de Quantidade ---
        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.alignItems = 'flex-end';
        controlsDiv.style.gap = '10px';
        controlsDiv.style.marginBottom = '15px';
        controlsDiv.style.padding = '10px';
        controlsDiv.style.backgroundColor = '#1a1a1a';
        controlsDiv.style.border = '1px solid var(--batman-grey)';
        controlsDiv.style.borderRadius = '4px';

        // Input de Quantidade
        const inputWrapper = document.createElement('div');
        inputWrapper.style.flex = '1';
        
        const labelQtd = document.createElement('label');
        labelQtd.textContent = 'Qtd. Procedimentos:';
        labelQtd.style.color = 'var(--batman-yellow)';
        labelQtd.style.fontSize = '0.8rem';
        labelQtd.style.display = 'block';
        labelQtd.style.marginBottom = '5px';

        const inputQtd = document.createElement('input');
        inputQtd.type = 'number';
        inputQtd.min = '1';
        inputQtd.value = '1';
        inputQtd.className = 'dynamic-input'; 
        inputQtd.style.width = '100%';
        inputQtd.style.boxSizing = 'border-box';

        inputWrapper.appendChild(labelQtd);
        inputWrapper.appendChild(inputQtd);

        // Botão Definir
        const btnGerarCampos = document.createElement('button');
        btnGerarCampos.className = 'app-button';
        btnGerarCampos.textContent = 'GERAR CAMPOS';
        btnGerarCampos.style.flex = '1';
        
        controlsDiv.appendChild(inputWrapper);
        controlsDiv.appendChild(btnGerarCampos);

        // Container da grade de inputs
        const listContainer = document.createElement('div');
        listContainer.id = 'auth-list-container'; // CSS Grid já configurado

        // Botão para adicionar mais um (caso precise)
        const btnAddOne = document.createElement('button');
        btnAddOne.className = 'app-button';
        btnAddOne.textContent = '+ Adicionar mais 1';
        btnAddOne.style.marginTop = '5px';
        btnAddOne.style.backgroundColor = '#333';
        btnAddOne.style.border = '1px dashed var(--batman-yellow)';

        // Evento: Gerar X campos
        btnGerarCampos.addEventListener('click', () => {
            const qtd = parseInt(inputQtd.value) || 1;
            if(qtd < 1) return;
            
            listContainer.innerHTML = ''; // Limpa lista anterior
            for (let i = 0; i < qtd; i++) {
                addAuthRow(listContainer);
            }
        });

        // Evento: Adicionar um extra
        btnAddOne.addEventListener('click', () => {
            addAuthRow(listContainer);
        });
        
        container.appendChild(controlsDiv);
        container.appendChild(listContainer);
        container.appendChild(btnAddOne);

        // Inicializa com 1 campo
        addAuthRow(listContainer);
    }

    function addAuthRow(container) {
        const row = document.createElement('div');
        row.className = 'procedure-block'; // Usa o estilo do CSS

        const html = `
            <button class="btn-remove-proc">X</button>
            <label>Procedimento: <span style="color: var(--neon-red)">*</span></label>
            <input type="text" class="auth-proc" placeholder="Nome do procedimento">
            
            <label style="margin-top:5px">Senha: <span style="color: var(--neon-red)">*</span></label>
            <input type="text" class="auth-senha" placeholder="Senha da guia">
            
            <label style="margin-top:5px">Prestador: <span style="color: var(--neon-red)">*</span></label>
            <input type="text" class="auth-prest" placeholder="Nome do prestador">
        `;
        row.innerHTML = html;

        // Botão remover (agora sempre disponível)
        row.querySelector('.btn-remove-proc').addEventListener('click', (e) => {
            e.preventDefault();
            row.remove();
        });

        container.appendChild(row);
    }
    
    // --- GERAÇÃO DO TEXTO FINAL ---
    function setupButtons() {
        document.querySelectorAll('.btn-gerar').forEach(btn => {
            btn.addEventListener('click', () => {
                const tipo = btn.dataset.tipo;
                
                if (tipo === 'negativas') processGeneric('select-negativas', 'inputs-negativas', data.negativas);
                else if (tipo === 'finalizacao') processGeneric('select-finalizacao', 'inputs-finalizacao', data.finalizacao);
                else if (tipo === 'reembolso') outputTextarea.value = data.reembolso.template;
                else if (tipo === 'autorizacao') processAutorizacao();
            });
        });
    }

    function processGeneric(selectId, containerId, dataList) {
        const select = document.getElementById(selectId);
        const item = dataList.find(i => i.id === select.value);
        if (!item) return;

        let texto = item.template;
        let erro = false;

        const inputs = document.getElementById(containerId).querySelectorAll('.dynamic-input');
        inputs.forEach(input => {
            const val = input.value.trim();
            const varName = input.dataset.var;

            if (!val) {
                input.classList.add('input-error');
                erro = true;
            } else {
                texto = texto.split(`{${varName}}`).join(val);
            }
        });

        if (erro) {
            alert("Por favor, preencha os campos obrigatórios (em vermelho).");
        } else {
            outputTextarea.value = texto;
        }
    }

    function processAutorizacao() {
        const container = document.getElementById('auth-list-container');
        const rows = container.querySelectorAll('.procedure-block');
        
        if (rows.length === 0) {
            alert("Adicione pelo menos um procedimento.");
            return;
        }

        let itensTexto = "";
        let erro = false;

        rows.forEach(row => {
            const proc = row.querySelector('.auth-proc');
            const senha = row.querySelector('.auth-senha');
            const prest = row.querySelector('.auth-prest');

            if (!proc.value.trim()) { proc.classList.add('input-error'); erro = true; }
            if (!senha.value.trim()) { senha.classList.add('input-error'); erro = true; }
            if (!prest.value.trim()) { prest.classList.add('input-error'); erro = true; }

            [proc, senha, prest].forEach(el => el.addEventListener('input', () => el.classList.remove('input-error')));

            let itemStr = data.autorizacao.template_item;
            itemStr = itemStr.replace('{procedimento}', proc.value);
            itemStr = itemStr.replace('{senha}', senha.value);
            itemStr = itemStr.replace('{prestador}', prest.value);
            
            itensTexto += itemStr + "\n================="; 
        });

        if (erro) {
            alert("Preencha todos os campos dos procedimentos.");
            return;
        }

        let final = data.autorizacao.template_intro + itensTexto + data.autorizacao.template_fim;
        // Remove o último separador 
        final = final.replace("\n=================" + data.autorizacao.template_fim, data.autorizacao.template_fim);
        
        outputTextarea.value = final;
    }

    // --- COPIAR ---
    function setupCopy() {
        copyButton.addEventListener('click', () => {
            if (!outputTextarea.value) return;
            navigator.clipboard.writeText(outputTextarea.value);
            const original = copyButton.textContent;
            copyButton.textContent = "COPIADO!";
            copyButton.style.background = "var(--neon-green)";
            copyButton.style.color = "black";
            setTimeout(() => {
                copyButton.textContent = original;
                copyButton.style.background = "";
                copyButton.style.color = "";
            }, 1500);
        });
    }
});

