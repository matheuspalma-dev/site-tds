import {animacoes, assets_jogador, assets_mapa_3, assets_sfx, sprite_itens, html, criar_jogador, variaveis_jogador, areas_jogador, animacoes_jogador, teclas_movimento, teclas_ataques, apertou_tecla, configurar_gamepad, apertou_botao_gamepad, criar_escuridao, animacao_mapa_3, jogador_update,  movimento_jogador, verifica_ataque, jogador_tomando_dano, atualizar_barra_hp, status_inimigos, criar_barra_hp, inimigo_update, ataque_inimigo, atualizar_spawn_portas, interagindo_com_item, pausa, tela_vitoria, agendar_fantasma, fantasma_update, criar_barra_hp_boss, atualizar_barra_hp_boss, inimigo_flash_dano, inimigo_parar_flash_dano, boss_derrotado, inimigo_derrotado, criar_latas, sprite_latas, lata_overlap, latas_update, animacoes_latas, colliders} from "./funcoes.js";
export class Boss_3 extends Phaser.Scene {
    constructor() {
        super('Boss_3');
    }

    init(data) {
        this.genero = data.genero;
        this.skin = data.skin;
        this.registry.set("bonus", this.bonus);
        this.hp_atual = data.hp;
        this.pontos = data.pontuacao;
        this.inimigos_derrotados = data.inimigos_derrotados;
        this.tempo = data.tempo;
        this.hits = data.hits;
        this.bonus = data.bonus;
    }

    preload() {
        assets_jogador(this);
        assets_mapa_3(this);
        assets_sfx(this);
        sprite_itens(this);

        //robo

        this.load.spritesheet("robo_parado", "assets/conteudo/mapa_3/boss/RobotParado60x99.png", {frameWidth:60, frameHeight:99});
        this.load.spritesheet("robo_andando", "assets/conteudo/mapa_3/boss/RobotAndando75x99.png", {frameWidth:75, frameHeight:99});

        //ataques
        this.load.spritesheet("robo_ataque_1", "assets/conteudo/mapa_3/boss/RobotAtaque180x99.png", {frameWidth:80, frameHeight:99}); //soco
        this.load.spritesheet("robo_ataque_2", "assets/conteudo/mapa_3/boss/RobotChute190x99.png", {frameWidth:90, frameHeight:99}); //chute
        this.load.spritesheet("robo_ataque_especial", "assets/conteudo/mapa_3/boss/RobotAtaque2650x99.png", {frameWidth:650, frameHeight:99}); //laser

        //tomando dano
        this.load.spritesheet("robo_machucado", "assets/conteudo/mapa_3/boss/RobotTomandoDano65x99.png", {frameWidth:65, frameHeight:99});

        //defendendo
        this.load.spritesheet("robo_defendendo", "assets/conteudo/mapa_3/boss/RobotSeDefendendo85x99.png", {frameWidth:85, frameHeight:99});

        //derrotado
        this.load.spritesheet("robo_derrotado", "assets/conteudo/mapa_3/boss/RobotSendoDerrotado75x99.png", {frameWidth:75, frameHeight:99});

        //recuperando vida

        this.load.spritesheet("robo_regenerando", "assets/conteudo/mapa_3/boss/RobotRecuperandoVida80x99.png", {frameWidth:80, frameHeight:99});

        //fundo

        this.load.image("boss", "assets/conteudo/mapa_3/mapa/prisao.png");

        //pilar

        this.load.image("pilar", "assets/conteudo/mapa_3/mapa/pilar.png");

        sprite_latas(this);
    }

