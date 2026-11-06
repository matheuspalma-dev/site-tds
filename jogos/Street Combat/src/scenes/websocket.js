import {criar_jogador_online, atualizar_jogadores_online, aplicar_golpe_confirmado, remover_jogador_da_cena, atualizar_inimigos_online, aplicar_golpe_inimigo_confirmado, criar_barreiras_online, criar_lixeiras_online, boss_entrando} from "./funcoes_online.js";


// Salas (identificadas pelo nome do criador) que já foram pro boss. Só o front controla isso:
// essas salas deixam de aparecer na lista de salas (ver atualizar_lista_salas).
const salas_em_boss = new Set();
let sala_atual = null;

// Guarda em qual sala este jogador está (nome do criador). Chamado ao criar/entrar numa sala.
export function marcar_sala_atual(nome_criador){
    sala_atual = nome_criador ?? null;
}

// Chamado quando a sala atual vai pro boss: ela some da lista de salas do front.
export function marcar_sala_em_boss(){
    if(sala_atual) salas_em_boss.add(sala_atual);
    remover_sala_do_html(sala_atual);
}

function remover_sala_do_html(nome_criador){
    if(!nome_criador) return;
    document.querySelectorAll("#parte_baixo .sala").forEach(sala_item => {
        if(sala_item.dataset.nomeCriador === nome_criador) sala_item.remove();
    });
}

// Avisos repetitivos ("guardada, mas NÃO desenhada agora") chegam a cada mensagem do
// servidor (várias por segundo) e enchiam o console. Agora cada aviso aparece UMA vez por cena.
const avisos_ja_dados = new Set();
function avisar_uma_vez(cena, chave, ...args){
    const id = `${cena?.scene?.key}:${chave}`;
    if(avisos_ja_dados.has(id)) return;
    avisos_ja_dados.add(id);
    console.warn(...args, "(aviso mostrado só uma vez por cena)");
}

// Diagnóstico temporário: mostra só as 3 primeiras listas de jogadores recebidas em cada cena
// (ids/x/y/vida que o servidor mandou x ids que existem na cena).
const diagnosticos_dados = {};
function diagnostico_jogadores(cena, jogadores){
    const chave = cena?.scene?.key;
    diagnosticos_dados[chave] = (diagnosticos_dados[chave] ?? 0) + 1;
    if(diagnosticos_dados[chave] > 3) return;

    const lista = Array.isArray(jogadores) ? jogadores : Object.values(jogadores ?? {});
    console.log(
        `[diagnóstico atualizarJogadores #${diagnosticos_dados[chave]}] cena: ${chave}`,
        "| servidor mandou:", lista.map(d => ({id: d?.id, nome: d?.nomeJogador, x: d?.x, y: d?.y, vida: d?.vida})),
        "| já existem na cena:", cena.jogadores_online ? Array.from(cena.jogadores_online.keys()) : null
    );
}

// Guarda a última lista de jogadores que o servidor mandou, independente de
// existir ou não uma cena pronta (com física) pra desenhar naquele momento.
// Isso resolve a corrida: o servidor pode mandar "atualizarJogadores" antes
// do scene.start("Rua_online") terminar de trocar de cena no client.
let ultima_lista_jogadores = null;

// Mesma ideia, só que pra "atualizarInimigos" — guarda a última lista de
// inimigos que o servidor mandou, pro caso dela chegar antes da Rua_online
// terminar de nascer (mesma corrida do atualizarJogadores acima).
let ultima_lista_inimigos = null;

// Mesma ideia, só que pro "atualizarBarreiras" — guarda a última lista de
// barreiras que o servidor mandou, pro caso dela chegar antes da Rua_online
// terminar de nascer (mesma corrida do atualizarJogadores acima).
let ultima_lista_barreiras = null;

// Mesma ideia, só que pro "atualizarItens" (latas de lixo) — guarda a última
// lista de itens que o servidor mandou, pro caso dela chegar antes da
// Rua_online terminar de nascer.
let ultima_lista_itens = null;

export function pegar_ultima_lista_jogadores(){
    return ultima_lista_jogadores;
}

export function pegar_ultima_lista_inimigos(){
    return ultima_lista_inimigos;
}

export function pegar_ultima_lista_barreiras(){
    return ultima_lista_barreiras;
}

export function pegar_ultima_lista_itens(){
    return ultima_lista_itens;
}

