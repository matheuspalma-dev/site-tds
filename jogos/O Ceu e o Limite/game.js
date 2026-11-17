/**
 * JOGO ARCADE: "O CÉU É O LIMITE"
 * JavaScript Puro - Física, Procedural, Partículas, Lava, Áudio e Câmera
 */

// 1. CONFIGURAÇÃO E CONSTANTES
const CHARACTERS = [
    {
        id: "leo",
        name: "Leo",
        type: "Equilibrado",
        color: "#38bdf8",
        secondaryColor: "#0284c7",
        accentColor: "#facc15",
        speed: 1.0,
        jump: 1.0,
        airControl: 1.0,
        gravity: 1.0,
        ability: "impulso",
        abilityName: "Impulso",
        abilityDesc: "Turbo de velocidade e salto após sequência de bons pousos.",
        cooldown: 8,
        duration: 4,
        description: "Versátil e confiável para qualquer altitude."
    },
    {
        id: "flash",
        name: "Flash",
        type: "Rápido",
        color: "#f59e0b",
        secondaryColor: "#d97706",
        accentColor: "#ef4444",
        speed: 1.25,
        jump: 0.95,
        airControl: 1.2,
        gravity: 1.05,
        ability: "dash",
        abilityName: "Dash Vertical Sônico",
        abilityDesc: "Dispara um foguete vertical supersônico direto para cima!",
        cooldown: 4,
        duration: 0.35,
        description: "Velocidade relâmpago com super dash vertical para o alto."
    },
    {
        id: "pulo",
        name: "Pulo",
        type: "Saltador",
        color: "#10b981",
        secondaryColor: "#059669",
        accentColor: "#6ee7b7",
        speed: 0.9,
        jump: 1.35,
        airControl: 1.0,
        gravity: 1.0,
        ability: "superSalto",
        abilityName: "Super Salto",
        abilityDesc: "Salto colossal que alcança plataformas bem mais altas.",
        cooldown: 9,
        duration: 1.2,
        description: "Mestre dos ares capaz de saltos gigantescos."
    },
    {
        id: "rocky",
        name: "Rocky",
        type: "Pesado",
        color: "#8b5cf6",
        secondaryColor: "#6d28d9",
        accentColor: "#ec4899",
        speed: 0.75,
        jump: 1.15,
        airControl: 0.85,
        gravity: 1.05,
        ability: "impacto",
        abilityName: "Onda de Choque",
        abilityDesc: "Pouso sísmico que destrói perigos e desacelera a lava.",
        cooldown: 12,
        duration: 3,
        description: "Inabalável e resistente a obstáculos vulcânicos."
    },
    {
        id: "nuvem",
        name: "Nuvem",
        type: "Flutuante",
        color: "#06b6d4",
        secondaryColor: "#0891b2",
        accentColor: "#ffffff",
        speed: 1.0,
        jump: 1.05,
        airControl: 1.0,
        gravity: 0.8,
        ability: "flutuar",
        abilityName: "Flutuação",
        abilityDesc: "Reduz a gravidade em 80% para planar com calma.",
        cooldown: 7,
        duration: 3.5,
        description: "Leve como algodão com pousos suaves."
    },
    {
        id: "fenix",
        name: "Fênix",
        type: "Especial",
        color: "#ef4444",
        secondaryColor: "#b91c1c",
        accentColor: "#fbbf24",
        speed: 1.05,
        jump: 1.1,
        airControl: 1.05,
        gravity: 1.0,
        ability: "segundaChance",
        abilityName: "Segunda Chance",
        abilityDesc: "Ao tocar na lava, ressurge das cinzas 40m acima (1x).",
        cooldown: 0,
        duration: 2,
        description: "O pássaro imortal que desafia o calor da lava."
    }
];

const BASE_GRAVITY = 1800;
const BASE_JUMP_FORCE = 740;
const BASE_MOVE_SPEED = 380;
const BASE_ACCELERATION = 2800;
const BASE_FRICTION = 0.84;

