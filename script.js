/* ==========================================================================
   TDS — script principal (versão completa, organizada e comentada)
   Estrutura:
     1. Utilitários básicos
     2. Dados fixos
     3. (removido: filtro do fórum antigo)
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

/* 1. UTILITÁRIOS BÁSICOS */

const $ = s => document.querySelector(s);

const esc = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

const pad = n => String(n).padStart(2, '0');
const K = (y, m, d) => y + '-' + pad(m + 1) + '-' + pad(d);
const T = new Date();
const TK = K(T.getFullYear(), T.getMonth(), T.getDate());

/* 2. DADOS FIXOS */

const TG = {
  cal: ['Calouro', '#1f9d63', 4.9],
  ver: ['Veterano', '#d9363e', 7.9],
  cra: ['Craque', '#7a4cf0', 9.9],
  mes: ['Mestre', '#e07b00', 12.9],
  len: ['Lenda', '#0091a8', 14.9]
};

const KL = {
  int: 'Interclasse',
  trote: 'Trote',
  esp: 'Refeição especial',
  ev: 'Evento'
};

const ME = [
  'Arroz, feijão e frango grelhado;Salada de alface e tomate;Suco de laranja',
  'Macarrão ao molho;Carne moída;Suco de uva',
  'Arroz, feijão e omelete;Purê de batata;Suco de maracujá',
  'Strogonoff de frango;Arroz e batata palha;Suco de limão',
  'Pão com queijo;Bolo de cenoura;Leite com achocolatado'
];

/* PLANILHA GOOGLE SHEETS */

const CANTINA_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRlYhUUn-Kgmi24Rq4qBwigsSWwU5raEB9rmg41pHCXEFIFYwp2pOjtz3-DBfseMAlixq_15PszZov-/pub?output=csv';

const CLOUD = 'qmbdp1gb';

/* FÓRUM (Flarum) */

const FORUM_URL = 'https://souza.freeflarum.com/';

const GT = [
  ['escola', 'Escola'],
  ['eventos', 'Eventos']
];

const GM = [
  ['Quiz do Saber', 'QS'],
  ['Corrida Numérica', '123'],
  ['Caça-Palavras', 'CP'],
  ['Memória TDS', 'MN'],
  ['Cobrinha Escolar', 'S'],
  ['Forca Escolar', 'F']
];

const CP = [
  'polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%)',
  'circle(50%)',
  'inset(0 round 22px)',
  'polygon(50% 0,100% 50%,50% 100%,0 50%)',
  'polygon(0 0,100% 0,100% 60%,50% 100%,0 60%)',
  'inset(0)'
];

/* 4. ESTADO DA APLICAÇÃO */

function seed() {
  const y = T.getFullYear(), m = T.getMonth();
  const n = new Date(y, m + 1, 0).getDate();
  const s = { us: {}, uk: null, m: {}, e: {}, g: [] };

  for (let d = 1; d <= n; d++) {
    const w = new Date(y, m, d).getDay();
    if (w > 0 && w < 6) s.m[K(y, m, d)] = ME[d % 5];
  }

  const E = (d, t, k) => {
    const x = K(y, m, d);
    (s.e[x] = s.e[x] || []).push({ t, k });
  };

  E(9, 'Abertura das Interclasses', 'int');
  E(10, 'Jogos das Interclasses', 'int');
  E(11, 'Final das Interclasses', 'int');
  E(13, 'Dia do cachorro-quente', 'esp');
  E(17, 'Trote solidário dos calouros', 'trote');
  E(24, 'Feira de Ciências', 'ev');
  E(26, 'Pizza da turma', 'esp');

  return s;
}

let S;

try {
  S = JSON.parse(localStorage.getItem('sn3'));
} catch (e) {}

S = S || seed();
delete S.p; // apaga os posts do fórum antigo que ficaram salvos no navegador

const sv = () => {
  try {
    localStorage.setItem('sn3', JSON.stringify(S));
  } catch (e) {
    toast('Memória do navegador cheia: a imagem não foi salva.');
  }
};