export function abrir_socket(cena){
    if (cena.mostrar_sala && (cena.mostrar_sala.readyState === WebSocket.OPEN || cena.mostrar_sala.readyState === WebSocket.CONNECTING)) {
        registrar_eventos_socket(cena, cena.mostrar_sala);
        buscar_salas(cena);
        return;
    }

    cena.mostrar_sala = new WebSocket("ws://192.168.0.10:8080/jogo")

    registrar_eventos_socket(cena, cena.mostrar_sala);
}

function registrar_eventos_socket(cena, socket){
    socket.onopen = ()=>{
        console.log("deu certo");
        buscar_salas(cena);
    }

    socket.onmessage = (e)=>{
        let mensagem = JSON.parse(e.data)

        // Cena que já foi encerrada (scene.start pro boss: o Boss ainda tá carregando os
        // sprites no preload e o onmessage continua preso na cena antiga) ou que tá
        // fazendo a transição pro boss (cutscene). Mexer nela agora só gera erro
        // ("sem física arcade", inimigos "removidos" etc.) ou apaga jogadores que o boss
        // precisa. Guarda as listas e ignora o resto — o Boss refaz o onmessage no create().
        const cena_saindo = !!cena.cutscene || !!cena.entrando_boss || cena.sys?.settings?.status >= Phaser.Scenes.SHUTDOWN;
        const tipos_ignorados = ["atualizarJogadores", "atualizarInimigos", "atualizarBarreiras", "atualizarItens", "jogadorTentouGolpe", "inimigoVaiTentarGolpe", "sairSala"];

        if(cena_saindo && tipos_ignorados.includes(mensagem.tipo)){
            if(mensagem.tipo === "atualizarJogadores") ultima_lista_jogadores = mensagem.jogadores;
            else if(mensagem.tipo === "atualizarInimigos") ultima_lista_inimigos = mensagem.inimigos;
            else if(mensagem.tipo === "atualizarBarreiras") ultima_lista_barreiras = mensagem.barreiras;
            else if(mensagem.tipo === "atualizarItens") ultima_lista_itens = mensagem.itens;
            return;
        }

        if(mensagem.tipo === "salasOnline"){
            console.log("Salas recebidas do servidor (payload cru):", JSON.stringify(mensagem.salas, null, 2));

            atualizar_lista_salas(mensagem.salas);
        }

        if(mensagem.tipo === "salaCriada"){
            console.log("SALA CRIADA!");
            buscar_salas(cena);
        }

        if(mensagem.tipo === "jogadorTentouGolpe"){
            // LOG DE DIAGNÓSTICO: se "golpe" vier undefined aqui pra um id que
            // NÃO é o seu (cena.jogador.id), é sinal de que o servidor não tá
            // ecoando o campo "golpe" no broadcast pros outros jogadores da
            // sala — só pro próprio atacante (que usa o fallback golpe_pendente).
            console.log("Golpe confirmado pelo servidor:", mensagem);
            console.log(
                "[websocket][DIAGNÓSTICO golpe] idJogador recebido:", mensagem.idJogador,
                "| meu id (cena.jogador?.id):", cena.jogador?.id,
                "| é meu próprio golpe?", cena.jogador?.id === mensagem.idJogador,
                "| mensagem.golpe veio preenchido?", mensagem.golpe
            );

            // Só temos cena.jogador/cena.jogadores_online depois que a
            // Rua_online terminou o create() — se o golpe chegar antes disso
            // (mesma corrida do atualizarJogadores lá em cima), não tem como
            // aplicar ainda, então só avisa e ignora.
            if (cena.jogadores_online && cena.physics) {
                aplicar_golpe_confirmado(cena, mensagem);
            } else {
                avisar_uma_vez(cena, "jogadorTentouGolpe",
                    "[websocket] mensagem jogadorTentouGolpe recebida, mas a cena ainda não tá pronta pra aplicar.",
                    mensagem
                ); 
            }
        }

        if(mensagem.tipo === "atualizarJogadores"){

            // Sempre guarda a lista mais recente, não importa a cena atual.
            ultima_lista_jogadores = mensagem.jogadores;

            diagnostico_jogadores(cena, mensagem.jogadores);

            // Essa mensagem pode chegar mesmo quando estamos no menu/lobby (cena "Jogo"),
            // ou antes do create() da Rua_online terminar de rodar. Só desenha os
            // sprites quando a cena atual já preparou o "banco" de jogadores
            // (cena.jogadores_online) — caso contrário, a Rua_online vai puxar
            // essa mesma lista sozinha assim que nascer (ver pegar_ultima_lista_jogadores).
            if (cena.jogadores_online && cena.physics) {
                atualizar_jogadores_online(cena, mensagem.jogadores);
            } else {
                avisar_uma_vez(cena, "atualizarJogadores",
                    "[websocket] mensagem atualizarJogadores guardada, mas NÃO desenhada agora.",
                    "cena.jogadores_online existe?", !!cena.jogadores_online,
                    "| cena.physics existe?", !!cena.physics,
                    "| cena atual:", cena.scene?.key
                );
            }
        }

        if(mensagem.tipo === "atualizarInimigos"){

            // Sempre guarda a lista mais recente, mesma lógica do atualizarJogadores
            // lá em cima — independe de existir cena pronta pra desenhar agora.
            ultima_lista_inimigos = mensagem.inimigos;

            // Cena do boss (ex: Boss_1_online) não tem inimigos comuns: ela mesma
            // monta o chefe a partir dessa lista (ver atualizar_boss_online).
            if (typeof cena.atualizar_boss_online === "function") {
                cena.atualizar_boss_online(mensagem.inimigos);
            }
            else if (cena.inimigos_online && cena.physics) {
                atualizar_inimigos_online(cena, mensagem.inimigos);
            } 
            else {
                avisar_uma_vez(cena, "atualizarInimigos",
                    "[websocket] mensagem atualizarInimigos guardada, mas NÃO desenhada agora.",
                    "cena.inimigos_online existe?", !!cena.inimigos_online,
                    "| cena.physics existe?", !!cena.physics,
                    "| cena atual:", cena.scene?.key
                );
            }
        }

        if(mensagem.tipo === "inimigoVaiTentarGolpe"){
            // console.log("Golpe de inimigo confirmado pelo servidor:", mensagem);

            // Mesma proteção usada em "atualizarInimigos"/"jogadorTentouGolpe"
            // acima: só dá pra tocar a animação se a cena já tiver o "banco"
            // de inimigos online pronto (cena.inimigos_online) e física ligada.
            if (typeof cena.boss_golpe_confirmado === "function") {
                // cena do boss: o golpe do chefe é tratado lá (ver boss_golpe_confirmado)
                cena.boss_golpe_confirmado(mensagem);
            } 
            else if (cena.inimigos_online && cena.physics) {
                aplicar_golpe_inimigo_confirmado(cena, mensagem);
            } 
            else {
                avisar_uma_vez(cena, "inimigoVaiTentarGolpe",
                    "[websocket] mensagem inimigoVaiTentarGolpe recebida, mas a cena ainda não tá pronta pra aplicar.",
                    mensagem
                );
            }
        }

        if(mensagem.tipo === "atualizarBarreiras"){
            // console.log(mensagem.barreiras);

            // Sempre guarda a lista mais recente, mesma lógica do atualizarJogadores/
            // atualizarInimigos lá em cima — independe de existir cena pronta pra desenhar agora.
            ultima_lista_barreiras = mensagem.barreiras;

            if (cena.grupo_barreiras && cena.physics) {
                criar_barreiras_online(cena, mensagem.barreiras);
                // console.log("[websocket] barreiras criadas com sucesso:", mensagem.barreiras);
            } else {
                avisar_uma_vez(cena, "atualizarBarreiras",
                    "[websocket] mensagem atualizarBarreiras guardada, mas NÃO desenhada agora (provavelmente ainda no lobby).",
                    "cena.grupo_barreiras existe?", !!cena.grupo_barreiras,
                    "| cena.physics existe?", !!cena.physics,
                    "| cena atual:", cena.scene?.key
                );
            }
        }

        if(mensagem.tipo === "atualizarItens"){
            // console.log("ITENS !!!!: ", mensagem.itens);

            // Sempre guarda a lista mais recente, mesma lógica do atualizarBarreiras
            // lá em cima — independe de existir cena pronta pra desenhar agora.
            ultima_lista_itens = mensagem.itens;

            if (cena.grupo_latas && cena.physics) {
                criar_lixeiras_online(cena, mensagem.itens);
            } else {
                avisar_uma_vez(cena, "atualizarItens",
                    "[websocket] mensagem atualizarItens guardada, mas NÃO desenhada agora (provavelmente ainda no lobby).",
                    "cena.grupo_latas existe?", !!cena.grupo_latas,
                    "| cena.physics existe?", !!cena.physics,
                    "| cena atual:", cena.scene?.key
                );
            }
        }

        if(mensagem.tipo === "atualizarMapa"){
            if(mensagem.mapa === "cidadeBoss"){
                let boss;
                let cena_atual = cena.sys.settings.key;
                switch (cena_atual){
                    case "Rua_online":
                        boss = "Boss_1_online";
                        break;
                    case "Lugar_online":
                        boss = "Boss_2_online";
                        break;
                    case "Prisao_online":
                        boss = "Boss_3_online";
                        break;
                }
                boss_entrando(cena, boss);
            }
            // else if(mensagem.mapa === "cidade"){
            //     //é a cidade onde começa
            // }
        }

        if(mensagem.tipo === "atualizarTurno"){
            cena.mudar_turno_boss(mensagem.turno);  
        }

        if(mensagem.tipo === "inimigoSeDefender"){
            cena.boss_defendendo_online();
            
        }

        if(mensagem.tipo === "fimDaPartida"){
            // console.warn("FINAL DA PARTIDA:", mensagem.tipo);
            cena.boss_derrotado();
        }

        if(mensagem.tipo === "sairSala"){
            console.log("[websocket] jogador saiu da sala:", mensagem);

            if (cena.jogadores_online && cena.jogadores_online.has(mensagem.idJogador)) {
                remover_jogador_da_cena(cena, cena.jogadores_online.get(mensagem.idJogador));
            } else {
                avisar_uma_vez(cena, "sairSala",
                    "[websocket] mensagem sairSala recebida, mas não achei esse jogador na cena (já tinha sido removido, ou a cena ainda não tá pronta).",
                    mensagem
                );
            }
        }

    }

    socket.onclose = ()=>{
        sair_da_sala(cena);
    }
}

