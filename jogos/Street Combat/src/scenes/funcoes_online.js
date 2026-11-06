export {abrir_socket} from "./websocket.js";
import {sair_da_sala, fechar_conexao, marcar_sala_em_boss} from "./websocket.js";
import {animacoes_jogador} from "./funcoes.js";

// Trava uma posição (x, y) dentro dos limites físicos do mundo
// (cena.physics.world.bounds, configurado em criar_fundo — ver funcoes.js).
//
// Por que isso é necessário mesmo com setCollideWorldBounds(true) nos sprites:
// esse collide só trava o BODY/sprite na hora que o Phaser roda o passo de
// física. Só que jogadores/inimigos online não se movem só por velocidade —
// eles perseguem um "alvo" (targetX/targetY) que vem do SERVIDOR. Se o
// servidor não validar os limites do mapa, esse alvo pode continuar
// crescendo pra fora do mundo enquanto o sprite fica visualmente preso na
// borda — e quando o jogador/inimigo volta pra dentro do mapa, o sprite fica
// com um atraso estranho até "alcançar" esse alvo que ficou longe demais.
// Clampando o alvo aqui, ele nunca se afasta dos limites de verdade.
export function clampar_no_mundo(cena, x, y, sprite){
    const bounds = cena?.physics?.world?.bounds;
    if(!bounds) return {x, y};

    const meia_largura = sprite?.body?.halfWidth ?? 0;
    const meia_altura = sprite?.body?.halfHeight ?? 0;

    const x_min = bounds.x + meia_largura;
    const x_max = bounds.x + bounds.width - meia_largura;
    const y_min = bounds.y + meia_altura;
    const y_max = bounds.y + bounds.height - meia_altura;

    return {
        x: Phaser.Math.Clamp(x, x_min, x_max),
        y: Phaser.Math.Clamp(y, y_min, y_max)
    };
}

export function html_online(cena){
    // O fundo preto (.fundo_preto) só deve aparecer quando o menu de morte
    // (cena.botoes / #morreu_online) estiver visível — aqui, no início da
    // cena, o jogador ainda tá vivo, então garante que a classe não fica
    // "grudada" no body de uma sessão anterior.
    document.body.classList.remove("fundo_preto");

    //pagina de volta

    cena.pagina = document.getElementById("pagina_inteira");

    //hud de vida

    cena.hud_vida = document.getElementById("hud");
    cena.hud_vida.style.display = "flex";

    //foto do personagem

    let foto = document.getElementById("foto_personagem");

    if(cena.genero === "feminino"){
        foto.style.setProperty("--imagem-personagem",'url("assets/conteudo/cabeca_ramona.png")');
        foto.style.setProperty( "--transform-personagem", "scale(2)");
    }
    else{
        foto.style.setProperty("--imagem-personagem",'url("assets/conteudo/cabeca_scott.png")');
        foto.style.setProperty( "--transform-personagem", "scale(2) scaleX(-1)");
    }

    //pontuacao

    cena.mostrar_pontuacao = document.getElementById("pontos_jogador");
    

    //tela quando morre

    cena.botoes = document.getElementById("morreu_online");

    // "observar_jogador" foi removido de vez do menu de morte — escondemos o
    // elemento (se ele ainda existir no HTML) e nem guardamos referência
    // pra ele, pra não sobrar nenhum jeito de selecionar/confirmar essa opção.
    document.getElementById("observar_jogador")?.style.setProperty("display", "none");

    cena.botao_2 = document.getElementById("configuracoes_morreu_online");
    cena.botao_3 = document.getElementById("voltar_menu_online")

    // o menu só aparece quando o jogador local morre (ver jogador_derrotado_online),
    // e a navegação dele é por seta/gamepad — mesmo padrão do menu de morte
    // offline (classe "seta_pausa", ver Pausa.js) — não por clique. Os
    // handlers de teclado/gamepad que chamam mover_selecao_morte_online e
    // confirmar_selecao_morte_online ficam registrados em Rua_online.js.
    if (cena.botoes) {
        cena.botoes.style.display = "none";
    }
}

export function criar_jogador_online(cena, posicao_jogador_x, posicao_jogador_y, escala, id_jogador, nome_jogador, vida, dano, genero, skin, local = false) {
    if (!cena || !cena.physics || !cena.physics.add) {
        console.warn("criar_jogador_online chamada numa cena sem física arcade habilitada — ignorando.");
        return null;
    }

    // CORREÇÃO: registra as animações DESTE jogador (gênero + skin dele). Antes só as do
    // jogador local existiam (animacoes_jogador usava cena.genero/cena.skin), então os
    // outros jogadores ficavam estáticos: jogador.play() com chave inexistente não faz nada.
    // O guard anims.exists dentro de animacoes_jogador evita registrar duas vezes.
    animacoes_jogador(cena, genero, skin);

    const textura = genero === "feminino" ? `ramona_parada_${skin}` : `scott_parado_${skin}`;

    console.log("[criar_jogador_online] genero recebido:", genero, "| textura escolhida:", textura);
    console.log("[criar_jogador_online] textura existe no cache do Phaser?", cena.textures.exists(textura));

    const jogador = cena.physics.add.sprite( posicao_jogador_x, posicao_jogador_y, textura).setScale(escala);

    jogador.setCollideWorldBounds(true);

    jogador.body.setSize(10, 10);
    jogador.body.setOffset(15, 80);

    jogador.setPushable(false);

    jogador.id = id_jogador;
    jogador.nome = nome_jogador;
    jogador.tipo = "jogador";
    jogador.skin = skin;

    // jogador.hp_total = 50;
    jogador.hp_total = 50;
    jogador.hp_atual = vida;
    jogador.ataque = dano;
    jogador.defesa = 10;

    jogador.atacando = false;
    jogador.machucado = false;
    jogador.ja_acertou = false;
    jogador.tipo_ataque = null;
    jogador.cooldowns_ataque = {};

    jogador.isLocal = local;
    jogador.genero = genero;

    jogador.olhando_direita = true;

    jogador.olhando = false;

    //areas do jogador

    //area de ataque do jogador

    jogador.area_ataque = cena.add.zone(jogador.x,jogador.y, 100, 80)
    cena.physics.world.enable(jogador.area_ataque);
    jogador.area_ataque.body.setAllowGravity(false);
    jogador.area_ataque.body.enable = false;

    //area de dano do jogador

    jogador.area_dano = cena.add.zone(jogador.x, jogador.y, 30, 30);
    cena.physics.world.enable(jogador.area_dano);
    jogador.area_dano.body.setAllowGravity(false);

    // Clampa a posição inicial (e o alvo) nos limites do mundo — proteção
    // pro caso do servidor mandar um spawn fora do mapa (ver clampar_no_mundo).
    const posicao_inicial_presa = clampar_no_mundo(cena, posicao_jogador_x, posicao_jogador_y, jogador);
    jogador.setPosition(posicao_inicial_presa.x, posicao_inicial_presa.y);

    jogador.targetX = posicao_inicial_presa.x;
    jogador.targetY = posicao_inicial_presa.y;

    // x em que o jogador NASCEU nesta cena (início da rua) — o boss reaproveita esse x
    // (ver boss_entrando)
    jogador.x_inicial = posicao_inicial_presa.x;

    console.log("[criar_jogador_online] sprite criado:", {
        id: jogador.id,
        nome: jogador.nome,
        x: jogador.x,
        y: jogador.y,
        visible: jogador.visible,
        alpha: jogador.alpha,
        depth: jogador.depth,
        scale: escala,
        textura,
        isLocal: jogador.isLocal,
        hp_atual: jogador.hp_atual
    });

    if (local) {
        cena.jogador = jogador;
        cena.cameras.main.startFollow(jogador);
        cena.camera_alvo = jogador;
        console.log("[criar_jogador_online] jogador marcado como LOCAL, câmera seguindo ele.");
    }

    // Registra no grupo de física dos jogadores (ver Rua_online.create()), pra
    // entrar na colisão inimigo x jogador. Sai sozinho do grupo quando o
    // sprite é destruído (ver remover_jogador_da_cena).
    cena.grupo_jogadores?.add(jogador);

    // O group do Phaser reaplica os defaults dele no body quando o sprite
    // entra (inclusive collideWorldBounds = false), desfazendo o
    // setCollideWorldBounds(true) lá de cima. Como o jogador local agora anda
    // por velocidade (ver mover_jogador_local em Rua_online.js), reativa aqui
    // DEPOIS de entrar no grupo pra ele não sair do mapa.
    jogador.setCollideWorldBounds(true);

    return jogador;
}

// Toca a animação certa (parado ou andando) num jogador online, de acordo
// com o gênero dele e se ele tá se movendo ou não. Serve tanto pro jogador
// local (chamado no update de Rua_online.js) quanto pros remotos, então a
// animação fica igual pra todo mundo que olhar a tela.
export function animar_jogador_online(jogador, esta_se_movendo, olhando_direita, skin = jogador?.skin) {
    if (!jogador) return;

    // Trava definitiva: um jogador derrotado NUNCA troca de animação de novo
    // (fica pra sempre na pose de derrotado/derrotada). Isso já era esperado
    // pelas checagens de "machucado"/"derrotado" espalhadas em Rua_online.js
    // e neste arquivo antes de chamar essa função — mas colocar a trava aqui
    // dentro garante isso de vez, mesmo que algum código futuro chame
    // animar_jogador_online sem lembrar de checar jogador.derrotado antes.
    if (jogador.derrotado) return;

    if (olhando_direita !== undefined) {
        jogador.olhando_direita = olhando_direita;
        jogador.olhando = !olhando_direita;
    }

    jogador.setFlipX(jogador.olhando);

    let anim_parado;
    let anim_andando;

    if (jogador.genero === "feminino") {
        anim_parado = `ramona_parada_${skin}`;
        anim_andando = `ramona_andando_${skin}`;
    } else {
        anim_parado = `scott_parado_${skin}`;
        anim_andando = `scott_andando_${skin}`;
    }

    // segundo argumento "true" = ignoreIfPlaying, não reinicia a animação
    // toda hora que o update() roda enquanto o jogador continua no mesmo estado
    jogador.play(esta_se_movendo ? anim_andando : anim_parado, true);
}

// Recebe a lista/objeto de jogadores que o servidor (banco) mandou e:
// - cria o sprite se o jogador ainda não existe na cena
// - só atualiza a posição-alvo se o jogador já existe (pra não recriar sprite duplicado)
//
// Formato esperado de cada item em "jogadores" (o que o servidor precisa mandar):
// { id, nomeJogador, personagem, x, y, vida, vidaMaxima, dano }
//
// A posição (x, y) já deve vir calculada pelo servidor:
// - primeiro jogador nasce na posição base que o banco define
// - segundo jogador nasce na posição base + 100 (e assim por diante)
export function atualizar_jogadores_online(cena, jogadores) {
    if (!cena.jogadores_online) {
        cena.jogadores_online = new Map();
    }

    // Guarda a "foto" de quem existia ANTES desta atualização (só se tinha alguém). Se o
    // servidor mandar uma lista vazia/diferente na troca de mapa e a cena apagar todo
    // mundo, o boss ainda consegue usar a última foto boa (ver boss_entrando).
    if (cena.jogadores_online.size > 0) {
        cena.foto_jogadores_anterior = tirar_foto_jogadores(cena);
    }

    // Descobre quem é "você mesmo" comparando o nome do jogador com o nome
    // do usuário logado (sessionStorage). Não dependemos de um id de sessão
    // vindo do servidor — ele nunca chegava mesmo (o servidor só manda
    // { tipo, salas } na mensagem "salasOnline").
    const usuario_logado = JSON.parse(sessionStorage.getItem("usuario") ?? "null");
    const nome_usuario_logado = usuario_logado?.nome;

    if (!jogadores) {
        console.warn("[atualizar_jogadores_online] jogadores veio null/undefined, servidor não mandou nada.");
        return;
    }

    // aceita tanto array [{...}, {...}] quanto objeto { id1: {...}, id2: {...} }
    const lista = Array.isArray(jogadores) ? jogadores : Object.values(jogadores);

    // AVISO: se nenhum jogador da lista bater com seu nome, é sinal de que o
    // nome mandado ao criar/entrar na sala é diferente do nome salvo em
    // sessionStorage("usuario").nome — e ninguém vai ser marcado como local.
    // Fica de fora do loop abaixo (roda 1x por mensagem, não por jogador).
    const algum_eh_local = lista.some(dados => dados?.nomeJogador === nome_usuario_logado);
    if (!algum_eh_local) {
        console.warn(
            "[atualizar_jogadores_online] NENHUM jogador da lista bateu com o nome do usuário logado.",
            "Confere se o nome mandado ao servidor (nomeCriador/nomeJogador) é igual a usuario.nome.",
            { nome_usuario_logado, nomes_na_lista: lista.map(d => d?.nomeJogador) }
        );
    }

    lista.forEach((dados, indice) => {
        if (!dados || !dados.id) {
            console.warn(`[atualizar_jogadores_online] jogador #${indice} ignorado — sem "id"`, dados);
            return;
        }

        // Só marca como local se o nome bater E esse cliente AINDA não tiver
        // um jogador local (cena.jogador) — assim, se por algum motivo dois
        // jogadores da sala tiverem o mesmo nome (ex: testando com o mesmo
        // login em duas abas), só o PRIMEIRO que aparecer na lista vira
        // "local" aqui; os próximos com nome repetido são tratados como
        // remotos, em vez de os dois viraram "você" ao mesmo tempo (o que
        // fazia a tela/menu de morte aparecer pro jogador errado).
        const eh_local = dados.nomeJogador === nome_usuario_logado && !cena.jogador;

        if (dados.nomeJogador === nome_usuario_logado && cena.jogador && cena.jogador.id !== dados.id) {
            console.warn(
                `[atualizar_jogadores_online] ATENÇÃO: jogador #${indice} tem o MESMO nome ("${dados.nomeJogador}") que o seu usuário logado, mas você já tem um jogador local com outro id.`,
                "Isso indica NOMES DUPLICADOS na sala (dois jogadores com o mesmo nome) — o client não tem como saber com 100% de certeza qual dos dois é você,",
                "porque o servidor não manda um id de sessão próprio na conexão. Use nomes diferentes pra testar multiplayer com duas abas/contas."
            );
        }

        if (cena.jogadores_online.has(dados.id)) {
            // jogador já existe: só atualiza pra onde ele deve se mover
            const jogador = cena.jogadores_online.get(dados.id);

            // O jogador LOCAL anda por velocidade/colisão (física do Phaser)
            // e só INFORMA a posição pro servidor — se aplicássemos aqui a
            // posição ecoada, ele seria puxado de volta (e atravessaria
            // barreiras/lixeiras). Só os jogadores REMOTOS seguem o alvo
            // vindo do servidor.
            if (jogador !== cena.jogador) {
                const alvo_preso = clampar_no_mundo(cena, dados.x, dados.y, jogador);
                jogador.targetX = alvo_preso.x;
                jogador.targetY = alvo_preso.y;
            }
            const vida_antes = jogador.hp_atual;
            jogador.hp_atual = dados.vida ?? jogador.hp_atual;

            if (jogador === cena.jogador) {
                atualizar_barra_hp(cena);
            }
            // Jogador REMOTO perdeu vida e esta tela NÃO tá tocando reação de golpe
            // (aplicar_reacao_dano já teria deixado machucado/invencibilidade ligados):
            // só pode ser dano que só o dono vê (ex: veneno). Mostra o vermelho +
            // animação de machucado pra quem tá assistindo.
            else if (typeof vida_antes === "number" && jogador.hp_atual < vida_antes && jogador.hp_atual > 0) {
                console.log(`[DEBUG dano remoto] "${jogador.nome}" (remoto) perdeu vida: ${vida_antes} -> ${jogador.hp_atual} | machucado: ${jogador.machucado} | invencibilidade: ${jogador.invencibilidade} | derrotado: ${jogador.derrotado}`);
                reacao_visual_dano_remoto(cena, jogador);
            }

            // O servidor é a fonte da verdade: se ele diz que a vida zerou
            // (mesmo que a gente ainda não tivesse detectado o golpe que fez
            // isso — ex: o servidor recalculou diferente do nosso "otimista"),
            // garante que o jogador é marcado como derrotado aqui também.
            if (jogador.hp_atual <= 0 && !jogador.derrotado) {
                jogador_derrotado_online(cena, jogador);
            }
            // Rede de segurança: se por algum motivo esse jogador tinha sido
            // marcado como derrotado localmente (ex: uma versão antiga desse
            // bug, ou uma corrida de mensagens) mas o servidor diz que o hp
            // dele tá acima de 0, desfaz a morte — o servidor manda mais.
            else if (jogador.hp_atual > 0 && jogador.derrotado) {
                reviver_jogador_online(cena, jogador, jogador.skin);
            }

            return;
        }

        // jogador novo: cria o sprite exatamente na posição que o servidor mandou
        const jogador = criar_jogador_online(
            cena,
            dados.x,
            dados.y,
            1.5,
            dados.id,
            dados.nomeJogador,
            dados.vida,
            dados.dano,
            dados.personagem,
            dados.skin,
            eh_local
        );

        if (jogador) {
            cena.jogadores_online.set(dados.id, jogador);

            if (eh_local) {
                atualizar_barra_hp(cena);
            }
            if (jogador.hp_atual <= 0) {
                jogador_derrotado_online(cena, jogador);
            }

            console.log(
                `%c🟢 JOGADOR NOVO ENTROU: "${dados.nomeJogador}" (${eh_local ? "EU MESMO" : "outro jogador"})`,
                "color: #00c853; font-weight: bold; font-size: 13px;",
                { id: dados.id, x: dados.x, y: dados.y, personagem: dados.personagem, vida: dados.vida }
            );
        } else {
            console.error(`[atualizar_jogadores_online] jogador #${indice} NÃO foi criado (criar_jogador_online retornou null).`);
        }
    });

    remover_jogadores_que_sairam(cena, lista);
}

// Compara quem tá desenhado na cena com a lista mais recente que o servidor
// mandou, e destrói na hora o sprite de qualquer jogador que não apareceu
// nessa lista — cobre tanto quem saiu clicando em "voltar pro mapa" quanto
// quem caiu/fechou a aba sem avisar, sem esperar nenhuma mensagem extra.
function remover_jogadores_que_sairam(cena, lista_atual) {
    if (!cena.jogadores_online || cena.jogadores_online.size === 0) return;

    const ids_atuais = new Set(lista_atual.filter(Boolean).map(dados => dados.id));

    Array.from(cena.jogadores_online.values()).forEach(jogador => {
        if (!ids_atuais.has(jogador.id)) {
            console.log(`[remover_jogadores_que_sairam] "${jogador.nome}" (id: ${jogador.id}) não tá mais na lista do servidor — sumindo da cena.`);
            remover_jogador_da_cena(cena, jogador);
        }
    });
}

