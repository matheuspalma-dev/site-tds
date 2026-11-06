import {abrir_socket, pegar_ultima_lista_jogadores, pegar_ultima_lista_inimigos, pegar_ultima_lista_barreiras, pegar_ultima_lista_itens} from "./websocket.js"
import {assets_jogador, criar_jogador, animacoes_jogador, criar_fundo, assets_mapa_1, animacao_mapa_1, animacao_barreiras, sprite_latas, animacoes_latas, sprite_itens} from "./funcoes.js"
import {atualizar_jogadores_online, animar_jogador_online, tentar_atacar, verificar_pvp, html_online, mover_selecao_morte_online, confirmar_selecao_morte_online, atualizar_inimigos_online, verificar_ataque_inimigos, inimigos_online_update, verificar_ataque_inimigo_jogador, criar_barreiras_online, verificar_ataque_barreiras, clampar_no_mundo, criar_lixeiras_online, verificar_ataque_latas, efeitos_online, verificar_pegar_itens_online, ir_boss} from "./funcoes_online.js"

export class Rua_online extends Phaser.Scene {
    constructor() {
        super('Rua_online');
    }

    init(data) {
        this.genero = data.genero;
        this.skin = data.skin;
        this.bonus = data.bonus;
        this.cutscene = false;
        this.entrando_boss = false;
        this.pausa_aberta = false;

        this.jogador = null;
        this.camera_alvo = null;
        this.foto_jogadores_boss = null;
        this.foto_jogadores_anterior = null;

        // ESSENCIAL: reaproveita a conexão já aberta no lobby (Jogo.js).
        // Sem isso, abrir_socket() aqui embaixo não acha this.mostrar_sala
        // e abre uma conexão NOVA — uma sessão nova no servidor, sem sala,
        // sem saber que esse jogador acabou de criar/entrar numa sala.
        this.mostrar_sala = data.socket;

        if (!this.mostrar_sala) {
            console.error(
                "[Rua_online.init] data.socket não veio! O Jogo.js precisa passar",
                "socket: this.mostrar_sala no scene.start('Rua_online', {...}).",
                "Sem isso, vai abrir uma conexão nova e ninguém vai ver ninguém."
            );
        }

        document.body.style.setProperty("--fundo", "black");
    }

    preload() {
        assets_jogador(this);

        assets_mapa_1(this);
        this.load.image("rua", "assets/conteudo/mapa_1/mapa/rua.png");

        sprite_latas(this);

        sprite_itens(this);
    }

