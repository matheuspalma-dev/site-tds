import {abrir_socket, pegar_ultima_lista_inimigos} from "./websocket.js";
import {assets_jogador, assets_mapa_1, assets_sfx, animacoes, animacoes_jogador, animacao_mapa_1, tela_vitoria} from "./funcoes.js";
import {html_online, efeitos_online, criar_jogador_online, atualizar_barra_hp, jogador_derrotado_online, animar_jogador_online, tentar_atacar, verificar_pvp, mover_selecao_morte_online, confirmar_selecao_morte_online, clampar_no_mundo, verificar_ataque_inimigo_jogador, verificar_golpe_de_um_inimigo, atualizar_inimigos_online, inimigos_online_update, verificar_ataque_inimigos, aplicar_golpe_inimigo_confirmado, inimigo_flash_dano, inimigo_parar_flash_dano, inimigo_anti_spam, mostrar_miss, calcular_dano_jogador_inimigo, verificar_area_skate_boss} from "./funcoes_online.js";

export class Boss_1_online extends Phaser.Scene {
    constructor() {
        super('Boss_1_online');
    }

    init(data) {
        this.genero = data.genero;

        this.turno = "PRIMEIRO_TURNO";

        this.luta_acabou = false;

        // a instância da cena é reaproveitada: zera o estado da luta anterior
        this.jogador = null;
        this.camera_alvo = null;
        this.skin = data.skin;
        this.hp_atual = data.hp;
        this.bonus = data.bonus;
        // jogadores da sala com o hp que tinham ao sair da rua (ver boss_entrando)
        this.jogadores_iniciais = data.jogadores ?? [];

        document.body.style.setProperty("--fundo", "black");
        // set DEPOIS de atribuir (antes estava salvando undefined)
        this.registry.set("bonus", this.bonus);

        // reaproveita a conexão que veio da Rua_online
        this.mostrar_sala = data.socket;

        if (!this.mostrar_sala) {
            console.error("[Boss_1_online.init] data.socket não veio! boss_entrando (funcoes_online.js) precisa passar socket: cena.mostrar_sala.");
        }
    }

    preload() {

        assets_jogador(this);

        assets_mapa_1(this);

       //lucas lee

        this.load.spritesheet("lucas_lee_fumando", "assets/conteudo/mapa_1/boss/LucasLeeBossInicial350x110.png", {frameWidth:350, frameHeight:110});

        //sem skate
        this.load.spritesheet("lucas_lee_parado", "assets/conteudo/mapa_1/boss/sem_skate/LucasLeeBossParado60x110.png", {frameWidth:60, frameHeight:110});
        this.load.spritesheet("lucas_lee_andando", "assets/conteudo/mapa_1/boss/sem_skate/LucasLeeBossAndando60x110.png", {frameWidth:60, frameHeight:110});
        this.load.spritesheet("lucas_lee_ataque_1", "assets/conteudo/mapa_1/boss/sem_skate/LucasLeeBossAtaque100x110.png", {frameWidth:100, frameHeight:110}); //soco com braço direito
        this.load.spritesheet("lucas_lee_ataque_2", "assets/conteudo/mapa_1/boss/sem_skate/LucasLeeBossAtaque282x110.png", {frameWidth:82, frameHeight:110}); //soco com braço esquerdo
        this.load.spritesheet("lucas_lee_defendendo", "assets/conteudo/mapa_1/boss/sem_skate/LucasLeeBossDefendendo42x110.png", {frameWidth:42, frameHeight:110});
        this.load.spritesheet("lucas_lee_machucado", "assets/conteudo/mapa_1/boss/sem_skate/LucasLeeBossLevandoGolpe110x110.png", {frameWidth:110, frameHeight:110});
        this.load.spritesheet("lucas_lee_derrotado", "assets/conteudo/mapa_1/boss/sem_skate/LucasLeeBossSendoDerrotado85x110.png", {frameWidth:85, frameHeight:110});

        //andando de skate

        this.load.spritesheet("lucas_lee_skate_direita", "assets/conteudo/mapa_1/boss/com_skate/LucasLeeAndandoDireita100x110.png", {frameWidth:100, frameHeight:110});
        this.load.spritesheet("lucas_lee_skate_esquerda", "assets/conteudo/mapa_1/boss/com_skate/LucasLeeAndandoEsquerda90x110.png", {frameWidth:90, frameHeight:110});
        this.load.spritesheet("lucas_lee_skate_virando_esquerda", "assets/conteudo/mapa_1/boss/com_skate/LucasLeeVirandoEsquerda110x110.png", {frameWidth:110, frameHeight:110});
        this.load.spritesheet("lucas_lee_skate_virando_direita", "assets/conteudo/mapa_1/boss/com_skate/LucasLeeVirandoDireita120x110.png", {frameWidth:120, frameHeight:110});

        //com skate
        this.load.spritesheet("lucas_lee_parado_skate", "assets/conteudo/mapa_1/boss/com_skate/LucasLeeBossParadoSkate64x110.png", {frameWidth:64, frameHeight:110});
        this.load.spritesheet("lucas_lee_andando_skate", "assets/conteudo/mapa_1/boss/com_skate/LucasLeeBossAndandoSkate65x110.png", {frameWidth:65, frameHeight:110});
        this.load.spritesheet("lucas_lee_ataque_1_skate", "assets/conteudo/mapa_1/boss/com_skate/LucasLeeBossAtaque1Skate140x110.png", {frameWidth:140, frameHeight:110}); //ele bate com o skate para baixo
        this.load.spritesheet("lucas_lee_ataque_2_skate", "assets/conteudo/mapa_1/boss/com_skate/LucasLeeBossAtaque2Skate113x110.png", {frameWidth:113, frameHeight:110}); //ele bate com o skate pro lado
        this.load.spritesheet("lucas_lee_defendendo_skate", "assets/conteudo/mapa_1/boss/com_skate/LucasLeeBossDefendendo55x110.png", {frameWidth:55, frameHeight:110});
        this.load.spritesheet("lucas_lee_machucado_skate", "assets/conteudo/mapa_1/boss/com_skate/LucasLeeBossLevandoGolpe70x110.png", {frameWidth:70, frameHeight:110});
        //a animacao de derrota é a mesma
        //mapa

        this.load.image('boss', 'assets/conteudo/mapa_1/mapa/rua.png');

        assets_sfx(this);

    }

