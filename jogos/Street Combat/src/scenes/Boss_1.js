import {animacoes, assets_jogador, assets_mapa_1, assets_sfx, sprite_itens, html, criar_jogador, variaveis_jogador, areas_jogador, animacoes_jogador, teclas_movimento, teclas_ataques, apertou_tecla, configurar_gamepad, apertou_botao_gamepad, animacao_mapa_1, jogador_update,  movimento_jogador, verifica_ataque, jogador_tomando_dano, atualizar_barra_hp, status_inimigos, criar_barra_hp, inimigo_update, ataque_inimigo, interagindo_com_item, pausa, tela_vitoria} from "./funcoes.js";
export class Boss_1 extends Phaser.Scene {
    constructor() {
        super('Boss_1');
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

        //jogador
        assets_jogador(this);

        //this.bosss

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

        //itens

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

        this.fundo = this.add.image(-13000, this.cameras.main.centerY, 'boss').setScale(2).setOrigin(0.2, 0.4);

        this.cameras.main.setBounds(0, 0, this.fundo.width * this.fundo.scaleX, this.fundo.height * this.fundo.scaleY); //LIMITE DA CAMERA

        this.physics.world.setBounds(0, 620, 1800, 200); //LIMITE DO MAPA

        this.pode_comecar = false;
        this.entrou_fase3 = false;
        this.inimigos_criados = false;
        this.inico_fase_3 = false;
        this.flash_fase3 = null;
        this.machucado = false;
        this.pode_atacar = true;
        this.lista_ataques = [];
        this.ataques_repetidos = 0;
        this.cameras.main.fadeIn(1500);

        //musica do boss: para qualquer musica que ainda esteja tocando (ex: a do mapa anterior)
        //e comeca a tocar a musica do boss, em loop
        this.sound.stopAll();
        this.musica = this.sound.add("boss", { loop: true, volume: 0.5 });
        this.musica.play();

        html(this);

        //JOGADOR !!!

        criar_jogador(this, 50, 650, 1.5, this.hp_atual);
        // criar_jogador(this, 250, 500, 1.5, this.hp_atual);
        // criar_jogador(this, 650, 1.5, 50);

        atualizar_barra_hp(this);

        variaveis_jogador(this, Math.floor(this.pontos), this.inimigos_derrotados, this.hits);

        areas_jogador(this);

        //animacoes do jogador, de andar, atacar, etc

        animacoes_jogador(this);

        //teclas para os ataques
        
        teclas_movimento(this);

        teclas_ataques(this);

        configurar_gamepad(this);
        apertou_botao_gamepad(this);

        //verifica se vc pressionou a tecla de ataque

        apertou_tecla(this);

        //animacoes

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

        this.criar_lucas_lee();
        this.introducao();

        //HUD de vida do boss (Lucas Lee)

        this.hud_boss_1 = document.getElementById("hud_boss_1");
        this.hud_boss_1.style.display = "flex";
        this.atualizar_hud_boss_1();

        //ataque do jogador

        this.physics.add.overlap(this.area_ataque, this.boss.area_dano, ()=>{
            // console.log("overlap")
            this.verifica_ataque(this);
        }, null, this);

        //ataque do boss

        this.physics.add.overlap(this.area_dano, this.boss.area_ataque, ()=>{
            if(this.jogador.invencibilidade){
               return;
            }
            jogador_tomando_dano(this, this.boss);
        }, null, this)

        this.physics.add.overlap(this.area_dano, this.boss.area_skate, ()=>{
            if(this.jogador.invencibilidade){
               return;
            }
            jogador_tomando_dano(this, this.boss);
        }, null, this)

        //inimigos

        this.inimigos_ativos = false;
        this.criando_inimigos = false;

        animacao_mapa_1(this);

        this.lista_inimigos = ["david", "raymond", "rick"];

        this.inimigos = this.physics.add.group();



        //ITENS !!!

        this.itens = this.physics.add.group();


        this.physics.add.overlap(this.jogador, this.itens, (jogador, item)=>{
            interagindo_com_item(this, item);
        })

        //pausa

        pausa(this, "Boss_1", "pausa");

    }

