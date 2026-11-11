import {assets_jogador, assets_sfx, assets_mapa_1, sprite_latas, sprite_itens, html, criar_fundo, criar_jogador, variaveis_jogador, areas_jogador, animacoes_jogador, teclas_movimento, teclas_ataques, apertou_tecla, configurar_gamepad, apertou_botao_gamepad, animacao_mapa_1, jogador_update, movimento_jogador, atualizar_barra_hp, inimigo_update, criar_grupo_inimigos, criar_inimigos, animacoes_latas, latas_update, interagindo_com_item, efeitos, animacao_barreiras, criar_barreira, overlap_barreira, limites_mapa_1, pausa, colliders, verifica_ataque} from "./funcoes.js";

export class Tutorial extends Phaser.Scene {
    constructor() {
        super('Tutorial');
    }

    init() {
        this.genero = "masculino";
        this.skin = "skin_normal";
        this.bonus = false;
        this.online = false;

        const pagina = document.getElementById("pagina_inteira");

        pagina.style.display = "none";
        document.body.classList.add("em-gameplay");
    }

    preload() {
        //mesmo mapa da rua

        this.load.image("rua", "assets/conteudo/mapa_1/mapa/rua.png");

        assets_jogador(this);
        assets_sfx(this);
        assets_mapa_1(this);
        sprite_latas(this);
        sprite_itens(this);
    }

    create() {
        this.sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";

        html(this);

        // Esconde a interface HTML do menu durante o tutorial
        const pagina_tutorial = document.getElementById("pagina_inteira");

        if(pagina_tutorial){
            pagina_tutorial.style.display = "none";
        }

        // Garante que o fundo do menu nao apareca no tutorial
        document.body.style.setProperty("--fundo", "transparent");
        document.body.style.background = "transparent";

        //criando o mapa (mesmos valores da Rua)

        criar_fundo(this, -3000, "rua", 2, 0.2, 0.4, 450, 330);

        //JOGADOR !!!

        criar_jogador(this, 50, 550, 1.5, 50);

        atualizar_barra_hp(this);

        variaveis_jogador(this, 0, 0, 0);

        areas_jogador(this);

        animacoes_jogador(this);

        teclas_movimento(this);

        teclas_ataques(this);

        apertou_tecla(this);

        configurar_gamepad(this);
        apertou_botao_gamepad(this);

        //BARREIRA !!! (uma fileira so, igual a do funcoes.js: 4 pedacos empilhados a partir do y=450)

        animacao_barreiras(this);

        criar_barreira(this, 1, 1, [1100]);

        overlap_barreira(this);

        //barreiras que impedem o jogador de sair do mapa

        limites_mapa_1(this);

        //LATAS !!! (comeca vazio, a lixeira do tutorial so aparece na etapa 5)

        this.latas = this.physics.add.group();

        animacoes_latas(this);

        //ITENS !!!

        this.itens = this.physics.add.group();

        this.physics.add.overlap(this.jogador, this.itens, (jogador, item)=>{
            let item_do_tutorial = item.item_do_tutorial;

            interagindo_com_item(this, item);

            if(item_do_tutorial){
                etapa_fim(this);
            }
        });

        //EFEITOS !!!

        efeitos(this);

        //INIMIGOS !!! (so o grupo, o inimigo do tutorial so nasce na etapa 4)

        animacao_mapa_1(this);

        criar_grupo_inimigos(this, 600, 3000, 1, 1);

        //colisoes (jogador/inimigos/latas/barreiras/limites do mapa)

        colliders(this);

        //parede invisivel que segura o jogador em cada etapa

        criar_parede_tutorial(this);

        definir_limite(this, 700);

        //pausa o jogo

        pausa(this, "Tutorial");

        //controle das etapas

        this.etapa = null;
        this.inimigo_tutorial = null;
        this.lixeira_x = 0;

        criar_caixa_de_dialogo(this);

        etapa_movimento(this);
    }