    create() {
        this.fundo = this.add.image(-13000, this.cameras.main.centerY, 'boss').setScale(2).setOrigin(0.2, 0.4);

        this.cameras.main.setBounds(0, 0, this.fundo.width * this.fundo.scaleX, this.fundo.height * this.fundo.scaleY); //LIMITE DA CAMERA

        this.physics.world.setBounds(0, 620, 1800, 200); //LIMITE DO MAPA

        // jogadores só se mexem (e atacam) depois que a introdução termina
        this.pode_comecar = false;

        this.cameras.main.fadeIn(1500);

        this.sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";

        // música do boss: para qualquer música que ainda esteja tocando e toca a do boss, em loop
        this.sound.stopAll();
        if (this.cache.audio.exists("boss")) {
            this.musica = this.sound.add("boss", { loop: true, volume: 0.5 });
            this.musica.play();
        }

        html_online(this);

        efeitos_online(this);
        this.events.once("shutdown", () => efeitos_online(this));

        this.jogadores_online = new Map();

        this.grupo_jogadores = this.physics.add.group();

        // inimigos comuns (mesmo esquema da Rua_online.create). O boss NÃO entra aqui: ele é this.boss.
        this.inimigos_online = new Map();
        this.inimigos_derrotados_ids = new Set();
        this.grupo_inimigos = this.physics.add.group();
        this.physics.add.collider(this.grupo_inimigos, this.grupo_inimigos);
        this.physics.add.collider(this.grupo_inimigos, this.grupo_jogadores);

        this.teclas = this.input.keyboard.addKeys({
            cima: Phaser.Input.Keyboard.KeyCodes.UP,
            baixo: Phaser.Input.Keyboard.KeyCodes.DOWN,
            esquerda: Phaser.Input.Keyboard.KeyCodes.LEFT,
            direita: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,

            p: Phaser.Input.Keyboard.KeyCodes.P
        });

        this.teclas_ataque = this.input.keyboard.addKeys({
            z: Phaser.Input.Keyboard.KeyCodes.Z,
            x: Phaser.Input.Keyboard.KeyCodes.X,
            c: Phaser.Input.Keyboard.KeyCodes.C,
            v: Phaser.Input.Keyboard.KeyCodes.V,
            b: Phaser.Input.Keyboard.KeyCodes.B,
        });

        this.gamepad = null;
        if (this.input.gamepad) {
            if (this.input.gamepad.total > 0) {
                this.gamepad = this.input.gamepad.getPad(0);
            }
            this.input.gamepad.on("connected", (pad) => {
                this.gamepad = pad;
            });

            this.input.gamepad.on("down", (pad, botao) => {
                if (!this.jogador?.derrotado) return;

                if (botao.index === 12) { // d-pad cima
                    mover_selecao_morte_online(this, "cima");
                }
                else if (botao.index === 13) { // d-pad baixo
                    mover_selecao_morte_online(this, "baixo");
                }
                else if (botao.index === 0) { // A confirma
                    confirmar_selecao_morte_online(this);
                }
            });
        }

        this.teclas.cima.on("down", () => {
            if (this.jogador?.derrotado) mover_selecao_morte_online(this, "cima");
        });
        this.teclas.baixo.on("down", () => {
            if (this.jogador?.derrotado) mover_selecao_morte_online(this, "baixo");
        });
        this.teclas.w.on("down", () => {
            if (this.jogador?.derrotado) mover_selecao_morte_online(this, "cima");
        });
        this.teclas.s.on("down", () => {
            if (this.jogador?.derrotado) mover_selecao_morte_online(this, "baixo");
        });
        this.teclas_ataque.z.on("down", () => {
            if (this.jogador?.derrotado) confirmar_selecao_morte_online(this);
        });

        this.olhando_direita = true;

        this.proximo_envio_permitido = 0;
        this.intervalo_envio_ms = 50;

        animacoes_jogador(this);

        // animações dos inimigos comuns do mapa 1 (parado/andando/golpes...), igual à Rua_online
        animacao_mapa_1(this);

        //LUCAS LEE 

        //sem skate

        if(!this.anims.exists("lucas_lee_introducao")){
            animacoes(this, "lucas_lee_introducao", "lucas_lee_fumando", 15, 8, 0);
        }
        if(!this.anims.exists("lucas_lee_parado")){
            animacoes(this, "lucas_lee_parado", "lucas_lee_parado", 5, 10, -1);
        }
        if(!this.anims.exists("lucas_lee_andando")){
            animacoes(this, "lucas_lee_andando", "lucas_lee_andando", 5, 9, -1);
        }
        if(!this.anims.exists("lucas_lee_ataque_1")){
            animacoes(this, "lucas_lee_ataque_1", "lucas_lee_ataque_1", 6, 10, 0);
        }
        if(!this.anims.exists("lucas_lee_ataque_2")){
            animacoes(this, "lucas_lee_ataque_2", "lucas_lee_ataque_2", 4, 10, 0);
        }
        if(!this.anims.exists("lucas_lee_defendendo")){
            animacoes(this, "lucas_lee_defendendo", "lucas_lee_defendendo", 0, 1, 0);
        }
        if(!this.anims.exists("lucas_lee_machucado")){
            animacoes(this, "lucas_lee_machucado", "lucas_lee_machucado", 5, 10, 0);
        }
        if(!this.anims.exists("lucas_lee_derrotado")){
            animacoes(this, "lucas_lee_derrotado", "lucas_lee_derrotado", 7, 5, 0);
        }
        
        //com skate

        if(!this.anims.exists("lucas_lee_parado_skate")){
            animacoes(this, "lucas_lee_parado_skate", "lucas_lee_parado_skate", 5, 10, -1);
        }
        if(!this.anims.exists("lucas_lee_andando_skate")){
            animacoes(this, "lucas_lee_andando_skate", "lucas_lee_andando_skate", 5, 10, -1);
        }
        if(!this.anims.exists("lucas_lee_ataque_1_skate")){
            animacoes(this, "lucas_lee_ataque_1_skate", "lucas_lee_ataque_1_skate", 3, 8, 0);
        }
        if(!this.anims.exists("lucas_lee_ataque_2_skate")){
            animacoes(this, "lucas_lee_ataque_2_skate", "lucas_lee_ataque_2_skate", 3, 8, 0);
        }

        if(!this.anims.exists("lucas_lee_defendendo_skate")){
            animacoes(this, "lucas_lee_defendendo_skate", "lucas_lee_defendendo_skate", 0, 1, 0);
        }
        if(!this.anims.exists("lucas_lee_machucado_skate")){
            animacoes(this, "lucas_lee_machucado_skate", "lucas_lee_machucado_skate", 5, 10, 0);
        }
        

        //andando de skate

        if(!this.anims.exists("lucas_lee_skate_direita")){
            animacoes(this, "lucas_lee_skate_direita", "lucas_lee_skate_direita", 3, 8, -1);
        }
        if(!this.anims.exists("lucas_lee_skate_esquerda")){
            animacoes(this, "lucas_lee_skate_esquerda", "lucas_lee_skate_esquerda", 3, 8, -1);
        }
        if(!this.anims.exists("lucas_lee_skate_virando_direita")){
            animacoes(this, "lucas_lee_skate_virando_direita", "lucas_lee_skate_virando_direita", 4, 8, 0);
        }
        if(!this.anims.exists("lucas_lee_skate_virando_esquerda")){
            animacoes(this, "lucas_lee_skate_virando_esquerda", "lucas_lee_skate_virando_esquerda", 5, 10, 0);
        }


        // ---- jogadores: nascem no mesmo lugar do boss offline (x = 50, y = 650) ----
        // Vários jogadores: ficam lado a lado, em ordem de id — a ordem é a mesma em todos os
        // clients, então todo mundo vê todo mundo no mesmo lugar.
        const jogadores_ordenados = [...this.jogadores_iniciais]
            .sort((a, b) => String(a.id).localeCompare(String(b.id)));

        jogadores_ordenados.forEach((dados, indice) => {
            const jogador = criar_jogador_online(this, 50 + indice * 70, 650, 1.5, dados.id, dados.nome, dados.hp,  dados.dano,  dados.genero, dados.skin, dados.local );

            if (!jogador) return;

            this.jogadores_online.set(dados.id, jogador);

            if (dados.local) {
                atualizar_barra_hp(this);
            }
            if (jogador.hp_atual <= 0) {
                jogador_derrotado_online(this, jogador);
            }
        });

        console.log(
            "[Boss_1_online] jogadores recebidos da rua:", this.jogadores_iniciais.length,
            "| criados:", Array.from(this.jogadores_online.values()).map(j => ({id: j.id, x: Math.round(j.x), y: Math.round(j.y), hp: j.hp_atual, visivel: j.visible}))
        );

        this.boss = null;
        const lista_pendente = pegar_ultima_lista_inimigos();
        console.log("[Boss_1_online] atualizarInimigos pendente ao criar a cena:", lista_pendente);
        if (lista_pendente) this.atualizar_boss_online(lista_pendente);

        const hud = document.getElementById("hud_boss_1");
        if (hud) hud.style.display = "flex";

        this.events.once("shutdown", () => {
            const hud_boss = document.getElementById("hud_boss_1");
            if (hud_boss){
                hud_boss.style.display = "none";
            }
            if (this.musica){
                this.musica.stop();
            }
        });

        abrir_socket(this);

        // avisa o servidor onde o jogador local nasceu, pros OUTROS jogadores
        // verem ele no lugar certo (senão o servidor ainda tem a posição da rua)
        if (this.jogador) {
            this.enviar_posicao_pro_servidor(this.jogador.x, this.jogador.y);
            this.enviou_parada = true;
        }

        this.pausa_aberta = false;

        this.teclas.p.on("down", () => {
            this.abrir_pausa_online();
        });
    }

