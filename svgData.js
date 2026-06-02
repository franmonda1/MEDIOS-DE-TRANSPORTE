// Dictionary of high-quality SVGs represented using standard emojis wrapped in SVG for scaling, 
// or custom shapes. Using emojis ensures they are colorful and recognizable for kids.
const svgs = {
    // Mercancías vs Pasajeros (Act 3)
    camion_mercancias: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#e0f7fa"/><text x="50" y="65" font-size="50" text-anchor="middle">🚚</text></svg>`,
    barco_mercancias: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#e0f7fa"/><text x="50" y="65" font-size="50" text-anchor="middle">🚢</text></svg>`,
    tren_mercancias: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#e0f7fa"/><text x="50" y="65" font-size="50" text-anchor="middle">🚂</text></svg>`,
    autobus_pasajeros: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#fce4ec"/><text x="50" y="65" font-size="50" text-anchor="middle">🚌</text></svg>`,
    avion_pasajeros: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#fce4ec"/><text x="50" y="65" font-size="50" text-anchor="middle">✈️</text></svg>`,
    coche_pasajeros: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#fce4ec"/><text x="50" y="65" font-size="50" text-anchor="middle">🚗</text></svg>`,

    // Terrestre, Acuático, Aéreo (Act 6)
    piragua: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#e8f5e9"/><text x="50" y="65" font-size="50" text-anchor="middle">🛶</text></svg>`,
    moto_acuatica: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#e8f5e9"/><text x="50" y="65" font-size="50" text-anchor="middle">🚤</text></svg>`,
    globo: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#fff3e0"/><text x="50" y="65" font-size="50" text-anchor="middle">🎈</text></svg>`,
    ala_delta: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#fff3e0"/><text x="50" y="65" font-size="50" text-anchor="middle">🪂</text></svg>`, // using parachute as fallback
    metro: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#f3e5f5"/><text x="50" y="65" font-size="50" text-anchor="middle">🚇</text></svg>`,
    bicicleta: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#f3e5f5"/><text x="50" y="65" font-size="50" text-anchor="middle">🚲</text></svg>`,
    barco_velero: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#e8f5e9"/><text x="50" y="65" font-size="50" text-anchor="middle">⛵</text></svg>`,
    helicoptero: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#fff3e0"/><text x="50" y="65" font-size="50" text-anchor="middle">🚁</text></svg>`,
    submarino: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#e8f5e9"/><text x="50" y="65" font-size="50" text-anchor="middle">🌊</text></svg>`, // Submarine icon might be rare, using wave
    tractor: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#f3e5f5"/><text x="50" y="65" font-size="50" text-anchor="middle">🚜</text></svg>`,

    // Act 4 specific
    avion_carguero_act4: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#cfd8dc"/><text x="50" y="55" font-size="40" text-anchor="middle">✈️</text><text x="65" y="65" font-size="20" text-anchor="middle">📦</text></svg>`,
    avion_pasajeros_act4: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#bbdefb"/><text x="50" y="55" font-size="40" text-anchor="middle">✈️</text><text x="65" y="65" font-size="20" text-anchor="middle">👥</text></svg>`,
    barco_crucero_act4: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#bbdefb"/><text x="50" y="65" font-size="50" text-anchor="middle">🛳️</text></svg>`,
    barco_carguero_act4: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#cfd8dc"/><text x="50" y="55" font-size="40" text-anchor="middle">🚢</text><text x="65" y="65" font-size="20" text-anchor="middle">📦</text></svg>`,

    // Act 8 specific
    estacion_tren: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#fff9c4"/><text x="50" y="65" font-size="50" text-anchor="middle">🚉</text></svg>`,
    locomotora: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#ffccbc"/><text x="50" y="65" font-size="50" text-anchor="middle">🚂</text></svg>`,
    vagon: `<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="50" fill="#dcedc8"/><text x="50" y="65" font-size="50" text-anchor="middle">🚃</text></svg>`
};
