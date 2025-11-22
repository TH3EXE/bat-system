// js/zonas.js
// Lógica da página de Zonas (SP e RJ)

// ===============================================
// DADOS ORIGINAIS MANTIDOS
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

document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('zona-search-input');
    const zonasContainer = document.getElementById('zonas-container');
    const noResultsMsg = document.getElementById('zona-no-results');
    const subTabs = document.querySelectorAll('.sub-tab-button');

    let currentCity = 'SP'; // Padrão inicial

    if (!searchInput) return; 

    // Inicializa abas
    subTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            // Ativa visualmente a aba
            subTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Muda a cidade atual
            currentCity = btn.dataset.subtab;
            
            // Reseta e refiltra
            searchInput.value = '';
            filtrarZonas();
        });
    });

    // Evento de pesquisa
    searchInput.addEventListener('input', filtrarZonas); 

    function normalizarString(str) {
        if (!str) return '';
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    
    function highlightText(text, term) {
        // Limpa highlights antigos
        text = text.replace(/<span class="highlight-animada">/g, "").replace(/<\/span>/g, "");
        if (!term) return text;

        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, `<span class="highlight-animada">$1</span>`);
    }

    function filtrarZonas() {
        const searchTerm = normalizarString(searchInput.value);
        zonasContainer.innerHTML = '';
        let matchesFound = 0;

        const dataToFilter = ZONAS_DATA[currentCity];

        for (const zonaNome in dataToFilter) {
            const regioes = dataToFilter[zonaNome];
            const normZonaNome = normalizarString(zonaNome);
            const normRegioes = normalizarString(regioes);

            if (searchTerm === '' || normZonaNome.includes(searchTerm) || normRegioes.includes(searchTerm)) {
                matchesFound++;

                const bloco = document.createElement('div');
                bloco.className = 'zona-bloco fluxo-bloco'; // Usa classes do CSS novo

                const titulo = document.createElement('h4');
                titulo.innerHTML = highlightText(zonaNome, searchTerm);

                const p = document.createElement('p');
                p.innerHTML = highlightText(regioes, searchTerm);

                bloco.appendChild(titulo);
                bloco.appendChild(p);
                zonasContainer.appendChild(bloco);
            }
        }
        
        noResultsMsg.style.display = (matchesFound === 0 && searchTerm !== '') ? 'block' : 'none';
    }
    
    // Carrega inicialmente
    filtrarZonas();
});