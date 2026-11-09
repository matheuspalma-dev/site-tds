/* ==========================================================================
   SOUZA NAVES — script principal (versão completa, organizada e comentada)
   Estrutura:
     1. Utilitários básicos
     2. Dados fixos
     3. Filtro de palavras ofensivas
     4. Estado da aplicação e persistência
     5. Variáveis de controle da interface
     6. Componentes de UI reutilizáveis
     7. Navegação entre telas
     8. Renderizadores das telas (R)
     9. Ações disparadas pelos botões data-a (A)
    10. Leitura de arquivos enviados (rd)
    11. Eventos globais e inicialização
    12. Microinterações visuais
   ========================================================================== */


/* ==========================================================================
   1. UTILITÁRIOS BÁSICOS
   ========================================================================== */

/** Atalho para document.querySelector. */
const $ = s => document.querySelector(s);

/** Escapa caracteres especiais de HTML (evita injeção de HTML/XSS). */
const esc = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

/** Completa o número com zero à esquerda (5 -> "05"). */
const pad = n => String(n).padStart(2, '0');

/** Gera a chave de data "AAAA-MM-DD" (mês começa em 0, como no Date). */
const K = (y, m, d) => y + '-' + pad(m + 1) + '-' + pad(d);

/** Data de hoje e sua chave no formato "AAAA-MM-DD". */
const T = new Date();
const TK = K(T.getFullYear(), T.getMonth(), T.getDate());

/** Formata um valor numérico em reais: 19.9 -> "R$ 19,90". */
const brl = v => 'R$ ' + v.toFixed(2).replace('.', ',');

/** Tempo decorrido desde um timestamp: "agora", "5 min", "3 h", "2 d". */
const ago = t => {
  const m = Math.round((Date.now() - t) / 6e4);
  return m < 1 ? 'agora'
    : m < 60 ? m + ' min'
    : m < 1440 ? Math.round(m / 60) + ' h'
    : Math.round(m / 1440) + ' d';
};


/* ==========================================================================
   2. DADOS FIXOS (constantes)
   ========================================================================== */

/** Tags de nível dos alunos: [nome, cor, preço]. */
const TG = {
  cal: ['Calouro', '#1f9d63', 4.9],
  ver: ['Veterano', '#d9363e', 7.9],
  cra: ['Craque', '#7a4cf0', 9.9],
  mes: ['Mestre', '#e07b00', 12.9],
  len: ['Lenda', '#0091a8', 14.9]
};

/** Rótulos dos tipos de evento do calendário. */
const KL = {
  int: 'Interclasse',
  trote: 'Trote',
  esp: 'Refeição especial',
  ev: 'Evento'
};

/** Cardápios de exemplo (pratos separados por ";"). Usados em rodízio por seed(). */
const ME = [
  'Arroz, feijão e frango grelhado;Salada de alface e tomate;Suco de laranja',
  'Macarrão ao molho;Carne moída;Suco de uva',
  'Arroz, feijão e omelete;Purê de batata;Suco de maracujá',
  'Strogonoff de frango;Arroz e batata palha;Suco de limão',
  'Pão com queijo;Bolo de cenoura;Leite com achocolatado'
];

/**
 * Galeria (Cloudinary): as fotos vêm direto da nuvem, sem mexer no código.
 *   CLOUD = nome da sua conta (Cloud name, no painel do Cloudinary)
 *   GT    = tags que viram filtros: [tag no Cloudinary, nome no botão]
 * Cada foto precisa ter UMA dessas tags. A legenda é o campo "Description (alt)"
 * da foto no Cloudinary (se estiver vazio, usa o "Title (caption)").
 */
const CLOUD = 'qmbdp1gb';
const GT = [['escola', 'Escola'], ['alunos', 'Estudantes'], ['eventos', 'Eventos']];

/** Lista de jogos: [nome, texto do ícone]. */
const GM = [
  ['Quiz do Saber', 'QS'],
  ['Corrida Numérica', '123'],
  ['Caça-Palavras', 'CP'],
  ['Memória Naves', 'MN'],
  ['Cobrinha Escolar', 'S'],
  ['Forca Escolar', 'F']
];