    update(){
        if(this.pode_comecar && this.pode_atacar && !this.boss.derrotado){
            // console.log("pode andar");
            movimento_jogador(this);  
        }

        jogador_update(this);

        if(this.boss.body.velocity.x < 0){
            this.boss.olhando = true;
        }
        else if(this.boss.body.velocity.x > 0){
            this.boss.olhando = false;
        }

        this.boss.setDepth(this.boss.body.y);

        this.boss.area_ataque.setPosition(this.boss.x + (this.boss.olhando? -30:30), this.boss.y+10);
        this.boss.area_dano.setPosition(this.boss.x, this.boss.y + 20);
        this.boss.area_skate.setPosition(this.boss.x + 20, this.boss.y + 30);

        if(this.pode_comecar){
            switch(this.boss_estado){
                case 0:
                    this.boss_perseguindo();
                    this.gerenciar_contador_ataque_forcado();
                    break;
                case 1:
                    this.boss_fugindo();       
                    break;
                case 2:
                    if(this.boss_estado === this.estado.fase_3 && !this.entrou_fase3){
                        this.entrou_fase3 = true;
                        this.boss_entrando();
                    }
                    break;
                case 3:
                    if(!this.boss.derrotado){
                        this.boss_perseguindo();
                        this.gerenciar_contador_ataque_forcado();
                    }
                    
                    break;
            }
            
        }

        if(this.boss.hp <=100 && this.boss_estado === 0){
            this.boss_estado = this.estado.fase_2;
            this.limpar_contador_ataque(); //cancela qualquer contador de ataque pendente da fase 1
        }

        let inimigos_vivos = this.inimigos.getLength();

        if (inimigos_vivos === 0 && this.boss_estado === 1 && this.inimigos_criados) {
            this.boss_estado = this.estado.fase_3;
            this.inimigos_ativos = false;
        }

        if(this.inimigos_ativos){
            inimigo_update(this);
            this.inimigos.children.iterate((inimigo=>{
                this.inimigo_perseguindo(inimigo);
            }))
        }

        if(inimigos_vivos === 0 && this.inico_fase_3 && this.boss_estado === this.estado.fase_3){
            this.parar_boss_fase_3();
            this.boss_estado = this.estado.fase_4;
        }
     
    }

    criar_lucas_lee(){
        this.boss = this.physics.add.sprite(620, 440, 'lucas_lee_parado').setScale(1.5).setFlipX(true);

        this.boss.ataque = 15;
        this.boss.defesa = 15;
        this.boss.velocidade = 80;
        // velocidade usada so quando ele esta perseguindo (fases 1 e 4), mais rapido que o normal
        this.boss.velocidade_perseguindo = 150;

        this.boss.hp = 200;
        // this.boss.hp_atual = 200;

        this.boss.nome = "lucas_lee";

        this.boss.tipo = "boss";

        this.boss.invencibilidade = false;
        this.boss.perseguindo = false;
        this.boss.atacando = false;
        this.boss.pode_atacar = true;
        this.boss.tomando_dano = false;
        this.boss.defendendo = false;
        this.boss.derrotado = false;
        
        this.boss.olhando = true; 

        this.criar_body_boss(20, 20, 25, 90);
        this.criar_areas_boss(80, 50, 50, 80, 50, 80 );

        //estado do boss

        this.estado = {
            fase_1:0,
            fase_2:1,
            fase_3:2,
            fase_4:3
        }

        this.boss_estado = this.estado.fase_1;

        // sequencia de ataques da fase 1: 2 socos fracos, depois 1 forte, loop
        this.sequencia_fase1 = ["fraco", "fraco", "forte"];
        this.indice_ataque_fase1 = 0;

        // sequencia de ataques da fase 4: 1 fraco de skate, depois 3 fortes de skate, loop
        this.sequencia_fase4 = ["fraco", "forte", "forte", "forte"];
        this.indice_ataque_fase4 = 0;

        this.socos = 0; // mantido apenas por compatibilidade, nao controla mais a sequencia

        // tempo do contador de ataque forcado (fases 1 e 4), um valor pra cada tipo de golpe.
        // quando o boss fica perto do jogador esse contador comeca e, quando termina, ele
        // ataca na hora, ignorando dano, defesa ou qualquer outro estado
        this.tempos_contador_ataque = {
            normal: 2000, // soco fraco
            forte: 1500,  // soco forte
            skate: 1000,  // ataque fraco de skate
            skate_forte: 500 // ataque forte de skate
        };

        // cooldown extra entre o fim de um ataque e o inicio da contagem do proximo
        this.cooldown_entre_ataques = 500;

        this.limite_combo = 3;
        this.hits_sem_atacar = 0;
        this.tempo_stun_antes_contra_ataque = 400;

        this.boss.contador_ataque = null; // timer do contador de ataque forcado ativo no momento (ou null)
        this.boss.tipo_contador_ataque = null; // qual ataque esse contador vai disparar quando terminar
    }

    criar_body_boss( largura, altura, x, y){
        this.boss.body.setSize(largura, altura);
        this.boss.body.setOffset(x, y);
    }