// 2. SISTEMA DE ÁUDIO WEB AUDIO API
class SoundSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }
    playTone(startFreq, endFreq, duration, type = 'sine', vol = 0.2) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), this.ctx.currentTime + duration);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
    jump() { this.playTone(280, 560, 0.15, 'sine', 0.2); }
    land() { this.playTone(160, 60, 0.08, 'triangle', 0.15); }
    booster() { this.playTone(220, 900, 0.3, 'triangle', 0.25); }
    dash() { this.playTone(600, 200, 0.18, 'sawtooth', 0.2); }
    impact() { this.playTone(140, 30, 0.35, 'sawtooth', 0.35); }
    rare() { this.playTone(523, 1046, 0.25, 'sine', 0.2); }
    gameOver() { this.playTone(330, 80, 0.4, 'sawtooth', 0.3); }
    click() { this.playTone(800, 400, 0.04, 'sine', 0.1); }
}
const sound = new SoundSystem();

// 3. ESTADO DO JOGO
const Game = {
    canvas: document.getElementById('gameCanvas'),
    ctx: document.getElementById('gameCanvas').getContext('2d'),
    state: 'menu', // menu, playing, paused, gameOver
    selectedCharacter: CHARACTERS[0],
    highScore: 0,
    score: 0,
    height: 0,
    level: 1,
    combo: 0,
    lastTime: 0,

    player: {
        x: 240,
        y: 540,
        width: 38,
        height: 48,
        vx: 0,
        vy: 0,
        isGrounded: true,
        facing: 'right',
        squashX: 1,
        squashY: 1,
        landStreak: 0,
        abilityActive: false,
        abilityTimer: 0,
        abilityCooldownTimer: 0,
        fenixAvailable: true,
        invulnerableTimer: 0,
        dashTimer: 0,
        dashDir: 1,
        floating: false,
        trail: []
    },

    cameraY: 0,
    highestY: 560,
    lavaY: 1100,
    platforms: [],
    obstacles: [],
    particles: [],
    highestGeneratedY: 560,

    keys: {},
    touchInputs: { left: false, right: false, jump: false, ability: false }
};

// Carregar configurações locais
try {
    const savedChar = localStorage.getItem('ceuLimiteSelectedCharacter');
    if (savedChar) {
        const found = CHARACTERS.find(c => c.id === savedChar);
        if (found) Game.selectedCharacter = found;
    }
    const savedScore = localStorage.getItem('ceuLimiteHighScore');
    if (savedScore) Game.highScore = parseInt(savedScore, 10);
} catch (e) {}

// 4. GERAÇÃO PROCEDURAL E FÍSICA
function calculateDifficulty(h) {
    let level = 1;
    let lavaSpeed = 38;
    let minGap = 65, maxGap = 120;
    let smallChance = 0.08, movingChance = 0.06, fragileChance = 0.0, boosterChance = 0.08, rareChance = 0.06;

    if (h >= 500 && h < 1500) {
        level = 2 + Math.floor((h - 500) / 500);
        lavaSpeed = 52 + level * 5;
        minGap = 80; maxGap = 145;
        smallChance = 0.25; movingChance = 0.25; fragileChance = 0.12;
    } else if (h >= 1500 && h < 3000) {
        level = 4 + Math.floor((h - 1500) / 750);
        lavaSpeed = 70 + level * 6;
        minGap = 95; maxGap = 175;
        smallChance = 0.35; movingChance = 0.40; fragileChance = 0.25;
    } else if (h >= 3000) {
        level = 7 + Math.floor((h - 3000) / 1000);
        lavaSpeed = Math.min(140, 95 + level * 6);
        minGap = 110; maxGap = 200;
        smallChance = 0.45; movingChance = 0.50; fragileChance = 0.30;
    }

    return { level, lavaSpeed, minGap, maxGap, smallChance, movingChance, fragileChance, boosterChance, rareChance };
}