/** Formas (clip-path) dos ícones dos jogos, na mesma ordem de GM. */
const CP = [
  'polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%)',
  'circle(50%)',
  'inset(0 round 22px)',
  'polygon(50% 0,100% 50%,50% 100%,0 50%)',
  'polygon(0 0,100% 0,100% 60%,50% 100%,0 60%)',
  'inset(0)'
];


/* ==========================================================================
   3. FILTRO DE PALAVRAS OFENSIVAS (fórum)
   ========================================================================== */

/**
 * Normaliza um texto para comparação:
 * minúsculas, sem acentos, troca leet (@4->a, 3->e, 1!|->i, 0->o, $5->s),
 * remove letras repetidas e símbolos.
 */
const N = t => t.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[@4]/g, 'a')
  .replace(/3/g, 'e')
  .replace(/[1!|]/g, 'i')
  .replace(/0/g, 'o')
  .replace(/[$5]/g, 's')
  .replace(/(.)\1+/g, '$1')
  .replace(/[^a-z]+/g, ' ')
  .trim();

/** Palavras proibidas (já normalizadas). */
const BW = ('porra caralho merda puta putaria fdp viado veado bicha buceta cuzao ' +
  'arrombado babaca retardado mongol crioulo nazista imbecil otario vagabunda piranha')
  .split(' ').map(N);

/** Frases proibidas (já normalizadas). */
const BP = [
  'se mata', 'vou te matar', 'morte aos', 'negro sujo', 'preto sujo',
  'volta pra africa', 'odeio negros', 'odeio gays', 'odeio judeus'
].map(N);

/** Retorna true se o texto contém palavra ou frase proibida. */
const bad = t => {
  const s = N(t), w = s.split(' ');
  return BW.some(b => w.includes(b) || w.includes(b + 's'))
      || BP.some(p => (' ' + s + ' ').includes(' ' + p + ' '));
};


/* ==========================================================================
   4. ESTADO DA APLICAÇÃO (S) E PERSISTÊNCIA
   ========================================================================== */

/**
 * Cria o estado inicial (dados de exemplo) do mês atual:
 *  us = usuários, uk = usuário logado, p = posts do fórum,
 *  m = cardápios por dia, e = eventos por dia, g = fotos da galeria.
 */
function seed() {
  const y = T.getFullYear(), m = T.getMonth();
  const n = new Date(y, m + 1, 0).getDate();           // total de dias do mês
  const s = { us: {}, uk: null, p: [], m: {}, e: {}, g: [] };

  // Cardápio de segunda a sexta, em rodízio
  for (let d = 1; d <= n; d++) {
    const w = new Date(y, m, d).getDay();
    if (w > 0 && w < 6) s.m[K(y, m, d)] = ME[d % 5];
  }

  // Helper local: adiciona um evento (t = título, k = tipo) no dia d
  const E = (d, t, k) => {
    const x = K(y, m, d);
    (s.e[x] = s.e[x] || []).push({ t, k });
  };
  E(9,  'Abertura das Interclasses', 'int');
  E(10, 'Jogos das Interclasses', 'int');
  E(11, 'Final das Interclasses', 'int');
  E(13, 'Dia do cachorro-quente', 'esp');
  E(17, 'Trote solidário dos calouros', 'trote');
  E(24, 'Feira de Ciências', 'ev');
  E(26, 'Pizza da turma', 'esp');

  // Posts de exemplo no fórum
  s.p = [
    {
      n: 'Direção', adm: 1, tags: [],
      t: 'Bem-vindos ao fórum do Souza Naves! Aqui vale o respeito: ofensas e discurso de ódio são bloqueados automaticamente.',
      d: Date.now() - 864e5, l: 12
    },
    {
      n: 'Marina R.', vip: 1, tags: ['len'],
      t: 'Quem vai jogar o Quiz do Saber na quinta? Quero montar um time!',
      d: Date.now() - 18e6, l: 5
    },
    {
      n: 'Pedro H.', tags: ['cra'],
      t: 'O cardápio de hoje está muito bom. Quero repetir!',
      d: Date.now() - 36e5, l: 2
    }
  ];
  return s;
}

/** Carrega o estado salvo no navegador ("sn3") ou cria um novo com seed(). */
let S;
try { S = JSON.parse(localStorage.getItem('sn3')); } catch (e) {}
S = S || seed();

