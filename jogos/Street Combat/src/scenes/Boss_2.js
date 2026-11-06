import {animacoes, assets_jogador, assets_mapa_2, assets_sfx, sprite_itens, html, criar_jogador, variaveis_jogador, areas_jogador, animacoes_jogador, teclas_movimento, teclas_ataques, apertou_tecla, configurar_gamepad, apertou_botao_gamepad, criar_escuridao, animacao_mapa_2, jogador_update,  movimento_jogador, verifica_ataque, jogador_tomando_dano, atualizar_barra_hp, status_inimigos, criar_barra_hp, inimigo_update, ataque_inimigo, atualizar_spawn_portas, interagindo_com_item, pausa, tela_vitoria, agendar_fantasma, fantasma_update, criar_barra_hp_boss, atualizar_barra_hp_boss} from "./funcoes.js";
export class Boss_2 extends Phaser.Scene {
    constructor() {
        super('Boss_2');
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

        assets_mapa_2(this);

        this.load.image('boss', 'assets/conteudo/mapa_2/mapa/lugar_boss.png');

        //Harley

        //rindo

        this.load.spritesheet("harley_rindo", "assets/conteudo/mapa_2/boss/harleyRindo70x82.png", {frameWidth:70, frameHeight:82});

        this.load.spritesheet("harley_parado", "assets/conteudo/mapa_2/boss/HarleyParado55x82.png", {frameWidth:55, frameHeight:82});
        this.load.spritesheet("harley_andando", "assets/conteudo/mapa_2/boss/HarleyAndando65x82.png", {frameWidth:65, frameHeight:82});

        //ataques
        this.load.spritesheet("harley_ataque_1", "assets/conteudo/mapa_2/boss/HarleyAtaque1100x82.png", {frameWidth:100, frameHeight:82}); //soco
        this.load.spritesheet("harley_ataque_2", "assets/conteudo/mapa_2/boss/HarleyAtaque270x82.png", {frameWidth:70, frameHeight:82}); //barrigada

        //cansado

        this.load.spritesheet("harley_cansado", "assets/conteudo/mapa_2/boss/harleyCansado82x82.png", {frameWidth:82, frameHeight:82});

        //defendendo
        this.load.spritesheet("harley_defendendo", "assets/conteudo/mapa_2/boss/HarleyDefendendo49x82.png", {frameWidth:49, frameHeight:82});

        //tomando dano

        this.load.spritesheet("harley_machucado", "assets/conteudo/mapa_2/boss/HarleyTomandoDano80x82.png", {frameWidth:80, frameHeight:82});

        //derrotado
        this.load.spritesheet("harley_derrotado", "assets/conteudo/mapa_2/boss/HarleySedoDerrotado95x82.png", {frameWidth:95, frameHeight:82});

        this.load.spritesheet("harley_revivendo", "assets/conteudo/mapa_2/boss/HarleyRevivendo130x82.png", {frameWidth:130, frameHeight:82});



        sprite_itens(this);

        assets_sfx(this);
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

        this.pode_comecar = false;

        this.fundo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'boss').setScale(2).setOrigin(0.4, 0.5);

        this.cameras.main.setBounds(0, 0, this.fundo.width * this.fundo.scaleX, this.fundo.height * this.fundo.scaleY); //LIMITE DA CAMERA

        this.physics.world.setBounds(0, 450, 1300, 200);

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

        if(!this.anims.exists("harley_rindo")){
            animacoes(this, "harley_rindo", "harley_rindo", 5, 8, 0);
        }

        if(!this.anims.exists("harley_parado")){
            animacoes(this, "harley_parado", "harley_parado", 3, 6, -1);
        }
        if(!this.anims.exists("harley_andando")){
            animacoes(this, "harley_andando", "harley_andando", 7, 5, -1);
        }

        if(!this.anims.exists("harley_ataque_1")){
            animacoes(this, "harley_ataque_1", "harley_ataque_1", 10, 8, 0);
        }
        if(!this.anims.exists("harley_ataque_2")){
            animacoes(this, "harley_ataque_2", "harley_ataque_2", 6, 8, 0);
        }

        if(!this.anims.exists("harley_cansado")){
            animacoes(this, "harley_cansado", "harley_cansado", 11, 8, -1);
        }