    create() {
        this.sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";

        this.sound.stopAll();
        if (this.cache.audio.exists("boss")) {
            this.musica = this.sound.add("boss", { loop: true, volume: 0.5 });
            this.musica.play();
        }

        this.cameras.main.fadeOut(0);
        this.cameras.main.fadeIn(1500); 

        this.pode_comecar = true;

        this.fundo = this.add.image(-5700, this.cameras.main.centerY, 'boss').setScale(2).setOrigin(0.4, 0.5);

        this.cameras.main.setBounds(0, 0, this.fundo.width * this.fundo.scaleX, this.fundo.height * this.fundo.scaleY); //LIMITE DA CAMERA

        this.physics.world.setBounds(0, 480, 2100, 160);

        html(this);

        //JOGADOR !!!

        criar_jogador(this, 250, 500, 1.5, this.hp_atual);

        atualizar_barra_hp(this);

        variaveis_jogador(this, Math.floor(this.pontos), this.inimigos_derrotados, this.hits);

        areas_jogador(this);

        animacoes_jogador(this);

        //teclas para os ataques
        
        teclas_movimento(this);

        teclas_ataques(this);

        configurar_gamepad(this);
        apertou_botao_gamepad(this);

        //verifica se vc pressionou a tecla de ataque

        apertou_tecla(this);

        //animacoes do boss

        if(!this.anims.exists("robo_parado")){
            animacoes(this, "robo_parado", "robo_parado", 5, 10, -1);
        }
        if(!this.anims.exists("robo_andando")){
            animacoes(this, "robo_andando", "robo_andando", 7, 10, -1);
        }

        if(!this.anims.exists("robo_ataque_1")){
            animacoes(this, "robo_ataque_1", "robo_ataque_1", 6, 10, 0);
        }
        if(!this.anims.exists("robo_ataque_2")){
            animacoes(this, "robo_ataque_2", "robo_ataque_2", 3, 8, 0);
        }
        if(!this.anims.exists("robo_ataque_especial")){
            animacoes(this, "robo_ataque_especial", "robo_ataque_especial", 14, 18, 0);
        }

        if(!this.anims.exists("robo_defendendo")){
            animacoes(this, "robo_defendendo", "robo_defendendo", 7, 10, 0);
        }

        if(!this.anims.exists("robo_machucado")){
            animacoes(this, "robo_machucado", "robo_machucado", 4, 8, 0);
        }
        if(!this.anims.exists("robo_derrotado")){
            animacoes(this, "robo_derrotado", "robo_derrotado", 6, 10, 0);
        }

        if(!this.anims.exists("robo_regenerando")){
            animacoes(this, "robo_regenerando", "robo_regenerando", 10, 15, 0);
        }

        animacao_mapa_3(this);

        this.barreiras = this.add.group();

        criar_latas(this, 5, 5, 200, 2000, 470, 600 );

        //animacoes das latas

        animacoes_latas(this);

        //verifica se o jogador acertou a alata

        lata_overlap(this);

        this.inimigos = this.physics.add.group();

        this.criar_boss();

        //ataque do jogador no boss

        this.physics.add.overlap(this.area_ataque, this.boss.area_dano, ()=>{
            this.verifica_ataque_boss();
        }, null, this);

        //ataque do boss no jogador

        this.physics.add.overlap(this.area_dano, this.boss.area_ataque, ()=>{
            if(this.jogador.invencibilidade){
                return;
            }
            this.jogador_atingido_pelo_boss();
        }, null, this);

        //ataque especial do boss no jogador (area maior, mais forte)
        this.physics.add.overlap(this.area_dano, this.boss.area_ataque_especial, ()=>{
            if(this.jogador.invencibilidade){
                return;
            }
            this.jogador_atingido_pelo_boss_especial();
        }, null, this);


        this.itens = this.physics.add.group();

        this.physics.add.overlap(this.jogador, this.itens, (jogador, item)=>{
            interagindo_com_item(this, item);
        })

        this.physics.add.collider(this.jogador, this.boss);


        pausa(this, "Boss_3", "pausa");

        this.area_spawn_1 = this.add.zone(500, 470, 150, 30);
        this.physics.world.enable(this.area_spawn_1);
        this.area_spawn_1.body.setAllowGravity(false);

        this.area_spawn_2 = this.add.zone(1870, 470, 150, 30);
        this.physics.world.enable(this.area_spawn_2);
        this.area_spawn_2.body.setAllowGravity(false);

        this.pilares =  this.physics.add.group();

        this.criar_pilares(600);

        this.criar_pilares(1200);

        this.criar_pilares(1800);

        this.iniciar_spawn_inimigos();

        colliders(this);
        
    }

    update(){
        if(this.pode_atacar && this.pode_comecar && !this.boss.derrotado){
            movimento_jogador(this);  
        }

        jogador_update(this);

        latas_update(this);

        this.boss.setDepth(this.boss.body.y);

        //enquanto o boss esta indo curar (ou ja curando) em um pilar, a direcao dele e controlada
        //pela posicao do pilar (mover_ate_pilar), entao esse calculo generico por velocidade fica
        //de fora - se nao, um empurrao/colisao no meio do caminho podia inverter o "olhando" e
        //deixar o boss olhando pro lado errado quando chegasse no pilar
        if(!this.boss.curando){
            if(this.boss.body.velocity.x < 0){
                this.boss.olhando = true;
            }
            else if(this.boss.body.velocity.x > 0){
                this.boss.olhando = false;
            }
        }

        if(this.exclamacao_ativa && this.exclamacao_ativa.active){
            this.exclamacao_ativa.setPosition(this.boss.x, this.boss.y - 90);
        }

        this.boss.area_ataque.setPosition(this.boss.x + (this.boss.olhando? -40:40), this.boss.y + 10);
        this.boss.area_dano.setPosition(this.boss.x, this.boss.y + 10);
        this.boss.area_ataque_especial.setPosition(this.boss.x, this.boss.y + 30);

        if(this.pode_comecar){
            inimigo_update(this);
        }

        this.inimigos.children.iterate((inimigo)=>{
            if(inimigo && inimigo.active){
                inimigo.setDepth(inimigo.body.y);
            }
        });

        this.pilares.children.iterate((pilar)=>{
            if(pilar && pilar.active){
                pilar.setDepth(pilar.body.y);
            }
        })

        if(this.boss_estado === this.estado.fase_1 && this.pode_comecar && !this.boss.derrotado){
            this.atualizar_combate_boss();
        }

        if(this.boss.derrotado && !this.boss_venceu_disparado){
            this.boss_venceu_disparado = true;
            this.finalizar_luta();
        }
    }