const me = () => S.uk && S.us[S.uk];

/* 5. VARIÁVEIS DE CONTROLE */

let cur = 'home';
let busy = 0;
let gk = 't';
let GP = { list: [], at: 0, busy: 0, err: 0 };
let cy = T.getFullYear();
let cm = T.getMonth();
let sel = TK;

/* 6. COMPONENTES DE INTERFACE */

let tt;

const toast = m => {
  const t = $('#ts');
  t.textContent = m;
  t.classList.add('on');

  clearTimeout(tt);

  tt = setTimeout(() => {
    t.classList.remove('on');
  }, 2800);
};

const modal = h => {
  $('#mb').innerHTML = h;
  $('#md').classList.add('on');
};

const close = () => $('#md').classList.remove('on');

const chips = u =>
  (u.adm ? '<b class="tg adm">ADM</b>' : '') +
  (u.vip ? '<b class="tg vip">★ VIP</b>' : '') +
  (u.tags || []).map(t =>
    `<b class="tg" style="--c:${TG[t][1]}">${TG[t][0]}</b>`
  ).join('');

const av = u =>
  `<i class="av${u.vip ? ' vp' : ''}"${u.av ? ` style="background-image:url('${u.av}')"` : ''}>` +
  `${u.av ? '' : esc(u.n[0] || '?')}</i>`;