    // chamado no exato momento em que o boss DECIDE atacar (antes ate do cooldown/windup).
    // a partir daqui ele ignora dano, defesa e qualquer outra interrupcao ate o ataque terminar.
    comprometer_ataque(){
        if (this.timer_tomando_dano) {
            this.timer_tomando_dano.remove(false);
        }
        if (this.timer_defesa) {
            this.timer_defesa.remove(false);
        }

        this.limpar_contador_ataque(); //ja vai atacar, nao precisa mais do contador

        this.hits_sem_atacar = 0;
        this.boss.tomando_dano = false;
        this.boss.defendendo = false;
        this.parar_flash_boss();
        this.boss.off("animationcomplete-lucas_lee_machucado");
        this.boss.off("animationcomplete-lucas_lee_machucado_skate");

        this.boss.atacando = true;
        this.boss.invencibilidade = true;
        this.boss.pode_atacar = false;
        this.boss.setVelocity(0);
        this.boss.anims.stop();

        // hitbox de ataque sempre comeca desligada; so liga na janela ativa de cada golpe
        this.boss.area_ataque.body.enable = false;
    }

    criar_areas_boss(largura_ataque, altura_ataque, largura_dano, altura_dano, largura_skate, altura_skate){
        this.boss.area_ataque = this.add.zone(this.boss.x, this.boss.y, largura_ataque, altura_ataque);
        this.physics.world.enable(this.boss.area_ataque);
        this.boss.area_ataque.body.setAllowGravity(false);
        this.boss.area_ataque.body.enable = false;

        this.boss.area_dano = this.add.zone(this.boss.x, this.boss.y, largura_dano, altura_dano);
        this.physics.world.enable(this.boss.area_dano);
        this.boss.area_dano.body.setAllowGravity(false);

        this.boss.area_skate = this.add.zone(this.boss.x, this.boss.y, largura_skate, altura_skate);
        this.physics.world.enable(this.boss.area_skate);
        this.boss.area_skate.body.setAllowGravity(false);
        this.boss.area_skate.body.enable = false;
    }

    introducao(){
        this.boss.anims.play("lucas_lee_introducao");
            this.time.delayedCall(1400, ()=>{
                this.boss.setVelocityY(150);
                this.time.delayedCall(1200,()=>{
                    this.boss.setVelocity(0);
                    this.boss.play("lucas_lee_parado", true);
                    this.boss.setPosition(800, this.boss.y);
                    this.pode_comecar = true;
                    this.boss.perseguindo = true;
                })
            })   
    }

    boss_perseguindo() {
        if (this.boss_estado == 1 || this.boss_estado == 2){
            return;
        }
        // atacando cobre desde o windup ate o fim do golpe; !pode_atacar cobre o cooldown
        // (ja decidiu atacar mas ainda nao comecou o windup) - nos dois casos ele fica parado
        if (this.boss.atacando || !this.boss.pode_atacar) {
            this.boss.setVelocity(0);
            return;
        }
        if (this.boss.tomando_dano || this.boss.defendendo || this.boss.derrotado) {
            this.boss.setVelocity(0);
            return;
        }
        // this.finalizar_ataque_skate();
        this.boss.perseguindo = true;
        this.physics.moveToObject(this.boss, this.jogador, this.boss.velocidade_perseguindo);
        this.boss.play(this.boss_estado === 0 ? "lucas_lee_andando":"lucas_lee_andando_skate",true).setFlipX(this.boss.olhando);

        const distancia = Phaser.Math.Distance.Between(this.jogador.x, this.jogador.y,this.boss.x, this.boss.y);

        if (distancia <= 80) {
            this.boss.perseguindo = false;
            this.boss.setVelocity(0);
            this.boss.play(this.boss_estado === 0 ? "lucas_lee_parado" : "lucas_lee_parado_skate",true).setFlipX(this.boss.olhando);
        }
    }

    gerenciar_contador_ataque_forcado(){
        if(this.boss.derrotado || this.boss.atacando){
            return;
        }

        const distancia = Phaser.Math.Distance.Between(this.jogador.x, this.jogador.y, this.boss.x, this.boss.y);
        const perto = distancia <= 80 || this.hits_sem_atacar > 0;

        if(perto){
            if(!this.boss.contador_ataque && this.boss.pode_atacar){
                this.iniciar_contador_ataque();
            }
            else if(this.boss.contador_ataque && this.boss.contador_ataque.paused){
                this.boss.contador_ataque.paused = false; 
            }
        }
        else if(this.boss.contador_ataque && !this.boss.contador_ataque.paused){
            this.boss.contador_ataque.paused = true; 
        }
    }

