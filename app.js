// --- DOM Elements ---
const screens = {
    menu: document.getElementById('main-menu'),
    activity: document.getElementById('activity-container')
};
const btns = {
    fullscreen: document.getElementById('fullscreen-btn'),
    home: document.getElementById('home-btn'),
    check: document.getElementById('check-btn')
};
const els = {
    gamesGrid: document.getElementById('games-grid'),
    activityTitle: document.getElementById('activity-title'),
    activityContent: document.getElementById('activity-content'),
    starsCount: document.getElementById('stars-count'),
    feedbackMessage: document.getElementById('feedback-message')
};

// --- Audio ---
const audios = {
    success: document.getElementById('audio-success'),
    error: document.getElementById('audio-error'),
    applause: document.getElementById('audio-applause'),
    pop: document.getElementById('audio-pop')
};

function playSound(name) {
    if (audios[name]) {
        audios[name].currentTime = 0;
        audios[name].play().catch(e => console.log("Audio play prevented:", e));
    }
}

// --- State ---
let state = {
    stars: parseInt(localStorage.getItem('transporte_stars')) || 0,
    completedGames: JSON.parse(localStorage.getItem('transporte_completed')) || [],
    currentGameId: null
};

function addStar() {
    state.stars++;
    els.starsCount.innerText = state.stars;
    localStorage.setItem('transporte_stars', state.stars);
}

function markGameCompleted(id) {
    if (!state.completedGames.includes(id)) {
        state.completedGames.push(id);
        localStorage.setItem('transporte_completed', JSON.stringify(state.completedGames));
    }
}

function init() {
    els.starsCount.innerText = state.stars;
    renderMenu();
    
    btns.home.addEventListener('click', showMenu);
    btns.fullscreen.addEventListener('click', toggleFullScreen);
}

// --- Navigation ---
function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
    
    if (screenName === 'menu') {
        btns.home.classList.add('hidden');
        btns.check.classList.add('hidden');
        els.feedbackMessage.innerText = '';
        renderMenu(); // Refresh completion status
    } else {
        btns.home.classList.remove('hidden');
    }
}