    criar_boss(){
        this.boss = this.physics.add.sprite(700, 500, 'robo_parado').setScale(1.5).setFlipX(true);

        this.boss.ataque = 10;
        this.boss.defesa = 30;
        this.boss.velocidade = 90;

        this.boss.hp = 500;
        this.boss.hp_total = 500;

        this.boss.nome = "robo";

        this.boss.tipo = "boss";

        this.boss.invencibilidade = false;
        this.boss.perseguindo = true;
        this.boss.atacando = false;
        this.boss.pode_atacar = true;
        this.boss.tomando_dano = false;
        this.boss.defendendo = false;
        this.boss.derrotado = false;

        this.boss.alcance_ataque = 80; //distancia para o boss atacar corpo a corpo (igual fase 2 do boss_2)
        this.boss.tipo_ataque_atual = null; // "soco" ou "chute", usado pro empurrao no jogador

        //peculiaridade do boss_3: cura em um dos pilares quando o hp cai para 650 ou menos
        this.boss.pode_curar = true;
        this.boss.curando = false;
        this.boss.pilares_destruidos = 0;
        
        this.boss.olhando = true; 

        this.criar_body_boss();
        this.criar_areas_boss(80, 50, 50, 80 );
        this.criar_area_ataque_especial();

        criar_barra_hp_boss(this, this.boss, "boss_3");

        this.boss.setPushable(false);
        this.boss.setImmovable(true);
        this.boss.setCollideWorldBounds(true);

        this.lista_ataques = [];
        this.ataques_repetidos = 0;

        //estado do boss

        this.estado = {
            fase_1:0,
            fase_2:1,
        }

        this.boss_estado = this.estado.fase_1;

        //cooldown entre ataques, igual ao usado na fase 2 do boss_2
        this.tempo_cooldown_ataque = [1000, 2000];
    }

    criar_body_boss(){
        this.boss.body.setSize(10, 10);
        this.boss.body.setOffset(30, 90);
    }

    criar_areas_boss(largura_ataque, altura_ataque, largura_dano, altura_dano){
        this.boss.area_ataque = this.add.zone(this.boss.x, this.boss.y, largura_ataque, altura_ataque);
        this.physics.world.enable(this.boss.area_ataque);
        this.boss.area_ataque.body.setAllowGravity(false);
        this.boss.area_ataque.body.enable = false;

        this.boss.area_dano = this.add.zone(this.boss.x, this.boss.y, largura_dano, altura_dano);
        this.physics.world.enable(this.boss.area_dano);
        this.boss.area_dano.body.setAllowGravity(false);
    }

    //area do ataque especial (desbloqueado depois de 2 pilares quebrados): bem maior que a area normal,
    //pega muito mais espaço horizontal (e um pouco de vertical) na frente e atras do boss
    criar_area_ataque_especial(){
        this.boss.area_ataque_especial = this.add.zone(this.boss.x, this.boss.y, 800, 30);
        this.physics.world.enable(this.boss.area_ataque_especial);
        this.boss.area_ataque_especial.body.setAllowGravity(false);
        this.boss.area_ataque_especial.body.enable = false;
    }

    //FUNÇÕES DE SPAWN DE INIMIGOS (nas areas de spawn, mesmo esquema das portas do funcoes.js)

    iniciar_spawn_inimigos(){
        this.skins_spawn_boss3 = ["brad", "rex", "cachorro", "william"];
        this.max_inimigos_spawn = 2; //teto de inimigos vivos vindos das areas de spawn ao mesmo tempo
        this.intervalo_spawn_inimigo = 15000; //nasce um inimigo a cada 10 segundos, igual ao spawn das portas

        this.timer_spawn_inimigo = this.time.addEvent({
            delay: this.intervalo_spawn_inimigo,
            loop: true,
            callback: ()=> this.spawnar_inimigo_area(),
            callbackScope: this
        });
    }

    spawnar_inimigo_area(){
        if(this.boss.derrotado || !this.pode_comecar){
            return;
        }

        //protecao extra: se por algum motivo o timer ainda existir depois das areas de spawn
        //terem sido destruidas (todos os pilares ja foram quebrados), nao faz nada
        if(!this.area_spawn_1 || !this.area_spawn_2){
            return;
        }

        let vivos = this.inimigos.getChildren().filter((inimigo)=> inimigo.active).length;

        if(vivos >= this.max_inimigos_spawn){
            return;
        }

        let area = Phaser.Utils.Array.GetRandom([this.area_spawn_1, this.area_spawn_2]);
        let skin = Phaser.Utils.Array.GetRandom(this.skins_spawn_boss3);

        this.criar_inimigo_area(skin, area);
    }

    //chamada quando o ultimo pilar e destruido: para o timer de spawn e destroi as proprias
    //areas de spawn, entao nenhum inimigo novo nasce mais (os que ja estao vivos continuam normal)
    parar_spawn_inimigos(){
        if(this.timer_spawn_inimigo){
            this.timer_spawn_inimigo.remove(false);
            this.timer_spawn_inimigo = null;
        }

        if(this.area_spawn_1){
            this.area_spawn_1.destroy();
            this.area_spawn_1 = null;
        }

        if(this.area_spawn_2){
            this.area_spawn_2.destroy();
            this.area_spawn_2 = null;
        }
    }