/** Salva o estado no localStorage; avisa se a memória do navegador estiver cheia. */
const sv = () => {
  try {
    localStorage.setItem('sn3', JSON.stringify(S));
  } catch (e) {
    toast('Memória do navegador cheia: a imagem não foi salva.');
  }
};

/** Retorna o usuário logado (ou undefined/null se ninguém estiver logado). */
const me = () => S.uk && S.us[S.uk];


/* ==========================================================================
   5. VARIÁVEIS DE CONTROLE DA INTERFACE
   ========================================================================== */

let cur = 'home';             // tela (view) atual
let busy = 0;                 // 1 enquanto uma transição de tela está rodando
let PG = null;                // GIF (base64) anexado ao post que está sendo escrito
let gk = 't';                 // filtro da galeria: 't' = todas ou o nome de uma tag (escola, alunos, eventos)
let GP = { list: [], at: 0, busy: 0, err: 0 };   // fotos do Cloudinary (lista, hora da busca, carregando, erro)
let cy = T.getFullYear();     // ano exibido no calendário
let cm = T.getMonth();        // mês exibido no calendário
let sel = TK;                 // dia selecionado no calendário


/* ==========================================================================
   6. COMPONENTES DE UI REUTILIZÁVEIS (toast, modal, avatar, chips...)
   ========================================================================== */

/** Mostra uma mensagem temporária (toast) por ~2,8 segundos. */
let tt;
const toast = m => {
  const t = $('#ts');
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('on'), 2800);
};

/** Abre o modal com o HTML informado. */
const modal = h => {
  $('#mb').innerHTML = h;
  $('#md').classList.add('on');
};

/** Fecha o modal. */
const close = () => $('#md').classList.remove('on');

/** Gera os selos (ADM, VIP e tags de nível) de um usuário. */
const chips = u =>
  (u.adm ? '<b class="tg adm">ADM</b>' : '') +
  (u.vip ? '<b class="tg vip">★ VIP</b>' : '') +
  (u.tags || []).map(t => `<b class="tg" style="--c:${TG[t][1]}">${TG[t][0]}</b>`).join('');

/** Gera o avatar: foto (se existir) ou a inicial do nome; borda especial se VIP. */
const av = u =>
  `<i class="av${u.vip ? ' vp' : ''}"${u.av ? ` style="background-image:url('${u.av}')"` : ''}>` +
  `${u.av ? '' : esc(u.n[0] || '?')}</i>`;

