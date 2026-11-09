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
    cp: 'circle(50%)',
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
    n: 'Memória Naves',
    s: 'MN',
    d: 'Vire as cartas e encontre os pares do Souza Naves.',
    cp: 'polygon(50% 0,100% 50%,50% 100%,0 50%)',
    href: ''
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