// ==========================================
// ACTIVITY 10: Puzle Helicóptero
// ==========================================
games.push({
    id: 10,
    title: "Puzle de Helicóptero",
    icon: "🧩",
    render: renderGame10,
    check: checkGame10
});

let puzzleState = {
    pieces: [], // 0 to 8 correct indices
    selectedPiece: null
};

function renderGame10() {
    // Generate an array of 9 pieces (0 to 8)
    puzzleState.pieces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Shuffle
    puzzleState.pieces.sort(() => Math.random() - 0.5);
    puzzleState.selectedPiece = null;
    
    const container = document.createElement('div');
    container.className = 'puzzle-container';
    container.innerHTML = `<p class="instruction">Toca dos piezas para intercambiarlas y formar el helicóptero:</p>`;
    
    const grid = document.createElement('div');
    grid.className = 'puzzle-grid';
    grid.id = 'puzzle-grid';
    
    renderPuzzleGrid(grid);
    
    container.appendChild(grid);
    els.activityContent.appendChild(container);
    btns.check.classList.remove('hidden'); // Need check button to complete
}

function renderPuzzleGrid(grid) {
    grid.innerHTML = '';
    
    puzzleState.pieces.forEach((pieceIndex, position) => {
        const pieceDiv = document.createElement('div');
        pieceDiv.className = 'puzzle-piece';
        
        // Background positions: 
        // 0: 0% 0%, 1: 50% 0%, 2: 100% 0%
        // 3: 0% 50%, 4: 50% 50%, 5: 100% 50%
        // 6: 0% 100%, 7: 50% 100%, 8: 100% 100%
        const xPos = (pieceIndex % 3) * 50;
        const yPos = Math.floor(pieceIndex / 3) * 50;
        
        pieceDiv.style.backgroundPosition = `${xPos}% ${yPos}%`;
        pieceDiv.dataset.pos = position;
        
        if (puzzleState.selectedPiece === position) {
            pieceDiv.classList.add('selected');
        }
        
        pieceDiv.onclick = () => handlePieceClick(position);
        grid.appendChild(pieceDiv);
    });
}

function handlePieceClick(position) {
    playSound('pop');
    if (puzzleState.selectedPiece === null) {
        puzzleState.selectedPiece = position;
    } else {
        if (puzzleState.selectedPiece === position) {
            puzzleState.selectedPiece = null; // deselect
        } else {
            // Swap
            const temp = puzzleState.pieces[position];
            puzzleState.pieces[position] = puzzleState.pieces[puzzleState.selectedPiece];
            puzzleState.pieces[puzzleState.selectedPiece] = temp;
            puzzleState.selectedPiece = null;
            
            // Auto check if completed
            if (puzzleState.pieces.every((p, i) => p === i)) {
                setTimeout(() => checkGame10(), 300);
            }
        }
    }
    renderPuzzleGrid(document.getElementById('puzzle-grid'));
}

function checkGame10() {
    const isCorrect = puzzleState.pieces.every((p, i) => p === i);
    if (isCorrect) {
        showFeedback(true, "¡Excelente! Has completado el puzle.");
    } else {
        showFeedback(false, "El puzle todavía no está correcto. ¡Sigue intentándolo!");
    }
}