/** Converte "prato1;prato2" em uma lista <ul><li>...</li></ul>. */
const lines = m => `<ul>${m.split(';').map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;

/** Painel do administrador: editar cardápio do dia e adicionar eventos. */
const adm = () => {
  const options = Object.keys(KL)
    .map(k => `<option value="${k}">${KL[k]}</option>`).join('');
  return `<div class="cmp" style="margin-top:18px"><strong>Painel do administrador</strong>` +
    `<input type="text" id="am" value="${esc(S.m[sel] || '')}" placeholder="Cardápio: separe os pratos com ;">` +
    `<button class="btn" data-a="sm">Salvar cardápio</button>` +
    `<select id="ak">${options}</select>` +
    `<input type="text" id="at" placeholder="Nome do evento">` +
    `<button class="btn" data-a="se">Adicionar ao calendário</button></div>`;
};

/** Atualiza a área da conta (topo): botão "Entrar" ou perfil + "Sair". */
function acct() {
  const u = me();
  $('#ac').innerHTML = u
    ? `<button data-a="profile" class="hd" style="color:#fff">${av(u)}<span>${esc(u.n)}</span>${chips(u)}</button>` +
      `<button class="btn w" data-a="logout">Sair</button>`
    : `<button class="btn w" data-a="login">Entrar com Google</button>`;
}


/* ==========================================================================
   7. NAVEGAÇÃO ENTRE TELAS
   ========================================================================== */

/**
 * Exibe uma tela imediatamente: ativa a seção e o botão do menu correspondentes
 * e chama o renderizador da tela (R[v]).
 */
function show(v) {
  cur = v;
  document.querySelectorAll('.v').forEach(s => s.classList.toggle('on', s.id == v));
  document.querySelectorAll('nav button').forEach(b => {
    const active = b.dataset.v == v;
    b.classList.toggle('on', active);
    if (active) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  R[v]();
}

/**
 * Navega para outra tela com animação de saída/entrada (170 ms).
 * Ignora o clique se já houver transição em andamento ou se for a mesma tela.
 */
function go(v) {
  if (busy || v == cur) return;
  busy = 1;

  const current = document.getElementById(cur);
  current?.classList.add('leaving');

  setTimeout(() => {
    current?.classList.remove('leaving');
    show(v);

    // Animação de entrada da nova tela (2 frames para o CSS aplicar a transição)
    const next = document.querySelector('.v.on');
    next?.classList.add('entering');
    requestAnimationFrame(() => requestAnimationFrame(() => next?.classList.remove('entering')));

    // Volta ao topo ao ir para a home (sem animação se o usuário preferir menos movimento)
    if (v == 'home') {
      scrollTo({
        top: 0,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    }
    busy = 0;
  }, 170);
}


/* ==========================================================================
   8. RENDERIZADORES DE CADA TELA (objeto R)
   Cada função monta o HTML da sua tela. A chave deve ser igual ao id da <section>.
   ========================================================================== */

/**
 * Busca no Cloudinary a lista de fotos de cada tag (GT) e junta tudo em GP.list.
 * Usa o endereço público https://res.cloudinary.com/<cloud>/image/list/<tag>.json
 * (precisa estar liberado no painel: Settings > Security > "Resource list").
 */
function loadGal() {
  GP.busy = 1;
  return Promise.all(GT.map(([tag]) =>
    fetch(`https://res.cloudinary.com/${CLOUD}/image/list/${tag}.json`)
      .then(r => { if (!r.ok) throw 0; return r.json(); })
      .then(j => (j.resources || []).map(r => [tag, r]))
      .catch(() => null)
  )).then(parts => {
    const by = {};
    parts.forEach(p => (p || []).forEach(([tag, r]) => {
      const x = by[r.public_id] = by[r.public_id] || { tags: [], d: r.created_at || '' };
      const c = (r.context && (r.context.custom || r.context)) || {};
      const id = r.public_id.split('/').map(encodeURIComponent).join('/');
      x.tags.push(tag);
      x.c = c.alt || c.caption || '';
      x.s = `https://res.cloudinary.com/${CLOUD}/image/upload/c_fill,g_auto,w_800,h_600,f_auto,q_auto/v${r.version}/${id}.${r.format}`.replace(/'/g, '%27');
    }));
    GP.err = parts.some(p => p === null);
    GP.list = Object.values(by).sort((a, b) => b.d.localeCompare(a.d));
    GP.at = Date.now();
  }).finally(() => {
    GP.busy = 0;
    if (cur == 'gal') R.gal();
  });
}