    criar_inimigo_area(skin, area){
        let x = area.x + Phaser.Math.Between(-40, 40);
        let y = area.y;

        let inimigo = this.physics.add.sprite(x, y, `${skin}_parado`).setScale(1.5);

        inimigo.skin = skin;
        inimigo.olhando = Phaser.Math.Between(1,2) === 1;

        inimigo.invencibilidade = true;
        inimigo.perseguindo = false;
        inimigo.atacando = false;
        inimigo.pode_atacar = false;
        inimigo.esperando_ataque = false;
        inimigo.provocado = false;
        inimigo.tipo = "inimigo";
        inimigo.empurrado = false;
        inimigo.drop = 5;
        inimigo.nascendo = true;
        inimigo.visao = 99999;

        status_inimigos(inimigo);

        criar_barra_hp(this, inimigo, inimigo.hp_total);

        inimigo.area_ataque = this.add.zone(inimigo.x, inimigo.y, 50, 30);
        this.physics.world.enable(inimigo.area_ataque);
        inimigo.area_ataque.body.setAllowGravity(false);
        inimigo.area_ataque.body.enable = false;

        inimigo.area_dano = this.add.zone(inimigo.x, inimigo.y, 30, 30);
        this.physics.world.enable(inimigo.area_dano);
        inimigo.area_dano.body.setAllowGravity(false);

        inimigo.setPushable(false);
        inimigo.setCollideWorldBounds(true);

        inimigo.body.setSize(10, 10);
        inimigo.body.setOffset((inimigo.width - 10) / 2, inimigo.height - 10);

        inimigo.play(`${skin}_parado`, true).setFlipX(inimigo.olhando);

        //ataque do jogador no inimigo
        this.physics.add.overlap(this.area_ataque, inimigo.area_dano, ()=>{
            verifica_ataque(this, inimigo);
        }, null, this);

        //ataque do inimigo no jogador
        this.physics.add.overlap(inimigo.area_ataque, this.area_dano, ()=>{
            if(this.jogador.invencibilidade || inimigo.invencibilidade){
                return;
            }
            inimigo.area_ataque.body.enable = false;
            jogador_tomando_dano(this, inimigo);
        }, null, this);

        //ataque especial do boss pode acertar (e ate matar) os inimigos comuns, se eles estiverem na area
        this.physics.add.overlap(this.boss.area_ataque_especial, inimigo.area_dano, ()=>{
            this.especial_atinge_inimigo(inimigo);
        }, null, this);

        this.physics.add.collider(this.jogador, inimigo);
        this.physics.add.collider(this.boss, inimigo);
        this.physics.add.collider(inimigo, this.inimigos);

        this.inimigos.add(inimigo);

        //efeito de nascimento: fade-in e fica invulneravel ate terminar, igual ao spawn das portas
        inimigo.setAlpha(0);

        this.tweens.add({
            targets: inimigo,
            alpha: 1,
            duration: 1000,
            ease: "Linear",
            onComplete: ()=>{
                if(inimigo.active){
                    inimigo.nascendo = false;
                    inimigo.invencibilidade = false;
                    inimigo.pode_atacar = true;
                }
            }
        });

        return inimigo;
    }

    criar_pilares(x){
        let pilar = this.physics.add.image(x, 400, "pilar").setScale(0.5);

        pilar.hp = 50;
        pilar.hp_total = 100;
        pilar.defesa = 20;
        pilar.pontos = 50;
        pilar.tipo = "pilar";
        pilar.invencibilidade = false;
        pilar.destruido = false;

        this.body_pilares(pilar);

        pilar.setPushable(false);


        this.physics.add.collider(pilar, this.jogador);

        //ataque do jogador no pilar (pisca e toma dano igual os inimigos, some quando o hp acaba)
        this.physics.add.overlap(this.area_ataque, pilar.hitbox, ()=>{
            verifica_ataque(this, pilar);
        }, null, this);

        this.pilares.add(pilar);
    }

    body_pilares(pilar){
        pilar.body.setSize(60, 60);
        pilar.body.setOffset((pilar.width - 60) / 2, pilar.height - 180);

        pilar.hitbox = this.add.zone(pilar.x, pilar.y + 100, 20, 100);

        this.physics.world.enable(pilar.hitbox);
        pilar.hitbox.body.setAllowGravity(false);
    }

    //FUNÇÕES DOS PILARES

    //pilar leva o golpe: pisca igual os inimigos e, se o hp acabar, e destruido.
    pilar_atingido(pilar){
        pilar.invencibilidade = true;

        inimigo_flash_dano(this, pilar);

        if(pilar.hp <= 0){
            this.pilar_destruido(pilar);
            return;
        }

        //janela curta de invencibilidade so pra evitar tomar varios hits no mesmo golpe/frame
        this.time.delayedCall(400, ()=>{
            if(pilar && pilar.active){
                inimigo_parar_flash_dano(pilar);
                pilar.invencibilidade = false;
            }
        });
    }

    pilar_destruido(pilar){
        inimigo_parar_flash_dano(pilar);
        pilar.invencibilidade = true;
        pilar.destruido = true;

        if(pilar.body){
            pilar.setVelocity(0);
        }
        if(this.sfx_ligado){
            this.sound.play("quebrado");
        }

        //destruir um pilar tira 5% da vida maxima do boss
        if(this.boss && !this.boss.derrotado){
            this.boss.hp -= Math.round(this.boss.hp_total * 0.05);

            //a cada pilar quebrado o boss fica mais rapido e mais forte
            this.boss.pilares_destruidos++;
            this.boss.ataque += 1;
            this.boss.velocidade += 15;

            //todos os pilares foram destruidos: nenhum inimigo novo nasce mais nas areas de spawn
            if(this.boss.pilares_destruidos >= 3){
                this.parar_spawn_inimigos();
            }

            this.boss_percebendo_pilar_quebrado();

            inimigo_flash_dano(this, this.boss);
            this.time.delayedCall(300, ()=>{
                if(this.boss && this.boss.active && !this.boss.derrotado){
                    inimigo_parar_flash_dano(this.boss);
                }
            });

            atualizar_barra_hp_boss(this, this.boss);

            if(this.boss.hp <= 0){
                this.boss.hp = 0;
                atualizar_barra_hp_boss(this, this.boss);
                boss_derrotado(this, this.boss);
            }
            else if(this.boss.hp <= 300 && this.boss.pode_curar && !this.boss.curando && this.existem_pilares_para_curar()){
                this.iniciar_cura_boss();
            }
        }

        this.tweens.add({
            targets: pilar,
            alpha: 0,
            scaleX: pilar.scaleX * 0.7,
            scaleY: pilar.scaleY * 0.7,
            duration: 300,
            onComplete: ()=>{
                if(pilar.hitbox){
                    pilar.hitbox.destroy();
                }
                if(this.pilares){
                    this.pilares.remove(pilar);
                }
                pilar.destroy();
            }
        });
    }

