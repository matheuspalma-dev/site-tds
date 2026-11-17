
let pontos = document.getElementById("pontos");
let buttonclicker = document.getElementById("buttonclicker");

let clickupg = document.querySelector(".Click");
let priceClickUPG = document.querySelector(".priceClickUPG");
let priceFoguetesUPG = document.querySelector(".priceFoguetesUPG");
let priceFumacasUPG = document.querySelector(".priceFumacasUPG");
let priceOruamUPG = document.querySelector(".priceOruamUPG");
let SCV = document.querySelector(".SCV");
let Foguetes = document.querySelector(".Foguetes");
let Fumacas = document.querySelector(".Fumacas");
let OruamPNG = document.querySelector(".OruamPNG");
let Oruam = document.querySelector(".Oruam");
let CDN = document.querySelector(".CDN");
let canhaoDnevoa = document.querySelector(".canhaoDnevoa");
let priceRebirthUPG = document.querySelector(".priceRebirthUPG");

let ClickValue = 1;
let priceClick = 10;
let priceFoguetes = 200;
let priceFumacas = 500;
let priceOruam = 10000;
let priceRebirth = 100000;
let ClicksPerSecond = 0;
let ClicksCount = 0;
let BonusFumaca = 20;
let FumacaUpgrade = false;
let OruamActive = false;
let intervalCPS = null;

// ==================================================
// ANIMAÇÃO DO FOGUETE
// ==================================================

let clickAnimation = document.createElement("img");

clickAnimation.id = "clickAnimation";
clickAnimation.alt = "Animação de foguete";
clickAnimation.style.display = "none";

buttonclicker.insertAdjacentElement("afterend", clickAnimation);

// Usa somente os frames 005 até 014
const framesAnimacao = Array.from(
    { length: 10 },
    (_, i) => `Assets/animacao/download_${String(i + 5).padStart(3, "0")}.png`
);

// Pré-carrega as imagens
const imagensAnimacao = framesAnimacao.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
});

// Controla se a animação está acontecendo
let intervaloAnimacao = null;

function atualizarUI() {
    CDN.textContent = ClicksCount.toString();

    priceOruamUPG.textContent = priceOruam.toFixed(1);
    priceClickUPG.textContent = priceClick.toFixed(1);
    priceFoguetesUPG.textContent = priceFoguetes.toFixed(1);
    priceFumacasUPG.textContent = priceFumacas.toFixed(1);
    priceRebirthUPG.textContent = priceRebirth.toFixed(1);

    SCV.textContent = ClickValue.toString();

    if (FumacaUpgrade) {
        canhaoDnevoa.style.display = "flex";
    }

    if (OruamActive) {
        OruamPNG.style.display = "flex";
    }
}

atualizarUI();

// ==================================================
// ANIMAÇÃO E SOM
// ==================================================

function Pulsar() {
    // Toca o som a cada chamada
    try {
        const fogos = new Audio(
            "Assets/mixkit-fast-whistle-firework-3103.wav"
        );

        const p = fogos.play();

        if (p && p.catch) {
            p.catch(() => {});
        }
    } catch (e) {
        console.log("Não foi possível tocar o áudio:", e);
    }

    // Se a animação já estiver acontecendo,
    // não reinicia e não cancela.
    if (intervaloAnimacao !== null) {
        return;
    }

    let frameAtual = 0;

    clickAnimation.style.display = "block";
    clickAnimation.src = framesAnimacao[0];

    // 81ms por frame: 10 frames duram aproximadamente
    // o mesmo tempo que os 18 frames anteriores a 45ms.
    intervaloAnimacao = setInterval(() => {
        frameAtual++;

        if (frameAtual >= framesAnimacao.length) {
            clearInterval(intervaloAnimacao);
            intervaloAnimacao = null;

            clickAnimation.style.display = "none";
            return;
        }

        clickAnimation.src = framesAnimacao[frameAtual];
    }, 81);
}

// ==================================================
// SISTEMA DE FUMAÇA
// ==================================================

function SoltarFumaca() {
    ClicksCount++;

    let valor = parseFloat(pontos.innerText);

    CDN.textContent = ClicksCount.toString();

    if (ClicksCount >= 10) {
        ClicksCount = 0;
        pontos.innerText = (valor + BonusFumaca).toFixed(1);
    }
}

// ==================================================
// SISTEMA DE CLIQUES POR SEGUNDO
// ==================================================

function iniciarTimerCPS() {
    if (intervalCPS) {
        clearInterval(intervalCPS);
    }

    if (ClicksPerSecond > 0) {
        intervalCPS = setInterval(() => {
            let CPS = parseFloat(pontos.innerText);

            pontos.innerText = (CPS + ClicksPerSecond).toFixed(1);

            Pulsar();
        }, 1000);
    }
}

// ==================================================
// CLIQUE NA CAIXA
// ==================================================

buttonclicker.addEventListener("click", () => {
    let valor = parseFloat(pontos.innerText);

    pontos.innerText = (valor + ClickValue).toFixed(1);

    if (FumacaUpgrade) {
        SoltarFumaca();
    }

    Pulsar();
});

// ==================================================
// UPGRADE DE CLIQUE
// ==================================================

clickupg.addEventListener("click", () => {
    let value = parseFloat(pontos.innerText);

    if (value >= priceClick) {
        pontos.innerText = (value - priceClick).toFixed(1);

        ClickValue += 1;
        priceClick *= 1.2;

        atualizarUI();
    }
});

// ==================================================
// UPGRADE DE FOGUETES
// ==================================================

Foguetes.addEventListener("click", () => {
    let valor = parseFloat(pontos.innerText);

    if (valor >= priceFoguetes) {
        pontos.innerText = (valor - priceFoguetes).toFixed(1);

        ClicksPerSecond += 1;
        priceFoguetes *= 1.15;

        atualizarUI();
        iniciarTimerCPS();
    }
});

// ==================================================
// UPGRADE DE FUMAÇAS
// ==================================================

Fumacas.addEventListener("click", () => {
    let valor = parseFloat(pontos.innerText);

    if (valor >= priceFumacas) {
        pontos.innerText = (valor - priceFumacas).toFixed(1);

        ClicksCount = 0;
        FumacaUpgrade = true;

        priceFumacas *= 1.4;
        BonusFumaca *= 1.5;

        atualizarUI();
    }
});

// ==================================================
// UPGRADE ORUAM
// ==================================================

Oruam.addEventListener("click", () => {
    let valor = parseFloat(pontos.innerText);

    if (valor >= priceOruam && OruamActive == false) {
        pontos.innerText = (valor - priceOruam).toFixed(1);

        OruamActive = true;

        ClickValue = ClickValue * 2;
        BonusFumaca = BonusFumaca * 2;
        ClicksPerSecond = ClicksPerSecond * 2;

        atualizarUI();
    }
});