        if(!this.anims.exists("harley_defendendo")){
            animacoes(this, "harley_defendendo", "harley_defendendo", 1, 2, 0);
        }

        if(!this.anims.exists("harley_revivendo")){
            animacoes(this, "harley_revivendo", "harley_revivendo", 11, 8, 0);
        }

        if(!this.anims.exists("harley_machucado")){
            animacoes(this, "harley_machucado", "harley_machucado", 3, 1, 0);
        }
        if(!this.anims.exists("harley_derrotado")){
            animacoes(this, "harley_derrotado", "harley_derrotado", 7, 3, 0);
        }

        this.barreira_inicial = this.add.rectangle(150, 500, 100,500, 0x0000ff, 0);
        this.physics.add.existing(this.barreira_inicial, true);

        this.physics.add.collider(this.jogador, this.barreira_inicial);

        animacao_mapa_2(this);

        this.inimigos = this.physics.add.group();

        this.criar_boss();

        this.criar_lacaios_fase1();

        this.iniciar_spawn_barreira();

        //ataque do jogador no boss

        this.physics.add.overlap(this.area_ataque, this.boss.area_dano, ()=>{
            this.verifica_ataque();
        }, null, this);

        //ataque do boss no jogador

        this.physics.add.overlap(this.area_dano, this.boss.area_ataque, ()=>{
            if(this.jogador.invencibilidade){
               return;
            }
            this.jogador_atingido_pelo_boss();
        }, null, this);


        this.itens = this.physics.add.group();

        this.physics.add.overlap(this.jogador, this.itens, (jogador, item)=>{
            interagindo_com_item(this, item);
        })

        this.physics.add.collider(this.jogador, this.boss);


        this.inicio();