    boss_perseguindo(){

    }

    //mostra um "!" vermelho piscando na cabeça do boss e toca a animação de tomando dano dele,
    //igual ao "MISS" que aparece nos inimigos comuns (mostrar_miss, no funcoes.js)
    boss_percebendo_pilar_quebrado(){
        if(!this.boss || !this.boss.active){
            return;
        }

        if(this.boss.curando){
            return;
        }

        // this.boss.setVelocity(0);

        // this.boss.play("robo_machucado", true).setFlipX(this.boss.olhando);

        let exclamacao = this.add.text(this.boss.x, this.boss.y - 90, "!", {
            fontSize: "28px",
            fontStyle: "bold",
            fill: "#ff0000",
            stroke: "#000000",
            strokeThickness: 4
        }).setOrigin(0.5, 0.5).setDepth(9999);

        //guarda a referencia pra o update() da cena ir reposicionando o "!" em cima do boss
        //enquanto ele pisca (o boss pode estar se movendo nesse momento)
        this.exclamacao_ativa = exclamacao;

        this.tweens.add({
            targets: exclamacao,
            alpha: 0,
            duration: 120,
            yoyo: true,
            repeat: 2, //pisca umas 3 vezes, igual o miss
            onComplete: ()=>{
                //a partir daqui ele so sobe e some, solto da posicao do boss (nao segue mais)
                this.exclamacao_ativa = null;

                this.tweens.add({
                    targets: exclamacao,
                    y: exclamacao.y - 20,
                    alpha: 0,
                    duration: 300,
                    onComplete: ()=> exclamacao.destroy()
                });
            }
        });

        this.finalizar_ataque_boss();
    }

    //IA de combate: persegue o jogador e ataca corpo a corpo quando esta no alcance.
    //Identico ao comportamento da fase 2 do boss_2, exceto pelo ataque especial (que nao exige alcance).
    atualizar_combate_boss(){
        if(this.boss.derrotado || this.boss.atacando || this.boss.invencibilidade){
            return;
        }

        let distancia = Phaser.Math.Distance.Between(this.boss.x, this.boss.y, this.jogador.x, this.jogador.y);

        this.boss.olhando = this.jogador.x < this.boss.x;

        //o ataque especial nao exige alcance: com 2+ pilares quebrados o boss pode dispara-lo de onde estiver,
        //mesmo longe do jogador, em vez de precisar se aproximar primeiro
        if(this.boss.pode_atacar && this.boss.pilares_destruidos >= 2 && distancia > this.boss.alcance_ataque){
            this.disparar_ataque(distancia);
            return;
        }

        if(distancia > this.boss.alcance_ataque){
            this.physics.moveToObject(this.boss, this.jogador, this.boss.velocidade);
            this.boss.play("robo_andando", true).setFlipX(this.boss.olhando);
        }
        else{
            this.boss.setVelocity(0);

            if(this.boss.pode_atacar){
                this.disparar_ataque(distancia);
            }
            else{
                this.boss.play("robo_parado", true).setFlipX(this.boss.olhando);
            }
        }
    }

    disparar_ataque(distancia){
        if(this.boss.derrotado || this.boss.atacando || !this.boss.pode_atacar){
            return;
        }

        let ataques = [];

        //soco e chute so entram na lista se o boss estiver perto o suficiente do jogador
        if(distancia <= this.boss.alcance_ataque){
            ataques.push("soco", "chute");
        }

        //depois de quebrar 2 pilares ou mais, o boss desbloqueia o ataque especial, disponivel de qualquer distancia
        if(this.boss.pilares_destruidos >= 2){
            ataques.push("especial");
        }

        //nenhum ataque disponivel no momento (longe demais e ainda sem o especial): continua perseguindo
        if(ataques.length <= 0){
            return;
        }

        this.boss.pode_atacar = false;

        let escolhido = Phaser.Utils.Array.GetRandom(ataques);

        if(escolhido === "soco"){
            this.ataque_soco_boss();
        }
        else if(escolhido === "chute"){
            this.ataque_chute_boss();
        }
        else{
            this.x_original = this.boss.x;
            this.ataque_especial_boss();
        }
    }

    comprometer_ataque_boss(){
        if(this.timer_ataque_boss){
            this.timer_ataque_boss.remove(false);
            this.timer_ataque_boss = null;
        }

        // this.boss.modo_fase1 = "atacando";
        this.boss.defendendo = false;
        this.boss.tomando_dano = false;
        this.parar_flash_boss();

        this.boss.atacando = true;
        this.boss.invencibilidade = true;
        this.boss.pode_atacar = false;
        this.boss.setVelocity(0);
        this.boss.anims.stop();

        this.boss.olhando = this.jogador.x < this.boss.x;

        this.boss.area_ataque.body.enable = false;
        this.boss.area_ataque_especial.body.enable = false;
    }

    //a cada pilar quebrado, o preparo do soco e do chute fica mais rapido (15% menos por pilar, ate 60%
    //de reducao no total). o ataque especial nao usa isso, o preparo dele e sempre fixo.
    tempo_preparo(base){
        let reducao = Math.min(0.6, this.boss.pilares_destruidos * 0.15);
        return Math.round(base * (1 - reducao));
    }

