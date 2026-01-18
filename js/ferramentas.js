// js/ferramentas.js
// Lógica unificada para FERRAMENTAS (Notas Rich Text, PDF, Calculadora)

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ABAS
    const subTabs = document.querySelectorAll('.sub-tab-button');
    const subPanels = document.querySelectorAll('.sub-tab-panel');
    subTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            subTabs.forEach(b => b.classList.remove('active'));
            subPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.subtab).classList.add('active');
        });
    });

    // 2. BLOCO DE NOTAS 
    initNotepad();

    // 3. PDF
    initPdfConverter();

    // 4. CALCULADORA
    initCalculator();
});

function initNotepad() {
    const notesListContainer = document.getElementById('notes-list');
    const noteEditorArea = document.getElementById('note-editor-area');
    const newNoteBtn = document.getElementById('new-note-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    const downloadNoteBtn = document.getElementById('download-note-btn');

    if (!notesListContainer) return;

    let allNotes = JSON.parse(localStorage.getItem('bat-system-notes') || '[]');
    let activeNoteId = null;

    function saveStorage() {
        localStorage.setItem('bat-system-notes', JSON.stringify(allNotes));
    }

    function renderList() {
        notesListContainer.innerHTML = '';
        if (allNotes.length === 0) {
            notesListContainer.innerHTML = '<p style="padding:1rem;text-align:center;color:#666">Sem notas.</p>';
            return;
        }
        allNotes.sort((a, b) => b.id - a.id).forEach(note => {
            const div = document.createElement('div');
            div.className = `note-item ${note.id === activeNoteId ? 'active' : ''}`;
            // Tira tags HTML para o título
            const plainText = note.content.replace(/<[^>]*>/g, '');
            const title = (plainText.split('\n')[0] || 'Nova Nota').substring(0,30);
            div.innerHTML = `<h4 class="note-item-title">${title}</h4>
                             <p class="note-item-date">${new Date(note.id).toLocaleString('pt-BR')}</p>`;
            div.onclick = () => loadNote(note.id);
            notesListContainer.appendChild(div);
        });
    }

    function loadNote(id) {
        activeNoteId = id;
        const note = allNotes.find(n => n.id === id);
        if (note) {
            noteEditorArea.innerHTML = note.content; // Carrega HTML
            noteEditorArea.contentEditable = "true";
            saveNoteBtn.disabled = false;
            deleteNoteBtn.disabled = false;
            downloadNoteBtn.disabled = false;
            renderList();
        }
    }

    newNoteBtn.onclick = () => {
        const newNote = { id: Date.now(), content: "" };
        allNotes.push(newNote);
        saveStorage();
        loadNote(newNote.id);
        noteEditorArea.focus();
    };

    saveNoteBtn.onclick = () => {
        if (!activeNoteId) return;
        const idx = allNotes.findIndex(n => n.id === activeNoteId);
        if (idx > -1) {
            allNotes[idx].content = noteEditorArea.innerHTML; // Salva HTML
            saveStorage();
            renderList();
            const original = saveNoteBtn.textContent;
            saveNoteBtn.textContent = "SALVO!";
            setTimeout(() => saveNoteBtn.textContent = original, 1000);
        }
    };

    deleteNoteBtn.onclick = () => {
        if (confirm("Deletar nota?")) {
            allNotes = allNotes.filter(n => n.id !== activeNoteId);
            saveStorage();
            activeNoteId = null;
            noteEditorArea.innerHTML = "";
            noteEditorArea.contentEditable = "false";
            renderList();
        }
    };
    
    downloadNoteBtn.onclick = () => {
        if (!activeNoteId) return;
        const note = allNotes.find(n => n.id === activeNoteId);
        if(!note) return;
        
        // Converte HTML para texto com quebras de linha para download
        const text = noteEditorArea.innerText; 
        const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Nota_${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
    };

    noteEditorArea.contentEditable = "false";
    renderList();
}

// ... (Mantenha o código de PDF e Calculadora igual ao anterior abaixo) ...
function initPdfConverter() {
    const fileInput = document.getElementById('pdf-upload');
    const dropZone = document.getElementById('drop-zone');
    const gallery = document.getElementById('gallery');
    const loadingBar = document.getElementById('loading-bar');
    const loadingContainer = document.getElementById('loading-bar-container');
    const fileNameDisplay = document.getElementById('file-name-display');
    const fileStatusDisplay = document.getElementById('file-status-display');
    const actionsBar = document.getElementById('actions-bar');
    const downloadAllBtn = document.getElementById('download-all-btn');

    if (dropZone) {
        let generatedImages = []; 

        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); });
        fileInput.addEventListener('change', (e) => { if(e.target.files[0]) processFile(e.target.files[0]); });

        async function processFile(file) {
            if (file.type !== 'application/pdf') return alert('Selecione um arquivo PDF válido.');
            fileNameDisplay.textContent = file.name;
            fileStatusDisplay.style.display = 'block';
            gallery.innerHTML = ''; 
            generatedImages = []; 
            actionsBar.style.display = 'none';
            loadingContainer.style.display = 'block';
            loadingBar.style.width = '0%';

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    await renderPage(pdf, i, file.name);
                    loadingBar.style.width = `${(i / pdf.numPages) * 100}%`;
                }
                setTimeout(() => { loadingContainer.style.display = 'none'; actionsBar.style.display = 'block'; }, 500);
            } catch (err) {
                console.error(err);
                alert('Erro ao processar PDF.');
                loadingContainer.style.display = 'none';
            }
        }

        async function renderPage(pdf, num, originalName) {
            const page = await pdf.getPage(num);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            const imgDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            canvas.toBlob((blob) => {
                generatedImages.push({ name: `${originalName.replace('.pdf','')}_Pagina_${num}.jpg`, blob: blob });
            }, 'image/jpeg', 0.8);

            const card = document.createElement('div'); card.className = 'image-card';
            const img = document.createElement('img'); img.src = imgDataUrl;
            const link = document.createElement('a'); link.href = imgDataUrl; link.download = `${originalName.replace('.pdf','')}_Pagina_${num}.jpg`; link.className = 'download-btn'; link.textContent = `BAIXAR PÁG ${num}`;
            card.appendChild(img); card.appendChild(link); gallery.appendChild(card);
        }

        downloadAllBtn.addEventListener('click', () => {
            if (generatedImages.length === 0) return;
            const zip = new JSZip();
            const folder = zip.folder("Imagens_Convertidas");
            generatedImages.forEach(img => { folder.file(img.name, img.blob); });
            downloadAllBtn.textContent = "GERANDO ZIP...";
            zip.generateAsync({type:"blob"}).then(function(content) {
                const link = document.createElement('a'); link.href = URL.createObjectURL(content); link.download = "Imagens_Convertidas.zip"; link.click();
                downloadAllBtn.textContent = "BAIXAR TUDO (ZIP)";
            });
        });
    }
}

function initCalculator() {
    const btnCalc = document.getElementById('btn-calc-terapia');
    const inputHoras = document.getElementById('calc-horas');
    const inputTempo = document.getElementById('calc-tempo');
    const displayResult = document.getElementById('calc-resultado');
    const displayValor = document.getElementById('resultado-valor');

    if (!btnCalc) return;

    btnCalc.addEventListener('click', () => {
        const horas = parseFloat(inputHoras.value);
        const tempo = parseFloat(inputTempo.value);
        if (!horas || !tempo || tempo <= 0) return alert("Insira valores válidos.");
        
        const sessoes = Math.floor((horas * 60) / tempo);
        displayValor.textContent = sessoes;
        displayResult.style.display = 'block';
        displayResult.animate([{ transform: 'scale(0.9)', opacity: 0.5 }, { transform: 'scale(1)', opacity: 1 }], { duration: 300 });
    });
}