export function atualizar_lista_salas(salas){
    let parte_baixo = document.getElementById("parte_baixo");
    if (!parte_baixo) return;

    let criar_sala = document.getElementById("criar_sala");

    // Guarda quem estava com a seta ANTES de apagar tudo. Sem isso, o
    // innerHTML = "" destrói a sala selecionada e as novas nascem sem
    // "seta_sala" — a seta some e ir_cima/ir_baixo (Jogo.js) não têm de
    // onde partir.
    let sala_com_seta = parte_baixo.querySelector(".sala.seta_sala");
    let nome_com_seta = sala_com_seta?.dataset.nomeCriador;

    parte_baixo.innerHTML = "";

    // salas que já foram pro boss não aparecem mais na lista
    (salas ?? [])
        .filter(sala_info => {
            const nome = typeof sala_info === "string"
                ? sala_info
                : (sala_info?.nomeCriador ?? sala_info?.nome_criador ?? sala_info?.nome ?? sala_info?.criador ?? sala_info?.dono ?? sala_info?.host);
            return !salas_em_boss.has(nome);
        })
        .forEach(sala_info => {
            criar_uma_sala(sala_info);
        });

    // Se a seta estava no botão criar_sala (ou em lugar nenhum), não mexe.
    if (!sala_com_seta) return;

    let novas = Array.from(parte_baixo.querySelectorAll(".sala"));
    let mesma = novas.find(sala_item => sala_item.dataset.nomeCriador === nome_com_seta);

    if (mesma) {
        mesma.classList.add("seta_sala");
    } else if (novas.length > 0) {
        novas[0].classList.add("seta_sala");
    } else {
        // a sala selecionada sumiu e não sobrou nenhuma: seta volta pro criar_sala
        criar_sala?.classList.add("seta_criar_sala");
    }
}

