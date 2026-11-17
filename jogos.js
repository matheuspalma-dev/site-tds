/* ==========================================================================
   JOGOS — script da página jogos.html
   Monta os cartões de jogos, abre o jogo escolhido e mostra avisos (toast).
   ========================================================================== */


/* ==========================================================================
   1. DADOS DOS JOGOS
   ========================================================================== */

/**
 * Lista de jogos exibidos na página.
 *   n    = nome
 *   s    = texto do ícone
 *   d    = descrição
 *   cp   = forma do ícone (clip-path CSS)
 *   href = arquivo do jogo. Enquanto estiver vazio, o clique só mostra um aviso.
 *
 * Para ligar cada jogo, preencha o "href" com o arquivo dele,
 * por exemplo: 'quiz/quiz.html'
 */
const GAMES = [
  {
    n: 'MD Clicker',
    s: 'MD',
    d: 'Clique rápido e ganhe pontos para comprar upgrades.',
    cp: 'polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%)',
    href: 'jogos/md-clicker/index.html'
  },
  {
    n: 'Street Combat',
    s: 'ST',
    d: 'Lute contra inimigos em um jogo de ação estilo arcade.',
    // Marreta inclinada (estilo Chapolin). O "ST" fica dentro da cabeça da marreta.
    cp: 'polygon(25.7% 11.9%,29.7% 13.0%,28.9% 15.8%,85.4% 32.1%,86.2% 29.2%,90.2% 30.4%,91.4% 32.5%,76.5% 84.6%,74.3% 85.8%,70.3% 84.6%,71.1% 81.8%,49.7% 75.6%,45.1% 91.5%,46.8% 92.0%,45.2% 97.6%,28.2% 92.8%,29.8% 87.1%,31.5% 87.6%,36.1% 71.8%,14.6% 65.6%,13.8% 68.4%,9.8% 67.3%,8.6% 65.1%,23.5% 13.1%)',
    href: 'jogos/Street Combat/index.html'
  },
  {
    n: 'Sibéria',
    s: 'SB',
    d: 'Explore a Sibéria em um jogo de aventura e sobrevivência.',
    cp: 'inset(0 round 22px)',
    href: 'jogos/Siberia/index.html'
  },
  {
    n: 'Ping Pong rivals',
    s: 'PR',
    d: 'Jogue Ping Pong Rivals',
    cp: 'polygon(50% 0,100% 50%,50% 100%,0 50%)',
    href: 'jogos/ping-pong-rivals/index.html'
  },
  {
    n: 'O Céu é o Limite',
    s: 'CL',
    d: 'Salte entre nuvens, suba cada vez mais alto e fuja da lava.',
    cp: 'circle(50%)',
    href: 'jogos/O Ceu e o Limite/index.html'
  }
];


/* ==========================================================================
   2. FUNÇÕES AUXILIARES
   ========================================================================== */

/** Escapa caracteres especiais de HTML (evita injeção de HTML/XSS). */
const esc = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

/** Guarda o temporizador do toast para poder reiniciá-lo. */
let tt;

/** Mostra uma mensagem temporária (toast) por ~2,8 segundos. */
function toast(m) {
  const t = document.getElementById('ts');
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('on'), 2800);
}


/* ==========================================================================
   3. RENDERIZAÇÃO DA GRADE DE JOGOS
   Cada jogo vira um <button> com ícone, nome, descrição e "Jogar".
   O atributo data-g guarda o índice do jogo em GAMES.
   ========================================================================== */

document.getElementById('gg').innerHTML = GAMES.map((g, i) =>
  `<button class="gm" data-g="${i}">` +
    `<i style="--cp:${g.cp}">${esc(g.s)}</i>` +
    `<strong class="h3">${esc(g.n)}</strong>` +
    `<span class="d">${esc(g.d)}</span>` +
    `<span class="go">Jogar</span>` +
  `</button>`
).join('');


/* ==========================================================================
   4. EVENTOS
   ========================================================================== */

/**
 * Clique em um cartão de jogo (delegação de eventos):
 *  - se o jogo tem href, abre a página dele;
 *  - se não tem, mostra o aviso de demonstração.
 */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-g]');
  if (!b) return;

  const g = GAMES[b.dataset.g];
  g.href ? location.href = g.href : toast('Aqui abre o jogo “' + g.n + '”.');
});