require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_gaming_secret_key_change_in_prod';

app.use(cors());
app.use(express.json());

// In-memory stores (replace with PostgreSQL / MongoDB for production)
const users = [];

const catalog = [
    {
        id: 'g-nba24',
        title: 'NBA 2K24',
        category: 'games',
        genre: 'Sports',
        section: 'featured',
        platform: 'Multi-Platform',
        badge: 'Championship Edition',
        image: 'assets/nba-2k24.jpg',
        officialUrl: 'https://nba.2k.com/2k24/',
        description: 'High-tempo court action, squad modes, and seasonal updates.'
    },
    {
        id: 'g-rdr2',
        title: 'Red Dead Redemption II',
        category: 'games',
        genre: 'Adventure',
        section: 'featured',
        platform: 'PC / Console',
        badge: 'Story Classic',
        image: 'assets/red-dead-redemption-2.jpg',
        officialUrl: 'https://www.rockstargames.com/reddeadredemption2',
        description: 'Open-world frontier adventure with detailed story missions.'
    },
    {
        id: 'g-cyberpunk',
        title: 'Cyberpunk 2077',
        category: 'games',
        genre: 'RPG',
        section: 'hot-deals',
        platform: 'PC / PS5 / Xbox',
        badge: 'Hot Pick',
        image: 'assets/cyberpunk-2077.jpg',
        officialUrl: 'https://www.cyberpunk.net/us/en/',
        description: 'Futuristic open-world RPG set in Night City.'
    },
    {
        id: 'g-rome',
        title: 'Rome: Total War Remastered',
        category: 'games',
        genre: 'Strategy',
        section: 'hot-deals',
        platform: 'PC',
        badge: 'Strategy',
        image: 'assets/rome-total-war.jpg',
        officialUrl: 'https://www.totalwar.com/games/rome-remastered/',
        description: 'Large-scale tactical campaigns and army management.'
    },
    {
        id: 'g-hades2',
        title: 'Hades II',
        category: 'games',
        genre: 'Action',
        section: 'trending',
        platform: 'PC',
        badge: 'Trending',
        image: 'assets/hades-2.jpg',
        officialUrl: 'https://www.supergiantgames.com/games/hades-ii/',
        description: 'Fast-paced roguelike action dungeon crawler.'
    },
    {
        id: 'g-bfv',
        title: 'Battlefield V',
        category: 'games',
        genre: 'Shooting',
        section: 'new-arrivals',
        platform: 'PC / PS4 / Xbox',
        badge: 'New Arrival',
        image: 'assets/battlefield-v.jpg',
        officialUrl: 'https://www.ea.com/games/battlefield/battlefield-5',
        description: 'Squad-based multiplayer combat across large maps.'
    },
    {
        id: 'g-re2',
        title: 'Resident Evil 2',
        category: 'games',
        genre: 'Horror',
        section: 'new-arrivals',
        platform: 'PC / PS4 / Xbox',
        badge: 'Survival Horror',
        image: 'assets/resident-evil-2.jpg',
        officialUrl: 'https://www.residentevil.com/re2/',
        description: 'Classic survival horror rebuilt with modern visuals.'
    },
    {
        id: 'g-gta6',
        title: 'Grand Theft Auto VI',
        category: 'games',
        genre: 'Adventure',
        section: 'new-arrivals',
        platform: 'PlayStation 5 / Xbox Series X|S',
        badge: 'Now Available',
        image: 'assets/gta-vi.jpg',
        officialUrl: 'https://www.rockstargames.com/VI',
        description: 'Explore Vice City and the wider state of Leonida in Rockstar Games’ open-world adventure.'
    },
    {
        id: 'g-fc26',
        title: 'EA SPORTS FC 26',
        category: 'games',
        genre: 'Sports',
        section: 'trending',
        platform: 'PC / PlayStation / Xbox',
        badge: 'Football · FIFA Series',
        image: 'assets/ea-sports-fc-26.jpg',
        officialUrl: 'https://www.ea.com/games/ea-sports-fc/fc-26',
        description: 'The latest EA football game, continuing the series players know as FIFA.'
    },
    {
        id: 'g-efootball',
        title: 'eFootball',
        category: 'games',
        genre: 'Sports',
        section: 'trending',
        platform: 'PC / PlayStation / Xbox / Mobile',
        badge: 'Football',
        image: 'assets/efootball.jpg',
        officialUrl: 'https://www.konami.com/efootball/en/',
        description: 'Build your dream team and take the pitch in KONAMI’s free-to-play football game.'
    },
    {
        id: 'g-payback',
        title: 'Need for Speed Payback',
        category: 'games',
        genre: 'Racing',
        section: 'new-arrivals',
        platform: 'PC / PlayStation / Xbox',
        badge: 'Racing',
        image: 'assets/nfs-payback.jpg',
        officialUrl: 'https://www.ea.com/games/need-for-speed/need-for-speed-payback',
        description: 'Race, build and drive through an action-packed story in Fortune Valley.'
    },
    {
        id: 'g-cod',
        title: 'Call of Duty: Black Ops 7',
        category: 'games',
        genre: 'Shooting',
        section: 'trending',
        platform: 'PC / PlayStation / Xbox',
        badge: 'Action · FPS',
        image: 'assets/call-of-duty.webp',
        officialUrl: 'https://www.callofduty.com/blackops7',
        description: 'Jump into the latest Call of Duty action and multiplayer news.'
    },
    {
        id: 'g-strike-ops',
        title: 'FPS Strike Ops: Modern Arena',
        category: 'games',
        genre: 'Shooting',
        section: 'new-arrivals',
        platform: 'Android',
        badge: 'Mobile FPS',
        image: 'assets/strike-ops.png',
        officialUrl: 'https://play.google.com/store/apps/details?id=com.ta.strike.ops',
        description: 'Mobile first-person shooter featured on its Google Play listing.'
    },
    {
        id: 'g-blood-strike',
        title: 'Blood Strike',
        category: 'games',
        genre: 'Shooting',
        section: 'trending',
        platform: 'PC / Mobile',
        badge: 'Battle Royale',
        image: 'assets/blood-strike.png',
        officialUrl: 'https://www.blood-strike.com/',
        description: 'Fast-paced battle royale shooter from NetEase Games.'
    },
    {
        id: 'g-free-fire',
        title: 'Garena Free Fire',
        category: 'games',
        genre: 'Shooting',
        section: 'trending',
        platform: 'Android / iOS',
        badge: 'Battle Royale',
        image: 'assets/free-fire.jpg',
        officialUrl: 'https://ff.garena.com/en',
        description: 'Garena’s mobile battle royale. Visit the official site for game news and downloads.'
    },
    {
        id: 'g-apex',
        title: 'Apex Legends',
        category: 'games',
        genre: 'Shooting',
        section: 'new-arrivals',
        platform: 'PC / PlayStation / Xbox',
        badge: 'Hero Shooter',
        image: 'assets/apex-legends.jpg',
        officialUrl: 'https://www.ea.com/games/apex-legends',
        description: 'Choose a Legend and squad up in EA’s free-to-play hero shooter.'
    },
    { id: 'g-forza5', title: 'Forza Horizon 5', category: 'games', genre: 'Racing', section: 'trending', platform: 'PC / Xbox / PlayStation 5', badge: 'Open-World Racing', image: 'assets/forza-horizon-5.jpg', officialUrl: 'https://forza.net/horizon5', storeUrl: 'https://store.steampowered.com/app/1551360/', storeLabel: 'Get on Steam', description: 'Explore the vibrant open-world landscapes and roads of Mexico.' },
    { id: 'g-nfs-unbound', title: 'Need for Speed Unbound', category: 'games', genre: 'Racing', section: 'trending', platform: 'PC / PlayStation / Xbox', badge: 'Street Racing', image: 'assets/nfs-unbound.jpg', officialUrl: 'https://www.ea.com/games/need-for-speed/need-for-speed-unbound', storeUrl: 'https://store.steampowered.com/app/1846380/', storeLabel: 'Get on Steam', description: 'Race through Lakeshore, build your ride and make your mark.' },
    { id: 'g-crew-motorfest', title: 'The Crew Motorfest', category: 'games', genre: 'Racing', section: 'trending', platform: 'PC / PlayStation / Xbox', badge: 'Open-World Racing', image: 'assets/the-crew-motorfest.jpg', officialUrl: 'https://www.ubisoft.com/en-us/game/the-crew/motorfest', storeUrl: 'https://store.steampowered.com/app/2698940/', storeLabel: 'Get on Steam', description: 'Take on a festival of driving across the island of O‘ahu.' },
    { id: 'g-forza4', title: 'Forza Horizon 4', category: 'games', genre: 'Racing', section: 'trending', platform: 'PC / Xbox', badge: 'Racing Favorite', image: 'assets/forza-horizon-4.jpg', officialUrl: 'https://forza.net/horizon4', storeUrl: 'https://store.steampowered.com/app/1293830/', storeLabel: 'Get on Steam', description: 'Race across a changing open-world version of Great Britain.' },
    { id: 'g-cs2', title: 'Counter-Strike 2', category: 'games', genre: 'Shooting', section: 'trending', platform: 'PC', badge: 'Tactical FPS', image: 'assets/counter-strike-2.jpg', officialUrl: 'https://www.counter-strike.net/cs2', storeUrl: 'https://store.steampowered.com/app/730/', storeLabel: 'Play on Steam', description: 'Valve’s competitive tactical first-person shooter.' },
    { id: 'g-overwatch2', title: 'Overwatch 2', category: 'games', genre: 'Shooting', section: 'trending', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Hero Shooter', image: 'assets/overwatch-2.jpg', officialUrl: 'https://overwatch.blizzard.com/en-us/', storeUrl: 'https://store.steampowered.com/app/2357570/', storeLabel: 'Get on Steam', description: 'Team up as heroes with distinct abilities in Blizzard’s team shooter.' },
    { id: 'g-pubg', title: 'PUBG: BATTLEGROUNDS', category: 'games', genre: 'Shooting', section: 'trending', platform: 'PC / PlayStation / Xbox', badge: 'Battle Royale', image: 'assets/pubg-battlegrounds.jpg', officialUrl: 'https://pubg.com/en/main', storeUrl: 'https://store.steampowered.com/app/578080/', storeLabel: 'Play on Steam', description: 'Drop into a large-scale battle royale and fight to be the last squad standing.' },
    { id: 'g-r6', title: 'Rainbow Six Siege', category: 'games', genre: 'Shooting', section: 'trending', platform: 'PC / PlayStation / Xbox', badge: 'Tactical Shooter', image: 'assets/rainbow-six-siege.jpg', officialUrl: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege', storeUrl: 'https://store.steampowered.com/app/359550/', storeLabel: 'Get on Steam', description: 'A tactical team shooter built around operators and destructible environments.' },
    { id: 'g-elden-ring', title: 'Elden Ring', category: 'games', genre: 'Adventure', section: 'trending', platform: 'PC / PlayStation / Xbox', badge: 'Action RPG', image: 'assets/elden-ring.jpg', officialUrl: 'https://en.bandainamcoent.eu/elden-ring/elden-ring', storeUrl: 'https://store.steampowered.com/app/1245620/', storeLabel: 'Get on Steam', description: 'Explore the Lands Between in FromSoftware’s expansive action RPG.' },
    { id: 'g-hogwarts', title: 'Hogwarts Legacy', category: 'games', genre: 'Adventure', section: 'trending', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Fantasy Adventure', image: 'assets/hogwarts-legacy.jpg', officialUrl: 'https://www.hogwartslegacy.com/en-us', storeUrl: 'https://store.steampowered.com/app/990080/', storeLabel: 'Get on Steam', description: 'Explore a magical open world set in the wizarding world.' },
    { id: 'g-witcher3', title: 'The Witcher 3: Wild Hunt', category: 'games', genre: 'RPG', section: 'trending', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Story RPG', image: 'assets/witcher-3.jpg', officialUrl: 'https://www.thewitcher.com/us/en/witcher3', storeUrl: 'https://store.steampowered.com/app/292030/', storeLabel: 'Get on Steam', description: 'Travel the Continent as monster hunter Geralt of Rivia.' },
    { id: 'g-stardew', title: 'Stardew Valley', category: 'games', genre: 'Simulation', section: 'trending', platform: 'PC / Console / Mobile', badge: 'Cozy Favorite', image: 'assets/stardew-valley.jpg', officialUrl: 'https://www.stardewvalley.net/', storeUrl: 'https://store.steampowered.com/app/413150/', storeLabel: 'Get on Steam', description: 'Build a farm, make friends and settle into country life.' },
    { id: 'g-silksong', title: 'Hollow Knight: Silksong', category: 'games', genre: 'Adventure', section: 'trending', platform: 'PC / Console', badge: 'Metroidvania', image: 'assets/hollow-knight-silksong.jpg', officialUrl: 'https://www.teamcherry.com.au/', storeUrl: 'https://store.steampowered.com/app/1030300/', storeLabel: 'Get on Steam', description: 'Explore a vast new kingdom in Team Cherry’s action-adventure.' },
    { id: 'g-mk1', title: 'Mortal Kombat 1', category: 'games', genre: 'Fighting', section: 'trending', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Fighting', image: 'assets/mortal-kombat-1.jpg', officialUrl: 'https://www.mortalkombat.com/en-us', storeUrl: 'https://store.steampowered.com/app/1971870/', storeLabel: 'Get on Steam', description: 'Enter a new era of the long-running Mortal Kombat fighting series.' },
    { id: 'g-tekken8', title: 'TEKKEN 8', category: 'games', genre: 'Fighting', section: 'trending', platform: 'PC / PlayStation / Xbox', badge: 'Fighting', image: 'assets/tekken-8.jpg', officialUrl: 'https://en.bandainamcoent.eu/tekken/tekken-8', storeUrl: 'https://store.steampowered.com/app/1778820/', storeLabel: 'Get on Steam', description: 'The latest entry in Bandai Namco’s iconic 3D fighting series.' },
    { id: 'g-sf6', title: 'Street Fighter 6', category: 'games', genre: 'Fighting', section: 'trending', platform: 'PC / PlayStation / Xbox', badge: 'Fighting', image: 'assets/street-fighter-6.jpg', officialUrl: 'https://www.streetfighter.com/6/', storeUrl: 'https://store.steampowered.com/app/1364780/', storeLabel: 'Get on Steam', description: 'Capcom’s fighting game with multiple modes for new and experienced players.' },
    { id: 'g-wwe25', title: 'WWE 2K25', category: 'games', genre: 'Fighting', section: 'trending', platform: 'PC / PlayStation / Xbox', badge: 'Sports Entertainment', image: 'assets/wwe-2k25.jpg', officialUrl: 'https://wwe.2k.com/2k25/', storeUrl: 'https://store.steampowered.com/app/2878960/', storeLabel: 'Get on Steam', description: 'Build your legacy in the WWE 2K wrestling game.' },
    { id: 'g-rocket-league', title: 'Rocket League', category: 'games', genre: 'Sports', section: 'trending', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Arcade Sports', image: 'assets/rocket-league.jpg', officialUrl: 'https://www.rocketleague.com/', storeUrl: 'https://store.steampowered.com/app/252950/', storeLabel: 'Visit game store', description: 'Fast cars and football-inspired matches in Psyonix’s arena game.' },
    { id: 'g-fall-guys', title: 'Fall Guys', category: 'games', genre: 'Arcade', section: 'trending', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Party Game', image: 'assets/fall-guys.jpg', officialUrl: 'https://www.fallguys.com/', storeUrl: 'https://store.steampowered.com/app/1097150/', storeLabel: 'Visit game store', description: 'Race through colorful obstacle courses in this party platformer.' },
    { id: 'g-cuphead', title: 'Cuphead', category: 'games', genre: 'Arcade', section: 'trending', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Run & Gun', image: 'assets/cuphead.jpg', officialUrl: 'https://www.studiomdhr.com/', storeUrl: 'https://store.steampowered.com/app/268910/', storeLabel: 'Get on Steam', description: 'A hand-drawn run-and-gun adventure inspired by classic cartoons.' },
    { id: 'g-civ7', title: 'Sid Meier’s Civilization VII', category: 'games', genre: 'Strategy', section: 'trending', platform: 'PC / PlayStation / Xbox / Switch', badge: 'Strategy', image: 'assets/civilization-vii.jpg', officialUrl: 'https://civilization.2k.com/civ-vii/', storeUrl: 'https://store.steampowered.com/app/1295660/', storeLabel: 'Get on Steam', description: 'Build an empire and guide a civilization through the ages.' },
    { id: 'g-aoe4', title: 'Age of Empires IV', category: 'games', genre: 'Strategy', section: 'trending', platform: 'PC / Xbox', badge: 'Real-Time Strategy', image: 'assets/age-of-empires-iv.jpg', officialUrl: 'https://www.ageofempires.com/games/age-of-empires-iv/', storeUrl: 'https://store.steampowered.com/app/1466860/', storeLabel: 'Get on Steam', description: 'Build a civilization and command armies across historical campaigns.' },
    { id: 'g-total-war-warhammer3', title: 'Total War: WARHAMMER III', category: 'games', genre: 'Strategy', section: 'trending', platform: 'PC', badge: 'Strategy', image: 'assets/total-war-warhammer-3.jpg', officialUrl: 'https://www.totalwar.com/games/total-war-warhammer-iii/', storeUrl: 'https://store.steampowered.com/app/1142710/', storeLabel: 'Get on Steam', description: 'Lead legendary factions in a grand strategy and real-time battle campaign.' },
    { id: 'g-helldivers2', title: 'HELLDIVERS 2', category: 'games', genre: 'Shooting', section: 'trending', platform: 'PC / PlayStation 5', badge: 'Co-op Shooter', image: 'assets/helldivers-2.jpg', officialUrl: 'https://www.playstation.com/en-us/games/helldivers-2/', storeUrl: 'https://store.steampowered.com/app/553850/', storeLabel: 'Get on Steam', description: 'Join a squad in a cooperative third-person fight for Super Earth.' },
    {
        id: 't-steam',
        title: 'Steam Wallet Code',
        category: 'topups',
        section: 'topups',
        platform: 'Steam',
        badge: 'Top-Up',
        description: 'Instant digital wallet top-up for PC game libraries.'
    },
    {
        id: 't-psn',
        title: 'PlayStation Network Card',
        category: 'topups',
        section: 'topups',
        platform: 'PlayStation',
        badge: 'Top-Up',
        description: 'Add store credit or membership access to PlayStation.'
    },
    {
        id: 't-xbox',
        title: 'Xbox Gift & Pass Code',
        category: 'topups',
        section: 'topups',
        platform: 'Xbox',
        badge: 'Top-Up',
        description: 'Redeemable code for Xbox titles and online services.'
    },
    {
        id: 't-eshop',
        title: 'Nintendo eShop Voucher',
        category: 'topups',
        section: 'topups',
        platform: 'Nintendo',
        badge: 'Top-Up',
        description: 'Digital code for portable and console releases.'
    },
    {
        id: 'h-vr',
        title: 'VR Headset Pro',
        category: 'gear',
        section: 'gear',
        platform: 'VR Hardware',
        badge: 'Featured Gear',
        description: 'Wide-view head-mounted display for immersive gaming.'
    },
    {
        id: 'h-headset',
        title: 'Wireless Gaming Headset',
        category: 'gear',
        section: 'gear',
        platform: 'Audio Gear',
        badge: 'Recommended',
        description: 'Low-latency wireless audio with clear voice chat.'
    },
    {
        id: 'h-controller',
        title: 'Pro Wireless Controller',
        category: 'gear',
        section: 'gear',
        platform: 'Controllers',
        badge: 'Recommended',
        description: 'Ergonomic gamepad with responsive triggers and grip.'
    },
    {
        id: 'h-mouse',
        title: 'RGB Precision Gaming Mouse',
        category: 'gear',
        section: 'gear',
        platform: 'Peripherals',
        badge: 'Recommended',
        description: 'Lightweight wired/wireless mouse with adjustable DPI.'
    }
];

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication token required.' });
    }

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = payload;
        next();
    });
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'DEV-GAMING API' });
});

app.get('/api/catalog', (req, res) => {
    const { category = 'all', search = '' } = req.query;
    const term = search.trim().toLowerCase();

    const filtered = catalog.filter((item) => {
        const matchesCategory = category === 'all' || item.category === category;
        const matchesSearch =
            !term ||
            item.title.toLowerCase().includes(term) ||
            item.platform.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term);

        return matchesCategory && matchesSearch;
    });

    res.json({ items: filtered });
});

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = users.find((u) => u.email === normalizedEmail);

        if (existingUser) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = {
            id: `usr_${Date.now()}`,
            username: username.trim(),
            email: normalizedEmail,
            passwordHash,
            savedIds: [],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Account created successfully.',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                savedIds: newUser.savedIds
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = users.find((u) => u.email === normalizedEmail);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Logged in successfully.',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                savedIds: user.savedIds
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during login.' });
    }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            savedIds: user.savedIds
        }
    });
});

app.post('/api/saved/toggle', authenticateToken, (req, res) => {
    const { itemId } = req.body;
    const user = users.find((u) => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const itemExists = catalog.some((item) => item.id === itemId);
    if (!itemExists) {
        return res.status(404).json({ error: 'Catalog item not found.' });
    }

    const index = user.savedIds.indexOf(itemId);
    if (index > -1) {
        user.savedIds.splice(index, 1);
    } else {
        user.savedIds.push(itemId);
    }

    res.json({ savedIds: user.savedIds });
});

app.listen(PORT, () => {
    console.log(`DEV-GAMING backend running on http://localhost:${PORT}`);
});