function generatePlatform() {
    const cw = Game.canvas.width;
    const diff = calculateDifficulty(Game.height);
    const prevPlat = Game.platforms[Game.platforms.length - 1];

    const gap = Math.random() * (diff.maxGap - diff.minGap) + diff.minGap;
    const newY = prevPlat.y - gap;

    let type = 'normal';
    let width = 110;
    const rand = Math.random();

    if (rand < diff.rareChance) { type = 'rare'; width = 95; }
    else if (rand < diff.rareChance + diff.boosterChance) { type = 'booster'; width = 90; }
    else if (rand < diff.rareChance + diff.boosterChance + diff.fragileChance) { type = 'fragile'; width = 85; }
    else if (rand < diff.rareChance + diff.boosterChance + diff.fragileChance + diff.movingChance) { type = 'moving'; width = 95; }
    else if (rand < diff.rareChance + diff.boosterChance + diff.fragileChance + diff.movingChance + diff.smallChance) { type = 'small'; width = 65; }

    const prevCenterX = prevPlat.x + prevPlat.width / 2;
    const span = Math.min(220, cw * 0.65);
    let newX = Math.random() * (span * 2) + (prevCenterX - span - width / 2);
    newX = Math.max(20, Math.min(cw - width - 20, newX));

    Game.platforms.push({
        id: 'plat-' + Math.random().toString(36).substr(2, 6),
        x: newX,
        y: newY,
        width,
        height: 24,
        type,
        velocityX: type === 'moving' ? (Math.random() > 0.5 ? 1 : -1) * (60 + diff.level * 10) : 0,
        minX: 15,
        maxX: cw - width - 15,
        breakTimer: type === 'fragile' ? 0.6 : undefined
    });

    Game.highestGeneratedY = newY;
}

function spawnParticles(x, y, color, count = 10, shape = 'circle') {
    for (let i = 0; i < count; i++) {
        if (Game.particles.length > 200) Game.particles.shift();
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 200 + 40;
        Game.particles.push({
            x, y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd - 30,
            size: Math.random() * 5 + 2,
            color,
            alpha: 1,
            decay: Math.random() * 1.5 + 1.0,
            gravity: shape === 'cloud' ? -20 : 120,
            shape
        });
    }
}