    proximo_tipo_ataque(){
        let proximo_ataque = this.boss_estado === 0 ? this.sequencia_fase1[this.indice_ataque_fase1]: this.sequencia_fase4[this.indice_ataque_fase4];

        let tipo;
        if(this.boss_estado === 0){
            tipo = proximo_ataque === "fraco" ? "normal" : "forte";
        }
        else{
            tipo = proximo_ataque === "fraco" ? "skate" : "skate_forte";
        }

        return tipo;
    }

    contra_ataque(){
        if(this.boss.derrotado || this.boss.atacando){
            return;
        }
        if(this.boss_estado !== this.estado.fase_1 && this.boss_estado !== this.estado.fase_4){
            return;
        }

        this.disparar_ataque_forcado(this.proximo_tipo_ataque());
    }

    iniciar_contador_ataque(){
        let tipo = this.proximo_tipo_ataque();

        this.boss.tipo_contador_ataque = tipo;

        this.boss.contador_ataque = this.time.delayedCall(this.tempos_contador_ataque[tipo], () => {
            this.boss.contador_ataque = null;
            this.disparar_ataque_forcado(tipo);
        });
    }

    disparar_ataque_forcado(tipo){
        if(this.boss.derrotado){
            return;
        }

        switch(tipo){
            case "normal":
                this.ataque_soco();
                this.indice_ataque_fase1 = (this.indice_ataque_fase1 + 1) % this.sequencia_fase1.length;
                break;
            case "forte":
                this.ataque_soco_forte();
                this.indice_ataque_fase1 = (this.indice_ataque_fase1 + 1) % this.sequencia_fase1.length;
                break;
            case "skate":
                this.ataque_skate();
                this.indice_ataque_fase4 = (this.indice_ataque_fase4 + 1) % this.sequencia_fase4.length;
                break;
            case "skate_forte":
                this.ataque_skate_forte();
                this.indice_ataque_fase4 = (this.indice_ataque_fase4 + 1) % this.sequencia_fase4.length;
                break;
        }
    }


    limpar_contador_ataque(){
        if(this.boss.contador_ataque){
            this.boss.contador_ataque.remove(false);
            this.boss.contador_ataque = null;
        }
        this.boss.tipo_contador_ataque = null;
    }

    finalizar_cooldown_ataque(){
        this.time.delayedCall(this.cooldown_entre_ataques, () => {
            if(this.boss.derrotado){
                return;
            }
            this.boss.pode_atacar = true;
        });
    }

    ataque_soco() {
        if (this.boss.derrotado){
            return;
        }

        this.comprometer_ataque();
        this.boss.setTexture("lucas_lee_ataque_2");
        this.boss.area_ataque.body.enable = false;

        this.time.delayedCall(1500, () => {
            if (this.boss.derrotado){
                return;
            }

            this.boss.play("lucas_lee_ataque_2").setFlipX(this.boss.olhando);

            this.time.delayedCall(300, () => {
                this.boss.area_ataque.body.enable = true;
            });

            this.boss.once("animationcomplete-lucas_lee_ataque_2", () => {
                this.boss.area_ataque.body.enable = false;
                this.boss.play("lucas_lee_parado", true).setFlipX(this.boss.olhando);
                this.boss.atacando = false;
                this.boss.invencibilidade = false;
                this.finalizar_cooldown_ataque();
               
            });
        });
    }

    ataque_soco_forte() {
        if (this.boss.derrotado){
            return;
        }

        this.comprometer_ataque();
        this.boss.setTexture("lucas_lee_ataque_1");
        this.boss.area_ataque.body.enable = false;

        this.time.delayedCall(800, () => {
            if (this.boss.derrotado){
                return;
            }

            this.boss.play("lucas_lee_ataque_1").setFlipX(this.boss.olhando);

            this.time.delayedCall(300, () => {
                this.boss.area_ataque.body.enable = true;
            });

            this.boss.once("animationcomplete-lucas_lee_ataque_1", () => {
                this.boss.area_ataque.body.enable = false;
                this.boss.play("lucas_lee_parado", true).setFlipX(this.boss.olhando);
                this.boss.atacando = false;
                this.boss.invencibilidade = false;
                this.finalizar_cooldown_ataque();
            });
        });
    }

    ataque_skate() {
        if (this.boss.derrotado){
            return;
        }

        this.comprometer_ataque();
        this.boss.setTexture("lucas_lee_ataque_2_skate");
        this.boss.area_ataque.body.enable = false;

        this.time.delayedCall(1000, () => {
            if (this.boss.derrotado){
                return;
            }

            this.boss.play("lucas_lee_ataque_2_skate").setFlipX(this.boss.olhando);

            this.time.delayedCall(200, () => {
                this.boss.area_ataque.body.enable = true;
            });

            this.boss.once("animationcomplete-lucas_lee_ataque_2_skate", () => {
                this.boss.area_ataque.body.enable = false;
                this.boss.play("lucas_lee_parado_skate", true).setFlipX(this.boss.olhando);
                this.boss.atacando = false;
                this.boss.invencibilidade = false;
                this.finalizar_ataque_skate();
           
            })
        })
    }