const R = {

  /** HOME: data de hoje, cardápio da cantina e próximo evento. */
  home() {
    $('#hd').textContent = T.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    const m = S.m[TK];                                              // cardápio de hoje
    const nx = Object.keys(S.e).filter(k => k >= TK).sort()[0];    // data do próximo evento
    const e = nx && S.e[nx][0];                                     // primeiro evento desse dia

    const menuHtml = m ? lines(m) : '<p>Sem cardápio publicado para hoje.</p>';
    const nextHtml = e
      ? `<span class="nx">${new Date(nx + 'T12:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}: ${esc(e.t)}</span>`
      : '';

    $('#hb').innerHTML = `<h3>Cantina hoje</h3>${menuHtml}${nextHtml}`;
  },

  /** FÓRUM: caixa de publicação (ou convite para entrar) + lista de posts. */
  forum() {
    const u = me();

    // Caixa de nova publicação (logado) ou aviso de login (deslogado)
    const composer = u
      ? `<div class="cmp"><textarea id="tx" rows="3" maxlength="400" placeholder="Escreva algo para a turma…"></textarea>` +
        `<p class="er" id="er"></p>` +
        `<div class="hd"><label class="btn">GIF<input type="file" accept="image/gif" hidden data-f="gf"></label>` +
        `<span class="nt" id="gn"></span>` +
        `<button class="btn" data-a="send" style="margin-left:auto">Publicar</button></div></div>`
      : `<div class="cmp"><p style="margin:0">Entre com sua conta para participar do fórum.</p>` +
        `<button class="btn" data-a="login">Entrar com Google</button></div>`;

    // Posts: administradores primeiro, depois do mais novo para o mais antigo.
    // Guarda o índice original (i) para as curtidas funcionarem.
    const posts = S.p
      .map((p, i) => [p, i])
      .sort((a, b) => (b[0].adm || 0) - (a[0].adm || 0) || b[0].d - a[0].d)
      .map(([p, i]) =>
        `<article class="po${p.adm ? ' adm' : ''}${p.vip ? ' vip' : ''}">${av(p)}<div>` +
        `<div class="hd"><strong>${esc(p.n)}</strong>${chips(p)}<time>${ago(p.d)}</time></div>` +
        `<p>${esc(p.t)}</p>` +
        `${p.g ? `<img class="gif" src="${p.g}" alt="GIF enviado">` : ''}` +
        `<button class="lk" data-a="like:${i}">♥ ${p.l || 0}</button></div></article>`
      ).join('');

    $('#fb').innerHTML = composer + posts;
  },

  /** JOGOS: grade de botões, um por jogo. */
  games() {
    $('#gg').innerHTML = GM.map((g, i) =>
      `<button class="gm" data-a="game:${i}"><i style="--cp:${CP[i]}">${g[1]}</i>${g[0]}</button>`
    ).join('');
  },

  /** CALENDÁRIO: grade do mês + detalhes do dia selecionado (cardápio e eventos). */
  cal() {
    const u = me();
    const f = new Date(cy, cm, 1).getDay();        // dia da semana em que o mês começa
    const n = new Date(cy, cm + 1, 0).getDate();   // total de dias do mês

    // Cabeçalho dos dias da semana + células vazias antes do dia 1
    let g = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(x => `<b>${x}</b>`).join('')
          + '<i class="d x"></i>'.repeat(f);

    // Uma célula por dia, com pontinhos de eventos e de cardápio publicado
    for (let d = 1; d <= n; d++) {
      const k = K(cy, cm, d), dayEvents = S.e[k] || [];
      g += `<button class="d${k == TK ? ' td' : ''}${k == sel ? ' sl' : ''}" data-a="day:${k}">${d}` +
           `<span class="dots">${dayEvents.map(e => `<s class="k-${e.k}"></s>`).join('')}` +
           `${S.m[k] ? '<s class="mn"></s>' : ''}</span></button>`;
    }

    const ev = S.e[sel] || [];   // eventos do dia selecionado
    const mn = S.m[sel];         // cardápio do dia selecionado

    // Título do mês + botões de navegação
    const header =
      `<div class="mh"><button class="btn" data-a="mo:-1" aria-label="Mês anterior">‹</button>` +
      `<h3 class="cap">${new Date(cy, cm, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>` +
      `<button class="btn" data-a="mo:1" aria-label="Próximo mês">›</button></div>`;

    // Legenda dos tipos de evento
    const legend =
      `<p class="nt" style="margin-top:12px">` +
      Object.keys(KL).map(k => `<span style="margin-right:12px"><s class="dt2 k-${k}"></s> ${KL[k]}</span>`).join('') +
      `<span>▢ Cardápio publicado</span></p>`;

    // Lista de eventos do dia (botão "×" de remover só para administradores)
    const eventList = ev.map((e, i) =>
      `<li><s class="dt2 k-${e.k}"></s> <b>${KL[e.k]}:</b> ${esc(e.t)}` +
      `${u && u.adm ? ` <button data-a="del:${i}" aria-label="Remover evento">×</button>` : ''}</li>`
    ).join('') || '<li>Sem eventos neste dia.</li>';

    // Coluna esquerda: calendário
    const left = `<div>${header}<div class="gr">${g}</div>${legend}</div>`;

    // Coluna direita: detalhes do dia
    const right =
      `<div><h3 class="cap">${new Date(sel + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>` +
      `<div class="cb" style="margin-top:16px"><h3>Cantina</h3>` +
      `${mn ? lines(mn) : '<p style="margin:0">Cardápio ainda não publicado.</p>'}</div>` +
      `<ul class="el">${eventList}</ul>${u && u.adm ? adm() : ''}</div>`;

    $('#cl').innerHTML = `<div class="cg">${left}${right}</div>`;
  },

  /** GALERIA: fotos do Cloudinary filtradas pela tag escolhida. */
  gal() {
    // Busca de novo se a lista tiver mais de 1 minuto (o Cloudinary guarda cache de 60 s)
    if (!GP.busy && Date.now() - GP.at > 6e4) loadGal();

    const all = GP.list.filter(x => gk == 't' || x.tags.includes(gk));
    const msg = t => `<p class="nt" style="grid-column:1/-1">${t}</p>`;

    // Figuras com leve rotação alternada
    $('#gb').innerHTML = all.length
      ? all.map((x, i) =>
          `<figure style="--r:${[-2.5, 1.8, -1, 2.6][i % 4]}deg">` +
          `<div class="pt" style="background-image:url('${x.s}')" role="img" aria-label="${esc(x.c || 'Foto da galeria')}"></div>` +
          `<figcaption>${esc(x.c)}</figcaption></figure>`
        ).join('')
      : msg(GP.busy && !GP.at ? 'Carregando fotos…'
          : GP.err && !GP.list.length ? 'Não foi possível carregar as fotos agora. Tente de novo em instantes.'
          : 'Nenhuma foto nesta categoria ainda.');

    // Marca o botão de filtro ativo
    document.querySelectorAll('.tb>button').forEach(b =>
      b.classList.toggle('on', b.dataset.a == 'flt:' + gk));
  },

  /** LOJA: oferta VIP e cartões das tags de nível. */
  shop() {
    const u = me();

    // Bloco da oferta VIP
    const vipHtml =
      `<div class="vp2"><div><h2>Seja VIP</h2><p>Brilhe no fórum e no seu perfil.</p>` +
      `<ul><li>Moldura dourada animada nas suas mensagens</li>` +
      `<li>Foto de perfil animada (GIF)</li>` +
      `<li>Selo ★ VIP ao lado do seu nome</li></ul></div>` +
      `<div style="align-self:end"><p class="pr" style="font-size:44px">R$ 19,90` +
      `<small style="font:16px 'Atkinson Hyperlegible',sans-serif"> /mês</small></p>` +
      `<button class="btn w" data-a="buy:vip" style="margin-top:12px">${u && u.vip ? 'Você já é VIP ★' : 'Quero ser VIP'}</button></div></div>`;

    // Cartões das tags (botão muda se o usuário já possui a tag)
    const tagsHtml = Object.entries(TG).map(([k, t]) =>
      `<div class="tc"><b class="tg" style="--c:${t[1]}">${t[0]}</b>` +
      `<span class="pr">${brl(t[2])}</span>` +
      `<button class="btn" data-a="buy:${k}">${u && u.tags.includes(k) ? 'Você tem' : 'Comprar tag'}</button></div>`
    ).join('');

    $('#sb').innerHTML = `${vipHtml}<div class="tgs">${tagsHtml}</div>`;
  }
};