// 5. INICIALIZAÇÃO DA PARTIDA
function startMatch() {
    sound.init();
    Game.state = 'playing';
    Game.score = 0;
    Game.height = 0;
    Game.level = 1;
    Game.combo = 0;
    Game.cameraY = 0;
    Game.highestY = 560;
    Game.particles = [];
    Game.obstacles = [];
    Game.platforms = [];

    const startX = Game.canvas.width / 2 - 20;
    const startY = 540;

    Game.player.x = startX;
    Game.player.y = startY;
    Game.player.vx = 0;
    Game.player.vy = 0;
    Game.player.isGrounded = true;
    Game.player.abilityActive = false;
    Game.player.abilityTimer = 0;
    Game.player.abilityCooldownTimer = 0;
    Game.player.fenixAvailable = Game.selectedCharacter.id === 'fenix';
    Game.player.trail = [];

    Game.lavaY = startY + 460;

    // Plataforma inicial
    Game.platforms.push({
        id: 'start',
        x: startX - 45,
        y: startY + 48,
        width: 130,
        height: 26,
        type: 'normal',
        velocityX: 0
    });
    Game.highestGeneratedY = startY + 48;

    for (let i = 0; i < 15; i++) {
        generatePlatform();
    }

    updateHUD();
    document.getElementById('hud-overlay').classList.remove('hidden');
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('pause-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('char-select-screen').classList.add('hidden');
    document.getElementById('how-to-play-screen').classList.add('hidden');
    document.getElementById('ranking-screen').classList.add('hidden');
}

// 6. ATIVAÇÃO DE HABILIDADES
function useAbility() {
    const p = Game.player;
    const c = Game.selectedCharacter;
    if (p.abilityActive || p.abilityCooldownTimer > 0) return;

    if (c.ability === 'dash') {
        p.abilityActive = true;
        p.abilityTimer = c.duration;
        p.abilityCooldownTimer = c.cooldown;
        const steer = (Game.keys['ArrowLeft'] || Game.keys['KeyA'] || Game.touchInputs.left) ? -1 : (Game.keys['ArrowRight'] || Game.keys['KeyD'] || Game.touchInputs.right) ? 1 : 0;
        p.dashDir = steer;
        p.dashTimer = 0.35;
        p.vy = -1150; // Super dash vertical para cima!
        p.vx = steer * 350;
        p.isGrounded = false;
        sound.dash();
        spawnParticles(p.x + p.width/2, p.y + p.height, '#f59e0b', 30, 'spark');
        spawnParticles(p.x + p.width/2, p.y + p.height, '#ef4444', 15, 'spark');
    } else if (c.ability === 'superSalto') {
        p.abilityActive = true;
        p.abilityTimer = c.duration;
        p.abilityCooldownTimer = c.cooldown;
        p.vy = -BASE_JUMP_FORCE * c.jump * 1.65;
        p.isGrounded = false;
        sound.jump();
        spawnParticles(p.x + p.width/2, p.y + p.height, '#6ee7b7', 25, 'cloud');
    } else if (c.ability === 'impacto') {
        p.abilityActive = true;
        p.abilityTimer = c.duration;
        p.abilityCooldownTimer = c.cooldown;
        p.vy = 800;
        Game.lavaY += 120;
        sound.impact();
        spawnParticles(p.x + p.width/2, p.y + p.height, '#ec4899', 30, 'spark');
    } else if (c.ability === 'flutuar') {
        p.abilityActive = true;
        p.abilityTimer = c.duration;
        p.abilityCooldownTimer = c.cooldown;
        p.floating = true;
        sound.jump();
        spawnParticles(p.x + p.width/2, p.y, '#a5f3fc', 20, 'cloud');
    } else if (c.ability === 'impulso') {
        p.abilityActive = true;
        p.abilityTimer = c.duration;
        p.abilityCooldownTimer = c.cooldown;
        sound.booster();
        spawnParticles(p.x + p.width/2, p.y + p.height/2, '#facc15', 20, 'spark');
    }
}

// 7. ATUALIZAÇÃO DO GAME LOOP
function update(dt) {
    if (Game.state !== 'playing') return;

    const p = Game.player;
    const c = Game.selectedCharacter;
    const cw = Game.canvas.width;

    Game.height = Math.max(0, Math.floor((560 - Game.highestY) / 10));
    const diff = calculateDifficulty(Game.height);
    Game.level = diff.level;

    // Cooldown e temporizadores
    if (p.abilityCooldownTimer > 0) p.abilityCooldownTimer = Math.max(0, p.abilityCooldownTimer - dt);
    if (p.abilityActive) {
        p.abilityTimer -= dt;
        if (p.abilityTimer <= 0) { p.abilityActive = false; p.floating = false; }
    }
    if (p.invulnerableTimer > 0) p.invulnerableTimer = Math.max(0, p.invulnerableTimer - dt);

    // Controles horizontais
    let moveInput = 0;
    if (Game.keys['ArrowLeft'] || Game.keys['KeyA'] || Game.touchInputs.left) { moveInput -= 1; p.facing = 'left'; }
    if (Game.keys['ArrowRight'] || Game.keys['KeyD'] || Game.touchInputs.right) { moveInput += 1; p.facing = 'right'; }

    let speedMult = c.speed;
    if (c.ability === 'impulso' && p.abilityActive) speedMult *= 1.45;

    if (p.dashTimer > 0) {
        p.dashTimer -= dt;
        p.vy = Math.min(p.vy, -950);
        if (p.dashDir !== 0) p.vx = p.dashDir * 420;
        if (Math.random() < 0.6) spawnParticles(p.x + p.width/2, p.y + p.height, '#f59e0b', 2, 'spark');
    } else {
        const airMult = p.isGrounded ? 1 : c.airControl * 0.88;
        const targetSpeed = moveInput * BASE_MOVE_SPEED * speedMult;
        p.vx += (targetSpeed - p.vx) * (BASE_ACCELERATION / 1000) * dt * airMult * 6;
        p.vx *= Math.pow(BASE_FRICTION, dt * 60);
    }
    p.x += p.vx * dt;

    if (p.x + p.width < 0) p.x = cw;
    else if (p.x > cw) p.x = -p.width;

    // Pulo
    const wantsJump = Game.keys['Space'] || Game.keys['ArrowUp'] || Game.keys['KeyW'] || Game.touchInputs.jump;
    if (wantsJump && p.isGrounded) {
        let force = BASE_JUMP_FORCE * c.jump;
        if (c.ability === 'impulso' && p.abilityActive) force *= 1.25;
        p.vy = -force;
        p.isGrounded = false;
        sound.jump();
        spawnParticles(p.x + p.width/2, p.y + p.height, '#ffffff', 8, 'cloud');
    }

    // Gravidade
    let grav = BASE_GRAVITY * c.gravity;
    if (p.floating || (c.ability === 'flutuar' && p.abilityActive)) {
        grav *= 0.22;
        if (p.vy > 120) p.vy = 120;
    }
    p.vy += grav * dt;
    p.y += p.vy * dt;

    // Colisão de Plataformas
    p.isGrounded = false;
    Game.platforms.forEach(plat => {
        if (plat.type === 'moving') {
            plat.x += plat.velocityX * dt;
            if (plat.x < plat.minX || plat.x > plat.maxX) plat.velocityX *= -1;
        }

        if (plat.steppedOn && plat.breakTimer !== undefined && !plat.isBroken) {
            plat.breakTimer -= dt;
            if (plat.breakTimer <= 0) {
                plat.isBroken = true;
                spawnParticles(plat.x + plat.width/2, plat.y + plat.height/2, '#94a3b8', 15, 'cloud');
            }
        }

        if (!plat.isBroken && p.vy > 0) {
            const feet = p.y + p.height;
            const prevFeet = feet - p.vy * dt;
            if (prevFeet <= plat.y + 6 && feet >= plat.y && p.x + p.width * 0.8 >= plat.x && p.x + p.width * 0.2 <= plat.x + plat.width) {
                p.y = plat.y - p.height;
                p.vy = 0;
                p.isGrounded = true;
                sound.land();
                spawnParticles(p.x + p.width/2, plat.y, '#ffffff', 8, 'cloud');

                if (plat.type === 'rare' && !plat.collected) {
                    plat.collected = true;
                    Game.score += 1500;
                    sound.rare();
                    spawnParticles(plat.x + plat.width/2, plat.y, '#fbbf24', 25, 'spark');
                } else if (plat.type === 'booster') {
                    p.vy = -BASE_JUMP_FORCE * c.jump * 1.85;
                    p.isGrounded = false;
                    sound.booster();
                } else if (plat.type === 'fragile') {
                    plat.steppedOn = true;
                }
            }
        }
    });

    // Altitude e Pontuação
    if (p.y < Game.highestY) {
        const delta = Game.highestY - p.y;
        Game.highestY = p.y;
        Game.score += Math.floor(delta * 1.5);
    }

    // Câmera
    const targetCamY = p.y - 360;
    Game.cameraY += (targetCamY - Game.cameraY) * dt * 5.5;

    // Subida da Lava
    Game.lavaY -= diff.lavaSpeed * dt;

    // Checar morte pela lava
    if (p.y + p.height >= Game.lavaY - 6) {
        if (c.ability === 'segundaChance' && Game.player.fenixAvailable) {
            Game.player.fenixAvailable = false;
            p.y = Game.lavaY - 340;
            p.vy = -BASE_JUMP_FORCE * 1.5;
            sound.booster();
            spawnParticles(p.x + p.width/2, p.y, '#fbbf24', 40, 'spark');
        } else {
            gameOver();
            return;
        }
    }

    // Gerar novas plataformas
    while (Game.highestGeneratedY > Game.cameraY - 700) {
        generatePlatform();
    }

    // Limpeza de objetos antigos
    const cleanupY = Game.cameraY + 950;
    Game.platforms = Game.platforms.filter(plat => plat.y < cleanupY);

    // Partículas
    Game.particles.forEach(pt => {
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        if (pt.gravity) pt.vy += pt.gravity * dt;
        pt.alpha -= pt.decay * dt;
    });
    Game.particles = Game.particles.filter(pt => pt.alpha > 0);

    updateHUD();
}

// 8. RENDERIZAÇÃO NO CANVAS
function render() {
    const ctx = Game.ctx;
    const cw = Game.canvas.width;
    const ch = Game.canvas.height;
    const camY = Game.cameraY;

    ctx.clearRect(0, 0, cw, ch);

    // Céu
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
    skyGrad.addColorStop(0, '#0284c7');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Nuvens de Fundo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 5; i++) {
        const cy = (i * 200 - camY * 0.2) % (ch + 100);
        const cx = (i * 120 + Date.now() * 0.01) % (cw + 100) - 50;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.arc(cx + 30, cy - 10, 50, 0, Math.PI * 2);
        ctx.arc(cx + 60, cy, 40, 0, Math.PI * 2);
        ctx.fill();
    }

    // Plataformas
    Game.platforms.forEach(plat => {
        const sy = plat.y - camY;
        if (sy > -50 && sy < ch + 50) {
            ctx.save();
            ctx.fillStyle = plat.type === 'rare' ? '#fbbf24' : (plat.type === 'fragile' ? '#94a3b8' : '#ffffff');
            ctx.beginPath();
            ctx.roundRect(plat.x, sy, plat.width, plat.height, 10);
            ctx.fill();
            ctx.restore();
        }
    });

    // Partículas
    Game.particles.forEach(pt => {
        const sy = pt.y - camY;
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, sy, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    // Jogador
    const p = Game.player;
    const c = Game.selectedCharacter;
    const psy = p.y - camY;
    ctx.save();
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.roundRect(p.x, psy, p.width, p.height, 8);
    ctx.fill();

    // Rosto do Personagem
    ctx.fillStyle = '#fff';
    ctx.fillRect(p.x + (p.facing === 'right' ? 22 : 6), psy + 12, 6, 8);
    ctx.fillRect(p.x + (p.facing === 'right' ? 30 : 14), psy + 12, 6, 8);
    ctx.restore();

    // Lava Render
    const lsy = Game.lavaY - camY;
    if (lsy < ch + 200) {
        const time = Date.now() * 0.003;
        
        // Brilho de calor
        const glowGrad = ctx.createLinearGradient(0, lsy - 80, 0, lsy);
        glowGrad.addColorStop(0, 'rgba(249, 115, 22, 0)');
        glowGrad.addColorStop(1, 'rgba(249, 115, 22, 0.5)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, lsy - 80, cw, 80);

        // Superfície de ondas da Lava
        ctx.beginPath();
        ctx.moveTo(0, ch);
        ctx.lineTo(0, lsy);
        for (let x = 0; x <= cw; x += 15) {
            const wave = Math.sin(x * 0.035 + time * 2) * 8 + Math.cos(x * 0.02 - time) * 4;
            ctx.lineTo(x, lsy + wave);
        }
        ctx.lineTo(cw, ch);
        ctx.closePath();

        const lavaGrad = ctx.createLinearGradient(0, lsy, 0, ch);
        lavaGrad.addColorStop(0, '#ffffff');
        lavaGrad.addColorStop(0.08, '#fef08a');
        lavaGrad.addColorStop(0.25, '#f97316');
        lavaGrad.addColorStop(0.65, '#dc2626');
        lavaGrad.addColorStop(1, '#450a0a');
        ctx.fillStyle = lavaGrad;
        ctx.fill();

        // Bolhas de magma
        for (let i = 0; i < 6; i++) {
            const bx = (i * 80 + Math.sin(time + i) * 25) % cw;
            const by = lsy + 4 + Math.sin(time * 2 + i) * 4;
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(bx, by, 5 + (i % 3) * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// 9. ATUALIZAÇÃO DA INTERFACE / HUD
function updateHUD() {
    document.getElementById('hud-score').innerText = Game.score.toLocaleString();
    document.getElementById('hud-height').innerText = Game.height + ' m';
    document.getElementById('hud-record').innerText = Math.max(Game.score, Game.highScore).toLocaleString();

    const feet = Game.player.y + Game.player.height;
    const dist = Math.max(0, Game.lavaY - feet);
    const danger = Math.max(0, Math.min(100, Math.floor(((300 - dist) / 300) * 100)));
    document.getElementById('lava-meter-fill').style.width = danger + '%';
    document.getElementById('lava-meter-text').innerText = danger + '%';

    const p = Game.player;
    const c = Game.selectedCharacter;
    document.getElementById('hud-hero-name').innerText = c.name;
    document.getElementById('hud-hero-type').innerText = c.type;
    document.getElementById('hud-hero-avatar').innerText = c.name.substr(0, 2).toUpperCase();
    document.getElementById('hud-hero-avatar').style.backgroundColor = c.color;

    const abBtn = document.getElementById('hud-ability-btn');
    const cdText = document.getElementById('hud-ability-cd');
    if (p.abilityActive) {
        cdText.innerText = p.abilityTimer.toFixed(1) + 's';
        abBtn.classList.remove('ready');
    } else if (p.abilityCooldownTimer <= 0) {
        cdText.innerText = 'PRONTO (E)';
        abBtn.classList.add('ready');
    } else {
        cdText.innerText = p.abilityCooldownTimer.toFixed(1) + 's';
        abBtn.classList.remove('ready');
    }
}

// 10. GAME OVER E RANKING
function gameOver() {
    Game.state = 'gameOver';
    sound.gameOver();

    if (Game.score > Game.highScore) {
        Game.highScore = Game.score;
        try { localStorage.setItem('ceuLimiteHighScore', String(Game.highScore)); } catch (e) {}
    }

    document.getElementById('go-score').innerText = Game.score.toLocaleString();
    document.getElementById('go-height').innerText = Game.height + ' m';
    document.getElementById('go-level').innerText = Game.level;
    document.getElementById('game-over-screen').classList.remove('hidden');
}

async function saveScoreToServer() {
    const nameInput = document.getElementById('input-player-name');
    const name = nameInput.value.trim() || 'Aventureiro';
    const statusMsg = document.getElementById('save-status-msg');

    statusMsg.innerText = 'Salvando no banco de dados...';

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerName: name,
                characterId: Game.selectedCharacter.id,
                characterName: Game.selectedCharacter.name,
                score: Game.score,
                height: Game.height,
                level: Game.level
            })
        });
        if (response.ok) {
            statusMsg.innerText = '✓ Pontuação registrada no ranking!';
        } else {
            statusMsg.innerText = 'Salvo localmente com sucesso.';
        }
    } catch (e) {
        statusMsg.innerText = 'Salvo localmente.';
    }
}

// 11. BINDING DE EVENTOS
window.addEventListener('keydown', e => {
    Game.keys[e.code] = true;
    if (e.code === 'KeyP') {
        if (Game.state === 'playing') {
            Game.state = 'paused';
            document.getElementById('pause-screen').classList.remove('hidden');
        } else if (Game.state === 'paused') {
            Game.state = 'playing';
            document.getElementById('pause-screen').classList.add('hidden');
        }
    } else if (e.code === 'KeyR') {
        startMatch();
    } else if (e.code === 'KeyE' || e.code === 'ShiftLeft') {
        useAbility();
    }
});

window.addEventListener('keyup', e => {
    Game.keys[e.code] = false;
});

// Eventos de clique e toque
document.getElementById('btn-play-now').addEventListener('click', startMatch);
document.getElementById('hud-ability-btn').addEventListener('click', useAbility);
document.getElementById('btn-pause-toggle').addEventListener('click', () => {
    Game.state = 'paused';
    document.getElementById('pause-screen').classList.remove('hidden');
});
document.getElementById('btn-pause-resume').addEventListener('click', () => {
    Game.state = 'playing';
    document.getElementById('pause-screen').classList.add('hidden');
});
document.getElementById('btn-pause-restart').addEventListener('click', startMatch);
document.getElementById('btn-gameover-restart').addEventListener('click', startMatch);
document.getElementById('btn-save-score').addEventListener('click', saveScoreToServer);

// Renderizar Grade de Personagens
function renderCharGrid() {
    const container = document.getElementById('char-grid-container');
    if (!container) return;
    container.innerHTML = '';

    CHARACTERS.forEach(char => {
        const isSel = Game.selectedCharacter.id === char.id;
        const card = document.createElement('div');
        card.className = 'char-card' + (isSel ? ' selected' : '');
        card.style.borderColor = isSel ? char.color : 'rgba(255,255,255,0.15)';
        card.innerHTML = `
            <div class="char-card-top" style="display:flex; align-items:center; gap:10px;">
                <div style="width:36px; height:36px; border-radius:10px; background:${char.color}; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px; border:2px solid rgba(255,255,255,0.3);">
                    ${char.name.substr(0, 2).toUpperCase()}
                </div>
                <div>
                    <span class="char-card-name" style="color: ${char.color}; font-weight:900; font-size:16px;">${char.name}</span>
                    <span class="char-card-badge" style="font-size:10px; margin-left:6px; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:6px;">${char.type}</span>
                </div>
                ${isSel ? '<span style="margin-left:auto; font-size:10px; font-weight:900; color:#38bdf8; background:#082f49; padding:2px 8px; border-radius:12px; border:1px solid #38bdf8;">✓ ESCOLHIDO</span>' : ''}
            </div>
            <div class="char-card-desc" style="font-size:12px; color:#cbd5e1; margin:8px 0;">${char.description}</div>
            <div style="margin: 6px 0; font-size:11px; color:#94a3b8;">
                <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                    <span>Velocidade:</span>
                    <span style="color:#f59e0b;">${(char.speed * 100).toFixed(0)}%</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Pulo:</span>
                    <span style="color:#10b981;">${(char.jump * 100).toFixed(0)}%</span>
                </div>
            </div>
            <div class="char-card-ability" style="font-size:11px; font-weight:bold; color:#facc15; background:rgba(0,0,0,0.3); padding:6px 8px; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">
                ⚡ ${char.abilityName}: <span style="font-weight:normal; color:#e2e8f0;">${char.abilityDesc}</span>
            </div>
        `;
        card.onclick = () => {
            Game.selectedCharacter = char;
            try { localStorage.setItem('ceuLimiteSelectedCharacter', char.id); } catch(e){}
            sound.click();
            renderCharGrid();
            const mName = document.getElementById('menu-char-name');
            const mAb = document.getElementById('menu-char-ability');
            const mIcon = document.getElementById('menu-char-icon');
            if (mName) mName.innerText = `${char.name} (${char.type})`;
            if (mAb) mAb.innerText = `⚡ Habilidade: ${char.abilityName}`;
            if (mIcon) {
                mIcon.innerText = char.name.substr(0, 2).toUpperCase();
                mIcon.style.backgroundColor = char.color;
            }
        };
        container.appendChild(card);
    });
}
renderCharGrid();

// Telas de navegação
document.getElementById('btn-open-characters').addEventListener('click', () => {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('char-select-screen').classList.remove('hidden');
});
document.getElementById('btn-char-back').addEventListener('click', () => {
    document.getElementById('char-select-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
});
document.getElementById('btn-char-play').addEventListener('click', startMatch);

document.getElementById('btn-open-rules').addEventListener('click', () => {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('how-to-play-screen').classList.remove('hidden');
});
document.getElementById('btn-rules-back').addEventListener('click', () => {
    document.getElementById('how-to-play-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
});
document.getElementById('btn-rules-play').addEventListener('click', startMatch);

// Controles Mobile Touch
const bindTouch = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); Game.touchInputs[key] = true; });
    el.addEventListener('pointerup', (e) => { e.preventDefault(); Game.touchInputs[key] = false; });
    el.addEventListener('pointercancel', (e) => { e.preventDefault(); Game.touchInputs[key] = false; });
    el.addEventListener('pointerleave', () => { Game.touchInputs[key] = false; });
};
bindTouch('touch-btn-left', 'left');
bindTouch('touch-btn-right', 'right');
bindTouch('touch-btn-jump', 'jump');
bindTouch('touch-btn-ability', 'ability');

// Loop Principal
function gameLoop(timestamp) {
    if (!Game.lastTime) Game.lastTime = timestamp;
    const dt = Math.min((timestamp - Game.lastTime) / 1000, 0.1);
    Game.lastTime = timestamp;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