        pausa(this, "Boss_2", "pausa");
        
    }

    update(){
        if(this.pode_atacar && this.pode_comecar && !this.boss.derrotado){
            movimento_jogador(this);  
        }

        jogador_update(this);

        this.boss.setDepth(this.boss.body.y);

        if(this.boss.body.velocity.x < 0){
            this.boss.olhando = true;
        }
        else if(this.boss.body.velocity.x > 0){
            this.boss.olhando = false;
        }

        this.boss.area_ataque.setPosition(this.boss.x + (this.boss.olhando? -40:40), this.boss.y + 10);
        this.boss.area_dano.setPosition(this.boss.x, this.boss.y + 10);

        if(this.pode_comecar){
            inimigo_update(this);
        }

        this.inimigos.children.iterate((inimigo)=>{
            if(inimigo && inimigo.active){
                inimigo.setDepth(inimigo.body.y);
            }
        });


        if(this.boss_estado === this.estado.fase_1 && this.pode_comecar && !this.fase1_concluida){
            if(this.boss.hp <= 150){
                this.finalizar_fase_1();
            }
        }

        if(this.boss_estado === this.estado.fase_2 && this.pode_comecar && !this.boss.derrotado){
            this.atualizar_fase2();
        }
    }

    criar_boss(){
        this.boss = this.physics.add.sprite(700, 500, 'harley_parado').setScale(1.5).setFlipX(true);

        this.boss.ataque = 8;
        this.boss.defesa = 25;
        this.boss.velocidade = 60;

        this.boss.hp = 350;
        this.boss.hp_total = 350;

        this.boss.nome = "harley";

        this.boss.tipo = "boss";

        this.boss.invencibilidade = false;
        this.boss.perseguindo = false;
        this.boss.atacando = false;
        this.boss.pode_atacar = true;
        this.boss.tomando_dano = false;
        this.boss.defendendo = false;
        this.boss.derrotado = false;

        this.boss.esperando_ataque = false;
        this.boss.provocado = false; //fica true por um tempo apos tomar um golpe, faz ele nao fugir
        this.boss.alcance_ataque = 80; //distancia para o boss atacar corpo a corpo
        this.boss.visao = 260; //distancia em que o boss "sente" o jogador e passa a manter distancia
        this.boss.tipo_golpe_atual = null;
        this.boss.dano_golpe_atual = 0;
        this.boss.empurrao_golpe_atual = 0;
        
        this.boss.olhando = true; 

        this.criar_body_boss();
        this.criar_areas_boss(80, 50, 50, 80 );

        //barra de hp do boss (HUD fixo, no topo, centralizado, tema Halloween)
        criar_barra_hp_boss(this, this.boss, "boss_2");

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

        this.boss.modo_fase1 = "esperando"; // esperando | defendendo | atacando | cansado
        this.boss.tipo_ataque_atual = null; // "soco" ou "barrigada", usado pro empurrao no jogador

        this.tempo_cooldown_ataque = [3000, 4500];
        this.tempo_cansado = 5000; 
        this.fase1_concluida = false;

        this.tempo_cooldown_ataque_fase2 = [1000, 2000];
    }

    criar_body_boss(){
        this.boss.body.setSize(30, 30);
        this.boss.body.setOffset(10, 50);
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

    inicio(){
        this.time.delayedCall(1000, ()=>{
            this.boss.anims.play("harley_rindo", true).setFlipX(this.boss.olhando);
            this.boss.once("animationcomplete-harley_rindo", ()=>{
                this.boss.anims.play("harley_parado", true);
                this.pode_comecar = true;

                this.ativar_lacaios();
                this.boss_entrar_defesa();
            })
        })
        
        
    }

    criar_lacaios_fase1(){
        this.criar_lacaio("linus", 520, 430);
        this.criar_lacaio("chuck", 520, 550);
    }

    criar_lacaio(skin, x, y){
        let inimigo = this.physics.add.sprite(x, y, `${skin}_parado`).setScale(1.5);

        inimigo.skin = skin;
        inimigo.olhando = true;

        inimigo.invencibilidade = false;
        inimigo.perseguindo = false;
        inimigo.atacando = false;
        inimigo.pode_atacar = false;
        inimigo.esperando_ataque = false;
        inimigo.provocado = false;
        inimigo.tipo = "inimigo";
        inimigo.empurrado = false;
        inimigo.drop = 3;

        status_inimigos(inimigo);
        inimigo.visao = 99999;

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

        this.physics.add.overlap(this.area_ataque, inimigo.area_dano, ()=>{
            verifica_ataque(this, inimigo);
        }, null, this);

        this.physics.add.overlap(inimigo.area_ataque, this.area_dano, ()=>{
            if(this.jogador.invencibilidade || inimigo.invencibilidade){
                return;
            }
            inimigo.area_ataque.body.enable = false;
            jogador_tomando_dano(this, inimigo);
        }, null, this);

        inimigo.setCollideWorldBounds(true);
        this.physics.add.collider(this.jogador, inimigo);
        this.physics.add.collider(this.boss, inimigo);
        this.physics.add.collider(inimigo, this.inimigos);

        this.inimigos.add(inimigo);

        return inimigo;
    }

    ativar_lacaios(){
        this.inimigos.children.iterate((inimigo)=>{
            if(inimigo){
                inimigo.pode_atacar = true;
            }
        });
    }

    iniciar_spawn_barreira(){
        this.max_inimigos_barreira = 6;
        this.intervalo_spawn_barreira = 18000;

        this.timer_spawn_barreira = this.time.addEvent({
            delay: this.intervalo_spawn_barreira,
            loop: true,
            callback: ()=> this.spawnar_inimigo_barreira(),
            callbackScope: this
        });
    }

    spawnar_inimigo_barreira(){
        if(this.fase1_concluida || this.boss.derrotado || !this.pode_comecar){
            return;
        }
        let vivos = this.inimigos.getChildren().filter((inimigo)=> inimigo.origem_barreira && inimigo.active).length;

        if(vivos >= this.max_inimigos_barreira){
            return;
        }

        let skins = ["linus", "chuck", "tom"];
        let skin = Phaser.Utils.Array.GetRandom(skins);

        this.criar_lacaio_barreira(skin);
    }

    criar_lacaio_barreira(skin){
        let x = this.barreira_inicial.x + Phaser.Math.Between(-20, 20);
        let y = this.barreira_inicial.y;

        let inimigo = this.criar_lacaio(skin, x, y);

        inimigo.origem_barreira = true;

        inimigo.nascendo = true;
        inimigo.invencibilidade = true;
        inimigo.pode_atacar = false;
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

    boss_entrar_defesa(){
        if(this.boss.derrotado || this.fase1_concluida){
            return;
        }

        this.boss.modo_fase1 = "defendendo";
        this.boss.invencibilidade = true;
        this.boss.defendendo = true;
        this.boss.atacando = false;
        this.boss.tomando_dano = false;
        this.boss.pode_atacar = false;
        this.boss.setVelocity(0);

        this.parar_flash_boss();
        this.boss.play("harley_parado", true).setFlipX(this.boss.olhando);

        let tempo_espera = Phaser.Math.Between(this.tempo_cooldown_ataque[0], this.tempo_cooldown_ataque[1]);

        this.timer_ataque_boss = this.time.delayedCall(tempo_espera, ()=>{
            this.disparar_ataque_boss();
        });
    }

    disparar_ataque_boss(){
        if(this.boss.derrotado || this.fase1_concluida){
            return;
        }

        let distancia = Phaser.Math.Distance.Between(this.boss.x, this.boss.y, this.jogador.x, this.jogador.y);

        if(distancia > this.boss.alcance_ataque){
            this.timer_ataque_boss = this.time.delayedCall(300, ()=>{
                this.disparar_ataque_boss();
            });
            return;
        }
        let ataques = ["soco", "barrigada"];
        let escolhido = Phaser.Utils.Array.GetRandom(ataques);

        if(escolhido === "soco"){
            this.ataque_soco_boss();
        }
        else{
            this.ataque_barrigada_boss();
        }
    }
    comprometer_ataque_boss(){
        if(this.timer_ataque_boss){
            this.timer_ataque_boss.remove(false);
            this.timer_ataque_boss = null;
        }

        this.boss.modo_fase1 = "atacando";
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
    }

    ataque_soco_boss(){
        if(this.boss.derrotado){
            return;
        }

        this.comprometer_ataque_boss();
        this.boss.tipo_ataque_atual = "soco";
        this.boss.setTexture("harley_ataque_1", 0);

        this.time.delayedCall(1500, ()=>{
            if(this.boss.derrotado){
                return;
            }

            this.boss.play("harley_ataque_1").setFlipX(this.boss.olhando);

            this.time.delayedCall(300, ()=>{
                this.boss.area_ataque.body.enable = true;
            });

            this.boss.once("animationcomplete-harley_ataque_1", ()=>{
                this.boss.area_ataque.body.enable = false;
                this.finalizar_ataque_boss();
            });
        });
    }

    ataque_barrigada_boss(){
        if(this.boss.derrotado){
            return;
        }

        this.comprometer_ataque_boss();
        this.boss.tipo_ataque_atual = "barrigada";

        this.boss.setTexture("harley_ataque_2", 0);

        this.time.delayedCall(1000, ()=>{
            if(this.boss.derrotado){
                return;
            }

            this.boss.play("harley_ataque_2").setFlipX(this.boss.olhando);

            this.time.delayedCall(250, ()=>{
                this.boss.area_ataque.body.enable = true;
            });

            this.boss.once("animationcomplete-harley_ataque_2", ()=>{
                this.boss.area_ataque.body.enable = false;
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

        if(this.boss_estado === this.estado.fase_2){
            this.boss_pausa_pos_ataque_fase2();
            return;
        }

        if(this.fase1_concluida){
            return;
        }

        this.boss_ficar_cansado();
    }

    boss_pausa_pos_ataque_fase2(){
        if(this.boss.derrotado){
            return;
        }

        this.boss.play("harley_parado", true).setFlipX(this.boss.olhando);

        let tempo_espera = Phaser.Math.Between(this.tempo_cooldown_ataque_fase2[0], this.tempo_cooldown_ataque_fase2[1]);

        this.timer_ataque_boss = this.time.delayedCall(tempo_espera, ()=>{
            if(this.boss.derrotado){
                return;
            }
            this.boss.pode_atacar = true;
        });
    }

    boss_ficar_cansado(){
        if(this.boss.derrotado || this.fase1_concluida){
            return;
        }

        this.boss.modo_fase1 = "cansado";
        this.boss.defendendo = false;
        this.boss.invencibilidade = false;
        this.boss.tomando_dano = false;

        this.boss.play("harley_cansado", true).setFlipX(this.boss.olhando);

        this.timer_cansado = this.time.delayedCall(this.tempo_cansado, ()=>{
            if(this.boss.derrotado || this.fase1_concluida){
                return;
            }
            this.boss_entrar_defesa();
        });
    }

    verifica_ataque(){
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

        if(this.boss_estado === this.estado.fase_1){
            if(this.fase1_concluida){
                return;
            }

            if(this.boss.modo_fase1 !== "cansado"){
                this.boss.anims.play("harley_defendendo", true);
                this.boss.once("animationcomplete-harley_defendendo", ()=>{
                    this.boss.anims.play("harley_parado", true);
                })
                return;
            }
        }

        if(this.boss.invencibilidade){
            return;
        }

        console.log(this.boss.hp)

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
        if(this.boss_estado === this.estado.fase_1 && this.fase1_concluida){
            return;
        }

        if(this.boss_estado === this.estado.fase_2 && this.sistema_anti_spam(this.tipo_ataque)){
            this.boss_bloquear_fase2();
            return;
        }
        this.boss.invencibilidade = true;
        this.boss.setVelocity(0);

        this.flash_dano_boss();

        this.boss.hp -= this.dano_jogador(multiplicador);

        atualizar_barra_hp_boss(this, this.boss);

        console.log(this.boss.hp);

        this.boss.play("harley_machucado", true).setFlipX(this.boss.olhando);

        if(this.boss_estado === this.estado.fase_1 && this.boss.hp <= 300){
            this.finalizar_fase_1();
            return;
        }

        if(this.boss.hp <= 0){
            this.boss.hp = 0;
            this.boss_derrotado();
            return;
        }

        if(this.timer_reacao_dano){
            this.timer_reacao_dano.remove(false);
        }

        this.timer_reacao_dano = this.time.delayedCall(300, ()=>{
            if(this.boss.derrotado){
                return;
            }

            this.boss.invencibilidade = false;

            if(this.boss_estado === this.estado.fase_1 && this.boss.modo_fase1 === "cansado"){
                this.boss.play("harley_cansado", true).setFlipX(this.boss.olhando);
            }
            else if(this.boss_estado === this.estado.fase_2){
                this.boss.play("harley_parado", true).setFlipX(this.boss.olhando);
            }
        });
    }

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
                console.log("o boss previu o ataque!");
                return true;
            }
        }

        return false;
    }

    boss_bloquear_fase2(){
        if(this.boss.derrotado){
            return;
        }

        this.boss.setVelocity(0);
        this.boss.invencibilidade = true;
        this.boss.play("harley_defendendo", true).setFlipX(this.boss.olhando);

        this.timer_bloqueio_fase2 = this.time.delayedCall(400, ()=>{
            if(this.boss.derrotado){
                return;
            }
            this.boss.invencibilidade = false;
            this.boss.play("harley_parado", true).setFlipX(this.boss.olhando);
        });
    }

    dano_jogador(multiplicador){
        let dano = Math.floor(Math.max(1, (this.jogador.ataque * multiplicador) * (100/ (100 + this.boss.defesa))));
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

    jogador_atingido_pelo_boss(){
        if(this.jogador.invencibilidade){
            return;
        }

        let forca_empurrao = this.boss.tipo_ataque_atual === "barrigada"? 350 : 150;

        if(this.sfx_ligado){
            let boing = Phaser.Math.Between(1,3);
            this.sound.play(`boing_${boing}`);
            
        }

        jogador_tomando_dano(this, this.boss);

        let direcao = this.boss.olhando? -1 : 1;

        this.jogador.setVelocity(direcao * forca_empurrao, Phaser.Math.Between(-80, 80));

        this.time.delayedCall(300, ()=>{
            if(this.jogador.active && this.jogador.body){
                this.jogador.setVelocity(0);
            }
        });
    }

    finalizar_fase_1(){
        if(this.fase1_concluida){
            return;
        }

        console.log(this.boss.hp);
        this.fase1_concluida = true;

        if(this.timer_ataque_boss){
            this.timer_ataque_boss.remove(false);
            this.timer_ataque_boss = null;
        }
        if(this.timer_cansado){
            this.timer_cansado.remove(false);
            this.timer_cansado = null;
        }
        if(this.timer_reacao_dano){
            this.timer_reacao_dano.remove(false);
            this.timer_reacao_dano = null;
        }
        if(this.timer_spawn_barreira){
            this.timer_spawn_barreira.remove(false);
            this.timer_spawn_barreira = null;
        }

        this.parar_flash_boss();

        this.boss.modo_fase1 = "esperando";
        this.boss.atacando = false;
        this.boss.invencibilidade = true;
        this.boss.defendendo = false;
        this.boss.tomando_dano = false;
        this.boss.pode_atacar = false;
        this.boss.setVelocity(0);
        this.boss.anims.stop();
        this.boss.play("harley_parado", true).setFlipX(this.boss.olhando);

        this.boss_estado = this.estado.fase_2;

        this.time.delayedCall(1000, ()=>{
            this.iniciar_fase_2();
        });
    }

    iniciar_fase_2(){
        if(this.boss.derrotado){
            return;
        }

        if(this.timer_spawn_barreira){
            this.timer_spawn_barreira.remove(false);
            this.timer_spawn_barreira = null;
        }

        this.boss.modo_fase1 = null; 
        this.boss.invencibilidade = false;
        this.boss.tomando_dano = false;
        this.boss.defendendo = false;
        this.boss.atacando = false;
        this.boss.pode_atacar = true;
        this.boss.perseguindo = true;

        this.boss.play("harley_parado", true).setFlipX(this.boss.olhando);
    }

    atualizar_fase2(){
        if(this.boss.derrotado || this.boss.atacando || this.boss.invencibilidade){
            return;
        }

        let distancia = Phaser.Math.Distance.Between(this.boss.x, this.boss.y, this.jogador.x, this.jogador.y);

        this.boss.olhando = this.jogador.x < this.boss.x;

        if(distancia > this.boss.alcance_ataque){
            this.physics.moveToObject(this.boss, this.jogador, this.boss.velocidade);
            this.boss.play("harley_andando", true).setFlipX(this.boss.olhando);
        }
        else{
            this.boss.setVelocity(0);

            if(this.boss.pode_atacar){
                this.disparar_ataque_fase2();
            }
            else{
                this.boss.play("harley_parado", true).setFlipX(this.boss.olhando);
            }
        }
    }

    disparar_ataque_fase2(){
        if(this.boss.derrotado || this.boss.atacando || !this.boss.pode_atacar){
            return;
        }

        this.boss.pode_atacar = false;

        let ataques = ["soco", "barrigada"];
        let escolhido = Phaser.Utils.Array.GetRandom(ataques);

        if(escolhido === "soco"){
            this.ataque_soco_boss();
        }
        else{
            this.ataque_barrigada_boss();
        }
    }


    boss_derrotado(){
        if(this.boss.derrotado){
            return;
        }

        this.boss.derrotado = true;
        this.boss.pode_atacar = false;
        this.boss.perseguindo = false;
        this.boss.setVelocity(0);
        this.jogador.setVelocity(0);
        this.tempo_boss = this.time.now;
        this.boss.area_dano.body.enable = false;
        this.boss.area_ataque.body.enable = false;

        if(this.timer_ataque_boss){
            this.timer_ataque_boss.remove(false);
            this.timer_ataque_boss = null;
        }
        if(this.timer_cansado){
            this.timer_cansado.remove(false);
            this.timer_cansado = null;
        }
        if(this.timer_reacao_dano){
            this.timer_reacao_dano.remove(false);
            this.timer_reacao_dano = null;
        }
        if(this.timer_bloqueio_fase2){
            this.timer_bloqueio_fase2.remove(false);
            this.timer_bloqueio_fase2 = null;
        }

        this.boss.area_ataque.body.enable = false;
        this.boss.area_dano.body.enable = false;

        this.parar_flash_boss();

        this.boss.anims.stop();
        this.boss.play("harley_derrotado", true).setFlipX(this.boss.olhando);
        this.boss.once("animationcomplete-harley_derrotado", ()=>{
            this.jogador_comemorando()
        })
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
                document.getElementById("hud_boss_2").style.display = "none";
                tela_vitoria(this, "Boss_2", this.jogador.inimigos_derrotados, this.jogador.pontuacao, this.tempo_total, this.jogador.hits);
                
            })
        })
    }

}