export function criar_nova_sala(cena, genero, usuario, skin){
    // sala nova com esse nome: se existia uma antiga (que foi pro boss) com o mesmo nome, volta a aparecer
    salas_em_boss.delete(usuario.nome);
    marcar_sala_atual(usuario.nome);

    console.log("abriu");
    console.log("sala:", cena.mostrar_sala);
    console.log("estado:", cena.mostrar_sala?.readyState);
    if (cena.mostrar_sala && cena.mostrar_sala.readyState === WebSocket.OPEN) {
        cena.mostrar_sala.send(JSON.stringify({
            tipo:"criarSala",
            mapa:"cidade",
            nomeCriador:usuario.nome,
            personagem:genero,
            skin:skin //a skin do personagem

        }))
        console.log("CRIOU SALA");
        buscar_salas(cena);
    }
    else{
        console.log(null);
    }
}

export function buscar_salas(cena){
    if (cena.mostrar_sala && cena.mostrar_sala.readyState === WebSocket.OPEN){
        cena.mostrar_sala.send(JSON.stringify({
            tipo:"receber_salas"
        }))
    }
    else{
        console.log(null);
    }
}

export function criar_uma_sala(sala_info){
    console.log("[criar_uma_sala] sala_info recebido:", sala_info, "| tipo:", typeof sala_info);

    // O servidor manda cada sala como uma STRING simples (o nome do criador),
    // não como objeto — ex: salas: ["errordj"]. Se algum dia o servidor passar
    // a mandar objeto, o fallback de campos continua funcionando também.
    let nome_criador;

    if (typeof sala_info === "string") {
        nome_criador = sala_info;
    } else if (sala_info && typeof sala_info === "object") {
        nome_criador =
            sala_info.nomeCriador ??
            sala_info.nome_criador ??
            sala_info.nome ??
            sala_info.criador ??
            sala_info.dono ??
            sala_info.host;
    }

    if (nome_criador === undefined) {
        console.warn(
            "[criar_uma_sala] Não achei o nome do criador em nenhum campo conhecido. sala_info:",
            sala_info
        );
    }

    let corpo = document.createElement("div");
    corpo.classList.add("sala", "pixel-borders", "pixel-borders--2");

    let nome = document.createElement("div");
    nome.classList.add("nome_online");
    nome.innerText = nome_criador ?? "Sala sem nome";

    corpo.dataset.nomeCriador = nome_criador ?? "";

    // Guarda o dado original também, assim se precisarmos de outra coisa
    // (idSala, mapa, etc.) no futuro não precisa mudar essa função de novo.
    corpo.dataset.salaInfo = JSON.stringify(sala_info);

    let data = document.createElement("div");
    data.classList.add("criacao");
    data.innerText = pegar_data();

    corpo.append(nome, data);

    document.getElementById("parte_baixo").append(corpo);
}