// Remove o avatar de um jogador (local ou remoto) da cena por completo:
// destrói o sprite e as áreas de ataque/dano, tira ele do Map de jogadores
// online, e solta a câmera dele se ela tava seguindo esse jogador como
// jogador local. UNIVERSAL: usada tanto quando o próprio jogador local clica
// em "voltar pro mapa" (ver sair_da_sala_e_voltar) quanto quando o SERVIDOR
// avisa que outro jogador saiu da sala (ver tipo "jogadorSaiu" em
// websocket.js) — só some com o avatar quando alguém realmente sai, nunca
// por suposição/diff de lista.
export function remover_jogador_da_cena(cena, jogador) {
    if (!jogador) return;

    console.log(`[remover_jogador_da_cena] removendo "${jogador.nome}" (id: ${jogador.id}) da cena.`);

    if (cena.camera_alvo === jogador) {
        cena.cameras.main.stopFollow();
        cena.camera_alvo = null;
    }

    jogador.area_ataque?.destroy();
    jogador.area_dano?.destroy();
    jogador.destroy();

    cena.jogadores_online?.delete(jogador.id);

    if (cena.jogador === jogador) {
        cena.jogador = null;
    }
}

// Ação do botão "voltar pro mapa" no menu de morte: avisa o servidor que tá
// saindo da sala, some com o próprio avatar na hora (não espera o servidor
// confirmar) e volta pra cena do menu. Reaproveita a mesma remoção universal
// (remover_jogador_da_cena) que os outros jogadores da sala vão ver quando o
// diff em atualizar_jogadores_online perceber que esse id sumiu da lista.
export function sair_da_sala_e_voltar(cena) {
    console.log("[sair_da_sala_e_voltar] jogador local pediu pra voltar pro mapa.");

    // Primeiro avisa o servidor que tá saindo da sala (enquanto o socket
    // ainda tá aberto pra mensagem sair), DEPOIS fecha a conexão de verdade.
    // Sem isso, o socket ficava aberto e esquecido: ao entrar no multiplayer
    // de novo, o Jogo.js abria uma conexão NOVA (a cena nova não tem
    // cena.mostrar_sala), deixando a antiga pendurada no servidor pra sempre.
    sair_da_sala(cena);
    fechar_conexao(cena);

    if (cena.jogador) {
        remover_jogador_da_cena(cena, cena.jogador);
    }

    if (cena.botoes) {
        cena.botoes.style.display = "none";
    }
    if (cena.hud_vida) {
        cena.hud_vida.style.display = "none";
    }
    // tira o fundo preto que html_online() aplicou direto no body, senão ele
    // fica por cima do gradiente que a cena "Jogo" usa no menu
    document.body.classList.remove("fundo_preto");

    cena.scene.start("Jogo");
}

// ================= Navegação do menu de morte (seta, não clique) =================
// Mesmo padrão do menu de morte offline (ver para_cima_morte/para_baixo_morte/
// verifica_botao_morte em Pausa.js): a opção selecionada ganha a classe
// "seta_pausa", cima/baixo move a seleção, e confirmar executa a opção atual.
// Só sobraram 2 opções (config e voltar pro mapa) — "observar_jogador" foi
// removido de vez (ver html_online). Os handlers de teclado/gamepad que
// chamam essas duas funções exportadas ficam em Rua_online.js.

// Marca "voltar_menu_online" como selecionado por padrão — chamada toda vez
// que o menu de morte aparece (ver jogador_derrotado_online).
function selecionar_primeira_opcao_morte(cena) {
    cena.botao_2?.classList.remove("seta_pausa");
    cena.botao_3?.classList.add("seta_pausa");
}

// Lista das opções do menu de morte, na ordem em que aparecem na tela — só
// as que realmente existem no DOM (mesmo cuidado defensivo do resto do arquivo).
function opcoes_menu_morte(cena) {
    return [cena.botao_2, cena.botao_3].filter(Boolean);
}

// Move a seleção do menu de morte pra cima ou pra baixo, ciclando entre as
// opções disponíveis.
export function mover_selecao_morte_online(cena, direcao) {
    const opcoes = opcoes_menu_morte(cena);
    if (opcoes.length === 0) return;

    const indice_atual = opcoes.findIndex(botao => botao.classList.contains("seta_pausa"));
    const passo = direcao === "cima" ? -1 : 1;
    const proximo_indice = (indice_atual + passo + opcoes.length) % opcoes.length;

    opcoes.forEach(botao => botao.classList.remove("seta_pausa"));
    opcoes[proximo_indice].classList.add("seta_pausa");

    const sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";
    if (sfx_ligado) {
        cena.sound?.play("movendo_menu");
    }
}

// Executa a opção atualmente marcada com "seta_pausa" no menu de morte.
export function confirmar_selecao_morte_online(cena) {
    const sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";
    if (sfx_ligado) {
        cena.sound?.play("selecionando");
    }

    if (cena.botao_3?.classList.contains("seta_pausa")) {
        sair_da_sala_e_voltar(cena);
    }
    // cena.botao_2 (configuracoes_morreu_online): sem ação própria ainda —
    // reaproveita a lógica de configurações que já existir em outro lugar do jogo.
}

// ================= Sistema de golpes online (servidor manda) =================
//
// Fluxo pedido: jogador aperta a tecla -> tentar_atacar() manda "tentarAtacar"
// pro servidor (com personagem e golpe) -> o servidor devolve
// "jogadorTentouGolpe" (com idJogador) -> só AÍ o golpe acontece de verdade
// (animação, hitbox, cooldown), via executar_golpe(). Isso vale pro jogador
// local e pros remotos — ninguém ataca na hora que aperta a tecla, todo mundo
// espera a confirmação do servidor pra manter todo mundo na sala sincronizado.

// Tecla -> nome do golpe, de acordo com o gênero do jogador (nomes conforme
// os comentários originais no fim deste arquivo).
const TECLA_PARA_GOLPE = {
    feminino: {
        z: "SOCO",
        x: "MARTELO_CURTO_ALCANCE",
        c: "MARTELO_MEDIO_ALCANCE",
        v: "MARTELO_LONGO_ALCANCE",
        // não existe golpe "b" pra ramona
    },
    masculino: {
        z: "SOCO_JAB",
        x: "SOCO_DIRETO",
        c: "CHUTE_BAIXO",
        v: "SOCO_BAIXO",
        b: "CHUTE_NORMAL",
    },
};

// Nome do golpe -> animação e tempo de recarga (valores herdados do switch
// antigo). "chapolin" é a variante usada só quando cena.bonus === true —
// igual antes, a mesma animação chapolin cobre o golpe da ramona e do scott
// que caem na mesma tecla (x, c ou v).
const CONFIG_GOLPES = {
    SOCO:                  { animacao: "ramona_soco",                  tempo_recarga: 500 },
    MARTELO_CURTO_ALCANCE: { animacao: "ramona_martelada_para_baixo",  tempo_recarga: 1500,  chapolin: "martelada_chapolin_1" },
    MARTELO_MEDIO_ALCANCE: { animacao: "ramona_martelada_para_lado",   tempo_recarga: 700, chapolin: "martelada_chapolin_3" },
    MARTELO_LONGO_ALCANCE: { animacao: "ramona_martelada_para_frente", tempo_recarga: 850,  chapolin: "martelada_chapolin_2" },
    SOCO_JAB:              { animacao: "scott_soco_mao_esquerda",      tempo_recarga: 500 },
    SOCO_DIRETO:           { animacao: "scott_soco_mao_direita",       tempo_recarga: 1500 },
    CHUTE_BAIXO:           { animacao: "scott_rasteira",               tempo_recarga: 700 },
    SOCO_BAIXO:            { animacao: "scott_soco_por_baixo",         tempo_recarga: 850  },
    CHUTE_NORMAL:          { animacao: "scott_chute",                  tempo_recarga: 600 },
};

// Lê input (teclado + gamepad) do jogador LOCAL e, se puder atacar, manda o
// PEDIDO de golpe pro servidor ("tentarAtacar"). NÃO toca a animação nem liga
// a hitbox aqui — isso só acontece quando o servidor confirmar com
// "jogadorTentouGolpe" (ver aplicar_golpe_confirmado, chamada em
// websocket.js), que dispara executar_golpe().
// Chamar todo frame a partir de Rua_online (mover_jogador_local).
export function tentar_atacar(cena) {
    const jogador = cena.jogador;
    if (!jogador || !jogador.body) return; // ainda não existe (esperando o servidor)

    if (!cena.teclas_ataque) {
        console.error("[tentar_atacar] cena.teclas_ataque não existe — confere se foi criado no create() da Rua_online.");
        return;
    }

    if (jogador.machucado) return;
    if (jogador.atacando) return; // golpe em andamento OU já esperando o servidor confirmar

    let z = cena.teclas_ataque.z.isDown || (cena.gamepad && cena.gamepad.buttons[0].pressed); // A
    let x = cena.teclas_ataque.x.isDown || (cena.gamepad && cena.gamepad.buttons[1].pressed); // B
    let c = cena.teclas_ataque.c.isDown || (cena.gamepad && cena.gamepad.buttons[3].pressed); // Y
    let v = cena.teclas_ataque.v.isDown || (cena.gamepad && cena.gamepad.buttons[2].pressed); // X
    let b = cena.teclas_ataque.b.isDown || (cena.gamepad && cena.gamepad.buttons[5].pressed); // R1

    let tecla;
    if (z) tecla = "z";
    else if (x) tecla = "x";
    else if (c) tecla = "c";
    else if (v) tecla = "v";
    else if (b) tecla = "b";
    else return;

    if (tecla === "b" && jogador.genero === "feminino") return; // golpe do b só existe pro scott

    const mapa_golpes = TECLA_PARA_GOLPE[jogador.genero];
    const golpe = mapa_golpes ? mapa_golpes[tecla] : undefined;

    if (!golpe) {
        console.warn("[tentar_atacar] não achei um golpe pra genero/tecla:", jogador.genero, tecla);
        return;
    }

    if (jogador.cooldowns_ataque[golpe]) return; // esse golpe específico ainda tá recarregando

    if (!cena.mostrar_sala || cena.mostrar_sala.readyState !== WebSocket.OPEN) {
        console.warn("[tentar_atacar] socket não tá aberto, não deu pra pedir o golpe.");
        return;
    }

    console.log("[tentar_atacar] pedindo golpe pro servidor:", { personagem: jogador.genero, golpe });

    // Trava o jogador já aqui (não só quando o golpe é confirmado), pra não
    // ficar mandando o mesmo pedido de golpe pro servidor a cada frame
    // enquanto a resposta não chega.
    jogador.atacando = true;
    jogador.golpe_pendente = golpe;

    cena.mostrar_sala.send(JSON.stringify({
        tipo: "tentarAtacar",
        // personagem: jogador.genero,
        skin: jogador.skin,
        golpe: golpe,
    }));

    // Rede de segurança: se o servidor nunca responder (queda de conexão,
    // mensagem perdida etc.), destrava o jogador depois de um tempo em vez
    // de deixar ele preso pra sempre esperando um golpe que nunca chega.
    cena.time.delayedCall(3000, () => {
        if (jogador.atacando && jogador.golpe_pendente === golpe) {
            console.warn("[tentar_atacar] servidor não confirmou o golpe a tempo, destravando jogador:", golpe);
            jogador.atacando = false;
            jogador.golpe_pendente = null;
        }
    });
}

// Executa de fato um golpe já CONFIRMADO pelo servidor: toca a animação,
// liga a área de ataque e entra em cooldown. Usada tanto pro jogador local
// quanto pros remotos — chamada a partir de aplicar_golpe_confirmado().
export function executar_golpe(cena, jogador, golpe) {
    if (!jogador || !jogador.active) return;

    // morto/machucado não começa golpe novo (senão a animação do golpe
    // sobrescreveria a de derrotado/machucado)
    if (jogador.derrotado || jogador.machucado) {
        jogador.atacando = false;
        jogador.golpe_pendente = null;
        return;
    }

    const dados_golpe = CONFIG_GOLPES[golpe];
    if (!dados_golpe) {
        console.warn("[executar_golpe] golpe desconhecido, não sei como animar:", golpe);
        jogador.atacando = false; // não deixa o jogador travado por um golpe que não existe
        return;
    }

    // IF DE GÊNERO: o golpe tem que pertencer ao gênero do jogador (SOCO_JAB
    // é do Scott, MARTELO_* é da Ramona). Evita tocar animação que não existe.
    const golpes_do_genero = Object.values(TECLA_PARA_GOLPE[jogador.genero] ?? {});
    if (!golpes_do_genero.includes(golpe)) {
        console.warn(`[executar_golpe] golpe "${golpe}" não existe pro gênero "${jogador.genero}" — ignorado.`);
        jogador.atacando = false;
        jogador.golpe_pendente = null;
        return;
    }

    // A animação normal tem sufixo da skin (ex: "ramona_soco_skin_rosa"); a do
    // chapolin é global, sem skin. O bônus (cena.bonus) é só do jogador LOCAL —
    // antes ele valia pra todo mundo e os remotos tocavam o martelo do chapolin.
    const usa_chapolin = !!dados_golpe.chapolin && !!jogador.isLocal && !!cena.bonus;
    console.log(`[DEBUG chapolin] jogador "${jogador.nome}" | isLocal: ${jogador.isLocal} | genero: ${jogador.genero} | skin: ${jogador.skin} | cena.bonus: ${JSON.stringify(cena.bonus)} (${typeof cena.bonus}) | usa_chapolin: ${usa_chapolin}`);
    const animacao = usa_chapolin
        ? dados_golpe.chapolin
        : `${dados_golpe.animacao}_${jogador.skin}`;

    if (!cena.anims.exists(animacao)) {
        // SEM ISSO o jogador ficava com atacando=true pra sempre (o
        // animationcomplete nunca dispara) e a hitbox ligada.
        console.warn("[executar_golpe] animação do golpe não existe:", animacao);
        jogador.atacando = false;
        jogador.golpe_pendente = null;
        return;
    }

    limpar_fim_golpe(jogador);

    jogador.atacando = true;
    jogador.ja_acertou = false;
    jogador.tipo_ataque = golpe;
    jogador.golpe_pendente = null;

    // Cada golpe só pode acertar o mesmo alvo uma vez (ver verificar_pvp,
    // verificar_ataque_inimigos e verificar_ataque_barreiras).
    jogador.pvp_alvos_acertados = new Set();
    jogador.inimigos_acertados = new Set();
    jogador.barreiras_acertadas = new Set();
    jogador.latas_acertadas = new Set();

    if (jogador.body) {
        jogador.setVelocity(0);
    }

    // orientação certa pro golpe (no remoto o update não roda durante o golpe)
    jogador.setFlipX(jogador.olhando);
    jogador.play(animacao);

    // reposiciona a hitbox já no primeiro frame do golpe, virada pro lado certo
    jogador.area_ataque.setPosition(jogador.x + (jogador.olhando ? -30 : 30), jogador.y + 10);
    jogador.area_ataque.body.enable = true;

    cooldown_online(cena, jogador, golpe, animacao, dados_golpe.tempo_recarga);
}

// ================= PvP: jogador encostando o golpe em outro jogador =================
//
// A reação visual (ficar vermelho + animação de machucado) acontece em QUALQUER
// tela que esteja vendo o golpe acontecer — tanto na tela de quem apanhou quanto
// na de quem bateu (e na de quem só tava assistindo) — porque cada cliente já
// tem a posição de todo mundo sincronizada e pode calcular esse "encostou ou não"
// sozinho, sem precisar esperar o servidor confirmar.
//
// Já avisar o SERVIDOR que tomou dano é diferente: cada cliente só é "dono" do
// próprio jogador local (o servidor identifica quem mandou a mensagem pelo
// próprio socket, igual já acontece com "andar" e "tentarAtacar"), então só
// quando o ALVO acertado é o jogador_local que a gente manda "levarDano".
//
// Esse mesmo esqueleto (atacante com area_ataque ligada x alvo com area_dano)
// serve pra encaixar inimigos no futuro: um inimigo pode ser "atacante" contra
// um jogador, ou "alvo" de um jogador, bastando ele ter area_ataque/area_dano
// no mesmo formato.
//
// Chamar todo frame a partir de Rua_online (update()).
export function verificar_pvp(cena) {
    if (!cena.jogadores_online) return;
    const jogador_local = cena.jogador;
    if (!jogador_local || !jogador_local.body) return; // ainda não existe

    const jogadores = Array.from(cena.jogadores_online.values());

    jogadores.forEach(atacante => {
        if (atacante.derrotado) return; // morto não ataca mais

        // só interessa um golpe que já foi CONFIRMADO pelo servidor e tá com
        // a hitbox de fato ligada (ver executar_golpe)
        if (!atacante.atacando || !atacante.area_ataque.body.enable) return;

        jogadores.forEach(alvo => {
            if (alvo === atacante) return;
            if (alvo.invencibilidade || alvo.machucado || alvo.derrotado) return;

            if (!atacante.pvp_alvos_acertados) atacante.pvp_alvos_acertados = new Set();
            // esse golpe específico do atacante já acertou esse alvo? não conta de novo
            if (atacante.pvp_alvos_acertados.has(alvo.id)) return;

            const encostou = cena.physics.overlap(atacante.area_ataque, alvo.area_dano);
            if (!encostou) return;

            atacante.pvp_alvos_acertados.add(alvo.id);

            const dano = calcular_dano_pvp(cena, atacante, alvo);

            console.log(
                `[verificar_pvp] "${atacante.nome}" acertou "${alvo.nome}" com o golpe "${atacante.tipo_ataque}" — dano calculado:`,
                dano
            );

            // Reação visual/estado de quem apanhou: fica vermelho, toca a
            // animação de machucado e trava um instante — acontece na hora,
            // em qualquer tela, sem esperar o servidor confirmar.
            aplicar_reacao_dano(cena, alvo, dano);

            // Só quem É o alvo avisa o servidor que apanhou — o servidor já
            // sabe quem foi pelo próprio socket que mandou a mensagem.
            if (alvo === jogador_local) {
                if (cena.mostrar_sala && cena.mostrar_sala.readyState === WebSocket.OPEN) {
                    cena.mostrar_sala.send(JSON.stringify({
                        tipo: "levarDano",
                        dano: dano
                    }));
                } else {
                    console.warn("[verificar_pvp] socket não tá aberto, não deu pra avisar o servidor do dano.");
                }
            }
        });
    });
}

// Calcula quanto de dano o "atacante" causaria no "alvo", com base no ataque
// de quem bateu e na defesa de quem levou — mesma fórmula usada no restante
// do jogo (ataque * (100 / (100 + defesa)), com piso de 1 de dano.
function calcular_dano_pvp(cena, atacante, alvo) {
    //buffs só valem pro jogador local (o client não sabe dos buffs dos outros)
    let ataque = cena.buff_ataque && atacante === cena.jogador? Math.round(atacante.ataque * 1.02) : atacante.ataque;
    let defesa = cena.buff_defesa && alvo === cena.jogador? Math.round(alvo.defesa * 1.02) : alvo.defesa;
    return Math.floor(Math.max(1, ataque * (100 / (100 + defesa))));
}