    update(time) {
        this.jogadores_online.forEach(jogador => {
            // enquanto ataca/tá machucado, não deixa a interpolação sobrescrever a
            // animação do golpe/dano (ver comentários na Rua_online.update).
            // O jogador LOCAL fica de fora: anda por velocidade em mover_jogador_local.
            if (jogador !== this.jogador && !jogador.atacando && !jogador.machucado) {
                const distancia_x = jogador.targetX - jogador.x;
                const distancia_y = jogador.targetY - jogador.y;

                const esta_se_movendo = Math.hypot(distancia_x, distancia_y) > 1;

                let olhando_direita = jogador.olhando_direita;
                if (Math.abs(distancia_x) > 1) {
                    olhando_direita = distancia_x > 0;
                }

                jogador.x = Phaser.Math.Linear(jogador.x, jogador.targetX, 0.2);
                jogador.y = Phaser.Math.Linear(jogador.y, jogador.targetY, 0.2);

                if (!this.luta_acabou) {
                    animar_jogador_online(jogador, esta_se_movendo, olhando_direita, jogador.skin);
                }
            }

            // vale pra todos: depth e áreas de ataque/dano acompanham o sprite
            jogador.setDepth(jogador.body.y);
            jogador.area_ataque.setPosition(jogador.x + (jogador.olhando ? -30 : 30), jogador.y + 10);
            jogador.area_dano.setPosition(jogador.x, jogador.y + 20);
        });

        // golpe (local ou de outro jogador) na área de dano do jogador local
        verificar_pvp(this);

        // golpe do jogador local encostando no boss -> "danoNoBoss" pro servidor
        this.verificar_ataque_boss();

        // Lucas Lee fica na frente/atrás dos jogadores conforme o y (igual ao offline)
        this.mover_boss_online();

        // inimigos comuns (mesma ordem da Rua_online.update): andam até o x/y do servidor e o golpe
        // do jogador neles vira "golpearInimigo". O boss não está nesse Map, não é afetado.
        inimigos_online_update(this);
        verificar_ataque_inimigos(this);

        // golpe do boss (hitbox ligada) encostando em algum jogador -> dano + "levarDano" pro servidor
        if (this.boss) verificar_golpe_de_um_inimigo(this, this.boss);

        // skate do boss (3º turno): encostar na area_skate machuca o jogador
        if (this.boss) verificar_area_skate_boss(this, this.boss);

        // golpe dos inimigos comuns encostando em algum jogador (idem)
        verificar_ataque_inimigo_jogador(this);

        this.mover_jogador_local(time);
    }