    update() {
        if(this.pode_atacar){
            movimento_jogador(this);
        }

        jogador_update(this);

        inimigo_update(this);

        latas_update(this);

        switch(this.etapa){

            //ETAPA 1a: espera o jogador andar um pouco

            case "movimento":
                if(Phaser.Math.Distance.Between(this.jogador.x, this.jogador.y, 50, 550) > 200){
                    proxima_etapa(this, 600, etapa_ataque);
                }
                break;

            //ETAPA 1b: espera o jogador atacar

            case "ataque":
                if(this.ataque){
                    proxima_etapa(this, 1200, etapa_menu);
                }
                break;

            //ETAPA 3: espera quebrar um pedaco da barreira (barreira_destruida desliga o body na hora)

            case "barreira":
                if(this.barreiras.getChildren().some((barreira)=> barreira.body && !barreira.body.enable)){
                    liberar_barreira(this);
                    proxima_etapa(this, 1000, etapa_inimigo);
                }
                break;

            //ETAPA 4: espera o inimigo ser derrotado

            case "inimigo":
                if(this.inimigo_tutorial && (!this.inimigo_tutorial.active || this.inimigo_tutorial.hp <= 0)){
                    this.etapa = "inimigo_derrotado";
                    mostrar_dialogo(this, "Você derrotou o inimigo e ganhou pontos! Sua pontuação fica no canto da tela.");
                    this.time.delayedCall(3200, ()=> etapa_lixeira(this));
                }
                break;
        }
    }
}

//CAIXA DE DIALOGO !!!

function criar_caixa_de_dialogo(cena){
    let largura = cena.cameras.main.width;
    let altura = cena.cameras.main.height;

    let caixa_x = largura / 2;
    let caixa_y = altura - 90;

    let fundo = cena.add.graphics();
    fundo.fillStyle(0x000000, 0.75);
    fundo.lineStyle(3, 0xffffff, 1);
    fundo.fillRoundedRect(-largura*0.42, -50, largura*0.84, 110, 16);
    fundo.strokeRoundedRect(-largura*0.42, -50, largura*0.84, 110, 16);

    let texto = cena.add.text(0, -10, "", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: largura*0.78 }
    }).setOrigin(0.5, 0.5);

    let dica = cena.add.text(0, 42, "", {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#ffd966",
        align: "center"
    }).setOrigin(0.5, 0.5);

    cena.dialogo_container = cena.add.container(caixa_x, caixa_y, [fundo, texto, dica]);
    cena.dialogo_container.setScrollFactor(0);
    cena.dialogo_container.setDepth(9999);
    cena.dialogo_container.setVisible(false);

    cena.dialogo_texto = texto;
    cena.dialogo_dica = dica;
}

function mostrar_dialogo(cena, mensagem, dica){
    cena.dialogo_texto.setText(mensagem);
    cena.dialogo_dica.setText(dica? dica: "");
    cena.dialogo_container.setVisible(true);
}

function esconder_dialogo(cena){
    cena.dialogo_container.setVisible(false);
}

//esconde o dialogo, trava a etapa atual (pra nao disparar duas vezes) e chama a proxima depois de um tempo

function proxima_etapa(cena, atraso, funcao){
    cena.etapa = "transicao";
    esconder_dialogo(cena);
    cena.time.delayedCall(atraso, ()=> funcao(cena));
}

//PAREDE INVISIVEL !!! (impede o jogador de pular etapas. Uma unica parede que muda de lugar ou desliga)

function criar_parede_tutorial(cena){

    cena.parede = cena.add.rectangle(0, 615, 20, 600, 0x000000, 0);
    cena.physics.add.existing(cena.parede, true); //true = corpo estatico

    cena.physics.add.collider(cena.jogador, cena.parede);
    cena.physics.add.collider(cena.inimigos, cena.parede);
}

function definir_limite(cena, x){
    //x = null desliga a parede

    if(x === null){
        cena.parede.body.enable = false;
        return;
    }

    cena.parede.setPosition(x, 615);
    cena.parede.body.updateFromGameObject();
    cena.parede.body.enable = true;
}

//ETAPA 1 - andar e bater

function etapa_movimento(cena){
    mostrar_dialogo(cena, "Use W A S D ou as SETAS do teclado para se mover!", "Ande um pouco para continuar...");
    cena.etapa = "movimento";
}

function etapa_ataque(cena){
    mostrar_dialogo(cena, "Agora ataque! Use Z, X, C, V ou B. Cada golpe tem seu dano e sua recarga.", "Dê um golpe para continuar...");
    cena.etapa = "ataque";
}