    create() {
        html_online(this);

  
        efeitos_online(this);
        this.events.once("shutdown", () => efeitos_online(this));
        criar_fundo(this, -3000, "rua", 2,0.2, 0.4, 450, 230);
  
        animacao_mapa_1(this);

        this.jogadores_online = new Map();

        this.inimigos_online = new Map();
 
        this.inimigos_derrotados_ids = new Set();

        this.grupo_jogadores = this.physics.add.group();
        this.grupo_inimigos = this.physics.add.group();
        this.grupo_barreiras = this.physics.add.group();

   
        this.latas_online = new Map();

        this.latas_destruidas_ids = new Set();
        this.itens_online = new Map();

        this.grupo_itens = this.physics.add.group();
        this.grupo_latas = this.physics.add.group();


     
        this.physics.add.collider(this.grupo_barreiras, this.grupo_jogadores);


        this.physics.add.collider(this.grupo_latas, this.grupo_jogadores);

        this.teclas = this.input.keyboard.addKeys({
            cima: Phaser.Input.Keyboard.KeyCodes.UP,
            baixo: Phaser.Input.Keyboard.KeyCodes.DOWN,
            esquerda: Phaser.Input.Keyboard.KeyCodes.LEFT,
            direita: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,

            p:Phaser.Input.Keyboard.KeyCodes.P
        });

        this.teclas_ataque = this.input.keyboard.addKeys({
            z: Phaser.Input.Keyboard.KeyCodes.Z,
            x: Phaser.Input.Keyboard.KeyCodes.X,
            c: Phaser.Input.Keyboard.KeyCodes.C,
            v: Phaser.Input.Keyboard.KeyCodes.V,
            b: Phaser.Input.Keyboard.KeyCodes.B
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
                //L1 abre o menu de pausa
                if (botao.index === 4) {
                    this.abrir_pausa_online();
                    return;
                }

                if (!this.jogador?.derrotado) return;

                if (botao.index === 12) {
                    mover_selecao_morte_online(this, "cima");
                } 
                else if (botao.index === 13) {
                    mover_selecao_morte_online(this, "baixo");
                } 
                else if (botao.index === 0) {
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

        abrir_socket(this);

        // Se o servidor já tinha mandado "atualizarJogadores" ANTES dessa cena
        // terminar de nascer (corrida comum logo depois do scene.start), aplica
        // essa lista guardada agora, em vez de esperar uma mensagem nova chegar.
        const jogadores_pendentes = pegar_ultima_lista_jogadores();
        console.log("[Rua_online] lista de jogadores pendente ao criar a cena:", jogadores_pendentes);
        if (jogadores_pendentes) {
            atualizar_jogadores_online(this, jogadores_pendentes);
        }

        const inimigos_pendentes = pegar_ultima_lista_inimigos();
        console.log("[Rua_online] lista de inimigos pendente ao criar a cena:", inimigos_pendentes);
        if (inimigos_pendentes) {
            atualizar_inimigos_online(this, inimigos_pendentes);
        }

        const barreiras_pendentes = pegar_ultima_lista_barreiras();
        console.log("[Rua_online] lista de barreiras pendente ao criar a cena:", barreiras_pendentes);
        if (barreiras_pendentes) {
            criar_barreiras_online(this, barreiras_pendentes);
            console.log("[Rua_online] barreiras pendentes criadas com sucesso:", barreiras_pendentes);
        }

        animacao_barreiras(this);

        animacoes_latas(this);

        const itens_pendentes = pegar_ultima_lista_itens();
        console.log("[Rua_online] lista de itens pendente ao criar a cena:", itens_pendentes);
        if (itens_pendentes) {
            criar_lixeiras_online(this, itens_pendentes);
        }

        this.entrar_boss = this.add.rectangle(10000, 550, 100, 500, 0x0000ff, 0);
        this.physics.add.existing(this.entrar_boss, true);

        ir_boss(this, this.entrar_boss);

        this.pausa_aberta = false;

        this.teclas.p.on("down", () => {
            this.abrir_pausa_online();
        });

    }

    abrir_pausa_online() {
        if (this.pausa_aberta || this.jogador?.derrotado || this.cutscene || this.entrando_boss) {
            return;
        }

        this.pausa_aberta = true;
        this.scene.launch("Pausa", {mapa: "Rua_online", motivo: "pausa_online"});
    }

    update(time) {
        this.jogadores_online.forEach(jogador => {
            if (jogador !== this.jogador && !jogador.atacando && !jogador.machucado) {
                const distancia_x = jogador.targetX - jogador.x;
                const distancia_y = jogador.targetY - jogador.y;

                // Se ainda falta uma distância perceptível pra chegar no alvo,
                // consideramos que ele "tá andando" (mesmo que o pacote mais
                // recente já tenha chegado e ele só esteja terminando de
                // deslizar até lá pela interpolação).
                const esta_se_movendo = Math.hypot(distancia_x, distancia_y) > 1;

                let olhando_direita = jogador.olhando_direita;
                if (Math.abs(distancia_x) > 1) {
                    olhando_direita = distancia_x > 0;
                }

                jogador.x = Phaser.Math.Linear(jogador.x, jogador.targetX, 0.2);
                jogador.y = Phaser.Math.Linear(jogador.y, jogador.targetY, 0.2);

                animar_jogador_online(jogador, esta_se_movendo, olhando_direita, jogador.skin);
            }

            jogador.setDepth(jogador.body.y);
            jogador.area_ataque.setPosition(jogador.x + (jogador.olhando ? -30 : 30), jogador.y + 10);
            jogador.area_dano.setPosition(jogador.x, jogador.y + 20);
        });

        verificar_pvp(this);

        inimigos_online_update(this);

        verificar_ataque_inimigos(this);

        verificar_ataque_barreiras(this);

        verificar_ataque_latas(this);

        verificar_pegar_itens_online(this);

        verificar_ataque_inimigo_jogador(this);

        this.mover_jogador_local(time);
    }

    mover_jogador_local(time) {
        const jogador = this.jogador;

 
        if (!jogador || !jogador.body){
            return;
        }

        if (this.cutscene) {
            jogador.setVelocity(0);
            return;
        }

        if (jogador.derrotado) {
            //morreu com o menu de pausa aberto: fecha ele (o menu de morte assume)
            if (this.pausa_aberta) {
                this.pausa_aberta = false;
                document.getElementById("menu_pausa_online").style.display = "none";
                this.scene.stop("Pausa");
            }
            jogador.setVelocity(0);
            return;
        }

        //menu de pausa aberto: o jogo continua rodando pros outros, mas o jogador
        //local fica parado e sem atacar (as setas e o Z sao do menu)
        if (this.pausa_aberta) {
            jogador.setVelocity(0);
            animar_jogador_online(jogador, false, this.olhando_direita, jogador.skin);
            if (!this.enviou_parada) {
                this.enviar_posicao_pro_servidor(jogador.x, jogador.y);
                this.enviou_parada = true;
            }
            return;
        }

        // travar o "atacando" aqui embaixo.
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

        const velocidade = this.buff_velocidade? 250 : 180;
        let vx = 0;
        let vy = 0;

        // jogador.play(jogador.genero === "feminino"? "ramona_parada": "scott_parado");

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

            // manda a posição REAL do sprite (já respeitando colisão)
            if (time >= this.proximo_envio_permitido) {
                this.enviar_posicao_pro_servidor(jogador.x, jogador.y);
                this.proximo_envio_permitido = time + this.intervalo_envio_ms;
            }
        } 
        else if (!this.enviou_parada) {

            this.enviar_posicao_pro_servidor(jogador.x, jogador.y);
            this.enviou_parada = true;
        }

        tentar_atacar(this);
    }

    enviar_posicao_pro_servidor(x, y) {
        if (!this.mostrar_sala || this.mostrar_sala.readyState !== WebSocket.OPEN) {
            console.warn("[Rua_online] tentei mandar 'andar' mas o socket não tá aberto.");
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