    ataque_soco_boss(){
        if(this.boss.derrotado){
            return;
        }

        this.comprometer_ataque_boss();
        this.boss.tipo_ataque_atual = "soco";
        this.boss.setTexture("robo_ataque_1", 0);

        this.time.delayedCall(this.tempo_preparo(1500), ()=>{
            if(this.boss.derrotado){
                return;
            }

            this.boss.play("robo_ataque_1").setFlipX(this.boss.olhando);

            this.time.delayedCall(this.tempo_preparo(300), ()=>{
                this.boss.area_ataque.body.enable = true;
            });

            this.boss.once("animationcomplete-robo_ataque_1", ()=>{
                this.boss.area_ataque.body.enable = false;
                this.finalizar_ataque_boss();
            });
        });
    }

    ataque_chute_boss(){
        if(this.boss.derrotado){
            return;
        }

        this.comprometer_ataque_boss();
        this.boss.tipo_ataque_atual = "chute";

        this.boss.setTexture("robo_ataque_2", 0);

        this.time.delayedCall(this.tempo_preparo(1000), ()=>{
            if(this.boss.derrotado){
                return;
            }

            this.boss.play("robo_ataque_2").setFlipX(this.boss.olhando);

            this.time.delayedCall(this.tempo_preparo(250), ()=>{
                this.boss.area_ataque.body.enable = true;
            });

            this.boss.once("animationcomplete-robo_ataque_2", ()=>{
                this.boss.area_ataque.body.enable = false;
                this.finalizar_ataque_boss();
            });
        });
    }

    ataque_especial_boss(){
        if(this.boss.derrotado){
            return;
        }

        this.comprometer_ataque_boss();
        this.boss.tipo_ataque_atual = "especial";
        this.boss.x = this.boss.olhando ? this.boss.x - 400: this.boss.x + 400;

        this.time.delayedCall(50, () => {
            console.log("50ms:", this.boss.x);
        });

        this.boss.setCollideWorldBounds(false);

        this.boss.setTexture("robo_ataque_especial", 0).setFlipX(this.boss.olhando);

        this.time.delayedCall(800, ()=>{
            if(this.boss.derrotado){
                return;
            }

            this.boss.play("robo_ataque_especial").setFlipX(this.boss.olhando);

            this.time.delayedCall(150, ()=>{
                this.boss.area_ataque_especial.body.enable = true;
            });

            this.boss.once("animationcomplete-robo_ataque_especial", ()=>{
                this.boss.area_ataque_especial.body.enable = false;
                this.boss.x = this.x_original;
                this.boss.setCollideWorldBounds(true);

                this.finalizar_ataque_boss();
            });
        });
    }

    finalizar_ataque_boss(){
        if(this.boss.derrotado){
            return;
        }

        this.boss.atacando = false;
        this.boss.invencibilidade = false;
        this.boss.pode_atacar = false;

        this.boss_pausa_pos_ataque();
    }

    boss_pausa_pos_ataque(){
        if(this.boss.derrotado){
            return;
        }

        this.boss.atacando = false;
        this.boss.invencibilidade = false;
        this.boss.pode_atacar = false;

        this.boss.play("robo_parado", true).setFlipX(this.boss.olhando);

        let tempo_espera = Phaser.Math.Between(this.tempo_cooldown_ataque[0], this.tempo_cooldown_ataque[1]);

        this.timer_ataque_boss = this.time.delayedCall(tempo_espera, ()=>{
            if(this.boss.derrotado){
                return;
            }
            this.boss.pode_atacar = true;
        });
    }

    //verifica o golpe do jogador no boss (equivalente ao verifica_ataque da fase 2 do boss_2, com o
    //mesmo sistema anti-spam que faz o boss "prever" e bloquear ataques repetidos)
    verifica_ataque_boss(){
        if(!this.area_ataque.body.enable){
            return;
        }
        if(this.boss.derrotado){
            return;
        }
        if(this.boss.atacando){
            return;
        }

        this.boss.olhando = this.jogador.x < this.boss.x;
        this.boss.setFlipX(this.boss.olhando);

        if(this.boss.invencibilidade){
            return;
        }

        let multiplicador;
        switch(this.tipo_ataque){
            case 1:
                if(this.ja_acertou){
                    return;
                }
                this.ja_acertou = true;
                multiplicador = 1;
                break;
            case 2:
                multiplicador = 1.20;
                break;
            case 3:
                if(this.ja_acertou){
                    return;
                }
                this.ja_acertou = true;
                multiplicador = 1.10;
                break;
            case 4:
                if(this.ja_acertou){
                    return;
                }
                this.ja_acertou = true;
                multiplicador = 1.15;
                break;
            case 5:
                if(this.ja_acertou){
                    return;
                }
                this.ja_acertou = true;
                multiplicador = 1.25;
                break;
            default:
                multiplicador = 1;
                break;
        }

        this.boss_recebendo_dano(multiplicador);
    }

