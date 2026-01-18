// js/bloco_de_notas.js

document.addEventListener('DOMContentLoaded', () => {

    const notesListContainer = document.getElementById('notes-list');
    const noteEditorArea = document.getElementById('note-editor-area');
    const newNoteBtn = document.getElementById('new-note-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');

    let allNotes = [];
    let activeNoteId = null;

    // --- 1. FUNÇÕES DE DADOS (LOCALSTORAGE) --- 

    // Carrega todas as notas do localStorage
    function loadNotesFromStorage() {
        const notesJSON = localStorage.getItem('bat-system-notes');
        allNotes = notesJSON ? JSON.parse(notesJSON) : [];
    }

    // Salva todas as notas no localStorage
    function saveNotesToStorage() {
        localStorage.setItem('bat-system-notes', JSON.stringify(allNotes));
    }

    // --- 2. FUNÇÕES DE RENDERIZAÇÃO (TELA) ---

    // Atualiza a lista da sidebar
    function renderNotesList() {
        notesListContainer.innerHTML = ''; // Limpa a lista
        if (allNotes.length === 0) {
            notesListContainer.innerHTML = '<p style="padding: 1rem; text-align: center;">Nenhuma nota encontrada.</p>';
            return;
        }

        // Ordena as notas da mais nova para a mais antiga
        allNotes.sort((a, b) => b.id - a.id);

        allNotes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            noteItem.dataset.id = note.id; // Salva o ID no elemento

            // Adiciona 'active' se for a nota selecionada
            if (note.id === activeNoteId) {
                noteItem.classList.add('active');
            }

            const title = note.content.split('\n')[0] || 'Nova Nota...'; // Pega a primeira linha como título
            const date = new Date(note.id).toLocaleString('pt-BR');

            noteItem.innerHTML = `
                <h4 class="note-item-title">${title.substring(0, 40)}</h4>
                <p class="note-item-date">${date}</p>
            `;
            
            // Adiciona o evento de clique para abrir a nota
            noteItem.addEventListener('click', () => {
                displayNoteContent(note.id);
            });
            
            notesListContainer.appendChild(noteItem);
        });
    }

    // Mostra o conteúdo da nota no editor
    function displayNoteContent(noteId) {
        const note = allNotes.find(n => n.id === noteId);
        if (!note) return;

        activeNoteId = note.id;
        noteEditorArea.value = note.content;
        noteEditorArea.disabled = false;
        saveNoteBtn.disabled = false;
        deleteNoteBtn.disabled = false;

        // Atualiza a classe 'active' na lista
        renderNotesList();
    }
    
    // Limpa o editor
    function clearEditor() {
        activeNoteId = null;
        noteEditorArea.value = 'Selecione uma nota ou crie uma nova.';
        noteEditorArea.disabled = true;
        saveNoteBtn.disabled = true;
        deleteNoteBtn.disabled = true;
        renderNotesList();
    }

    // --- 3. FUNÇÕES DE AÇÃO (BOTÕES) ---

    function createNewNote() {
        const newNote = {
            id: Date.now(), // ID único baseado no timestamp
            content: "" // Conteúdo vazio
        };

        allNotes.push(newNote);
        saveNotesToStorage();
        
        displayNoteContent(newNote.id);
        noteEditorArea.focus(); // Foca no editor para o usuário digitar
    }

    function saveActiveNote() {
        if (!activeNoteId) return;

        const noteIndex = allNotes.findIndex(n => n.id === activeNoteId);
        if (noteIndex === -1) return;
        
        allNotes[noteIndex].content = noteEditorArea.value;
        saveNotesToStorage();
        
        // Atualiza a lista para mostrar o novo título
        renderNotesList();
        
        // Efeito "salvo"
        saveNoteBtn.textContent = "SALVO! ✅";
        setTimeout(() => {
            saveNoteBtn.textContent = "SALVAR ALTERAÇÕES";
        }, 1500);
    }

    function deleteActiveNote() {
        if (!activeNoteId) return;
        
        if (confirm("Tem certeza que deseja deletar esta nota? Esta ação não pode ser desfeita.")) {
            allNotes = allNotes.filter(n => n.id !== activeNoteId);
            saveNotesToStorage();
            clearEditor();
        }
    }

    // --- 4. INICIALIZAÇÃO ---

    function initNotepad() {
        if (!notesListContainer) return; // Garante que estamos na página certa
        
        loadNotesFromStorage();
        clearEditor(); // Limpa e renderiza a lista inicial
        
        newNoteBtn.addEventListener('click', createNewNote);
        saveNoteBtn.addEventListener('click', saveActiveNote);
        deleteNoteBtn.addEventListener('click', deleteActiveNote);
        
        // Salva automaticamente a cada 2 segundos
        setInterval(() => {
            if(activeNoteId && !noteEditorArea.disabled) {
                saveActiveNote();
            }
        }, 2000);
    }

    initNotepad();
});