// Reação de QUALQUER jogador (local, remoto — e no futuro, inimigo) ao ser
// atingido: fica vermelho, toca a animação de machucado (conforme o gênero),
// trava o movimento/ataque por um instante e fica com um período curto de
// invencibilidade logo depois — mesmo "feel" da função jogador_tomando_dano
// original (PvE), adaptada pro contexto online e generalizada pra qualquer
// alvo, não só o jogador local.
// O hp de verdade continua vindo do servidor (atualizar_jogadores_online);
// aqui só abatemos localmente pra a barra de vida não ficar "atrasada"
// visualmente até a próxima mensagem "atualizarJogadores" chegar.
export function aplicar_reacao_dano(cena, jogador, dano) {
    if (!jogador) return;
    if (jogador.invencibilidade || jogador.machucado || jogador.derrotado) return; // já tá levando dano/imune/morto, ignora

    // se ele tava no meio de um golpe, o dano interrompe: cancela o ataque e
    // desliga a hitbox na mão (senão o animationcomplete do golpe nunca
    // dispara, já que a animação vai trocar pra "machucado"/"derrotado" agora)
    // e ainda reseta pra não ficar travado achando que ainda tá atacando
    jogador.atacando = false;
    jogador.golpe_pendente = null;
    limpar_fim_golpe(jogador);
    if (jogador.area_ataque?.body) {
        jogador.area_ataque.body.enable = false;
    }

    // CORREÇÃO (jogador aparecendo morto numa tela e vivo na outra ao andar):
    // a posição de qualquer jogador que NÃO seja o dono desta tela é sempre
    // interpolada (ver update() de Rua_online), então o "encostou" calculado
    // por verificar_pvp pode divergir entre clientes enquanto todo mundo se
    // move — cada tela "vê" o golpe acontecer num instante ligeiramente
    // diferente. Se qualquer cliente pudesse abater hp/matar qualquer alvo
    // com base nesse cálculo local, o mesmo golpe podia "valer" numa tela e
    // não valer em outra. Por isso só o DONO do personagem (jogador ===
    // cena.jogador) decide de verdade se o hp baixou e se ele morreu — a
    // posição dele mesmo nessa tela é exata, não interpolada. Os outros
    // clientes só tocam a reação visual (fica vermelho + anima machucado)
    // abaixo, pra dar feedback na hora, mas sem mexer no hp real. A morte de
    // um jogador remoto só vira definitiva quando o hp vier confirmado pelo
    // servidor via "atualizarJogadores" (ver atualizar_jogadores_online).
    const eh_local = jogador === cena.jogador;

    if (eh_local) {
        // abate o hp ANTES de decidir a animação — precisamos saber se esse
        // golpe já é o que derruba o jogador ou só um machucado normal
        jogador.hp_atual = Math.max(0, jogador.hp_atual - dano);
        console.log(`[aplicar_reacao_dano] "${jogador.nome}" (EU MESMO) tomou ${dano} de dano — hp local (otimista, servidor confirma depois): ${jogador.hp_atual}`);

        atualizar_barra_hp(cena);

        if (jogador.hp_atual <= 0) {
            jogador_derrotado_online(cena, jogador);
            return;
        }
    } else {
        console.log(`[aplicar_reacao_dano] "${jogador.nome}" (remoto) levou um golpe nesta tela — só reação visual, hp real vem do servidor.`);
    }

    jogador.setTint(0xff0000);
    jogador.machucado = true;
    jogador.invencibilidade = true;

    if (jogador.body) {
        jogador.setVelocity(0);
    }

    let anim_machucado;
    if (jogador.genero === "feminino") {
        anim_machucado = `ramona_machucada_${jogador.skin}`;
    } else {
        anim_machucado = `scott_machucado_${jogador.skin}`;
    }
    if (cena.anims.exists(anim_machucado)) {
        jogador.play(anim_machucado).setFlipX(jogador.olhando);
    } else {
        console.warn("[aplicar_reacao_dano] animação não existe:", anim_machucado);
    }

    cena.time.delayedCall(500, () => {
        jogador.machucado = false;

        cena.time.delayedCall(1000, () => {
            jogador.clearTint();
            jogador.invencibilidade = false;
        });
    });
}

// Reação VISUAL de um jogador remoto que perdeu vida sem golpe visível nesta
// tela (veneno, por exemplo): fica vermelho e toca "machucado" por um instante.
// Só visual — o hp real já veio do servidor. Sem invencibilidade, igual ao
// dano_veneno_online do dono. Se um golpe já está fazendo a reação, não repete.
function reacao_visual_dano_remoto(cena, jogador) {
    if (!jogador || !jogador.active) return;
    if (jogador.derrotado || jogador.machucado || jogador.invencibilidade) {
        console.log(`[DEBUG dano remoto] reação ignorada em "${jogador.nome}" (já machucado/imune/derrotado).`);
        return;
    }

    jogador.atacando = false;
    jogador.golpe_pendente = null;
    limpar_fim_golpe(jogador);
    if (jogador.area_ataque?.body) {
        jogador.area_ataque.body.enable = false;
    }

    jogador.setTint(0xff0000);
    jogador.machucado = true;

    const anim_machucado = jogador.genero === "feminino"
        ? `ramona_machucada_${jogador.skin}`
        : `scott_machucado_${jogador.skin}`;

    if (cena.anims.exists(anim_machucado)) {
        jogador.play(anim_machucado, true).setFlipX(jogador.olhando);
    } else {
        console.warn("[reacao_visual_dano_remoto] animação não existe:", anim_machucado);
    }

    cena.time.delayedCall(500, () => {
        if (!jogador.active || jogador.derrotado) return;
        jogador.machucado = false;
        // se um golpe de verdade ainda tá com invencibilidade, ele mesmo limpa o tint
        if (!jogador.invencibilidade) {
            jogador.clearTint();
        }
    });
}

// Atualiza a barrinha de HP do HUD (elemento #vida, via CSS var --hp-width) —
// só existe uma na tela, então só faz sentido pro jogador LOCAL. Chamar
// sempre que cena.jogador.hp_atual mudar (dano tomado, ou correção vinda do
// servidor em atualizar_jogadores_online).
export function atualizar_barra_hp(cena) {
    let vida_hud = document.getElementById("vida");
    if (!vida_hud) return;

    let barra_hp_atual = (cena.jogador.hp_atual / cena.jogador.hp_total) * 100;
    barra_hp_atual = Phaser.Math.Clamp(barra_hp_atual, 0, 100);

    vida_hud.style.setProperty("--hp-width", `${barra_hp_atual}%`);
}

// Derrota de QUALQUER jogador (local, remoto — e no futuro, inimigo) quando o
// hp chega a zero. Sem "sem_animacao"/botoes_morte/scene.pause() do jogo
// offline: aqui é online, a sala continua rolando pra todo mundo.
//
// "derrotado" some a hitbox de ataque e a de dano (não ataca mais, não pode
// mais ser acertado) e "invencibilidade" travado em true garante que
// verificar_pvp nunca mais acerte esse jogador. "machucado" também fica
// travado em true — isso é usado pelos OUTROS clientes (ver update() da
// Rua_online, bloco "!jogador.isLocal") pra parar de animar/interpolar esse
// jogador na tela deles assim que ele morre — ou seja, "machucado" aqui só
// controla como os OUTROS te veem, não controla mais o SEU próprio jogador
// local.
export function jogador_derrotado_online(cena, jogador) {
    if (jogador.derrotado) return;

    console.log(
        `[jogador_derrotado_online] "${jogador.nome}" (id: ${jogador.id}) chegou a 0 de vida.`,
        "é o jogador local?", jogador === cena.jogador
    );

    limpar_fim_golpe(jogador);
    jogador.atacando = false;
    jogador.golpe_pendente = null;

    jogador.derrotado = true;
    jogador.machucado = true;       // só usado pra travar como OS OUTROS te desenham (ver update() de Rua_online)
    jogador.invencibilidade = true; // não pode mais ser acertado (ver verificar_pvp)
    jogador.hp_atual = 0;

    if (jogador === cena.jogador) {
        atualizar_barra_hp(cena);
    }

    if (jogador.body) {
        jogador.setVelocity(0);
    }

    if (jogador.area_ataque?.body) jogador.area_ataque.body.enable = false;
    if (jogador.area_dano?.body) jogador.area_dano.body.enable = false;

    let anim_derrotado;
    if (jogador.genero === "feminino") {
        anim_derrotado = `ramona_derrotada_${jogador.skin}`;
    } else {
        anim_derrotado = `scott_derrotado_${jogador.skin}`;
    }
    jogador.clearTint();
    jogador.play(anim_derrotado, true).setFlipX(jogador.olhando);

    if (jogador === cena.jogador) {
        // Jogador local derrotado: fica parado na pose de derrotado, com o
        // menu de morte (configurações / voltar pro mapa) aberto. Só o
        // jogador local vê esse menu (ver o "if" acima) — os outros
        // continuam com sua tela normal.
        // morreu: perde buffs/debuffs (no offline a cena reinicia, que dá no mesmo)
        efeitos_online(cena);
        document.body.classList.add("fundo_preto");
        if (cena.botoes) {
            cena.botoes.style.display = "flex";
        }
        selecionar_primeira_opcao_morte(cena);
    }

    console.log(`[jogador_derrotado_online] "${jogador.nome}" foi derrotado.`);
}

// Desfaz uma derrota que tinha sido aplicada localmente por engano (ver
// atualizar_jogadores_online): o servidor é quem manda de verdade, então se
// ele diz que o hp desse jogador tá acima de 0, ele NÃO tá morto — mesmo que
// esta tela tivesse achado que sim. Só deveria acontecer em cenários raros
// (queda de conexão bem na hora, corrida de mensagens), já que a correção em
// aplicar_reacao_dano faz cada cliente só decidir a própria morte.
function reviver_jogador_online(cena, jogador) {
    console.warn(`[reviver_jogador_online] "${jogador.nome}" tava marcado como derrotado nesta tela, mas o servidor diz que ele tá vivo (hp: ${jogador.hp_atual}) — desfazendo a morte local.`);

    jogador.derrotado = false;
    jogador.machucado = false;
    jogador.invencibilidade = false;

    if (jogador.area_dano?.body) jogador.area_dano.body.enable = true;
    // area_ataque continua desligada — só liga de novo quando ele atacar de verdade

    jogador.clearTint();
    animar_jogador_online(jogador, false, jogador.olhando_direita, jogador.skin);

    if (jogador === cena.jogador) {
        document.body.classList.remove("fundo_preto");
        if (cena.botoes) {
            cena.botoes.style.display = "none";
        }
    }
}


// Recebe a mensagem "jogadorTentouGolpe" do servidor e dispara o golpe pro
// jogador (local ou remoto) dono do idJogador.
//
// OBS IMPORTANTE: pra funcionar pros jogadores REMOTOS, o servidor precisa
// mandar junto o campo "golpe" (o mesmo valor recebido em "tentarAtacar"),
// além de "idJogador" — senão a gente só sabe qual golpe tocar pro PRÓPRIO
// jogador (porque guardamos em jogador.golpe_pendente antes de mandar o
// pedido), mas não tem como saber qual golpe os outros da sala estão fazendo.
// Se o servidor usar outro nome de campo, ajusta "mensagem.golpe" abaixo.
export function aplicar_golpe_confirmado(cena, mensagem) {
    const id_jogador = mensagem.idJogador;

    if (id_jogador === undefined || id_jogador === null) {
        console.warn("[aplicar_golpe_confirmado] mensagem sem idJogador:", mensagem);
        return;
    }

    let jogador = null;

    if (cena.jogador && cena.jogador.id === id_jogador) {
        jogador = cena.jogador;
    } else if (cena.jogadores_online && cena.jogadores_online.has(id_jogador)) {
        jogador = cena.jogadores_online.get(id_jogador);
    }

    if (!jogador) {
        console.warn("[aplicar_golpe_confirmado] jogador não encontrado na cena pra id:", id_jogador);
        return;
    }

    const eh_o_proprio_jogador_local = cena.jogador && cena.jogador.id === id_jogador;

    console.log(
        "[aplicar_golpe_confirmado] jogador alvo:", jogador.nome,
        "| é o jogador local?", eh_o_proprio_jogador_local,
        "| mensagem.golpe:", mensagem.golpe,
        "| jogador.golpe_pendente:", jogador.golpe_pendente
    );

    const golpe = mensagem.golpe ?? jogador.golpe_pendente;

    if (!golpe) {
        console.warn(
            "[aplicar_golpe_confirmado] não sei qual golpe executar pro jogador",
            id_jogador,
            eh_o_proprio_jogador_local ? "(jogador LOCAL)" : "(jogador REMOTO)",
            "- o servidor não mandou 'golpe' na mensagem e não tem golpe pendente salvo.",
            !eh_o_proprio_jogador_local
                ? "DIAGNÓSTICO: isso confirma que o SERVIDOR não está incluindo o campo 'golpe' no broadcast do jogadorTentouGolpe pros outros jogadores da sala — só pro próprio atacante. Precisa corrigir isso no servidor (guardar o golpe pedido em 'tentarAtacar' e reenviar junto no 'jogadorTentouGolpe' pra TODOS da sala)."
                : ""
        );
        return;
    }

    console.log(`[aplicar_golpe_confirmado] executando golpe "${golpe}" no jogador`, jogador.nome, eh_o_proprio_jogador_local ? "(local)" : "(remoto)");

    executar_golpe(cena, jogador, golpe);
}

// Remove o listener de "fim do golpe" que ficou pendurado (golpe interrompido
// por dano/morte). Sem isso o listener velho disparava no golpe SEGUINTE.
function limpar_fim_golpe(jogador) {
    if (jogador.fim_golpe) {
        jogador.off(jogador.fim_golpe.evento, jogador.fim_golpe.fn);
        jogador.fim_golpe = null;
    }
}

function cooldown_online(cena, jogador, golpe, animacao, tempo_recarga) {
    jogador.cooldowns_ataque[golpe] = true; // esse golpe entra em recarga

    const evento = `animationcomplete-${animacao}`;
    const fn = () => {
        jogador.fim_golpe = null;
        if (!jogador.active) return;
        if (jogador.area_ataque?.body) jogador.area_ataque.body.enable = false;
        jogador.atacando = false;
    };
    jogador.fim_golpe = { evento, fn };
    jogador.once(evento, fn);

    // Rede de segurança: se por qualquer motivo o animationcomplete não
    // disparar, destrava o jogador e desliga a hitbox em vez de deixar ele
    // congelado com "atacando" pra sempre.
    cena.time.delayedCall(2500, () => {
        if (jogador.active && jogador.atacando && jogador.tipo_ataque === golpe && jogador.fim_golpe?.fn === fn) {
            console.warn("[cooldown_online] golpe não terminou a tempo, destravando:", golpe);
            limpar_fim_golpe(jogador);
            if (jogador.area_ataque?.body) jogador.area_ataque.body.enable = false;
            jogador.atacando = false;
        }
    });

    cena.time.delayedCall(tempo_recarga, () => {
        jogador.cooldowns_ataque[golpe] = false; // pronto de novo
    });
}

// ================= Inimigos online TOMANDO DANO =================
//
// Regra de ouro: o HP do inimigo é do SERVIDOR. O client nunca subtrai vida
// sozinho (diferente do offline, onde `alvo.hp -= dano_jogador(...)`), porque
// o mesmo inimigo é visto por todos da sala. O CÁLCULO do dano em si agora é
// feito aqui no front (ver calcular_dano_jogador_inimigo) e mandado pronto no
// campo "dano" da mensagem "golpearInimigo" — o servidor só aplica esse valor
// na vida do inimigo, não recalcula mais nada.
//
// Fluxo:
//   1. Golpe do jogador LOCAL (já confirmado pelo servidor, hitbox ligada)
//      encosta na area_dano de um inimigo -> verificar_ataque_inimigos()
//   2. Passa pelo anti-spam (pode dar MISS, igual ao offline). Se acertou,
//      calcula o dano (calcular_dano_jogador_inimigo) e manda
//      { tipo: "golpearInimigo", idInimigo, golpe, masculino, dano } pro servidor.
//   3. Na hora, só nesta tela, o inimigo já reage (pisca, anima "machucado",
//      é empurrado, fica invencível) — inimigo_tomando_dano_online().
//   4. O servidor manda "atualizarInimigos" com a vida nova -> todas as telas
//      (inclusive esta) atualizam o texto da barra de HP (sincronizar_vida_inimigo).
//      Nas telas dos OUTROS jogadores é esse mesmo passo que dispara a reação
//      visual, já que elas não viram a hitbox encostar.
//   5. Vida chegou a 0 -> inimigo_derrotado_online(): anima "derrotado" e some.

// sistema anti-spam universal dos inimigos comuns (baseado no do boss): se o jogador repetir o mesmo tipo de
// ataque varias vezes seguidas contra o mesmo inimigo, ele passa a "prever" e esquivar desse ataque, sem tomar dano
export function inimigo_anti_spam(inimigo, ataque_usado){
    let ultimo_ataque = inimigo.lista_ataques.length > 0? inimigo.lista_ataques[inimigo.lista_ataques.length - 1]: null;

    inimigo.lista_ataques.push(ataque_usado);

    if(ultimo_ataque === ataque_usado){
        inimigo.ataques_repetidos++;
    }
    else{
        inimigo.ataques_repetidos = 1;
    }

    if(inimigo.ataques_repetidos >= 3){
        let chance_errar = 25 * (inimigo.ataques_repetidos - 2);
        chance_errar = Phaser.Math.Clamp(chance_errar, 0, 200);

        if(Phaser.Math.Between(0, 100) < chance_errar){
            return true;
        }
    }

    return false;
}