    // Lê teclado (setas + WASD) e controle e move o jogador local por VELOCIDADE,
    // pra os colliders do Phaser segurarem ele. A posição real é enviada ao
    // servidor (tipo "andar") de tempos em tempos, só pros OUTROS jogadores verem.
    mover_jogador_local(time) {
        const jogador = this.jogador;

        if (!jogador || !jogador.body) return;

        // derrotado fica parado, com o menu de morte aberto
        if (jogador.derrotado) {
            jogador.setVelocity(0);
            return;
        }

        // luta acabou: a sequência de vitória (boss_derrotado) controla a animação do jogador
        if (this.luta_acabou) {
            jogador.setVelocity(0);
            return;
        }

        // introdução do boss: todo mundo parado, sem andar nem atacar (igual ao offline)
        if (!this.pode_comecar) {
            jogador.setVelocity(0);
            animar_jogador_online(jogador, false, this.olhando_direita, jogador.skin);
            return;
        }

        // tomando golpe: não mexe nem ataca
        if (jogador.machucado) {
            jogador.setVelocity(0);
            this.enviou_parada = false;
            return;
        }

        if (jogador.atacando) {
            jogador.setVelocity(0);
            this.enviou_parada = false;
            tentar_atacar(this);
            return;
        }

        const velocidade = this.buff_velocidade ? 250 : 180;
        let vx = 0;
        let vy = 0;

        if (this.teclas.cima.isDown || this.teclas.w.isDown) {
            vy = -velocidade;
        }
        else if (this.teclas.baixo.isDown || this.teclas.s.isDown) {
            vy = velocidade;
        }

        if (this.teclas.esquerda.isDown || this.teclas.a.isDown) {
            vx = -velocidade;
            this.olhando_direita = false;
        }
        else if (this.teclas.direita.isDown || this.teclas.d.isDown) {
            vx = velocidade;
            this.olhando_direita = true;
        }

        // --- controle (gamepad) ---
        if (!this.gamepad && this.input.gamepad && this.input.gamepad.total > 0) {
            this.gamepad = this.input.gamepad.getPad(0);
        }

        if (this.gamepad) {
            const eixo_x = this.gamepad.leftStick.x;
            const eixo_y = this.gamepad.leftStick.y;

            if (this.gamepad.left || eixo_x < -0.5) {
                vx = -velocidade;
                this.olhando_direita = false;
            } else if (this.gamepad.right || eixo_x > 0.5) {
                vx = velocidade;
                this.olhando_direita = true;
            }

            if (this.gamepad.up || eixo_y < -0.5) {
                vy = -velocidade;
            } else if (this.gamepad.down || eixo_y > 0.5) {
                vy = velocidade;
            }
        }

        jogador.setVelocity(vx, vy);

        const esta_se_movendo = vx !== 0 || vy !== 0;

        animar_jogador_online(jogador, esta_se_movendo, this.olhando_direita, jogador.skin);

        if (esta_se_movendo) {
            this.enviou_parada = false;

            if (time >= this.proximo_envio_permitido) {
                this.enviar_posicao_pro_servidor(jogador.x, jogador.y);
                this.proximo_envio_permitido = time + this.intervalo_envio_ms;
            }
        } else if (!this.enviou_parada) {
            // parou: manda a posição final uma vez
            this.enviar_posicao_pro_servidor(jogador.x, jogador.y);
            this.enviou_parada = true;
        }

        tentar_atacar(this);
    }

