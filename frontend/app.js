const API_BASE = 'http://localhost:5000/api';
const LOADING_STARTED_AT = performance.now();
const STORAGE_KEYS = {
    token: 'dev_gaming_token',
    saved: 'dev_gaming_guest_saved',
    theme: 'dev_gaming_theme',
    cart: 'dev_gaming_cart',
    listings: 'dev_gaming_listings'
};

const FALLBACK_CATALOG = [
    { id: 'g-nba24', title: 'NBA 2K24', category: 'games', genre: 'Sports', platform: 'Multi-Platform', badge: 'Championship Edition', image: 'assets/nba-2k24.jpg', officialUrl: 'https://nba.2k.com/2k24/', description: 'High-tempo court action, squad modes, and seasonal updates.' },
    { id: 'g-rdr2', title: 'Red Dead Redemption II', category: 'games', genre: 'Adventure', platform: 'PC / Console', badge: 'Story Classic', image: 'assets/red-dead-redemption-2.jpg', officialUrl: 'https://www.rockstargames.com/reddeadredemption2', description: 'Open-world frontier adventure with detailed story missions.' },
    { id: 'g-cyberpunk', title: 'Cyberpunk 2077', category: 'games', genre: 'RPG', platform: 'PC / PS5 / Xbox', badge: 'Hot Pick', image: 'assets/cyberpunk-2077.jpg', officialUrl: 'https://www.cyberpunk.net/us/en/', description: 'Futuristic open-world RPG set in Night City.' },
    { id: 'g-rome', title: 'Rome: Total War Remastered', category: 'games', genre: 'Strategy', platform: 'PC', badge: 'Strategy', image: 'assets/rome-total-war.jpg', officialUrl: 'https://www.totalwar.com/games/rome-remastered/', description: 'Large-scale tactical campaigns and army management.' },
    { id: 'g-hades2', title: 'Hades II', category: 'games', genre: 'Action', platform: 'PC', badge: 'Trending', image: 'assets/hades-2.jpg', officialUrl: 'https://www.supergiantgames.com/games/hades-ii/', description: 'Fast-paced roguelike action dungeon crawler.' },
    { id: 'g-bfv', title: 'Battlefield V', category: 'games', genre: 'Shooting', platform: 'PC / PS4 / Xbox', badge: 'New Arrival', image: 'assets/battlefield-v.jpg', officialUrl: 'https://www.ea.com/games/battlefield/battlefield-5', description: 'Squad-based multiplayer combat across large maps.' },
    { id: 'g-re2', title: 'Resident Evil 2', category: 'games', genre: 'Horror', platform: 'PC / PS4 / Xbox', badge: 'Survival Horror', image: 'assets/resident-evil-2.jpg', officialUrl: 'https://www.residentevil.com/re2/', description: 'Classic survival horror rebuilt with modern visuals.' },
    { id: 'g-gta6', title: 'Grand Theft Auto VI', category: 'games', genre: 'Adventure', platform: 'PlayStation 5 / Xbox Series X|S', badge: 'Now Available', image: 'assets/gta-vi.jpg', officialUrl: 'https://www.rockstargames.com/VI', description: 'Explore Vice City and the wider state of Leonida in Rockstar Games’ open-world adventure.' },
    { id: 'g-fc26', title: 'EA SPORTS FC 26', category: 'games', genre: 'Sports', platform: 'PC / PlayStation / Xbox', badge: 'Football · FIFA Series', image: 'assets/ea-sports-fc-26.jpg', officialUrl: 'https://www.ea.com/games/ea-sports-fc/fc-26', description: 'The latest EA football game, continuing the series players know as FIFA.' },
    { id: 'g-efootball', title: 'eFootball', category: 'games', genre: 'Sports', platform: 'PC / PlayStation / Xbox / Mobile', badge: 'Football', image: 'assets/efootball.jpg', officialUrl: 'https://www.konami.com/efootball/en/', storeUrl: 'https://store.steampowered.com/app/1665460/', storeLabel: 'Get on Steam', description: 'Build your dream team and take the pitch in KONAMI’s free-to-play football game.' },
    { id: 'g-payback', title: 'Need for Speed Payback', category: 'games', genre: 'Racing', platform: 'PC / PlayStation / Xbox', badge: 'Racing', image: 'assets/nfs-payback.jpg', officialUrl: 'https://www.ea.com/games/need-for-speed/need-for-speed-payback', description: 'Race, build and drive through an action-packed story in Fortune Valley.' },
    { id: 'g-cod', title: 'Call of Duty: Black Ops 7', category: 'games', genre: 'Shooting', platform: 'PC / PlayStation / Xbox', badge: 'Action · FPS', image: 'assets/call-of-duty.webp', officialUrl: 'https://www.callofduty.com/blackops7', storeUrl: 'https://store.steampowered.com/app/1938090/', storeLabel: 'Get on Steam', description: 'Jump into the latest Call of Duty action and multiplayer news.' },
    { id: 'g-strike-ops', title: 'FPS Strike Ops: Modern Arena', category: 'games', genre: 'Shooting', platform: 'Android', badge: 'Mobile FPS', image: 'assets/strike-ops.png', officialUrl: 'https://play.google.com/store/apps/details?id=com.ta.strike.ops', description: 'Mobile first-person shooter featured on its Google Play listing.' },
    { id: 'g-blood-strike', title: 'Blood Strike', category: 'games', genre: 'Shooting', platform: 'PC / Mobile', badge: 'Battle Royale', image: 'assets/blood-strike.png', officialUrl: 'https://www.blood-strike.com/', storeUrl: 'https://store.steampowered.com/app/3199170/', storeLabel: 'Get on Steam', description: 'Fast-paced battle royale shooter from NetEase Games.' },
    { id: 'g-free-fire', title: 'Garena Free Fire', category: 'games', genre: 'Shooting', platform: 'Android / iOS', badge: 'Battle Royale', image: 'assets/free-fire.jpg', officialUrl: 'https://ff.garena.com/en', storeUrl: 'https://play.google.com/store/apps/details?id=com.dts.freefireth', storeLabel: 'Get on Google Play', description: 'Garena’s mobile battle royale. Visit the official site for game news and downloads.' },
    { id: 'g-apex', title: 'Apex Legends', category: 'games', genre: 'Shooting', platform: 'PC / PlayStation / Xbox', badge: 'Hero Shooter', image: 'assets/apex-legends.jpg', officialUrl: 'https://www.ea.com/games/apex-legends', storeUrl: 'https://store.steampowered.com/app/1172470/', storeLabel: 'Get on Steam', description: 'Choose a Legend and squad up in EA’s free-to-play hero shooter.' },
    { id: 'g-forza5', title: 'Forza Horizon 5', category: 'games', genre: 'Racing', platform: 'PC / Xbox / PlayStation 5', badge: 'Open-World Racing', image: 'assets/forza-horizon-5.jpg', officialUrl: 'https://forza.net/horizon5', storeUrl: 'https://store.steampowered.com/app/1551360/', storeLabel: 'Get on Steam', description: 'Explore the vibrant open-world landscapes and roads of Mexico.' },
    { id: 'g-nfs-unbound', title: 'Need for Speed Unbound', category: 'games', genre: 'Racing', platform: 'PC / PlayStation / Xbox', badge: 'Street Racing', image: 'assets/nfs-unbound.jpg', officialUrl: 'https://www.ea.com/games/need-for-speed/need-for-speed-unbound', storeUrl: 'https://store.steampowered.com/app/1846380/', storeLabel: 'Get on Steam', description: 'Race through Lakeshore, build your ride and make your mark.' },
    { id: 'g-crew-motorfest', title: 'The Crew Motorfest', category: 'games', genre: 'Racing', platform: 'PC / PlayStation / Xbox', badge: 'Open-World Racing', image: 'assets/the-crew-motorfest.jpg', officialUrl: 'https://www.ubisoft.com/en-us/game/the-crew/motorfest', storeUrl: 'https://store.steampowered.com/app/2698940/', storeLabel: 'Get on Steam', description: 'Take on a festival of driving across the island of O‘ahu.' },
    { id: 'g-forza4', title: 'Forza Horizon 4', category: 'games', genre: 'Racing', platform: 'PC / Xbox', badge: 'Racing Favorite', image: 'assets/forza-horizon-4.jpg', officialUrl: 'https://forza.net/horizon4', storeUrl: 'https://store.steampowered.com/app/1293830/', storeLabel: 'Get on Steam', description: 'Race across a changing open-world version of Great Britain.' },
    { id: 'g-cs2', title: 'Counter-Strike 2', category: 'games', genre: 'Shooting', platform: 'PC', badge: 'Tactical FPS', image: 'assets/counter-strike-2.jpg', officialUrl: 'https://www.counter-strike.net/cs2', storeUrl: 'https://store.steampowered.com/app/730/', storeLabel: 'Play on Steam', description: 'Valve’s competitive tactical first-person shooter.' },
    { id: 'g-overwatch2', title: 'Overwatch 2', category: 'games', genre: 'Shooting', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Hero Shooter', image: 'assets/overwatch-2.jpg', officialUrl: 'https://overwatch.blizzard.com/en-us/', storeUrl: 'https://store.steampowered.com/app/2357570/', storeLabel: 'Get on Steam', description: 'Team up as heroes with distinct abilities in Blizzard’s team shooter.' },
    { id: 'g-pubg', title: 'PUBG: BATTLEGROUNDS', category: 'games', genre: 'Shooting', platform: 'PC / PlayStation / Xbox', badge: 'Battle Royale', image: 'assets/pubg-battlegrounds.jpg', officialUrl: 'https://pubg.com/en/main', storeUrl: 'https://store.steampowered.com/app/578080/', storeLabel: 'Play on Steam', description: 'Drop into a large-scale battle royale and fight to be the last squad standing.' },
    { id: 'g-r6', title: 'Rainbow Six Siege', category: 'games', genre: 'Shooting', platform: 'PC / PlayStation / Xbox', badge: 'Tactical Shooter', image: 'assets/rainbow-six-siege.jpg', officialUrl: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege', storeUrl: 'https://store.steampowered.com/app/359550/', storeLabel: 'Get on Steam', description: 'A tactical team shooter built around operators and destructible environments.' },
    { id: 'g-elden-ring', title: 'Elden Ring', category: 'games', genre: 'Adventure', platform: 'PC / PlayStation / Xbox', badge: 'Action RPG', image: 'assets/elden-ring.jpg', officialUrl: 'https://en.bandainamcoent.eu/elden-ring/elden-ring', storeUrl: 'https://store.steampowered.com/app/1245620/', storeLabel: 'Get on Steam', description: 'Explore the Lands Between in FromSoftware’s expansive action RPG.' },
    { id: 'g-hogwarts', title: 'Hogwarts Legacy', category: 'games', genre: 'Adventure', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Fantasy Adventure', image: 'assets/hogwarts-legacy.jpg', officialUrl: 'https://www.hogwartslegacy.com/en-us', storeUrl: 'https://store.steampowered.com/app/990080/', storeLabel: 'Get on Steam', description: 'Explore a magical open world set in the wizarding world.' },
    { id: 'g-witcher3', title: 'The Witcher 3: Wild Hunt', category: 'games', genre: 'RPG', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Story RPG', image: 'assets/witcher-3.jpg', officialUrl: 'https://www.thewitcher.com/us/en/witcher3', storeUrl: 'https://store.steampowered.com/app/292030/', storeLabel: 'Get on Steam', description: 'Travel the Continent as monster hunter Geralt of Rivia.' },
    { id: 'g-stardew', title: 'Stardew Valley', category: 'games', genre: 'Simulation', platform: 'PC / Console / Mobile', badge: 'Cozy Favorite', image: 'assets/stardew-valley.jpg', officialUrl: 'https://www.stardewvalley.net/', storeUrl: 'https://store.steampowered.com/app/413150/', storeLabel: 'Get on Steam', description: 'Build a farm, make friends and settle into country life.' },
    { id: 'g-silksong', title: 'Hollow Knight: Silksong', category: 'games', genre: 'Adventure', platform: 'PC / Console', badge: 'Metroidvania', image: 'assets/hollow-knight-silksong.jpg', officialUrl: 'https://www.teamcherry.com.au/', storeUrl: 'https://store.steampowered.com/app/1030300/', storeLabel: 'Get on Steam', description: 'Explore a vast new kingdom in Team Cherry’s action-adventure.' },
    { id: 'g-mk1', title: 'Mortal Kombat 1', category: 'games', genre: 'Fighting', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Fighting', image: 'assets/mortal-kombat-1.jpg', officialUrl: 'https://www.mortalkombat.com/en-us', storeUrl: 'https://store.steampowered.com/app/1971870/', storeLabel: 'Get on Steam', description: 'Enter a new era of the long-running Mortal Kombat fighting series.' },
    { id: 'g-tekken8', title: 'TEKKEN 8', category: 'games', genre: 'Fighting', platform: 'PC / PlayStation / Xbox', badge: 'Fighting', image: 'assets/tekken-8.jpg', officialUrl: 'https://en.bandainamcoent.eu/tekken/tekken-8', storeUrl: 'https://store.steampowered.com/app/1778820/', storeLabel: 'Get on Steam', description: 'The latest entry in Bandai Namco’s iconic 3D fighting series.' },
    { id: 'g-sf6', title: 'Street Fighter 6', category: 'games', genre: 'Fighting', platform: 'PC / PlayStation / Xbox', badge: 'Fighting', image: 'assets/street-fighter-6.jpg', officialUrl: 'https://www.streetfighter.com/6/', storeUrl: 'https://store.steampowered.com/app/1364780/', storeLabel: 'Get on Steam', description: 'Capcom’s fighting game with multiple modes for new and experienced players.' },
    { id: 'g-wwe25', title: 'WWE 2K25', category: 'games', genre: 'Fighting', platform: 'PC / PlayStation / Xbox', badge: 'Sports Entertainment', image: 'assets/wwe-2k25.jpg', officialUrl: 'https://wwe.2k.com/2k25/', storeUrl: 'https://store.steampowered.com/app/2878960/', storeLabel: 'Get on Steam', description: 'Build your legacy in the WWE 2K wrestling game.' },
    { id: 'g-rocket-league', title: 'Rocket League', category: 'games', genre: 'Sports', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Arcade Sports', image: 'assets/rocket-league.jpg', officialUrl: 'https://www.rocketleague.com/', storeUrl: 'https://store.steampowered.com/app/252950/', storeLabel: 'Visit game store', description: 'Fast cars and football-inspired matches in Psyonix’s arena game.' },
    { id: 'g-fall-guys', title: 'Fall Guys', category: 'games', genre: 'Arcade', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Party Game', image: 'assets/fall-guys.jpg', officialUrl: 'https://www.fallguys.com/', storeUrl: 'https://store.steampowered.com/app/1097150/', storeLabel: 'Visit game store', description: 'Race through colorful obstacle courses in this party platformer.' },
    { id: 'g-cuphead', title: 'Cuphead', category: 'games', genre: 'Arcade', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Run & Gun', image: 'assets/cuphead.jpg', officialUrl: 'https://www.studiomdhr.com/', storeUrl: 'https://store.steampowered.com/app/268910/', storeLabel: 'Get on Steam', description: 'A hand-drawn run-and-gun adventure inspired by classic cartoons.' },
    { id: 'g-civ7', title: 'Sid Meier’s Civilization VII', category: 'games', genre: 'Strategy', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Strategy', image: 'assets/civilization-vii.jpg', officialUrl: 'https://civilization.2k.com/civ-vii/', storeUrl: 'https://store.steampowered.com/app/1295660/', storeLabel: 'Get on Steam', description: 'Build an empire and guide a civilization through the ages.' },
    { id: 'g-aoe4', title: 'Age of Empires IV', category: 'games', genre: 'Strategy', platform: 'PC / Xbox', badge: 'Real-Time Strategy', image: 'assets/age-of-empires-iv.jpg', officialUrl: 'https://www.ageofempires.com/games/age-of-empires-iv/', storeUrl: 'https://store.steampowered.com/app/1466860/', storeLabel: 'Get on Steam', description: 'Build a civilization and command armies across historical campaigns.' },
    { id: 'g-total-war-warhammer3', title: 'Total War: WARHAMMER III', category: 'games', genre: 'Strategy', platform: 'PC', badge: 'Strategy', image: 'assets/total-war-warhammer-3.jpg', officialUrl: 'https://www.totalwar.com/games/total-war-warhammer-iii/', storeUrl: 'https://store.steampowered.com/app/1142710/', storeLabel: 'Get on Steam', description: 'Lead legendary factions in a grand strategy and real-time battle campaign.' },
    { id: 'g-helldivers2', title: 'HELLDIVERS 2', category: 'games', genre: 'Shooting', platform: 'PC / PlayStation 5', badge: 'Co-op Shooter', image: 'assets/helldivers-2.jpg', officialUrl: 'https://www.playstation.com/en-us/games/helldivers-2/', storeUrl: 'https://store.steampowered.com/app/553850/', storeLabel: 'Get on Steam', description: 'Join a squad in a cooperative third-person fight for Super Earth.' },
    { id: 't-steam', title: 'Steam Wallet Code', category: 'topups', platform: 'Steam', badge: 'Top-Up', description: 'Instant digital wallet top-up for PC game libraries.' },
    { id: 't-psn', title: 'PlayStation Network Card', category: 'topups', platform: 'PlayStation', badge: 'Top-Up', description: 'Add store credit or membership access to PlayStation.' },
    { id: 't-xbox', title: 'Xbox Gift & Pass Code', category: 'topups', platform: 'Xbox', badge: 'Top-Up', description: 'Redeemable code for Xbox titles and online services.' },
    { id: 't-eshop', title: 'Nintendo eShop Voucher', category: 'topups', platform: 'Nintendo', badge: 'Top-Up', description: 'Digital code for portable and console releases.' },
    { id: 'h-vr', title: 'VR Headset Pro', category: 'gear', platform: 'VR Hardware', badge: 'Featured Gear', description: 'Wide-view head-mounted display for immersive gaming.' },
    { id: 'h-headset', title: 'Wireless Gaming Headset', category: 'gear', platform: 'Audio Gear', badge: 'Recommended', description: 'Low-latency wireless audio with clear voice chat.' },
    { id: 'h-controller', title: 'Pro Wireless Controller', category: 'gear', platform: 'Controllers', badge: 'Recommended', description: 'Ergonomic gamepad with responsive triggers and grip.' },
    { id: 'h-mouse', title: 'RGB Precision Gaming Mouse', category: 'gear', platform: 'Peripherals', badge: 'Recommended', description: 'Lightweight wired/wireless mouse with adjustable DPI.' }
];

const samplePrices = {
    'g-nba24': 29.99,
    'g-rdr2': 24.99,
    'g-cyberpunk': 34.99,
    'g-rome': 19.99,
    'g-hades2': 29.99,
    'g-bfv': 14.99,
    'g-re2': 19.99,
    'g-gta6': 69.99,
    'g-fc26': 59.99,
    'g-efootball': 0,
    'g-payback': 19.99,
    'g-cod': 69.99,
    'g-strike-ops': 0,
    'g-blood-strike': 0,
    'g-free-fire': 0,
    'g-apex': 0,
    'g-forza5': 59.99,
    'g-nfs-unbound': 69.99,
    'g-crew-motorfest': 59.99,
    'g-forza4': 59.99,
    'g-cs2': 0,
    'g-overwatch2': 0,
    'g-pubg': 0,
    'g-r6': 19.99,
    'g-elden-ring': 59.99,
    'g-hogwarts': 59.99,
    'g-witcher3': 39.99,
    'g-stardew': 14.99,
    'g-silksong': 19.99,
    'g-mk1': 49.99,
    'g-tekken8': 49.99,
    'g-sf6': 39.99,
    'g-wwe25': 59.99,
    'g-rocket-league': 0,
    'g-fall-guys': 0,
    'g-cuphead': 19.99,
    'g-civ7': 69.99,
    'g-aoe4': 39.99,
    'g-total-war-warhammer3': 59.99,
    'g-helldivers2': 39.99
};

const GENRE_ORDER = ['Action', 'Adventure', 'Arcade', 'Fighting', 'Horror', 'Racing', 'RPG', 'Shooting', 'Simulation', 'Sports', 'Strategy'];

function readStorage(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value === null ? fallback : value;
    } catch {
        return fallback;
    }
}

const state = {
    items: FALLBACK_CATALOG.map((item) => ({ ...item, price: samplePrices[item.id] })),
    listings: readStorage(STORAGE_KEYS.listings, []),
    category: 'games',
    genre: 'all',
    search: '',
    token: localStorage.getItem(STORAGE_KEYS.token),
    user: null,
    savedIds: readStorage(STORAGE_KEYS.saved, []),
    cart: readStorage(STORAGE_KEYS.cart, []),
    theme: localStorage.getItem(STORAGE_KEYS.theme) || 'dark',
    activeDrawer: null
};

const $ = (selector) => document.querySelector(selector);
const catalogGrid = $('#catalog-grid');
const authModal = $('#auth-modal');
const savedDrawer = $('#saved-drawer');
const cartDrawer = $('#cart-drawer');
const drawerBackdrop = $('#drawer-backdrop');
let toastTimer;

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
}

function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}

let loadingDismissed = false;

function dismissLoadingScreen() {
    if (loadingDismissed) return;
    loadingDismissed = true;
    const delay = Math.max(0, 650 - (performance.now() - LOADING_STARTED_AT));
    window.setTimeout(() => {
        const loadingScreen = $('#loading-screen');
        if (!loadingScreen) return;
        loadingScreen.classList.add('is-leaving');
        window.setTimeout(() => loadingScreen.remove(), 500);
    }, delay);
}

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('./sw.js').catch((error) => {
        console.error('Could not register the offline cache service worker.', error);
    });
}

function persist(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getAllItems() {
    return [...state.listings, ...state.items];
}

function getItem(id) {
    return getAllItems().find((item) => item.id === id);
}

function setPage(page, options = {}) {
    const pageId = `page-${page}`;
    if (!$(`#${pageId}`)) return;

    document.querySelectorAll('.page-view').forEach((view) => {
        const isCurrent = view.id === pageId;
        view.hidden = !isCurrent;
        view.classList.toggle('active', isCurrent);
    });
    document.querySelectorAll('[data-page]').forEach((button) => {
        button.classList.toggle('active', button.dataset.page === page);
    });

    if (options.search) {
        state.category = 'all';
        state.genre = 'all';
        state.search = options.search;
        $('#search-input').value = options.search;
        renderCatalog();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (options.scrollCatalog) {
        requestAnimationFrame(() => $('#catalog-section').scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
}

function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    const lightMode = theme === 'light';
    $('meta[name="theme-color"]').content = lightMode ? '#fbf4f7' : '#100d1c';
    $('#theme-toggle').setAttribute('aria-label', `Switch to ${lightMode ? 'dark' : 'light'} theme`);
    $('#theme-icon').textContent = lightMode ? '☾' : '☼';
    localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function renderCatalog() {
    const term = state.search.trim().toLowerCase();
    renderGenreFilters();
    const items = getAllItems().filter((item) => {
        const matchesCategory = state.category === 'all' ||
            (state.category === 'games' && item.category === 'games') ||
            (state.category === 'community' && item.isCommunity) ||
            (state.category === 'extras' && item.category !== 'games');
        const matchesGenre = state.genre === 'all' || item.genre === state.genre;
        const text = `${item.title} ${item.platform} ${item.description || ''} ${item.badge || ''} ${item.genre || ''}`.toLowerCase();
        return matchesCategory && matchesGenre && (!term || text.includes(term));
    });

    $('#result-count').textContent = `${items.length} ${items.length === 1 ? 'result' : 'results'}`;
    $('#catalog-subtitle').textContent = term
        ? `Showing games and listings matching “${state.search.trim()}”.`
        : 'Browse popular picks and community listings.';

    if (!items.length) {
        catalogGrid.innerHTML = '<div class="empty-state"><strong>No games found</strong>Try another search or choose a different filter.</div>';
        renderSavedDrawer();
        return;
    }

    catalogGrid.innerHTML = items.map((item) => {
        const id = escapeHtml(item.id);
        const isSaved = state.savedIds.includes(item.id);
        const imageMarkup = item.image
            ? `<div class="item-image-wrap"><img class="item-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} cover art" loading="lazy"><div class="item-meta"><span class="item-platform">${escapeHtml(item.platform)}</span><span class="item-badge">${escapeHtml(item.badge || 'Community listing')}</span></div></div>`
            : `<div class="item-image-placeholder"><span>${escapeHtml(item.category === 'topups' ? 'Top-up' : 'Game listing')}</span><div class="item-meta"><span class="item-platform">${escapeHtml(item.platform)}</span><span class="item-badge">${escapeHtml(item.badge || 'Community listing')}</span></div></div>`;
        const hasPrice = Number.isFinite(Number(item.price)) && Number(item.price) > 0;
        const isFree = item.price === 0;
        const priceMarkup = hasPrice
            ? `<span class="item-price">${formatPrice(item.price)}<small>${item.isCommunity ? escapeHtml(item.condition || 'Community listing') : 'Sample price'}</small></span>`
            : isFree
                ? '<span class="item-price item-free">Free to play<small>Official game site</small></span>'
            : '<span class="item-price"><small>Details coming soon</small></span>';
        const buyButton = hasPrice
            ? `<button class="btn btn-primary" type="button" data-add-cart-id="${id}">Add to cart</button>`
            : '';

        const isGame = item.category === 'games' && !item.isCommunity;
        return `<article class="item-card${isGame ? ' game-card' : ''}"${isGame ? ` data-game-id="${id}" tabindex="0" role="group" aria-label="View details for ${escapeHtml(item.title)}" aria-haspopup="dialog"` : ''}>
            ${imageMarkup}
            <div class="item-content">
                <h3 class="item-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
                <p class="item-description">${escapeHtml(item.description || `Listed by a community player · ${item.condition || 'Condition not specified'}`)}</p>
                <div class="item-price-row">
                    ${priceMarkup}
                    <div class="item-actions">
                        ${buyButton}
                        <button class="save-game ${isSaved ? 'is-saved' : ''}" type="button" data-save-id="${id}" aria-label="${isSaved ? 'Remove from saved games' : 'Save game'}" aria-pressed="${isSaved}">${isSaved ? '♥' : '♡'}</button>
                    </div>
                </div>
            </div>
        </article>`;
    }).join('');

    renderSavedDrawer();
}

function renderGenreFilters() {
    const container = $('#genre-filters');
    const isGames = state.category === 'games';
    container.classList.toggle('hidden', !isGames);
    if (!isGames) {
        container.replaceChildren();
        return;
    }

    const genres = [...new Set(state.items.filter((item) => item.category === 'games').map((item) => item.genre).filter(Boolean))];
    const orderedGenres = GENRE_ORDER.filter((genre) => genres.includes(genre));
    const buttons = ['all', ...orderedGenres].map((genre) => {
        const label = genre === 'all' ? 'All genres' : genre;
        return `<button class="filter-pill${state.genre === genre ? ' active' : ''}" type="button" data-genre="${escapeHtml(genre)}" aria-pressed="${state.genre === genre}">${escapeHtml(label)}</button>`;
    });
    container.innerHTML = buttons.join('');
}

function getSafeHttpsUrl(value) {
    if (!value) return '';
    try {
        const url = new URL(value);
        return url.protocol === 'https:' ? url.href : '';
    } catch {
        return '';
    }
}

function getOfficialUrl(item) {
    return getSafeHttpsUrl(item.officialUrl);
}

let previouslyFocusedElement = null;

function openGameDetails(item) {
    if (!item) return;
    const modal = $('#game-detail-modal');
    const officialUrl = getOfficialUrl(item);
    const itemStoreUrl = getSafeHttpsUrl(item.storeUrl);
    const storeUrl = itemStoreUrl || officialUrl;
    $('#detail-image').src = item.image || '';
    $('#detail-image').alt = item.image ? `${item.title} cover art` : '';
    $('#detail-image').classList.toggle('hidden', !item.image);
    $('#detail-badge').textContent = item.badge || '';
    $('#detail-genre').textContent = item.genre || 'Game';
    $('#game-detail-title').textContent = item.title;
    $('#detail-platform').textContent = item.platform || '';
    $('#detail-description').textContent = item.description || '';

    const officialLink = $('#detail-official-link');
    officialLink.href = officialUrl || '#';
    officialLink.classList.toggle('hidden', !officialUrl);

    const downloadLink = $('#detail-download-link');
    downloadLink.href = storeUrl || '#';
    downloadLink.textContent = itemStoreUrl ? (item.storeLabel || 'Get the game') : 'Official site & availability';
    downloadLink.classList.toggle('hidden', !storeUrl);

    previouslyFocusedElement = document.activeElement;
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    $('#close-game-detail').focus();
}

function closeGameDetails() {
    const modal = $('#game-detail-modal');
    if (modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    if (previouslyFocusedElement instanceof HTMLElement) previouslyFocusedElement.focus();
}

function renderAuthUI() {
    const signedIn = Boolean(state.user);
    $('#guest-actions').classList.toggle('hidden', signedIn);
    $('#user-actions').classList.toggle('hidden', !signedIn);
    $('#user-greeting').textContent = signedIn ? `@${state.user.username}` : '';
    updateCounts();
}

function updateCounts() {
    $('#saved-count').textContent = String(state.savedIds.length);
    $('#cart-count').textContent = String(state.cart.reduce((total, row) => total + row.quantity, 0));
}

function renderSavedDrawer() {
    const savedList = $('#saved-list');
    if (!savedList) return;
    const items = state.savedIds.map(getItem).filter(Boolean);
    savedList.innerHTML = items.length ? items.map((item) => `
        <div class="drawer-row">
            ${item.image ? `<img src="${escapeHtml(item.image)}" alt="" loading="lazy">` : ''}
            <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.platform)}</small></div>
            <button type="button" data-remove-saved="${escapeHtml(item.id)}">Remove</button>
        </div>`).join('') : '<p class="drawer-empty">No saved games yet.<br>Tap the heart on a game to keep it here.</p>';
    updateCounts();
}

function renderCart() {
    const cartList = $('#cart-list');
    const rows = state.cart.map((row) => ({ ...row, item: getItem(row.id) })).filter((row) => row.item);
    cartList.innerHTML = rows.length ? rows.map(({ item, quantity }) => `
        <div class="drawer-row">
            ${item.image ? `<img src="${escapeHtml(item.image)}" alt="" loading="lazy">` : ''}
            <div><strong>${escapeHtml(item.title)}</strong><small>${quantity} × ${formatPrice(item.price)}</small></div>
            <button type="button" data-remove-cart="${escapeHtml(item.id)}">Remove</button>
        </div>`).join('') : '<p class="drawer-empty">Your cart is empty.<br>Find a game to get started.</p>';
    const total = rows.reduce((sum, row) => sum + Number(row.item.price) * row.quantity, 0);
    $('#cart-total').textContent = formatPrice(total);
    updateCounts();
}

async function fetchCatalog() {
    try {
        const response = await fetch(`${API_BASE}/catalog`);
        if (!response.ok) throw new Error('Catalog request failed');
        const data = await response.json();
        if (!Array.isArray(data.items)) throw new Error('Catalog response was invalid');
        const fallbackItems = new Map(FALLBACK_CATALOG.map((item) => [item.id, item]));
        state.items = data.items.map((item) => ({
            ...(fallbackItems.get(item.id) || {}),
            ...item,
            price: samplePrices[item.id]
        }));
    } catch {
        showToast('Showing the saved catalog preview. Start the API to load live catalog data.');
    }
    renderCatalog();
}

async function fetchCurrentUser() {
    if (!state.token) {
        renderAuthUI();
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${state.token}` }
        });
        if (!response.ok) throw new Error('Session is no longer valid');
        const data = await response.json();
        state.user = data.user;
        state.savedIds = data.user.savedIds || [];
    } catch {
        state.token = null;
        state.user = null;
        localStorage.removeItem(STORAGE_KEYS.token);
    }
    renderAuthUI();
    renderSavedDrawer();
    renderCatalog();
}

function showDrawer(type) {
    const drawer = type === 'cart' ? cartDrawer : savedDrawer;
    const otherDrawer = type === 'cart' ? savedDrawer : cartDrawer;
    otherDrawer.classList.add('hidden');
    otherDrawer.setAttribute('aria-hidden', 'true');
    drawer.classList.remove('hidden');
    drawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.classList.remove('hidden');
    state.activeDrawer = type;
    if (type === 'cart') renderCart();
    else renderSavedDrawer();
}

function closeDrawers() {
    savedDrawer.classList.add('hidden');
    cartDrawer.classList.add('hidden');
    savedDrawer.setAttribute('aria-hidden', 'true');
    cartDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.classList.add('hidden');
    state.activeDrawer = null;
}

function openAuthModal(mode = 'login') {
    const signingUp = mode === 'signup';
    $('#tab-signup').classList.toggle('active', signingUp);
    $('#tab-login').classList.toggle('active', !signingUp);
    $('#signup-form').classList.toggle('hidden', !signingUp);
    $('#login-form').classList.toggle('hidden', signingUp);
    $('#auth-modal-title').textContent = signingUp ? 'Join the community' : 'Welcome back';
    $('#auth-feedback').textContent = '';
    $('#auth-feedback').className = 'auth-feedback';
    authModal.classList.remove('hidden');
}

function closeAuthModal() {
    authModal.classList.add('hidden');
}

function setFeedback(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle('error', isError);
}

async function toggleSavedItem(itemId) {
    const wasSaved = state.savedIds.includes(itemId);
    const item = getItem(itemId);

    if (state.token && item && !item.isCommunity) {
        try {
            const response = await fetch(`${API_BASE}/saved/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.token}`
                },
                body: JSON.stringify({ itemId })
            });
            if (!response.ok) throw new Error('Could not update saved games');
            const data = await response.json();
            state.savedIds = data.savedIds;
        } catch {
            showToast('Could not update saved games. Please try again.');
            return;
        }
    } else {
        state.savedIds = wasSaved
            ? state.savedIds.filter((id) => id !== itemId)
            : [...state.savedIds, itemId];
        persist(STORAGE_KEYS.saved, state.savedIds);
    }

    renderCatalog();
}

function addToCart(itemId) {
    const item = getItem(itemId);
    if (!item || !Number.isFinite(Number(item.price))) return;
    const existing = state.cart.find((row) => row.id === itemId);
    if (existing) existing.quantity += 1;
    else state.cart.push({ id: itemId, quantity: 1 });
    persist(STORAGE_KEYS.cart, state.cart);
    renderCart();
    showToast(`${item.title} added to your cart preview.`);
}

function removeFromCart(itemId) {
    state.cart = state.cart.filter((row) => row.id !== itemId);
    persist(STORAGE_KEYS.cart, state.cart);
    renderCart();
}

function makeListing(event) {
    event.preventDefault();
    const feedback = $('#sell-feedback');
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') || '').trim();
    const price = Number(formData.get('price'));

    if (!title || !Number.isFinite(price) || price < 1 || price > 9999) {
        setFeedback(feedback, 'Enter a game title and a price between $1 and $9,999.', true);
        return;
    }

    const listing = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        category: 'games',
        platform: String(formData.get('platform')),
        badge: 'Community listing',
        condition: String(formData.get('condition')),
        description: String(formData.get('description') || '').trim() || 'Listed by a community player.',
        price,
        isCommunity: true,
        createdAt: new Date().toISOString()
    };

    state.listings.unshift(listing);
    persist(STORAGE_KEYS.listings, state.listings);
    event.currentTarget.reset();
    setFeedback(feedback, 'Your listing preview is saved in this browser.');
    renderCatalog();
    showToast('Listing preview saved on this device only.');
}

function prepareContactMessage(event) {
    event.preventDefault();
    setFeedback($('#contact-feedback'), 'This form is a preview; no message was sent or stored.');
}

document.addEventListener('click', (event) => {
    const gameCard = event.target.closest('.game-card[data-game-id]');
    if (gameCard && !event.target.closest('button, a')) {
        openGameDetails(getItem(gameCard.dataset.gameId));
        return;
    }

    const pageButton = event.target.closest('[data-page]');
    if (pageButton) {
        setPage(pageButton.dataset.page, {
            search: pageButton.dataset.search,
            scrollCatalog: pageButton.hasAttribute('data-scroll-catalog')
        });
    }

    const filterButton = event.target.closest('[data-filter]');
    if (filterButton) {
        state.category = filterButton.dataset.filter;
        state.genre = 'all';
        document.querySelectorAll('[data-filter]').forEach((button) => {
            button.classList.toggle('active', button.dataset.filter === state.category);
        });
        renderCatalog();
    }

    const genreButton = event.target.closest('[data-genre]');
    if (genreButton) {
        state.genre = genreButton.dataset.genre;
        renderCatalog();
    }

    const saveButton = event.target.closest('[data-save-id]');
    if (saveButton) toggleSavedItem(saveButton.dataset.saveId);

    const addButton = event.target.closest('[data-add-cart-id]');
    if (addButton) addToCart(addButton.dataset.addCartId);

    const removeSavedButton = event.target.closest('[data-remove-saved]');
    if (removeSavedButton) toggleSavedItem(removeSavedButton.dataset.removeSaved);

    const removeCartButton = event.target.closest('[data-remove-cart]');
    if (removeCartButton) removeFromCart(removeCartButton.dataset.removeCart);
});

document.addEventListener('keydown', (event) => {
    const gameCard = event.target.closest('.game-card[data-game-id]');
    if (gameCard && (event.key === 'Enter' || event.key === ' ') && !event.target.closest('button, a')) {
        event.preventDefault();
        openGameDetails(getItem(gameCard.dataset.gameId));
    }
});

$('#theme-toggle').addEventListener('click', () => applyTheme(state.theme === 'dark' ? 'light' : 'dark'));
$('#search-input').addEventListener('input', (event) => {
    state.search = event.target.value;
    renderCatalog();
});
$('#saved-btn').addEventListener('click', () => showDrawer('saved'));
$('#cart-btn').addEventListener('click', () => showDrawer('cart'));
$('#close-saved-btn').addEventListener('click', closeDrawers);
$('#close-cart-btn').addEventListener('click', closeDrawers);
drawerBackdrop.addEventListener('click', closeDrawers);
$('#checkout-btn').addEventListener('click', () => {
    if (!state.cart.length) {
        showToast('Add a game to your cart first.');
        return;
    }
    showToast('Checkout is a preview. Payments and orders are not enabled yet.');
});

$('#open-login-btn').addEventListener('click', () => openAuthModal('login'));
$('#open-signup-btn').addEventListener('click', () => openAuthModal('signup'));
$('#close-auth-btn').addEventListener('click', closeAuthModal);
$('#close-game-detail').addEventListener('click', closeGameDetails);
$('#game-detail-modal').addEventListener('click', (event) => {
    if (event.target === $('#game-detail-modal')) closeGameDetails();
});
$('#tab-login').addEventListener('click', () => openAuthModal('login'));
$('#tab-signup').addEventListener('click', () => openAuthModal('signup'));
authModal.addEventListener('click', (event) => {
    if (event.target === authModal) closeAuthModal();
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeGameDetails();
        closeAuthModal();
        closeDrawers();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        $('#search-input').focus();
    }
});

$('#sell-form').addEventListener('submit', makeListing);
$('#contact-form').addEventListener('submit', prepareContactMessage);
$('#current-year').textContent = String(new Date().getFullYear());

$('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const feedback = $('#auth-feedback');
    feedback.textContent = '';
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: $('#login-email').value.trim(),
                password: $('#login-password').value
            })
        });
        const data = await response.json();
        if (!response.ok) {
            setFeedback(feedback, data.error || 'Could not log in.', true);
            return;
        }
        state.token = data.token;
        state.user = data.user;
        state.savedIds = data.user.savedIds || [];
        localStorage.setItem(STORAGE_KEYS.token, data.token);
        persist(STORAGE_KEYS.saved, state.savedIds);
        feedback.textContent = 'Welcome back!';
        feedback.classList.add('success');
        renderAuthUI();
        renderCatalog();
        setTimeout(closeAuthModal, 800);
        event.currentTarget.reset();
    } catch {
        setFeedback(feedback, 'Could not reach the API at localhost:5000.', true);
    }
});

$('#signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const feedback = $('#auth-feedback');
    feedback.textContent = '';
    try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: $('#signup-username').value.trim(),
                email: $('#signup-email').value.trim(),
                password: $('#signup-password').value
            })
        });
        const data = await response.json();
        if (!response.ok) {
            setFeedback(feedback, data.error || 'Could not create your account.', true);
            return;
        }
        state.token = data.token;
        state.user = data.user;
        state.savedIds = data.user.savedIds || [];
        localStorage.setItem(STORAGE_KEYS.token, data.token);
        persist(STORAGE_KEYS.saved, state.savedIds);
        feedback.textContent = 'Your account is ready. Welcome!';
        feedback.classList.add('success');
        renderAuthUI();
        renderCatalog();
        setTimeout(closeAuthModal, 800);
        event.currentTarget.reset();
    } catch {
        setFeedback(feedback, 'Could not reach the API at localhost:5000.', true);
    }
});

$('#logout-btn').addEventListener('click', () => {
    state.token = null;
    state.user = null;
    localStorage.removeItem(STORAGE_KEYS.token);
    state.savedIds = readStorage(STORAGE_KEYS.saved, []);
    renderAuthUI();
    renderCatalog();
    showToast('You have been logged out.');
});

applyTheme(state.theme);
renderAuthUI();
renderCart();
fetchCatalog();
fetchCurrentUser();
registerServiceWorker();

if (document.readyState === 'complete') dismissLoadingScreen();
else window.addEventListener('load', dismissLoadingScreen, { once: true });
window.setTimeout(dismissLoadingScreen, 3500);