//ETAPA 2 - menu de pausa

function etapa_menu(cena){
    mostrar_dialogo(cena, "Você pode abrir o menu de pausa a qualquer momento apertando P (ou L1 no controle).", "Abra o menu e depois feche para continuar...");
    cena.etapa = "menu";

    const abriu_menu = ()=>{
        if(cena.etapa !== "menu"){
            return;
        }

        cena.etapa = "menu_aberto";

        //o menu pausa a cena. quando o jogador fechar, a cena recebe o evento "resume"

        cena.events.once("resume", ()=>{
            proxima_etapa(cena, 500, etapa_barreira);
        });
    };

    cena.input.keyboard.on("keydown-P", abriu_menu);

    cena.input.gamepad.on("down", (pad, botao)=>{
        if(botao.index === 4){ //L1
            abriu_menu();
        }
    });
}

//ETAPA 3 - barreira

function etapa_barreira(cena){
    definir_limite(cena, null); //libera o caminho ate a barreira

    mostrar_dialogo(cena, "Parece que tem uma barreira bloqueando o caminho! Chegue perto e ataque para destruí-la!");
    cena.etapa = "barreira";
}

//depois que o jogador quebra um pedaco, o resto some pra nao atrapalhar

function liberar_barreira(cena){
    cena.barreiras.getChildren().slice().forEach((barreira)=>{
        if(!barreira.body || !barreira.body.enable){
            return; //esse e o que ja esta sendo quebrado, o proprio funcoes.js destroi
        }

        barreira.body.enable = false;
        cena.barreiras.remove(barreira);

        cena.tweens.add({
            targets: barreira,
            alpha: 0,
            duration: 400,
            onComplete: ()=> barreira.destroy()
        });
    });
}

//ETAPA 4 - inimigo

function etapa_inimigo(cena){
    //usa a criar_inimigos normal do jogo (IA, barra de vida, drop, etc), so troca a posicao pra nascer na frente do jogador

    criar_inimigos(cena, ["david"], 1.5, 520, 600);

    let inimigo = cena.inimigos.getChildren()[0];

    inimigo.setPosition(cena.jogador.x + 450, 560);

    cena.inimigo_tutorial = inimigo;

    //segura o jogador na arena ate derrotar o inimigo

    definir_limite(cena, inimigo.x + 350);

    mostrar_dialogo(cena, "Um inimigo apareceu! Derrote-o com seus golpes!", "Dica: se você repetir sempre o mesmo golpe, ele aprende a desviar!");
    cena.etapa = "inimigo";
}

//ETAPA 5 - lixeira (sempre solta item)

function etapa_lixeira(cena){
    definir_limite(cena, null);

    cena.lixeira_x = cena.jogador.x + 350;

    criar_lixeira_tutorial(cena, cena.lixeira_x, 560);

    //segura o jogador logo depois da lixeira ate pegar o item

    definir_limite(cena, cena.lixeira_x + 250);

    mostrar_dialogo(cena, "Lixeiras podem esconder itens úteis, como comida que cura sua vida!", "Quebre a lixeira para continuar...");
    cena.etapa = "lixeira";
}

function criar_lixeira_tutorial(cena, x, y){
    let lixeira = cena.physics.add.sprite(x, y, "lata_1").setScale(0.2);

    lixeira.tipo = "lixeira_tutorial"; //tipo proprio, o causar_dano() do funcoes.js so desconta o hp e nao mexe em mais nada
    lixeira.hp = 20;
    lixeira.defesa = 6;
    lixeira.foi_atingida = false;
    lixeira.invencibilidade = false;
    lixeira.atacando = false;

    lixeira.body.setSize(150, 80);
    lixeira.body.setOffset(140, 350);
    lixeira.setPushable(false);
    lixeira.setImmovable(true);

    lixeira.area_dano = cena.add.zone(x, y, 30, 30);
    cena.physics.world.enable(lixeira.area_dano);
    lixeira.area_dano.body.setAllowGravity(false);

    cena.latas.add(lixeira); //as colisoes do colliders() ja valem pra quem entra nesse grupo

    cena.physics.add.overlap(cena.area_ataque, lixeira.area_dano, ()=>{
        if(lixeira.foi_atingida || !cena.area_ataque.body.enable){
            return;
        }

        lixeira.foi_atingida = true;

        verifica_ataque(cena, lixeira); //desconta o hp (com a mesma chance de erro do resto do jogo)

        cena.area_ataque.body.enable = false;

        if(cena.sfx_ligado){
            cena.sound.play("quebrando", {volume:0.5});
        }

        lixeira.play("lata_1_batendo");

        lixeira.once("animationcomplete-lata_1_batendo", ()=>{
            if(lixeira.hp <= 0){
                quebrar_lixeira_tutorial(cena, lixeira);
            }
            else{
                lixeira.foi_atingida = false;
                lixeira.setFrame(0);
            }
        });

    }, null, cena);
}