function showMenu() {
    showScreen('menu');
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// --- Games Definition ---
const games = [
    {
        id: 1,
        title: "¿Qué son los medios de transporte?",
        icon: "🚗",
        render: renderGame1,
        check: checkGame1
    },
    {
        id: 2,
        title: "Público/Colectivo o Privado/Individual",
        icon: "🚌",
        render: renderGame2,
        check: checkGame2
    },
    {
        id: 5,
        title: "Terrestre, Acuático o Aéreo",
        icon: "✈️",
        render: renderGame5,
        check: checkGame5
    },
    {
        id: 7,
        title: "¿Qué energía utilizan?",
        icon: "⚡",
        render: renderGame7,
        check: checkGame7
    },
    {
        id: 3,
        title: "¿Pasajeros o Mercancías?",
        icon: "📦",
        render: renderGame3,
        check: checkGame3
    },
    {
        id: 6,
        title: "Clasifica las imágenes: Terrestre, Acuático, Aéreo",
        icon: "🖼️",
        render: renderGame6,
        check: checkGame6
    },
    {
        id: 4,
        title: "Unir con líneas",
        icon: "✏️",
        render: renderGame4,
        check: checkGame4
    },
    {
        id: 8,
        title: "Partes del Tren",
        icon: "🚂",
        render: renderGame8,
        check: checkGame8
    }
];

function renderMenu() {
    els.gamesGrid.innerHTML = '';
    
    // Ensure games are sorted by ID
    games.sort((a, b) => a.id - b.id);
    
    games.forEach((game, index) => {
        const isCompleted = state.completedGames.includes(game.id);
        const isLocked = index > 0 && !state.completedGames.includes(games[index-1].id);
        // We can let them play any game or enforce order.
        // For 6-7 year olds, let's allow playing any game, but indicate order.
        
        const card = document.createElement('div');
        card.className = `game-card ${isCompleted ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <div class="game-title">Juego ${game.id}</div>
            <div style="font-size: 0.9rem">${game.title}</div>
            ${isCompleted ? '<div>⭐ Completado</div>' : ''}
        `;
        
        card.addEventListener('click', () => {
            playSound('pop');
            startGame(game.id);
        });
        
        els.gamesGrid.appendChild(card);
    });
}

let currentGameContext = null;

function startGame(id) {
    const game = games.find(g => g.id === id);
    if (!game) return;
    
    state.currentGameId = id;
    els.activityTitle.innerText = game.title;
    els.activityContent.innerHTML = '';
    els.feedbackMessage.innerText = '';
    els.feedbackMessage.className = 'feedback-message';
    btns.check.classList.remove('hidden');
    
    // Clear old check event listener by cloning
    const newCheckBtn = btns.check.cloneNode(true);
    btns.check.parentNode.replaceChild(newCheckBtn, btns.check);
    btns.check = newCheckBtn;
    
    btns.check.addEventListener('click', () => {
        game.check();
    });
    
    currentGameContext = {}; // store state for current game
    game.render();
    showScreen('activity');
}

function showFeedback(isCorrect, message) {
    els.feedbackMessage.innerText = message;
    els.feedbackMessage.className = `feedback-message ${isCorrect ? 'feedback-success' : 'feedback-error'}`;
    
    if (isCorrect) {
        playSound('success');
        addStar();
        markGameCompleted(state.currentGameId);
        btns.check.classList.add('hidden');
        setTimeout(() => {
            playSound('applause');
        }, 1000);
    } else {
        playSound('error');
    }
}

// ==========================================
// ACTIVITY 1: Test de definición
// ==========================================
function renderGame1() {
    const options = [
        { id: 'opt1', text: "Son máquinas que ayudan a las personas a viajar de un lugar a otro.", isCorrect: true },
        { id: 'opt2', text: "Son juguetes que usamos solo en casa.", isCorrect: false },
        { id: 'opt3', text: "Son máquinas que nos ayudan a transportar mercancías.", isCorrect: true },
        { id: 'opt4', text: "Son animales que corren muy rápido.", isCorrect: false }
    ];
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    const container = document.createElement('div');
    container.className = 'game1-container';
    container.innerHTML = `<p class="instruction">Toca las DOS opciones correctas:</p>`;
    
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options-list';
    
    currentGameContext.selectedOptions = new Set();
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<div class="checkbox"></div> <span>${opt.text}</span>`;
        btn.dataset.id = opt.id;
        
        btn.addEventListener('click', () => {
            playSound('pop');
            if (currentGameContext.selectedOptions.has(opt.id)) {
                currentGameContext.selectedOptions.delete(opt.id);
                btn.classList.remove('selected');
                btn.querySelector('.checkbox').innerHTML = '';
            } else {
                currentGameContext.selectedOptions.add(opt.id);
                btn.classList.add('selected');
                btn.querySelector('.checkbox').innerHTML = '✓';
            }
        });
        
        optionsDiv.appendChild(btn);
    });
    
    container.appendChild(optionsDiv);
    els.activityContent.appendChild(container);
}

function checkGame1() {
    const selected = currentGameContext.selectedOptions;
    if (selected.size !== 2) {
        showFeedback(false, "¡Tienes que seleccionar exactamente DOS opciones correctas!");
        return;
    }
    
    if (selected.has('opt1') && selected.has('opt3')) {
        showFeedback(true, "¡Excelente! Has acertado.");
    } else {
        showFeedback(false, "Vaya, esa no es la respuesta correcta. ¡Inténtalo de nuevo!");
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', init);

// ==========================================
// Classification Shared Helper
// ==========================================
function renderClassificationGame(instruction, itemsData, columnsData) {
    // Shuffle items
    itemsData.sort(() => Math.random() - 0.5);
    currentGameContext.items = itemsData;
    currentGameContext.selectedId = null;
    
    const container = document.createElement('div');
    container.className = 'classification-container';
    
    let colsHtml = columnsData.map(col => `
        <div class="class-column" data-target="${col.id}">
            <h3 style="background:${col.color}">${col.title}</h3>
            <div class="drop-zone" id="${col.id}"></div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <p class="instruction">${instruction}</p>
        <div class="source-pool" id="source-pool"></div>
        <div class="columns-container">${colsHtml}</div>
    `;
    
    els.activityContent.appendChild(container);
    
    const sourcePool = document.getElementById('source-pool');
    
    itemsData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'draggable-item';
        
        if (item.html) {
            div.innerHTML = item.html;
            div.classList.add('icon-item');
        } else {
            div.innerText = item.text;
        }
        
        div.id = item.id;
        div.onclick = (e) => { e.stopPropagation(); selectClassificationItem(item.id, div); };
        sourcePool.appendChild(div);
    });
    
    document.querySelectorAll('.class-column').forEach(col => {
        col.onclick = () => {
            if (currentGameContext.selectedId) {
                playSound('pop');
                const itemDiv = document.getElementById(currentGameContext.selectedId);
                col.querySelector('.drop-zone').appendChild(itemDiv);
                itemDiv.classList.remove('selected');
                currentGameContext.selectedId = null;
            }
        };
    });
    
    sourcePool.onclick = (e) => {
        if (currentGameContext.selectedId) {
            playSound('pop');
            const itemDiv = document.getElementById(currentGameContext.selectedId);
            sourcePool.appendChild(itemDiv);
            itemDiv.classList.remove('selected');
            currentGameContext.selectedId = null;
        }
    };
}

function selectClassificationItem(id, el) {
    playSound('pop');
    if (currentGameContext.selectedId) {
        document.getElementById(currentGameContext.selectedId).classList.remove('selected');
    }
    if (currentGameContext.selectedId === id) {
        currentGameContext.selectedId = null;
    } else {
        currentGameContext.selectedId = id;
        el.classList.add('selected');
    }
}

function checkClassificationGame() {
    let allCorrect = true;
    let allPlaced = true;
    
    currentGameContext.items.forEach(item => {
        const el = document.getElementById(item.id);
        const parentId = el.parentElement.id;
        
        if (parentId === 'source-pool') {
            allPlaced = false;
        } else if (parentId !== item.target) {
            allCorrect = false;
            el.classList.add('error-shake');
            setTimeout(() => el.classList.remove('error-shake'), 500);
        } else {
            el.classList.add('correct-glow');
        }
    });
    
    if (!allPlaced) {
        showFeedback(false, "¡Tienes que clasificar todos los transportes!");
    } else if (!allCorrect) {
        showFeedback(false, "Hay algunos errores. ¡Fíjate bien y vuelve a intentarlo!");
    } else {
        showFeedback(true, "¡Perfecto! Has clasificado todos correctamente.");
    }
}

// ==========================================
// ACTIVITY 2: Público vs Privado
// ==========================================
function renderGame2() {
    const items = [
        { id: 'i1', text: 'Coche', target: 'col1' },
        { id: 'i2', text: 'Moto', target: 'col1' },
        { id: 'i3', text: 'Patinete', target: 'col1' },
        { id: 'i4', text: 'Quad', target: 'col1' },
        { id: 'i5', text: 'Bicicleta', target: 'col1' },
        { id: 'i6', text: 'Autobús', target: 'col2' },
        { id: 'i7', text: 'Avión', target: 'col2' },
        { id: 'i8', text: 'Crucero', target: 'col2' },
        { id: 'i9', text: 'Metro', target: 'col2' },
        { id: 'i10', text: 'Tren', target: 'col2' }
    ];
    
    const cols = [
        { id: 'col1', title: 'Individual / Privado', color: 'var(--accent)' },
        { id: 'col2', title: 'Colectivo / Público', color: 'var(--secondary)' }
    ];
    
    renderClassificationGame("Toca un transporte y luego toca la caja donde va:", items, cols);
}

function checkGame2() {
    checkClassificationGame();
}

// ==========================================
// ACTIVITY 5: Terrestre, Acuático, Aéreo
// ==========================================
function renderGame5() {
    const items = [
        { id: 't1', text: 'Metro', target: 'terr' },
        { id: 't2', text: 'Tranvía', target: 'terr' },
        { id: 't3', text: 'Tractor', target: 'terr' },
        { id: 't4', text: 'Ambulancia', target: 'terr' },
        { id: 't5', text: 'Furgoneta', target: 'terr' },
        { id: 'a1', text: 'Ferri', target: 'agua' },
        { id: 'a2', text: 'Lancha', target: 'agua' },
        { id: 'a3', text: 'Velero', target: 'agua' },
        { id: 'a4', text: 'Submarino', target: 'agua' },
        { id: 'a5', text: 'Carguero', target: 'agua' },
        { id: 'v1', text: 'Cohete', target: 'aire' },
        { id: 'v2', text: 'Globo', target: 'aire' },
        { id: 'v3', text: 'Helicóptero', target: 'aire' },
        { id: 'v4', text: 'Avioneta', target: 'aire' },
        { id: 'v5', text: 'Parapente', target: 'aire' }
    ];
    
    const cols = [
        { id: 'terr', title: 'Terrestre', color: '#8d6e63' }, // Brown
        { id: 'agua', title: 'Acuático', color: '#29b6f6' }, // Blue
        { id: 'aire', title: 'Aéreo', color: '#ab47bc' }     // Purple
    ];
    
    renderClassificationGame("Clasifica los siguientes transportes:", items, cols);
}

function checkGame5() {
    checkClassificationGame();
}

// ==========================================
// ACTIVITY 7: Energía
// ==========================================
function renderGame7() {
    const items = [
        { id: 'c1', text: 'Coche', target: 'comb' },
        { id: 'c2', text: 'Moto', target: 'comb' },
        { id: 'c3', text: 'Avión', target: 'comb' },
        { id: 'e1', text: 'Tren AVE', target: 'elec' },
        { id: 'e2', text: 'Tranvía', target: 'elec' },
        { id: 'e3', text: 'Patinete Eléctrico', target: 'elec' },
        { id: 'p1', text: 'Bicicleta', target: 'pers' },
        { id: 'p2', text: 'Piragua', target: 'pers' },
        { id: 'p3', text: 'Monopatín', target: 'pers' },
        { id: 'a1', text: 'Velero', target: 'aire' },
        { id: 'a2', text: 'Parapente', target: 'aire' },
        { id: 'a3', text: 'Globo', target: 'aire' }
    ];
    
    const cols = [
        { id: 'comb', title: 'Combustible', color: '#ff5722' },
        { id: 'elec', title: 'Electricidad', color: '#ffc107' },
        { id: 'pers', title: 'Fuerza Personas', color: '#4caf50' },
        { id: 'aire', title: 'Aire', color: '#00bcd4' }
    ];
    
    renderClassificationGame("Clasifica los transportes según la energía que usan:", items, cols);
}

function checkGame7() {
    checkClassificationGame();
}

// ==========================================
// ACTIVITY 3: Pasajeros vs Mercancías
// ==========================================
function renderGame3() {
    const items = [
        { id: 'm1', html: svgs.camion_mercancias, target: 'merc' },
        { id: 'm2', html: svgs.barco_mercancias, target: 'merc' },
        { id: 'm3', html: svgs.tren_mercancias, target: 'merc' },
        { id: 'p1', html: svgs.autobus_pasajeros, target: 'pasa' },
        { id: 'p2', html: svgs.avion_pasajeros, target: 'pasa' },
        { id: 'p3', html: svgs.coche_pasajeros, target: 'pasa' }
    ];
    
    const cols = [
        { id: 'pasa', title: 'Pasajeros', color: '#e91e63' },
        { id: 'merc', title: 'Mercancías', color: '#3f51b5' }
    ];
    
    renderClassificationGame("Clasifica las imágenes en Pasajeros o Mercancías:", items, cols);
}

function checkGame3() {
    checkClassificationGame();
}

// ==========================================
// ACTIVITY 6: Clasificar Imágenes
// ==========================================
function renderGame6() {
    const items = [
        { id: 't1', html: svgs.metro, target: 'terr' },
        { id: 't2', html: svgs.bicicleta, target: 'terr' },
        { id: 't3', html: svgs.tractor, target: 'terr' },
        { id: 'a1', html: svgs.piragua, target: 'agua' },
        { id: 'a2', html: svgs.moto_acuatica, target: 'agua' },
        { id: 'a3', html: svgs.barco_velero, target: 'agua' },
        { id: 'a4', html: svgs.submarino, target: 'agua' },
        { id: 'v1', html: svgs.globo, target: 'aire' },
        { id: 'v2', html: svgs.ala_delta, target: 'aire' },
        { id: 'v3', html: svgs.helicoptero, target: 'aire' }
    ];
    
    const cols = [
        { id: 'terr', title: 'Terrestre', color: '#8d6e63' },
        { id: 'agua', title: 'Acuático', color: '#29b6f6' },
        { id: 'aire', title: 'Aéreo', color: '#ab47bc' }
    ];
    
    renderClassificationGame("Clasifica las imágenes por dónde se mueven:", items, cols);
}

function checkGame6() {
    checkClassificationGame();
}

// ==========================================
// Connection Shared Helper
// ==========================================
function renderConnectionGame(instruction, leftItems, rightItems) {
    currentGameContext.connections = []; // Array of {leftId, rightId}
    currentGameContext.selectedLeft = null;
    currentGameContext.selectedRight = null;
    currentGameContext.leftItems = leftItems;
    currentGameContext.rightItems = rightItems;
    
    leftItems.sort(() => Math.random() - 0.5);
    // rightItems.sort(() => Math.random() - 0.5); // Optional
    
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    
    container.innerHTML = `<p class="instruction">${instruction}</p>`;
    
    const connContainer = document.createElement('div');
    connContainer.className = 'connection-container';
    connContainer.id = 'conn-container';
    
    const leftCol = document.createElement('div');
    leftCol.className = 'connect-col left-col';
    
    const rightCol = document.createElement('div');
    rightCol.className = 'connect-col right-col';
    
    leftItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'connect-item left-item';
        div.innerHTML = item.html || item.text;
        div.id = item.id;
        div.onclick = () => handleConnectClick('left', item.id);
        leftCol.appendChild(div);
    });
    
    rightItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'connect-item right-item';
        div.innerHTML = item.html || item.text;
        div.id = item.id;
        div.onclick = () => handleConnectClick('right', item.id);
        rightCol.appendChild(div);
    });
    
    const canvas = document.createElement('canvas');
    canvas.id = 'connect-canvas';
    
    connContainer.appendChild(leftCol);
    connContainer.appendChild(canvas);
    connContainer.appendChild(rightCol);
    
    container.appendChild(connContainer);
    els.activityContent.appendChild(container);
    
    // Resize canvas to match container
    setTimeout(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        currentGameContext.resizeListener = resizeCanvas;
    }, 100);
}

function handleConnectClick(side, id) {
    playSound('pop');
    const isLeft = side === 'left';
    
    // Remove old selection if clicking same side
    if (isLeft) {
        if (currentGameContext.selectedLeft === id) {
            currentGameContext.selectedLeft = null;
            document.getElementById(id).classList.remove('selected');
            return;
        }
        if (currentGameContext.selectedLeft) {
            document.getElementById(currentGameContext.selectedLeft).classList.remove('selected');
        }
        currentGameContext.selectedLeft = id;
    } else {
        if (currentGameContext.selectedRight === id) {
            currentGameContext.selectedRight = null;
            document.getElementById(id).classList.remove('selected');
            return;
        }
        if (currentGameContext.selectedRight) {
            document.getElementById(currentGameContext.selectedRight).classList.remove('selected');
        }
        currentGameContext.selectedRight = id;
    }
    
    document.getElementById(id).classList.add('selected');
    
    // Check if we have a pair
    if (currentGameContext.selectedLeft && currentGameContext.selectedRight) {
        // Create connection
        const leftId = currentGameContext.selectedLeft;
        const rightId = currentGameContext.selectedRight;
        
        // Remove existing connections for these items
        currentGameContext.connections = currentGameContext.connections.filter(
            c => c.leftId !== leftId && c.rightId !== rightId
        );
        
        currentGameContext.connections.push({ leftId, rightId });
        
        // Reset selection visual
        document.getElementById(leftId).classList.remove('selected');
        document.getElementById(rightId).classList.remove('selected');
        currentGameContext.selectedLeft = null;
        currentGameContext.selectedRight = null;
        
        drawConnections();
    }
}

function resizeCanvas() {
    const container = document.getElementById('conn-container');
    const canvas = document.getElementById('connect-canvas');
    if (!container || !canvas) {
        window.removeEventListener('resize', currentGameContext.resizeListener);
        return;
    }
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    drawConnections();
}

function drawConnections() {
    const canvas = document.getElementById('connect-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const containerRect = document.getElementById('conn-container').getBoundingClientRect();
    
    currentGameContext.connections.forEach(conn => {
        const leftEl = document.getElementById(conn.leftId);
        const rightEl = document.getElementById(conn.rightId);
        if (!leftEl || !rightEl) return;
        
        const lRect = leftEl.getBoundingClientRect();
        const rRect = rightEl.getBoundingClientRect();
        
        const startX = lRect.right - containerRect.left;
        const startY = lRect.top + lRect.height/2 - containerRect.top;
        const endX = rRect.left - containerRect.left;
        const endY = rRect.top + rRect.height/2 - containerRect.top;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        // Draw a nice bezier curve
        ctx.bezierCurveTo(startX + 100, startY, endX - 100, endY, endX, endY);
        ctx.strokeStyle = conn.isError ? 'var(--error)' : (conn.isCorrect ? 'var(--success)' : 'var(--secondary)');
        ctx.lineWidth = 4;
        ctx.stroke();
    });
}

function checkConnectionGame() {
    let allConnected = true;
    let allCorrect = true;
    
    // Check if all left items are connected
    currentGameContext.leftItems.forEach(item => {
        const conn = currentGameContext.connections.find(c => c.leftId === item.id);
        const el = document.getElementById(item.id);
        el.classList.remove('error', 'correct');
        
        if (!conn) {
            allConnected = false;
        } else {
            if (conn.rightId === item.target) {
                conn.isCorrect = true;
                conn.isError = false;
                el.classList.add('correct');
            } else {
                conn.isCorrect = false;
                conn.isError = true;
                allCorrect = false;
                el.classList.add('error');
            }
        }
    });
    
    drawConnections();
    
    if (!allConnected) {
        showFeedback(false, "¡Tienes que unir todas las opciones!");
    } else if (!allCorrect) {
        showFeedback(false, "Hay algunos errores. ¡Fíjate bien!");
    } else {
        showFeedback(true, "¡Perfecto! Has unido todo correctamente.");
    }
}

// ==========================================
// ACTIVITY 4: Unir Aviones y Barcos
// ==========================================
function renderGame4() {
    const leftItems = [
        { id: 'l1', html: '<img src="assets/passenger_plane.png" width="100" style="border-radius:10px;">', target: 'pasa' },
        { id: 'l2', html: '<img src="assets/cargo_ship.png" width="100" style="border-radius:10px;">', target: 'merc' },
        { id: 'l3', html: '<img src="assets/cruise_ship.png" width="100" style="border-radius:10px;">', target: 'pasa' },
        { id: 'l4', html: '<img src="assets/cargo_plane.png" width="100" style="border-radius:10px;">', target: 'merc' }
    ];
    
    const rightItems = [
        { id: 'pasa', text: 'PASAJEROS' },
        { id: 'merc', text: 'MERCANCÍAS' }
    ];
    
    renderConnectionGame("Toca un transporte y luego su categoría para unirlos:", leftItems, rightItems);
}

function checkGame4() {
    checkConnectionGame();
}

// ==========================================
// ACTIVITY 8: Tren SVG
// ==========================================
function renderGame8() {
    const leftItems = [
        { id: 't_loc', html: svgs.locomotora, target: 'w_loc' },
        { id: 't_vag', html: svgs.vagon, target: 'w_vag' },
        { id: 't_est', html: svgs.estacion_tren, target: 'w_est' }
    ];
    
    const rightItems = [
        { id: 'w_est', text: 'Estación' },
        { id: 'w_vag', text: 'Vagón' },
        { id: 'w_loc', text: 'Locomotora' }
    ];
    
    renderConnectionGame("Une cada palabra con su dibujo correspondiente:", leftItems, rightItems);
}

function checkGame8() {
    checkConnectionGame();
}
