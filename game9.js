// ==========================================
// ACTIVITY 9: Sopa de Letras
// ==========================================
games.push({
    id: 9,
    title: "Sopa de Letras",
    icon: "🔍",
    render: renderGame9,
    check: checkGame9
});

let wordSearchState = {
    grid: [],
    words: ['COCHE', 'MOTO', 'TREN', 'BARCO', 'AVION', 'METRO', 'GLOBO', 'COHETE', 'LANCHA', 'TRANVIA'],
    foundWords: [],
    selectedStart: null,
    selectedEnd: null
};

function renderGame9() {
    wordSearchState.foundWords = [];
    wordSearchState.selectedStart = null;
    wordSearchState.selectedEnd = null;
    wordSearchState.grid = generateWordSearchGrid(12, wordSearchState.words);
    
    const container = document.createElement('div');
    container.className = 'ws-container';
    
    container.innerHTML = `
        <p class="instruction">Toca la primera y la última letra de cada palabra:</p>
        <div class="ws-layout">
            <div class="ws-grid" id="ws-grid"></div>
            <div class="ws-words-list" id="ws-words-list"></div>
        </div>
    `;
    
    els.activityContent.appendChild(container);
    
    const gridEl = document.getElementById('ws-grid');
    gridEl.style.gridTemplateColumns = `repeat(12, 1fr)`;
    
    for (let y = 0; y < 12; y++) {
        for (let x = 0; x < 12; x++) {
            const cell = document.createElement('div');
            cell.className = 'ws-cell';
            cell.innerText = wordSearchState.grid[y][x];
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.onclick = () => handleCellClick(x, y, cell);
            gridEl.appendChild(cell);
        }
    }
    
    renderWordsList();
    
    // Hide check button, auto-check is better for word search
    btns.check.classList.add('hidden');
}

function handleCellClick(x, y, cell) {
    playSound('pop');
    
    if (!wordSearchState.selectedStart) {
        wordSearchState.selectedStart = { x, y, el: cell };
        cell.classList.add('selected');
    } else if (!wordSearchState.selectedEnd) {
        // Selection complete
        wordSearchState.selectedEnd = { x, y, el: cell };
        cell.classList.add('selected');
        
        checkWordSelection();
    } else {
        // Reset selection
        wordSearchState.selectedStart.el.classList.remove('selected');
        wordSearchState.selectedEnd.el.classList.remove('selected');
        wordSearchState.selectedStart = { x, y, el: cell };
        wordSearchState.selectedEnd = null;
        cell.classList.add('selected');
        
        // Clear highlights that are not found words
        document.querySelectorAll('.ws-cell.highlight').forEach(el => el.classList.remove('highlight'));
    }
}

function checkWordSelection() {
    const { x: x1, y: y1 } = wordSearchState.selectedStart;
    const { x: x2, y: y2 } = wordSearchState.selectedEnd;
    
    // Determine path
    let path = [];
    let word = "";
    
    if (x1 === x2) {
        // Vertical
        const startY = Math.min(y1, y2);
        const endY = Math.max(y1, y2);
        for (let y = startY; y <= endY; y++) {
            path.push({ x: x1, y });
            word += wordSearchState.grid[y][x1];
        }
    } else if (y1 === y2) {
        // Horizontal
        const startX = Math.min(x1, x2);
        const endX = Math.max(x1, x2);
        for (let x = startX; x <= endX; x++) {
            path.push({ x, y: y1 });
            word += wordSearchState.grid[y1][x];
        }
    } else {
        // Invalid diagonal (for kids we stick to H/V) or not a straight line
        resetSelection(false);
        return;
    }
    
    // Check if word is reversed
    const wordRev = word.split('').reverse().join('');
    
    let found = wordSearchState.words.find(w => (w === word || w === wordRev) && !wordSearchState.foundWords.includes(w));
    
    if (found) {
        playSound('success');
        wordSearchState.foundWords.push(found);
        path.forEach(pos => {
            const cell = document.querySelector(`.ws-cell[data-x="${pos.x}"][data-y="${pos.y}"]`);
            cell.classList.add('found');
            cell.classList.remove('selected');
        });
        wordSearchState.selectedStart = null;
        wordSearchState.selectedEnd = null;
        renderWordsList();
        
        if (wordSearchState.foundWords.length === wordSearchState.words.length) {
            setTimeout(() => showFeedback(true, "¡Has encontrado todas las palabras!"), 500);
        }
    } else {
        resetSelection(true);
    }
}

function resetSelection(isError) {
    if (isError) playSound('error');
    if (wordSearchState.selectedStart) wordSearchState.selectedStart.el.classList.remove('selected');
    if (wordSearchState.selectedEnd) wordSearchState.selectedEnd.el.classList.remove('selected');
    wordSearchState.selectedStart = null;
    wordSearchState.selectedEnd = null;
}

function renderWordsList() {
    const listEl = document.getElementById('ws-words-list');
    listEl.innerHTML = '';
    wordSearchState.words.forEach(word => {
        const div = document.createElement('div');
        div.className = 'ws-word-item';
        if (wordSearchState.foundWords.includes(word)) {
            div.classList.add('found');
            div.innerText = "✓ " + word;
        } else {
            div.innerText = word;
        }
        listEl.appendChild(div);
    });
}

function checkGame9() {
    // Auto handled
}

// Simple grid generator
function generateWordSearchGrid(size, words) {
    const grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    words.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            const isHoriz = Math.random() > 0.5;
            const x = Math.floor(Math.random() * (size - (isHoriz ? word.length : 0)));
            const y = Math.floor(Math.random() * (size - (isHoriz ? 0 : word.length)));
            
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                const char = grid[isHoriz ? y : y + i][isHoriz ? x + i : x];
                if (char !== '' && char !== word[i]) {
                    canPlace = false;
                    break;
                }
            }
            
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    grid[isHoriz ? y : y + i][isHoriz ? x + i : x] = word[i];
                }
                placed = true;
            }
            attempts++;
        }
    });
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (grid[y][x] === '') {
                grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
    return grid;
}
