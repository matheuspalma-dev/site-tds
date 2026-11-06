import {assets_jogador, assets_sfx, assets_mapa_2, sprite_latas, sprite_itens, tocar_musica, html, criar_fundo, criar_jogador, variaveis_jogador, areas_jogador, animacoes_jogador, teclas_movimento, teclas_ataques, apertou_tecla, configurar_gamepad, apertou_botao_gamepad, animacao_mapa_2, jogador_update,  movimento_jogador, verifica_ataque, jogador_tomando_dano, atualizar_barra_hp, inimigo_update, criar_grupo_inimigos_portas, atualizar_spawn_portas, remover_inimigos_longe, inimigo_perseguindo, animacoes_latas, latas_update, criar_latas, lata_overlap, interagindo_com_item, efeitos, animacao_barreiras, criar_barreira, overlap_barreira, botoes_morte, limites_mapa_1, pausa, colliders, marcacoes_2, ir_boss, agendar_fantasma, fantasma_update, criar_escuridao, atualizar_escuridao} from "./funcoes.js";
export class Lugar extends Phaser.Scene {
    constructor() {
        super('Lugar');
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

        assets_mapa_2(this);

        //mapa

        this.load.image("lugar", "assets/conteudo/mapa_2/mapa/lugar.png");

        //latas de lixo

        sprite_latas(this);

        //itens

        sprite_itens(this);


    }

    create() {
        //toca a musica da cena

        this.sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";

        tocar_musica(this, "musica_mapa_2");

        //adiciona os elementos html do jogo, como a barra de vida e outras coisas

        html(this);

        //criando o mapa

        criar_fundo(this, this.cameras.main.centerX, "lugar", 2.5,0.127, 0.4, 480, 180, 4000);
        
        //JOGADOR !!!

        criar_jogador(this,50, 550, 1.5, 50);

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

        criar_barreira(this, 2, 5, [500, 1500, 2500, 2900]); 

        overlap_barreira(this);

        // limites_mapa_1(this);

        //MARCAÇÕES !!!

        marcacoes_2(this);

        //LATAS DE LIXO !!!

        criar_latas(this, 3, 5, 200, 3000, 450, 600 ); //mapa 1 420:640;

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
        this.inimigos_mapa_2 = ["linus", "chuck", "tom"];

        animacao_mapa_2(this);

        criar_grupo_inimigos_portas(this, 1500, 3, 5);

        //FANTASMA !!!

        agendar_fantasma(this, 420, 640, 0.8, 110);

        criar_escuridao(this);

        //colisoes

        colliders(this);

        //pausa o jogo

        pausa(this, "Lugar", "pausa");

        ir_boss(this, this.fim, "Boss_2");
    }
    update() {
        if(this.pode_atacar){
            movimento_jogador(this);
        }

        //atualiza a posicao do body, pq o setflipx nao atualiza automatico, tbm atualiza a area de dano para seguir o jogador e modifica o z-index do jogador
        jogador_update(this);

        //idem, so que para os inimigos

        atualizar_spawn_portas(this, this.inimigos_mapa_2, 1.5, 550, 580);

        inimigo_update(this);

        remover_inimigos_longe(this);

        //latas

        latas_update(this);

        //fantasma

        fantasma_update(this);

        //escuridao/lanterna, precisa atualizar toda vez pra acompanhar o jogador

        atualizar_escuridao(this);
    
        
    }

}