    ataque_skate_forte() {
        if (this.boss.derrotado){
            return;
        }

        this.comprometer_ataque();
        this.boss.setTexture("lucas_lee_ataque_1_skate");
        this.boss.area_ataque.body.enable = false;

        this.time.delayedCall(500, () => {
            if (this.boss.derrotado){
                return;
            }

            this.boss.play("lucas_lee_ataque_1_skate").setFlipX(this.boss.olhando);

            this.time.delayedCall(250, () => {
                this.boss.area_ataque.body.enable = true;
            });

            this.boss.once("animationcomplete-lucas_lee_ataque_1_skate", () => {
                this.boss.area_ataque.body.enable = false;
                this.boss.play("lucas_lee_parado_skate", true).setFlipX(this.boss.olhando);
                this.boss.atacando = false;
                this.boss.invencibilidade = false;
                this.finalizar_ataque_skate();
              
            })
        })
    }

    finalizar_ataque_skate() {
        if (this.boss.derrotado){
            return;
        }

        this.boss.area_ataque.body.enable = false;
        this.boss.play("lucas_lee_parado_skate", true).setFlipX(this.boss.olhando);
        this.boss.atacando = false;
        this.boss.invencibilidade = false;
        this.boss.tomando_dano = false;
        this.boss.defendendo = false;
        this.finalizar_cooldown_ataque();
    }

