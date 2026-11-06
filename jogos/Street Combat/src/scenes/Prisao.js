import {assets_jogador, assets_sfx, assets_mapa_3, sprite_latas, sprite_itens, tocar_musica, html, criar_fundo, criar_jogador, variaveis_jogador, areas_jogador, animacoes_jogador, teclas_movimento, teclas_ataques, apertou_tecla, configurar_gamepad, apertou_botao_gamepad, animacao_mapa_3, jogador_update,  movimento_jogador, atualizar_barra_hp, inimigo_update,criar_grupo_inimigos, atualizar_spawn, remover_inimigos_longe, animacoes_latas, latas_update, criar_latas, lata_overlap, interagindo_com_item, efeitos, animacao_barreiras, criar_barreira, overlap_barreira, pausa, colliders, marcacoes_3, ir_boss, criar_lasers, lasers_update, criar_buracos, parar_sfx_cachorro} from "./funcoes.js";
export class Prisao extends Phaser.Scene {
    constructor() {
        super('Prisao');
    }
    init(data) {
        this.genero = data.genero;
        this.skin = data.skin;
        this.bonus = data.bonus;
        this.online = data.online;
        this.idSessao = data.idSessao;
        this.socket = data.socket;
        document.body.style.setProperty("--fundo", "black");
    }

    preload() {
        //sprites do jogador

        
        assets_jogador(this);

        //sfx

        assets_sfx(this);
        
        //sprites dos inimigos

        assets_mapa_3(this);

        //mapa

        this.load.image("prisao", "assets/conteudo/mapa_3/mapa/prisao_nova.png");

        //latas de lixo

        sprite_latas(this);

        //itens

        sprite_itens(this);


    }

    create() {
        //toca a musica da cena

        document.getElementById("hud_boss_3").style.display = "none";

        this.sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";

        //garante que nenhuma sfx do cachorro ficou tocando de uma fase/tentativa anterior

        parar_sfx_cachorro(this);

        tocar_musica(this, "musica_mapa_3");

        //adiciona os elementos html do jogo, como a barra de vida e outras coisas

        html(this);

        //criando o mapa

        criar_fundo(this, this.cameras.main.centerX, "prisao", 2,0.045, 0.4, 530, 160);

        //JOGADOR !!!

        criar_jogador(this,50,  550, 1.5, 50);

        atualizar_barra_hp(this);

        variaveis_jogador(this, 0,0,0);

        //area de ataque e dano do jogador

        areas_jogador(this);

        //animacoes do jogador, de andar, atacar, etc

        animacoes_jogador(this);

        //teclas para os ataques
        
        teclas_movimento(this);

        teclas_ataques(this);

        //verifica se vc pressionou a tecla de ataque

        apertou_tecla(this);  

        //verifica botoes do gamepad

        configurar_gamepad(this);
        apertou_botao_gamepad(this);

        //BARREIRAS !!!

        this.barreiras = this.add.group();

        //MARCAÇÕES !!! (criadas antes das latas, pra que elas saibam onde ficam os buracos e nao nasçam em cima deles)

        marcacoes_3(this);

        this.buracos = [this.buraco_1, this.buraco_2, this.buraco_3, this.buraco_4];

        //LATAS DE LIXO !!!

        criar_latas(this, 5, 10, 200, 10000, 520, 640 ); //mapa 1 420:640;

        //animacoes das latas

        animacoes_latas(this);

        //verifica se o jogador acertou a alata

        lata_overlap(this);

        //ITENS !!!

        this.itens = this.physics.add.group();

        this.physics.add.overlap(this.jogador, this.itens, (jogador, item)=>{
            interagindo_com_item(this, item);
        })

        //EFEITOS !!!

        efeitos(this);

        //INIMIGOS !!!
        this.inimigos_mapa_3 = ["brad", "cachorro", "rex", "william"];

        animacao_mapa_3(this);

        criar_grupo_inimigos(this, 1800, 3000, 3,3, {cercar: true});

        //colisoes

        colliders(this);

        //pausa o jogo

        pausa(this, "Prisao", "pausa");

        this.caiu = false;

        //BURACOS !!! (empurra o jogador quando ele pisa em um buraco, na direcao/sentido que ele estava vindo, e mata na hora)

        criar_buracos(this, [this.buraco_1, this.buraco_2, this.buraco_3, this.buraco_4]);

        this.laser_1 = this.add.circle(4045, 480, 10, 0xff0000, 1);
        this.laser_comprido_1 = this.add.ellipse(4045, 570, 20, 200, 0xff00000, 0.7);

        this.laser_2 = this.add.circle(4162, 480, 10, 0xff00000, 1);
        this.laser_comprido_2 = this.add.ellipse(4162, 580, 20, 200, 0xff00000, 0.7);

        this.laser_3 = this.add.circle(4275, 480, 10, 0xff00000, 1);
        this.laser_comprido_3 = this.add.ellipse(4275, 580, 20, 200, 0xff00000, 0.7);

        this.laser_4 = this.add.circle(4389, 480, 10, 0xff00000, 1);
        this.laser_comprido_4 = this.add.ellipse(4389, 580, 20, 200, 0xff00000, 0.7);

        this.laser_5 = this.add.circle(5437, 480, 10, 0xff00000, 1);
        this.laser_comprido_5 = this.add.ellipse(5437, 580, 20, 200, 0xff00000, 0.7);

        this.laser_6 = this.add.circle(8575, 480, 10, 0xff00000, 1);
        this.laser_comprido_6 = this.add.ellipse(8575, 580, 20, 200, 0xff00000, 0.7);

        this.laser_7 = this.add.circle(9260, 480, 10, 0xff00000, 1);
        this.laser_comprido_7 = this.add.ellipse(9260, 580, 20, 200, 0xff00000, 0.7);

        this.area_boss = this.add.rectangle(11000, 500, 100, 800, 0x0000ff, 0);
        this.physics.add.existing(this.area_boss, true);

        //liga o sistema de cooldown/aviso/dano dos lasers

        criar_lasers(this, [
            {indicador: this.laser_1, corpo: this.laser_comprido_1},
            {indicador: this.laser_2, corpo: this.laser_comprido_2},
            {indicador: this.laser_3, corpo: this.laser_comprido_3},
            {indicador: this.laser_4, corpo: this.laser_comprido_4},
            {indicador: this.laser_5, corpo: this.laser_comprido_5},
            {indicador: this.laser_6, corpo: this.laser_comprido_6},
            {indicador: this.laser_7, corpo: this.laser_comprido_7},
        ]);

        ir_boss(this, this.area_boss, "Boss_3");
    }
    update() {

        if(this.pode_atacar && !this.caiu){
            movimento_jogador(this);
        }

        //atualiza a posicao do body, pq o setflipx nao atualiza automatico, tbm atualiza a area de dano para seguir o jogador e modifica o z-index do jogador
        jogador_update(this);

        //idem, so que para os inimigos

        atualizar_spawn(this, this.inimigos_mapa_3, 1.5, 550, 580);

        inimigo_update(this);

        remover_inimigos_longe(this);

        //latas

        latas_update(this);

        //lasers

        lasers_update(this);
    
        
    }

}