function quebrar_lixeira_tutorial(cena, lixeira){
    if(cena.sfx_ligado){
        cena.sound.play("quebrado", {volume:0.5});
    }

    lixeira.play("lata_1_quebrada");

    lixeira.once("animationcomplete-lata_1_quebrada", ()=>{
        //item de cura garantido (sem veneno, sem moeda, sem debuff)

        let item = criar_item_cura_tutorial(cena, lixeira.x, lixeira.y);
        cena.itens.add(item);

        cena.latas.remove(lixeira);

        if(lixeira.area_dano){
            lixeira.area_dano.destroy();
        }

        lixeira.destroy();

        //ETAPA 6: usar o item

        mostrar_dialogo(cena, "Caiu um item! Encoste nele para pegar. Comidas e bebidas recuperam sua vida.", "Pegue o item para continuar...");
        cena.etapa = "item";
    });
}

function criar_item_cura_tutorial(cena, x, y){
    //escolhe so entre itens de cura boa: agua, comida fraca, comida ou mel

    let tipos_de_cura = ["agua", "comida_fraca", "comida", "mel"];
    let tipo = Phaser.Utils.Array.GetRandom(tipos_de_cura);

    let item = cena.physics.add.sprite(x, y < 600? y + 20: y, "agua_1");
    item.tipo = tipo;
    item.item_do_tutorial = true; //flag pra saber que foi o item scriptado do tutorial

    switch(tipo){
        case "agua":
            item.setTexture(`agua_${Phaser.Math.Between(1,4)}`);
            item.cura = Phaser.Math.Between(1,5);
            item.pontos = 10;
            break;
        case "comida_fraca":
            item.setTexture(`comida_fraca_${Phaser.Math.Between(1,18)}`);
            item.cura = Phaser.Math.Between(5,10);
            item.pontos = 20;
            break;
        case "comida":
            item.setTexture(`comida_${Phaser.Math.Between(1,30)}`);
            item.cura = Phaser.Math.Between(10,20);
            item.pontos = 30;
            break;
        case "mel":
            item.setTexture(`mel_${Phaser.Math.Between(1,10)}`);
            item.cura = Phaser.Math.Between(20,50);
            item.pontos = 50;
            break;
    }

    item.setScale(0.2);
    item.setBodySize(item.width, item.height);

    return item;
}

//ETAPA 7 - fim: aparece o quadrado (igual ao do ir_boss), mas ele leva de volta pro inicio

function etapa_fim(cena){
    cena.etapa = "fim";

    definir_limite(cena, null);

    mostrar_dialogo(cena, "Isso é tudo! Agora é só praticar. Siga em frente para terminar o tutorial. Boa sorte, lutador!");

    criar_fim_tutorial(cena, cena.lixeira_x + 800);
}

function criar_fim_tutorial(cena, x){
    let fim = cena.add.rectangle(x, 550, 100, 500, 0x0000ff, 0);
    cena.physics.add.existing(fim, true);

    cena.physics.add.overlap(fim, cena.jogador, ()=>{
        if(cena.cutscene){
            return;
        }

        cena.cutscene = true;
        cena.cameras.main.fadeOut(1000, 0, 0, 0);

        cena.cameras.main.once("camerafadeoutcomplete", ()=>{
            window.location.href = "index.html"; //volta pro inicio (nao vai pro boss)
        });
    }, null, cena);
}
