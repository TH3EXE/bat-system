// js/zonas.js
// Lógica e dados para a página zonas.html

// ===============================================
// ATUALIZAÇÃO: Base de dados com direções
// ===============================================
const ZONAS_DATA = {
    "SP": {
        "SP - CAPITAL (CENTRO)": "Sé, República, Consolação, Bela Vista, Bom Retiro, Liberdade, Cambuci, Aclimação.",
        "SP - CAPITAL (ZONA LESTE)": "Mooca, Tatuapé, Penha, Vila Matilde, Itaquera, São Miguel Paulista, Guaianases, Cidade Tiradentes.",
        "SP - CAPITAL (ZONA NORTE)": "Santana, Tucuruvi, Vila Maria, Casa Verde, Freguesia do Ó, Brasilândia, Jaçã, Perus.",
        "SP - CAPITAL (ZONA OESTE)": "Lapa, Barra Funda, Perdizes, Pinheiros, Butantã, Vila Sônia, Rio Pequeno, Jaguaré.",
        "SP - CAPITAL (ZONA SUL)": "Vila Mariana, Saúde, Ipiranga, Jabaquara, Santo Amaro, Interlagos, Campo Limpo, Capão Redondo, Parelheiros, Grajaú.",
        "SP - GRANDE SP (LESTE)": "Guarulhos, Arujá, Ferraz de Vasconcelos, Poá, Suzano, Mogi das Cruzes, Itaquaquecetuba.",
        "SP - GRANDE SP (OESTE)": "Osasco, Carapicuíba, Barueri, Itapevi, Jandira, Cotia, Santana de Parnaíba, Pirapora do Bom Jesus.",
        "SP - GRANDE SP (SUL/ABC)": "Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires, Rio Grande da Serra.",
        "SP - INTERIOR (NOROESTE/JUNDIAÍ)": "Jundiaí, Cajamar, Várzea Paulista, Campo Limpo Paulista, Itupeva, Louveira.",
        "SP - INTERIOR (NOROESTE/CAMPINAS)": "Campinas, Americana, Hortolândia, Indaiatuba, Paulínia, Santa Bárbara d'Oeste, Sumaré, Valinhos, Vinhedo.",
        "SP - INTERIOR (OESTE/SOROCABA)": "Sorocaba, Votorantim, Itu, Salto, São Roque, Mairinque, Alumínio, Ibiúna.",
        "SP - INTERIOR (LESTE/VALE DO PARAÍBA)": "São José dos Campos, Taubaté, Jacareí, Caçapava, Pindamonhangaba, Guaratinguetá, Lorena, Campos do Jordão.",
        "SP - INTERIOR (CENTRO-OESTE/BAURU)": "Bauru, Marília, Jaú, Botucatu, Lençóis Paulista, Garça, Pederneiras.",
        "SP - LITORAL (SUL/BAIXADA SANTISTA)": "Santos, São Vicente, Guarujá, Praia Grande, Cubatão, Bertioga, Mongaguá, Itanhaém, Peruíbe."
    },
    "RJ": {
        "RJ - CAPITAL (CENTRO)": "Centro, Lapa, Santa Teresa, Gamboa, Santo Cristo, Cidade Nova, Rio Comprido.",
        "RJ - CAPITAL (ZONA SUL)": "Copacabana, Ipanema, Leblon, Botafogo, Flamengo, Laranjeiras, Catete, Glória, Gávea, Jardim Botânico, Urca.",
        "RJ - CAPITAL (ZONA NORTE - TIJUCA)": "Tijuca, Maracanã, Vila Isabel, Grajaú, Andaraí, Alto da Boa Vista.",
        "RJ - CAPITAL (ZONA NORTE - SUBÚRBIO)": "Méier, Engenho Novo, Madureira, Cascadura, Penha, Olaria, Ramos, Ilha do Governador, Irajá, Vicente de Carvalho.",
        "RJ - CAPITAL (ZONA OESTE - BARRA/JACAREPAGUÁ)": "Barra da Tijuca, Recreio dos Bandeirantes, Jacareag_p, Vargem Grande, Vargem Pequena.",
        "RJ - CAPITAL (ZONA OESTE - GRANDE)": "Campo Grande, Bangu, Santa Cruz, Realengo, Paciência, Guaratiba.",
        "RJ - BAIXADA FLUMINENSE": "Duque de Caxias, Nova Iguaçu, São João de Meriti, Belford Roxo, Nilópolis, Mesquita, Queimados, Japeri, Magé.",
        "RJ - REGIÃO METROPOLITANA LESTE": "Niterói, São Gonçalo, Itaboraí, Maricá, Rio Bonito, Tanguá.",
        "RJ - REGIÃO SERRANA": "Petrópolis, Teresópolis, Nova Friburgo, Miguel Pereira, Paty do Alferes.",
        "RJ - REGIÃO DOS LAGOS": "Cabo Frio, Arraial do Cabo, Búzios, Saquarema, Araruama, São Pedro da Aldeia, Rio das Ostras."
    }
};
// --- FIM DA BASE DE DADOS ---