    boss_recebendo_dano(multiplicador){
        if(this.boss.derrotado){
            return;
        }

        if(this.sistema_anti_spam(this.tipo_ataque)){
            this.boss_bloquear_ataque();
            return;
        }

        this.boss.invencibilidade = true;
        this.boss.setVelocity(0);

        inimigo_flash_dano(this, this.boss);

        this.boss.hp -= this.dano_jogador(multiplicador);

        this.boss.play("robo_machucado", true).setFlipX(this.boss.olhando);

        if(this.boss.hp <= 0){
            this.boss.hp = 0;
            atualizar_barra_hp_boss(this, this.boss);
            inimigo_parar_flash_dano(this.boss);
            boss_derrotado(this, this.boss);
            return;
        }

        atualizar_barra_hp_boss(this, this.boss);

        if(this.boss.hp <= 300 && this.boss.pode_curar && this.existem_pilares_para_curar()){
            inimigo_parar_flash_dano(this.boss);
            this.iniciar_cura_boss();
            return;
        }

        if(this.timer_reacao_dano){
            this.timer_reacao_dano.remove(false);
        }

        this.timer_reacao_dano = this.time.delayedCall(300, ()=>{
            if(this.boss.derrotado || this.boss.curando){
                return;
            }

            inimigo_parar_flash_dano(this.boss);
            this.boss.invencibilidade = false;
            this.boss.play("robo_parado", true).setFlipX(this.boss.olhando);
        });
    }

    //mesmo sistema anti-spam do boss_2: 3 ataques iguais seguidos e o boss passa a ter chance de bloquear
    sistema_anti_spam(ataque_usado){
        let ultimo_ataque = this.lista_ataques.length > 0 ? this.lista_ataques[this.lista_ataques.length - 1] : null;

        this.lista_ataques.push(ataque_usado);

        if(ultimo_ataque === ataque_usado){
            this.ataques_repetidos++;
        }
        else{
            this.ataques_repetidos = 1;
        }

        if(this.ataques_repetidos >= 3){
            let chance_errar = 25 * (this.ataques_repetidos - 2);
            chance_errar = Phaser.Math.Clamp(chance_errar, 0, 90);

            if(Phaser.Math.Between(0, 100) < chance_errar){
                return true;
            }
        }

        return false;
    }

    boss_bloquear_ataque(){
        if(this.boss.derrotado){
            return;
        }

        this.boss.setVelocity(0);
        this.boss.invencibilidade = true;
        this.boss.play("robo_defendendo", true).setFlipX(this.boss.olhando);

        this.timer_bloqueio = this.time.delayedCall(400, ()=>{
            if(this.boss.derrotado){
                return;
            }
            this.boss.invencibilidade = false;
            this.boss.play("robo_parado", true).setFlipX(this.boss.olhando);
        });
    }

    dano_jogador(multiplicador){
        let dano = Math.floor(Math.max(1, (this.jogador.ataque * multiplicador) * (100 / (100 + this.boss.defesa))));
        return dano;
    }

    flash_dano_boss(){
        this.parar_flash_boss();

        let piscando = true;
        this.boss.setTint(0xffffff);
        this.boss.setAlpha(0.5);

        this.evento_flash = this.time.addEvent({
            delay: 100,
            loop: true,
            callback: ()=>{
                piscando = !piscando;
                if(piscando){
                    this.boss.setTint(0xffffff);
                    this.boss.setAlpha(0.5);
                }
                else{
                    this.boss.clearTint();
                    this.boss.setAlpha(1);
                }
            }
        });
    }

    parar_flash_boss(){
        if(this.evento_flash){
            this.evento_flash.remove();
            this.evento_flash = null;
        }
        this.boss.clearTint();
        this.boss.setAlpha(1);
    }

    //ataque do boss no jogador (empurrao mais forte no chute, igual a barrigada do boss_2)
    jogador_atingido_pelo_boss(){
        if(this.jogador.invencibilidade){
            return;
        }

        let forca_empurrao = this.boss.tipo_ataque_atual === "chute" ? 350 : 150;

        jogador_tomando_dano(this, this.boss);

        let direcao = this.boss.olhando ? -1 : 1;

        this.jogador.setVelocity(direcao * forca_empurrao, Phaser.Math.Between(-80, 80));

        this.time.delayedCall(300, ()=>{
            if(this.jogador.active && this.jogador.body){
                this.jogador.setVelocity(0);
            }
        });
    }

    //ataque especial do boss no jogador: mesmo empurrao/reacao do golpe normal, porem com dano do
    //boss + 2 (o ataque em si sobe com pilares quebrados, entao isso ainda escala com o jogo)
    jogador_atingido_pelo_boss_especial(){
        if(this.jogador.invencibilidade){
            return;
        }

        if(this.sfx_ligado){
            let boing = Phaser.Math.Between(1,3);
            this.sound.play(`boing_${boing}`);
        }

        let ataque_original = this.boss.ataque;
        this.boss.ataque = ataque_original + 2;

        jogador_tomando_dano(this, this.boss);

        this.boss.ataque = ataque_original;

        let direcao = this.boss.olhando ? -1 : 1;

        this.jogador.setVelocity(direcao * 250, Phaser.Math.Between(-100, 100));

        this.time.delayedCall(300, ()=>{
            if(this.jogador.active && this.jogador.body){
                this.jogador.setVelocity(0);
            }
        });
    }

    especial_atinge_inimigo(inimigo){
        if(!inimigo.active || inimigo.invencibilidade || inimigo.hp <= 0){
            return;
        }

        inimigo.invencibilidade = true;

        inimigo.hp -= (this.boss.ataque + 2);

        inimigo_flash_dano(this, inimigo);

        let texto = inimigo.barra_hp.getAt(1);
        texto.setText(inimigo.hp + "/" + inimigo.hp_total);

        let direcao = this.boss.olhando ? -1 : 1;
        inimigo.setVelocity(direcao * 90, Phaser.Math.Between(-90, 90));

        this.time.delayedCall(800, ()=>{
            if(inimigo.active && inimigo.body){
                inimigo.setVelocity(0);
            }
        });

        if(inimigo.hp <= 0){
            inimigo_derrotado(this, inimigo);
            return;
        }

        this.time.delayedCall(600, ()=>{
            if(inimigo && inimigo.active){
                inimigo_parar_flash_dano(inimigo);
                inimigo.invencibilidade = false;
            }
        });
    }