    // Chamado pelo websocket.js a cada "atualizarInimigos" (cena.atualizar_boss_online).
    atualizar_boss_online(inimigos) {
        // CONSOLE: o que o servidor retornou
        console.log("[Boss_1_online] atualizarInimigos recebido:", inimigos);

        if (!inimigos){
            return;
        } 

        const entradas = Array.isArray(inimigos)? inimigos.map((dados, indice) => [dados?.id ?? indice, dados]): Object.entries(inimigos);

        const eh_boss = (dados) => dados && (dados.boss || dados.nome === "lucas_lee");

        // Tudo que não é o boss é inimigo comum: vai pro MESMO fluxo da Rua (cria quem é novo,
        // sincroniza vida/posição de quem já existe e apaga quem o servidor parou de mandar).
        // Roda sempre, mesmo sem boss na lista (é o caso depois que ele vai embora).
        // O boss fica de fora: a lista dos comuns não tem ele e ele não está no Map.
        const inimigos_comuns = Object.fromEntries(entradas.filter(([, dados]) => dados && !eh_boss(dados)));
        atualizar_inimigos_online(this, inimigos_comuns);

        const achado = entradas.find(([, dados]) => eh_boss(dados));

        if (!achado) {
            // depois que o boss vai embora o servidor para de mandar ele: não é erro
            if (!this.boss && Object.keys(inimigos_comuns).length === 0) {
                console.warn("[Boss_1_online] nenhum boss na lista do servidor.");
            }
            return;
        }

        const [id_boss, dados] = achado;

        if (this.boss) {
            // a vida de verdade é a do servidor. Logo depois de eu bater, ele ainda pode mandar
            // uma vida velha (maior) por um instante: nesses 500ms só aceita se for menor,
            // senão a barra sobe e desce.
            const acabou_de_apanhar = this.time.now - (this.boss.ultimo_dano_local ?? -1000) < 500;
            const vida_anterior = this.boss.hp_atual;
            this.boss.hp_atual = acabou_de_apanhar ? Math.min(this.boss.hp_atual, dados.vida) : dados.vida;

            if (!acabou_de_apanhar && dados.vida < vida_anterior) {
                this.boss_reagir_dano();
            }

            // hp_total só cresce (antes era sempre igual à vida atual e a barra nunca descia)
            if (dados.vida > this.boss.hp_total) this.boss.hp_total = dados.vida;
            this.atualizar_hud_boss_1();

            // TUDO vem do servidor (igual aos inimigos comuns, ver atualizar_inimigos_online):
            // o client só guarda o destino e a direção. Quem desliza o sprite até lá é
            // mover_boss_online, todo frame.
            // velocidade 0 (ou inválida) faria o boss ficar "andando" parado (0 * 50 = 0 px/s),
            // então só aceita valor positivo e mantém o último bom.
            if (typeof dados.velocidade === "number" && dados.velocidade > 0) this.boss.velocidade = dados.velocidade;

            if (!this.boss.atacando && typeof dados.direcao === "boolean") {
                this.boss.olhando_direita = dados.direcao;
                this.boss.olhando = !dados.direcao;
            }

            // Só vira alvo de movimento depois da introdução (durante ela o boss é
            // scriptado — ver introducao). Antes disso só guarda o mais recente.
            if (typeof dados.x === "number" && typeof dados.y === "number") {
                // x/y do servidor direto, SEM limitar ao mapa: quando o servidor manda o boss
                // sair da tela (fim da fase 1), ele precisa poder ir pra fora do mapa.
                const alvo = {x: dados.x, y: dados.y};
                this.alvo_boss = alvo;
                if (this.pode_comecar) {
                    this.boss.targetX = alvo.x;
                    this.boss.targetY = alvo.y;
                }
            }

            return;
        }

        console.log(`%c🟠 BOSS: "${dados.nome}" (id: ${id_boss})`, "color: #ff6d00; font-weight: bold; font-size: 13px;", dados);

        this.criar_lucas_lee(id_boss, dados);
        this.introducao();
    }

    // Cria o Lucas Lee com o que o servidor mandou (mesmos campos do criar_inimigo_online).
    // A posição fica a da introdução (620, 440), que é scriptada igual ao offline.
    criar_lucas_lee(id_boss, dados) {
        this.boss = this.physics.add.sprite(620, 440, "lucas_lee_parado").setScale(1.5).setFlipX(true);

        this.boss.id = id_boss;
        this.boss.skin = dados.nome;
        this.boss.nome = dados.nome;
        this.boss.tipo = "boss";
        this.boss.pontos = dados.pontosPorDerrotar;

        this.boss.hp_total = dados.vida;
        this.boss.hp_atual = dados.vida;
        this.boss.ataque = dados.dano;
        this.boss.defesa = dados.defesa;

        // "atacando" aqui é o estado do GOLPE no client (ver boss_golpe_confirmado), então
        // sempre começa falso — senão um atacando=true vindo do servidor travaria o boss parado.
        this.boss.atacando = false;
        this.boss.atacar = dados.atacar;
        this.boss.pausa_ataque = dados.pausaAtaque;
        this.boss.pode_mover = dados.podeSeMover;
        this.boss.quantidade_movimentos = dados.quantidadeMovimentos;
        this.boss.velocidade = dados.velocidade > 0 ? dados.velocidade : 2;

        // posição que o servidor mandou: só é usada depois da introdução
        this.comeco_x = dados.x;
        this.comeco_y = dados.y;

        this.alvo_boss = {x: dados.x, y: dados.y};

        // mesma convenção dos inimigos comuns: olhando = true -> sprite espelhado
        // this.boss.olhando_direita = dados.direcao;
        this.boss.olhando = dados.direcao;

        this.boss.body.setSize(20, 20);
        this.boss.body.setOffset(25, 90);

        this.boss.area_ataque = this.add.zone(dados.x, dados.y, 80, 70);
        this.physics.world.enable(this.boss.area_ataque);
        this.boss.area_ataque.body.setAllowGravity(false);
        this.boss.area_ataque.body.enable = false;

        this.boss.area_dano = this.add.zone(dados.x, dados.y + 20, 30, 30);
        this.physics.world.enable(this.boss.area_dano);
        this.boss.area_dano.body.setAllowGravity(false);

        this.boss.area_skate = this.add.zone(dados.x, dados.y, 50, 80);
        this.physics.world.enable(this.boss.area_skate);
        this.boss.area_skate.body.setAllowGravity(false);
        this.boss.area_skate.body.enable = false;

        this.boss.invencibilidade = false;

        this.aplicar_areas_turno();

        this.boss.lista_ataques = [];
        this.boss.ataques_repetidos = 0;

        this.atualizar_hud_boss_1();
    }

