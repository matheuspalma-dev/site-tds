import { animacoes, assets_jogador, assets_mapa_1, assets_mapa_2, assets_mapa_3, sprite_latas, sprite_itens, html, criar_jogador, variaveis_jogador, areas_jogador, animacoes_jogador, teclas_movimento, teclas_ataques, apertou_tecla, animacao_mapa_1, animacao_mapa_2, animacao_mapa_3, jogador_update,  movimento_jogador, verifica_ataque, jogador_tomando_dano, atualizar_barra_hp, funcao_inimigo, inimigo_update, criar_inimigos, inimigo_perseguindo, stella_perseguindo, animacoes_latas, latas_update, criar_latas, interagindo_com_item, efeitos, animacao_barreiras, criar_barreira, botoes_morte } from "./funcoes.js";
 
export class Mapas extends Phaser.Scene {
    constructor() {
        super('Mapas');
    }

    init(data) {
        this.mapa = data.mapa;
        this.genero = data.genero;
        document.body.style.setProperty("--fundo", "black");
    }

    preload() {

        //MAPAS
        this.load.image('rua', 'assets/conteudo/mapa_1/mapa/rua.png');
        this.load.image('lugar_estranho', 'assets/conteudo/mapa_2/mapa/lugar_estranho.png');
        this.load.image('prisao', 'assets/conteudo/mapa_3/mapa/prisao.png');

        // //JOGADOR

        assets_jogador(this);

        //INIMIGOS

        switch(this.mapa){
            case 1: //mapa da rua
                assets_mapa_1(this);
                break;
            case 2: //mapa da cidade
                assets_mapa_2(this);
                break;
            case 3: //mapa da prisao
                assets_mapa_3(this);
                break;
        }
       
        //latas de lixo

        sprite_latas(this);

        //itens

        sprite_itens(this);

        //barreiras

        for(let i = 1; i < 3; i++){
            this.load.spritesheet(`barreira_${i}`, `assets/conteudo/barreiras/barreira_${i}.png`, {frameWidth:495.75, frameHeight:793});
        }

    }