const lines = m =>
  `<ul>${m.split(';').map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;

/* PAINEL DO ADMINISTRADOR */

const adm = () => {
  const options = Object.keys(KL)
    .map(k => `<option value="${k}">${KL[k]}</option>`)
    .join('');

  return `<div class="cmp" style="margin-top:18px">
    <strong>Painel do administrador</strong>
    <input type="text" id="am" value="${esc(S.m[sel] || '')}" placeholder="Cardápio: separe os pratos com ;">
    <button class="btn" data-a="sm">Salvar cardápio</button>
    <select id="ak">${options}</select>
    <input type="text" id="at" placeholder="Nome do evento">
    <button class="btn" data-a="se">Adicionar ao calendário</button>
  </div>`;
};

/* ÁREA DA CONTA */

function acct() {
  const u = me();

  $('#ac').innerHTML = u
    ? `<button data-a="profile" class="hd" style="color:#fff">
        ${av(u)}
        <span>${esc(u.n)}</span>
        ${chips(u)}
      </button>
      <button class="btn w" data-a="logout">Sair</button>`
    : '';
}

/* 7. NAVEGAÇÃO ENTRE TELAS */

function show(v) {
  cur = v;

  document.querySelectorAll('.v').forEach(s => {
    s.classList.toggle('on', s.id == v);
  });

  document.querySelectorAll('nav button').forEach(b => {
    const active = b.dataset.v == v;
    b.classList.toggle('on', active);

    if (active) {
      b.setAttribute('aria-current', 'page');
    } else {
      b.removeAttribute('aria-current');
    }
  });

  R[v]();
}

function go(v) {
  if (busy || v == cur) return;

  busy = 1;

  const current = document.getElementById(cur);
  current?.classList.add('leaving');

  setTimeout(() => {
    current?.classList.remove('leaving');

    show(v);

    const next = document.querySelector('.v.on');
    next?.classList.add('entering');

    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        next?.classList.remove('entering')
      )
    );

    if (v == 'home') {
      scrollTo({
        top: 0,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth'
      });
    }

    busy = 0;
  }, 170);
}

/* 8. LEITURA DA PLANILHA GOOGLE SHEETS */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      row.push(cell.trim());
      cell = '';
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i++;

      row.push(cell.trim());

      if (row.some(v => v !== '')) {
        rows.push(row);
      }

      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }

  row.push(cell.trim());

  if (row.some(v => v !== '')) {
    rows.push(row);
  }

  return rows;
}



async function loadCantina() {
  const urlBase = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRlYhUUn-Kgmi24Rq4qBwigsSWwU5raEB9rmg41pHCXEFIFYwp2pOjtz3-DBfseMAlixq_15PszZov-/pub?output=csv';

  const urlPlanilha = urlBase + '&t=' + new Date().getTime();

  Papa.parse(urlPlanilha, {
    download: true,
    header: false,
    skipEmptyLines: true,

    complete: function(results) {
      const rows = results.data;
      let alimentosEncontrados = [];
      let colunaAlimentosIndex = -1;

      // 1. Procura onde está a palavra "Alimentos"
      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[i].length; j++) {
          if (
            rows[i][j] &&
            rows[i][j].trim().toLowerCase() === 'alimentos'
          ) {
            colunaAlimentosIndex = j;

            // 2. Pega tudo abaixo na mesma coluna
            for (let k = i + 1; k < rows.length; k++) {
              let valor = rows[k][colunaAlimentosIndex];

              if (valor && valor.trim() !== '') {
                let textoLimpo = valor.trim();

                // Ignora exemplos escritos como ALIMENTO X
                if (!textoLimpo.toUpperCase().startsWith('ALIMENTO')) {
                  alimentosEncontrados.push(textoLimpo);
                }
              }
            }

            break;
          }
        }

        if (colunaAlimentosIndex !== -1) break;
      }

      // 3. Remove alimentos repetidos
      alimentosEncontrados = [...new Set(alimentosEncontrados)];

      // 4. Salva o cardápio de hoje
      const menu = alimentosEncontrados.join(';');

      if (menu) {
        S.m[TK] = menu;
      } else {
        delete S.m[TK];
      }

      sv();

      // 5. Atualiza a prévia da página inicial
      if ($('#hb')) {
        R.home();
      }

      // 6. Atualiza a cantina e o calendário
      if (cur === 'cal') {
        R.cal();
      }

      console.log('Alimentos encontrados:', alimentosEncontrados);
    },

    error: function(erro) {
      console.error('Erro ao ler planilha:', erro);

      if ($('#hb')) {
        $('#hb').innerHTML =
          '<h3>Cantina hoje</h3><p>Erro ao carregar o cardápio.</p>';
      }
    }
  });
}



const R = {
  home() {
    $('#hd').textContent = T.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const m = S.m[TK];
    const nx = Object.keys(S.e).filter(k => k >= TK).sort()[0];
    const e = nx && S.e[nx][0];

    const menuHtml = m ? lines(m) : '<p>Sem cardápio publicado para hoje.</p>';
    const nextHtml = e
      ? `<span class="nx">${new Date(nx + 'T12:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}: ${esc(e.t)}</span>`
      : '';

    $('#hb').innerHTML = `<h3>Cantina hoje</h3>${menuHtml}${nextHtml}`;
  },

  games() {
    $('#gg').innerHTML = GM.map((g, i) =>
      `<button class="gm" data-a="game:${i}"><i style="--cp:${CP[i]}">${g[1]}</i>${g[0]}</button>`
    ).join('');
  },

  
cal() {
    const u = me();
    const f = new Date(cy, cm, 1).getDay();
    const n = new Date(cy, cm + 1, 0).getDate();

    let g = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(x => `<b>${x}</b>`).join('')
          + '<i class="d x"></i>'.repeat(f);

    for (let d = 1; d <= n; d++) {
      const k = K(cy, cm, d), dayEvents = S.e[k] || [];

      g += `<button class="d${k == TK ? ' td' : ''}${k == sel ? ' sl' : ''}" data-a="day:${k}">${d}` +
           `<span class="dots">${dayEvents.map(e => `<s class="k-${e.k}"></s>`).join('')}` +
           `${S.m[k] ? '<s class="mn"></s>' : ''}</span></button>`;
    }

    const ev = S.e[sel] || [];
    const mn = S.m[sel];

    const header =
      `<div class="mh"><button class="btn" data-a="mo:-1">‹</button>` +
      `<h3 class="cap">${new Date(cy, cm, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>` +
      `<button class="btn" data-a="mo:1">›</button></div>`;

    const legend =
      `<p class="nt" style="margin-top:12px">` +
      Object.keys(KL).map(k => `<span style="margin-right:12px"><s class="dt2 k-${k}"></s> ${KL[k]}</span>`).join('') +
      `<span>▢ Cardápio publicado</span></p>`;

    const eventList = ev.map((e, i) =>
      `<li><s class="dt2 k-${e.k}"></s> <b>${KL[e.k]}:</b> ${esc(e.t)}` +
      `${u && u.adm ? ` <button data-a="del:${i}">×</button>` : ''}</li>`
    ).join('') || '<li>Sem eventos neste dia.</li>';

    const left = `<div>${header}<div class="gr">${g}</div>${legend}</div>`;

    const right =
      `<div><h3 class="cap">${new Date(sel + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>` +
      `<div class="cb" style="margin-top:16px"><h3>Cantina</h3>` +
      `${mn ? lines(mn) : '<p style="margin:0">Cardápio ainda não publicado.</p>'}</div>` +
      `<ul class="el">${eventList}</ul></div>`;

    $('#cl').innerHTML = `<div class="cg">${left}${right}</div>`;
  },


  gal() {
    if (!GP.busy && Date.now() - GP.at > 6e4) loadGal();

    const all = GP.list.filter(x => gk == 't' || x.tags.includes(gk));
    const msg = t => `<p class="nt" style="grid-column:1/-1">${t}</p>`;

    $('#gb').innerHTML = all.length
      ? all.map((x, i) =>
          `<figure style="--r:${[-2.5, 1.8, -1, 2.6][i % 4]}deg">` +
          `<div class="pt" style="background-image:url('${x.s}')" role="img" aria-label="${esc(x.c || 'Foto da galeria')}"></div>` +
          `<figcaption>${esc(x.c)}</figcaption></figure>`
        ).join('')
      : msg(GP.busy && !GP.at ? 'Carregando fotos…'
          : GP.err && !GP.list.length ? 'Não foi possível carregar as fotos agora.'
          : 'Nenhuma foto nesta categoria ainda.');

    document.querySelectorAll('.tb>button').forEach(b =>
      b.classList.toggle('on', b.dataset.a == 'flt:' + gk));
  }
};