/* ==========================================================================
   9. AÇÕES DOS BOTÕES (objeto A)
   Cada chave corresponde a um valor de data-a="acao" ou data-a="acao:parametro".
   O parâmetro (p) chega como texto. Ver o listener de clique na seção 11.
   ========================================================================== */

const A = {

  /** Abre o modal de login (demonstração local, sem validação real). */
  login() {
    modal(
      `<h3>Entrar</h3>` +
      `<input type="text" id="ln" placeholder="Seu nome (aparece no fórum)" maxlength="24">` +
      `<label><input type="checkbox" id="la"> Modo administrador de demonstração</label>` +
      `<p class="nt">Este protótipo não valida identidades: não use este modo em um site publicado.</p>` +
      `<button class="gg" data-a="gl"><b style="color:#4285f4;font:700 22px Arial">G</b> Continuar com Google</button>` +
      `<p class="nt">Demonstração local: nenhuma conta Google é conectada.</p>`
    );
  },

  /** Confirma o login: cria/reutiliza o usuário pelo nome e define se é admin. */
  gl() {
    const n = $('#ln').value.trim() || 'Aluno', k = n.toLowerCase();
    S.us[k] = S.us[k] || { n, tags: [], vip: 0, av: null };
    S.us[k].adm = $('#la').checked ? 1 : 0;
    S.uk = k;
    sv(); close(); acct(); R[cur]();
    toast('Bem-vindo, ' + n + '!');
  },

  /** Sai da conta e recarrega a tela atual. */
  logout() {
    S.uk = null;
    sv(); close(); acct(); R[cur]();
    toast('Você saiu da conta.');
  },

  /** Abre o modal de perfil (trocar foto, ver selos, sair). */
  profile() {
    const u = me();
    modal(
      `<h3>${esc(u.n)}</h3>` +
      `<div class="hd">${av(u)}${chips(u)}</div>` +
      `<label class="btn">Trocar foto<input type="file" accept="image/*" hidden data-f="av"></label>` +
      `<p class="nt">${u.vip ? 'Seu perfil aceita GIFs animados.' : 'Foto animada (GIF) é benefício VIP. Veja na Loja.'}</p>` +
      `<button class="btn" data-a="logout">Sair da conta</button>`
    );
  },

  /** Publica um post no fórum (bloqueia ofensas e aceita GIF anexado em PG). */
  send() {
    const u = me(), t = $('#tx').value.trim();
    if (!t && !PG) return;   // nada para publicar
    if (bad(t)) {
      $('#er').textContent = 'Mensagem bloqueada: o fórum não permite ofensas nem discurso de ódio. Reescreva com respeito.';
      return;
    }
    S.p.push({ n: u.n, av: u.av, adm: u.adm, vip: u.vip, tags: u.tags, t, g: PG, d: Date.now(), l: 0 });
    PG = null;
    sv(); R.forum();
    toast('Publicado!');
  },

  /** Curte o post de índice i. */
  like(i) {
    S.p[i].l = (S.p[i].l || 0) + 1;
    sv(); R.forum();
  },

  /** Seleciona um dia (chave "AAAA-MM-DD") no calendário. */
  day(k) {
    sel = k;
    R.cal();
  },

  /** Muda o mês do calendário (d = -1 ou 1), ajustando o ano se necessário. */
  mo(d) {
    cm += +d;
    if (cm > 11) { cm = 0; cy++; }
    if (cm < 0) { cm = 11; cy--; }
    sel = K(cy, cm, 1);
    R.cal();
  },

  /** (Admin) Salva o cardápio do dia selecionado; vazio remove o cardápio. */
  sm() {
    const v = $('#am').value.trim();
    if (v) S.m[sel] = v;
    else delete S.m[sel];
    sv(); R.cal();
    toast('Cardápio salvo!');
  },

  /** (Admin) Adiciona um evento ao dia selecionado. */
  se() {
    const t = $('#at').value.trim();
    if (!t) return;
    (S.e[sel] = S.e[sel] || []).push({ t, k: $('#ak').value });
    sv(); R.cal();
    toast('Evento adicionado!');
  },

  /** (Admin) Remove o evento de índice i do dia selecionado. */
  del(i) {
    S.e[sel].splice(i, 1);
    sv(); R.cal();
  },

  /** Filtra a galeria por tag ('t' = todas, 'escola', 'alunos' ou 'eventos'). */
  flt(k) {
    gk = k;
    R.gal();
  },

  /** Abre um jogo (ainda é só um aviso de demonstração). */
  game(i) {
    toast('Aqui abre o jogo “' + GM[i][0] + '”.');
  },

  /** Abre o modal de compra (VIP ou tag k). Exige login e impede compra repetida. */
  buy(k) {
    const u = me();
    if (!u) return A.login();

    const v = k == 'vip';
    const t = v ? ['VIP', '', 19.9] : TG[k];   // [nome, cor, preço]
    if (v ? u.vip : u.tags.includes(k)) return toast('Você já tem este item.');

    modal(
      `<h3>${v ? 'Plano VIP' : 'Tag ' + t[0]}</h3>` +
      `<p class="pr">${brl(t[2])}</p>` +
      `<p class="nt">Simulação: no site oficial entra aqui o pagamento por Pix ou cartão. Nenhum valor é cobrado.</p>` +
      `<button class="btn" data-a="pay:${k}">Confirmar pagamento de teste</button>`
    );
  },

  /** Conclui a compra de teste: ativa o VIP ou adiciona a tag ao usuário. */
  pay(k) {
    const u = me();
    if (k == 'vip') u.vip = 1;
    else u.tags.push(k);
    sv(); close(); acct(); R.shop();
    toast('Compra concluída!');
  }
};