    introducao() {
        this.boss.anims.play("lucas_lee_introducao");

        this.time.delayedCall(1400, () => {
            this.boss.setVelocityY(150);

            this.time.delayedCall(1200, () => {
                this.boss.setVelocity(0);
                this.boss.play("lucas_lee_parado", true);
                this.boss.setPosition(800, this.boss.y);
                this.pode_comecar = true;

                this.mostrar_sala.send(JSON.stringify({
                    tipo:"comecarLuta"
                }))

                // agora sim: começa a andar até o x/y que o servidor mandou
                const alvo = this.alvo_boss ?? {x: this.boss.x, y: this.boss.y};
                this.boss.targetX = alvo.x;
                this.boss.targetY = alvo.y;
            });
        });
    }

    mudar_turno_boss(turno) {
        if (!turno || this.turno === turno) return;

        console.log(`[Boss_1_online] turno: ${this.turno} -> ${turno}`);
        this.turno = turno;
        this.aplicar_areas_turno();
    }

    aplicar_areas_turno() {
        const boss = this.boss;
        if (!boss){
            return;
        }

        const skate = this.turno === "TERCEIRO_TURNO";

        boss.area_skate.body.enable = skate;
        boss.area_dano.body.enable = !skate;
        boss.area_ataque.body.enable = false;
    }

    mover_boss_online(turno = this.turno) {
        const boss = this.boss;
        if (!boss || !boss.body || !boss.active) {
            return;
        }

        boss.setDepth(boss.body.y);
        boss.area_ataque.setPosition(boss.x + (boss.olhando ? -40 : 40), boss.y + 10);
        boss.area_dano.setPosition(boss.x, boss.y + 20);
        
        boss.area_skate.setPosition(boss.x, boss.y + 10);

        if (boss.derrotado) {
            boss.setVelocity(0);
            return;   // não deixa o play("parado"/"andando") cortar a animação de derrota
        }

        if (!this.pode_comecar) {
            return;
        }

        if (boss.atacando) {
            boss.setVelocity(0);
            return;
        }

        if (boss.defendendo) {
            boss.setVelocity(0);
            return;
        }

        const distancia_x = boss.targetX - boss.x;
        const distancia_y = boss.targetY - boss.y;
        const distancia = Math.hypot(distancia_x, distancia_y);
        const esta_se_movendo = distancia > 1;

        if (esta_se_movendo) {
            const velocidade_perseguicao = (boss.velocidade ?? 2) * 50;
            // não "passa" do alvo quando já tá perto — evita tremer tentando alcançar o destino
            const velocidade_final = Math.min(velocidade_perseguicao, distancia * 10);
            const angulo = Math.atan2(distancia_y, distancia_x);

            boss.setVelocity(
                Math.cos(angulo) * velocidade_final,
                Math.sin(angulo) * velocidade_final
            );

            if (Math.abs(distancia_x) > 1) {
                boss.olhando_direita = distancia_x > 0;
                boss.olhando = !boss.olhando_direita;
            }
        } 
        else {
            boss.setVelocity(0);
        }

        // tomando golpe: a animação de "machucado" tem prioridade (ele continua indo pro alvo, só a animação espera)
        if (!boss.invencibilidade) {
            if(turno === "TERCEIRO_TURNO"){
                // sprites próprios pra cada direção: não espelha (olhando = true é olhando pra ESQUERDA)
                boss.play(boss.olhando ? "lucas_lee_skate_direita" : "lucas_lee_skate_esquerda", true);
                boss.setFlipX(false);
            }
            else{
                if(turno === "QUARTO_TURNO"){
                    boss.play(esta_se_movendo ? "lucas_lee_andando_skate" : "lucas_lee_parado_skate", true);
                }
                else{
                    boss.play(esta_se_movendo ? "lucas_lee_andando" : "lucas_lee_parado", true);
                }
                boss.setFlipX(boss.olhando);
            }
        }
    }

