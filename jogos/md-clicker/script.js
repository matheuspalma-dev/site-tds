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

function atualizarUI() {
  CDN.textContent = ClicksCount.toString();
  priceOruamUPG.textContent = priceOruam.toFixed(1);
  priceClickUPG.textContent = priceClick.toFixed(1);
  priceFoguetesUPG.textContent = priceFoguetes.toFixed(1);
  priceFumacasUPG.textContent = priceFumacas.toFixed(1);
  priceRebirthUPG.textContent = priceRebirth.toFixed(1);
  SCV.textContent = ClickValue.toString();
  if (FumacaUpgrade) canhaoDnevoa.style.display = "flex";
  if (OruamActive) OruamPNG.style.display = "flex";
}
atualizarUI();

function Pulsar() {
  try {
    const fogos = new Audio("Assets/mixkit-fast-whistle-firework-3103.wav");
    const p = fogos.play();
    if (p && p.catch) p.catch(() => {});
  } catch (e) {}

  let i = 0;
  const x = [
    "https://i.postimg.cc/sQ6KprZW/1.png",
    "https://i.postimg.cc/G87zkCsY/2.png",
    "https://i.postimg.cc/k61wxmtt/3.png",
    "https://i.postimg.cc/qhbQ8TCg/4.png",
    "https://i.postimg.cc/5Y7pwVF6/5.png",
    "https://i.postimg.cc/jwgvzbJx/6.png",
    "https://i.postimg.cc/FdWGj4Jz/7.png",
    "https://i.postimg.cc/0MWZpsJ2/8.png",
    "https://i.postimg.cc/gXS4vW6d/9.png"
  ];

  const intervalox = setInterval(() => {
    buttonclicker.src = x[i];

    buttonclicker.style.top = "-23vh";
    buttonclicker.style.height = "80vh";
    buttonclicker.style.width = "20vw";
    i = i + 1;
    if (i >= x.length) {
      clearInterval(intervalox);
      buttonclicker.src = "https://i.postimg.cc/sQ6KprZW/1.png";
      i = 0;
    }
  }, 50);
}

function SoltarFumaca() {
  ClicksCount++;
  let valor = parseFloat(pontos.innerText);
  CDN.textContent = ClicksCount.toString();
  if (ClicksCount >= 10) {
    ClicksCount = 0;
    pontos.innerText = (valor + BonusFumaca).toFixed(1);
  }
}

function iniciarTimerCPS() {
  if (intervalCPS) clearInterval(intervalCPS);
  if (ClicksPerSecond > 0) {
    intervalCPS = setInterval(() => {
      let CPS = parseFloat(pontos.innerText);
      pontos.innerText = (CPS + ClicksPerSecond).toFixed(1);
      Pulsar();
    }, 1000);
  }
}

buttonclicker.addEventListener("click", () => {
  let valor = parseFloat(pontos.innerText);
  pontos.innerText = (valor + ClickValue).toFixed(1);
  if (FumacaUpgrade) SoltarFumaca();
  Pulsar();
});

clickupg.addEventListener("click", () => {
  let value = parseFloat(pontos.innerText);
  if (value >= priceClick) {
    pontos.innerText = (value - priceClick).toFixed(1);
    ClickValue += 1;
    priceClick *= 1.2;
    atualizarUI();
  }
});

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