    verifica_ataque(cena){
        if(this.boss.invencibilidade || this.boss.atacando){
            return;
        }   
        if(!this.area_ataque.body.enable){
            return;
        }


        let errou = Phaser.Math.Between(1,10);
        errou = errou === 1? true: false;
        if(errou){
            return;
        }
        else{
            
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
                    multiplicador = 1.10;
                    break;
                default: //ataque 1
                    multiplicador = 1;
                    break;
            }

            this.boss_recebendo_dano(multiplicador, this.tipo_ataque,cena);
            
        }    
    }

    boss_recebendo_dano(multiplicador, tipo_ataque, cena){
        if(this.boss.atacando || this.boss.invencibilidade){
            return;
        }
        if(this.sistema_anti_spam(tipo_ataque)){
            this.boss_defendendo();
            return;
        }
        if(this.boss.derrotado){
            return;
        }
        this.boss.setVelocity(0);

        this.flash_dano_boss();

        this.boss.atacando = false;
        this.boss.perseguindo = false;

        this.boss.tomando_dano = true;
        this.boss.invencibilidade = true;

        this.boss.anims.stop();

        this.boss.hp -= this.dano_jogador(multiplicador);
        console.log(this.boss.hp);

        this.atualizar_hud_boss_1();

        this.boss.play(this.boss_estado === 0? "lucas_lee_machucado": "lucas_lee_machucado_skate", true).setFlipX(this.boss.olhando);
        
        if(this.boss.hp <=0){
            this.boss_derrotado(cena);
            return;
        }
        
        this.hits_sem_atacar++;
        const estourou_combo = this.hits_sem_atacar >= this.limite_combo;

        // this.boss.once("animationcomplete-lucas_lee_machucado",()=>{
        this.timer_tomando_dano = this.time.delayedCall(estourou_combo ? this.tempo_stun_antes_contra_ataque : 900,()=>{
            this.parar_flash_boss();
            this.boss.play(this.boss_estado === 0? "lucas_lee_parado": "lucas_lee_parado_skate", true).setFlipX(this.boss.olhando);
            this.boss.invencibilidade = false;
            this.boss.tomando_dano = false;
            // this.boss.pode_atacar = true;
            this.boss.defendendo = false;
            this.boss.atacando = false;
            this.boss.pode_atacar = true;
            if(estourou_combo){
                this.contra_ataque();
            }
            return;
        })
        // })

    }

    //atualiza a barra de hp do hud do boss (Lucas Lee): largura, texto e cor de aviso conforme o hp restante
    atualizar_hud_boss_1(){
        const hp_maximo = 200;
        const hp_atual = Math.max(0, this.boss.hp);
        const porcentagem = (hp_atual / hp_maximo) * 100;

        const barra = document.getElementById("vida_boss_1");
        const texto = document.getElementById("texto_vida_boss_1");

        barra.style.setProperty("--hp-boss-width", porcentagem + "%");
        texto.textContent = `${hp_atual}/${hp_maximo}`;

        barra.classList.remove("hp_boss_medio", "hp_boss_critico");
        if(porcentagem <= 25){
            barra.classList.add("hp_boss_critico");
        } else if(porcentagem <= 50){
            barra.classList.add("hp_boss_medio");
        }
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

    flash_fase_3(){
        if(this.flash_fase3){
            return;
        }

        let piscando = true;

        this.boss.setTint(0xffffff);
        this.boss.setAlpha(0.5);

        this.flash_fase3 = this.time.addEvent({
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

    //para o pisca continuo da fase 3 (entrada do boss). E um evento separado do flash de dano,
    //entao o parar_flash_boss() nao remove ele, e sem isso o boss continuava piscando na fase 4
    parar_flash_fase_3(){
        if(this.flash_fase3){
            this.flash_fase3.remove();
            this.flash_fase3 = null;
        }
        this.boss.clearTint();
        this.boss.setAlpha(1);
    }

    dano_jogador( multiplicador){
        let dano = Math.floor(Math.max(1, (this.jogador.ataque * multiplicador) * (100/ (100+ this.boss.defesa))));

        return dano;
    }

    sistema_anti_spam(ataque_usado){
        let ultimo_ataque =  this.lista_ataques.length > 0? this.lista_ataques[this.lista_ataques.length - 1]: null;

        this.lista_ataques.push(ataque_usado);

        if(ultimo_ataque === ataque_usado){
            this.ataques_repetidos++;
        }
        else{
            this.ataques_repetidos = 1;
        }

        if(this.ataques_repetidos >=3){
        
            let chance_errar = 25 * (this.ataques_repetidos - 2);
            chance_errar = Phaser.Math.Clamp(chance_errar, 0, 90);

            if(Phaser.Math.Between(0, 100) < chance_errar){
                console.log("o inimigo preveu o ataque!");
                return true;
            }

            
        }

        return false;
    }

    boss_defendendo(){
        if(this.boss.derrotado){
            return;
        }
        this.boss.play(this.boss_estado === 0? "lucas_lee_defendendo": "lucas_lee_defendendo_skate").setFlipX(this.boss.olhando);
        this.boss.invencibilidade = true;
        this.boss.defendendo = true;
        this.boss.setVelocity(0);
        this.hits_sem_atacar++;
        this.timer_defesa = this.time.delayedCall(500, ()=>{
            this.boss.invencibilidade = false;
            this.boss.defendendo = false;
            if(this.hits_sem_atacar >= this.limite_combo){
                this.contra_ataque();
            }
            return;
        })
    }

    boss_fugindo(){
        if(this.entrou_fase3){
            return;
        }
        this.limpar_contador_ataque();
        this.boss.atacando = false;
        this.boss.pode_atacar = true;
        this.socos = 0;
        this.indice_ataque_fase1 = 0;
        this.hits_sem_atacar = 0;
        this.boss.perseguindo = false;
        this.boss.tomando_dano = false;
        this.parar_flash_boss();

        this.boss.invencibilidade = true;
        this.boss.play("lucas_lee_andando", true).setFlip(true);
        this.boss.setVelocityX(-250);
        this.boss.area_ataque.body.enable = false;

        if(this.criando_inimigos){
            return;
        }

        this.criando_inimigos = true;

        this.time.delayedCall(2000, ()=>{
            this.boss.setVelocity(0);
            this.boss.anims.stop();
            this.criar_inimigos(3, -100, -50, 580, 700);
            this.criar_inimigos(3, 1200, 1500, 580, 700);
            this.inimigos_ativos = true;
            this.inimigos_criados = true;
            return;
        })
    }

    criar_inimigos(quantidade, min_x, max_x, min_y, max_y){
        

        let quantidade_inimigos = quantidade;

        for(let i = 0; i<quantidade_inimigos; i++){
            let inimigo = this.physics.add.sprite(0, 0);

            inimigo.skin = Phaser.Utils.Array.GetRandom(this.lista_inimigos);
            inimigo.setScale(1.5);
            
            this.posicionar_inimigo(inimigo,min_x, max_x, min_y, max_y);

            this.configurar_body_inimigo(inimigo, 10, 10, 15, 80);
            inimigo.setPushable(false); //impede o inimigo de ser empurrado

            inimigo.olhando = false;

            inimigo.invencibilidade = false;
            inimigo.perseguindo = false;
            inimigo.atacando = false;
            inimigo.pode_atacar = true;
            inimigo.tipo = "inimigo";
            inimigo.empurrado = false;
            inimigo.drop = 5;

            status_inimigos(inimigo); //cria status de batalha p/ o inimigo

            criar_barra_hp(this, inimigo, inimigo.hp_total) //cria barra de vida pro inimigo

            //area de ataque do inimigo

            inimigo.area_ataque =this.add.zone(inimigo.x,inimigo.y, 50, 30)
            this.physics.world.enable(inimigo.area_ataque);
            inimigo.area_ataque.body.setAllowGravity(false);
            inimigo.area_ataque.body.enable = false;

            //area de dano do inimigo

            inimigo.area_dano =this.add.zone(inimigo.x, inimigo.y, 30, 30);
            this.physics.world.enable(inimigo.area_dano);
            inimigo.area_dano.body.setAllowGravity(false);

            inimigo.play(`${inimigo.skin}_parado`, true).setFlipX(inimigo.olhando);

            //verifica se o inimigo acertou o jogador

            this.physics.add.overlap(inimigo.area_ataque, this.area_dano,()=>{
                if(this.jogador.invencibilidade){
                    return;
                }
                if(inimigo.invencibilidade){
                    return;
                }
                inimigo.area_ataque.body.enable = false;
                jogador_tomando_dano(this, inimigo);
            } , null, this);

            //verifica se o jogador acertou o inimigo
            
            this.physics.add.overlap(this.area_ataque, inimigo.area_dano,()=>{
                verifica_ataque(this, inimigo);
            } , null, this);

            this.inimigos.add(inimigo);

            // this.inimigos.children.iterate((inimigo)=>{
            inimigo.setCollideWorldBounds(true); //faz o inimigo nao ultrapassar o limite do mundo
            // })
        }

    }

    posicionar_inimigo(inimigo, min_x, max_x, min_y, max_y){
        let x = Phaser.Math.Between(min_x, max_x);
        let y = Phaser.Math.Between(min_y, max_y);

        inimigo.setPosition(x, y);

    }

    configurar_body_inimigo(inimigo, largura, altura, posicao_x,posicao_y){
        inimigo.body.setSize(largura,altura);
        inimigo.body.setOffset(posicao_x,posicao_y);
        return;
        
    }

    inimigo_perseguindo(inimigo){
        if(inimigo.atacando){
            inimigo.setVelocity(0);
            return;
        }
        if(inimigo.invencibilidade){
            return;
        }
        inimigo.distancia = Phaser.Math.Distance.Between(this.jogador.x, this.jogador.y, inimigo.x, inimigo.y);
        
        // if(inimigo.distancia > 80 && inimigo.distancia < 300){
            // inimigo.perseguindo = true; 
            this.physics.moveToObject(inimigo, this.jogador, inimigo.velocidade); 

            this.inimigos.children.iterate((outro) => {

                if (outro === inimigo){
                    return;
                }

                let distancia = Phaser.Math.Distance.Between(
                    inimigo.x,
                    inimigo.y,
                    outro.x,
                    outro.y
                );

                if (distancia < 80){

                    let angulo = Phaser.Math.Angle.Between(
                        outro.x,
                        outro.y,
                        inimigo.x,
                        inimigo.y
                    );

                    inimigo.body.velocity.x += Math.cos(angulo) * 20;
                    inimigo.body.velocity.y += Math.sin(angulo) * 20;
                }

            });
            inimigo.play(`${inimigo.skin}_andando`, true).setFlipX(inimigo.olhando);
        // }   
        
        if(inimigo.distancia <= 70){
            inimigo.setVelocity(0);
            inimigo.play(`${inimigo.skin}_parado`, true).setFlipX(inimigo.olhando);
            inimigo.esperando_ataque = true;
            if(!inimigo.esperando_ataque){
                inimigo.esperando_ataque = true;

                this.time.delayedCall(1000, ()=>{
                    inimigo.esperando_ataque = false;
                    ataque_inimigo(this, inimigo);
                });
            }
            
        }
    }

    boss_entrando(){
        this.boss.area_dano.body.enable = false;
        this.flash_fase_3();
        this.boss.olhando = false;
        // this.boss.area_ataque.body.enable = true;
        this.boss.area_skate.body.enable = true;

        this.boss.play("lucas_lee_skate_direita");
        this.boss.setPosition(-10, 600);
        this.boss.setVelocityX(250);
        
        
        // this.physics.moveToObject(this.boss, this.jogador, this.boss.velocidade * 1.50);
        this.time.delayedCall(5000, ()=>{
            this.boss.setCollideWorldBounds(true);
            this.boss.setVelocity(0);
            this.andar_pelo_mapa();
            this.inimigos_ativos = true;
            this.criar_inimigos(3, 1200, 1500, 580, 700);
            this.criar_inimigos(3, -100, -50, 580, 700);
            this.inico_fase_3 = true;
            
            
        })

    }

    andar_pelo_mapa(){
        if(this.boss_movendo){
            return;
        }

        this.boss_movendo = true;

        this.tweens.add({
            targets: this.boss,
            y: 680,
            duration: 1000,
            ease: "Linear",
            onStart:()=>{
                this.boss.play("lucas_lee_skate_virando_direita");
                this.time.delayedCall(300, ()=>{
                    this.boss.play("lucas_lee_skate_esquerda", true);
                })
            },
            onComplete: () => {
                this.tweens.add({
                    targets: this.boss,
                    x: 500,
                    duration: 5000,
                    ease: 'Linear',
                    onComplete: ()=>{
                        this.boss.play("lucas_lee_skate_virando_direita");
                        this.tweens.add({
                            targets: this.boss,
                            x: 300,
                            y:600,
                            duration: 500,
                            ease: 'Linear',
                            onStart:()=>{
                                this.time.delayedCall(300, ()=>{
                                    this.boss.play("lucas_lee_skate_esquerda");
                                })
                            },
                            onComplete: ()=>{
                                this.tweens.add({
                                    targets: this.boss,
                                    x: 100,
                                    duration: 1000,
                                    ease: 'Linear',
                                    onComplete:()=>{
                                        this.boss.play("lucas_lee_skate_virando_esquerda");
                                        this.tweens.add({
                                            targets: this.boss,
                                            y: 710,
                                            duration: 500,
                                            ease: 'Linear',
                                            onStart:()=>{
                                                this.time.delayedCall(300,()=>{
                                                    this.boss.play("lucas_lee_skate_direita");
                                                })
                                            },
                                            onComplete:()=>{
                                                this.tweens.add({
                                                    targets: this.boss,
                                                    x: 450,
                                                    duration: 2000,
                                                    ease: 'Linear',
                                                    onComplete:()=>{
                                                        this.tweens.add({
                                                            targets: this.boss,
                                                            y: 620,
                                                            duration: 500,
                                                            ease: 'Linear',
                                                            onComplete:()=>{
                                                                this.tweens.add({
                                                                    targets: this.boss,
                                                                    x: 1500,
                                                                    duration: 5000,
                                                                    ease: 'Linear',
                                                                    onComplete:()=>{
                                                                        this.boss_movendo = false;
                                                                        this.andar_pelo_mapa();
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    parar_boss_fase_3(){
        if(this.boss.derrotado){
            return;
        }
        this.limpar_contador_ataque();
        this.inimigos_ativos = false;
        this.boss.invencibilidade = false;
        this.boss.atacando = false;
        this.boss.tomando_dano = false;
        this.boss.defendendo = false;
        this.boss.pode_atacar = true;
        this.socos = 0;
        this.indice_ataque_fase4 = 0;
        this.hits_sem_atacar = 0;

        this.tweens.killTweensOf(this.boss);

        this.boss.setVelocity(0);

        this.parar_flash_fase_3();
        this.parar_flash_boss();

        this.boss.area_skate.body.enable = false;
        this.boss.area_dano.body.enable = true;
        this.boss.area_ataque.body.enable = false;

        this.boss.anims.stop();

        this.boss.play("lucas_lee_parado_skate", true).setFlipX(!this.jogador_olhando);
        return;
    }

    boss_derrotado(cena){
        if(this.timer_tomando_dano){
            this.timer_tomando_dano.remove(false);
        }
        this.limpar_contador_ataque();
        this.tempo_boss = this.time.now;
        this.boss.derrotado = true;
        this.boss.pode_atacar = false;
        this.boss.setVelocity(0);
        this.boss.area_dano.body.enable = false;
        this.boss.area_ataque.body.enable = false;
        this.parar_flash_fase_3();
        this.parar_flash_boss();

        if(this.hud_boss_1){
            this.hud_boss_1.style.display = "none";
        }
        this.jogador.play(this.genero === "feminino"? `ramona_parada_${this.skin}`: `scott_parado_${this.skin}`, true).setFlipX(this.jogador_olhando);
        this.boss.play("lucas_lee_derrotado").setFlipX(this.boss.olhando);
        this.boss.once("animationcomplete-lucas_lee_derrotado",()=>{
            this.boss.setFrame(5);
            this.boss.anims.stop();
            this.time.delayedCall(1000, ()=>{
                this.jogador_comemorando(cena);
            })
            
        });

    }

    jogador_comemorando(cena){
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
                tela_vitoria(this, "Boss_1", this.jogador.inimigos_derrotados, this.jogador.pontuacao, this.tempo_total, this.jogador.hits);
                // tela_vitoria(this, "Boss_1", 34, 980, 500, 2);
                
            })
        })
    }
}