// efeito visual de "miss": um textinho pisca perto do inimigo e depois sobe e some, avisando que o golpe nao acertou
export function mostrar_miss(cena, alvo){
    let texto_miss = cena.add.text(alvo.x, alvo.y - 40, "MISS", {
        fontSize: "14px",
        fontStyle: "bold",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(9999);

    cena.tweens.add({
        targets: texto_miss,
        alpha: 0,
        duration: 120,
        yoyo: true,
        repeat: 2, //pisca umas 3 vezes
        onComplete: ()=>{
            cena.tweens.add({
                targets: texto_miss,
                y: texto_miss.y - 20,
                alpha: 0,
                duration: 300,
                onComplete: ()=> texto_miss.destroy()
            });
        }
    });
}

// Chamar todo frame a partir de Rua_online (update()), logo depois de
// verificar_pvp. Só o jogador LOCAL avisa o servidor (igual "andar",
// "tentarAtacar" e "levarDano": cada client só é dono do próprio jogador) —
// senão, numa sala com 3 jogadores, o mesmo golpe seria enviado 3 vezes.
// Golpes dos OUTROS jogadores chegam aqui via atualizarInimigos (ver
// sincronizar_vida_inimigo).
export function verificar_ataque_inimigos(cena){
    if(!cena.inimigos_online || cena.inimigos_online.size === 0) return;

    const atacante = cena.jogador;
    if(!atacante || !atacante.body || atacante.derrotado) return;

    // só interessa um golpe já CONFIRMADO pelo servidor e com a hitbox ligada
    // (ver executar_golpe) — enquanto só tá "pendente", area_ataque tá desligada
    if(!atacante.atacando || !atacante.area_ataque?.body?.enable) return;

    if(!atacante.inimigos_acertados) atacante.inimigos_acertados = new Set();

    cena.inimigos_online.forEach(inimigo => {
        if(!inimigo.active || inimigo.derrotado) return;

        // cada golpe só "conta" uma vez por inimigo, mesmo com a hitbox ligada
        // por vários frames (senão mandaria golpearInimigo em loop)
        if(atacante.inimigos_acertados.has(inimigo.id)) return;

        if(!cena.physics.overlap(atacante.area_ataque, inimigo.area_dano)) return;

        // O golpe em si SEMPRE encosta e é marcado como "já acertei esse
        // inimigo nesse golpe" — o jogador nunca fica impedido de atacar por
        // causa do estado do inimigo. A invencibilidade só decide se esse
        // encostão CAUSA DANO ou não.
        atacante.inimigos_acertados.add(inimigo.id);

        // Inimigo já tá invencível (acabou de apanhar há pouco): o golpe
        // acontece normalmente, só não causa dano nenhum — sem anti-spam,
        // sem avisar o servidor, sem reação visual extra.
        if(inimigo.invencibilidade){
            return;
        }

        // anti-spam: repetiu o mesmo golpe várias vezes seguidas? o inimigo pode esquivar.
        // Sorteado UMA vez por golpe/inimigo (por isso o Set acima vem antes).
        if(inimigo_anti_spam(inimigo, atacante.tipo_ataque)){
            mostrar_miss(cena, inimigo);
            return;
        }

        if(!cena.mostrar_sala || cena.mostrar_sala.readyState !== WebSocket.OPEN){
            console.warn("[verificar_ataque_inimigos] socket não tá aberto, não deu pra avisar o servidor do golpe.");
            return;
        }

        console.log(`[verificar_ataque_inimigos] golpe "${atacante.tipo_ataque}" acertou o inimigo "${inimigo.skin}" (id: ${inimigo.id}) — avisando o servidor.`);

        const dano = calcular_dano_jogador_inimigo(cena, atacante, inimigo);

        cena.mostrar_sala.send(JSON.stringify({
            tipo: "golpearInimigo",
            idInimigo: inimigo.id,
            golpe: atacante.tipo_ataque,
            masculino: atacante.genero === "masculino",
            dano: dano
        }));

        // reação imediata (sem esperar o servidor) — o hp em si só muda quando
        // o servidor mandar a vida nova
        inimigo_tomando_dano_online(cena, inimigo, atacante);
    });
}

// Calcula quanto de dano o "atacante" (jogador) causaria no "inimigo", com
// base no ataque de quem bateu e na defesa do inimigo. MESMA lógica/fórmula
// usada em calcular_dano_pvp/calcular_dano_inimigo (ataque * (100 / (100 +
// defesa)), piso de 1 de dano) — em função separada porque aqui quem ataca é
// um jogador e quem apanha é um inimigo (variáveis diferentes das outras
// duas). Calculado aqui no FRONT: o valor já vai pronto no campo "dano" da
// mensagem "golpearInimigo" — o servidor só aplica, não recalcula mais.
export function calcular_dano_jogador_inimigo(cena, atacante, inimigo) {
    //buff de ataque aumenta o ataque do jogador em 2%, sempre arredondado pra numero inteiro
    let ataque = cena.buff_ataque? Math.round(atacante.ataque * 1.02) : atacante.ataque;
    const defesa = inimigo.defesa ?? 0;
    return Math.floor(Math.max(1, ataque * (100 / (100 + defesa))));
}

// Descobre quem provavelmente bateu no inimigo — usado quando a reação vem do
// servidor (atualizarInimigos) e a gente não viu a hitbox encostar. Prefere
// quem tá no meio de um golpe; se ninguém tá, pega o jogador vivo mais perto.
function achar_atacante_do_inimigo(cena, inimigo){
    let atacando = null;
    let menor_distancia_atacando = Infinity;
    let mais_perto = null;
    let menor_distancia = Infinity;

    cena.jogadores_online?.forEach(jogador => {
        if(!jogador.active || jogador.derrotado) return;

        const distancia = Phaser.Math.Distance.Between(jogador.x, jogador.y, inimigo.x, inimigo.y);

        if(jogador.atacando && distancia < menor_distancia_atacando){
            menor_distancia_atacando = distancia;
            atacando = jogador;
        }
        if(distancia < menor_distancia){
            menor_distancia = distancia;
            mais_perto = jogador;
        }
    });

    return atacando ?? mais_perto;
}

// Texto da barra de HP do inimigo ("vida/total"), lendo hp_atual.
function atualizar_barra_hp_inimigo(inimigo){
    const texto = inimigo.barra_hp?.getAt(1);
    if(!texto) return;

    texto.setText(Math.max(0, inimigo.hp_atual) + "/" + inimigo.hp_total);
}

// Confronta a vida que o servidor mandou com a que a gente tem desenhada:
//  - atualiza a barra de HP sempre que mudar
//  - vida caiu e ainda > 0  -> reação de dano (se ainda não reagiu, ex: golpe de outro jogador)
//  - vida caiu até 0        -> derrotado
export function sincronizar_vida_inimigo(cena, inimigo, vida){
    if(typeof vida !== "number") return;

    const vida_antes = inimigo.hp_atual;
    if(vida === vida_antes) return;

    inimigo.hp_atual = vida;
    // o servidor só manda a vida atual (não a máxima). Se a gente viu o inimigo
    // pela primeira vez já machucado, o "total" começa menor do que deveria —
    // só cresce, nunca encolhe.
    if(vida > inimigo.hp_total) inimigo.hp_total = vida;

    atualizar_barra_hp_inimigo(inimigo);

    if(vida > vida_antes) return; // só curou, nada de reação

    if(vida <= 0){
        inimigo_derrotado_online(cena, inimigo);
        return;
    }

    // se o golpe foi NOSSO, ele já reagiu na hora e tá invencível — essa
    // chamada simplesmente não faz nada (ver o "return" no começo da função)
    inimigo_tomando_dano_online(cena, inimigo, null);
}

// Reação do inimigo ao levar um golpe: empurrão, pisca, animação de "machucado",
// cancela o ataque dele e fica invencível por um tempo — mesmo "feel" do
// inimigo_tomando_dano offline, só que SEM mexer no hp (vem do servidor).
// "atacante" pode ser null (reação vinda do servidor): aí a gente procura
// quem provavelmente foi.
function inimigo_tomando_dano_online(cena, inimigo, atacante){
    if(!inimigo || !inimigo.active || inimigo.derrotado) return;
    if(inimigo.invencibilidade) return;

    atacante = atacante ?? achar_atacante_do_inimigo(cena, inimigo);

    inimigo.invencibilidade = true;
    inimigo.ultimo_golpe_em = cena.time.now;

    // O empurrão em si (posição nova pra trás) vem do servidor, junto com o
    // resto do movimento, na próxima mensagem "atualizarInimigos" — o client
    // só guarda que o inimigo tá "empurrado" por um tempinho (ex: pra quem
    // quiser pausar o próprio ataque dele, já feito logo abaixo).
    // inimigos_online_update() persegue esse alvo via setVelocity TODO
    // frame, mesmo com invencibilidade ligada — é isso que faz o empurrão e
    // a animação de "machucado" acontecerem juntos, no mesmo instante.
    inimigo.empurrado = true;

    cena.time.delayedCall(800, ()=>{
        inimigo.empurrado = false;
    });

    inimigo_flash_dano(cena, inimigo);

    const anim_machucado = `${inimigo.skin}_machucado`;
    if(cena.anims.exists(anim_machucado)){
        inimigo.play(anim_machucado, true).setFlipX(inimigo.olhando);
    }
    else{
        console.warn(`[inimigo_tomando_dano_online] animação "${anim_machucado}" não existe.`);
    }

    //se o inimigo levou esse golpe no meio do proprio ataque, cancela o ataque dele:
    //senao ele fica travado pra sempre esperando uma animacao de golpe que foi interrompida
    inimigo.atacando = false;
    inimigo.esperando_ataque = false;
    inimigo.pode_atacar = true;
    if(inimigo.area_ataque?.body){
        inimigo.area_ataque.body.enable = false;
    }

    cena.time.delayedCall(1500, ()=>{
        inimigo_invencivel_online(inimigo);
    });
}

export function inimigo_flash_dano(cena, inimigo){
    if(inimigo.evento_flash){
        inimigo.evento_flash.remove();
        inimigo.evento_flash = null;
    }

    let piscando = true;
    inimigo.setTint(0xffffff);
    inimigo.setAlpha(0.5);

    inimigo.evento_flash = cena.time.addEvent({
        delay: 100,
        loop: true,
        callback: ()=>{
            //protecao: o inimigo pode ter sido destruido (saiu da lista do servidor) com o flash ainda rodando
            if(!inimigo.active){
                inimigo_parar_flash_dano(inimigo);
                return;
            }
            piscando = !piscando;
            if(piscando){
                inimigo.setTint(0xffffff);
                inimigo.setAlpha(0.5);
            }
            else{
                inimigo.clearTint();
                inimigo.setAlpha(1);
            }
        }
    });
}

export function inimigo_parar_flash_dano(inimigo){
    if(inimigo.evento_flash){
        inimigo.evento_flash.remove();
        inimigo.evento_flash = null;
    }
    if(inimigo.active){
        inimigo.clearTint();
        inimigo.setAlpha(1);
    }
}

function inimigo_invencivel_online(inimigo){
    //protecao: o inimigo pode ter sido destruido (ou derrotado) antes desse delayedCall disparar,
    //entao sem isso o .play() quebra tentando usar um sprite morto
    if(!inimigo || !inimigo.active || !inimigo.anims || inimigo.derrotado){
        return;
    }
    inimigo_parar_flash_dano(inimigo);
    inimigo.invencibilidade = false;
    inimigo.empurrado = false;

    // a stella não tem sprite "parada": volta a andar no lugar
    const anim_normal = inimigo.skin === "stella"? "stella_andando" : `${inimigo.skin}_parado`;
    inimigo.play(anim_normal, true).setFlipX(inimigo.olhando);
}

// ================= Inimigo ATACANDO (servidor manda) =================
//
// Mesma ideia do golpe do jogador (ver "Sistema de golpes online" lá em cima),
// só que ao contrário: aqui é o SERVIDOR que decide sozinho quando um inimigo
// ataca e manda "inimigoVaiTentarGolpe" pra sala inteira. Diferença importante:
// no golpe do jogador o campo "golpe" é um NOME (ex: "SOCO") que a gente
// traduz pra animação via CONFIG_GOLPES; aqui o servidor já manda o nome da
// ANIMAÇÃO pronto (ex: "raymond_golpe_1" — skin + "_golpe_" + número), então
// é só chamar inimigo.play(mensagem.golpe) direto, sem tabela de tradução.
//
// mensagem esperada (ver "Contrato com o servidor" no fim do arquivo):
//   tipo: "inimigoVaiTentarGolpe"
//   idInimigo: string
//   golpe: string (nome da animação, ex: "raymond_golpe_1")
export function aplicar_golpe_inimigo_confirmado(cena, mensagem) {
    const id_inimigo = mensagem.idInimigo;

    if (!id_inimigo) {
        console.warn("[aplicar_golpe_inimigo_confirmado] mensagem sem idInimigo:", mensagem);
        return;
    }

    const inimigo = cena.inimigos_online?.get(id_inimigo);

    if (!inimigo || !inimigo.active) {
        console.warn("[aplicar_golpe_inimigo_confirmado] inimigo não encontrado na cena pra id:", id_inimigo);
        return;
    }

    // Derrotado, tomando dano ou já no meio de outro golpe: não começa
    // (nem sobrepõe) uma nova animação de ataque.
    if (inimigo.derrotado || inimigo.invencibilidade || inimigo.atacando) return;

    const animacao = mensagem.golpe;

    if (!animacao) {
        console.warn("[aplicar_golpe_inimigo_confirmado] mensagem sem 'golpe' (nome da animação):", mensagem);
        return;
    }

    if (!cena.anims.exists(animacao)) {
        console.warn(`[aplicar_golpe_inimigo_confirmado] animação "${animacao}" não existe — confere o preload/registro das anims desse inimigo.`);
        return;
    }

    console.log(`[aplicar_golpe_inimigo_confirmado] "${inimigo.skin}" (id: ${id_inimigo}) atacando com "${animacao}"`);

    inimigo.atacando = true;
    inimigo.esperando_ataque = false;

    if (inimigo.body) {
        inimigo.setVelocity(0);
    }

    // Delay antes do golpe de fato sair (telegraph do ataque) — o david é
    // mais rápido, então tem menos tempo de aviso que os outros inimigos.
    const atraso_ataque = inimigo.skin === "david" ? 500 : 800;

    cena.time.delayedCall(atraso_ataque, () => {
        // pode ter sido removido/derrotado da cena durante o atraso
        if (!inimigo.active || inimigo.derrotado) {
            inimigo.atacando = false;
            return;
        }

        inimigo.play(animacao, true).setFlipX(inimigo.olhando);

        // Cada golpe do inimigo só pode acertar o mesmo jogador uma vez, mesmo
        // com a hitbox ligada por vários frames — mesmo padrão de
        // jogador.pvp_alvos_acertados em executar_golpe (ver verificar_pvp).
        inimigo.alvos_acertados = new Set();

        // Habilita a área de ataque do inimigo, igual acontece com o jogador em
        // executar_golpe — é ela que verificar_ataque_inimigo_jogador usa pra
        // saber se o golpe já pode encostar em alguém.
        inimigo.area_ataque.body.enable = true;

        // Desliga a hitbox e destrava o inimigo quando a animação do golpe
        // terminar — mesmo padrão do cooldown_online usado pro golpe do jogador.
        inimigo.once(`animationcomplete-${animacao}`, () => {
            if (!inimigo.active) return; // pode ter sido removido da cena no meio do golpe
            if (inimigo.area_ataque?.body) inimigo.area_ataque.body.enable = false;
            inimigo.atacando = false;
        });
    });
}

// ================= Inimigo encostando o golpe em um jogador =================
//
// Mesmo esqueleto de verificar_pvp (atacante com area_ataque ligada x alvo
// com area_dano), só que aqui quem ataca é o INIMIGO em vez de outro
// jogador. A reação de dano (ficar vermelho, animação de machucado, abater
// hp do jogador local) é a MESMA função usada no PvP — aplicar_reacao_dano
// já foi escrita pra servir "qualquer alvo", justamente pra não duplicar
// essa lógica aqui.
//
// O cálculo do dano em si é o único pedaço que tem uma função própria
// (calcular_dano_inimigo, logo abaixo): mesma fórmula de calcular_dano_pvp,
// só que usando as variáveis do INIMIGO (inimigo.ataque) em vez das de um
// jogador atacante.
//
// Chamar todo frame a partir de Rua_online (update()), depois de
// inimigos_online_update() (pra area_ataque já estar na posição certa).
export function verificar_ataque_inimigo_jogador(cena) {
    if (!cena.inimigos_online || !cena.jogadores_online) return;

    cena.inimigos_online.forEach(inimigo => verificar_golpe_de_um_inimigo(cena, inimigo));
}

// O mesmo check de cima, só que pra UM inimigo. Exportada pra cena do boss (Boss_1_online)
// conferir o golpe do Lucas Lee sem ele precisar entrar no Map de inimigos comuns.
export function verificar_golpe_de_um_inimigo(cena, inimigo) {
    if (!inimigo || !cena.jogadores_online) return;

    const jogador_local = cena.jogador;
    if (!jogador_local || !jogador_local.body) return; // ainda não existe

    const jogadores = Array.from(cena.jogadores_online.values());

    if (!inimigo.active || inimigo.derrotado) return; // inimigo morto não ataca mais

    // só interessa um golpe já CONFIRMADO pelo servidor e com a hitbox
    // de fato ligada (ver aplicar_golpe_inimigo_confirmado)
    if (!inimigo.atacando || !inimigo.area_ataque?.body?.enable){
        return;
    }

    if (!inimigo.alvos_acertados) inimigo.alvos_acertados = new Set();

    jogadores.forEach(alvo => {
        if (alvo.invencibilidade || alvo.machucado || alvo.derrotado) return;

        // esse golpe específico do inimigo já acertou esse jogador? não conta de novo
        if (inimigo.alvos_acertados.has(alvo.id)) return;

        const encostou = cena.physics.overlap(inimigo.area_ataque, alvo.area_dano);
        if (!encostou) return;

        inimigo.alvos_acertados.add(alvo.id);

        const dano = calcular_dano_inimigo(cena, inimigo, alvo);

        console.log(
            `[verificar_ataque_inimigo_jogador] "${inimigo.skin}" (id: ${inimigo.id}) acertou "${alvo.nome}" — dano calculado:`,
            dano
        );

        // Reutiliza o mesmo sistema de reação de dano do PvP: fica
        // vermelho, anima "machucado" e trava um instante — acontece na
        // hora, em qualquer tela, sem esperar o servidor confirmar.
        aplicar_reacao_dano(cena, alvo, dano);

        // Só quem É o alvo avisa o servidor que apanhou — mesma regra
        // do PvP (ver verificar_pvp): o servidor já sabe quem foi pelo
        // próprio socket que mandou a mensagem.
        if (alvo === jogador_local) {
            if (cena.mostrar_sala && cena.mostrar_sala.readyState === WebSocket.OPEN) {
                cena.mostrar_sala.send(JSON.stringify({
                    tipo: "levarDano",
                    dano: dano
                }));
            } else {
                console.warn("[verificar_ataque_inimigo_jogador] socket não tá aberto, não deu pra avisar o servidor do dano.");
            }
        }
    });
}

// Skate do boss (3º turno): enquanto a area_skate está ligada, qualquer jogador que encostar
// nela leva dano. Diferente do golpe normal (verificar_golpe_de_um_inimigo): não precisa de
// "atacando" e não usa alvos_acertados (o skate passa várias vezes pelo mesmo jogador) — quem
// limita a repetição é a invencibilidade que aplicar_reacao_dano dá depois de cada hit.
export function verificar_area_skate_boss(cena, boss) {
    if (!boss || !boss.active || boss.derrotado || !boss.area_skate?.body?.enable) return;

    const jogador_local = cena.jogador;
    if (!jogador_local || !cena.jogadores_online) return;

    cena.jogadores_online.forEach(alvo => {
        if (!alvo.active || !alvo.area_dano?.body) return;
        if (alvo.invencibilidade || alvo.machucado || alvo.derrotado) return;

        if (!cena.physics.overlap(boss.area_skate, alvo.area_dano)) return;

        const dano = calcular_dano_inimigo(cena, boss, alvo);

        console.log(`[verificar_area_skate_boss] skate do boss acertou "${alvo.nome}" — dano calculado:`, dano);

        // mesma reação visual/hp do golpe normal
        aplicar_reacao_dano(cena, alvo, dano);

        // só quem É o alvo avisa o servidor (mesma regra do verificar_golpe_de_um_inimigo)
        if (alvo === jogador_local) {
            if (cena.mostrar_sala && cena.mostrar_sala.readyState === WebSocket.OPEN) {
                cena.mostrar_sala.send(JSON.stringify({
                    tipo: "levarDano",
                    dano: dano
                }));
            } else {
                console.warn("[verificar_area_skate_boss] socket não tá aberto, não deu pra avisar o servidor do dano.");
            }
        }
    });
}

// Calcula quanto de dano o "inimigo" causaria no "alvo" (jogador), com base
// no ataque de quem bateu e na defesa de quem levou. MESMA lógica/fórmula de
// calcular_dano_pvp (ataque * (100 / (100 + defesa)), piso de 1 de dano) —
// só que em função separada, porque aqui quem ataca é o inimigo
// (inimigo.ataque), não outro jogador.
function calcular_dano_inimigo(cena, inimigo, alvo) {
    //buff de defesa aumenta a defesa do jogador em 2%, sempre arredondado pra numero inteiro
    let defesa = cena.buff_defesa && alvo === cena.jogador? Math.round(alvo.defesa * 1.02) : alvo.defesa;
    return Math.floor(Math.max(1, inimigo.ataque * (100 / (100 + defesa))));
}

// Vida chegou a 0 (servidor mandou, ou o inimigo sumiu da lista logo depois de
// apanhar — ver remover_inimigos_que_sumiram): toca a animação de derrotado
// e só depois de 2s tira o inimigo da cena.
// Sem pontuação/drop/sfx aqui: no offline isso mexe em cena.jogador.pontuacao,
// cena.itens e cena.sfx_ligado, nada disso existe na Rua_online por enquanto.
function inimigo_derrotado_online(cena, inimigo){
    if(!inimigo || !inimigo.active || inimigo.derrotado) return;

    console.log(`[inimigo_derrotado_online] "${inimigo.skin}" (id: ${inimigo.id}) chegou a 0 de vida.`);

    inimigo.derrotado = true;
    inimigo.invencibilidade = true; // não pode mais ser acertado
    inimigo.hp_atual = 0;

    // O servidor pode continuar mandando esse id na lista por mais um tempo
    // depois da morte — sem guardar o id, atualizar_inimigos_online recriaria o
    // inimigo assim que a gente removesse o sprite.
    if(!cena.inimigos_derrotados_ids) cena.inimigos_derrotados_ids = new Set();
    cena.inimigos_derrotados_ids.add(inimigo.id);

    inimigo_parar_flash_dano(inimigo);

    if(inimigo.body){
        inimigo.setVelocity(0);
    }
    if(inimigo.area_dano?.body) inimigo.area_dano.body.enable = false;
    if(inimigo.area_ataque?.body) inimigo.area_ataque.body.enable = false;

    atualizar_barra_hp_inimigo(inimigo);

    const anim_derrotado = `${inimigo.skin}_derrotado`;
    if(inimigo.anims && cena.anims.exists(anim_derrotado)){
        inimigo.play(anim_derrotado).setFlipX(inimigo.olhando);
    }

    cena.time.delayedCall(2000, ()=>{
        //protecao: o inimigo pode ja ter sido destruido (ex: saiu da sala) antes desse delayedCall disparar
        if(!inimigo || !inimigo.active){
            return;
        }
        remover_inimigo_da_cena(cena, inimigo);
    });
}

// INIMIGOS (formato que o servidor manda em "atualizarInimigos"):
    // Object
    // 2f574523-27ef-4763-8979-75b354a8e141
    // :
    // boss: false
    // dano: 4
    // direcao: true
    // direcaoAleatoria: 0
    // nome: "raymond"
    // pontosPorDerrotar: 1
    // quantidadeMovimentos : 1
    // random : {deprecated: false}
    // velocidade:  2
    // vida :  8
    // x :  464
    // y :  546

// ================= Spawn de inimigos ONLINE (banco é a fonte da verdade) =================
// Diferente do offline (criar_inimigos/posicionar_spawn em funcoes.js, que sorteiam a
// posição em cima da posição do jogador local), aqui o servidor já manda x/y prontos —
// e o mesmo inimigo é visto por TODOS os jogadores da sala, então não faz sentido cada
// client decidir sozinho onde ele nasce. Essas funções cuidam de fazer o inimigo
// APARECER, SUMIR quando o servidor apagar ele (ver remover_inimigos_que_sumiram) e
// TOMAR DANO (ver acima); movimento e ataque dele ficam pra depois. A decisão de
// apagar é do servidor (ele apaga quando o jogador se afasta demais): o client só
// espelha isso, nunca decide sozinho por distância — o outro jogador pode ainda
// estar perto do mesmo inimigo.

// Cria o sprite de UM inimigo online, a partir dos dados que o servidor mandou pra esse id.
export function criar_inimigo_online(cena, id_inimigo, dados, escala = 1.5) {
    if (!cena || !cena.physics || !cena.physics.add) {
        console.warn("criar_inimigo_online chamada numa cena sem física arcade habilitada — ignorando.");
        return null;
    }

    const textura = dados.nome === "stella"? `${dados.nome}_andando`:`${dados.nome}_parado`;

    if (!cena.textures.exists(textura)) {
        console.warn(
            `[criar_inimigo_online] textura/animação "${textura}" não existe no cache do Phaser.`,
            "Confere se o preload() da cena tá carregando os assets desse inimigo (ex: assets_mapa_1)."
        );
    }

    const inimigo = cena.physics.add.sprite(dados.x, dados.y, textura).setScale(escala);

    // Informações
    inimigo.id = id_inimigo;
    inimigo.skin = dados.nome;
    inimigo.tipo = "inimigo";
    inimigo.boss = !!dados.boss;

    inimigo.hp_total = dados.vida;
    inimigo.hp_atual = dados.vida;
    inimigo.ataque = dados.dano;
    // Defesa do inimigo (mesma convenção do dano/vida: vem do servidor em
    // "atualizarInimigos"). Usada em calcular_dano_jogador_inimigo, pra
    // calcular no front quanto de dano o jogador causa nesse inimigo —
    // mesmo esquema de jogador.defesa (fixo em 10, ver criar_jogador_online).
    inimigo.defesa = dados.defesa ?? 10;
    inimigo.pontuacao = dados.pontosPorDerrotar ?? 0;

    // --- estado de combate (mesmos nomes usados no offline, ver criar_inimigos em funcoes.js) ---
    inimigo.invencibilidade = false;
    inimigo.derrotado = false;
    inimigo.empurrado = false;
    inimigo.atacando = false;
    inimigo.esperando_ataque = false;
    inimigo.pode_atacar = true;
    inimigo.ultimo_golpe_em = null; // cena.time.now do último golpe que ele levou

    //sistema anti-spam: guarda o historico dos tipos de ataque que esse inimigo levou (ver inimigo_anti_spam)
    inimigo.lista_ataques = [];
    inimigo.ataques_repetidos = 0;

    inimigo.setCollideWorldBounds(true); //faz o inimigo nao ultrapassar o limite do mundo (o empurrão do golpe não joga ele pra fora)

    inimigo.body.setSize(10, 10);
    inimigo.body.setOffset((inimigo.width - 10) / 2, inimigo.height - 10);

    // "direcao" já vem do servidor como booleano (true = direita), mesma
    // convenção usada em jogador.olhando_direita/olhando.
    inimigo.olhando_direita = !!dados.direcao;
    inimigo.olhando = !inimigo.olhando_direita;

    //area de ataque do inimigo (mesmos offsets de inimigo_update em funcoes.js)

    inimigo.area_ataque = cena.add.zone(dados.x + (inimigo.olhando ? -30 : 30), dados.y + 10, 70, 70)
    cena.physics.world.enable(inimigo.area_ataque);
    inimigo.area_ataque.body.setAllowGravity(false);
    inimigo.area_ataque.body.enable = false;

    //area de dano do inimigo: é ela que o golpe do jogador precisa encostar (ver verificar_ataque_inimigos)

    inimigo.area_dano = cena.add.zone(dados.x, dados.y + 20, 30, 30);
    cena.physics.world.enable(inimigo.area_dano);
    inimigo.area_dano.body.setAllowGravity(false);

    inimigo.setPushable(false);

    inimigo.play(textura, true).setFlipX(inimigo.olhando);

    const quadrado = cena.add.rectangle(0,0, 50, 20, 0x0000ff).setOrigin(0.5, 0.5);
    const texto = cena.add.text(0, 0, dados.vida + '/' + dados.vida, { fontSize: '10px', fill: '#FFF' }).setOrigin(0.5, 0.5);
    inimigo.barra_hp = cena.add.container(dados.x,dados.y - 50, [quadrado, texto]);

    // Guardado já pronto pra interpolação de movimento dos inimigos online
    // (ver inimigos_online_update) — targetX/Y é o destino atual, velocidade
    // é usada só como um multiplicador de quão rápido ele persegue esse
    // destino (o servidor não manda um valor em px/s pronto).
    // Clampa a posição inicial (e o alvo) nos limites do mundo — mesma
    // proteção usada em criar_jogador_online (ver clampar_no_mundo).
    const posicao_inicial_presa_inimigo = clampar_no_mundo(cena, dados.x, dados.y, inimigo);
    inimigo.setPosition(posicao_inicial_presa_inimigo.x, posicao_inicial_presa_inimigo.y);

    inimigo.targetX = posicao_inicial_presa_inimigo.x;
    inimigo.targetY = posicao_inicial_presa_inimigo.y;
    inimigo.velocidade = dados.velocidade ?? 2;

    // Registra no grupo de física dos inimigos (ver Rua_online.create()), pra
    // entrar nas colisões inimigo x inimigo e inimigo x jogador. Sai sozinho
    // do grupo quando o sprite é destruído (ver remover_inimigo_da_cena).
    cena.grupo_inimigos?.add(inimigo);

    return inimigo;
}

// Faz depth, barra de HP e áreas de ataque/dano acompanharem o sprite do
// inimigo, todo frame — equivalente online do começo de inimigo_update em
// funcoes.js. Chamar a partir de Rua_online (update()), ANTES de
// verificar_ataque_inimigos, pra hitbox estar no lugar certo.
export function inimigos_online_update(cena){
    if(!cena.inimigos_online) return;

    cena.inimigos_online.forEach(inimigo => {
        if(!inimigo.active || !inimigo.body) return;

        // Persegue a posição-alvo mandada pelo servidor via SETVELOCITY (física),
        // em vez de teleportar x/y direto — roda todo frame que ele ainda
        // não morreu, sem depender de estar ou não com a hitbox de dano
        // ligada. É por isso que o empurrão de quando ele apanha agora
        // acontece JUNTO com a animação de "machucado", no mesmo frame, e
        // não só depois da invencibilidade acabar: a posição sempre persegue
        // o alvo mais recente (seja o andar normal ou o empurrão), só a
        // ANIMAÇÃO é que respeita a prioridade de "machucado"/atacando (ver
        // abaixo). Já morto (derrotado), ele só fica parado onde tá.
        let esta_se_movendo = false;

        if (inimigo.derrotado) {
            inimigo.setVelocity(0);
        } else {
            const distancia_x = inimigo.targetX - inimigo.x;
            const distancia_y = inimigo.targetY - inimigo.y;
            const distancia = Math.hypot(distancia_x, distancia_y);
            esta_se_movendo = distancia > 1;

            if (esta_se_movendo) {
                const velocidade_perseguicao = (inimigo.velocidade ?? 2) * 50;
                // não "passa" do alvo quando já tá bem perto — evita ficar
                // tremendo de um lado pro outro tentando alcançar o destino
                const velocidade_final = Math.min(velocidade_perseguicao, distancia * 10);
                const angulo = Math.atan2(distancia_y, distancia_x);

                inimigo.setVelocity(
                    Math.cos(angulo) * velocidade_final,
                    Math.sin(angulo) * velocidade_final
                );

                if (Math.abs(distancia_x) > 1) {
                    inimigo.olhando_direita = distancia_x > 0;
                    inimigo.olhando = !inimigo.olhando_direita;
                }
            } else {
                inimigo.setVelocity(0);
            }
        }

        // Enquanto ele tá reagindo a um golpe (invencibilidade -> animação
        // de "machucado"), atacando, ou já derrotado, essas animações têm
        // prioridade — não deixa a troca pra "andando"/"parado" atropelar
        // elas. A POSIÇÃO (acima) continua sendo perseguida normalmente
        // durante isso, só a animação que espera.
        if (!inimigo.derrotado && !inimigo.invencibilidade && !inimigo.atacando) {
            // a stella não tem sprite "parada" (ver inimigo_invencivel_online):
            // fica com a animação de andar mesmo parada.
            const anim_parado = inimigo.skin === "stella" ? "stella_andando" : `${inimigo.skin}_parado`;
            const anim_andando = `${inimigo.skin}_andando`;
            const anim_escolhida = esta_se_movendo ? anim_andando : anim_parado;

            if (cena.anims.exists(anim_escolhida)) {
                inimigo.play(anim_escolhida, true);
            }
            inimigo.setFlipX(inimigo.olhando);
        }

        inimigo.setDepth(inimigo.body.y);
        inimigo.barra_hp?.setPosition(inimigo.x, inimigo.y - 50);
        inimigo.area_ataque?.setPosition(inimigo.x + (inimigo.olhando? -30:30), inimigo.y + 10);
        inimigo.area_dano?.setPosition(inimigo.x, inimigo.y + 20);
    });
}

// Remove UM inimigo online da cena por completo: destrói o sprite (e as áreas/barra
// de vida/timer de movimento, se existirem) e tira ele do Map de inimigos online.
// Equivalente inimigo de remover_jogador_da_cena.
export function remover_inimigo_da_cena(cena, inimigo) {
    if (!inimigo || inimigo.removido) return;
    inimigo.removido = true;

    console.log(
        `%c🔴 INIMIGO REMOVIDO: "${inimigo.skin}" (id: ${inimigo.id}) — servidor não mandou mais ele.`,
        "color: #d50000; font-weight: bold; font-size: 13px;"
    );

    cena.tweens?.killTweensOf(inimigo);

    // pisca de dano ainda rodando = timer órfão chamando setTint num sprite destruído
    inimigo_parar_flash_dano(inimigo);

    inimigo.area_ataque?.destroy();
    inimigo.area_dano?.destroy();
    inimigo.barra_hp?.destroy();
    inimigo.movimento?.remove();

    inimigo.destroy();

    cena.inimigos_online?.delete(inimigo.id);
}

// Compara quem tá desenhado na cena com a lista mais recente que o servidor
// mandou (ids_atuais) e apaga do front todo inimigo que não veio nela — ou seja,
// que o servidor apagou (ex: o jogador se afastou demais, ou o inimigo morreu).
// Mesma ideia de remover_jogadores_que_sairam, só que pros inimigos.
//
// ATENÇÃO: só funciona se o servidor manda a lista COMPLETA de inimigos vivos
// a cada "atualizarInimigos". Se um dia ele passar a mandar só os novos
// (incremental), essa função apagaria todo mundo que não veio na mensagem.
export function remover_inimigos_que_sumiram(cena, ids_atuais) {
    if (!cena.inimigos_online || cena.inimigos_online.size === 0) return;

    const presentes = new Set(ids_atuais);

    // Array.from = "foto" do Map, porque remover_inimigo_da_cena mexe nele
    // enquanto a gente percorre.
    Array.from(cena.inimigos_online.values()).forEach(inimigo => {
        if (presentes.has(inimigo.id)) return;

        // já tá tocando a animação de derrotado: ele mesmo se remove no fim dela
        if (inimigo.derrotado) return;

        // Se o servidor apagou o inimigo POUCO DEPOIS dele apanhar, quase certo
        // que foi o golpe que matou (o servidor pode tirar o morto da lista sem
        // mandar antes um "vida: 0"). Deixa ele tocar a animação de derrotado em
        // vez de sumir do nada. Sumiu sem ter apanhado = removido por distância.
        const foi_atingido_agora = inimigo.ultimo_golpe_em !== null
            && (cena.time.now - inimigo.ultimo_golpe_em) < 3000;

        if (foi_atingido_agora) {
            inimigo_derrotado_online(cena, inimigo);
            return;
        }

        remover_inimigo_da_cena(cena, inimigo);
    });
}

// Recebe o "inimigos" que vem na mensagem "atualizarInimigos" do servidor — um
// OBJETO { idInimigo: {dados...} }, não um array (o id é a própria chave, os
// dados de cada inimigo não trazem um campo "id" dentro deles).
//
// - cria quem ainda não existe na cena
// - quem já existe: só sincroniza a VIDA (barra de HP + reação de dano/derrota,
//   ver sincronizar_vida_inimigo). Posição fica pra quando o movimento dos
//   inimigos online for implementado.
// - APAGA quem existe na cena mas o servidor não mandou mais (ver remover_inimigos_que_sumiram)
export function atualizar_inimigos_online(cena, inimigos) {
    if (!cena.inimigos_online) {
        cena.inimigos_online = new Map();
    }
    if (!cena.inimigos_derrotados_ids) {
        cena.inimigos_derrotados_ids = new Set();
    }

    if (!inimigos) {
        console.warn("[atualizar_inimigos_online] inimigos veio null/undefined, servidor não mandou nada.");
        return;
    }

    // aceita tanto o formato objeto { id: {...} } (o que o servidor manda hoje)
    // quanto um array [{...}, {...}], caso isso mude no futuro.
    const entradas = Array.isArray(inimigos)
        ? inimigos.map((dados, indice) => [dados?.id ?? indice, dados])
        : Object.entries(inimigos);

    entradas.forEach(([id_inimigo, dados]) => {
        if (!dados) {
            console.warn(`[atualizar_inimigos_online] inimigo "${id_inimigo}" ignorado — sem dados.`, dados);
            return;
        }

        // Já morreu e a gente já tratou (animação rodando ou já removido) — o
        // servidor ainda pode estar listando ele, mas não deve voltar a aparecer.
        if (cena.inimigos_derrotados_ids.has(id_inimigo)) {
            return;
        }

        // já existe na cena: sincroniza vida e posição-alvo.
        if (cena.inimigos_online.has(id_inimigo)) {
            const existente = cena.inimigos_online.get(id_inimigo);

            if (!existente.derrotado) {
                // Posição nova mandada pelo servidor — cobre tanto o andar
                // normal (patrulha/perseguição) quanto o empurrão de quando
                // o inimigo apanha, já que as duas coisas chegam pela MESMA
                // mensagem "atualizarInimigos". O client só guarda o alvo
                // aqui; quem desliza o sprite suavemente até lá e escolhe a
                // animação de andar/parado é inimigos_online_update, chamado
                // todo frame a partir de Rua_online (update()).
                if (typeof dados.x === "number" && typeof dados.y === "number") {
                    const alvo_preso_inimigo = clampar_no_mundo(cena, dados.x, dados.y, existente);
                    existente.targetX = alvo_preso_inimigo.x;
                    existente.targetY = alvo_preso_inimigo.y;
                } else if (typeof dados.x === "number") {
                    const alvo_preso_inimigo = clampar_no_mundo(cena, dados.x, existente.targetY, existente);
                    existente.targetX = alvo_preso_inimigo.x;
                } else if (typeof dados.y === "number") {
                    const alvo_preso_inimigo = clampar_no_mundo(cena, existente.targetX, dados.y, existente);
                    existente.targetY = alvo_preso_inimigo.y;
                }
                if (typeof dados.direcao === "boolean") {
                    existente.olhando_direita = dados.direcao;
                    existente.olhando = !dados.direcao;
                }
                if (typeof dados.velocidade === "number") existente.velocidade = dados.velocidade;

                sincronizar_vida_inimigo(cena, existente, dados.vida);
            }
            return;
        }

        // chegou já sem vida (morreu antes da gente ver ele): nem cria.
        if (typeof dados.vida === "number" && dados.vida <= 0) {
            return;
        }

        const inimigo = criar_inimigo_online(cena, id_inimigo, dados);

        if (inimigo) {
            cena.inimigos_online.set(id_inimigo, inimigo);

            console.log(
                `%c🟠 INIMIGO NOVO: "${dados.nome}" (id: ${id_inimigo})`,
                "color: #ff6d00; font-weight: bold; font-size: 13px;",
                { x: dados.x, y: dados.y, vida: dados.vida, boss: dados.boss }
            );
        } else {
            console.error(`[atualizar_inimigos_online] inimigo "${id_inimigo}" NÃO foi criado (criar_inimigo_online retornou null).`);
        }
    });

    // Entrada sem dados (null) conta como "não veio".
    const ids_presentes = entradas.filter(([, dados]) => dados).map(([id_inimigo]) => id_inimigo);

    // Apaga do front quem o servidor não mandou nessa atualização.
    remover_inimigos_que_sumiram(cena, ids_presentes);

    // Limpa a lista de "já morreu" dos ids que o servidor parou de listar — ele
    // já apagou de vez, não tem mais risco de recriar, e a lista não cresce pra sempre.
    const presentes = new Set(ids_presentes);
    cena.inimigos_derrotados_ids.forEach(id => {
        if (!presentes.has(id)) cena.inimigos_derrotados_ids.delete(id);
    });
}

//barreiras

// Cria as barreiras que ainda não existem na cena e SINCRONIZA a vida das que
// já existem (ver sincronizar_vida_barreira) — mesma ideia de
// atualizar_inimigos_online, só que pra barreira. Isso é o que permite a
// barreira "reagir" quando o servidor manda um "atualizarBarreiras" novo
// depois de um golpearBarreira (ver verificar_ataque_barreiras), em vez de
// recriar o sprite do zero toda vez que essa mensagem chega.
//
// Mantém o nome "criar_barreiras_online" pra não precisar mexer nos imports
// de Rua_online.js/websocket.js — mas agora a função também atualiza, não só cria.
export function criar_barreiras_online(cena, barreiras){
    if (!cena || !cena.physics || !cena.physics.add) {
        console.warn("criar_barreiras_online chamada numa cena sem física arcade habilitada — ignorando.");
        return;
    }

    if (!cena.barreiras_online) {
        cena.barreiras_online = new Map();
    }
    if (!cena.barreiras_destruidas_ids) {
        cena.barreiras_destruidas_ids = new Set();
    }

    if (!barreiras) {
        console.warn("[criar_barreiras_online] barreiras veio null/undefined, servidor não mandou nada.");
        return;
    }

    // aceita tanto objeto { id: {...} } (mesmo formato de atualizarInimigos)
    // quanto array [{...}, {...}], caso o servidor mande de um jeito ou de outro.
    const entradas = Array.isArray(barreiras)
        ? barreiras.map((atributos, indice) => [atributos?.id ?? indice, atributos])
        : Object.entries(barreiras);

    entradas.forEach(([id_barreira, atributos]) => {
        if (!atributos) return;

        // já foi destruída (chegou a 0 hp) e a gente já tirou ela da cena — o
        // servidor pode continuar listando por mais um tempo, mas ela não
        // deve voltar a aparecer (mesma proteção usada em atualizar_inimigos_online).
        if (cena.barreiras_destruidas_ids.has(id_barreira)) return;

        // já existe na cena: só sincroniza a vida (ver sincronizar_vida_barreira).
        if (cena.barreiras_online.has(id_barreira)) {
            sincronizar_vida_barreira(cena, cena.barreiras_online.get(id_barreira), atributos.vida);
            return;
        }

        // chegou já destruída (0 hp ou menos): nem cria.
        if (typeof atributos.vida === "number" && atributos.vida <= 0) return;

        let barreira = cena.physics.add.sprite( atributos.x, atributos.y, "barreira" );

        // adiciona ao grupo ANTES de configurar o body: o group aplica os
        // defaults dele (immovable false, gravidade ligada etc.) quando o
        // sprite entra, e isso desfazia o setImmovable(true) — a barreira
        // virava empurrável e não segurava o jogador (mesmo cuidado das latas).
        cena.grupo_barreiras?.add(barreira);

        barreira.setScale(0.2);
        barreira.setPushable(false);
        barreira.setImmovable(true);
        barreira.body.setAllowGravity(false);

        barreira.id = id_barreira;
        barreira.hp_total = atributos.vida;
        barreira.hp_atual = atributos.vida;
        barreira.defesa = atributos.defesa;
        barreira.tipo = "barreira";


        barreira.body.setSize(400, 400);

        barreira.foi_atingida = false;
        barreira.destruida = false;
        barreira.removido = false;
        barreira.invencibilidade = false;
        barreira.ultimo_golpe_em = null;

        cena.barreiras_online.set(id_barreira, barreira);
    });

    // BUGFIX: antes disso a função só olhava pra quem VEIO na mensagem — se o
    // servidor simplesmente parasse de listar uma barreira que morreu (em vez
    // de mandar um "atualizarBarreiras" com vida: 0 pra ela), o sprite ficava
    // pra sempre na cena: a reação de dano acontecia normalmente, mas ela
    // nunca era destruída. Mesma lógica de remover_inimigos_que_sumiram, só
    // que pra barreira (ver remover_barreiras_que_sumiram logo abaixo).
    const ids_presentes = entradas.filter(([, atributos]) => atributos).map(([id_barreira]) => id_barreira);
    remover_barreiras_que_sumiram(cena, ids_presentes);

    // Limpa a lista de "já destruída" dos ids que o servidor parou de listar —
    // ele já apagou de vez, não tem mais risco de recriar, e a lista não
    // cresce pra sempre (mesma ideia de atualizar_inimigos_online).
    const presentes = new Set(ids_presentes);
    cena.barreiras_destruidas_ids.forEach(id => {
        if (!presentes.has(id)) cena.barreiras_destruidas_ids.delete(id);
    });
}

// Compara quem tá desenhado na cena com a lista mais recente que o servidor
// mandou (ids_atuais) e trata quem sumiu — ou seja, quem o servidor não
// mandou mais dessa vez (mesma ideia de remover_inimigos_que_sumiram, só que
// pra barreira). É isso que resolve o bug de barreira "imortal": sem essa
// função, uma barreira que o servidor parasse de listar (sem nunca mandar
// vida: 0 pra ela) nunca era removida da cena.
function remover_barreiras_que_sumiram(cena, ids_atuais) {
    if (!cena.barreiras_online || cena.barreiras_online.size === 0) return;

    const presentes = new Set(ids_atuais);

    // Array.from = "foto" do Map, porque remover_barreira_da_cena mexe nele
    // enquanto a gente percorre.
    Array.from(cena.barreiras_online.values()).forEach(barreira => {
        if (presentes.has(barreira.id)) return;

        // já tá quebrando (tocando a animação) ou já foi removida: ela mesma
        // se tira da cena no fim da animação, não precisa fazer nada aqui.
        if (barreira.destruida) return;

        // Se a barreira sumiu da lista LOGO DEPOIS de apanhar, quase certo que
        // foi o golpe que destruiu ela (o servidor pode simplesmente parar de
        // listar quem morreu, sem mandar antes um "vida: 0"). Deixa ela tocar
        // a animação de quebrada em vez de só sumir do nada.
        const foi_atingida_agora = barreira.ultimo_golpe_em !== null
            && (cena.time.now - barreira.ultimo_golpe_em) < 3000;

        if (foi_atingida_agora) {
            barreira_quebrada_online(cena, barreira);
            return;
        }

        remover_barreira_da_cena(cena, barreira);
    });
}

// Chamar todo frame a partir de Rua_online (update()), igual
// verificar_ataque_inimigos — só o jogador LOCAL avisa o servidor (cada
// client só é dono do próprio golpe).
export function verificar_ataque_barreiras(cena){
    if(!cena.grupo_barreiras || cena.grupo_barreiras.getLength() === 0) return;

    const atacante = cena.jogador;
    if(!atacante || !atacante.body || atacante.derrotado) return;

    // só interessa um golpe já CONFIRMADO pelo servidor e com a hitbox ligada
    // (ver executar_golpe) — enquanto só tá "pendente", area_ataque tá desligada
    if(!atacante.atacando || !atacante.area_ataque?.body?.enable) return;

    if(!atacante.barreiras_acertadas) atacante.barreiras_acertadas = new Set();

    cena.grupo_barreiras.getChildren().forEach(barreira => {
        if(!barreira.active || barreira.destruida) return;

        // cada golpe só "conta" uma vez por barreira, mesmo com a hitbox
        // ligada por vários frames (senão mandaria golpearBarreira em loop)
        if(atacante.barreiras_acertadas.has(barreira.id)) return;

        // barreira não tem area_dano própria (ela é o próprio corpo físico,
        // ver criar_barreiras_online) — o overlap é direto com o sprite.
        if(!cena.physics.overlap(atacante.area_ataque, barreira)) return;

        atacante.barreiras_acertadas.add(barreira.id);

        // Barreira já tá invencível (acabou de apanhar há pouco, cooldown de
        // ataque ainda rodando): o golpe encosta normalmente, só não causa
        // dano nenhum — sem avisar o servidor, sem reação visual extra.
        // Mesmo esquema do inimigo (ver verificar_ataque_inimigos).
        if(barreira.invencibilidade){
            return;
        }

        if(!cena.mostrar_sala || cena.mostrar_sala.readyState !== WebSocket.OPEN){
            console.warn("[verificar_ataque_barreiras] socket não tá aberto, não deu pra avisar o servidor do golpe.");
            return;
        }

        const dano = calcular_dano_jogador_barreira(cena, atacante, barreira);

        console.log(`[verificar_ataque_barreiras] golpe "${atacante.tipo_ataque}" acertou a barreira (id: ${barreira.id}) — avisando o servidor. dano: ${dano}`);

        cena.mostrar_sala.send(JSON.stringify({
            tipo: "golpearBarreira",
            idBarreira: barreira.id,
            dano: dano
        }));

        // reação imediata (sem esperar o servidor) — o hp em si só muda quando
        // o servidor mandar a vida nova via "atualizarBarreiras"
        barreira_tomando_dano_online(cena, barreira);
    });
}

// Calcula quanto de dano o "atacante" (jogador) causaria na "barreira". MESMA
// fórmula usada em calcular_dano_jogador_inimigo (ataque * (100 / (100 +
// defesa)), piso de 1 de dano) — só que aqui quem apanha é uma barreira em
// vez de um inimigo. Calculado aqui no FRONT: o valor já vai pronto no campo
// "dano" da mensagem "golpearBarreira" — o servidor só aplica, não recalcula.
function calcular_dano_jogador_barreira(cena, atacante, barreira) {
    //buff de ataque aumenta o ataque do jogador em 2%, sempre arredondado pra numero inteiro
    let ataque = cena.buff_ataque? Math.round(atacante.ataque * 1.02) : atacante.ataque;
    const defesa = barreira.defesa ?? 0;
    return Math.floor(Math.max(1, ataque * (100 / (100 + defesa))));
}

// Reação da barreira ao levar um golpe — MESMO esquema de inimigo_tomando_dano_online:
// liga o flash (pisca) e entra em invencibilidade por um tempo (cooldown de
// ataque: enquanto tá invencível, nenhum golpe novo causa dano nela), voltando
// ao normal sozinha depois (ver barreira_invencivel_online). Única diferença
// pro inimigo: SEM empurrão, já que barreira é immovable e não anda.
function barreira_tomando_dano_online(cena, barreira){
    if(!barreira || !barreira.active || barreira.destruida) return;
    if(barreira.invencibilidade) return;

    barreira.foi_atingida = true;
    barreira.invencibilidade = true;
    barreira.ultimo_golpe_em = cena.time.now;
    console.log("VIDA DA BARREIRA!!!!: ", barreira.hp_atual);

    inimigo_flash_dano(cena, barreira);

    if(cena.anims.exists("barreira_atingida")){
        barreira.play("barreira_atingida");

        // MESMO esquema do offline (ver batendo_barreira em funcoes.js): assim
        // que a animação de "atingida" termina de tocar sozinha, volta pro
        // frame 0 (normal) — nada de animação de "parada" nenhuma, só isso.
        barreira.once("animationcomplete-barreira_atingida", ()=>{
            barreira.foi_atingida = false;
            barreira.setFrame(0);
        });
    } else {
        console.warn("[barreira_tomando_dano_online] animação \"barreira_atingida\" não existe.");
    }

    cena.time.delayedCall(500, ()=>{
        barreira_invencivel_online(barreira);
    });
}

// Fim do cooldown de ataque: para o flash (pra não ficar piscando pra
// sempre) e libera a barreira pra poder levar dano de novo. A volta da
// animação de "atingida" pro normal NÃO depende disso — ela já se resolve
// sozinha no "animationcomplete" logo acima, igual ao offline.
function barreira_invencivel_online(barreira){
    //protecao: a barreira pode ter sido destruida (chegou a 0 hp) antes desse delayedCall disparar
    if(!barreira || !barreira.active || barreira.destruida) return;

    inimigo_parar_flash_dano(barreira);
    barreira.invencibilidade = false;
}

// Confronta a vida que o servidor mandou (via "atualizarBarreiras") com a que
// a gente tem desenhada:
//  - vida caiu até 0 (ou menos) -> tira a barreira da cena
//  - vida só caiu (sem zerar)   -> reação de dano (flash + cooldown de ataque,
//    ver barreira_tomando_dano_online) — cobre o caso de OUTRO jogador da
//    sala ter golpeado a barreira; se foi a gente que bateu, já reagiu na
//    hora e a invencibilidade em curso faz essa chamada não fazer nada.
export function sincronizar_vida_barreira(cena, barreira, vida){
    if(typeof vida !== "number") return;

    const vida_antes = barreira.hp_atual;
    if(vida === vida_antes) return;

    barreira.hp_atual = vida;
    // o servidor só manda a vida atual (não a máxima). Se a gente viu a
    // barreira pela primeira vez já com dano, o "total" começa menor do que
    // deveria — só cresce, nunca encolhe (mesma lógica de sincronizar_vida_inimigo).
    if(vida > barreira.hp_total) barreira.hp_total = vida;

    if(vida > vida_antes) return; // só "curou", nada de reação

    if(vida <= 0){
        barreira_quebrada_online(cena, barreira);
        return;
    }

    barreira_tomando_dano_online(cena, barreira);
}

// BUGFIX: antes disso, a vida chegando a 0 tirava a barreira da cena NA HORA
// (chamava remover_barreira_da_cena direto, sem nunca tocar animação nenhuma)
// — e se o servidor não mandasse esse "vida: 0" e só parasse de listar a
// barreira, ela nem chegava a ser removida (ver remover_barreiras_que_sumiram
// lá em cima). Agora: toca "barreira_quebrada", desliga a colisão (pra dar
// pra atravessar o buraco que ela deixou) e só destrói o sprite de verdade
// no fim da animação (ver remover_barreira_da_cena).
function barreira_quebrada_online(cena, barreira){
    if(!barreira || !barreira.active || barreira.destruida) return;

    console.log(`[barreira_quebrada_online] barreira (id: ${barreira.id}) chegou a 0 (ou menos) de vida.`);

    barreira.destruida = true;
    barreira.invencibilidade = true; // não pode mais ser acertada
    barreira.hp_atual = 0;

    // O servidor pode continuar mandando esse id na lista por mais um tempo
    // depois de destruída — sem guardar o id, criar_barreiras_online
    // recriaria a barreira assim que a gente removesse o sprite.
    if(!cena.barreiras_destruidas_ids) cena.barreiras_destruidas_ids = new Set();
    cena.barreiras_destruidas_ids.add(barreira.id);

    inimigo_parar_flash_dano(barreira);

    // libera a passagem assim que ela começa a quebrar, não só no fim da animação.
    if(barreira.body) barreira.body.enable = false;

    if(cena.anims.exists("barreira_quebrada")){
        barreira.play("barreira_quebrada");
    } else {
        console.warn("[barreira_quebrada_online] animação \"barreira_quebrada\" não existe.");
    }

    cena.time.delayedCall(1000, ()=>{
        //protecao: a barreira pode já ter sido destruída (ex: saiu da sala) antes desse delayedCall disparar
        if(!barreira || !barreira.active){
            return;
        }
        remover_barreira_da_cena(cena, barreira);
    });
}

// Tira a barreira da cena de vez (destrói o sprite e sai do grupo_barreiras/
// Map de controle) — chamada no fim da animação de quebrada (ver
// barreira_quebrada_online) ou quando a barreira some da lista do servidor
// sem ter apanhado antes (ver remover_barreiras_que_sumiram). Equivalente de
// barreira pra remover_inimigo_da_cena.
//
// Usa um flag PRÓPRIO ("removido"), separado de "destruida": "destruida" já
// fica true assim que a vida zera (pra travar novos golpes e a criação de
// duplicata — ver barreira_quebrada_online), mas o sprite em si só é
// destruído de verdade aqui, no fim da animação. Se essa função checasse
// "destruida" pra evitar rodar duas vezes, ela nunca chegaria a rodar (esse
// era o bug: a barreira "quebrava" mas o sprite ficava preso na cena).
export function remover_barreira_da_cena(cena, barreira) {
    if (!barreira || barreira.removido) return;
    barreira.removido = true;
    barreira.destruida = true;
    barreira.hp_atual = 0;

    console.log(`[remover_barreira_da_cena] barreira (id: ${barreira.id}) removida da cena.`);

    if(!cena.barreiras_destruidas_ids) cena.barreiras_destruidas_ids = new Set();
    cena.barreiras_destruidas_ids.add(barreira.id);

    // pisca de dano ainda rodando = timer órfão chamando setTint num sprite destruído
    inimigo_parar_flash_dano(barreira);
    cena.tweens?.killTweensOf(barreira);

    barreira.destroy();

    cena.barreiras_online?.delete(barreira.id);
}

// Cria as latas de lixo que ainda não existem na cena e SINCRONIZA a vida das
// que já existem — mesma ideia de criar_barreiras_online. "itens" pode ser um
// map/objeto { [id]: { x, y, skin, nome, vida, defesa } } ou um array com "id"
// em cada item. Latas que o servidor parou de listar são removidas da cena.
export function criar_lixeiras_online(cena, itens){
    if (!cena.physics || !cena.grupo_latas) {
        console.warn("criar_lixeiras_online chamada numa cena sem física/grupo_latas — ignorando.");
        return;
    }
    if (!cena.latas_online) cena.latas_online = new Map();
    if (!cena.latas_destruidas_ids) cena.latas_destruidas_ids = new Set();

    if (!itens) {
        console.warn("[criar_lixeiras_online] itens veio null/undefined, servidor não mandou nada.");
        return;
    }

    const entradas = Array.isArray(itens)
        ? itens.map((atributos, indice) => [atributos?.id ?? indice, atributos])
        : Object.entries(itens);

    console.log("[DEBUG itens] atualizarItens chegou. ids listados:", entradas.map(([id]) => id));
    console.log("[DEBUG itens] latas_online:", Array.from(cena.latas_online.keys()),
        "| itens_online:", Array.from(cena.itens_online?.keys() ?? []),
        "| latas_destruidas_ids:", Array.from(cena.latas_destruidas_ids));

    entradas.forEach(([id_lata, atributos]) => {
        if (!atributos) return;

        // já foi quebrada e tirada da cena: o servidor pode continuar listando
        // por um tempo, mas ela não pode voltar a aparecer.
        if (cena.latas_destruidas_ids.has(id_lata)) return;

        // já existe na cena: sincroniza a vida (reage ao golpe de outro
        // jogador, ou quebra se a vida chegou a 0 — ver sincronizar_vida_lata)
        if (cena.latas_online.has(id_lata)) {
            sincronizar_vida_lata(cena, cena.latas_online.get(id_lata), atributos.vida);
            return;
        }

        // chegou já quebrada (0 hp ou menos): nem cria.
        if (typeof atributos.vida === "number" && atributos.vida <= 0) return;

        const lata = cena.physics.add.sprite(atributos.x, atributos.y, atributos.lixeira).setScale(atributos.lixeira === "lata_1"? 0.2 : 0.25);

        // adiciona ao grupo ANTES de configurar o body: o group aplica os
        // defaults dele (immovable false etc.) quando o sprite entra
        cena.grupo_latas.add(lata);

        lata.setImmovable(true);
        lata.setPushable(false);
        lata.body.setAllowGravity(false);
        lata.body.setSize(150, 80);
        lata.body.setOffset(atributos.lixeira === "lata_1" ? 140 : 100, atributos.lixeira === "lata_1" ? 350 : 250);

        lata.id = id_lata;
        lata.tipo = "lata";
        lata.skin = atributos.lixeira;
        lata.item = atributos.nome;
        lata.item_skin = atributos.skin;
        lata.hp = atributos.vida;
        lata.defesa = atributos.defesa;

        lata.invencibilidade = false;
        lata.destruida = false;
        lata.removido = false;
        lata.ultimo_golpe_em = null;

        lata.setDepth(lata.y < 500? 0: 999);

        lata.area_dano = cena.add.zone(lata.x, lata.y, 30, 30);
        cena.physics.world.enable(lata.area_dano);
        lata.area_dano.body.setAllowGravity(false);

        cena.latas_online.set(id_lata, lata);
    });

    // Latas que o servidor parou de listar (ver remover_latas_que_sumiram).
    const ids_presentes = entradas.filter(([, atributos]) => atributos).map(([id_lata]) => id_lata);
    remover_latas_que_sumiram(cena, ids_presentes);

    // Itens (latas já quebradas) que o servidor parou de listar = outro jogador
    // pegou. Mesma ideia de remover_inimigos_que_sumiram.
    remover_itens_que_sumiram(cena, ids_presentes);

    // Guarda a última lista de ids que o servidor mandou. Na hora que a lata vira
    // item (1s depois do golpe), transformar_lata_em_item_online consulta isso
    // pra saber se o servidor tinha o item na lista.
    cena.ids_itens_listados = new Set(ids_presentes);

    // Limpa dos "já quebrada" os ids que o servidor já parou de listar.
    const presentes = new Set(ids_presentes);
    cena.latas_destruidas_ids.forEach(id => {
        if (!presentes.has(id)) cena.latas_destruidas_ids.delete(id);
    });
}

// ================= Bater nas lixeiras (latas) online =================
//
// MESMO esquema de bater no inimigo/barreira: só o jogador LOCAL avisa o
// servidor ("golpearItem"), e reage na hora (animação "lata_x_batendo") sem
// esperar resposta. A vida de verdade é do SERVIDOR: ele manda
// "atualizarItens" com a vida nova, e é aí que as outras telas veem a lata
// apanhar (ver sincronizar_vida_lata). Vida <= 0 -> toca "lata_x_quebrada",
// a lata VIRA o item dela (lata.item / lata.item_skin).
// Diferença pro inimigo: SEM empurrão (a lata é immovable).

// Chamar todo frame a partir de Rua_online (update()).
export function verificar_ataque_latas(cena){
    if(!cena.latas_online || cena.latas_online.size === 0) return;

    const atacante = cena.jogador;
    if(!atacante || !atacante.body || atacante.derrotado) return;

    // só interessa golpe já CONFIRMADO pelo servidor e com a hitbox ligada
    if(!atacante.atacando || !atacante.area_ataque?.body?.enable) return;

    if(!atacante.latas_acertadas) atacante.latas_acertadas = new Set();

    cena.latas_online.forEach(lata => {
        if(!lata.active || lata.destruida) return;
        if(!lata.area_dano?.body) return;

        // cada golpe só "conta" uma vez por lata (senão mandaria golpearItem em loop)
        if(atacante.latas_acertadas.has(lata.id)) return;

        if(!cena.physics.overlap(atacante.area_ataque, lata.area_dano)) return;

        atacante.latas_acertadas.add(lata.id);

        // lata acabou de apanhar: o golpe encosta, mas não causa dano nem avisa o servidor
        if(lata.invencibilidade) return;

        if(!cena.mostrar_sala || cena.mostrar_sala.readyState !== WebSocket.OPEN){
            console.warn("[verificar_ataque_latas] socket não tá aberto, não deu pra avisar o servidor do golpe.");
            return;
        }

        const dano = calcular_dano_jogador_lata(cena, atacante, lata);

        console.log(`[verificar_ataque_latas] golpe \"${atacante.tipo_ataque}\" acertou a lata (id: ${lata.id}) — avisando o servidor. dano: ${dano}`);

        cena.mostrar_sala.send(JSON.stringify({
            tipo: "golpearItem",
            idItem: lata.id,
            dano: dano
        }));

        // reação imediata — o hp em si só muda quando o servidor mandar a vida nova
        lata_tomando_dano_online(cena, lata);
    });
}

// MESMA fórmula de calcular_dano_jogador_inimigo/barreira.
function calcular_dano_jogador_lata(cena, atacante, lata) {
    //buff de ataque aumenta o ataque do jogador em 2%, sempre arredondado pra numero inteiro
    let ataque = cena.buff_ataque? Math.round(atacante.ataque * 1.02) : atacante.ataque;
    const defesa = lata.defesa ?? 0;
    return Math.floor(Math.max(1, ataque * (100 / (100 + defesa))));
}

// Animação "lata_x_batendo" + breve invencibilidade (enquanto isso, golpes
// novos não causam dano), igual ao offline (foi_atacada) e à barreira.
function lata_tomando_dano_online(cena, lata){
    if(!lata || !lata.active || lata.destruida) return;
    if(lata.invencibilidade) return;

    lata.invencibilidade = true;
    lata.ultimo_golpe_em = cena.time.now;

    const anim = `${lata.skin}_batendo`; // lata.skin já é "lata_1" / "lata_2"

    if(cena.anims.exists(anim)){
        lata.play(anim);
        lata.once(`animationcomplete-${anim}`, ()=>{
            if(lata.active && !lata.destruida) lata.setFrame(0);
        });
    } else {
        console.warn(`[lata_tomando_dano_online] animação "${anim}" não existe.`);
    }

    if(cena.cache?.audio?.exists("quebrando")) cena.sound.play("quebrando");

    cena.time.delayedCall(500, ()=>{
        if(!lata || !lata.active || lata.destruida) return;
        lata.invencibilidade = false;
    });
}

// Confronta a vida que o servidor mandou ("atualizarItens") com a da cena:
// vida <= 0 -> quebra; vida caiu -> reação (cobre golpe de OUTRO jogador; se
// foi a gente que bateu, a invencibilidade em curso faz isso não repetir).
export function sincronizar_vida_lata(cena, lata, vida){
    if(typeof vida !== "number") return;
    if(lata.destruida) return;

    const vida_antes = lata.hp;
    if(vida === vida_antes) return;

    lata.hp = vida;

    if(vida > vida_antes) return; // só "curou", nada de reação

    if(vida <= 0){
        lata_quebrada_online(cena, lata);
        return;
    }

    lata_tomando_dano_online(cena, lata);
}

// Lata chegou a 0 de vida: toca "lata_x_quebrada"; no fim da animação a lata
// VIRA o item dela (ver transformar_lata_em_item_online).
function lata_quebrada_online(cena, lata){
    if(!lata || !lata.active || lata.destruida) return;

    console.log(`[lata_quebrada_online] lata (id: ${lata.id}) chegou a 0 de vida.`);

    lata.destruida = true;
    lata.invencibilidade = true;
    lata.hp = 0;

    // o servidor pode continuar listando esse id um tempo — sem guardar, a lata voltaria
    if(!cena.latas_destruidas_ids) cena.latas_destruidas_ids = new Set();
    cena.latas_destruidas_ids.add(lata.id);

    // libera a passagem e para de receber golpes assim que começa a quebrar
    if(lata.body) lata.body.enable = false;
    if(lata.area_dano?.body) lata.area_dano.body.enable = false;

    const finalizar = ()=>{
        if(!lata || lata.removido) return;
        // a lata vira o item (mesmo sprite); se não tiver item/textura, só some
        if(!transformar_lata_em_item_online(cena, lata)){
            remover_lata_da_cena(cena, lata);
        }
    };

    const anim = `${lata.skin}_quebrada`;

    if(!cena.anims.exists(anim)){
        console.warn(`[lata_quebrada_online] animação "${anim}" não existe.`);
        finalizar();
        return;
    }

    lata.play(anim);
    if(cena.cache?.audio?.exists("quebrado")) cena.sound.play("quebrado");

    lata.once(`animationcomplete-${anim}`, finalizar);

    // rede de segurança: se o animationcomplete não disparar, finaliza do mesmo jeito
    cena.time.delayedCall(1500, finalizar);
}

// Trata lata que o servidor parou de listar (ver criar_lixeiras_online) — mesma
// lógica de remover_barreiras_que_sumiram: se sumiu logo depois de apanhar,
// foi o golpe que quebrou (toca a animação e dropa o item); senão só remove.
function remover_latas_que_sumiram(cena, ids_atuais){
    if(!cena.latas_online || cena.latas_online.size === 0) return;

    const presentes = new Set(ids_atuais);

    Array.from(cena.latas_online.values()).forEach(lata => {
        if(presentes.has(lata.id)) return;
        if(lata.destruida) return; // já tá quebrando, ela mesma se remove no fim

        const foi_atingida_agora = lata.ultimo_golpe_em !== null
            && (cena.time.now - lata.ultimo_golpe_em) < 3000;

        if(foi_atingida_agora){
            lata_quebrada_online(cena, lata);
            return;
        }

        remover_lata_da_cena(cena, lata);
    });
}

// Item (lata que já virou item) que o servidor parou de listar em
// "atualizarItens": outro jogador pegou (ou o servidor apagou). Some da cena
// sem aplicar efeito nenhum — o efeito é só de quem pegou.
//
// ATENÇÃO: igual aos inimigos, depende do servidor mandar a lista COMPLETA
// de itens a cada "atualizarItens".
function remover_itens_que_sumiram(cena, ids_atuais){
    if(!cena.itens_online || cena.itens_online.size === 0){
        console.log("[DEBUG itens] remover_itens_que_sumiram: itens_online vazio, nada a checar.");
        return;
    }

    const presentes = new Set(ids_atuais);

    // Array.from = "foto" do Map, porque remover_item_da_cena mexe nele
    Array.from(cena.itens_online.values()).forEach(item => {
        console.log(`[DEBUG itens] checando item (id: ${item.id}) | na lista? ${presentes.has(item.id)} | coletado: ${!!item.coletado} | active: ${item.active}`);

        if(presentes.has(item.id)) return;
        if(item.coletado) return; // eu mesmo peguei: destruir_item_online já cuida

        console.log(`[remover_itens_que_sumiram] item (id: ${item.id}) não tá mais na lista do servidor — removendo da cena.`);
        remover_item_da_cena(cena, item);
    });
}

// Tira UM item da cena de vez (sprite + registros). Equivalente de
// remover_lata_da_cena, só que pro item que a lata virou.
export function remover_item_da_cena(cena, item){
    if(!item || item.removido_item) return;
    item.removido_item = true;

    console.log(`[DEBUG itens] remover_item_da_cena: removendo item (id: ${item.id}).`);

    // guarda o id: um "atualizarItens" atrasado ainda pode listar o item,
    // e ele não pode voltar a aparecer.
    if(!cena.latas_destruidas_ids) cena.latas_destruidas_ids = new Set();
    cena.latas_destruidas_ids.add(item.id);

    cena.itens_online?.delete(item.id);
    cena.grupo_itens?.remove(item);

    item.destroy();
}

// Tira a lata da cena de vez (sprite, hitbox e registro nos Maps/grupo).
export function remover_lata_da_cena(cena, lata){
    if(!lata || lata.removido) return;
    lata.removido = true;
    lata.destruida = true;

    if(!cena.latas_destruidas_ids) cena.latas_destruidas_ids = new Set();
    cena.latas_destruidas_ids.add(lata.id);

    cena.latas_online?.delete(lata.id);
    cena.grupo_latas?.remove(lata);

    if(lata.area_dano) lata.area_dano.destroy();
    lata.destroy();
}

// Textura do item: itens com variação usam "nome_skin" (agua_1, moeda_2...);
// poções não têm skin e usam só o nome (pocao_ataque).
function textura_do_item(cena, nome, skin){
    // tenta, nessa ordem: a skin como textura completa (ex: "agua_1"), "nome_skin"
    // e só o nome (poções não têm skin — a textura é só "pocao_ataque", etc.)
    const candidatas = [skin, `${nome}_${skin}`, nome];

    for(const candidata of candidatas){
        if(candidata !== undefined && candidata !== null && candidata !== "" && cena.textures.exists(candidata)){
            return candidata;
        }
    }
    return null;
}

// A lata QUEBRADA vira o item: o próprio sprite da lata troca de textura, a
// área de dano dela some e o body passa a ter o tamanho do item (igual ao
// offline: setBodySize(width, height)). O item vem do SERVIDOR
// (lata.item / lata.item_skin), então vira o mesmo item pra todos.
// Devolve true se virou item, false se não deu (sem item ou sem textura) —
// nesse caso quem chamou remove a lata.
function transformar_lata_em_item_online(cena, lata){
    if(!lata || !lata.active || !lata.item) return false;

    if(!cena.itens_online) cena.itens_online = new Map();
    if(cena.itens_online.has(lata.id)) return false;

    // const textura = textura_do_item(cena, lata.item, lata.item_skin);
    const textura = lata.item_skin;
    if(!textura){
        console.warn("[transformar_lata_em_item_online] não achei textura pro item:", { nome: lata.item, skin: lata.item_skin });
        return false;
    }

    // não é mais lata: sai do controle das latas e do collider delas
    // (senão o item bloquearia a passagem como a lata bloqueava)
    lata.removido = true;
    cena.latas_online?.delete(lata.id);
    cena.grupo_latas?.remove(lata);

    // a área de dano some
    if(lata.area_dano){
        lata.area_dano.destroy();
        lata.area_dano = null;
    }

    // para a animação de quebrada e limpa o que era de lata
    lata.anims.stop();
    lata.off(`animationcomplete-${lata.skin}_batendo`);
    lata.hp = undefined;
    lata.defesa = undefined;
    lata.invencibilidade = false;

    // vira o item: textura, escala e body do tamanho do item
    const y = lata.y < 600 ? lata.y + 20 : lata.y;
    lata.setTexture(textura);
    lata.setScale(0.2);
    lata.setPosition(lata.x, y);

    lata.body.enable = true;
    lata.body.reset(lata.x, y);
    lata.setImmovable(false);
    lata.setBodySize(lata.width, lata.height);

    lata.tipo = lata.item; // mesmo "tipo" do item no offline (agua, moeda...)
    lata.setDepth(lata.y);

    cena.grupo_itens?.add(lata);
    lata.body.setAllowGravity(false);
    lata.setVelocity(0);

    cena.itens_online.set(lata.id, lata);

    console.log(`[DEBUG itens] lata (id: ${lata.id}) virou ITEM "${lata.item}" (textura: ${textura}) | ids da última lista:`, Array.from(cena.ids_itens_listados ?? []), "| itens_online agora:", Array.from(cena.itens_online.keys()));
    return true;
}

// ================= Buffs e debuffs online (itens das lixeiras) =================
//
// Mesmo sistema do offline (ver efeitos / criar_buff_e_debuff em funcoes.js):
// mesmas flags na cena (buff_ataque, buff_defesa, buff_velocidade,
// buff_regeneracao, debuff_envenenado), mesmos ícones/timers no #efeitos.
//
// Diferenças pro offline:
//  - os efeitos são só do jogador LOCAL (cada client cuida dos seus);
//  - o HP é do SERVIDOR: cura vai por "recuperarVida" e dano (veneno) por
//    "levarDano", e o hp local é abatido na hora só pra barra não atrasar
//    (o servidor confirma depois em atualizar_jogadores_online);
//  - buff de velocidade já é lido em Rua_online.js (mover_jogador_local);
//    buff de ataque/defesa entram direto nos calcular_dano_* (mesma conta do
//    dano_jogador/dano_inimigo do offline: valor * 1.02 arredondado).

// Zera todos os efeitos: timers, eventos e ícones. Chamada no create() da
// Rua_online (partida nova), quando o jogador local morre e no shutdown da cena.
// (Antes esse reset ficava dentro de criar_jogador_online, que roda pra CADA
// jogador da sala — entrar outro jogador zerava os efeitos do jogador local.)
export function efeitos_online(cena){
    if(cena.buff_ataque_timer){
        clearInterval(cena.buff_ataque_timer);
    }
    if(cena.buff_defesa_timer){
        clearInterval(cena.buff_defesa_timer);
    }
    if(cena.buff_velocidade_timer){
        clearInterval(cena.buff_velocidade_timer);
    }
    if(cena.buff_regeneracao_timer){
        clearInterval(cena.buff_regeneracao_timer);
    }
    if(cena.buff_regeneracao_cura){
        cena.buff_regeneracao_cura.remove();
    }
    if(cena.debuff_envenenado_timer){
        clearInterval(cena.debuff_envenenado_timer);
    }
    if(cena.debuff_veneno_dano){
        cena.debuff_veneno_dano.remove();
    }

    //remove qualquer icone de buff/debuff que tenha ficado na tela da partida anterior
    const container_efeitos = document.getElementById("efeitos");
    if(container_efeitos){
        container_efeitos.innerHTML = "";
    }

    cena.buff_ataque = false;
    cena.buff_ataque_timer = null;

    cena.buff_defesa = false;
    cena.buff_defesa_timer = null;

    cena.buff_velocidade = false;
    cena.buff_velocidade_timer = null;

    cena.buff_regeneracao = false;
    cena.buff_regeneracao_timer = null;
    cena.buff_regeneracao_cura = null;

    cena.debuff_envenenado = false;
    cena.debuff_envenenado_timer = null;
    cena.debuff_veneno_dano = null;
}

function enviar_ao_servidor(cena, mensagem){
    if(!cena.mostrar_sala || cena.mostrar_sala.readyState !== WebSocket.OPEN){
        console.warn("[enviar_ao_servidor] socket não tá aberto, não deu pra mandar:", mensagem);
        return false;
    }
    cena.mostrar_sala.send(JSON.stringify(mensagem));
    return true;
}

// Cura o jogador local (limitada ao hp_total) e avisa o servidor quanto
// realmente curou ("recuperarVida").
function curar_jogador_online(cena, quantidade){
    const jogador = cena.jogador;
    if(!jogador || jogador.derrotado || quantidade <= 0) return;

    const antes = jogador.hp_atual;
    jogador.hp_atual = Math.min(jogador.hp_total, jogador.hp_atual + quantidade);
    const curado = jogador.hp_atual - antes;

    atualizar_barra_hp(cena);

    if(curado > 0){
        enviar_ao_servidor(cena, {
            tipo: "recuperarVida",
            vidaRecuperada: curado
        });
    }
}

// Dano do veneno (item ou tick do debuff) no jogador local: abate o hp,
// avisa o servidor ("levarDano"), mata se zerou, e senão faz o jogador
// reagir como se tivesse tomado um golpe (jogador_reagir_golpe do offline) —
// SEM dar invencibilidade, pra o veneno não deixar o jogador imune a golpes.
function dano_veneno_online(cena, dano){
    const jogador = cena.jogador;
    if(!jogador || jogador.derrotado) return;

    jogador.hp_atual = Math.max(0, jogador.hp_atual - dano);
    atualizar_barra_hp(cena);

    enviar_ao_servidor(cena, {
        tipo: "levarDano",
        dano: dano
    });

    if(jogador.hp_atual <= 0){
        jogador_derrotado_online(cena, jogador);
        return;
    }

    // já tá machucado por um golpe (ou por outro tick): só o dano conta
    if(jogador.machucado) return;

    // interrompe o golpe em andamento, igual aplicar_reacao_dano
    jogador.atacando = false;
    jogador.golpe_pendente = null;
    limpar_fim_golpe(jogador);
    if(jogador.area_ataque?.body){
        jogador.area_ataque.body.enable = false;
    }

    jogador.setTint(0xff0000);
    jogador.machucado = true;
    jogador.setVelocity(0);

    const anim_machucado = jogador.genero === "feminino"
        ? `ramona_machucada_${jogador.skin}`
        : `scott_machucado_${jogador.skin}`;

    if(cena.anims.exists(anim_machucado)){
        jogador.play(anim_machucado, true).setFlipX(jogador.olhando);
    }

    cena.time.delayedCall(500, ()=>{
        if(!jogador.active || jogador.derrotado) return;
        jogador.machucado = false;
        // se um golpe de verdade ainda tá com invencibilidade, ele mesmo limpa o tint
        if(!jogador.invencibilidade){
            jogador.clearTint();
        }
    });
}

function criar_efeitos_no_dom(nome, tipo, efeito, alt, duracao, mensagem){
    const hud_efeitos = document.createElement("div");
    hud_efeitos.className = "efeitos";
    hud_efeitos.id = nome;

    const imagem_efeito = document.createElement("img");
    imagem_efeito.className = "icone_efeitos";
    imagem_efeito.src = `assets/conteudo/${tipo}/${efeito}.png`;
    imagem_efeito.alt = alt;

    let efeito_duracao = document.createElement("p");
    efeito_duracao.className = "duracao";
    efeito_duracao.innerHTML = duracao;

    let balao_efeitos = document.createElement("div");
    balao_efeitos.className = "balao";
    balao_efeitos.style.display = "none";

    let balao_triangulo = document.createElement("div");
    balao_triangulo.className = "triangulo";

    let conteudo_do_balao = document.createElement("div");
    conteudo_do_balao.classList.add("conteudo_balao");
    conteudo_do_balao.classList.add("pixel-borders");
    conteudo_do_balao.classList.add("pixel-borders--3");

    let texto_balao = document.createElement("p");
    texto_balao.innerHTML = mensagem;

    conteudo_do_balao.append(texto_balao);
    balao_efeitos.append(balao_triangulo, conteudo_do_balao);
    hud_efeitos.append(imagem_efeito, efeito_duracao, balao_efeitos);

    hud_efeitos.addEventListener("mouseenter", ()=>{
        balao_efeitos.style.display = "flex";
    });

    hud_efeitos.addEventListener("mouseleave", ()=>{
        balao_efeitos.style.display = "none";
    });

    // pegar_container_efeitos().append(hud_efeitos);

    document.getElementById("efeitos").append(hud_efeitos);

    return{
        elemento: hud_efeitos,
        texto_duracao: efeito_duracao
    };
}

function criar_timer(duracao, texto_duracao, elemento, fim){
    let tempo = duracao;
    texto_duracao.textContent = tempo + "s";

    let timer = setInterval(()=>{
        tempo--;
        texto_duracao.textContent = tempo + "s";
        if(tempo <= 0){
            clearInterval(timer);
            elemento.remove();

            if(fim){
                fim();
            }
        }
    }, 1000);
    return timer;
}

function criar_buff_e_debuff_online(cena, tipo){
    // console.log("[criar_buff_e_debuff_online] item pego, tipo:", tipo, "| jogador derrotado?", cena.jogador?.derrotado);


    if(!cena.jogador || cena.jogador.derrotado) {
        return;
    }

    let efeito;
    switch(tipo){
        case "pocao_ataque":
            if(cena.buff_ataque){
                return;
            }
            cena.buff_ataque = true;
            efeito = criar_efeitos_no_dom("ataque", "Buffs", "ataque", "Buff de ataque", "60s", "<u>+&nbsp;Ataque</u><br><br>Violência sempre é a resposta!");
            cena.buff_ataque_timer = criar_timer(60, efeito.texto_duracao, efeito.elemento, ()=>{
                cena.buff_ataque = false;
            });
            break;
        case "pocao_defesa":
            if(cena.buff_defesa){
                return;
            }
            cena.buff_defesa = true;
            efeito = criar_efeitos_no_dom("defesa", "Buffs", "defesa", "Buff de defesa", "60s", "<u>+&nbsp;Defesa</u><br><br>Os golpes agora machucam um tiquinho menos.");
            cena.buff_defesa_timer = criar_timer(60, efeito.texto_duracao, efeito.elemento, ()=>{
                cena.buff_defesa = false;
            });
            break;
        case "pocao_velocidade":
            if(cena.buff_velocidade){
                return;
            }
            cena.buff_velocidade = true;
            efeito = criar_efeitos_no_dom("velocidade", "Buffs", "velocidade", "Buff de velocidade", "60s", "<u>+&nbsp;Velocidade</u><br><br>Você agora corre perceptivelmente mais rápido.");
            cena.buff_velocidade_timer = criar_timer(60, efeito.texto_duracao, efeito.elemento, ()=>{
                cena.buff_velocidade = false;
            });
            break;
        case "pocao_regeneracao":
            if(cena.buff_regeneracao){
                return;
            }
            cena.buff_regeneracao = true;
            cena.buff_regeneracao_cura = cena.time.addEvent({
                delay: 2000,
                callback: ()=>{
                    curar_jogador_online(cena, 2);
                },
                callbackScope: cena,
                loop: true
            });
            efeito = criar_efeitos_no_dom("regeneracao", "Buffs", "regeneracao", "Buff de regeneracao", "60s", "<u>Regenereção</u><br><br> Você se sente extremamente saudavel. +2hp a cada 2 segundos!");
            cena.buff_regeneracao_timer = criar_timer(35, efeito.texto_duracao, efeito.elemento, ()=>{
                cena.buff_regeneracao = false;
                if(cena.buff_regeneracao_cura){
                    cena.buff_regeneracao_cura.remove();
                    cena.buff_regeneracao_cura = null;
                }
            });
            break;
        case "veneno":
            if(cena.debuff_envenenado){
                return;
            }
            cena.debuff_envenenado = true;
            cena.debuff_veneno_dano = cena.time.addEvent({
                delay: 2000,
                callback: ()=>{
                    dano_veneno_online(cena, 2);
                },
                callbackScope: cena,
                loop: true
            });
            efeito = criar_efeitos_no_dom("veneno", "Debuffs", "envenenado", "Debuff de veneno", "15s", "<u>Envenenado</u><br><br>Você comeu algo que não devia e foi envenenado! Parabéns pela péssima decisão.");
            cena.debuff_envenenado_timer = criar_timer(15, efeito.texto_duracao, efeito.elemento, ()=>{
                cena.debuff_envenenado = false;
                if(cena.debuff_veneno_dano){
                    cena.debuff_veneno_dano.remove();
                    cena.debuff_veneno_dano = null;
                }
            });
            break;
        default:
            return;
    }
}

// ================= Pegar item (lata quebrada que virou item) =================
//
// O item é o sprite da lata quebrada (ver transformar_lata_em_item_online):
// vive em cena.itens_online (por id) e em cena.grupo_itens, com item.tipo =
// nome do item ("agua", "pocao_ataque"...). Cura inicial por tipo (mesmos
// valores do offline): negativa = veneno.
function valor_cura_item(tipo){
    switch(tipo){
        case "agua":
            return 5;
        case "comida_fraca":
            return Phaser.Math.Between(5, 10);
        case "comida":
            return Phaser.Math.Between(10, 20);
        case "mel":
            return Phaser.Math.Between(20, 50);
        case "torta":
            return 50;
        case "veneno":
            return Phaser.Math.Between(-5, -3);
        case "pocao_regeneracao":
            return Phaser.Math.Between(5, 10);
        default:
            return 0; // moeda e poções de ataque/defesa/velocidade
    }
}

// Chamar todo frame a partir de Rua_online (update()). Só o jogador LOCAL
// pega item (cada client cuida do próprio efeito).
export function verificar_pegar_itens_online(cena){
    const jogador = cena.jogador;
    if(!jogador || !jogador.body || jogador.derrotado) return;
    if(!cena.itens_online || cena.itens_online.size === 0) return;

    cena.itens_online.forEach(item => {
        if(!item.active || item.coletado) return;
        if(!cena.physics.overlap(jogador, item)) return;

        interagindo_com_item_online(cena, item);
    });
}

// O servidor manda as poções com nome "pocao" e o tipo de verdade na skin
// (ex: "pocao_ataque", ou só "ataque"). Os outros itens vêm com o nome já
// certo ("agua", "veneno"...).
function tipo_real_do_item(item){
    if(item.tipo !== "pocao") return item.tipo;

    const skin = String(item.item_skin ?? "");
    return skin.startsWith("pocao_")? skin : `pocao_${skin}`;
}

// Equivalente online de interagindo_com_item (funcoes.js): cura/dano do item,
// liga o buff/debuff e some com o item. Pontuação e sfx ainda não existem
// na Rua_online, então ficam de fora.
function interagindo_com_item_online(cena, item){
    // trava já aqui pra não pegar o mesmo item em dois frames seguidos
    item.coletado = true;

    const tipo = tipo_real_do_item(item);
    console.log("[interagindo_com_item_online] nome:", item.tipo, "| skin:", item.item_skin, "| tipo usado:", tipo);

    const cura = valor_cura_item(tipo);

    if(cura > 0){
        curar_jogador_online(cena, cura);
    }
    else if(cura < 0){
        dano_veneno_online(cena, Math.abs(cura));
    }

    criar_buff_e_debuff_online(cena, tipo);
    destruir_item_online(cena, item);
}

// Avisa o servidor que o item foi pego ("pegouItem") e tira ele da cena.
// O id já está em latas_destruidas_ids (guardado quando a lata quebrou), então
// um "atualizarItens" atrasado não recria o item.
function destruir_item_online(cena, item){
    console.log(`[DEBUG itens] destruir_item_online: item (id: ${item?.id}) pego pelo jogador local, mandando "pegouItem".`);
    if(!item || item.removido_item) return;

    enviar_ao_servidor(cena, {
        tipo: "pegouItem",
        idItem: item.id
    });

    // remove sprite, registro em itens_online/grupo_itens e guarda o id em
    // latas_destruidas_ids (um "atualizarItens" atrasado não recria o item).
    remover_item_da_cena(cena, item);
}

//ir pro boss

// "foto" dos jogadores da cena agora: o que o boss precisa pra recriar cada um
// com o mesmo hp e o mesmo x de quando começou a rua.
function tirar_foto_jogadores(cena){
    return Array.from(cena.jogadores_online?.values() ?? [])
        .filter(j => j && j.active !== false)
        .map(j => ({
            id: j.id,
            nome: j.nome,
            hp: j.hp_atual,
            x: j.x_inicial ?? j.x,
            y: j.y,
            genero: j.genero,
            skin: j.skin,
            dano: j.ataque,
            local: j === cena.jogador
        }));
}

export function ir_boss(cena, marcacao){
    cena.physics.add.overlap(marcacao, cena.grupo_jogadores, (_marcacao, jogador)=>{
        // só o jogador LOCAL aciona (cada client checa o próprio overlap) e só uma vez:
        // sem essa trava o overlap roda todo frame e floda "lutarComBoss" no servidor
        if(jogador !== cena.jogador || cena.cutscene){
            return;
        }

        cena.cutscene = true;

        // foto dos jogadores (hp, x) no momento em que encostou na marcação
        cena.foto_jogadores_boss = tirar_foto_jogadores(cena);

        cena.cameras.main.fadeOut(1000, 0,0,0);

        if(cena.mostrar_sala && cena.mostrar_sala.readyState === WebSocket.OPEN){
            cena.mostrar_sala.send(JSON.stringify({
                tipo: "lutarComBoss"
            }));
        }
        else{
            console.warn("[ir_boss] socket fechado, não consegui mandar 'lutarComBoss'.");
        }
    }, null, cena);
}

// chamado pelo websocket.js quando o servidor manda "atualizarMapa" (vale pra TODOS
// os jogadores da sala, inclusive quem não encostou na marcação).
export function boss_entrando(cena, boss){
    if(!boss || cena.entrando_boss){
        return;
    }
    cena.entrando_boss = true;
    cena.cutscene = true;

    // a sala está indo pro boss: tira ela da lista de salas do front
    marcar_sala_em_boss();

    // foto dos jogadores: a do momento do toque (quem encostou), senão a de agora,
    // senão a última foto boa (caso a cena já tenha apagado todo mundo)
    let foto = cena.foto_jogadores_boss;
    if(!foto || foto.length === 0){
        foto = tirar_foto_jogadores(cena);
    }
    if(foto.length === 0){
        foto = cena.foto_jogadores_anterior ?? [];
    }
    console.log(`[boss_entrando] ${foto.length} jogador(es) vão pro boss:`, foto);

    const ir = ()=>{
        cena.scene.start(boss, {
            genero: cena.genero,
            skin: cena.skin,
            hp: cena.jogador?.hp_atual ?? foto.find(j => j.local)?.hp,
            bonus: cena.bonus,
            // jogadores com o hp e o x de quando entraram no boss
            jogadores: foto,
            // ESSENCIAL: reaproveita a conexão já aberta (mesmo esquema Jogo -> Rua_online)
            socket: cena.mostrar_sala
        });
    };

    const camera = cena.cameras.main;

    if(camera.fadeEffect.isComplete){
        // o fade (iniciado por quem encostou) já acabou antes da mensagem chegar
        ir();
    }
    else if(camera.fadeEffect.isRunning){
        camera.once("camerafadeoutcomplete", ir);
    }
    else{
        // jogador que não encostou: ainda não tem fade nenhum, faz agora
        camera.once("camerafadeoutcomplete", ir);
        camera.fadeOut(1000, 0,0,0);
    }
}


// ================= Contrato com o servidor =================
//
// dano no jogador (já existia):
//   tipo: "levarDano"
//   dano: int
//
// bater no inimigo:
//   tipo: "golpearInimigo"
//   idInimigo: string
//   golpe: string (o mesmo nome de golpe mandado em "tentarAtacar" — SOCO,
//     CHUTE_BAIXO, etc — só pra referência/animação, o servidor não usa mais
//     pra calcular o dano)
//   masculino: bool (true = personagem masculino/scott, false = feminino/ramona)
//   dano: int (calculado no FRONT — ver calcular_dano_jogador_inimigo — com
//     base no ataque do jogador e na defesa do inimigo; o servidor só
//     desconta esse valor da vida do inimigo, não recalcula)
//
// receber/atualizar inimigos:
//   tipo: "atualizarInimigos"
//   inimigos: { [id]: { nome, vida, dano, defesa, boss, pontosPorDerrotar, x, y, direcao, velocidade, ... } }
//   -> depois de um "golpearInimigo", o servidor precisa mandar um "atualizarInimigos"
//      novo com a vida já descontada (é assim que os OUTROS jogadores veem o inimigo apanhar).

// inimigo atacando (o servidor decide sozinho, sem pedido do client):
//   tipo: "inimigoVaiTentarGolpe"
//   idInimigo: string
//   golpe: string (JÁ é o nome da animação, ex: "raymond_golpe_1" —
//     diferente do golpe do jogador, aqui não tem tradução via CONFIG_GOLPES,
//     ver aplicar_golpe_inimigo_confirmado)
// receber/atualizar barreiras:
//   tipo: "atualizarBarreiras"
//   barreiras: { [id]: { vida, x, y, defesa } } (ou array com "id" em cada item)
//   -> depois de um "golpearBarreira", o servidor precisa mandar um "atualizarBarreiras"
//      novo com a vida já descontada, do mesmo jeito que faz com "atualizarInimigos"
//      depois de "golpearInimigo" — é assim que a barreira reage (ou some, se
//      a vida chegar a 0) tanto pra quem bateu quanto pros outros jogadores da sala.

// bater na barreira:
//   tipo: "golpearBarreira"
//   idBarreira: string
//   dano: int (calculado no FRONT — ver calcular_dano_jogador_barreira — com
//     base no ataque do jogador e na defesa da barreira, MESMA fórmula usada
//     em calcular_dano_jogador_inimigo; o servidor só desconta esse valor da
//     vida da barreira, não recalcula)

//latas de lixo
//tipo:"atualizarItens"
//envia: itens(é um map)

//tipo:"golpearItem"
//idItem: id do item(aqueles numeros grandes do map) — mandado como string, igual veio na chave do map
//dano: quanto de dano deu (calculado no FRONT, ver calcular_dano_jogador_lata)
//-> o servidor desconta a vida e manda "atualizarItens" de novo; vida <= 0 (ou lata sumindo da lista
//   logo depois do golpe) = lata quebra e vira o item (nome/skin).

//PARA PEGAR ITEM!!!

//cura (item de comida, água, poção de regeneração e tick da regeneração):
//tipo:"recuperarVida"
//vidaRecuperada: int (já limitada ao hp_total no front, ver curar_jogador_online)

//dano de veneno (item e ticks do debuff) usa o MESMO "levarDano" do PvP, em vez de
//recuperarVida negativo:
//tipo:"levarDano"
//dano: int

//para tirar o item (mandado quando o jogador local encosta nele, ver
//verificar_pegar_itens_online):
//tipo:"pegouItem"
//idItem: id do item (o mesmo id da lata que quebrou)

//boss

//tipo:lutarComBoss 
//ele deleta o mapa atual e carrega o novo do boss

//recebo:
//tipo: "atualizarMapa" agora envia no começo do mapa
//mapa:"cidade"
//

//no boss:
//mapa:cidadeBoss

//no "atualizarInmigos ele constroi o lucas lee(no mapa do boss)"