    // Mesmo esqueleto de verificar_ataque_inimigos (funcoes_online.js), só que pro boss: só o jogador
    // LOCAL avisa o servidor (senão numa sala com 3 jogadores o mesmo golpe iria 3 vezes). O dano é
    // calculado aqui no front e mandado pronto; o servidor só desconta. O boss não leva empurrão.
    verificar_ataque_boss() {
        const boss = this.boss;
        const atacante = this.jogador;

        if (!boss || !boss.active || boss.derrotado || boss.hp_atual <= 0 || !boss.area_dano?.body) {
            return;
        }
        
        if (!this.pode_comecar){
            return;
        }
        if (!atacante || !atacante.body || atacante.derrotado){
            return;
        }

        // só interessa golpe já confirmado pelo servidor, com a hitbox ligada
        if (!atacante.atacando || !atacante.area_ataque.body.enable){
            return;
        }

        // mesmo Set que os inimigos comuns usam: cada golpe só conta uma vez (é zerado a cada golpe)
        if (!atacante.inimigos_acertados) atacante.inimigos_acertados = new Set();
        if (atacante.inimigos_acertados.has(boss.id)) return;

        if (!this.physics.overlap(atacante.area_ataque, boss.area_dano)){
            return;
        }

        atacante.inimigos_acertados.add(boss.id);

        if (boss.atacando || boss.invencibilidade){
            return;
        }


        if (!this.mostrar_sala || this.mostrar_sala.readyState !== WebSocket.OPEN) {
            console.warn("[Boss_1_online] socket não tá aberto, não deu pra avisar o servidor do dano no boss.");
            return;
        }

        // anti-spam (igual ao offline): repetiu o mesmo golpe várias vezes -> o boss prevê e defende
        if (this.sistema_anti_spam_boss(atacante.tipo_ataque)) {
            this.mostrar_sala.send(JSON.stringify({
                tipo: "bossSeDefendeu",
                idInimigo: boss.id
            }));
            this.boss_defendendo_online();
            return;
        }

        const dano = calcular_dano_jogador_inimigo(this, atacante, boss);

        console.log(`[Boss_1_online] golpe "${atacante.tipo_ataque}" acertou o boss — dano: ${dano}`);

        this.mostrar_sala.send(JSON.stringify({
            tipo: "danoNoBoss",
            idBoss: boss.id,
            dano: dano
        }));

        this.boss_tomando_dano(dano);
    }

    boss_tomando_dano(dano) {
        const boss = this.boss;
        if (!boss || !boss.active || boss.derrotado) return;

        boss.hp_atual = Math.max(0, boss.hp_atual - dano);
        boss.ultimo_dano_local = this.time.now;
        this.atualizar_hud_boss_1();

        this.boss_reagir_dano();
    }

    boss_reagir_dano() {
        const boss = this.boss;
        if (!boss || !boss.active || boss.derrotado || boss.atacando || boss.defendendo) return;

        boss.invencibilidade = true;

        inimigo_flash_dano(this, boss);

        if (this.anims.exists("lucas_lee_machucado")) {
            boss.play("lucas_lee_machucado", true).setFlipX(boss.olhando);
        }

        if (this.timer_reacao_dano) this.timer_reacao_dano.remove(false);

        this.timer_reacao_dano = this.time.delayedCall(300, () => {
            if (!boss.active) return;

            inimigo_parar_flash_dano(boss);
            boss.invencibilidade = false;
        });
    }


    boss_golpe_confirmado(mensagem) {
        // inimigo comum (id que está no Map deles): mesmo tratamento da Rua_online.
        // Qualquer outra coisa é golpe do boss.
        const id_msg = mensagem?.idInimigo;
        if (id_msg && this.inimigos_online.has(id_msg)) {
            aplicar_golpe_inimigo_confirmado(this, mensagem);
            return;
        }

        const boss = this.boss;

        if (!boss || !boss.active || boss.derrotado) {
            return;
        }
        if (!this.pode_comecar) {
            return;
        }
        if (boss.atacando) {
            return;
        }

        let animacao = mensagem.golpe;
        if (!animacao) {
            console.warn("[Boss_1_online] golpe do boss sem animação válida:", mensagem);
            return;
        }

        boss.atacando = true;
        boss.setVelocity(0);

        // cada golpe vale um "token": se algo resetar o ataque, timers antigos não mexem no golpe novo
        const token = (boss.golpe_token ?? 0) + 1;
        boss.golpe_token = token;

        boss.anims.stop();
        boss.setTexture(animacao).setFlipX(boss.olhando);

        this.time.delayedCall(1000, () => {
            if (!boss.active || boss.derrotado || boss.golpe_token !== token) return;

            boss.play(animacao, true).setFlipX(boss.olhando);

            boss.alvos_acertados = new Set();
            boss.area_ataque.body.enable = true;

            // 3) libera quando a animação terminar
            boss.once(`animationcomplete-${animacao}`, () => {
                if (boss.golpe_token !== token) return;
                this.terminar_golpe_boss();
            });
        });

        // segurança: se a animação for interrompida e o "animationcomplete" nunca vier, não deixa o boss travado
        this.time.delayedCall(3700, () => {
            if (boss.golpe_token === token && boss.atacando) this.terminar_golpe_boss();
        });
    }

    terminar_golpe_boss() {
        const boss = this.boss;
        if (!boss || !boss.active) return;

        if (boss.area_ataque?.body) boss.area_ataque.body.enable = false;
        boss.atacando = false;
        boss.play("lucas_lee_parado", true).setFlipX(boss.olhando);
    }
    

    atualizar_hud_boss_1() {
        if (!this.boss) {
            return;
        }

        const hp_total = this.boss.hp_total;
        const hp_atual = Math.max(0, this.boss.hp_atual);
        const porcentagem = (hp_atual / hp_total) * 100;

        const barra = document.getElementById("vida_boss_1");
        const texto = document.getElementById("texto_vida_boss_1");
        if (!barra || !texto) return;

        barra.style.setProperty("--hp-boss-width", porcentagem + "%");
        texto.textContent = `${hp_atual}/${hp_total}`;

        barra.classList.remove("hp_boss_medio", "hp_boss_critico");
        if (porcentagem <= 25) {
            barra.classList.add("hp_boss_critico");
        } 
        else if (porcentagem <= 50) {
            barra.classList.add("hp_boss_medio");
        }
    }

