// js/zonas.js
// Lógica de Zonas: MAPA TÁTICO COM PRECISÃO DE ESTADO E ZONAS

document.addEventListener('DOMContentLoaded', () => {

    // --- BASE DE DADOS COMPLETA E ORGANIZADA ---
    const ZONAS_DB = {
        "SP": [
            { titulo: "ZONA SUL (CAPITAL)", desc: "Santo Amaro, Interlagos, Grajaú, Socorro, Jabaquara, Saúde, Vila Mariana, Moema, Morumbi, Campo Limpo, Capão Redondo, Parelheiros." },
            { titulo: "ZONA NORTE (CAPITAL)", desc: "Santana, Tucuruvi, Vila Maria, Jaçanã, Tremembé, Casa Verde, Freguesia do Ó, Brasilândia, Perus." },
            { titulo: "ZONA LESTE (CAPITAL)", desc: "Itaquera, Penha, Tatuapé, Mooca, São Mateus, Vila Prudente, Aricanduva, Belém, Guaianases, Cidade Tiradentes, São Miguel Paulista." },
            { titulo: "ZONA OESTE (CAPITAL)", desc: "Lapa, Pinheiros, Butantã, Perdizes, Barra Funda, Jaguaré, Vila Madalena, Rio Pequeno, Vila Sônia." },
            { titulo: "CENTRO (CAPITAL)", desc: "Sé, República, Liberdade, Santa Cecília, Consolação, Bela Vista, Bom Retiro, Cambuci, Aclimação." },
            { titulo: "GRANDE SP (OESTE)", desc: "Osasco, Carapicuíba, Barueri, Jandira, Itapevi, Cotia, Santana de Parnaíba, Taboão da Serra, Embu das Artes, Pirapora do Bom Jesus." },
            { titulo: "GRANDE SP (LESTE)", desc: "Guarulhos, Arujá, Mogi das Cruzes, Suzano, Poá, Itaquaquecetuba, Ferraz de Vasconcelos, Santa Isabel." },
            { titulo: "GRANDE SP (ABC)", desc: "Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires, Rio Grande da Serra." },
            { titulo: "LITORAL SUL", desc: "Santos, São Vicente, Praia Grande, Guarujá, Cubatão, Mongaguá, Bertioga, Itanhaém, Peruíbe." },
            { titulo: "INTERIOR (JUNDIAÍ)", desc: "Jundiaí, Várzea Paulista, Campo Limpo Paulista, Itupeva, Louveira, Cajamar, Cabreúva." },
            { titulo: "INTERIOR (SOROCABA)", desc: "Sorocaba, Votorantim, Itu, Salto, São Roque, Ibiúna, Mairinque, Alumínio, Araçoiaba da Serra." },
            { titulo: "INTERIOR (CAMPINAS)", desc: "Campinas, Sumaré, Hortolândia, Valinhos, Vinhedo, Indaiatuba, Americana, Paulínia, Santa Bárbara d'Oeste." },
            { titulo: "VALE DO PARAÍBA", desc: "São José dos Campos, Taubaté, Jacareí, Caçapava, Pindamonhangaba, Guaratinguetá, Lorena, Campos do Jordão." },
            { titulo: "CENTRO-OESTE (BAURU)", desc: "Bauru, Marília, Jaú, Botucatu, Lençóis Paulista, Garça, Pederneiras." }
        ],
        "RJ": [
            { titulo: "CENTRO (CAPITAL)", desc: "Centro, Lapa, Santa Teresa, Estácio, Rio Comprido, Gamboa, Santo Cristo, Cidade Nova." },
            { titulo: "ZONA SUL (CAPITAL)", desc: "Copacabana, Ipanema, Leblon, Botafogo, Flamengo, Laranjeiras, Gávea, Humaitá, Catete, Glória, Jardim Botânico, Urca." },
            { titulo: "ZONA NORTE (CAPITAL)", desc: "Tijuca, Méier, Madureira, Penha, Ilha do Governador, Irajá, Pavuna, Maracanã, Vila Isabel, Grajaú, Andaraí, Engenho Novo, Cascadura, Olaria, Ramos, Vicente de Carvalho." },
            { titulo: "ZONA OESTE (CAPITAL)", desc: "Barra da Tijuca, Jacarepaguá, Campo Grande, Bangu, Realengo, Recreio dos Bandeirantes, Santa Cruz, Paciência, Guaratiba, Vargem Grande." },
            { titulo: "BAIXADA FLUMINENSE", desc: "Duque de Caxias, Nova Iguaçu, Belford Roxo, São João de Meriti, Nilópolis, Mesquita, Queimados, Japeri, Magé." },
            { titulo: "NITERÓI / LESTE", desc: "Niterói, São Gonçalo, Itaboraí, Maricá, Rio Bonito, Tanguá." },
            { titulo: "REGIÃO SERRANA", desc: "Petrópolis, Teresópolis, Nova Friburgo, Miguel Pereira, Paty do Alferes." },
            { titulo: "REGIÃO DOS LAGOS", desc: "Cabo Frio, Búzios, Arraial do Cabo, Saquarema, São Pedro da Aldeia, Araruama, Rio das Ostras." }
        ],
        "BR": [
            { titulo: "CEARÁ (GDE FORTALEZA)", desc: "Fortaleza, Caucaia, Maracanaú, Eusébio, Aquiraz, Horizonte." },
            { titulo: "CEARÁ (INTERIOR)", desc: "Juazeiro do Norte, Sobral, Crato, Barbalha." },
            { titulo: "BAHIA (GDE SALVADOR)", desc: "Salvador, Lauro de Freitas, Camaçari, Simões Filho, Candeias, Dias d'Ávila." },
            { titulo: "BAHIA (INTERIOR)", desc: "Feira de Santana, Vitória da Conquista, Itabuna, Ilhéus." },
            { titulo: "PERNAMBUCO (GDE RECIFE)", desc: "Recife, Olinda, Jaboatão dos Guararapes, Paulista, Cabo de Santo Agostinho, Camaragibe." },
            { titulo: "PERNAMBUCO (INTERIOR)", desc: "Caruaru, Petrolina, Garanhuns." },
            { titulo: "MINAS GERAIS (GDE BH)", desc: "Belo Horizonte, Contagem, Betim, Nova Lima, Santa Luzia, Ribeirão das Neves, Ibirité." },
            { titulo: "MINAS GERAIS (INTERIOR)", desc: "Uberlândia, Juiz de Fora, M ontes Claros, Uberaba, Governador Valadares." },
            { titulo: "PARANÁ (GDE CURITIBA)", desc: "Curitiba, São José dos Pinhais, Colombo, Pinhais, Araucária, Campo Largo." },
            { titulo: "PARANÁ (INTERIOR)", desc: "Londrina, Maringá, Ponta Grossa, Cascavel, Foz do Iguaçu." },
            { titulo: "RIO GRANDE DO SUL (GDE POA)", desc: "Porto Alegre, Canoas, Novo Hamburgo, Gravataí, Viamão, Alvorada, São Leopoldo." },
            { titulo: "RIO GRANDE DO SUL (SERRA)", desc: "Caxias do Sul, Bento Gonçalves, Farroupilha, Gramado, Canela." },
            { titulo: "DISTRITO FEDERAL", desc: "Brasília, Taguatinga, Ceilândia, Águas Claras, Samambaia, Gama, Planaltina." },
            { titulo: "AMAZONAS", desc: "Manaus, Itacoatiara, Manacapuru, Parintins." },
            { titulo: "GOIÁS", desc: "Goiânia, Aparecida de Goiânia, Anápolis, Trindade, Rio Verde." },
            { titulo: "SANTA CATARINA (CAPITAL)", desc: "Florianópolis, São José, Palhoça, Biguaçu." },
            { titulo: "SANTA CATARINA (NORTE)", desc: "Joinville, Jaraguá do Sul, São Francisco do Sul." },
            { titulo: "SANTA CATARINA (VALE)", desc: "Blumenau, Itajaí, Balneário Camboriú, Brusque." }
        ]
    };

    // Dicionário de Estados para busca precisa
    const ESTADOS = {
        'sao paulo': 'SP', 'sp': 'SP',
        'rio de janeiro': 'RJ', 'rj': 'RJ',
        'ceara': 'BR', 'ce': 'BR',
        'bahia': 'BR', 'ba': 'BR',
        'pernambuco': 'BR', 'pe': 'BR',
        'minas gerais': 'BR', 'mg': 'BR',
        'parana': 'BR', 'pr': 'BR',
        'rio grande do sul': 'BR', 'rs': 'BR',
        'distrito federal': 'BR', 'df': 'BR',
        'amazonas': 'BR', 'am': 'BR',
        'goias': 'BR', 'go': 'BR',
        'santa catarina': 'BR', 'sc': 'BR'
    };

    // Elementos UI
    const searchInput = document.getElementById('zona-search-input');
    const btnBuscarMapa = document.getElementById('btn-buscar-mapa');
    const noResultsMsg = document.getElementById('zona-no-results');
    const subTabs = document.querySelectorAll('.sub-tab-button');
    
    // HUD Elements
    const hud = document.getElementById('tactical-hud');
    const hudTarget = document.getElementById('hud-target');
    const hudZone = document.getElementById('hud-zone');
    const hudRoutesList = document.getElementById('hud-routes-list');

    let map, mainMarker, geoLayer;
    let layersRoute = [];
    let currentTab = 'tab-sp';

    if (!searchInput) return;

    // INICIALIZAÇÃO
    initTabs();
    renderListas();

    // --- EVENTOS ---
    searchInput.addEventListener('input', (e) => {
        if (currentTab !== 'tab-mapa') filterZonas(e.target.value.toLowerCase());
    });

    btnBuscarMapa.addEventListener('click', () => performMapSearch());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performMapSearch();
    });

    // --- MAPA TÁTICO DARK ---
    function initMap() {
        if(map) return;
        map = L.map('map', {
            zoomControl: false, 
            attributionControl: false
        }).setView([-14.235, -51.925], 4);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd', maxZoom: 20
        }).addTo(map);
    }

    function performMapSearch() {
        const term = searchInput.value.trim();
        if(!term) return;
        document.querySelector('[data-subtab="tab-mapa"]').click();
        // Pequeno delay para o container renderizar
        setTimeout(() => {
            if(map) map.invalidateSize();
            processarBuscaTatica(term);
        }, 100);
    }

    // --- LÓGICA CENTRAL ---
    async function processarBuscaTatica(termo) {
        if (!map) initMap();
        
        // Limpeza
        if(mainMarker) map.removeLayer(mainMarker);
        if(geoLayer) map.removeLayer(geoLayer);
        layersRoute.forEach(l => map.removeLayer(l));
        layersRoute = [];
        
        hud.classList.add('hidden');
        hudRoutesList.innerHTML = '<div style="text-align:center; padding:10px; color:#777;">Identificando alvo...</div>';

        const normTermo = normalize(termo);
        
        // 1. IDENTIFICAR SE É ESTADO
        let estadoDetectado = ESTADOS[normTermo];
        let isStateSearch = !!estadoDetectado;
        
        // Se for busca de estado (ex: "Rio de Janeiro"), define o contexto
        let contextoEstadoNome = "";
        if (isStateSearch) {
            // Mapeia sigla para nome completo para o GPS
            if(estadoDetectado === 'SP') contextoEstadoNome = "Sao Paulo";
            else if(estadoDetectado === 'RJ') contextoEstadoNome = "Rio de Janeiro";
            // Para BR, tenta usar o termo digitado capitalizado
            else contextoEstadoNome = termo;
        }

        // 2. BUSCAR ZONA E CIDADE NO DB
        let zonaEncontrada = null;
        let cidadeEncontrada = null;
        let listaCandidatos = [];

        // Define qual base usar (SP, RJ ou BR)
        // Se não detectou estado, procura em tudo para achar a cidade
        let dbAlvo = isStateSearch ? 
            (estadoDetectado === 'BR' ? ZONAS_DB.BR : ZONAS_DB[estadoDetectado]) :
            [...ZONAS_DB.SP, ...ZONAS_DB.RJ, ...ZONAS_DB.BR];

        // Se for busca de estado, filtra zonas desse estado
        if (isStateSearch) {
             // Se for SP ou RJ, já pegou a lista certa. Se for BR, filtra pelo nome.
             if (estadoDetectado === 'BR') {
                 dbAlvo = ZONAS_DB.BR.filter(z => normalize(z.titulo).includes(normTermo));
             }
        }

        // Varredura
        for (let item of dbAlvo) {
            const cidades = item.desc.split(',').map(c => c.trim());
            
            if (isStateSearch) {
                // Se é busca de estado, adiciona todas as cidades das zonas encontradas
                cidades.forEach(c => listaCandidatos.push({ nome: c, zona: item.titulo }));
                if(!zonaEncontrada) zonaEncontrada = item; // Pega a primeira zona como ref
            } else {
                // Se é busca de cidade, procura match exato
                if (normalize(item.titulo).includes(normTermo) || normalize(item.desc).includes(normTermo)) {
                    zonaEncontrada = item;
                    const match = cidades.find(c => normalize(c).includes(normTermo));
                    if (match) {
                        cidadeEncontrada = match;
                        // Candidatos são os vizinhos da MESMA zona
                        listaCandidatos = cidades.filter(c => c !== match).map(c => ({ nome: c, zona: item.titulo }));
                    }
                    break; // Achou a cidade, para.
                }
            }
        }

        // 3. DEFINIR ALVO PARA O GPS
        let queryGPS = "";
        let nomeAlvoHUD = "";

        if (isStateSearch) {
            // Alvo é o Estado/Região
            queryGPS = `${termo}, Brazil`;
            nomeAlvoHUD = termo.toUpperCase();
        } else {
            // Alvo é a Cidade
            const cidadeAlvo = cidadeEncontrada || termo;
            nomeAlvoHUD = cidadeAlvo.toUpperCase();
            
            // Tenta adicionar contexto do estado para precisão
            if (zonaEncontrada) {
                if (ZONAS_DB.SP.includes(zonaEncontrada)) queryGPS = `${cidadeAlvo}, Sao Paulo, Brazil`;
                else if (ZONAS_DB.RJ.includes(zonaEncontrada)) queryGPS = `${cidadeAlvo}, Rio de Janeiro, Brazil`;
                else queryGPS = `${cidadeAlvo}, Brazil`;
            } else {
                queryGPS = `${cidadeAlvo}, Brazil`;
            }
        }

        // 4. GEOCODIFICAÇÃO DO ALVO
        const coordsAlvo = await getCoordinates(queryGPS, true); // true = pede polígono
        
        if(!coordsAlvo) {
            alert("Local não encontrado. Tente ser mais específico (ex: Osasco, SP).");
            return;
        }

        // 5. DESENHAR NO MAPA
        // Se tem polígono (Estado ou Cidade grande)
        if (coordsAlvo.geojson && (isStateSearch || coordsAlvo.tipo === 'boundary')) {
            geoLayer = L.geoJSON(coordsAlvo.geojson, {
                style: { color: '#E8B923', weight: 2, opacity: 0.8, fillColor: '#E8B923', fillOpacity: 0.1 }
            }).addTo(map);
            map.fitBounds(geoLayer.getBounds());
            
            // Se for estado, adiciona label no centro
            if (isStateSearch) addLabel([coordsAlvo.lat, coordsAlvo.lon], nomeAlvoHUD, true);
        } 
        
        // Se for cidade (ou se não tiver polígono), adiciona marcador
        if (!isStateSearch) {
            const pulseIcon = L.divIcon({ className: 'pulse-yellow', iconSize: [20, 20] });
            mainMarker = L.marker([coordsAlvo.lat, coordsAlvo.lon], {icon: pulseIcon}).addTo(map);
            if (!geoLayer) map.flyTo([coordsAlvo.lat, coordsAlvo.lon], 13, { duration: 1.5 });
            addLabel([coordsAlvo.lat, coordsAlvo.lon], nomeAlvoHUD, true);
        }

        // 6. ATUALIZAR HUD
        hudTarget.textContent = nomeAlvoHUD;
        hudZone.textContent = zonaEncontrada ? zonaEncontrada.titulo : (isStateSearch ? "ESTADO / REGIÃO" : "FORA DA BASE");
        hud.classList.remove('hidden');

        // 7. TRAÇAR ROTAS PARA VIZINHAS / CIDADES DA REGIÃO
        // Limita a 4 para não poluir e não travar
        const vizinhasParaTraçar = listaCandidatos.slice(0, 4);
        
        hudRoutesList.innerHTML = '';

        if (vizinhasParaTraçar.length > 0) {
            for (let vizinhaObj of vizinhasParaTraçar) {
                // Busca coordenadas da vizinha (com contexto do estado se possível)
                let queryVizinha = vizinhaObj.nome;
                if (!queryVizinha.toLowerCase().includes("brazil")) queryVizinha += ", Brazil";
                
                const coordsVizinha = await getCoordinates(queryVizinha);
                
                if(coordsVizinha) {
                    const dadosRota = await getRouteData(coordsAlvo, coordsVizinha);
                    
                    if(dadosRota) {
                        // Linha Amarela
                        const line = L.polyline([
                            [coordsAlvo.lat, coordsAlvo.lon],
                            [coordsVizinha.lat, coordsVizinha.lon]
                        ], { color: '#E8B923', weight: 2, dashArray: '5, 10', opacity: 0.5 }).addTo(map);
                        layersRoute.push(line);

                        // Ponto Amarelo
                        const dot = L.divIcon({ className: 'marker-dot', iconSize: [8,8] });
                        const m = L.marker([coordsVizinha.lat, coordsVizinha.lon], {icon: dot}).addTo(map);
                        layersRoute.push(m);
                        
                        // Label
                        addLabel([coordsVizinha.lat, coordsVizinha.lon], vizinhaObj.nome);

                        // Item HUD com ZONA
                        const item = document.createElement('div');
                        item.className = 'hud-route-item';
                        item.innerHTML = `
                            <div style="display:flex; flex-direction:column;">
                                <span class="hud-route-dest">${vizinhaObj.nome}</span>
                                <span style="font-size:0.65rem; color:#888;">${vizinhaObj.zona}</span>
                            </div>
                            <div style="text-align:right;">
                                <span class="hud-route-meta" style="display:block;">${dadosRota.km}km</span>
                                <span class="hud-route-meta" style="color:#fff; font-size:0.7rem;">${dadosRota.time}</span>
                            </div>
                        `;
                        
                        item.addEventListener('click', () => {
                            map.fitBounds(line.getBounds(), { padding: [50, 50] });
                            line.setStyle({ opacity: 1, weight: 4, color: 'var(--neon-green)' });
                            setTimeout(() => line.setStyle({ opacity: 0.5, weight: 2, color: '#E8B923' }), 2000);
                        });

                        hudRoutesList.appendChild(item);
                    }
                }
                await new Promise(r => setTimeout(r, 400)); // Delay
            }
        } else {
            hudRoutesList.innerHTML = '<small style="padding:5px;">Nenhuma cidade próxima mapeada na base.</small>';
        }
    }

    // --- APIS ---
    function addLabel(coords, text, isMain = false) {
        const labelIcon = L.divIcon({
            className: isMain ? 'map-label-main' : 'map-label-yellow',
            html: text,
            iconSize: [150, 20],
            iconAnchor: isMain ? [75, 40] : [-10, 10] // Centraliza main, desloca outros
        });
        const l = L.marker(coords, { icon: labelIcon, interactive: false }).addTo(map);
        layersRoute.push(l);
    }

    async function getCoordinates(query, getPoly = false) {
        try {
            const polyParam = getPoly ? '&polygon_geojson=1' : '';
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}${polyParam}&limit=1`);
            const data = await res.json();
            
            if(data.length > 0) {
                const item = data[0];
                // Detecta se é boundary (estado/região)
                const isBoundary = item.class === 'boundary' || item.type === 'administrative';
                return { 
                    lat: parseFloat(item.lat), 
                    lon: parseFloat(item.lon),
                    geojson: item.geojson,
                    tipo: isBoundary ? 'boundary' : 'city'
                };
            }
        } catch(e) {}
        return null;
    }

    async function getRouteData(start, end) {
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`;
            const res = await fetch(url);
            const data = await res.json();
            if(data.routes && data.routes.length) {
                const r = data.routes[0];
                const km = (r.distance/1000).toFixed(1);
                const min = Math.round(r.duration/60);
                const timeStr = min > 60 ? `${Math.floor(min/60)}h ${min%60}m` : `${min} min`;
                return { km, time: timeStr };
            }
        } catch(e) {}
        return null;
    }

    // --- UI ---
    function initTabs() {
        subTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                subTabs.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.sub-tab-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const target = btn.dataset.subtab;
                document.getElementById(target).classList.add('active');
                currentTab = target;

                if(target === 'tab-mapa') {
                    if(!map) initMap();
                    setTimeout(() => map.invalidateSize(), 200);
                } else {
                    // Reseta filtros visuais nas listas
                    searchInput.value = '';
                    filterZonas('');
                    hud.classList.add('hidden');
                }
            });
        });
    }

    function renderListas() {
        const render = (id, data) => {
            const el = document.getElementById(id);
            if(el) {
                el.innerHTML = '';
                data.forEach(z => {
                    const div = document.createElement('div');
                    div.className = 'zona-bloco fluxo-bloco';
                    div.innerHTML = `<h4>${z.titulo}</h4><p>${z.desc}</p>`;
                    div.onclick = () => {
                        // Pega a primeira cidade da lista para buscar
                        searchInput.value = z.desc.split(',')[0];
                        performMapSearch();
                    };
                    el.appendChild(div);
                });
            }
        };
        render('container-sp', ZONAS_DB.SP);
        render('container-rj', ZONAS_DB.RJ);
        render('container-br', ZONAS_DB.BR);
    }

    function filterZonas(term) {
        let id = 'container-sp';
        if(currentTab === 'tab-rj') id = 'container-rj';
        if(currentTab === 'tab-br') id = 'container-br';
        
        const container = document.getElementById(id);
        if(!container) return;

        let found = 0;
        const normTerm = normalize(term);
        container.querySelectorAll('.zona-bloco').forEach(c => {
            if(normalize(c.innerText).includes(normTerm)) {
                c.style.display = 'block';
                c.style.borderColor = term ? 'var(--batman-yellow)' : '';
                found++;
            } else { c.style.display = 'none'; }
        });
        const msg = document.getElementById('zona-no-results');
        if(msg) msg.style.display = (found === 0 && term) ? 'block' : 'none';
    }

    function normalize(str) { return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
});