    mapas(mapa, escala, posicao, limite_min, limite_max){
        this.fundo =  this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, mapa).setScale(escala).setOrigin(0.2, 0.4); //criacao do fundo
        // this.fundo =  this.add.image(-13000, this.cameras.main.centerY, mapa).setScale(escala).setOrigin(0.2, 0.4);
        this.posicao_jogador = posicao; //posicao y do jogador
        this.limite_min = limite_min; //maximo onde o jogador pode subir
        this.limite_max = limite_max;//maximo onde o jogador pode descer
    }

    create() {

        //elementos HTML

        html(this);

        //MAPAS

        //verifica qual mapa foi escolhido
        switch(this.mapa){
            case 1:
                this.mapas("rua", 2, 550, 450, 330);
                // this.mapas("rua", 2, 550, 450, 330);
                break;
            case 2:
                this.mapas("lugar_estranho", 2.2, 600, 400, 420);
                break;
            case 3:
                this.mapas("prisao", 2, 550, 400, 400);
                break;
            default:
                this.mapas("cyberpunk", "em breve", "em breve", "em breve", "em breve");
                break;
        }

        //JOGO PAUSADO!!!

        this.input.keyboard.on("keydown-P", ()=>{
            if(!this.scene.isActive("Pausa")){
                // this.jogo_pausado = true;
                this.scene.launch("Pausa");
                this.scene.pause();
            } 
        })

        this.cameras.main.setBounds(0, 0, this.fundo.width * this.fundo.scaleX, this.fundo.height * this.fundo.scaleY); //LIMITE DA CAMERA
        this.physics.world.setBounds(0, this.limite_min, this.fundo.width * this.fundo.scaleX, this.limite_max); //LIMITE DO MAPA


        //JOGADOR

        criar_jogador(this, this.posicao_jogador, this.genero, 1.5 ); //1.5 mapa 1 , 2 para os outros mapas
        // this.posicao_jogador
        
        atualizar_barra_hp(this);

        //variaveis do jogador

        variaveis_jogador(this);

        //area de ataque do jogador

        areas_jogador(this);

        //ANIMACOES DO JOGADOR!!!

        animacoes_jogador(this);

        //TECLAS PARA MOVER O JOGADOR !!!

        teclas_movimento(this);

        //TECLAS PARA O ATAQUE DO JOGADOR !!!

        teclas_ataques(this);

        //verifica qual ataque o jogador fez

        apertou_tecla(this);

        //INIMIGOS!!!

        //ANIMACAO DOS INIMIGOS

        //mapa da rua

        animacao_mapa_1(this);

        //mapa cidade

        animacao_mapa_2(this);

        //mapa da prisao

        animacao_mapa_3(this);
        
        criar_inimigos(this); //cria os inimigos no mapa

        //cria overlaps(para verificar se o jogador acertou o inimigo ou vice versa) e adiciona colisao entre o jogador e o inimigo

        funcao_inimigo(this);

        //verificacoes dos botoes html

        botoes_morte(this)

        //LATAS DE LIXO !!!

        criar_latas(this);

        //animacoes das latas

        animacoes_latas(this);

        //colisoes das latas

        this.physics.add.collider(this.latas, this.jogador);
        this.physics.add.collider(this.latas, this.inimigos);

        this.latas.children.iterate((lata)=>{
            lata.setPushable(false);
            lata.setImmovable(true);

            this.physics.add.overlap(this.area_ataque, lata.area_dano, ()=>{
                if(lata.foi_atacada){
                    return;
                }
                if(!this.area_ataque.body.enable){
                    return;
                }
                // this.lata_atingida(lata);
                verifica_ataque(this, lata);
            }, null, this);
        })

        //ITENS !!!

        this.itens = this.physics.add.group();

        this.physics.add.overlap(this.jogador, this.itens, (jogador, item)=>{
            interagindo_com_item(this, item);
        })

        //EFEITOS !!!

        efeitos(this);

        //BARREIRAS !!!
        
        switch(this.mapa){
            case 1:
                criar_barreira(this, 1);
                break;
            case 2:
                criar_barreira(this, 2);
                break;
            case 3:
                criar_barreira(this, 3);
                break;
            default:
                criar_barreira(this, 1);
        }

        this.physics.add.collider(this.jogador, this.barreiras);
        this.physics.add.collider(this.inimigos, this.barreiras);

        //animacoes das barreiras

        animacao_barreiras(this);

        this.physics.add.overlap(this.area_ataque, this.barreiras, (jogador, barreira)=>{
            if(barreira.foi_atingida){
                return;
            }
            verifica_ataque(this, barreira);
        }, null, this);

        

        //MARCAÇÕES !!!

        this.cutscene = false;

        //mapa 1

        this.entrar_boss = this.add.zone(13500, 550, 100,500);
        this.physics.world.enable(this.entrar_boss);
        this.entrar_boss.body.setAllowGravity(false);

        this.physics.add.overlap(this.entrar_boss, this.jogador, ()=>{
            if(this.cutscene){
                return;
            }
            this.cutscene = true;
            // this.jogador.setVelocity(0);
            // this.jogador.play(this.genero === "feminino"? "ramona_parada": "scott_parado");
            this.cameras.main.fadeOut(1000, 0,0,0);
            this.cameras.main.once("camerafadeoutcomplete", ()=>{
                this.scene.start("Bosses", {
                    genero:this.genero,
                    mapa:this.mapa,
                    hp: this.hp_atual
                })
            })

        }, null, this);
    }

    

    update() {
        if(this.pode_atacar){
            movimento_jogador(this);
        }

        //atualiza a posicao do body, pq o setflipx nao atualiza automatico, tbm atualiza a area de dano para seguir o jogador e modifica o z-index do jogador
        jogador_update(this);

        //idem, so que para os inimigos

        inimigo_update(this);

        //latas

        latas_update(this);
        
    }
    
}