    // Mesma lógica do sistema_anti_spam do Boss_1 offline: a cada golpe que chegaria no boss guarda o
    // tipo; a partir do 3º igual seguido a chance do boss prever e defender sobe 25% por repetição
    // (3º = 25%, 4º = 50%, 5º = 75%, máx 90%). Trocar de golpe zera a contagem.
    sistema_anti_spam_boss(ataque_usado) {
        const boss = this.boss;

        const ultimo_ataque = boss.lista_ataques.length > 0 ? boss.lista_ataques[boss.lista_ataques.length - 1] : null;

        boss.lista_ataques.push(ataque_usado);
        // não deixa a lista crescer pra sempre (só o último golpe importa)
        if (boss.lista_ataques.length > 10) boss.lista_ataques.shift();

        if (ultimo_ataque === ataque_usado) {
            boss.ataques_repetidos++;
        }
        else {
            boss.ataques_repetidos = 1;
        }

        if (boss.ataques_repetidos >= 3) {
            let chance_errar = 25 * (boss.ataques_repetidos - 2);
            chance_errar = Phaser.Math.Clamp(chance_errar, 0, 90);

            if (Phaser.Math.Between(0, 100) < chance_errar) {
                console.log("[Boss_1_online] o boss previu o ataque!");
                return true;
            }
        }

        return false;
    }

    // chamado por quem defendeu (jogador local, via anti-spam) e por "inimigoSeDefender" (outros jogadores)
    boss_defendendo_online() {
        const boss = this.boss;

        if (!boss || !boss.active || boss.derrotado || boss.atacando || boss.defendendo) {
            return;
        }

        boss.defendendo = true;
        boss.invencibilidade = true;
        boss.setVelocity(0);
        boss.play(this.turno === "QUARTO_TURNO" ? "lucas_lee_defendendo_skate" : "lucas_lee_defendendo").setFlipX(boss.olhando);

        if (this.timer_defesa) this.timer_defesa.remove(false);

        this.timer_defesa = this.time.delayedCall(500, () => {
            if (!boss.active) return;

            boss.defendendo = false;
            boss.invencibilidade = false;
        });
    }

    boss_derrotado(){

        console.warn("O BOSS FOI DERROTADO!!!!!!");
        const boss = this.boss;

        if (!boss || boss.derrotado){
            return;
        }

        boss.derrotado = true;
        this.luta_acabou = true;
        boss.invencibilidade = true;
        boss.setVelocity(0);

        boss.area_dano.body.enable = false;
        boss.area_ataque.body.enable = false;

        const hud_boss = document.getElementById("hud_boss_1");
        if (hud_boss) {
            hud_boss.style.display = "none";
        }

        const jogadores_vitoria = Array.from(this.jogadores_online.values()).filter(jogador => jogador === this.jogador || !jogador.derrotado);

        const nome_animacao = (jogador, animacao) => {
            return `${jogador.genero === "feminino"? "ramona": "scott"}_${animacao}_${jogador.skin}`;
        };

        const olhando_direita_jogador = (jogador) => {
            return jogador === this.jogador? this.olhando_direita: jogador.olhando_direita;
        };

        jogadores_vitoria.forEach(jogador => {
            jogador.setVelocity(0);
            jogador.play(nome_animacao(jogador, "parado"), true).setFlipX(olhando_direita_jogador(jogador));
        });

        boss.play("lucas_lee_derrotado").setFlipX(boss.olhando);
        boss.once("animationcomplete-lucas_lee_derrotado",()=>{
            boss.setFrame(5);
            boss.anims.stop();
            this.time.delayedCall(1000, ()=>{

                jogadores_vitoria.forEach(jogador => {
                    const animacao = 2;
                    const comemorando = nome_animacao(jogador, `comemorando_${animacao}`);

                    jogador.play(comemorando).setFlipX(olhando_direita_jogador(jogador));
                    jogador.once(`animationcomplete-${comemorando}`, ()=>{
                        jogador.play(nome_animacao(jogador, "final")).setFlipX(olhando_direita_jogador(jogador));

                        if(jogador !== this.jogador){
                            return;
                        }

                        this.time.delayedCall(3000, ()=>{
                            if(this.bonus && this.sfx_ligado){
                                this.sound.play("astucia");
                            }
                            this.jogador.anims.stop();
                            tela_vitoria(this, "Boss_1_online", 0,  0, 0, 0);
                        })
                    })
                });
            })
            
        });

    }



    enviar_posicao_pro_servidor(x, y) {
        if (!this.mostrar_sala || this.mostrar_sala.readyState !== WebSocket.OPEN) {
            console.warn("[Boss_1_online] tentei mandar 'andar' mas o socket não tá aberto.");
            return;
        }

        if(this.boss?.derrotado){
            return;
        }

        this.mostrar_sala.send(JSON.stringify({
            tipo: "andar",
            x: x,
            y: y,
            direcao: this.olhando_direita
        }));
    }

}

//tipo:"danoNoBoss"
//idBoss:
//dano:

//tipo:"atualizarTurno"
//o que eu recebo:
//turno:vai vir o turno

//turnos:"SEM_TURNO"
//PRIMEIRO_TURNO
//SEGUNDO_TURNO
//TERCEIRO_TURNO
//QUARTO_TURNO

//defesa do boss(envia pro servidor)
//tipo:"bossSeDefendeu"
//idInimigo:(id do boss)

//recebo:
//tipo:"inimigoSeDefender"
//idInimigo:(id do boss)


//quando a luta acaba:(recebe)
//tipo:"fimDaPartida"