    existem_pilares_para_curar(){
        if(!this.pilares){
            return false;
        }
        return this.pilares.getChildren().some((pilar)=> pilar.active && !pilar.destruido);
    }

    iniciar_cura_boss(){
        if(this.boss.derrotado || this.boss.curando){
            return;
        }

        let pilares_vivos = this.pilares.getChildren().filter((pilar)=> pilar.active && !pilar.destruido);

        if(pilares_vivos.length <= 0){
            return;
        }

        let pilar_escolhido = Phaser.Utils.Array.GetRandom(pilares_vivos);

        this.boss.pode_curar = false;
        this.boss.curando = true;
        this.boss.invencibilidade = true;
        this.boss.atacando = false;
        this.boss.pode_atacar = false;
        this.boss.setVelocity(0);

        inimigo_parar_flash_dano(this.boss);

        //boss e o pilar escolhido ficam invulneraveis durante todo o evento
        pilar_escolhido.invencibilidade = true;
        this.pilar_curando = pilar_escolhido;

        if(this.timer_ataque_boss){
            this.timer_ataque_boss.remove(false);
            this.timer_ataque_boss = null;
        }
        if(this.timer_reacao_dano){
            this.timer_reacao_dano.remove(false);
            this.timer_reacao_dano = null;
        }

        this.mover_ate_pilar(pilar_escolhido);
    }

    mover_ate_pilar(pilar){
        this.boss.olhando = pilar.x < this.boss.x;
        this.boss.play("robo_andando", true).setFlipX(this.boss.olhando);

        this.physics.moveToObject(this.boss, pilar, this.boss.velocidade * 1.5);

        if(this.timer_checagem_pilar){
            this.timer_checagem_pilar.remove();
            this.timer_checagem_pilar = null;
        }

        this.timer_checagem_pilar = this.time.addEvent({
            delay: 100,
            loop: true,
            callback: ()=>{
                if(!pilar.active){
                    this.timer_checagem_pilar.remove();
                    this.timer_checagem_pilar = null;
                    this.finalizar_cura_boss();
                    return;
                }

                let distancia = Phaser.Math.Distance.Between(this.boss.x, this.boss.y, pilar.x, pilar.y);

                if(distancia <= 60){
                    this.timer_checagem_pilar.remove();
                    this.timer_checagem_pilar = null;
                    this.curar_boss_no_pilar(pilar);
                    return;
                }

                this.boss.olhando = pilar.x < this.boss.x;
                this.boss.setFlipX(this.boss.olhando);

                this.physics.moveToObject(this.boss, pilar, this.boss.velocidade * 1.5);
            }
        });
    }

    curar_boss_no_pilar(pilar){
        this.boss.setVelocity(0);

        if(!pilar.active){
            this.finalizar_cura_boss();
            return;
        }

        this.boss.play("robo_regenerando", true).setFlipX(this.boss.olhando);

        this.timer_curando = this.time.delayedCall(1500, ()=>{
            if(!this.boss.active){
                return;
            }

            let cura = Math.round(this.boss.hp * 0.25);
            this.boss.hp = Math.min(this.boss.hp_total, this.boss.hp + cura);

            atualizar_barra_hp_boss(this, this.boss);

            this.finalizar_cura_boss();
        });
    }

    finalizar_cura_boss(){
        if(this.pilar_curando){
            this.pilar_curando.invencibilidade = false;
            this.pilar_curando = null;
        }

        this.boss.curando = false;
        this.boss.invencibilidade = false;
        this.boss.pode_curar = true;

        if(!this.boss.derrotado && this.boss.hp <= 300 && this.existem_pilares_para_curar()){
            this.iniciar_cura_boss();
            return;
        }

        this.boss.pode_atacar = true;
        this.boss.play("robo_parado", true).setFlipX(this.boss.olhando);
    }

    finalizar_luta(){
        this.pode_atacar = false;
        this.jogador.setVelocity(0);
        this.tempo_boss = this.time.now;

        if(this.timer_spawn_inimigo){
            this.timer_spawn_inimigo.remove(false);
            this.timer_spawn_inimigo = null;
        }

        this.boss.once("animationcomplete-robo_derrotado", ()=>{
            this.jogador_comemorando();
        });
    }

    jogador_comemorando(){
        this.tempo_total = this.tempo + this.tempo_boss;

        let animacao = Phaser.Math.Between(1,2);

        this.jogador.play(this.genero === "feminino"? `ramona_comemorando_${animacao}_${this.skin}`:`scott_comemorando_${animacao}_${this.skin}`).setFlipX(this.jogador_olhando);
        this.jogador.once(this.genero === "feminino"? `animationcomplete-ramona_comemorando_${animacao}_${this.skin}`: `animationcomplete-scott_comemorando_${animacao}_${this.skin}`, ()=>{
            this.jogador.play(this.genero === "feminino"? `ramona_final_${this.skin}`: `scott_final_${this.skin}`);
            this.time.delayedCall(3000, ()=>{
                if(this.bonus && this.sfx_ligado){
                    this.sound.play("astucia");
                }
                this.jogador.anims.stop();
                document.getElementById("hud_boss_3").style.display = "none";
                tela_vitoria(this, "Boss_3", this.jogador.inimigos_derrotados, this.jogador.pontuacao, this.tempo_total, this.jogador.hits);
            })
        })
    }

}