export function pegar_data(){
    let data = new Date();

    let dia = data.getDate();
    let mes = data.getMonth() + 1;
    let ano = data.getFullYear();

    let hora = data.getHours();
    let minutos = data.getMinutes();

    return `Criado em ${dia}/${mes}/${ano} às ${hora}:${minutos}`
}

export function sair_da_sala(cena){
    if (cena.mostrar_sala && cena.mostrar_sala.readyState === WebSocket.OPEN){
        cena.mostrar_sala.send(JSON.stringify({
            tipo: "sairSala"
        }))
        console.log("pediu pra sair da sala");
    }
    else{
        console.log(null);
    }
}

// Fecha de vez a conexão com o servidor (chamado ao voltar pro menu — ver
// sair_da_sala_e_voltar em funcoes_online.js). Antes disso, o socket ficava
// aberto e esquecido depois de sair da sala: o Jogo.js só chama abrir_socket()
// quando o jogador clica em "multiplayer" de novo, e a cena nova nem tem
// cena.mostrar_sala, então acabava abrindo uma conexão NOVA a cada vez que
// entrava no multiplayer, sem nunca fechar as antigas.
export function fechar_conexao(cena){
    // Zera as últimas listas guardadas: senão a próxima Rua_online desenha
    // jogadores/inimigos da partida anterior (inclusive você mesmo) até o
    // servidor mandar a lista nova.
    ultima_lista_jogadores = null;
    ultima_lista_inimigos = null;
    ultima_lista_barreiras = null;
    ultima_lista_itens = null;

    if (cena.mostrar_sala) {
        console.log("[fechar_conexao] fechando a conexão com o servidor.");
        // onclose (registrado em registrar_eventos_socket) ainda vai disparar
        // e chamar sair_da_sala(cena) de novo — mas nesse ponto o socket já
        // não tá mais OPEN, então essa segunda chamada não manda nada, só cai
        // no else e loga null. Sem problema.
        cena.mostrar_sala.close();
    }

    cena.mostrar_sala = null;
}