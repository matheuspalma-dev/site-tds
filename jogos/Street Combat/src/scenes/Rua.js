import {assets_jogador, assets_sfx, assets_mapa_1, sprite_latas, sprite_itens, tocar_musica, html, criar_fundo, criar_jogador, variaveis_jogador, areas_jogador, animacoes_jogador, teclas_movimento, teclas_ataques, apertou_tecla, configurar_gamepad, apertou_botao_gamepad, animacao_mapa_1, jogador_update,  movimento_jogador, atualizar_barra_hp, inimigo_update,criar_grupo_inimigos, atualizar_spawn, remover_inimigos_longe, animacoes_latas, latas_update, criar_latas, lata_overlap, interagindo_com_item, efeitos, animacao_barreiras, criar_barreira, overlap_barreira, limites_mapa_1, pausa, colliders, marcacoes_1, ir_boss} from "./funcoes.js";

import {abrir_socket} from "./websocket.js";

export class Rua extends Phaser.Scene {
    constructor() {
        super('Rua');
    }
    init(data) {
        this.genero = data.genero;
        this.skin = data.skin;
        this.bonus = data.bonus;
        this.online = data.online;
        this.mostrar_sala = data.socket;
        document.body.style.setProperty("--fundo", "black");
    }

    preload() {
        //sprites do jogador

        
        assets_jogador(this);

        //sfx

        assets_sfx(this);
        
        //sprites dos inimigos

        assets_mapa_1(this);

        //mapa

        this.load.image("rua", "assets/conteudo/mapa_1/mapa/rua.png");

        //latas de lixo

        sprite_latas(this);

        //itens

        sprite_itens(this);


    }

    create() {

        //toca a musica da cena

        this.sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";

        tocar_musica(this, "musica_mapa_1");


        //adiciona os elementos html do jogo, como a barra de vida e outras coisas

        html(this);

        //criando o mapa

        criar_fundo(this, -3000, "rua", 2,0.2, 0.4, 450, 330);
        
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

        animacao_barreiras(this);

        criar_barreira(this, 2, 5, [500, 1500, 2500, 4000, 8000]); 

        overlap_barreira(this);

        //barreiras que impedem o jogador de ultrapassar limite do mapa, sao diferentes das barreiras obstaculos

        limites_mapa_1(this);

        //LATAS DE LIXO !!!

        criar_latas(this, 5, 10, 200, 10000, 420, 640 ); //mapa 1 420:640;

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

        // const inimigos_mapa_1 = ["david", "raymond", "rick", "stella"];
        this.inimigos_mapa_1 = ["david", "raymond", "rick"];

        animacao_mapa_1(this);

        // criar_inimigos(this, 30, 50, inimigos_mapa_1, 1.5, 200, 10000, 460, 500); //sujeito a mudanças, alguns inimigos nascem muito pra baixo
        criar_grupo_inimigos(this, 1800, 3000, 3, 5);

        //colisoes

        colliders(this);

        //pausa o jogo

        pausa(this, "Rua", "pausa");

        //MARCAÇÕES !!!

        marcacoes_1(this);

        ir_boss(this, this.entrar_boss, "Boss_1");

        
    }

    update() {


        if(this.pode_atacar){
            movimento_jogador(this);
        }
        //atualiza a posicao do body, pq o setflipx nao atualiza automatico, tbm atualiza a area de dano para seguir o jogador e modifica o z-index do jogador
        jogador_update(this);

        //idem, so que para os inimigos

        atualizar_spawn(this, this.inimigos_mapa_1, 1.5, 550, 580);

        inimigo_update(this);

        remover_inimigos_longe(this);

        //latas

        latas_update(this);
        
        

        
    
        
    }

}