/* ==========================================================================
   10. LEITURA DE ARQUIVOS ENVIADOS
   ========================================================================== */

/**
 * Lê uma imagem/GIF enviada (f) e trata conforme o tipo (k):
 *   'av' = foto de perfil (GIF só para VIP, máx. 400 KB)
 *   'gf' = GIF anexado ao post do fórum (máx. 400 KB)
 *   'ph' = foto da galeria, só admin (máx. 2 MB)
 */
function rd(f, k) {
  const u = me(), ph = k == 'ph';

  if (k == 'av' && f.type == 'image/gif' && !u.vip) return toast('GIF no perfil é benefício VIP.');
  if (f.size > (ph ? 2e6 : 4e5)) return toast('Imagem grande demais (máximo ' + (ph ? '2 MB' : '400 KB') + ').');

  const r = new FileReader();
  r.onload = () => {
    const d = r.result;   // imagem em base64 (data URL)
    if (k == 'av') {
      u.av = d;
      sv(); acct(); close();
      toast('Foto atualizada!');
    } else if (k == 'gf') {
      PG = d;
      $('#gn').textContent = 'GIF anexado: ' + f.name;
    } else {
      S.g.push({ y: 'Novo', c: 'Foto nova', k: gk == 'p' ? 'p' : 'h', s: d });
      sv(); R.gal();
    }
  };
  r.readAsDataURL(f);
}