document.addEventListener('DOMContentLoaded', () => {

    // --- ATUALIZAÇÃO: Novos elementos ---
    const selectCidade = document.getElementById('select-cidade');
    const searchInput = document.getElementById('zona-search-input');
    const zonasContainer = document.getElementById('zonas-container');
    const noResultsMsg = document.getElementById('zona-no-results');

    if (!selectCidade) return; // Garante que estamos na página correta

    // --- ATUALIZAÇÃO: Adiciona eventos de filtro ---
    selectCidade.addEventListener('change', filtrarZonas);
    searchInput.addEventListener('input', filtrarZonas); // Pesquisa em tempo real

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
        // Limpa destaques antigos
        text = text.replace(/<mark class="highlight">/g, "").replace(/<\/mark>/g, "");
        if (!term) {
            return text; // Retorna o texto limpo se a pesquisa estiver vazia
        }
        // Adiciona novos destaques (insensível a maiúsculas/minúsculas)
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, `<mark class="highlight">$1</mark>`);
    }

    // --- ATUALIZAÇÃO: Função principal de exibição e filtro ---
    function filtrarZonas() {
        const cidadeSelecionada = selectCidade.value;
        const searchTerm = normalizarString(searchInput.value);

        // Limpa o container
        zonasContainer.innerHTML = '';
        let matchesFound = 0;

        // Decide quais dados filtrar (SP, RJ, ou Ambos)
        let dataToFilter = {};
        if (cidadeSelecionada === "SP") {
            dataToFilter = ZONAS_DATA.SP;
        } else if (cidadeSelecionada === "RJ") {
            dataToFilter = ZONAS_DATA.RJ;
        } else {
            // Combina SP e RJ se "Todas" estiver selecionado
            dataToFilter = { ...ZONAS_DATA.SP, ...ZONAS_DATA.RJ };
        }

        // Loop principal
        for (const zonaNome in dataToFilter) {
            const regioes = dataToFilter[zonaNome];
            
            const normZonaNome = normalizarString(zonaNome);
            const normRegioes = normalizarString(regioes);

            // Verifica se o termo de pesquisa está no nome da zona OU na lista de regiões
            if (searchTerm === '' || normZonaNome.includes(searchTerm) || normRegioes.includes(searchTerm)) {
                matchesFound++;

                // Cria o bloco
                const bloco = document.createElement('div');
                bloco.className = 'zona-bloco'; 

                // Cria o Título com destaque
                const titulo = document.createElement('h4');
                titulo.innerHTML = highlightText(zonaNome, searchTerm);

                // Cria o parágrafo com destaque
                const p = document.createElement('p');
                p.innerHTML = highlightText(regioes, searchTerm);

                // Monta o bloco
                bloco.appendChild(titulo);
                bloco.appendChild(p);
                zonasContainer.appendChild(bloco);
            }
        }
        
        // Mostra ou esconde a mensagem "Nenhum resultado"
        if (matchesFound === 0 && searchTerm !== '') {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }
    }
    
    // Roda o filtro uma vez no carregamento
    filtrarZonas();
});