// Carrega as fotos da galeria no Cloudinary, uma lista por tag (escola, eventos).
// Requer que a lista por tag esteja liberada na conta do Cloudinary
// (Settings > Security > "Resource list" desmarcado em "Restricted media types").
function loadGal() {
  GP.busy = 1;
  GP.err = 0;

  Promise.all(GT.map(([tag]) =>
    fetch(`https://res.cloudinary.com/${CLOUD}/image/list/${tag}.json`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(d => (d.resources || []).map(r => ({ tag, r })))
      .catch(() => null)
  )).then(results => {
    const fotos = new Map();
    let ok = 0;

    results.forEach(items => {
      if (!items) return;
      ok++;
      items.forEach(({ tag, r }) => {
        const f = fotos.get(r.public_id) || {
          id: r.public_id,
          t: r.created_at || '',
          c: (r.context && r.context.custom && (r.context.custom.caption || r.context.custom.alt)) || '',
          s: `https://res.cloudinary.com/${CLOUD}/image/upload/c_limit,w_900,q_auto,f_auto/v${r.version}/${r.public_id}.${r.format}`,
          tags: []
        };
        f.tags.push(tag);
        fotos.set(r.public_id, f);
      });
    });

    GP.list = [...fotos.values()].sort((a, b) => String(b.t).localeCompare(String(a.t)));
    GP.err = ok ? 0 : 1;
    GP.at = Date.now();
    GP.busy = 0;

    if (cur == 'gal') R.gal();
  });
}
const A = {
  logout() {
    S.uk = null;

    sv();
    close();
    acct();
    R[cur]();

    toast('Você saiu da conta.');
  },

  profile() {
    const u = me();

    modal(
      `<h3>${esc(u.n)}</h3>` +
      `<div class="hd">${av(u)}${chips(u)}</div>` +
      `<label class="btn">Trocar foto<input type="file" accept="image/*" hidden data-f="av"></label>` +
      `<p class="nt">${u.vip ? 'Seu perfil aceita GIFs animados.' : 'Foto animada (GIF) é benefício VIP.'}</p>` +
      `<button class="btn" data-a="logout">Sair da conta</button>`
    );
  },

  day(k) {
    sel = k;
    R.cal();
  },

  mo(d) {
    cm += +d;

    if (cm > 11) {
      cm = 0;
      cy++;
    }

    if (cm < 0) {
      cm = 11;
      cy--;
    }

    sel = K(cy, cm, 1);
    R.cal();
  },

  sm() {
    const v = $('#am').value.trim();

    if (v) S.m[sel] = v;
    else delete S.m[sel];

    sv();
    R.cal();

    toast('Cardápio salvo!');
  },

  se() {
    const t = $('#at').value.trim();

    if (!t) return;

    (S.e[sel] = S.e[sel] || []).push({
      t,
      k: $('#ak').value
    });

    sv();
    R.cal();

    toast('Evento adicionado!');
  },

  del(i) {
    S.e[sel].splice(i, 1);

    sv();
    R.cal();
  },

  flt(k) {
    gk = k;
    R.gal();
  },

  game(i) {
    toast('Aqui abre o jogo “' + GM[i][0] + '”.');
  }
};

function rd(f, k) {
  const u = me();
  const ph = k == 'ph';

  if (k == 'av' && f.type == 'image/gif' && !u.vip) {
    return toast('GIF no perfil é benefício VIP.');
  }

  if (f.size > (ph ? 2e6 : 4e5)) {
    return toast('Imagem grande demais (máximo ' + (ph ? '2 MB' : '400 KB') + ').');
  }

  const r = new FileReader();

  r.onload = () => {
    const d = r.result;

    if (k == 'av') {
      u.av = d;

      sv();
      acct();
      close();

      toast('Foto atualizada!');

    } else {
      S.g.push({
        y: 'Novo',
        c: 'Foto nova',
        k: gk == 'p' ? 'p' : 'h',
        s: d
      });

      sv();
      R.gal();
    }
  };

  r.readAsDataURL(f);
}
/* EVENTOS GLOBAIS */

document.addEventListener('click', e => {
  const b = e.target.closest('[data-v],[data-a]');

  if (!b) return;

  if (b.dataset.v) {
    e.preventDefault();

    if (b.dataset.v == 'games') {
      location.href = 'jogos.html';
      return;
    }

    // O fórum fica fora do site: vai direto para o Flarum.
    if (b.dataset.v == 'forum') {
      window.open(FORUM_URL);
      return;
    }

    return go(b.dataset.v);
  }

  const [a, p] = b.dataset.a.split(':');

  if (A[a]) {
    A[a](p);
  }
});

document.addEventListener('change', e => {
  const f = e.target.files && e.target.files[0];

  if (f && e.target.dataset.f) {
    rd(f, e.target.dataset.f);
  }
});

$('#md').addEventListener('click', e => {
  if (e.target.id == 'md' || e.target.classList.contains('x')) {
    close();
  }
});

addEventListener('keydown', e => {
  if (e.key == 'Escape') {
    close();
  }
});

/* INICIALIZAÇÃO */

acct();
show('home');
loadCantina();

/* MICROINTERAÇÕES VISUAIS */

(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');

  if (!hero) return;

  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();

    hero.style.setProperty(
      '--pointer-x',
      ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'
    );

    hero.style.setProperty(
      '--pointer-y',
      ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%'
    );
  });
})();

(() => {
  if (
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !matchMedia('(hover: hover) and (pointer: fine)').matches
  ) return;

  document.querySelectorAll('.dr,.gm,.tc,.cb').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();

      card.style.setProperty(
        '--tilt-x',
        (((e.clientX - r.left) / r.width) - .5) * 4 + 'deg'
      );

      card.style.setProperty(
        '--tilt-y',
        (.5 - (e.clientY - r.top) / r.height) * 4 + 'deg'
      );
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
})();

/* EFEITO DE CLIQUE */

document.addEventListener('click', e => {
  const b = e.target.closest('[data-burst]');
  if (b) burst(b);
});