/* ==========================================================================
   11. EVENTOS GLOBAIS E INICIALIZAÇÃO
   ========================================================================== */

/**
 * Clique global (delegação de eventos):
 *  - [data-v]: navegação (a tela "games" abre jogos.html)
 *  - [data-a]: chama A[acao](parametro)
 */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-v],[data-a]');
  if (!b) return;

  if (b.dataset.v) {
    e.preventDefault();
    if (b.dataset.v == 'games') { location.href = 'jogos.html'; return; }
    return go(b.dataset.v);
  }

  const [a, p] = b.dataset.a.split(':');
  A[a] && A[a](p);
});

/** Upload de arquivo: qualquer <input type="file" data-f="..."> chama rd(). */
document.addEventListener('change', e => {
  const f = e.target.files && e.target.files[0];
  f && e.target.dataset.f && rd(f, e.target.dataset.f);
});

/** Fecha o modal ao clicar no fundo (#md) ou em um elemento com a classe "x". */
$('#md').addEventListener('click', e => {
  if (e.target.id == 'md' || e.target.classList.contains('x')) close();
});

/** Fecha o modal com a tecla Esc. */
addEventListener('keydown', e => e.key == 'Escape' && close());

/** Inicialização: desenha a área da conta e abre a tela inicial. */
acct();
show('home');


/* ==========================================================================
   12. MICROINTERAÇÕES VISUAIS
   ========================================================================== */

/**
 * Letreiro (.hero): acompanha a posição do cursor via variáveis CSS
 * --pointer-x e --pointer-y. Desligado se o usuário preferir movimento reduzido.
 */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--pointer-x', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    hero.style.setProperty('--pointer-y', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  });
})();

/**
 * Efeito de inclinação (tilt) nos cartões .dr, .gm, .tc e .cb via variáveis CSS
 * --tilt-x e --tilt-y. Só ativa com mouse (hover/ponteiro fino) e sem
 * preferência por movimento reduzido. Zera a inclinação ao sair do cartão.
 */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.dr,.gm,.tc,.cb').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--tilt-x', (((e.clientX - r.left) / r.width) - .5) * 4 + 'deg');
      card.style.setProperty('--tilt-y', (.5 - (e.clientY - r.top) / r.height) * 4 + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
})();

/**
 * Clique em elementos [data-burst] chama burst(elemento).
 * ⚠️ A função burst() NÃO está definida neste arquivo (veja o aviso na resposta).
 */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-burst]');
  if (b) burst(b);
});