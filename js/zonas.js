// js/zonas.js
// MAPA TÁTICO: Correção de Bug (Limpeza de Rotas e Seleção) 

document.addEventListener('DOMContentLoaded', () => {

    // --- BASE DE DADOS (Mantida) ---
    const ZONAS_DB = {
        "SP": [
            { titulo: "ZONA SUL (CAPITAL SP)", desc: "Santo Amaro, Interlagos, Grajaú, Socorro, Jabaquara, Saúde, Vila Mariana, Moema, Morumbi, Campo Limpo, Capão Redondo." },
            { titulo: "ZONA NORTE (CAPITAL SP)", desc: "Santana, Tucuruvi, Vila Maria, Jaçanã, Tremembé, Casa Verde, Freguesia do Ó, Brasilândia, Perus, Mandaqui." },
            { titulo: "ZONA LESTE (CAPITAL SP)", desc: "Itaquera, Penha, Tatuapé, Mooca, São Mateus, Vila Prudente, Aricanduva, Belém, Guaianases, Cidade Tiradentes, São Miguel Paulista." },
            { titulo: "ZONA OESTE (CAPITAL SP)", desc: "Lapa, Pinheiros, Butantã, Perdizes, Barra Funda, Jaguaré, Vila Madalena, Rio Pequeno, Vila Sônia." },
            { titulo: "CENTRO (CAPITAL SP)", desc: "Sé, República, Liberdade, Santa Cecília, Consolação, Bela Vista, Bom Retiro, Cambuci, Aclimação." },
            { titulo: "GRANDE SP (OESTE)", desc: "Osasco, Carapicuíba, Barueri, Jandira, Itapevi, Cotia, Santana de Parnaíba, Taboão da Serra, Embu das Artes." },
            { titulo: "GRANDE SP (LESTE)", desc: "Guarulhos, Arujá, Mogi das Cruzes, Suzano, Poá, Itaquaquecetuba, Ferraz de Vasconcelos, Santa Isabel." },
            { titulo: "GRANDE SP (ABC)", desc: "Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires, Rio Grande da Serra." },
            { titulo: "LITORAL SUL (SP)", desc: "Santos, São Vicente, Praia Grande, Guarujá, Cubatão, Mongaguá, Bertioga, Itanhaém, Peruíbe." },
            { titulo: "INTERIOR (JUNDIAÍ)", desc: "Jundiaí, Várzea Paulista, Campo Limpo Paulista, Itupeva, Louveira, Cajamar, Cabreúva." },
            { titulo: "INTERIOR (SOROCABA)", desc: "Sorocaba, Votorantim, Itu, Salto, São Roque, Ibiúna, Mairinque, Alumínio." },
            { titulo: "INTERIOR (CAMPINAS)", desc: "Campinas, Sumaré, Hortolândia, Valinhos, Vinhedo, Indaiatuba, Americana, Paulínia." }
        ],
        "RJ": [
            { titulo: "CENTRO (CAPITAL RJ)", desc: "Centro, Lapa, Santa Teresa, Estácio, Rio Comprido, Gamboa, Santo Cristo." },
            { titulo: "ZONA SUL (CAPITAL RJ)", desc: "Copacabana, Ipanema, Leblon, Botafogo, Flamengo, Laranjeiras, Gávea, Humaitá, Catete." },
            { titulo: "ZONA NORTE (CAPITAL RJ)", desc: "Tijuca, Méier, Madureira, Penha, Ilha do Governador, Irajá, Pavuna, Maracanã, Vila Isabel." },
            { titulo: "ZONA OESTE (CAPITAL RJ)", desc: "Barra da Tijuca, Jacarepaguá, Campo Grande, Bangu, Realengo, Recreio dos Bandeirantes, Santa Cruz." },
            { titulo: "BAIXADA FLUMINENSE (RJ)", desc: "Duque de Caxias, Nova Iguaçu, Belford Roxo, São João de Meriti, Nilópolis, Mesquita, Queimados." },
            { titulo: "NITERÓI / LESTE (RJ)", desc: "Niterói, São Gonçalo, Itaboraí, Maricá, Rio Bonito." },
            { titulo: "REGIÃO SERRANA (RJ)", desc: "Petrópolis, Teresópolis, Nova Friburgo, Miguel Pereira." },
            { titulo: "REGIÃO DOS LAGOS (RJ)", desc: "Cabo Frio, Búzios, Arraial do Cabo, Saquarema, São Pedro da Aldeia." }
        ],
        "BR": [
            { titulo: "CEARÁ", desc: "Fortaleza, Caucaia, Maracanaú, Eusébio, Aquiraz." },
            { titulo: "BAHIA", desc: "Salvador, Lauro de Freitas, Camaçari, Feira de Santana." },
            { titulo: "PERNAMBUCO", desc: "Recife, Olinda, Jaboatão dos Guararapes, Paulista." },
            { titulo: "MINAS GERAIS", desc: "Belo Horizonte, Contagem, Betim, Nova Lima." },
            { titulo: "PARANÁ", desc: "Curitiba, São José dos Pinhais, Colombo, Pinhais." },
            { titulo: "RIO GRANDE DO SUL", desc: "Porto Alegre, Canoas, Caxias do Sul, Novo Hamburgo." },
            { titulo: "DISTRITO FEDERAL", desc: "Brasília, Taguatinga, Ceilândia, Águas Claras." },
            { titulo: "AMAZONAS", desc: "Manaus, Itacoatiara, Manacapuru." },
            { titulo: "GOIÁS", desc: "Goiânia, Aparecida de Goiânia, Anápolis." },
            { titulo: "SANTA CATARINA", desc: "Florianópolis, São José, Palhoça, Joinville." }
        ]
    };

    const STATE_MAP = { 'sao paulo': 'SP', 'sp': 'SP', 'rio de janeiro': 'RJ', 'rj': 'RJ', 'brasil': 'BR', 'br': 'BR', 'ceara': 'BR', 'ce': 'BR', 'bahia': 'BR', 'ba': 'BR', 'pernambuco': 'BR', 'pe': 'BR', 'minas gerais': 'BR', 'mg': 'BR', 'parana': 'BR', 'pr': 'BR', 'rio grande do sul': 'BR', 'rs': 'BR', 'distrito federal': 'BR', 'df': 'BR', 'amazonas': 'BR', 'am': 'BR', 'goias': 'BR', 'go': 'BR', 'santa catarina': 'BR', 'sc': 'BR' };

    // Elementos
    const searchInput = document.getElementById('zona-search-input');
    const btnBuscarMapa = document.getElementById('btn-buscar-mapa');
    const noResultsMsg = document.getElementById('zona-no-results');
    const subTabs = document.querySelectorAll('.sub-tab-button');
    
    const hud = document.getElementById('tactical-hud');
    const hudTarget = document.getElementById('hud-target');
    const hudZone = document.getElementById('hud-zone');
    const hudRoutesList = document.getElementById('hud-routes-list');

    let map, mainMarker, geoLayer;
    let layersRoute = []; // Array que guarda TODOS os objetos desenhados (linhas, pontos, labels)
    let currentTab = 'tab-sp';

    if (!searchInput) return; 

    initTabs();
    renderListas();

    // --- EVENTOS ---
    searchInput.addEventListener('input', (e) => {
        if (currentTab !== 'tab-mapa') filterZonas(e.target.value.toLowerCase());
    });

    btnBuscarMapa.addEventListener('click', () => performMapSearch());
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performMapSearch(); });

    // --- MAPA DARK ---
    function initMap() {
        if(map) return;
        map = L.map('map', { zoomControl: false, attributionControl: false }).setView([-14.235, -51.925], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 }).addTo(map);
    }

    // --- LIMPEZA ROBUSTA ---
    function limparMapaTatico() {
        if (!map) return;
        
        // Remove camadas principais
        if(mainMarker) map.removeLayer(mainMarker);
        if(geoLayer) map.removeLayer(geoLayer);
        
        // Remove todas as rotas, pontos e labels acumulados
        if (layersRoute.length > 0) {
            layersRoute.forEach(obj => {
                if(obj.layer) map.removeLayer(obj.layer); // A linha
                if(obj.marker) map.removeLayer(obj.marker); // O ponto amarelo
                if(obj.label) map.removeLayer(obj.label); // O texto
            });
        }
        layersRoute = []; // Zera o array
        
        // Reseta HUD
        hud.classList.add('hidden');
        hudRoutesList.innerHTML = '';
    }

    function performMapSearch() {
        const term = searchInput.value.trim();
        if(!term) return;
        document.querySelector('[data-subtab="tab-mapa"]').click();
        
        // Garante que o mapa carregue e LIMPA tudo antes
        setTimeout(() => {
            if(map) map.invalidateSize();
            limparMapaTatico(); // <--- CHAMA A LIMPEZA AQUI
            processarBuscaTatica(term);
        }, 100);
    }

    // --- LÓGICA TÁTICA ---
    async function processarBuscaTatica(termo) {
        if (!map) initMap();
        
        hudRoutesList.innerHTML = '<div style="text-align:center; padding:10px; color:#777;">Calculando rotas...</div>';

        const normTermo = normalize(termo);
        let estadoDetectado = STATE_MAP[normTermo];
        let isStateSearch = !!estadoDetectado;
        let contextoEstado = isStateSearch ? (estadoDetectado === 'SP' ? 'Sao Paulo' : estadoDetectado === 'RJ' ? 'Rio de Janeiro' : termo) : "";

        let zonaEncontrada = null;
        let dbAlvo = isStateSearch ? (estadoDetectado === 'BR' ? ZONAS_DB.BR : ZONAS_DB[estadoDetectado]) : [...ZONAS_DB.SP, ...ZONAS_DB.RJ, ...ZONAS_DB.BR];

        if (isStateSearch && estadoDetectado === 'BR') dbAlvo = ZONAS_DB.BR.filter(z => normalize(z.titulo).includes(normTermo));

        for (let item of dbAlvo) {
            if (normalize(item.titulo).includes(normTermo) || normalize(item.desc).includes(normTermo)) {
                zonaEncontrada = item;
                break;
            }
        }

        let alvoQuery = termo;
        if (zonaEncontrada) {
            const cidades = zonaEncontrada.desc.split(',').map(c => c.trim());
            const match = cidades.find(c => normalize(c).includes(normTermo));
            alvoQuery = match || cidades[0];
        }

        const queryGPS = contextoEstado ? `${alvoQuery}, ${contextoEstado}, Brazil` : `${alvoQuery}, Brazil`;
        const coordsAlvo = await getCoordinates(queryGPS, true);
        
        if(!coordsAlvo) { alert("Local não encontrado."); return; }

        // Desenha Alvo Principal
        if (coordsAlvo.geojson && (isStateSearch || coordsAlvo.tipo === 'boundary')) {
            geoLayer = L.geoJSON(coordsAlvo.geojson, { style: { color: '#E8B923', weight: 2, opacity: 0.8, fillColor: '#E8B923', fillOpacity: 0.1 } }).addTo(map);
            map.fitBounds(geoLayer.getBounds());
            if (isStateSearch) addLabel(map, [coordsAlvo.lat, coordsAlvo.lon], alvoQuery.toUpperCase(), true);
        } 
        
        if (!isStateSearch) {
            const pulseIcon = L.divIcon({ className: 'pulse-yellow', iconSize: [20, 20] });
            mainMarker = L.marker([coordsAlvo.lat, coordsAlvo.lon], {icon: pulseIcon}).addTo(map);
            if (!geoLayer) map.flyTo([coordsAlvo.lat, coordsAlvo.lon], 12, { duration: 1.5 });
            addLabel(map, [coordsAlvo.lat, coordsAlvo.lon], alvoQuery.toUpperCase(), true);
        }

        hudTarget.textContent = alvoQuery.toUpperCase();
        hudZone.textContent = zonaEncontrada ? zonaEncontrada.titulo : (isStateSearch ? "ESTADO/REGIÃO" : "FORA DA BASE");
        hud.classList.remove('hidden');

        // Rotas para Vizinhas
        if (zonaEncontrada) {
            const cidades = zonaEncontrada.desc.split(',').map(c => c.trim());
            const vizinhas = cidades.filter(c => normalize(c) !== normalize(alvoQuery)).slice(0, 8); // Limite 8
            
            hudRoutesList.innerHTML = ''; 

            if (vizinhas.length > 0) {
                for (let vizinha of vizinhas) {
                    const queryVizinha = `${vizinha}, ${contextoEstado}, Brazil`;
                    const coordsVizinha = await getCoordinates(queryVizinha);
                    
                    if(coordsVizinha) {
                        const dadosRota = await getRouteData(coordsAlvo, coordsVizinha);
                        if(dadosRota) {
                            desenharRotaGPS(map, coordsAlvo, coordsVizinha, vizinha, dadosRota, layersRoute, hudRoutesList);
                        }
                    }
                    await new Promise(r => setTimeout(r, 250));
                }
            } else {
                hudRoutesList.innerHTML = '<small>Zona única.</small>';
            }
        } else {
            hudRoutesList.innerHTML = '<small>Sem dados de rota.</small>';
        }
    }

    function desenharRotaGPS(mapObj, origem, destino, nomeDestino, dados, layerArr, listContainer) {
        // 1. Desenha a linha (Amarelo Padrão)
        const line = L.geoJSON(dados.geometry, {
            style: { color: '#E8B923', weight: 3, opacity: 0.5, dashArray: '5, 10' }
        }).addTo(mapObj);

        // 2. Desenha o ponto
        const dotIcon = L.divIcon({ className: 'marker-dot', iconSize: [8,8] });
        const m = L.marker([destino.lat, destino.lon], {icon: dotIcon}).addTo(mapObj);
        
        // 3. Desenha o label
        const l = addLabel(mapObj, [destino.lat, destino.lon], nomeDestino);

        // 4. Cria o item no HUD
        const item = document.createElement('div');
        item.className = 'hud-route-item';
        
        const gMapsLink = `https://www.google.com/maps/dir/?api=1&origin=${origem.lat},${origem.lon}&destination=${destino.lat},${destino.lon}&travelmode=driving`;

        item.innerHTML = `
            <div style="display:flex; flex-direction:column; width:100%">
                <div class="hud-route-header"><span class="hud-route-dest">${nomeDestino}</span></div>
                <div class="hud-route-stats">
                    <div class="hud-stat-box"><span class="hud-stat-value stat-dist">${dados.km}<small>km</small></span></div>
                    <div class="hud-stat-box"><span class="hud-stat-value stat-time">${dados.time}</span></div>
                    <a href="${gMapsLink}" target="_blank" class="btn-gps-ext">MAPS ↗</a>
                </div>
            </div>
        `;
        
        // --- LÓGICA DE ATIVAÇÃO DA ROTA (FIX BUG) ---
        const ativarRota = (e) => {
            if(e.target.classList.contains('btn-gps-ext')) return;

            // 1. Reseta TODAS as rotas existentes no array para o estilo padrão
            layerArr.forEach(obj => { 
                // Verifica se o objeto tem 'layer' e se ele tem o método setStyle (é uma rota)
                if(obj.layer && obj.layer.setStyle) {
                    obj.layer.setStyle({ color: '#E8B923', weight: 3, opacity: 0.5, dashArray: '5, 10' });
                    if (obj.layer.bringToBack) obj.layer.bringToBack(); // Manda para trás
                }
                // Remove classe ativa do item HUD correspondente
                if(obj.hudItem) {
                    obj.hudItem.classList.remove('active-route');
                }
            });
            
            // 2. Ativa APENAS a rota clicada
            line.setStyle({ color: 'var(--neon-green)', weight: 6, opacity: 1, dashArray: null });
            if (line.bringToFront) line.bringToFront(); // Traz para frente
            
            item.classList.add('active-route'); // Ilumina o item no HUD
            
            // Zoom suave na rota
            mapObj.fitBounds(line.getBounds(), { padding: [50, 50] });
        };

        // Adiciona o evento de clique tanto no item da lista quanto na linha do mapa
        item.addEventListener('click', ativarRota);
        line.on('click', ativarRota);

        // Salva tudo no array de controle para podermos limpar/resetar depois
        layerArr.push({ layer: line, marker: m, label: l, hudItem: item });
        listContainer.appendChild(item);
    }

    function addLabel(mapObj, coords, text, isMain = false) {
        const labelIcon = L.divIcon({
            className: isMain ? 'map-label-main' : 'map-label-yellow',
            html: text, iconSize: [150, 20], iconAnchor: isMain ? [75, 40] : [-10, 10]
        });
        return L.marker(coords, { icon: labelIcon, interactive: false }).addTo(mapObj);
    }

    async function getCoordinates(query, getPoly = false) {
        try {
            const polyParam = getPoly ? '&polygon_geojson=1' : '';
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}${polyParam}&limit=1`);
            const data = await res.json();
            if(data.length > 0) {
                const item = data[0];
                const isBoundary = item.class === 'boundary' || item.type === 'administrative' || item.type === 'state';
                return { 
                    lat: parseFloat(item.lat), lon: parseFloat(item.lon),
                    geojson: item.geojson, tipo: isBoundary ? 'boundary' : 'city'
                };
            }
        } catch(e) {}
        return null;
    }

    async function getRouteData(start, end) {
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`;
            const res = await fetch(url);
            const data = await res.json();
            if(data.routes.length) {
                const r = data.routes[0];
                const km = (r.distance/1000).toFixed(1);
                const min = Math.round((r.duration * 1.5) / 60);
                const timeStr = min > 60 ? `${Math.floor(min/60)}h ${min%60}m` : `${min} min`;
                return { km, time: timeStr, geometry: r.geometry };
            }
        } catch(e) {}
        return null;
    }

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
                    div.onclick = () => { searchInput.value = z.desc.split(',')[0]; performMapSearch(); };
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
            if(normalize(c.innerText).includes(normTerm)) { c.style.display = 'block'; c.style.borderColor = term ? 'var(--batman-yellow)' : ''; found++; }
            else { c.style.display = 'none'; }
        });
        const msg = document.getElementById('zona-no-results');
        if(msg) msg.style.display = (found === 0 && term) ? 'block' : 'none';
    }
    function normalize(str) { return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
});