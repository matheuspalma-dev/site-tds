export function animacoes(cena, animacao, arquivo, final, framerate, repeat){
    cena.anims.create({
        key:animacao,
        frames:cena.anims.generateFrameNumbers(arquivo, {start:0, end:final}),
        frameRate:framerate,
        repeat:repeat
    });
}
export function assets_jogador(cena){
    //jogador

    //feminino

    //skin rosa
    cena.load.spritesheet("ramona_parada_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaSemFundoParada31x84.png", {frameWidth:31, frameHeight:84});
    cena.load.spritesheet("ramona_andando_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaSemFundoAndando33x84.png", {frameWidth:33, frameHeight:84});
    //ataques
    cena.load.spritesheet("ramona_golpe_1_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaSemFundoSoco74x84.png", {frameWidth:74, frameHeight:84});
    cena.load.spritesheet("ramona_golpe_2_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaSemFundoMartelo77x84.png", {frameWidth:77, frameHeight:84});
    cena.load.spritesheet("ramona_golpe_3_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaMartelo292x84.png", {frameWidth:92, frameHeight:84});
    cena.load.spritesheet("ramona_golpe_4_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaMartelo3110x84.png", {frameWidth:110, frameHeight:84});
    //martelo chapolin
    cena.load.spritesheet("chapolin_golpe_2", "assets/conteudo/ramona/martelo_chapolin/ramonaMarteloChapolin77x84.png", {frameWidth:77, frameHeight:84});
    cena.load.spritesheet("chapolin_golpe_3", "assets/conteudo/ramona/martelo_chapolin/ramonaMarteloChapolin292x84.png", {frameWidth:92, frameHeight:84});
    cena.load.spritesheet("chapolin_golpe_4", "assets/conteudo/ramona/martelo_chapolin/ramonaMarteloChapolin3110x84.png", {frameWidth:110, frameHeight:84});

    //tomando dano
    cena.load.spritesheet("ramona_machucada_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaTomandoDano50x84.png", {frameWidth:50, frameHeight:84});
    //derrotada
    cena.load.spritesheet("ramona_derrotada_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaSemFundoDerrotada72x84.png", {frameWidth:72, frameHeight:84});
    //revivendo
    // cena.load.spritesheet("ramona_revivendo", "assets/conteudo/ramona/skin_rosa/ramonaRevivendo64x160.png", {frameWidth:64, frameHeight:160});

    //comemoracoes
    cena.load.spritesheet("ramona_comemorando_1_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaComemorando.png", {frameWidth:41, frameHeight:84});
    cena.load.spritesheet("ramona_comemorando_2_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaCantando65x84.png", {frameWidth:65, frameHeight:84});
    //final
    cena.load.spritesheet("ramona_final_skin_rosa", "assets/conteudo/ramona/skin_rosa/ramonaFinal40x84.png", {frameWidth:40, frameHeight:84});

    //skin azul

    cena.load.spritesheet("ramona_parada_skin_azul", "assets/conteudo/ramona/skin_azul/ramonaParada40x84.png", {frameWidth:40, frameHeight:84});
    cena.load.spritesheet("ramona_andando_skin_azul", "assets/conteudo/ramona/skin_azul/ramonaAndando33x84.png", {frameWidth:33, frameHeight:84});
    //ataques
    cena.load.spritesheet("ramona_golpe_1_skin_azul", "assets/conteudo/ramona/skin_azul/RamonaSoco100x84.png", {frameWidth:100, frameHeight:84});
    cena.load.spritesheet("ramona_golpe_2_skin_azul", "assets/conteudo/ramona/skin_azul/ramonaMartelo110x84.png", {frameWidth:110, frameHeight:84});
    cena.load.spritesheet("ramona_golpe_3_skin_azul", "assets/conteudo/ramona/skin_azul/ramonaMartelo2110x84.png", {frameWidth:110, frameHeight:84});
    cena.load.spritesheet("ramona_golpe_4_skin_azul", "assets/conteudo/ramona/skin_azul/ramonaMartelo3110x84.png", {frameWidth:110, frameHeight:84});

    //tomando dano
    cena.load.spritesheet("ramona_machucada_skin_azul", "assets/conteudo/ramona/skin_azul/ramonaTomandoDano50x84.png", {frameWidth:50, frameHeight:84});
    //derrotada
    cena.load.spritesheet("ramona_derrotada_skin_azul", "assets/conteudo/ramona/skin_azul/ramonaSendoDerrotada72x84.png", {frameWidth:72, frameHeight:84});
    //revivendo
    // cena.load.spritesheet("ramona_revivendo", "assets/conteudo/ramona/skin_azul/ramonaRevivendo64x160.png", {frameWidth:64, frameHeight:160});

    //comemoracoes
    cena.load.spritesheet("ramona_comemorando_1_skin_azul", "assets/conteudo/ramona/skin_azul/ramonaComemorando50x84.png", {frameWidth:50, frameHeight:84});
    cena.load.spritesheet("ramona_comemorando_2_skin_azul", "assets/conteudo/ramona/skin_azul/ramonaCantanto78x84.png", {frameWidth:78, frameHeight:84});
    //final
    cena.load.spritesheet("ramona_final_skin_azul", "assets/conteudo/ramona/skin_azul/ramonaFinal40x84.png", {frameWidth:40, frameHeight:84});

    //skin castanho

    cena.load.spritesheet("ramona_parada_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaSemFundoParada40x84.png", {frameWidth:40, frameHeight:84});
    cena.load.spritesheet("ramona_andando_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaSemFundoAndando33x84.png", {frameWidth:33, frameHeight:84});
    //ataques
    cena.load.spritesheet("ramona_golpe_1_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaSemFundoSoco100x84.png", {frameWidth:100, frameHeight:84});
    cena.load.spritesheet("ramona_golpe_2_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaSemFundoMartelo110x84.png", {frameWidth:110, frameHeight:84});
    cena.load.spritesheet("ramona_golpe_3_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaMartelo2110x84.png", {frameWidth:110, frameHeight:84});
    cena.load.spritesheet("ramona_golpe_4_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaMartelo3110x84.png", {frameWidth:110, frameHeight:84});

    //tomando dano
    cena.load.spritesheet("ramona_machucada_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaTomandoDano50x84.png", {frameWidth:50, frameHeight:84});
    //derrotada
    cena.load.spritesheet("ramona_derrotada_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaSemFundoDerrotada72x84.png", {frameWidth:72, frameHeight:84});
    //revivendo
    // cena.load.spritesheet("ramona_revivendo", "assets/conteudo/ramona/skin_rosa/ramonaRevivendo64x160.png", {frameWidth:64, frameHeight:160});

    //comemoracoes
    cena.load.spritesheet("ramona_comemorando_1_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaComemorando50x84.png", {frameWidth:50, frameHeight:84});
    cena.load.spritesheet("ramona_comemorando_2_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaCantando78x84.png", {frameWidth:78, frameHeight:84});
    //final
    cena.load.spritesheet("ramona_final_skin_castanho", "assets/conteudo/ramona/skin_castanho/ramonaFinal40x84.png", {frameWidth:40, frameHeight:84});

    //masculino

    //skin normal

    cena.load.spritesheet("scott_parado_skin_normal", "assets/conteudo/scott/skin_normal/ScottParado42x84.png", {frameWidth:42, frameHeight:84});
    cena.load.spritesheet("scott_andando_skin_normal", "assets/conteudo/scott/skin_normal/ScottAndando58x84.png", {frameWidth:58, frameHeight:84});
    //ataques
    cena.load.spritesheet("scott_golpe_1_skin_normal", "assets/conteudo/scott/skin_normal/ScottSoco161x84.png", {frameWidth:61, frameHeight:84});
    cena.load.spritesheet("scott_golpe_2_skin_normal", "assets/conteudo/scott/skin_normal/ScottSoco261x84.png",{frameWidth:61, frameHeight:84});
    cena.load.spritesheet("scott_golpe_3_skin_normal", "assets/conteudo/scott/skin_normal/ScottSoco361x84.png", {frameWidth:61, frameHeight:84});
    cena.load.spritesheet("scott_golpe_4_skin_normal", "assets/conteudo/scott/skin_normal/ScottChuteBaixo80x84.png", {frameWidth:80, frameHeight:84});
    cena.load.spritesheet("scott_golpe_5_skin_normal", "assets/conteudo/scott/skin_normal/ScottChute280x84.png", {frameWidth:80, frameHeight:84});
    //tomando dano
    cena.load.spritesheet("scott_machucado_skin_normal", "assets/conteudo/scott/skin_normal/ScottLevandoGolpe55x84.png", {frameWidth:55, frameHeight:84});
    //derrotado
    cena.load.spritesheet("scott_derrotado_skin_normal", "assets/conteudo/scott/skin_normal/ScottSendoDerrotado74x84.png", {frameWidth:74, frameHeight:84});
    //revivendo
    // cena.load.spritesheet("scott_revivendo", "assets/conteudo/scott/skin_normal/ScottRevivendo72x170.png", {frameWidth:72, frameHeight:170});

    //comemoracoes 
    cena.load.spritesheet("scott_comemorando_1_skin_normal", "assets/conteudo/scott/skin_normal/ScottFinal250x84.png", {frameWidth:50, frameHeight:84});
    cena.load.spritesheet("scott_comemorando_2_skin_normal", "assets/conteudo/scott/skin_normal/ScottTocandoMusica96x100.png", {frameWidth:96, frameHeight:100});
    //final
    cena.load.spritesheet("scott_final_skin_normal", "assets/conteudo/scott/skin_normal/ScottFinal80x113.png", {frameWidth:80, frameHeight:113});

    //skin de boxe

    cena.load.spritesheet("scott_parado_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottParadoBoxe42x84.png", {frameWidth:42, frameHeight:84});
    cena.load.spritesheet("scott_andando_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottAndando58x84.png", {frameWidth:58, frameHeight:84});
    //ataques
    cena.load.spritesheet("scott_golpe_1_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottSoco161x84.png", {frameWidth:61, frameHeight:84});
    cena.load.spritesheet("scott_golpe_2_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottSoco261x84.png",{frameWidth:61, frameHeight:84});
    cena.load.spritesheet("scott_golpe_3_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottSoco361x84.png", {frameWidth:61, frameHeight:84});
    cena.load.spritesheet("scott_golpe_4_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottChuteBaixo80x84.png", {frameWidth:80, frameHeight:84});
    cena.load.spritesheet("scott_golpe_5_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottChute280x84.png", {frameWidth:80, frameHeight:84});
    //tomando dano
    cena.load.spritesheet("scott_machucado_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottLevandoGolpe55x84.png", {frameWidth:55, frameHeight:84});
    //derrotado
    cena.load.spritesheet("scott_derrotado_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottSendoDerrotado74x84.png", {frameWidth:74, frameHeight:84});
    //revivendo
    // cena.load.spritesheet("scott_revivendo", "assets/conteudo/scott/skin_boxe/ScottRevivendo72x170.png", {frameWidth:72, frameHeight:170});

    //comemoracoes 
    cena.load.spritesheet("scott_comemorando_1_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottFinal250x84.png", {frameWidth:50, frameHeight:84});
    cena.load.spritesheet("scott_comemorando_2_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottTocandoMusica96x100.png", {frameWidth:96, frameHeight:100});
    //final
    cena.load.spritesheet("scott_final_skin_boxe", "assets/conteudo/scott/skin_boxe/ScottFinal80x113.png", {frameWidth:80, frameHeight:113});

}

export function menu_sfx(cena){
    cena.load.audio("movendo_menu", "assets/conteudo/sons/sfx/menu/movendo_menu.wav");
    cena.load.audio("movendo_menu_2", "assets/conteudo/sons/sfx/menu/movendo_menu_2.ogg");

    cena.load.audio("selecionando", "assets/conteudo/sons/sfx/menu/selecionar.wav");

    //marreta zoio

    cena.load.audio("zoio", "assets/conteudo/sons/sfx/zoio.mp3");

    //arreia a mao na minha cara

    cena.load.audio("arreia", "assets/conteudo/sons/sfx/arreia.mp3");
}

export function assets_sfx(cena){
    //golpes
    cena.load.audio("ataque", "assets/conteudo/sons/sfx/swing.mp3");

    //soco
    cena.load.audio("soco_1", "assets/conteudo/sons/sfx/soco/soco_1.mp3");
    cena.load.audio("soco_2", "assets/conteudo/sons/sfx/soco/soco_2.mp3");
    cena.load.audio("soco_3", "assets/conteudo/sons/sfx/soco/soco_4.mp3");
    cena.load.audio("soco_4", "assets/conteudo/sons/sfx/soco/soco_5.mp3");

    //martelo do chapolin
    cena.load.audio("chapolin_1", "assets/conteudo/sons/sfx/chapolin/chapolin.mp3");
    cena.load.audio("chapolin_2", "assets/conteudo/sons/sfx/chapolin/chapolin_2.mp3");

    //quebrando lata
    cena.load.audio("quebrando", "assets/conteudo/sons/sfx/quebrando/quebrando.mp3");
    cena.load.audio("quebrado", "assets/conteudo/sons/sfx/quebrando/quebrado.mp3");

    //jogador caindo

    cena.load.audio("grito", "assets/conteudo/sons/sfx/grito.mp3");

    //quebrando barreira
    cena.load.audio("quebrando_barreira_1", "assets/conteudo/sons/sfx/barreira/barreira_quebrando_1.mp3");
    cena.load.audio("quebrando_barreira_2", "assets/conteudo/sons/sfx/barreira/barreira_quebrando_2.mp3");
    cena.load.audio("barreira_quebrada", "assets/conteudo/sons/sfx/barreira/barreira_quebrada.mp3");

    //batendo nos inimigos chapolin

    cena.load.audio("chaves", "assets/conteudo/sons/sfx/inimigo_tomando_dano/chaves_chorando.mp3");
    cena.load.audio("kiko", "assets/conteudo/sons/sfx/inimigo_tomando_dano/kiko.mp3");
    cena.load.audio("chiquinha", "assets/conteudo/sons/sfx/inimigo_tomando_dano/chiquinha-chorando.mp3");
    cena.load.audio("mamae", "assets/conteudo/sons/sfx/inimigo_tomando_dano/mamae.mp3");


    //itens

    cena.load.audio("cura", "assets/conteudo/sons/sfx/itens/cura.mp3");
    cena.load.audio("buff", "assets/conteudo/sons/sfx/itens/buff.mp3");
    cena.load.audio("pontos", "assets/conteudo/sons/sfx/itens/pontos.mp3");
    cena.load.audio("veneno", "assets/conteudo/sons/sfx/itens/veneno.wav");

    //nao contavam com minhas astucia

    cena.load.audio("astucia", "assets/conteudo/sons/sfx/chapolin_astucia.mp3");

    cena.load.audio("boing_1", "assets/conteudo/sons/sfx/boing/boing.mp3");
    cena.load.audio("boing_2", "assets/conteudo/sons/sfx/boing/boing_2.mp3");
    cena.load.audio("boing_3", "assets/conteudo/sons/sfx/boing/boing_3.mp3");

    //cachorro

    //rosnando

    cena.load.audio("rosnando_1", "assets/conteudo/sons/sfx/cachorro/cachorro_rosnando.mp3");
    cena.load.audio("rosnando_2", "assets/conteudo/sons/sfx/cachorro/cachorro_rosnando_2.mp3");

    //latindo

    cena.load.audio("latindo_1", "assets/conteudo/sons/sfx/cachorro/cachorro_latindo.mp3");
    cena.load.audio("latindo_2", "assets/conteudo/sons/sfx/cachorro/cachorro_latindo_2.mp3");
    cena.load.audio("latindo_3", "assets/conteudo/sons/sfx/cachorro/cachorro_latindo_3.mp3");
    cena.load.audio("latindo_4", "assets/conteudo/sons/sfx/cachorro/cachorro_latindo_4.mp3");

    //tomando dano

    cena.load.audio("cachorro_chorando_1", "assets/conteudo/sons/sfx/cachorro/cachorro_machucado.mp3");
    cena.load.audio("cachorro_chorando_2", "assets/conteudo/sons/sfx/cachorro/cachorro_machucado_2.mp3");
    cena.load.audio("cachorro_chorando_3", "assets/conteudo/sons/sfx/cachorro/cachorro_machucado.mp3");

}


export function assets_mapa_1(cena){

    //musica

    cena.load.audio("musica_mapa_1", "assets/conteudo/mapa_1/musica/mapa_1.mp3");
    cena.load.audio("boss", "assets/conteudo/mapa_1/musica/boss.mp3");

    //david

    cena.load.spritesheet("david_parado", "assets/conteudo/mapa_1/inimigos/david/DavidParado46x84.png", {frameWidth:46, frameHeight:84});
    cena.load.spritesheet("david_andando", "assets/conteudo/mapa_1/inimigos/david/DavidAndando46x84.png", {frameWidth:46, frameHeight:84});
    cena.load.spritesheet("david_machucado", "assets/conteudo/mapa_1/inimigos/david/DavidLevandoGolpe52x84.png", {frameWidth:52, frameHeight:84});
    cena.load.spritesheet("david_derrotado", "assets/conteudo/mapa_1/inimigos/david/DavidSendoDerrotado80x84.png", {frameWidth:80, frameHeight:84});
    cena.load.spritesheet("david_golpe_1", "assets/conteudo/mapa_1/inimigos/david/DavidSoco68x84.png", {frameWidth:68, frameHeight:84}); //soco
    cena.load.spritesheet("david_golpe_2", "assets/conteudo/mapa_1/inimigos/david/DavidChute185x84.png", {frameWidth:85, frameHeight:84}); //chute 1
    cena.load.spritesheet("david_golpe_3", "assets/conteudo/mapa_1/inimigos/david/DavidChute275x84.png", {frameWidth:75, frameHeight:84}); //chute 2
    
    //raymond

    cena.load.spritesheet("raymond_parado", "assets/conteudo/mapa_1/inimigos/raymond/RaymondParado50x84.png", {frameWidth:50, frameHeight:84});
    cena.load.spritesheet("raymond_andando", "assets/conteudo/mapa_1/inimigos/raymond/RaymondAndando46x84.png", {frameWidth:46, frameHeight:84});
    cena.load.spritesheet("raymond_machucado", "assets/conteudo/mapa_1/inimigos/raymond/RaymondTomandoDano58x84.png", {frameWidth:58, frameHeight:84});
    cena.load.spritesheet("raymond_derrotado", "assets/conteudo/mapa_1/inimigos/raymond/RaymondDerrotado75x84.png", {frameWidth:75, frameHeight:84});
    cena.load.spritesheet("raymond_golpe_1", "assets/conteudo/mapa_1/inimigos/raymond/RaymondSoco80x84.png", {frameWidth:80, frameHeight:84}); //soco
    cena.load.spritesheet("raymond_golpe_2", "assets/conteudo/mapa_1/inimigos/raymond/RaymondChute175x75.png", {frameWidth:75, frameHeight:75}); //chute 1
    cena.load.spritesheet("raymond_golpe_3", "assets/conteudo/mapa_1/inimigos/raymond/RaymondChute275x75.png", {frameWidth:75, frameHeight:75}); //chute 2
    

    //rick

    cena.load.spritesheet("rick_parado", "assets/conteudo/mapa_1/inimigos/rick/RickParado50x70.png", {frameWidth:50, frameHeight:70});
    cena.load.spritesheet("rick_andando", "assets/conteudo/mapa_1/inimigos/rick/RickAndando45x70.png", {frameWidth:45, frameHeight:70});
    cena.load.spritesheet("rick_machucado", "assets/conteudo/mapa_1/inimigos/rick/RickLevandoGolpe70x70.png", {frameWidth:70, frameHeight:70});
    cena.load.spritesheet("rick_derrotado", "assets/conteudo/mapa_1/inimigos/rick/RickDerrotado73x70.png", {frameWidth:73, frameHeight:70});
    cena.load.spritesheet("rick_golpe_1", "assets/conteudo/mapa_1/inimigos/rick/RickSoco65x70.png", {frameWidth:65, frameHeight:70}); //soco

    //stella

    cena.load.spritesheet("stella_andando", "assets/conteudo/mapa_1/inimigos/stella/StellaAndando60x67.png", {frameWidth:60, frameHeight:67}); //ela n tem sprite parada, vai focar atacando constantemente
    cena.load.spritesheet("stella_machucada", "assets/conteudo/mapa_1/inimigos/stella/StellaTomandoDano56x75.png", {frameWidth:56, frameHeight:75});
    cena.load.spritesheet("stella_derrotada", "assets/conteudo/mapa_1/inimigos/stella/StellaSendoDerrotada82x67.png", {frameWidth:82, frameHeight:67});
    cena.load.spritesheet("stella_golpe_1", "assets/conteudo/mapa_1/inimigos/stella/StellaAtacando55x67.png", {frameWidth:55, frameHeight:67}); //joelhada

    //barreira

    cena.load.spritesheet("barreira", "assets/conteudo/barreiras/barreira_1.png", {frameWidth:495.75, frameHeight:793});
}

export function assets_mapa_2(cena){

    cena.load.audio("musica_mapa_2", "assets/conteudo/mapa_2/musica/mapa_2.mp3");
    cena.load.audio("musica_mapa_2.0", "assets/conteudo/mapa_2/musica/mapa_2.mp3");
    cena.load.audio("boss", "assets/conteudo/mapa_2/musica/boss.mp3");

    //linus 

    cena.load.spritesheet("linus_parado", "assets/conteudo/mapa_2/inimigos/linus/LinusParado48x75.png", {frameWidth:48, frameHeight:75});
    cena.load.spritesheet("linus_andando", "assets/conteudo/mapa_2/inimigos/linus/LinusAndando40x75.png", {frameWidth:40, frameHeight:75});
    cena.load.spritesheet("linus_machucado", "assets/conteudo/mapa_2/inimigos/linus/LinusLevandoGolpe48x75.png", {frameWidth:48, frameHeight:75});
    cena.load.spritesheet("linus_derrotado", "assets/conteudo/mapa_2/inimigos/linus/LinusSendoDerrotado78x75.png", {frameWidth:78, frameHeight:75});
    cena.load.spritesheet("linus_golpe_1", "assets/conteudo/mapa_2/inimigos/linus/LinusAtaque170x75.png", {frameWidth:70, frameHeight:75}); //soco 
    cena.load.spritesheet("linus_golpe_2", "assets/conteudo/mapa_2/inimigos/linus/LinusAtaque2112x75.png", {frameWidth:112, frameHeight:75}); //cabeçada
    cena.load.spritesheet("linus_golpe_3", "assets/conteudo/mapa_2/inimigos/linus/LinusChute70x75.png", {frameWidth:70, frameHeight:75}); //chute

    //robo chuck

    cena.load.spritesheet("robo_chuck_parado", "assets/conteudo/mapa_2/inimigos/robotChuck/RobotChuckParado39x75.png", {frameWidth:39, frameHeight:75});
    cena.load.spritesheet("robo_chuck_andando", "assets/conteudo/mapa_2/inimigos/robotChuck/RobotChuckAndando45x75.png", {frameWidth:45, frameHeight:75});
    cena.load.spritesheet("robo_chuck_machucado", "assets/conteudo/mapa_2/inimigos/robotChuck/RobotChuckTomandoDano75x75.png", {frameWidth:75, frameHeight:75});
    cena.load.spritesheet("robo_chuck_derrotado", "assets/conteudo/mapa_2/inimigos/robotChuck/RobotChuckSendoDerrotado80x75.png", {frameWidth:80, frameHeight:75});
    cena.load.spritesheet("robo_chuck_golpe_1", "assets/conteudo/mapa_2/inimigos/robotChuck/RobotChuckAtaque170x75.png", {frameWidth:70, frameHeight:75}); //soco 1
    cena.load.spritesheet("robo_chuck_golpe_2", "assets/conteudo/mapa_2/inimigos/robotChuck/RobotChuckAtaque298x75.png", {frameWidth:98, frameHeight:75}); //soco 2
    cena.load.spritesheet("robo_chuck_golpe_3", "assets/conteudo/mapa_2/inimigos/robotChuck/RobotChuckChute69x75.png", {frameWidth:69, frameHeight:75}); //chute


    //tom

    cena.load.spritesheet("tom_parado", "assets/conteudo/mapa_2/inimigos/tom/TomParado39x75.png", {frameWidth:39, frameHeight:75});
    cena.load.spritesheet("tom_andando", "assets/conteudo/mapa_2/inimigos/tom/TomAndando38x75.png", {frameWidth:38, frameHeight:75});
    cena.load.spritesheet("tom_machucado", "assets/conteudo/mapa_2/inimigos/tom/TomTomandoDano70x75.png", {frameWidth:70, frameHeight:75});
    cena.load.spritesheet("tom_derrotado", "assets/conteudo/mapa_2/inimigos/tom/TomSendoDerrotado85x75.png", {frameWidth:85, frameHeight:75});
    cena.load.spritesheet("tom_golpe_1", "assets/conteudo/mapa_2/inimigos/tom/TomAtaque180x75.png", {frameWidth:80, frameHeight:75}); //soco
    cena.load.spritesheet("tom_golpe_2", "assets/conteudo/mapa_2/inimigos/tom/TomAtaque375x75.png", {frameWidth:75, frameHeight:75}); //soco 2
    cena.load.spritesheet("tom_golpe_3", "assets/conteudo/mapa_2/inimigos/tom/TomChute65x75.png", {frameWidth:65, frameHeight:75}); //chute

    //fantasma

    cena.load.image("fantasma", "assets/conteudo/mapa_2/inimigos/fantasma.png");

    //barreira

    cena.load.spritesheet("barreira", "assets/conteudo/barreiras/barreira_3.png", {frameWidth:495.75, frameHeight:793});

}

export function assets_mapa_3(cena){

    cena.load.audio("musica_mapa_3", "assets/conteudo/mapa_3/musica/mapa_3.mp3");
    cena.load.audio("boss", "assets/conteudo/mapa_3/musica/boss.mp3");

    //brad

    cena.load.spritesheet("brad_parado", "assets/conteudo/mapa_3/inimigos/brad/bradParado62x80.png", {frameWidth:62, frameHeight:80});
    cena.load.spritesheet("brad_andando", "assets/conteudo/mapa_3/inimigos/brad/bradAndando60x80.png", {frameWidth:60, frameHeight:80});
    cena.load.spritesheet("brad_machucado", "assets/conteudo/mapa_3/inimigos/brad/bradLevandoGolpe62x80.png", {frameWidth:62, frameHeight:80});
    cena.load.spritesheet("brad_derrotado", "assets/conteudo/mapa_3/inimigos/brad/bradSendoDerrotado102x80.png", {frameWidth:102, frameHeight:80});
    cena.load.spritesheet("brad_golpe_1", "assets/conteudo/mapa_3/inimigos/brad/bradAtaque190x80.png", {frameWidth:90, frameHeight:80}); //soco 1
    cena.load.spritesheet("brad_golpe_2", "assets/conteudo/mapa_3/inimigos/brad/bradAtaque290x80.png", {frameWidth:90, frameHeight:80}); //soco 2
    cena.load.spritesheet("brad_golpe_3", "assets/conteudo/mapa_3/inimigos/brad/BradChute185x80.png", {frameWidth:85, frameHeight:80}); //chute 1
    cena.load.spritesheet("brad_golpe_4", "assets/conteudo/mapa_3/inimigos/brad/bradChute275x80.png", {frameWidth:75, frameHeight:80}); //chute 2
    

    //rex

    cena.load.spritesheet("rex_parado", "assets/conteudo/mapa_3/inimigos/rex/RexParado70x110.png", {frameWidth:70, frameHeight:110});
    cena.load.spritesheet("rex_andando", "assets/conteudo/mapa_3/inimigos/rex/RexAndando65x110.png", {frameWidth:65, frameHeight:110} );
    cena.load.spritesheet("rex_machucado", "assets/conteudo/mapa_3/inimigos/rex/RexLevandoDano65x110.png", {frameWidth:65, frameHeight:110});
    cena.load.spritesheet("rex_derrotado", "assets/conteudo/mapa_3/inimigos/rex/RexSendoDerrotado105x110.png", {frameWidth:105, frameHeight:110});
    cena.load.spritesheet("rex_golpe_1", "assets/conteudo/mapa_3/inimigos/rex/RexSoco95x110.png", {frameWidth:95, frameHeight:110}); //soco
    cena.load.spritesheet("rex_golpe_2", "assets/conteudo/mapa_3/inimigos/rex/RexChute194x110.png", {frameWidth:94, frameHeight:110}); //chute 1
    cena.load.spritesheet("rex_golpe_3", "assets/conteudo/mapa_3/inimigos/rex/RexChute2100x110.png", {frameWidth:100, frameHeight:110}); //chute 2

    //doberman

    cena.load.spritesheet("cachorro_parado", "assets/conteudo/mapa_3/inimigos/doberman/DobermanParado80x65.png", {frameWidth:80, frameHeight:65});
    cena.load.spritesheet("cachorro_andando", "assets/conteudo/mapa_3/inimigos/doberman/DobermanAndando95x65.png", {frameWidth:95, frameHeight:65});
    cena.load.spritesheet("cachorro_machucado", "assets/conteudo/mapa_3/inimigos/doberman/DobermanLevandoDano52x65.png", {frameWidth:52, frameHeight:65});
    cena.load.spritesheet("cachorro_derrotado", "assets/conteudo/mapa_3/inimigos/doberman/DobermanSendoDerrotado100x65.png", {frameWidth:100, frameHeight:65});
    cena.load.spritesheet("cachorro_golpe_1", "assets/conteudo/mapa_3/inimigos/doberman/DobermanMordendo100x65.png", {frameWidth:100, frameHeight:65}); //mordida

    //william

    cena.load.spritesheet("william_parado", "assets/conteudo/mapa_3/inimigos/william/WilliamParado60x80.png", {frameWidth:60, frameHeight:80});
    cena.load.spritesheet("william_andando", "assets/conteudo/mapa_3/inimigos/william/WilliamAndando72x80.png", {frameWidth:72, frameHeight:80});
    cena.load.spritesheet("william_machucado", "assets/conteudo/mapa_3/inimigos/william/WilliamLevandoGolpe75x80.png", {frameWidth:75, frameHeight:80});
    cena.load.spritesheet("william_derrotado", "assets/conteudo/mapa_3/inimigos/william/WilliamSendoDerrotado65x80.png", {frameWidth:65, frameHeight:80});
    cena.load.spritesheet("william_golpe_1", "assets/conteudo/mapa_3/inimigos/william/WilliamAtaque1100x80.png", {frameWidth:100, frameHeight:80}); //soco
    cena.load.spritesheet("william_golpe_2", "assets/conteudo/mapa_3/inimigos/william/WilliamAtaque270x80.png", {frameWidth:70, frameHeight:80}); //barrigada

    //barreira

    cena.load.spritesheet("barreira", "assets/conteudo/barreiras/barreira_2.png", {frameWidth:495.75, frameHeight:793});

    //portao

    // cena.load.image("portao", "assets/conteudo/mapa_3/mapa/portao_prisao.png");
}

export function sprite_latas(cena){
    cena.load.spritesheet("lata_1", "assets/conteudo/latas_de_lixo/lixo_1.png",{frameWidth:418.75, frameHeight:469.5});
    cena.load.spritesheet("lata_2", "assets/conteudo/latas_de_lixo/lixo_2.png",{frameWidth:344, frameHeight:384});
}

export function sprite_itens(cena){
    //agua

    for(let i = 1; i < 5; i++){
        cena.load.image(`agua_${[i]}`, `assets/conteudo/itens/agua_${[i]}.png`);
    }

    //comida fraca

    for(let i = 1; i < 19; i++){
        cena.load.image(`comida_fraca_${[i]}`, `assets/conteudo/itens/comida_fraca_${[i]}.png`);
    }

    //comida

    for(let i = 1; i < 31; i++){
        cena.load.image(`comida_${[i]}`, `assets/conteudo/itens/comida_${[i]}.png`);
    }

    //mel 

    for(let i = 1; i < 11; i++){
        cena.load.image(`mel_${[i]}`, `assets/conteudo/itens/mel_${[i]}.png`);
    }

    //torta

    for(let i = 1; i < 4; i++){
        cena.load.image(`torta_${[i]}`, `assets/conteudo/itens/torta_${[i]}.png`);
    }

    //moedas

    for(let i = 1; i < 4; i++){
        cena.load.image(`moeda_${[i]}`, `assets/conteudo/itens/moeda_${[i]}.png`);
    }

    //pocoes

    //pocao de ataque
    cena.load.image('pocao_ataque', 'assets/conteudo/itens/pocao_ataque.png');

    //pocao de defesa 
    cena.load.image('pocao_defesa', 'assets/conteudo/itens/pocao_defesa.png');

    //pocao de stamina
    cena.load.image('pocao_stamina', 'assets/conteudo/itens/pocao_stamina.png');

    //pocao de velocidade
    cena.load.image('pocao_velocidade', 'assets/conteudo/itens/pocao_velocidade.png');

    //pocao de regenereção
    cena.load.image('pocao_regeneracao', 'assets/conteudo/itens/pocao_regeneracao.png');

    //veneno
    for(let i = 1; i < 3; i++){
        cena.load.image(`veneno_${[i]}`, `assets/conteudo/itens/veneno_${[i]}.png`);
    }

}

export function tocar_musica(cena, musica_nome){


    let excecoes = ["arreia", "zoio"];

    cena.sound.sounds.forEach((som) => {

        if(som.key !== musica_nome && !excecoes.includes(som.key)){
            som.stop();
        }

    });

    let volume = Number(sessionStorage.getItem("volume") ?? 50);
    let musica_ligada = sessionStorage.getItem("som") !== "desligado";

    cena.musica = cena.sound.add(musica_nome, {
        loop: true,
        volume: volume / 100
    });

    if(musica_ligada){
        cena.musica.play();
    }

    return cena.musica;
}

export function html(cena){
    document.body.style.background = "var(--fundo-preto)";

    //pagina de volta

    cena.pagina = document.getElementById("pagina_inteira");

    //hud de vida

    cena.hud_vida = document.getElementById("hud");
    cena.hud_vida.style.display = "flex";

    //foto do personagem

    let foto = document.getElementById("foto_personagem");

    if(cena.genero === "feminino"){
        foto.style.setProperty("--imagem-personagem",'url("assets/conteudo/cabeca_ramona.png")');
        foto.style.setProperty( "--transform-personagem", "scale(2)");
    }
    else{
        foto.style.setProperty("--imagem-personagem",'url("assets/conteudo/cabeca_scott.png")');
        foto.style.setProperty( "--transform-personagem", "scale(2) scaleX(-1)");
    }

    //pontuacao

    cena.mostrar_pontuacao = document.getElementById("pontos_jogador");
    

    //tela quando morre

    cena.botoes = document.getElementById("morreu");

    cena.botao_1 = document.getElementById("tentar_novamente"); //tentar_novamente voltar_menu meme
    cena.botao_2 = document.getElementById("voltar_menu");
    cena.botao_3 = document.getElementById("meme");

    
}

export function criar_fundo(cena,x, cenario,  escala, origin_x, origin_y, limite_min, largura_max, limite_max){
    cena.fundo = cena.add.image(x, cena.cameras.main.centerY, cenario ).setScale(escala).setOrigin(origin_x, origin_y);

    let largura_fundo = cena.fundo.width * cena.fundo.scaleX;
    let altura_fundo = cena.fundo.height * cena.fundo.scaleY;

    cena.cameras.main.setBounds(0, 0, largura_fundo, altura_fundo); //LIMITE DA CAMERA

    //se esquecerem de passar o limite_max (largura do mapa pra fisica), usa a largura do proprio fundo
    //em vez de deixar undefined -> os calculos de spawn (ex: posicionar_spawn) usam bounds.width e viram NaN, fazendo inimigos nascerem numa posicao invalida/invisivel
    if(limite_max === undefined){
        limite_max = largura_fundo;
    }

    cena.physics.world.setBounds(0, limite_min, limite_max, largura_max); //LIMITE DO MAPA 
}

//JOGADOR !!!

export function criar_jogador(cena, posicao_jogador_x, posicao_jogador_y, escala, vida){
    cena.jogador = cena.physics.add.sprite(posicao_jogador_x, posicao_jogador_y, cena.genero === "feminino"? `ramona_parada_${cena.skin}` : `scott_parado_${cena.skin}`).setScale(escala);
    cena.cameras.main.startFollow(cena.jogador);
    cena.jogador.setCollideWorldBounds(true);

    //body do jogador(hitbox das colisoes) !

    cena.jogador.body.setSize(10,10);
    cena.jogador.body.setOffset(15, 80);

    //impede o jogador de ser empurrado

    cena.jogador.setPushable(false);
    // cena.jogador.setImmovable(true);

    //status do jogador

    cena.jogador.hp_total = 50;
    cena.jogador.hp_atual = vida;
    cena.jogador.ataque = 10;
    cena.jogador.defesa = 10;

}

export function variaveis_jogador(cena, pontos, inimigos_derrotados, hits){
    cena.jogador_olhando = false; //verifica pra onde o jogador esta olhando. Se for para a direita é false, se for para a esquerda é true. Isso é para ajudar no setFlipX.
    cena.pode_atacar = true; //verifica se o jogador esta em ataque
    cena.ataque = false;

    //cooldown individual de cada golpe (z:1, x:2, c:3, v:4, b:5).
    //true = esse golpe especifico esta recarregando e nao pode ser usado ainda.
    //cada golpe recarrega no seu proprio tempo, entao usar um golpe nao trava os outros.
    cena.cooldowns_ataque = {1:false, 2:false, 3:false, 4:false, 5:false};
    cena.jogador.invencibilidade = false; //verifica se o jogador foi atacado
    cena.machucado = false; //verifica se o jogador pode atacar ou andar
    cena.jogador.derrotado = false; //verifica se o jogador ja esta no processo de derrota (evita chamar a derrota mais de uma vez)
    cena.distancia = 50; //distancia minina que o inimigo pode chegar do jogador
    // cena.menu_aberto = false; //verifica se o menu ta aberto
    

    cena.tipo_ataque = 0;

    cena.jogador.pontuacao = pontos;
    cena.pontuacao_exibida = null;
    cena.mostrar_pontuacao.innerHTML = cena.jogador.pontuacao;

    cena.jogador.inimigos_derrotados = inimigos_derrotados;
    cena.jogador.hits = hits;

    //verifica se esta acontecendo uma cutscene

    cena.cutscene = false;
}

export function areas_jogador(cena){

    //area de ataque do jogador

    cena.area_ataque = cena.add.zone(cena.jogador.x,cena.jogador.y, 100, 80)
    cena.physics.world.enable(cena.area_ataque);
    cena.area_ataque.body.setAllowGravity(false);
    cena.area_ataque.body.enable = false;

    //area de dano do jogador

    cena.area_dano = cena.add.zone(cena.jogador.x, cena.jogador.y, 30, 30);
    cena.physics.world.enable(cena.area_dano);
    cena.area_dano.body.setAllowGravity(false);

}

export function animacoes_jogador (cena, genero = cena.genero, skin = cena.skin){
    if(genero === "feminino"){
        if(!cena.anims.exists(`ramona_parada_${skin}`)){
            skin === "skin_azul"? animacoes(cena, `ramona_parada_${skin}`, `ramona_parada_${skin}`, 4, 10, -1):animacoes(cena, `ramona_parada_${skin}`, `ramona_parada_${skin}`, 5, 10, -1);
        }
        if(!cena.anims.exists(`ramona_andando_${skin}`)){
            animacoes(cena, `ramona_andando_${skin}`, `ramona_andando_${skin}`, 5, 10, -1);
        }
        if(!cena.anims.exists(`ramona_soco_${skin}`)){
            animacoes(cena, `ramona_soco_${skin}`, `ramona_golpe_1_${skin}`, 4, 10, 0);
        }
        if(!cena.anims.exists(`ramona_martelada_para_baixo_${skin}`)){
            animacoes(cena, `ramona_martelada_para_baixo_${skin}`, `ramona_golpe_2_${skin}`, 7, 10, 0);
        }
        if(!cena.anims.exists("martelada_chapolin_1")){
            animacoes(cena, "martelada_chapolin_1", "chapolin_golpe_2", 7, 10, 0);
        }

        if(!cena.anims.exists(`ramona_martelada_para_frente_${skin}`)){
            skin === "skin_castanho"? animacoes(cena, `ramona_martelada_para_frente_${skin}`, `ramona_golpe_3_${skin}`, 6, 10, 0): animacoes(cena, `ramona_martelada_para_frente_${skin}`, `ramona_golpe_3_${skin}`, 7, 10, 0);
            
        }
        if(!cena.anims.exists("martelada_chapolin_2")){
            animacoes(cena, "martelada_chapolin_2", "chapolin_golpe_3", 7, 10, 0);
        }
        if(!cena.anims.exists(`ramona_martelada_para_lado_${skin}`)){
            animacoes(cena, `ramona_martelada_para_lado_${skin}`, `ramona_golpe_4_${skin}`, 7, 10, 0);
        }
        if(!cena.anims.exists("martelada_chapolin_3")){
            animacoes(cena, "martelada_chapolin_3", "chapolin_golpe_4", 7, 10, 0);
        }
        if(!cena.anims.exists(`ramona_machucada_${skin}`)){
            animacoes(cena, `ramona_machucada_${skin}`, `ramona_machucada_${skin}`, 3, 8, 0);
        }
        if(!cena.anims.exists(`ramona_derrotada_${skin}`)){
            switch(skin){
                case "skin_castanho":
                    animacoes(cena, `ramona_derrotada_${skin}`, `ramona_derrotada_${skin}`, 9, 10, 0);
                    break;
                case "skin_azul":
                    animacoes(cena, `ramona_derrotada_${skin}`, `ramona_derrotada_${skin}`, 7, 10, 0);
                    break;
                default:
                    animacoes(cena, `ramona_derrotada_${skin}`, `ramona_derrotada_${skin}`, 12, 10, 0);
                    break;
            }
            
            
        }
        if(!cena.anims.exists(`ramona_comemorando_1_${skin}`)){
            animacoes(cena, `ramona_comemorando_1_${skin}`, `ramona_comemorando_1_${skin}`, 7, 7, 0 );
        }
        if(!cena.anims.exists(`ramona_comemorando_2_${skin}`)){
            animacoes(cena, `ramona_comemorando_2_${skin}`, `ramona_comemorando_2_${skin}`, 12, 5, 0 );
        }
        if(!cena.anims.exists(`ramona_final_${skin}`)){
            animacoes(cena, `ramona_final_${skin}`, `ramona_final_${skin}`, 20, 10, 0 );
        }
    }
    

    if(genero === "masculino"){
        if(!cena.anims.exists(`scott_parado_${skin}`)){
            animacoes(cena, `scott_parado_${skin}`, `scott_parado_${skin}`, 7, 10, -1);
        }
        if(!cena.anims.exists(`scott_andando_${skin}`)){
            animacoes(cena, `scott_andando_${skin}`, `scott_andando_${skin}`, 5, 10, -1);
        }
        if(!cena.anims.exists(`scott_soco_mao_esquerda_${skin}`)){
            animacoes(cena, `scott_soco_mao_esquerda_${skin}`, `scott_golpe_1_${skin}`, 2, 8, 0);
        }
        if(!cena.anims.exists(`scott_soco_mao_direita_${skin}`)){
            animacoes(cena, `scott_soco_mao_direita_${skin}`, `scott_golpe_2_${skin}`, 3, 8, 0);
        }
        if(!cena.anims.exists(`scott_soco_por_baixo_${skin}`)){
            animacoes(cena, `scott_soco_por_baixo_${skin}`, `scott_golpe_3_${skin}`, 3, 8, 0);
        }
        if(!cena.anims.exists(`scott_rasteira_${skin}`)){
            animacoes(cena, `scott_rasteira_${skin}`, `scott_golpe_4_${skin}`, 4, 10, 0);
        }
        if(!cena.anims.exists(`scott_chute_${skin}`)){
            animacoes(cena, `scott_chute_${skin}`, `scott_golpe_5_${skin}`, 6, 10, 0);
        }
        if(!cena.anims.exists(`scott_machucado_${skin}`)){
            animacoes(cena, `scott_machucado_${skin}`, `scott_machucado_${skin}`, 3, 8, 0);
        }
        if(!cena.anims.exists(`scott_derrotado_${skin}`)){
            skin === "skin_boxe"? animacoes(cena, `scott_derrotado_${skin}`, `scott_derrotado_${skin}`, 7, 10, 0):animacoes(cena, `scott_derrotado_${skin}`, `scott_derrotado_${skin}`, 11, 10, 0);
        }
        if(!cena.anims.exists(`scott_comemorando_1_${skin}`)){
            animacoes(cena, `scott_comemorando_1_${skin}`, `scott_comemorando_1_${skin}`, 6, 6, 0 );
        }
        if(!cena.anims.exists(`scott_comemorando_2_${skin}`)){
            animacoes(cena, `scott_comemorando_2_${skin}`, `scott_comemorando_2_${skin}`, 5, 5, 0 );
        }
        if(!cena.anims.exists(`scott_final_${skin}`)){
            animacoes(cena, `scott_final_${skin}`, `scott_final_${skin}`, 18, 5, 0 );
        }
    }

    
}

export function teclas_movimento(cena){
    cena.teclas = cena.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D,

        seta_cima: Phaser.Input.Keyboard.KeyCodes.UP,
        seta_esquerda: Phaser.Input.Keyboard.KeyCodes.LEFT,
        seta_baixo: Phaser.Input.Keyboard.KeyCodes.DOWN,
        seta_direita: Phaser.Input.Keyboard.KeyCodes.RIGHT
        
    });
}

export function teclas_ataques(cena){
    cena.teclas_ataque = cena.input.keyboard.addKeys({
        z: Phaser.Input.Keyboard.KeyCodes.Z, //golpe 1
        x: Phaser.Input.Keyboard.KeyCodes.X, //golpe 2
        c: Phaser.Input.Keyboard.KeyCodes.C, //golpe 3
        v: Phaser.Input.Keyboard.KeyCodes.V, //golpe 4
        b: Phaser.Input.Keyboard.KeyCodes.B //golpe 5(apenas scott)
    })
}

export function apertou_tecla(cena){
    cena.input.keyboard.on("keydown",(event)=>{
        if(event.code === "KeyZ" ||  event.code === "KeyX" || event.code === "KeyC" || event.code === "KeyV" || event.code === "KeyB"){
            if(cena.machucado){
                return;
            }
            ataque_jogador(cena);
        }
    })
}

export function configurar_gamepad(cena){
    cena.gamepad = null; //controle conectado (fica null se nao tiver nenhum)

    if(cena.input.gamepad.total > 0){
        cena.gamepad = cena.input.gamepad.getPad(0);
    }

    cena.input.gamepad.on("connected", (pad)=>{
        cena.gamepad = pad;
    });

    cena.input.gamepad.on("disconnected", (pad)=>{
        cena.gamepad = null;
    });
}

export function apertou_botao_gamepad(cena){
    cena.input.gamepad.on("down",(pad, botao, valor)=>{
        //0:A(z) 1:B(x) 2:X(v) 3:Y(c) 5:R1(b)
        if(botao.index === 0 || botao.index === 1 || botao.index === 2 || botao.index === 3 || botao.index === 5){
            if(cena.machucado){
                return;
            }
            ataque_jogador(cena);
        }
    })
}


//INIMIGOS !!!

export function animacao_mapa_1(cena){
    //david
    if(!cena.anims.exists("david_parado")){
        animacoes(cena, "david_parado", "david_parado", 0, 1,-1);
    }
    if(!cena.anims.exists("david_andando")){
        animacoes(cena, "david_andando", "david_andando", 5, 10,-1);
    }
    if(!cena.anims.exists("david_machucado")){
        animacoes(cena, "david_machucado", "david_machucado", 2, 5, 0);
    }
    if(!cena.anims.exists("david_derrotado")){
        animacoes(cena, "david_derrotado", "david_derrotado", 6, 10, 0);
    }
    if(!cena.anims.exists("david_golpe_1")){
        animacoes(cena, "david_golpe_1", "david_golpe_1", 7, 10, 0);
    }
    if(!cena.anims.exists("david_golpe_2")){
        animacoes(cena, "david_golpe_2", "david_golpe_2", 6, 10, 0);
    }
    if(!cena.anims.exists("david_golpe_3")){
        animacoes(cena, "david_golpe_3", "david_golpe_3", 6, 10, 0);
    }
    
    //raymond

    if(!cena.anims.exists("raymond_parado")){
        animacoes(cena, "raymond_parado", "raymond_parado", 7, 8,-1);
    }
    if(!cena.anims.exists("raymond_andando")){
        animacoes(cena, "raymond_andando", "raymond_andando", 11, 10,-1);
    }
    if(!cena.anims.exists("raymond_machucado")){
        animacoes(cena, "raymond_machucado", "raymond_machucado", 2, 10, 0);
    }
    if(!cena.anims.exists("raymond_derrotado")){
        animacoes(cena, "raymond_derrotado", "raymond_derrotado", 7, 10, 0);
    }
    if(!cena.anims.exists("raymond_golpe_1")){
        animacoes(cena, "raymond_golpe_1", "raymond_golpe_1", 7, 10, 0);
    }
    if(!cena.anims.exists("raymond_golpe_2")){
        animacoes(cena, "raymond_golpe_2", "raymond_golpe_2", 6, 10, 0);
    }
    if(!cena.anims.exists("raymond_golpe_3")){
        animacoes(cena, "raymond_golpe_3", "raymond_golpe_3", 6, 10, 0);
    }
    
    //rick

    if(!cena.anims.exists("rick_parado")){
        animacoes(cena, "rick_parado", "rick_parado", 3, 8,-1);
    }
    if(!cena.anims.exists("rick_andando")){
        animacoes(cena, "rick_andando", "rick_andando", 5, 10,-1);
    }
    if(!cena.anims.exists("rick_machucado")){
        animacoes(cena, "rick_machucado", "rick_machucado", 6, 10, 0);
    }
    if(!cena.anims.exists("rick_derrotado")){
        animacoes(cena, "rick_derrotado", "rick_derrotado", 9, 10, 0);
    }
    if(!cena.anims.exists("rick_golpe_1")){
        animacoes(cena, "rick_golpe_1", "rick_golpe_1", 4, 10, 0);
    }

    //stella

    if(!cena.anims.exists("stella_andando")){
        animacoes(cena, "stella_andando", "stella_andando", 9, 10,-1);
    }
    if(!cena.anims.exists("stella_machucado")){
        animacoes(cena, "stella_machucado", "stella_machucada", 0, 0, 0);
    }
    if(!cena.anims.exists("stella_derrotado")){
        animacoes(cena, "stella_derrotado", "stella_derrotada", 10, 10, 0);
    }
    if(!cena.anims.exists("stella_golpe_1")){
        animacoes(cena, "stella_golpe_1", "stella_golpe_1", 7, 10, 0);
    } 
    
}

export function animacao_mapa_2(cena){
    //linus

    if(!cena.anims.exists("linus_parado")){
        animacoes(cena, "linus_parado", "linus_parado", 3, 8,-1);
    }
    if(!cena.anims.exists("linus_andando")){
        animacoes(cena, "linus_andando", "linus_andando", 7, 10,-1);
    }
    if(!cena.anims.exists("linus_machucado")){
        animacoes(cena, "linus_machucado", "linus_machucado", 0, 0, 0);
    }
    if(!cena.anims.exists("linus_derrotado")){
        animacoes(cena, "linus_derrotado", "linus_derrotado", 9, 10, 0);
    }
    if(!cena.anims.exists("linus_golpe_1")){
        animacoes(cena, "linus_golpe_1", "linus_golpe_1", 4, 10, 0);
    }
    if(!cena.anims.exists("linus_golpe_2")){
        animacoes(cena, "linus_golpe_2", "linus_golpe_2", 13, 8, 0);
    }
    
    if(!cena.anims.exists("linus_golpe_3")){
        animacoes(cena, "linus_golpe_3", "linus_golpe_3", 5, 10, 0);
    }
    
    //robo chuck

    if(!cena.anims.exists("chuck_parado")){
        animacoes(cena, "chuck_parado", "robo_chuck_parado", 3, 8,-1);
    }
    if(!cena.anims.exists("chuck_andando")){
        animacoes(cena, "chuck_andando", "robo_chuck_andando", 7, 10,-1);
    }
    if(!cena.anims.exists("chuck_machucado")){
        animacoes(cena, "chuck_machucado", "robo_chuck_machucado", 2, 5, 0);
    }
    if(!cena.anims.exists("chuck_derrotado")){
        animacoes(cena, "chuck_derrotado", "robo_chuck_derrotado", 7, 10, 0);
    }
    if(!cena.anims.exists("chuck_golpe_1")){
        animacoes(cena, "chuck_golpe_1", "robo_chuck_golpe_1", 3, 10, 0);
    }
    if(!cena.anims.exists("chuck_golpe_2")){
        animacoes(cena, "chuck_golpe_2", "robo_chuck_golpe_2", 11, 10, 0);
    }
    if(!cena.anims.exists("chuck_golpe_3")){
        animacoes(cena, "chuck_golpe_3", "robo_chuck_golpe_3", 5, 10, 0);
    }

    //tom

    if(!cena.anims.exists("tom_parado")){
        animacoes(cena, "tom_parado", "tom_parado", 3, 8,-1);
    }
    if(!cena.anims.exists("tom_parado")){
        animacoes(cena, "tom_parado", "tom_parado", 3, 8,-1);
    }
    if(!cena.anims.exists("tom_andando")){
        animacoes(cena, "tom_andando", "tom_andando", 7, 10,-1);
    }
    if(!cena.anims.exists("tom_machucado")){
        animacoes(cena, "tom_machucado", "tom_machucado", 0, 0, 0);
    }
    if(!cena.anims.exists("tom_derrotado")){
        animacoes(cena, "tom_derrotado", "tom_derrotado", 5, 10, 0);
    }
    if(!cena.anims.exists("tom_golpe_1")){
        animacoes(cena, "tom_golpe_1", "tom_golpe_1", 5, 10, 0);
    }
    if(!cena.anims.exists("tom_golpe_2")){
        animacoes(cena, "tom_golpe_2", "tom_golpe_2", 4, 10, 0);
    }
    if(!cena.anims.exists("tom_golpe_3")){
        animacoes(cena, "tom_golpe_3", "tom_golpe_3", 5, 10, 0);
    } 
}

export function animacao_mapa_3(cena){

    //brad

    if(!cena.anims.exists("brad_parado")){
        animacoes(cena, "brad_parado", "brad_parado", 3, 8,-1);
    }
    if(!cena.anims.exists("brad_andando")){
        animacoes(cena, "brad_andando", "brad_andando", 7, 10,-1);
    }
    if(!cena.anims.exists("brad_machucado")){
        animacoes(cena, "brad_machucado", "brad_machucado", 2, 5, 0);
    }
    if(!cena.anims.exists("brad_derrotado")){
        animacoes(cena, "brad_derrotado", "brad_derrotado", 5, 10, 0);
    }
    if(!cena.anims.exists("brad_golpe_1")){
        animacoes(cena, "brad_golpe_1", "brad_golpe_1", 3, 10, 0);
    }
    
    if(!cena.anims.exists("brad_golpe_2")){
        animacoes(cena, "brad_golpe_2", "brad_golpe_2", 8, 10, 0);
    }
    if(!cena.anims.exists("brad_golpe_3")){
        animacoes(cena, "brad_golpe_3", "brad_golpe_3", 4, 10, 0);
    }

    //rex

    if(!cena.anims.exists("rex_parado")){
        animacoes(cena, "rex_parado", "rex_parado", 3, 8,-1);
    }
    if(!cena.anims.exists("rex_andando")){
        animacoes(cena, "rex_andando", "rex_andando", 7, 10,-1);
    }
    if(!cena.anims.exists("rex_machucado")){   
        animacoes(cena, "rex_machucado", "rex_machucado", 2, 5, 0);
    }
    if(!cena.anims.exists("rex_derrotado")){
        animacoes(cena, "rex_derrotado", "rex_derrotado", 7, 10, 0);
    }
    if(!cena.anims.exists("rex_golpe_1")){
        animacoes(cena, "rex_golpe_1", "rex_golpe_1", 3, 10, 0);
    }
    if(!cena.anims.exists("rex_golpe_2")){
        animacoes(cena, "rex_golpe_2", "rex_golpe_2", 4, 10, 0);
    }
    if(!cena.anims.exists("rex_golpe_3")){
        animacoes(cena, "rex_golpe_3", "rex_golpe_3", 4, 10, 0);
    }

    //cachorro

    if(!cena.anims.exists("cachorro_parado")){
        animacoes(cena, "cachorro_parado", "cachorro_parado", 3, 8,-1);
    }
    if(!cena.anims.exists( "cachorro_andando")){
        animacoes(cena, "cachorro_andando", "cachorro_andando", 5, 10,-1);
    }
    if(!cena.anims.exists("cachorro_machucado")){
        animacoes(cena, "cachorro_machucado", "cachorro_machucado", 1, 5, 0);
    }
    if(!cena.anims.exists("cachorro_derrotado")){
        animacoes(cena, "cachorro_derrotado", "cachorro_derrotado", 5, 10, 0);
    }
    if(!cena.anims.exists("cachorro_golpe_1")){
        animacoes(cena, "cachorro_golpe_1", "cachorro_golpe_1", 6, 10, 0);
    }
    

    //william

    if(!cena.anims.exists("william_parado")){
        animacoes(cena, "william_parado", "william_parado", 3, 8,-1);
    }
    if(!cena.anims.exists("william_andando")){
        animacoes(cena, "william_andando", "william_andando", 7, 10,-1);
    }
    if(!cena.anims.exists("william_machucado")){
        animacoes(cena, "william_machucado", "william_machucado", 1, 5, 0);
    }
    if(!cena.anims.exists("william_derrotado")){
        animacoes(cena, "william_derrotado", "william_derrotado", 6, 10, 0);
    }
    if(!cena.anims.exists("william_golpe_1")){
        animacoes(cena, "william_golpe_1", "william_golpe_1", 10, 10, 0);
    }
    if(!cena.anims.exists("william_golpe_2")){
        animacoes(cena, "william_golpe_2", "william_golpe_2", 6, 10, 0);
    }  
}

export function limites_mapa_1(cena){
    //barreiras de limite

    cena.barreiras_mapa_1 = cena.physics.add.staticGroup();

    //barreira de baixo

    const barreira_chao = cena.add.rectangle(5000, 730, 10000, 100, 0x0000ff,0);
    cena.physics.add.existing(barreira_chao, true);

    //barreira de cima

    const barreira_cima = cena.add.rectangle(11000, 430, 2500, 300, 0x0000ff, 0);
    cena.physics.add.existing(barreira_cima, true);

    //adicionando as barreiras ao grupo

    cena.barreiras_mapa_1.add(barreira_chao);
    cena.barreiras_mapa_1.add(barreira_cima);
}

//FUNÇÕES DO JOGADOR !!!

export function jogador_update(cena){
    if (cena.jogador_olhando) {
        cena.jogador.body.setOffset(cena.jogador.width - 10 - cena.jogador.body.width, 80);
        cena.physics.overlap(cena.jogador, cena.inimigos, (jogador, inimigo) => {
            cena.physics.world.separate(jogador, inimigo);
        });
    } 
    else {
        cena.jogador.body.setOffset(15, 80);
        cena.physics.overlap(cena.jogador, cena.inimigos, (jogador, inimigo) => {
            cena.physics.world.separate(jogador, inimigo);
        });
    }

    cena.jogador.setDepth(cena.jogador.body.y);
    cena.area_ataque.setPosition(cena.jogador.x + (cena.jogador_olhando? -30:30), cena.jogador.y+10);
    cena.area_dano.setPosition(cena.jogador.x, cena.jogador.y + 20);
}

export function movimento_jogador(cena){
    if(cena.machucado){
        return;
    }
    if(cena.ataque){
        return;
    }
    

    let andando = false;

    cena.jogador.setVelocity(0);

    let zona_morta = 0.2; //deadzone do analogico
    let eixo_x = 0;
    let eixo_y = 0;

    if(cena.gamepad){
        eixo_x = cena.gamepad.axes.length > 0? cena.gamepad.axes[0].getValue(): 0;
        eixo_y = cena.gamepad.axes.length > 1? cena.gamepad.axes[1].getValue(): 0;

        if(Math.abs(eixo_x) < zona_morta){
            eixo_x = 0;
        }
        if(Math.abs(eixo_y) < zona_morta){
            eixo_y = 0;
        }
    }


    if(cena.teclas.w.isDown || cena.teclas.seta_cima.isDown || (cena.gamepad && cena.gamepad.up) || eixo_y < 0){
        cena.jogador.setVelocityY(cena.buff_velocidade? -230: -180);
        // cena.jogador.setVelocityY(cena.buff_velocidade? -200: -300);
        andando = true;
    }
    if(cena.teclas.s.isDown || cena.teclas.seta_baixo.isDown || (cena.gamepad && cena.gamepad.down) || eixo_y > 0){
        cena.jogador.setVelocityY(cena.buff_velocidade? 230: 180);
        // cena.jogador.setVelocityY(cena.buff_velocidade? 200: 300);
        andando = true;
    }
    if(cena.teclas.a.isDown || cena.teclas.seta_esquerda.isDown || (cena.gamepad && cena.gamepad.left) || eixo_x < 0){
        cena.jogador_olhando = true;
        cena.jogador.setVelocityX(cena.buff_velocidade? -230: -180);
        // cena.jogador.setVelocityX(cena.buff_velocidade? -200: -300);
        andando = true;
        
    }
    if(cena.teclas.d.isDown || cena.teclas.seta_direita.isDown || (cena.gamepad && cena.gamepad.right) || eixo_x > 0){
        cena.jogador_olhando = false;
        cena.jogador.setVelocityX(cena.buff_velocidade? 230: 180);
        // cena.jogador.setVelocityX(cena.buff_velocidade? 200: 300);
        andando = true;
        
    }

    if(andando){
        cena.jogador.play(cena.genero === "feminino"? `ramona_andando_${cena.skin}`:`scott_andando_${cena.skin}`, true).setFlipX(cena.jogador_olhando);              
    } 
    else {
        cena.jogador.play(cena.genero === "feminino"? `ramona_parada_${cena.skin}`: `scott_parado_${cena.skin}`, true).setFlipX(cena.jogador_olhando);
        
    }
}

function ataque_jogador(cena){
    if(cena.machucado){
        return;
    }
    if(cena.ataque){ //o ataque atual ainda nao terminou, entao nao pode comecar outro
        return;
    }

    let z = cena.teclas_ataque.z.isDown || (cena.gamepad && cena.gamepad.buttons[0].pressed); //A
    let x = cena.teclas_ataque.x.isDown || (cena.gamepad && cena.gamepad.buttons[1].pressed); //B
    let c = cena.teclas_ataque.c.isDown || (cena.gamepad && cena.gamepad.buttons[3].pressed); //Y
    let v = cena.teclas_ataque.v.isDown || (cena.gamepad && cena.gamepad.buttons[2].pressed); //X
    let b = cena.teclas_ataque.b.isDown || (cena.gamepad && cena.gamepad.buttons[5].pressed); //R1

    if(z){
        if(cena.cooldowns_ataque[1]){ //o golpe do z ainda esta recarregando
            return;
        }
        cena.tipo_ataque = 1;
    }
    else if(x){
        if(cena.cooldowns_ataque[2]){ //o golpe do x ainda esta recarregando
            return;
        }
        cena.tipo_ataque = 2;
    }
    else if(c){
        if(cena.cooldowns_ataque[3]){ //o golpe do c ainda esta recarregando
            return;
        }
        cena.tipo_ataque = 3;
    }
    else if(v){
        if(cena.cooldowns_ataque[4]){ //o golpe do v ainda esta recarregando
            return;
        }
        cena.tipo_ataque = 4;
    }
    else if(b){
        if(cena.genero === "feminino"){ //o golpe do b so existe para o scott
            return;
        }
        if(cena.cooldowns_ataque[5]){ //o golpe do b ainda esta recarregando
            return;
        }
        cena.tipo_ataque = 5;
    }
    else{
        return;
    }

    cena.ataque = true;
    cena.ja_acertou = false;

    cena.jogador.setVelocity(0);

    let tempo_recarga; //tempo de recarga (cooldown) proprio de cada golpe

    switch(cena.tipo_ataque){
        case 1: //ataque do z. Recarrega rápido e da pouco dano, mas raramente erra. Só acerta um inimigo por vez. Empurra so um pouquinho para longe
            cena.jogador.play(cena.genero === "feminino"? `ramona_soco_${cena.skin}`:`scott_soco_mao_esquerda_${cena.skin}`).setFlipX(cena.jogador_olhando);
            tempo_recarga = 500; //recarga muito rapida
            cooldown(cena, cena.tipo_ataque, cena.genero === "feminino"? `ramona_soco_${cena.skin}`:`scott_soco_mao_esquerda_${cena.skin}`, tempo_recarga);
            break;
        case 2: //ataque do x. O mais forte junto com o b, empurra distancia media e acerta varios inimigos de uma vez. Recarga mais lenta
            tempo_recarga = 1500; //o mais demorado de todos (mas nao passa de 2s)
            if(cena.bonus && cena.genero === "feminino"){
                cena.jogador.play("martelada_chapolin_1").setFlipX(cena.jogador_olhando);
                cooldown(cena, cena.tipo_ataque, "martelada_chapolin_1", tempo_recarga);
            }
            else{
                cena.jogador.play(cena.genero === "feminino"? `ramona_martelada_para_baixo_${cena.skin}`:`scott_soco_mao_direita_${cena.skin}`).setFlipX(cena.jogador_olhando);
                cooldown(cena, cena.tipo_ataque, cena.genero === "feminino"? `ramona_martelada_para_baixo_${cena.skin}`:`scott_soco_mao_direita_${cena.skin}`, tempo_recarga);
            }
            break;
        case 3: //ataque do c. Mais dano que o z, porem menos que o x. Empurra para mais longe. Recarga media
            tempo_recarga = 700; //recarga mediana
            if(cena.bonus && cena.genero === "feminino"){
                cena.jogador.play("martelada_chapolin_3").setFlipX(cena.jogador_olhando);
                cooldown(cena, cena.tipo_ataque, "martelada_chapolin_3", tempo_recarga);
            }
            else{
                cena.jogador.play(cena.genero === "feminino"? `ramona_martelada_para_lado_${cena.skin}`:`scott_rasteira_${cena.skin}`).setFlipX(cena.jogador_olhando);
                cooldown(cena, cena.tipo_ataque, cena.genero === "feminino"? `ramona_martelada_para_lado_${cena.skin}`:`scott_rasteira_${cena.skin}`, tempo_recarga);
            }
            break;
        case 4: //ataque do v. Dano medio (mais que z e c, menos que x), empurra menos, porem mais que o z. So acerta um inimigo, rapido (porem z é mais rapido)
            tempo_recarga = 850; //recarga mediana
            if(cena.bonus && cena.genero === "feminino"){
                cena.jogador.play("martelada_chapolin_2").setFlipX(cena.jogador_olhando);
                cooldown(cena, cena.tipo_ataque, "martelada_chapolin_2", tempo_recarga);
            }
            else{
                cena.jogador.play(cena.genero === "feminino"? `ramona_martelada_para_frente_${cena.skin}`:`scott_soco_por_baixo_${cena.skin}`).setFlipX(cena.jogador_olhando);
                cooldown(cena, cena.tipo_ataque, cena.genero === "feminino"? `ramona_martelada_para_frente_${cena.skin}`:`scott_soco_por_baixo_${cena.skin}`, tempo_recarga);
            }
            break;
        case 5: //ataque do b (so o scott). O mais forte de todos, empurrao medio (igual ao x), demora um pouco pra carregar (menos que o x)
            cena.jogador.play(`scott_chute_${cena.skin}`).setFlipX(cena.jogador_olhando);
            tempo_recarga = 600; //mais rapido que os outros (exceto o z), porem mais lento que o z
            cooldown(cena, cena.tipo_ataque, `scott_chute_${cena.skin}`, tempo_recarga);
            break;
    }

    cena.sound.play("ataque", {
        volume:0.5
    });

    cena.area_ataque.body.enable = true;
}

function cooldown(cena, tipo_golpe,ataque, tempo_recarga){
    cena.cooldowns_ataque[tipo_golpe] = true; //esse golpe especifico entra em recarga
    cena.jogador.once(`animationcomplete-${ataque}` ,()=>{
        cena.area_ataque.body.enable = false;
        cena.ataque = false;
    })

    cena.time.delayedCall(tempo_recarga, ()=>{
        cena.cooldowns_ataque[tipo_golpe] = false; //esse golpe esta pronto de novo
    });
}

export function verifica_ataque(cena, alvo){
    if(alvo.invencibilidade){
        return;
    }
    if(cena.machucado){
        return;
    }
    if(!cena.area_ataque.body.enable){
        return;
    }

    let multiplicador;
    switch(cena.tipo_ataque){
        case 1: //z, so acerta um inimigo por vez (mas sempre acerta latas/barreiras junto)
            if(alvo.tipo === "inimigo"){
                if(cena.ja_acertou){
                    return;
                }
                cena.ja_acertou = true;
            }
            multiplicador = 1;
            break;
        case 2: //x, pode acertar varios inimigos de uma vez (multialvo, nao verifica ja_acertou)
            multiplicador = 1.20;
            break;
        case 3: //c, so acerta um inimigo por vez (mas sempre acerta latas/barreiras junto)
            // if(alvo.tipo === "inimigo"){
            //     if(cena.ja_acertou){
            //         return;
            //     }
            //     cena.ja_acertou = true;
            // }
            multiplicador = 1.10;
            break;
        case 4: //v, so acerta um inimigo por vez (mas sempre acerta latas/barreiras junto)
            if(alvo.tipo === "inimigo"){
                if(cena.ja_acertou){
                    return;
                }
                cena.ja_acertou = true;
            }
            multiplicador = 1.15;
            break;
        case 5: //b, so acerta um inimigo por vez (mas sempre acerta latas/barreiras junto)
            if(alvo.tipo === "inimigo"){
                if(cena.ja_acertou){
                    return;
                }
                cena.ja_acertou = true;
            }
            multiplicador = 1.25;
            break;
        default: //ataque 1
            if(alvo.tipo === "inimigo"){
                if(cena.ja_acertou){
                    return;
                }
                cena.ja_acertou = true;
            }
            multiplicador = 1;
            break;
    }

    causar_dano(cena, alvo, multiplicador);
}

//sistema anti-spam universal dos inimigos comuns (baseado no do boss): se o jogador repetir o mesmo tipo de
//ataque varias vezes seguidas contra o mesmo inimigo, ele passa a "prever" e esquivar desse ataque, sem tomar dano
function inimigo_anti_spam(inimigo, ataque_usado){
    let ultimo_ataque = inimigo.lista_ataques.length > 0? inimigo.lista_ataques[inimigo.lista_ataques.length - 1]: null;

    inimigo.lista_ataques.push(ataque_usado);

    if(ultimo_ataque === ataque_usado){
        inimigo.ataques_repetidos++;
    }
    else{
        inimigo.ataques_repetidos = 1;
    }

    if(inimigo.ataques_repetidos >= 3){
        let chance_errar = 25 * (inimigo.ataques_repetidos - 2);
        chance_errar = Phaser.Math.Clamp(chance_errar, 0, 90);

        if(Phaser.Math.Between(0, 100) < chance_errar){
            return true;
        }
    }

    return false;
}

//efeito visual de "miss": um textinho pisca perto do inimigo e depois sobe e some, avisando que o golpe nao acertou
function mostrar_miss(cena, alvo){
    let texto_miss = cena.add.text(alvo.x, alvo.y - 40, "MISS", {
        fontSize: "14px",
        fontStyle: "bold",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(9999);

    cena.tweens.add({
        targets: texto_miss,
        alpha: 0,
        duration: 120,
        yoyo: true,
        repeat: 2, //pisca umas 3 vezes
        onComplete: ()=>{
            cena.tweens.add({
                targets: texto_miss,
                y: texto_miss.y - 20,
                alpha: 0,
                duration: 300,
                onComplete: ()=> texto_miss.destroy()
            });
        }
    });
}

function causar_dano(cena, alvo, multiplicador){

    //anti-spam so vale pra inimigos comuns (boss tem o proprio sistema separado)
    if(alvo.tipo === "inimigo" && inimigo_anti_spam(alvo, cena.tipo_ataque)){
        mostrar_miss(cena, alvo);
        return;
    }

    alvo.hp -= dano_jogador(cena, alvo, multiplicador);

    switch(alvo.tipo){
        case "inimigo":
            inimigo_tomando_dano(cena, alvo);
            break;
        case "lata":
            lata_atingida(cena, alvo);
            break;
        case "barreira":
            batendo_barreira(cena, alvo);
            break;
        case "boss":
            boss_tomando_dano(cena);
            break;
        case "pilar": //so existe no Boss_3, entao usa o metodo da propria cena em vez de uma funcao compartilhada
            cena.pilar_atingido(alvo);
            break;
    }
}

function dano_jogador(cena, inimigo, multiplicador){
    let ataque = cena.buff_ataque? Math.round(cena.jogador.ataque * 1.3) : cena.jogador.ataque;

    let dano = Math.floor(Math.max(1, (ataque * multiplicador) * (100/ (100+ inimigo.defesa))));

    return dano;
}

export function jogador_tomando_dano(cena, inimigo){
    if(cena.jogador.invencibilidade || cena.jogador.derrotado){
        return;
    }
    cena.jogador.setTint(0xff0000);
    cena.jogador.hits++;
    cena.jogador.play(cena.genero === "feminino"? `ramona_machucada_${cena.skin}`: `scott_machucado_${cena.skin}`).setFlipX(cena.jogador_olhando);
    cena.jogador.setVelocity(0);
    cena.jogador.invencibilidade = true;
    cena.machucado = true;
    // let genero = cena.genero === "feminino"? "ramona_machucada": "scott_machucado";
    cena.jogador.hp_atual -= dano_inimigo(cena, inimigo);
    atualizar_barra_hp(cena);
    if(cena.jogador.hp_atual <= 0 ){
        jogador_derrotado(cena);
        return;
    }
    // cena.jogador.once(`animationcomplete-${genero}`, ()=>{
        cena.time.delayedCall(500, ()=>{
            cena.pode_atacar = true;
            cena.machucado = false;
            cena.ataque = false;
            cena.time.delayedCall(1000, ()=>{
                cena.jogador.clearTint();
                cena.jogador.invencibilidade = false;
                movimento_jogador(cena);
                // cena.jogador.play(cena.genero === "feminino"? "ramona_parado": "scott_parado", true).setFlipX(cena.jogador_olhando);
                })
        })
        
        
    // });
    return;
}

//empurra o jogador pra tras e toca um "boing", igual a barrigada do boss_2. usada pelo golpe_2 (barrigada) do william
function empurrar_jogador_barrigada(cena, inimigo){
    if(cena.sfx_ligado){
        let boing = Phaser.Math.Between(1,3);
        cena.sound.play(`boing_${boing}`);
    }

    let forca_empurrao = 350;
    let direcao = inimigo.olhando? -1 : 1;

    cena.jogador.setVelocity(direcao * forca_empurrao, Phaser.Math.Between(-80, 80));

    cena.time.delayedCall(300, ()=>{
        if(cena.jogador.active && cena.jogador.body){
            cena.jogador.setVelocity(0);
        }
    });
}

//faz o jogador reagir como se tivesse levado um golpe (usado por efeitos como o veneno, que causam dano ao longo do tempo)
//nao mexe no hp, apenas cuida da parte visual/reacao do golpe
function jogador_reagir_golpe(cena){
    if(cena.jogador.derrotado){
        return;
    }

    let genero = cena.genero === "feminino"? `ramona_machucada_${cena.skin}`: `scott_machucado_${cena.skin}`;

    cena.jogador.setTint(0xff0000);
    cena.jogador.play(genero, true).setFlipX(cena.jogador_olhando);
    cena.jogador.setVelocity(0);
    cena.machucado = true;
    cena.pode_atacar = false;

    cena.time.delayedCall(500, ()=>{
        if(cena.jogador.derrotado){
            return;
        }
        cena.pode_atacar = true;
        cena.machucado = false;
        cena.ataque = false;
        cena.jogador.clearTint();
        movimento_jogador(cena);
    })
}

export function atualizar_barra_hp(cena){
    let vida_hud = document.getElementById("vida");
    let barra_hp_atual = (cena.jogador.hp_atual / cena.jogador.hp_total) * 100;

    vida_hud.style.setProperty("--hp-width", `${barra_hp_atual}%`);
}

//sem_animacao = true pula a animação de derrota e mostra a tela de "vc morreu" na hora (usado pelos buracos, por exemplo)
function jogador_derrotado(cena, sem_animacao = false){
    if(cena.jogador.derrotado){
        return;
    }
    cena.jogador.derrotado = true;
    cena.machucado = true;
    cena.pode_atacar = false;

    let cena_atual = cena.scene.key;

    //morte instantanea, sem tocar a animacao de derrota (ex: caiu num buraco)
    if(sem_animacao){
        cena.jogador.setVelocity(0);
        botoes_morte(cena, cena_atual);
        cena.scene.pause();
        return;
    }

    let genero_derrotado = cena.genero === "feminino"? `ramona_derrotada_${cena.skin}`: `scott_derrotado_${cena.skin}`;

    cena.jogador.clearTint();
    cena.jogador.setVelocity(0);
    cena.jogador.play(genero_derrotado, true).setFlipX(cena.jogador_olhando);

    //so mostra a tela de game over depois que a animacao de derrota terminar de tocar
    cena.jogador.once(`animationcomplete-${genero_derrotado}`, ()=>{
        botoes_morte(cena, cena_atual);
        cena.scene.pause();
    });
    // cena.botoes.style.display = "flex";
    
    return;
}

//FUNÇÕES DOS INIMIGOS


export function inimigo_update(cena){
    cena.inimigos.children.iterate((inimigo)=>{
        // inimigo.olhando = inimigo.body.velocity.x < 0? true:false; //atualiza para onde o inimigo ta olhando
        if(!inimigo.empurrado){
            if(inimigo.body.velocity.x < 0){
                inimigo.olhando = true;
            }
            else if(inimigo.body.velocity.x > 0){
                inimigo.olhando = false;
            }
        }
        inimigo.setDepth(inimigo.body.y);
        inimigo.barra_hp.setPosition(inimigo.x, inimigo.y - 50);
        inimigo.barra_hp.setDepth(inimigo.y)
        inimigo.area_ataque.setPosition(inimigo.x + (inimigo.olhando? -30:30), inimigo.y+10);
        inimigo.area_dano.setPosition(inimigo.x, inimigo.y + 20);

        if(inimigo.body.blocked.left || inimigo.body.blocked.right || inimigo.body.blocked.up || inimigo.body.blocked.down){
            inimigo_andando(inimigo);
            
        }

        inimigo_perseguindo(cena, inimigo);
    })
}

export function criar_grupo_inimigos(cena, distancia_nascer, distancia_desaparecer, min_inimigos, max_inimigos, opcoes = {}){
    cena.inimigos = cena.physics.add.group();

    cena.quantidade_inimigos = Phaser.Math.Between(min_inimigos, max_inimigos)
    
    cena.distancia_spawn = distancia_nascer;
    cena.distancia_remover = distancia_desaparecer;

    //cercar: faz os inimigos cercarem o jogador em vez de virem só de um lado, e permite que nasçam atrás dele tbm (fora do campo de visão)
    cena.inimigos_cercam = opcoes.cercar ?? false;

    //contador usado para distribuir os inimigos em posicoes fixas e igualmente espaçadas ao redor do jogador (formando um circulo)
    cena.proximo_indice_cerco = 0;
}

export function criar_inimigos(cena, lista_inimigos, escala, min_y, max_y ){

    if(cena.inimigos.countActive(true) >= cena.quantidade_inimigos){
        return;
    }

    let inimigo =cena.physics.add.sprite(0, 0);

    

    inimigo.skin = Phaser.Utils.Array.GetRandom(lista_inimigos);
    inimigo.setScale(escala);

    posicionar_spawn(cena, inimigo, min_y, max_y) //460 e 500 para o mapa 1
    

    inimigo.setPushable(false); //impede o inimigo de ser empurrado
    

    inimigo.olhando = Phaser.Math.Between(1,2); //escolhe para qual lado o inimigo vai estar olhando
    inimigo.olhando = inimigo.olhando === 1? true:false;

    inimigo.invencibilidade = false;
    inimigo.perseguindo = false;
    // inimigo.boost = false;
    inimigo.atacando = false;
    inimigo.pode_atacar = true;
    inimigo.esperando_ataque = false;
    inimigo.provocado = false; //usado pelo comportamento defensivo
    inimigo.tipo = "inimigo";
    inimigo.empurrado = false;
    inimigo.drop = 2;
    inimigo.proximo_latido = 0; //usado pelo cachorro, pra nao latir toda hora sem parar

    //define a posicao fixa desse inimigo no circulo de cerco, dividindo 360° entre a quantidade de inimigos do grupo
    if(cena.inimigos_cercam){
        inimigo.indice_cerco = cena.proximo_indice_cerco;
        cena.proximo_indice_cerco = (cena.proximo_indice_cerco + 1) % cena.quantidade_inimigos;
    }

    status_inimigos(inimigo); //cria status de batalha p/ o inimigo

    criar_barra_hp(cena, inimigo, inimigo.hp_total) //cria barra de vida pro inimigo

    //area de ataque do inimigo

    inimigo.area_ataque =cena.add.zone(inimigo.x,inimigo.y, 70, 70)
    cena.physics.world.enable(inimigo.area_ataque);
    inimigo.area_ataque.body.setAllowGravity(false);
    inimigo.area_ataque.body.enable = false;

    //area de dano do inimigo

    inimigo.area_dano =cena.add.zone(inimigo.x, inimigo.y, 30, 30);
    cena.physics.world.enable(inimigo.area_dano);
    inimigo.area_dano.body.setAllowGravity(false);

    if(inimigo.skin === "stella"){
        inimigo.play(`${inimigo.skin}_andando`, true).setFlipX(inimigo.olhando);
    }
    else{
        inimigo.play(`${inimigo.skin}_parado`, true).setFlipX(inimigo.olhando);
    }

    configurar_body_inimigo(inimigo, 10, 10, (inimigo.width - 10) / 2, inimigo.height - 10);

    //verifica se o inimigo acertou o jogador

    cena.physics.add.overlap(inimigo.area_ataque, cena.area_dano,()=>{
        if(cena.jogador.invencibilidade){
            return;
        }
        if(inimigo.invencibilidade){
            return;
        }
        inimigo.area_ataque.body.enable = false;

        //a barrigada (golpe_2) do william empurra o jogador, igual o boss_2 faz na dele
        let barrigada_william = inimigo.skin === "william" && inimigo.golpe === 2;

        jogador_tomando_dano(cena, inimigo);

        if(barrigada_william){
            empurrar_jogador_barrigada(cena, inimigo);
        }
    } , null, cena);

    //verifica se o jogador acertou o inimigo
    
    cena.physics.add.overlap(cena.area_ataque, inimigo.area_dano,()=>{
        verifica_ataque(cena, inimigo);
    } , null, cena);  

    //movimento do inimigo
    inimigo.movimento =cena.time.addEvent({
        delay:timer_movimento(),
        callback:()=> inimigo_andando(inimigo),
        callbackScope:cena,
        
        loop:true
    })

    cena.inimigos.add(inimigo);

    cena.inimigos.children.iterate((inimigo)=>{
        inimigo.setCollideWorldBounds(true); //faz o inimigo nao ultrapassar o limite do mundo
    })
}

//verifica se um ponto (x,y) cai dentro dos limites de algum dos buracos da fase (com uma margem de seguranca opcional)
//usada pra impedir que lixeiras e inimigos nascam em cima de um buraco
function ponto_dentro_de_algum_buraco(cena, x, y, margem = 0){
    if(!cena.buracos || cena.buracos.length === 0){
        return false;
    }

    return cena.buracos.some((buraco)=>{
        if(!buraco){
            return false;
        }

        let min_x = buraco.x - buraco.width / 2 - margem;
        let max_x = buraco.x + buraco.width / 2 + margem;
        let min_y = buraco.y - buraco.height / 2 - margem;
        let max_y = buraco.y + buraco.height / 2 + margem;

        return x >= min_x && x <= max_x && y >= min_y && y <= max_y;
    });
}

function posicionar_spawn(cena, inimigo, min_y, max_y){

    let x;
    let y;

    let tentativas = 0;
    let caiu_no_buraco;

    do{
        tentativas++;

        if(cena.inimigos_cercam){

            //sorteia um lado (frente OU atras do jogador, nao importa a direcao que ele ta andando)
            let lado = Phaser.Math.RND.sign();
            x = cena.jogador.x + lado * (cena.distancia_spawn + Phaser.Math.Between(-200,200));

            //garante que o inimigo nasce fora do que a camera ta mostrando, pra nao aparecer do nada na tela do jogador
            let visao = cena.cameras.main.worldView;
            let margem_visao = 100;

            if(x > visao.x - margem_visao && x < visao.right + margem_visao){
                x = lado >= 0? visao.right + margem_visao + Phaser.Math.Between(0,150) : visao.x - margem_visao - Phaser.Math.Between(0,150);
            }

        }
        else if(cena.jogador.body.velocity.x > 0){

            // jogador andando para direita
            x = cena.jogador.x + cena.distancia_spawn + Phaser.Math.Between(-200,200);

        }else if(cena.jogador.body.velocity.x < 0){

            // jogador andando para esquerda
            x = cena.jogador.x - cena.distancia_spawn + Phaser.Math.Between(-200,200);

        }
        else{

            // parado
            x = cena.jogador.x + Phaser.Math.RND.sign() * cena.distancia_spawn;

        }

        let limite_min = cena.physics.world.bounds.x + 50;
        let limite_max = cena.physics.world.bounds.width - 50;

        if(x < limite_min || x > limite_max){
            x = cena.jogador.x - (x - cena.jogador.x); //espelha pro outro lado do jogador
            x = Phaser.Math.Clamp(x, limite_min, limite_max);
        }

        y = Phaser.Math.Between(min_y, max_y);

        //impede que o inimigo nasca em cima de um buraco

        caiu_no_buraco = ponto_dentro_de_algum_buraco(cena, x, y, 40);

    }while(caiu_no_buraco && tentativas < 15);

    inimigo.setPosition(x, y);

}

export function remover_inimigos_longe(cena){

    cena.inimigos.children.iterate((inimigo)=>{

        if(!inimigo){
            return;
        }

        if(inimigo.perseguindo){
            return;
        }

        if(inimigo.nascendo){ //ainda esta aparecendo pela porta, nao remove nesse meio tempo
            return;
        }

        let distancia = Phaser.Math.Distance.Between(
            cena.jogador.x,
            cena.jogador.y,
            inimigo.x,
            inimigo.y
        );

        if(distancia > cena.distancia_remover){

            inimigo.area_ataque.destroy();
            inimigo.area_dano.destroy();
            inimigo.barra_hp.destroy();

            inimigo.movimento.remove();

            inimigo.destroy();

        }

    });

}

export function atualizar_spawn(cena, lista_inimigos, escala,min_y, max_y){

    if(cena.jogador.body.velocity.x==0 &&cena.jogador.body.velocity.y==0){
        return;
    }

    while(cena.inimigos.countActive(true) < cena.quantidade_inimigos){

        criar_inimigos(cena, lista_inimigos, escala, min_y, max_y);

    }

}


// const LIMITE_INIMIGOS_PORTAS = 5; //no maximo 5 inimigos no mapa ao mesmo tempo, pra nao ficar exagerado

export function criar_grupo_inimigos_portas(cena, distancia_desaparecer, min_inimigos, max_inimigos){
    cena.inimigos = cena.physics.add.group();

    cena.quantidade_inimigos = Phaser.Math.Clamp(
        Phaser.Math.Between(min_inimigos, max_inimigos), 1, 5);

    cena.distancia_remover = distancia_desaparecer;

    cena.intervalo_spawn_porta = 8000; //8 segundos entre um inimigo e outro
    cena.proximo_spawn_porta = 0;
}

function escolher_porta_spawn(cena){
    let portas = cena.portas_mapa_2;

    if(!portas || portas.length === 0){
        return null;
    }

    let porta_escolhida = null;
    let menor_distancia = Infinity;

    portas.forEach((porta)=>{

        if(!porta){
            return;
        }

        let distancia = Phaser.Math.Distance.Between(cena.jogador.x, cena.jogador.y, porta.x, porta.y);

        if(distancia < menor_distancia){
            menor_distancia = distancia;
            porta_escolhida = porta;
        }
    });

    return porta_escolhida;
}

function posicionar_spawn_porta(cena, inimigo, min_y, max_y){
    let porta = escolher_porta_spawn(cena);

    if(!porta){
        posicionar_spawn(cena, inimigo, min_y, max_y);
        return;
    }

    let x = porta.x + Phaser.Math.Between(-20, 20);
    let y = porta.y;

    let limite_min = cena.physics.world.bounds.x + 50;
    let limite_max = cena.physics.world.bounds.width - 50;

    x = Phaser.Math.Clamp(x, limite_min, limite_max);

    inimigo.setPosition(x, y);
}

export function criar_inimigos_porta(cena, lista_inimigos, escala, min_y, max_y){

    if(cena.inimigos.countActive(true) >= cena.quantidade_inimigos){
        return;
    }

    let inimigo = cena.physics.add.sprite(0, 0);

    inimigo.skin = Phaser.Utils.Array.GetRandom(lista_inimigos);
    inimigo.setScale(escala);

    posicionar_spawn_porta(cena, inimigo, min_y, max_y);

    inimigo.setPushable(false); 

    inimigo.olhando = Phaser.Math.Between(1,2);
    inimigo.olhando = inimigo.olhando === 1? true:false;

    inimigo.invencibilidade = false;
    inimigo.perseguindo = false;
    inimigo.atacando = false;
    inimigo.pode_atacar = true;
    inimigo.esperando_ataque = false;
    inimigo.provocado = false; //usado pelo comportamento defensivo
    inimigo.tipo = "inimigo";
    inimigo.empurrado = false;
    inimigo.drop = 2;
    inimigo.nascendo = true;
    inimigo.invencibilidade = true;

    status_inimigos(inimigo); 

    criar_barra_hp(cena, inimigo, inimigo.hp_total) 

    //area de ataque do inimigo

    inimigo.area_ataque = cena.add.zone(inimigo.x,inimigo.y, 50, 30)
    cena.physics.world.enable(inimigo.area_ataque);
    inimigo.area_ataque.body.setAllowGravity(false);
    inimigo.area_ataque.body.enable = false;

    //area de dano do inimigo

    inimigo.area_dano = cena.add.zone(inimigo.x, inimigo.y, 30, 30);
    cena.physics.world.enable(inimigo.area_dano);
    inimigo.area_dano.body.setAllowGravity(false);

    if(inimigo.skin === "stella"){
        inimigo.play(`${inimigo.skin}_andando`, true).setFlipX(inimigo.olhando);
    }
    else{
        inimigo.play(`${inimigo.skin}_parado`, true).setFlipX(inimigo.olhando);
    }

    configurar_body_inimigo(inimigo, 10, 10, (inimigo.width - 10) / 2, inimigo.height - 10);

    //verifica se o inimigo acertou o jogador

    cena.physics.add.overlap(inimigo.area_ataque, cena.area_dano,()=>{
        if(cena.jogador.invencibilidade){
            return;
        }
        if(inimigo.invencibilidade){
            return;
        }
        inimigo.area_ataque.body.enable = false;

        //a barrigada (golpe_2) do william empurra o jogador, igual o boss_2 faz na dele
        let barrigada_william = inimigo.skin === "william" && inimigo.golpe === 2;

        jogador_tomando_dano(cena, inimigo);

        if(barrigada_william){
            empurrar_jogador_barrigada(cena, inimigo);
        }
    } , null, cena);

    //verifica se o jogador acertou o inimigo

    cena.physics.add.overlap(cena.area_ataque, inimigo.area_dano,()=>{
        verifica_ataque(cena, inimigo);
    } , null, cena);

    //movimento do inimigo
    inimigo.movimento = cena.time.addEvent({
        delay:timer_movimento(),
        callback:()=> inimigo_andando(inimigo),
        callbackScope:cena,

        loop:true
    })

    cena.inimigos.add(inimigo);

    cena.inimigos.children.iterate((inimigo)=>{
        inimigo.setCollideWorldBounds(true); //faz o inimigo nao ultrapassar o limite do mundo
    })

    inimigo.setAlpha(0);

    cena.tweens.add({
        targets: inimigo,
        alpha: 1,
        duration: 1000,
        ease: "Linear",
        onComplete: ()=>{
            if(inimigo.active){
                inimigo.nascendo = false;
                inimigo.invencibilidade = false;
            }
        }
    })
}

export function atualizar_spawn_portas(cena, lista_inimigos, escala, min_y, max_y){

    if(cena.inimigos.countActive(true) >= cena.quantidade_inimigos){
        return;
    }
    if(cena.time.now < cena.proximo_spawn_porta){
        return;
    }

    criar_inimigos_porta(cena, lista_inimigos, escala, min_y, max_y);

    cena.proximo_spawn_porta = cena.time.now + cena.intervalo_spawn_porta;
}

function timer_movimento(){
    let delay = Phaser.Math.Between(1000, 4000);
    return delay;
}

function configurar_body_inimigo(inimigo, largura, altura, posicao_x,posicao_y){
    inimigo.body.setSize(largura,altura);
    inimigo.body.setOffset(posicao_x,posicao_y);
    return;
    
}

export function inimigo_andando(inimigo){
    if(!inimigo.active){
        return;
    }
    if(inimigo.nascendo){ //ainda no efeito de fadein de nascimento pela porta, nao anda ainda
        return;
    }
    if(inimigo.perseguindo){
        return;
    }

    if(inimigo.atacando){
        return;
    }

    if(inimigo.empurrado){
        return;
    }
    inimigo.setVelocity(0);

    inimigo.vai_andar = Phaser.Math.Between(1,4);
    inimigo.vai_andar = inimigo.vai_andar <4? true:false;

    if(inimigo.vai_andar){
        inimigo.direcao = Phaser.Math.Between(1,4);
        switch(inimigo.direcao){
            case 1:
                inimigo.olhando = true;
                inimigo.setVelocityX(-inimigo.velocidade);
                break;
            case 2:
                // inimigo.direcao = "direita";
                inimigo.olhando = false;
                inimigo.setVelocityX(inimigo.velocidade);
                break;
            case 3:
                // inimigo.direcao = "cima";
                inimigo.setVelocityY(-inimigo.velocidade);
                break;
            case 4:
                // inimigo.direcao = "baixo";
                inimigo.setVelocityY(inimigo.velocidade);
                break;
            default:
                // inimigo.direcao = "esquerda";
                inimigo.olhando = true;
                inimigo.setVelocityX(-inimigo.velocidade);
                break;
        }

        inimigo.play(`${inimigo.skin}_andando`, true).setFlipX(inimigo.olhando);

        //cachorro rosna enquanto anda andando por conta propria (nao perseguindo o jogador ainda)
        if(inimigo.skin === "cachorro" && inimigo.scene && inimigo.scene.sfx_ligado){
            parar_sfx_cachorro(inimigo.scene); //corta o latido/choro na hora, pra nao tocar junto com o rosnado
            let rosnados = ["rosnando_1", "rosnando_2"];
            let rosnado = Phaser.Utils.Array.GetRandom(rosnados);
            inimigo.scene.sound.play(rosnado);
        }

    }
    else{
        inimigo.setVelocity(0);
        inimigo.play(`${inimigo.skin}_parado`, true).setFlipX(inimigo.olhando);      
    } 
}

export function status_inimigos(inimigo){
    //sistema anti-spam: guarda o historico dos tipos de ataque que esse inimigo levou, pra poder "prever" ataques repetidos
    inimigo.lista_ataques = [];
    inimigo.ataques_repetidos = 0;

    switch(inimigo.skin){
        case "david":
            inimigo.hp_total = 30;
            inimigo.hp = 30;

            inimigo.ataque = 10;
            inimigo.defesa = 8;
            inimigo.velocidade = 100;

            inimigo.comportamento = "agressivo";
            inimigo.visao = 500;

            inimigo.pontuacao = 35;
            break;
        case "raymond":
            inimigo.hp_total = 45;
            inimigo.hp = 45;

            inimigo.ataque = 8;
            inimigo.defesa = 10;
            inimigo.velocidade = 80;

            inimigo.comportamento = "tanque";
            inimigo.visao = 300;

            inimigo.pontuacao = 40
            break;
        case "rick":
            inimigo.hp_total = 30;
            inimigo.hp = 30;

            inimigo.ataque = 8;
            inimigo.defesa = 8;
            inimigo.velocidade = 80;

            inimigo.comportamento = "defensivo";
            inimigo.visao = 250

            inimigo.pontuacao = 30;
            break;
        case "stella":
            inimigo.hp_total = 20;
            inimigo.hp = 20;

            inimigo.ataque = 8;
            inimigo.defesa = 6;
            inimigo.velocidade = 100;

            inimigo.comportamento = "agressivo"; //vou trocar dps
            inimigo.visao = 500; //vou trocar dps

            inimigo.pontuacao = 50;
            break;
        case "linus":
            inimigo.hp_total = 55;
            inimigo.hp = 55;

            inimigo.ataque = 10;
            inimigo.defesa = 10;
            inimigo.velocidade = 80;

            inimigo.comportamento = "tanque"; 
            inimigo.visao = 500;

            inimigo.pontuacao = 40;
            break;
        case "chuck":
            inimigo.hp_total = 60;
            inimigo.hp = 60;

            inimigo.ataque = 12;
            inimigo.defesa = 20;
            inimigo.velocidade = 100;

            inimigo.comportamento = "agressivo";
            inimigo.visao = 500;

            inimigo.pontuacao = 50;
            
            break;
        case "tom":
            inimigo.hp_total = 55;
            inimigo.hp = 55;

            inimigo.ataque = 8;
            inimigo.defesa = 10;
            inimigo.velocidade = 80;

            inimigo.comportamento = "defensivo";
            inimigo.visao = 200;

            inimigo.pontuacao = 40;
            break;
        case "brad":
            inimigo.hp_total = 80;
            inimigo.hp = 80;

            inimigo.ataque = 7;
            inimigo.defesa = 15;
            inimigo.velocidade = 80;

            inimigo.comportamento = "agressivo";
            inimigo.visao = 1000; 

            inimigo.pontuacao = 50;
            break;
        case "cachorro":
            inimigo.hp_total = 50;
            inimigo.hp = 50;

            inimigo.ataque = 9;
            inimigo.defesa = 7;
            inimigo.velocidade = 100;

            inimigo.comportamento = "agressivo"; 
            inimigo.visao = 500; 

            inimigo.pontuacao = 100;
            break;
        case "rex":
            inimigo.hp_total = 80;
            inimigo.hp = 80;

            inimigo.ataque = 7;
            inimigo.defesa = 15;
            inimigo.velocidade = 80;

            inimigo.comportamento = "agressivo"; 
            inimigo.visao = 1000;

            inimigo.pontuacao = 50;
            break;
        case "william":
            inimigo.hp_total = 80;
            inimigo.hp = 80;

            inimigo.ataque = 5;
            inimigo.defesa = 34;
            inimigo.velocidade = 60;

            inimigo.comportamento = "tanque";
            inimigo.visao = 700;

            inimigo.pontuacao = 67;
            break;
        default:
            inimigo.hp_total = 30;
            inimigo.hp = 30;

            inimigo.ataque = 10;
            inimigo.defesa = 8;
            inimigo.velocidade = 100;

            inimigo.comportamento = "agressivo";
            inimigo.visao = 500;

            inimigo.pontuacao = 35;
            
    }
}

export function criar_barra_hp(cena, inimigo, hp_total){
    const quadrado = cena.add.rectangle(0,0, 50, 20, 0x0000ff).setOrigin(0.5, 0.5);
    const texto = cena.add.text(0, 0, hp_total + '/' + hp_total, { fontSize: '10px', fill: '#FFF' }).setOrigin(0.5, 0.5);
    inimigo.barra_hp = cena.add.container(inimigo.x,inimigo.y - 50, [quadrado, texto]);

    return inimigo.barra_hp;
}

//BARRA DE HP DO BOSS !!!

//versao antiga: barra desenhada 100% pelo phaser (canvas). ficou comentada pra referencia/comparacao
//caso a versao em html (mais abaixo) nao agrade - so descomentar essa e comentar a de baixo.
/*
function desenhar_contorno_chanfrado(moldura, meia_largura, meia_altura, chanfro, folga){
    let mw = meia_largura + folga;
    let mh = meia_altura + folga;

    moldura.beginPath();
    moldura.moveTo(-mw + chanfro, -mh);
    moldura.lineTo(mw - chanfro, -mh);
    moldura.lineTo(mw, -mh + chanfro);
    moldura.lineTo(mw, mh - chanfro);
    moldura.lineTo(mw - chanfro, mh);
    moldura.lineTo(-mw + chanfro, mh);
    moldura.lineTo(-mw, mh - chanfro);
    moldura.lineTo(-mw, -mh + chanfro);
    moldura.closePath();
    moldura.strokePath();
}

function desenhar_moldura_barra_boss(moldura, largura, altura){
    const chanfro = 8; //corte nos cantos, pra parecer um painel futurista
    const meia_largura = largura / 2;
    const meia_altura = altura / 2;

    moldura.clear();

    //brilho externo (glow), camadas com alpha decrescente
    moldura.lineStyle(6, 0x1fd6ff, 0.15);
    desenhar_contorno_chanfrado(moldura, meia_largura, meia_altura, chanfro, 3);

    moldura.lineStyle(3, 0x1fd6ff, 0.35);
    desenhar_contorno_chanfrado(moldura, meia_largura, meia_altura, chanfro, 1.5);

    //moldura principal
    moldura.lineStyle(2, 0x6be8ff, 1);
    desenhar_contorno_chanfrado(moldura, meia_largura, meia_altura, chanfro, 0);

    //"dentes"/segmentos verticais, pra dar aquele ar de HUD sci-fi
    moldura.lineStyle(1, 0x03202b, 0.9);
    const segmentos = 10;
    for(let i = 1; i < segmentos; i++){
        let x = -meia_largura + (largura / segmentos) * i;
        moldura.beginPath();
        moldura.moveTo(x, -meia_altura + 3);
        moldura.lineTo(x, meia_altura - 3);
        moldura.strokePath();
    }
}

export function criar_barra_hp_boss(cena, boss, opcoes = {}){
    const largura = opcoes.largura ?? 380;
    const altura = opcoes.altura ?? 26;
    const x = opcoes.x ?? cena.cameras.main.width / 2;
    const y = opcoes.y ?? 40;

    const fonte_pixel = '"Press Start 2P", "Courier New", monospace';

    const fundo = cena.add.rectangle(-largura / 2, 0, largura, altura, 0x011019).setOrigin(0, 0.5);

    const preenchimento = cena.add.rectangle(-largura / 2 + 2, 0, largura - 4, altura - 4, 0x1e88ff).setOrigin(0, 0.5);

    const brilho = cena.add.rectangle(-largura / 2 + 2, -(altura - 4) / 2 + 2, largura - 4, 3, 0x9fe8ff, 0.8).setOrigin(0, 0);

    const moldura = cena.add.graphics();
    desenhar_moldura_barra_boss(moldura, largura, altura);

    const texto_nome = cena.add.text(0, -altura / 2 - 14, boss.nome.toUpperCase(), {
        fontFamily: fonte_pixel,
        fontSize: "12px",
        color: "#8fe9ff",
        stroke: "#00131c",
        strokeThickness: 4
    }).setOrigin(0.5, 0.5);

    const texto_hp = cena.add.text(0, 0, `${boss.hp}/${boss.hp_total}`, {
        fontFamily: fonte_pixel,
        fontSize: "11px",
        color: "#eafcff",
        stroke: "#00131c",
        strokeThickness: 4
    }).setOrigin(0.5, 0.5);

    boss.barra_hp = cena.add.container(x, y, [fundo, preenchimento, brilho, moldura, texto_nome, texto_hp]);
    boss.barra_hp.setScrollFactor(0).setDepth(9999);

    boss.barra_hp_largura = largura;
    boss.barra_hp_preenchimento = preenchimento;
    boss.barra_hp_brilho = brilho;
    boss.barra_hp_texto = texto_hp;

    return boss.barra_hp;
}

export function atualizar_barra_hp_boss(cena, boss){
    if(!boss.barra_hp_preenchimento){
        return;
    }

    let hp_atual = Math.max(boss.hp, 0);
    let porcentagem = Phaser.Math.Clamp(hp_atual / boss.hp_total, 0, 1);

    boss.barra_hp_preenchimento.setScale(porcentagem, 1);
    boss.barra_hp_brilho.setScale(porcentagem, 1);

    let cor = 0x1e88ff;
    if(porcentagem <= 0.25){
        cor = 0xff3b3b;
    }
    else if(porcentagem <= 0.5){
        cor = 0x00c3ff;
    }
    boss.barra_hp_preenchimento.setFillStyle(cor);

    boss.barra_hp_texto.setText(`${hp_atual}/${boss.hp_total}`);
}
*/

export function criar_barra_hp_boss(cena, boss, id_boss){
    boss.hud_boss = document.getElementById(`hud_${id_boss}`);
    boss.hud_boss_nome = document.getElementById(`nome_${id_boss}`);
    boss.hud_boss_fill = document.getElementById(`vida_${id_boss}`);
    boss.hud_boss_texto = document.getElementById(`texto_vida_${id_boss}`);

    if(!boss.hud_boss){
        return; //protecao: se o html ainda nao tiver os elementos, nao quebra o jogo
    }

    boss.hud_boss_nome.textContent = boss.nome.toUpperCase();
    boss.hud_boss.style.display = "flex";

    atualizar_barra_hp_boss(cena, boss);
}

//atualiza a barra: encolhe o preenchimento via variavel css (igual a barra do jogador usa --hp-width)
//e troca o texto. quando a vida ta baixa, a cor muda de azul pra vermelho de alerta.
export function atualizar_barra_hp_boss(cena, boss){
    if(!boss.hud_boss_fill){
        return;
    }

    let hp_atual = Math.max(boss.hp, 0);
    let porcentagem = Phaser.Math.Clamp(hp_atual / boss.hp_total, 0, 1);

    boss.hud_boss_fill.style.setProperty("--hp-boss-width", `${porcentagem * 100}%`);

    boss.hud_boss_fill.classList.remove("hp_boss_medio", "hp_boss_critico");
    if(porcentagem <= 0.25){
        boss.hud_boss_fill.classList.add("hp_boss_critico");
    }
    else if(porcentagem <= 0.5){
        boss.hud_boss_fill.classList.add("hp_boss_medio");
    }

    boss.hud_boss_texto.textContent = `${hp_atual}/${boss.hp_total}`;
}

//para todas as sfx do cachorro na hora (rosnado, latido, choro), usada toda vez que ele troca de acao pra nao ficar uma sfx tocando por cima da outra
export function parar_sfx_cachorro(cena){
    let sfx_cachorro = ["rosnando_1", "rosnando_2", "latindo_1", "latindo_2", "latindo_3", "latindo_4", "cachorro_chorando_1", "cachorro_chorando_2", "cachorro_chorando_3"];

    sfx_cachorro.forEach((chave)=>{
        cena.sound.stopByKey(chave);
    });
}

function inimigo_tomando_dano(cena, inimigo){
    // let soco =  Phaser.Math.Between(1,4);
    // cena.sound.play(`soco_${soco}`);
    if(cena.bonus){
        // let soco =  Phaser.Math.Between(1,2);
        cena.sound.play("chapolin_1");
    }

    let vozes = Phaser.Math.Between(1,100);
    if(vozes <=5){
        let vozes_chapolin = ["chaves", "kiko", "chiquinha", "mamae"];
        let voz = Phaser.Utils.Array.GetRandom(vozes_chapolin);
        if(cena.sfx_ligado){
            cena.sound.play(voz);
        }
    }

    //cachorro tem sfx propria de dano
    if(inimigo.skin === "cachorro" && cena.sfx_ligado){
        parar_sfx_cachorro(cena); //corta o rosnado/latido na hora, pra nao tocar junto com o choro
        let chorando = ["cachorro_chorando_1", "cachorro_chorando_2", "cachorro_chorando_3"];
        let choro = Phaser.Utils.Array.GetRandom(chorando);
        cena.sound.play(choro);
    }

    //cada golpe empurra o inimigo com uma forca diferente
    let forca_empurrao;
    switch(cena.tipo_ataque){
        case 1: //z, empurra so um pouquinho
            forca_empurrao = 30;
            break;
        case 2: //x, empurra distancia media
            forca_empurrao = 90;
            break;
        case 3: //c, empurra para mais longe
            forca_empurrao = 120;
            break;
        case 4: //v, empurra menos, porem mais que o z
            forca_empurrao = 60;
            break;
        case 5: //b, empurrao medio (igual ao x)
            forca_empurrao = 90;
            break;
        default:
            forca_empurrao = 50;
            break;
    }

    inimigo.setVelocity(cena.jogador_olhando ? -forca_empurrao : forca_empurrao,Phaser.Math.Between(-forca_empurrao, forca_empurrao));

    inimigo.empurrado = true;

    cena.time.delayedCall(800, ()=>{
        if(inimigo.active && inimigo.body){
            inimigo.setVelocity(0);
        }
    });
    inimigo_flash_dano(cena, inimigo);
    inimigo.play(`${inimigo.skin}_machucado`, true).setFlipX(!cena.jogador_olhando);

    //se o inimigo levou esse golpe no meio do proprio ataque, cancela o ataque dele:
    //senao ele fica travado pra sempre esperando uma animacao de golpe que foi interrompida
    inimigo.atacando = false;
    inimigo.esperando_ataque = false;
    inimigo.pode_atacar = true;
    inimigo.area_ataque.body.enable = false;

    let texto = inimigo.barra_hp.getAt(1);
    // inimigo.hp_atual -= cena.dano_jogador(inimigo, dano);
    inimigo.invencibilidade = true;
    texto.setText(inimigo.hp + "/" + inimigo.hp_total);

    if(inimigo.hp <= 0){
        inimigo_derrotado(cena, inimigo);
        return;
    }

    cena.time.delayedCall(1500, ()=>{
        inimigo_invencivel(inimigo);
    })
    
}

export function inimigo_flash_dano(cena, inimigo){
    if(inimigo.evento_flash){
        inimigo.evento_flash.remove();
        inimigo.evento_flash = null;
    }

    let piscando = true;
    inimigo.setTint(0xffffff);
    inimigo.setAlpha(0.5);

    inimigo.evento_flash = cena.time.addEvent({
        delay: 100,
        loop: true,
        callback: ()=>{
            piscando = !piscando;
            if(piscando){
                inimigo.setTint(0xffffff);
                inimigo.setAlpha(0.5);
            }
            else{
                inimigo.clearTint();
                inimigo.setAlpha(1);
                
            }
        }
    });
}

export function inimigo_parar_flash_dano(inimigo){
    if(inimigo.evento_flash){
        inimigo.evento_flash.remove();
        inimigo.evento_flash = null;
    }
    inimigo.clearTint();
    inimigo.setAlpha(1);
}

function inimigo_invencivel(inimigo){
    //protecao: o inimigo pode ter sido destruido (ex: troca de fase de boss) antes desse
    //delayedCall disparar, entao sem isso o .play() quebra tentando usar um sprite morto
    if(!inimigo || !inimigo.active || !inimigo.anims){
        return;
    }
    inimigo_parar_flash_dano(inimigo);
    inimigo.invencibilidade = false;
    inimigo.empurrado = false;
    if(inimigo.skin !== "stella"){
        inimigo.play(`${inimigo.skin}_parado`, true).setFlipX(inimigo.olhando);
    }
    return; 
}

export function inimigo_derrotado(cena, inimigo){
    inimigo_parar_flash_dano(inimigo);
    // inimigo.setVelocity(0);
    if(inimigo.body){
        inimigo.setVelocity(0);
    }
    if(inimigo.skin === "cachorro" && cena.sfx_ligado){
        parar_sfx_cachorro(cena); //morreu, corta qualquer rosnado/latido/choro que ainda estivesse tocando
    }
    cena.jogador.inimigos_derrotados++;
    atualizar_pontuacao(cena, inimigo.pontuacao);
    if(inimigo.active && inimigo.anims){
        inimigo.play(`${inimigo.skin}_derrotado`);
    }
    cena.time.delayedCall(2000, ()=>{
        //protecao: mesmo caso do inimigo_invencivel, o inimigo pode ja ter sido destruido
        //(ex: troca de fase de boss) antes desse delayedCall disparar
        if(!inimigo || !inimigo.active){
            return;
        }
        let chance_drop = Phaser.Math.Between(inimigo.drop,10);
        if(chance_drop <= inimigo.drop){
            let tipo = tipo_de_item();
            let item = criar_itens(cena, tipo);
            cena.itens.add(item);
            item.setPosition(inimigo.x, inimigo.y < 600? inimigo.y + 20: inimigo.y);
        }
        cena.inimigos.remove(inimigo);
        if(inimigo.area_dano){
            inimigo.area_dano.destroy();
        }
        if(inimigo.area_ataque){
            inimigo.area_ataque.destroy();
        }
        if(inimigo.barra_hp){
            inimigo.barra_hp.destroy();
        }
        inimigo.destroy();
        
    })

    return;
}

//FUNÇÕES DO BOSS (dano) !!!

//reacao do boss ao levar um golpe: pisca (reaproveitando a mesma piscada dos inimigos comuns),
//toca a animacao de "machucado" e atualiza a barra de hp dele. cada fase do boss (this.boss.derrotado,
//defendendo, etc.) continua sendo controlada dentro da propria cena (ex: Boss_3.js).
function boss_tomando_dano(cena){
    let boss = cena.boss;

    if(!boss || boss.invencibilidade || boss.derrotado){
        return;
    }

    boss.invencibilidade = true;
    boss.pode_atacar = false;

    inimigo_flash_dano(cena, boss);

    if(boss.anims){
        boss.play(`${boss.nome}_machucado`, true).setFlipX(!boss.olhando);
    }

    atualizar_barra_hp_boss(cena, boss);

    if(boss.hp <= 0){
        boss_derrotado(cena, boss);
        return;
    }

    cena.time.delayedCall(500, ()=>{
        if(!boss || !boss.active){
            return;
        }
        inimigo_parar_flash_dano(boss);
        boss.invencibilidade = false;
        boss.pode_atacar = true;
    });
}

//so cuida da reacao imediata (parar de tomar dano, tocar a animacao de derrota).
//a continuacao de cada fase (proxima fase, tela de vitoria, etc.) fica a cargo da propria cena do boss.
export function boss_derrotado(cena, boss){
    inimigo_parar_flash_dano(boss);
    boss.derrotado = true;
    boss.invencibilidade = true;
    boss.pode_atacar = false;
    if(boss.body){
        boss.setVelocity(0);
    }
    if(boss.anims){
        boss.play(`${boss.nome}_derrotado`, true);
    }
}

export function inimigo_perseguindo(cena, inimigo){
    if(inimigo.nascendo){ //ainda no efeito de fadein de nascimento pela porta, nao persegue ainda
        return;
    }
    if(inimigo.atacando){
        inimigo.setVelocity(0);
        return;
    }
    if(inimigo.invencibilidade){
        return;
    }
    inimigo.distancia = Phaser.Math.Distance.Between(cena.jogador.x, cena.jogador.y, inimigo.x, inimigo.y);

    switch(inimigo.comportamento){
        case "agressivo":
            //percebe o jogador de longe e vai ate ele rapido
            comportamento_padrao(cena, inimigo, 2.4);
            break;
        case "tanque":
            //mais lento para perseguir, mas nao muito
            comportamento_padrao(cena, inimigo, 1.4);
            break;
        case "defensivo":
            comportamento_defensivo(cena, inimigo);
            break;
        default:
            comportamento_padrao(cena, inimigo, 2);
            break;
    }

}

//verifica se existe alguma barreira entre o inimigo e o jogador, bloqueando a linha de visao
function visao_bloqueada_por_barreira(cena, inimigo){
    if(!cena.barreiras || cena.barreiras.getLength() === 0){
        return false;
    }

    let linha_visao = new Phaser.Geom.Line(inimigo.x, inimigo.y, cena.jogador.x, cena.jogador.y);
    let bloqueada = false;

    cena.barreiras.children.iterate((barreira)=>{
        if(bloqueada || !barreira || !barreira.active || !barreira.body){
            return;
        }

        let area_barreira = new Phaser.Geom.Rectangle(
            barreira.body.x,
            barreira.body.y,
            barreira.body.width,
            barreira.body.height
        );

        if(Phaser.Geom.Intersects.LineToRectangle(linha_visao, area_barreira)){
            bloqueada = true;
        }
    });

    return bloqueada;
}

//comportamento usado por inimigos agressivos e tanque: perseguem o jogador dentro do alcance de visao
function comportamento_padrao(cena, inimigo, multiplicador_velocidade){

    let alcance_perseguicao = inimigo.visao;

    //perdeu o jogador de vista, desiste da perseguicao
    if(inimigo.distancia > alcance_perseguicao * 1.3){
        inimigo.perseguindo = false;
        if(inimigo.skin === "cachorro" && cena.sfx_ligado){
            parar_sfx_cachorro(cena); //parou de perseguir, corta o latido na hora
        }
        return;
    }

    //enquanto nao esta perseguindo, uma barreira no caminho impede o inimigo de enxergar o jogador,
    //mesmo que esteja dentro do alcance de visao. se ja estiver perseguindo, a barreira nao atrapalha mais
    if(!inimigo.perseguindo && visao_bloqueada_por_barreira(cena, inimigo)){
        return;
    }

    if(inimigo.distancia > 70 && inimigo.distancia <= alcance_perseguicao){
        inimigo.perseguindo = true;

        let alvo_x = cena.jogador.x;
        let alvo_y = cena.jogador.y;

        //cena com cercar ligado: cada inimigo tem uma posicao fixa e igualmente espaçada no circulo ao redor do jogador,
        //formando um cerco real em vez de todos miraram pontos aleatorios (e possivelmente amontoados do mesmo lado)
        if(cena.inimigos_cercam){
            let angulo_cerco = (inimigo.indice_cerco / cena.quantidade_inimigos) * Phaser.Math.PI2;

            let raio_cerco = 70;
            alvo_x = cena.jogador.x + Math.cos(angulo_cerco) * raio_cerco;
            alvo_y = cena.jogador.y + Math.sin(angulo_cerco) * raio_cerco;
        }

        cena.physics.moveTo(inimigo, alvo_x, alvo_y, inimigo.velocidade * multiplicador_velocidade);
        separar_inimigos(cena, inimigo);
        inimigo.play(`${inimigo.skin}_andando`, true).setFlipX(inimigo.olhando);

        //cachorro rosna enquanto anda e late enquanto persegue (perseguindo == andando atras do jogador)
        if(inimigo.skin === "cachorro" && cena.sfx_ligado){
            let agora = cena.time.now;
            if(!inimigo.proximo_latido || agora >= inimigo.proximo_latido){
                parar_sfx_cachorro(cena); //corta o rosnado/choro na hora, pra nao tocar junto com o latido
                let latidos = ["latindo_1", "latindo_2", "latindo_3", "latindo_4"];
                let latido = Phaser.Utils.Array.GetRandom(latidos);
                cena.sound.play(latido);
                inimigo.proximo_latido = agora + Phaser.Math.Between(1500, 3000);
            }
        }
    }

    if(inimigo.distancia <= 70){
        preparar_ataque(cena, inimigo);
    }
}

//comportamento do inimigo defensivo: evita o jogador, so parte para o ataque se for provocado
function comportamento_defensivo(cena, inimigo){

    let jogador_atacou = cena.ataque && inimigo.distancia <= inimigo.visao;
    let aliado_atacando = false;

    cena.inimigos.children.iterate((outro)=>{
        if(!outro || outro === inimigo){
            return;
        }
        if(outro.atacando){
            let distancia_aliado = Phaser.Math.Distance.Between(inimigo.x, inimigo.y, outro.x, outro.y);
            if(distancia_aliado <= 250){
                aliado_atacando = true;
            }
        }
    });

    let contato_muito_proximo = inimigo.distancia <= 70;

    if(jogador_atacou || aliado_atacando || contato_muito_proximo){
        inimigo.provocado = true;
        cena.time.delayedCall(3000, ()=>{
            inimigo.provocado = false;
        });
    }

    //provocado: se comporta como um inimigo padrao, indo pra cima do jogador
    if(inimigo.provocado || contato_muito_proximo){
        if(inimigo.distancia > 70 && inimigo.distancia <= inimigo.visao * 1.5){
            inimigo.perseguindo = true;
            cena.physics.moveToObject(inimigo, cena.jogador, inimigo.velocidade * 1.8);
            separar_inimigos(cena, inimigo);
            inimigo.play(`${inimigo.skin}_andando`, true).setFlipX(inimigo.olhando);
        }

        if(contato_muito_proximo){
            preparar_ataque(cena, inimigo);
        }
        return;
    }

    //nao provocado: mantem distancia do jogador
    if(inimigo.distancia < inimigo.visao){
        inimigo.perseguindo = true;

        let angulo = Phaser.Math.Angle.Between(cena.jogador.x, cena.jogador.y, inimigo.x, inimigo.y);
        inimigo.setVelocity(
            Math.cos(angulo) * inimigo.velocidade,
            Math.sin(angulo) * inimigo.velocidade
        );
        separar_inimigos(cena, inimigo); //evita que varios inimigos defensivos fujam empilhados um no outro

        inimigo.olhando = cena.jogador.x < inimigo.x; //continua de olho no jogador
        inimigo.play(`${inimigo.skin}_andando`, true).setFlipX(inimigo.olhando);
    }
    else{
        inimigo.perseguindo = false;
        //nao forca mais velocidade 0 nem a animacao parada aqui: deixa o timer de
        //movimento (inimigo_andando) cuidar do inimigo, igual acontece com os outros
        //comportamentos, assim ele anda livremente quando nao esta fugindo/perseguindo
    }
}

//afasta inimigos que estao se sobrepondo enquanto perseguem o jogador
function separar_inimigos(cena, inimigo){
    cena.inimigos.children.iterate((outro) => {

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
}

//para o inimigo e agenda o inicio do ataque, depois de um tempinho fixo de reacao
function preparar_ataque(cena, inimigo){
    if(inimigo.esperando_ataque || inimigo.atacando){
        return;
    }

    inimigo.setVelocity(0);
    inimigo.play(`${inimigo.skin}_parado`, true).setFlipX(inimigo.olhando);
    inimigo.esperando_ataque = true;

    if(inimigo.skin === "cachorro" && cena.sfx_ligado){
        parar_sfx_cachorro(cena); //vai atacar (morder), corta o latido na hora
    }

    //nas cenas com cerco ligado (prisao) os inimigos reagem mais rapido, fica mais dificil escapar do circulo
    let tempo_reacao = cena.inimigos_cercam? 400: 500;

    cena.time.delayedCall(tempo_reacao, ()=>{ //tempo de reacao antes do inimigo atacar
        inimigo.esperando_ataque = false;
        ataque_inimigo(cena, inimigo);
    });
}

export function ataque_inimigo(cena, inimigo){
    if(!inimigo.pode_atacar || inimigo.atacando){
        return;
    }
    if(inimigo.invencibilidade){
        return;
    }
    inimigo.atacando = true;
    inimigo.pode_atacar = false;

    inimigo.setVelocity(0);
    

    if(inimigo.skin === "rick" || inimigo.skin === "stella" || inimigo.skin === "cachorro"){
        inimigo.golpe = 1;
    }
    else if(inimigo.skin === "william"){
        inimigo.golpe = Phaser.Math.Between(1,2);
    }
    else{
        inimigo.golpe = Phaser.Math.Between(1,3);
    }

    let animacao_golpe = `${inimigo.skin}_golpe_${inimigo.golpe}`;
    inimigo.play(animacao_golpe).setFlipX(inimigo.olhando);

    //depois de um tempinho fixo, a hitbox do golpe liga
    cena.time.delayedCall(200, ()=>{
        //se o inimigo tomou dano nesse meio tempo (ataque foi cancelado) ou morreu, nao liga a hitbox
        if(!inimigo.active || inimigo.invencibilidade || inimigo.hp <= 0){
            return;
        }
        inimigo.area_ataque.body.enable = true;
    });

    let tempo

    if(inimigo.skin === "linus" && inimigo.golpe === 2){
        tempo = 2000;
    }
    else{
        //nas cenas com cerco ligado (prisao) os inimigos atacam bem mais rapido
        tempo = 600;
    }
    
    cena.time.delayedCall(tempo, ()=>{
        if(!inimigo.active || inimigo.hp <= 0){
            return;
        }
        inimigo.area_ataque.body.enable = false;
        inimigo.pode_atacar = true;
        inimigo.atacando = false;
        if(!inimigo.invencibilidade){
            inimigo.play(`${inimigo.skin}_parado`).setFlipX(inimigo.olhando);
        }
        inimigo_perseguindo(cena, inimigo);
    });
}

function dano_inimigo(cena, inimigo){
    //inimigos tanque batem mais forte, para compensar a lentidao
    let bonus = inimigo.comportamento === "tanque"? 1.25 : 1;

    //buff de defesa multiplica a defesa do jogador (BUFF_DEFESA_MULT), sempre arredondado pra numero inteiro
    let defesa = cena.buff_defesa? Math.round(cena.jogador.defesa * 2) : cena.jogador.defesa;

    let dano = Math.floor(Math.max(1, (inimigo.ataque * bonus) * (100/ (100+ defesa))));

    return dano;
}

//FANTASMA !!!

// const MAX_FANTASMAS = 2;
// const ESPACO_MINIMO_FANTASMAS = 150;

export function agendar_fantasma(cena, min_y, max_y, escala, velocidade){
    cena.fantasmas = [];

    agendar_proximo_fantasma(cena, min_y, max_y, escala, velocidade);
}

function agendar_proximo_fantasma(cena, min_y, max_y, escala, velocidade){
    //delay curto e independente: nao espera nenhum fantasma sumir pra tentar nascer outro

    let delay = Phaser.Math.Between(2500, 5500);

    cena.time.delayedCall(delay, ()=>{
        tentar_spawnar_fantasma(cena, min_y, max_y, escala, velocidade);

        //sempre reagenda a proxima tentativa, independente de ter nascido fantasma ou nao

        agendar_proximo_fantasma(cena, min_y, max_y, escala, velocidade);
    });
}

function tentar_spawnar_fantasma(cena, min_y, max_y, escala, velocidade){
    let vagas = 2 - cena.fantasmas.length;

    if(vagas <= 0){
        return;
    }


    let quantidade = (vagas >= 2 && Phaser.Math.Between(1, 100) <= 35) ? 2 : 1;

    let posicoes_desta_leva = [];

    for(let i = 0; i < quantidade; i++){
        let posicao_y = gerar_posicao_y_fantasma(cena, min_y, max_y, posicoes_desta_leva);

        if(posicao_y === null){
            continue;
        }

        posicoes_desta_leva.push(posicao_y);
        criar_fantasma(cena, min_y, max_y, escala, velocidade, posicao_y);
    }
}

function gerar_posicao_y_fantasma(cena, min_y, max_y, posicoes_desta_leva){
    let tentativas = 10;

    while(tentativas > 0){
        let candidato = Phaser.Math.Between(min_y, max_y);

        let ocupados = cena.fantasmas.map(fantasma => fantasma.y_base).concat(posicoes_desta_leva);

        let livre = ocupados.every(y => Math.abs(y - candidato) >= 150);

        if(livre){
            return candidato;
        }

        tentativas--;
    }

    return null;
}

export function criar_fantasma(cena, min_y, max_y, escala, velocidade, posicao_y){
    if(posicao_y === undefined){
        posicao_y = Phaser.Math.Between(min_y, max_y);
    }

    let posicao_x = cena.physics.world.bounds.right - 50; //nasce dentro do mapa, na borda direita

    let fantasma = cena.physics.add.sprite(posicao_x, posicao_y, "fantasma").setScale(escala).setFlipX(true).setAlpha(0.7);

    body_fantasma(fantasma);

    fantasma.body.setAllowGravity(false);
    fantasma.setImmovable(true);
    fantasma.setVelocityX(-velocidade);

    fantasma.y_base = posicao_y;
    fantasma.zigzag_amplitude = Phaser.Math.Between(40, 80);
    fantasma.zigzag_velocidade = 0.002;

    fantasma.dano = 15;

    cena.fantasmas.push(fantasma);

    cena.physics.add.overlap(cena.area_dano, fantasma, ()=>{
        fantasma_tocando_jogador(cena, fantasma);
    });
}

function body_fantasma(fantasma){
    fantasma.setBodySize(fantasma.width/2, fantasma.height/2);
}

export function fantasma_update(cena){
    if(!cena.fantasmas || cena.fantasmas.length === 0){
        return;
    }

    //percorre de tras pra frente pra poder remover da lista sem bagunçar os indices

    for(let i = cena.fantasmas.length - 1; i >= 0; i--){
        let fantasma = cena.fantasmas[i];

        if(!fantasma.active){
            cena.fantasmas.splice(i, 1);
            continue;
        }

        //zigue-zague: oscila o y em volta do y_base usando seno, tipo uma funcao de onda

        fantasma.y = fantasma.y_base + Math.sin(cena.time.now * fantasma.zigzag_velocidade) * fantasma.zigzag_amplitude;

        fantasma.setDepth(fantasma.y);

        //quando ele chega no comeco do mapa, so remove ele (o proximo nascimento ja esta agendado de forma independente)

        if(fantasma.x <= cena.physics.world.bounds.left - 50){
            fantasma.destroy();
            cena.fantasmas.splice(i, 1);
        }
    }
}

function fantasma_tocando_jogador(cena, fantasma){
    if(cena.jogador.invencibilidade || cena.jogador.derrotado){
        return;
    }

    cena.jogador.setTint(0xff0000);
    cena.jogador.hits++;
    cena.jogador.play(cena.genero === "feminino"? "ramona_machucada": "scott_machucado").setFlipX(cena.jogador_olhando);
    cena.jogador.setVelocity(0);
    cena.jogador.invencibilidade = true;
    cena.machucado = true;

    //dano fixo do fantasma (nao passa pela formula de defesa dos outros inimigos)

    cena.jogador.hp_atual -= fantasma.dano;
    atualizar_barra_hp(cena);

    if(cena.jogador.hp_atual <= 0){
        jogador_derrotado(cena);
        return;
    }

    cena.time.delayedCall(500, ()=>{
        cena.pode_atacar = true;
        cena.machucado = false;
        cena.ataque = false;
        cena.time.delayedCall(1000, ()=>{
            cena.jogador.clearTint();
            cena.jogador.invencibilidade = false;
            movimento_jogador(cena);
        })
    })
}

//FUNCOES DAS LATAS !!!

export function animacoes_latas(cena){
    if(!cena.anims.exists("lata_1_batendo")){
        animacoes(cena, "lata_1_batendo", "lata_1", 3, 10, 0);
    }
    if(!cena.anims.exists("lata_1_quebrada")){
        animacoes(cena, "lata_1_quebrada", "lata_1", 6, 10, 0);
    }
    
    if(!cena.anims.exists("lata_2_batendo")){
        animacoes(cena, "lata_2_batendo", "lata_2", 3, 10, 0);
    }

    if(!cena.anims.exists("lata_2_quebrada")){
        animacoes(cena, "lata_2_quebrada", "lata_2", 7, 10, 0);
    }
    
    
}

export function latas_update(cena){
    cena.latas.children.iterate((lata)=>{
        lata.setDepth(lata.body.y);
    })
}

export function criar_latas(cena, quantidade_min, quantidade_max, min_x, max_x, min_y, max_y){

    cena.latas = cena.physics.add.group();

    let quantidade = Phaser.Math.Between(quantidade_min, quantidade_max);

    for (let i = 0; i<quantidade; i++){
        let lata = cena.physics.add.sprite(0, 0);

        lata.skin = Phaser.Math.Between(1,2);

        switch(lata.skin){
            case 1:
                lata.setTexture("lata_1").setScale(0.2);
                lata.hp = 50;
                lata.defesa = 10;
                break;
            case 2:
                lata.setTexture("lata_2").setScale(0.25);
                lata.hp = 40;
                lata.defesa = 8;
                break;
        }

        lata.foi_atacada = false;
        lata.tipo = "lata";

        posicionar_lata(cena, lata, min_x, max_x, min_y, max_y);

        criar_body_lata(lata);
        
        criar_hitbox_lata(cena, lata);

        lata.setPushable(false);
        lata.setImmovable(true);

        cena.latas.add(lata);
    }
}

function criar_body_lata(lata){
    lata.body.setSize(150,80);
    lata.body.setOffset(lata.skin === 1? 140: 100, lata.skin === 1? 350:250);
}

function posicionar_lata(cena, lata, min_x, max_x, min_y, max_y){
    let pode_posicionar = false; //verifica se pode colocar a lata ali

    let posicao_x;
    let posicao_y;

    let tentativas = 0;
    
    while(!pode_posicionar && tentativas<100 ){

        tentativas++; 

        posicao_x = Phaser.Math.Between(min_x, max_x);
        posicao_y = Phaser.Math.Between(1,2);
        posicao_y = posicao_y === 1? min_y:max_y 

        pode_posicionar = true;

        cena.latas.children.iterate((lata)=>{

            if(!lata){
                return;
            }

            let distancia = Phaser.Math.Distance.Between(
                posicao_x,
                posicao_y,
                lata.x,
                lata.y
            );

            if(distancia < 100){
                pode_posicionar = false;
            }

        });

        cena.barreiras.children.iterate((barreira)=>{

            if(!barreira){
                return;
            }

            let distancia = Phaser.Math.Distance.Between(
                posicao_x,
                posicao_y,
                barreira.x,
                barreira.y
            );

            if(distancia < 150){
                pode_posicionar = false;
            }

        });

        //impede que a lixeira nasca em cima da area de spawn dos inimigos (portas do mapa 2)
        if(cena.portas_mapa_2){
            cena.portas_mapa_2.forEach((porta)=>{

                if(!porta){
                    return;
                }

                let distancia = Phaser.Math.Distance.Between(
                    posicao_x,
                    posicao_y,
                    porta.x,
                    porta.y
                );

                if(distancia < 200){
                    pode_posicionar = false;
                }

            });
        }
        //impede que a lixeira nasca em cima de um buraco
        if(ponto_dentro_de_algum_buraco(cena, posicao_x, posicao_y, 60)){
            pode_posicionar = false;
        }
    }

    lata.setPosition(posicao_x, posicao_y);
}


function criar_hitbox_lata(cena, lata){
    lata.area_dano = cena.add.zone(lata.x, lata.y, 30, 30);
    cena.physics.world.enable(lata.area_dano);
    lata.area_dano.body.setAllowGravity(false);

}

export function lata_overlap(cena){
    cena.latas.children.iterate((lata)=>{
        cena.physics.add.overlap(cena.area_ataque, lata.area_dano, ()=>{
            if(lata.foi_atacada){
                return;
            }
            if(!cena.area_ataque.body.enable){
                return;
            }
            //o inimigo sempre tem prioridade: se tiver um inimigo dentro da area de ataque
            //junto com a lata, quem toma o dano e o inimigo, mesmo que a lata
            //tenha "recebido" o overlap primeiro nesse frame
            if(inimigo_na_area_ataque(cena)){
                return;
            }
            // cena.lata_atingida(lata);
            verifica_ataque(cena, lata);
        }, null, cena);
    })
}

function lata_atingida(cena, lata){
    lata.foi_atacada = true;
    cena.area_ataque.body.enable = false;
    lata.play(`lata_${lata.skin}_batendo`);
    cena.sound.play("quebrando");
    if(lata.hp<=0){
        lata_quebrada(cena, lata);
        return;
    }

    lata.once(`animationcomplete-lata_${lata.skin}_batendo`, ()=>{
        lata.foi_atacada = false;
        lata.setFrame(0);
    })

}

function lata_quebrada(cena, lata){
    atualizar_pontuacao(cena, 20);
    lata.play(`lata_${lata.skin}_quebrada`);
    cena.sound.play("quebrado");
    lata.once(`animationcomplete-lata_${lata.skin}_quebrada`, ()=>{
        lata.chance_dropar_item = Phaser.Math.Between(1,4);

        lata.chance_dropar_item = lata.chance_dropar_item > 1? true: false;

        if(lata.chance_dropar_item){
            let tipo = tipo_de_item();
            let item = criar_itens(cena, tipo);
            cena.itens.add(item);
            item.setPosition(lata.x, lata.y < 600? lata.y + 20: lata.y);
        }
        cena.latas.remove(lata);
        if(lata.area_dano){
            lata.area_dano.destroy();
        }
        lata.destroy();

    })
}

//FUNÇÕES DOS ITENS !!!

function criar_itens(cena, tipo){

    // cena.itens = cena.physics.add.group();

    let item = cena.physics.add.sprite(0, 0);
    item.tipo = tipo;

    let skin;

    switch(item.tipo){
        case "agua":
            skin = Phaser.Math.Between(1,4);
            item.setTexture(`agua_${skin}`);
            item.cura = Phaser.Math.Between(1,5);
            item.pontos = 10;
            break;
        case "comida_fraca":
            skin = Phaser.Math.Between(1,18);
            item.setTexture(`comida_fraca_${skin}`);
            item.cura = Phaser.Math.Between(5,10);
            item.pontos = 20;
            break;
        case "comida":
            skin = Phaser.Math.Between(1,30);
            item.setTexture(`comida_${skin}`);
            item.cura = Phaser.Math.Between(10,20);
            item.pontos = 30;
            break;
        case "mel":
            skin = Phaser.Math.Between(1,10);
            item.setTexture(`mel_${skin}`);
            item.cura = Phaser.Math.Between(20,50);
            item.pontos = 50;
            break;
        case "torta":
            skin = Phaser.Math.Between(1,3);
            item.setTexture(`torta_${skin}`);
            item.cura = 50;
            item.pontos = 100;
            break;
        case "veneno":
            skin = Phaser.Math.Between(1,3);
            item.setTexture(`veneno_${skin}`);
            item.cura = Phaser.Math.Between(-5,-3);
            item.pontos = -10
            break;
        case "moeda":
            skin = Phaser.Math.Between(1,3);
            item.setTexture(`moeda_${skin}`);
            item.cura = 0;
            item.pontos = Phaser.Math.Between(100, 1000);
            break;
        case "pocao_regeneracao":
            item.setTexture("pocao_regeneracao");
            item.cura = Phaser.Math.Between(5,10);
            item.pontos = 50;
            break;
        case "pocao_ataque":
            item.setTexture("pocao_ataque");
            item.cura = 0;
            item.pontos = 50;
            break;
        case "pocao_defesa":
            item.setTexture("pocao_defesa");
            item.cura = 0;
            item.pontos = 50;
            break;
        case "pocao_velocidade":
            item.setTexture("pocao_velocidade");
            item.cura = 0;
            item.pontos = 50;
            break;
    }

    item.setScale(0.2);
    item.setBodySize(item.width, item.height);

    return item;
}

function tipo_de_item(){


    let tipo_item = Phaser.Math.Between(1,100);

    if(tipo_item >=1 && tipo_item <= 20){
        return'agua'; //agua_1 ate agua_4
    }
    else if(tipo_item>20 && tipo_item<=39){
        return 'comida_fraca'; //comida_fraca_1 ate 18
    }
    else if(tipo_item>30 && tipo_item<=45){
        return 'veneno'; //veneno_1 ate 4
    }
    else if(tipo_item >45 && tipo_item <=58){
        return 'moeda'; //moeda_1 ate 3
    }

    else if(tipo_item >58 && tipo_item <=68){
        return 'comida'; //comida_1 ate 30
    }
    else if(tipo_item >68 && tipo_item <=73){
        return 'pocao_regeneracao'; //regeneracao
    }
    else if(tipo_item >73 && tipo_item <=78){
        return 'pocao_ataque'; //ataque
    }
    else if(tipo_item >78 && tipo_item <=83){
        return 'pocao_defesa'; //defesa
    }
    else if(tipo_item >83 && tipo_item <=88){
        return 'pocao_velocidade'; //velocidade
    }
    else if(tipo_item >88 && tipo_item <=95){
        return 'mel'; //mel_1 ate 8
    }
    else if(tipo_item >95 && tipo_item <=100){
        return 'torta'; //torta_1 ate 3
    }
    else{
        return 'moeda';
    }
}

export function interagindo_com_item(cena, item){
    cena.jogador.hp_atual += item.cura;
    if(cena.jogador.hp_atual > cena.jogador.hp_total){
        cena.jogador.hp_atual = cena.jogador.hp_total;
    }
    atualizar_barra_hp(cena);
    atualizar_pontuacao(cena, item.pontos);
    criar_buff_e_debuff(cena, item);
    tocar_sfx_item(cena, item);
    destruir_item(cena, item);
}

//toca o sfx de acordo com a categoria do item coletado (cura, buff, pontos ou veneno)
function tocar_sfx_item(cena, item){
    let sfx;

    switch(item.tipo){
        case "agua":
        case "comida_fraca":
        case "comida":
        case "mel":
        case "torta":
            sfx = "cura";
            break;
        case "pocao_ataque":
        case "pocao_defesa":
        case "pocao_velocidade":
        case "pocao_regeneracao":
            sfx = "buff";
            break;
        case "moeda":
            sfx = "pontos";
            break;
        case "veneno":
            sfx = "veneno";
            break;
        default:
            return;
    }

    if(cena.sfx_ligado){
        cena.sound.play(sfx);
    }
}

function destruir_item(cena, item){
    cena.itens.remove(item);
    item.destroy();
}

//FUNÇÕES DOS EFEITOS!!! 

export function efeitos(cena){
    //limpa os timers (setInterval) e os eventos de uma partida anterior
    //sem isso, quando o jogo reinicia, os intervalos continuam rodando escondidos e os efeitos "nao acabam nunca"
    if(cena.buff_ataque_timer){
        clearInterval(cena.buff_ataque_timer);
    }
    if(cena.buff_defesa_timer){
        clearInterval(cena.buff_defesa_timer);
    }
    if(cena.buff_velocidade_timer){
        clearInterval(cena.buff_velocidade_timer);
    }
    if(cena.buff_regeneracao_timer){
        clearInterval(cena.buff_regeneracao_timer);
    }
    if(cena.buff_regeneracao_cura){
        cena.buff_regeneracao_cura.remove();
    }
    if(cena.debuff_envenenado_timer){
        clearInterval(cena.debuff_envenenado_timer);
    }
    if(cena.debuff_veneno_dano){
        cena.debuff_veneno_dano.remove();
    }

    //remove qualquer icone de buff/debuff que tenha ficado na tela da partida anterior
    const container_efeitos = document.getElementById("efeitos");
    if(container_efeitos){
        container_efeitos.innerHTML = "";
    }

    cena.buff_ataque = false;
    cena.buff_ataque_timer = null;

    cena.buff_defesa = false;
    cena.buff_defesa_timer = null;

    cena.buff_velocidade = false;
    cena.buff_velocidade_timer = null;

    cena.buff_regeneracao = false;
    cena.buff_regeneracao_timer = null;
    cena.buff_regeneracao_cura = null;

    cena.debuff_envenenado = false;
    cena.debuff_envenenado_timer = null;
    cena.debuff_veneno_dano = null;
}

//ESCURIDAO / LANTERNA DO JOGADOR (estilo halloween) !!!

// export const DIAMETRO_LUZ_JOGADOR = 500; //diametro do circulo de luz em px. Mude esse valor aqui se quiser aumentar/diminuir a area visivel.

function criar_textura_luz(cena, diametro){
    const chave = `luz_circulo_${diametro}`;

    //evita gerar a mesma textura de novo se a cena reiniciar

    if(cena.textures.exists(chave)){
        return chave;
    }

    const raio = diametro / 2;
    const textura = cena.textures.createCanvas(chave, diametro, diametro);
    const ctx = textura.getContext();

    //gradiente radial: centro solido e borda esmaecendo, pra nao ficar um circulo com contorno duro

    const gradiente = ctx.createRadialGradient(raio, raio, raio * 0.4, raio, raio, raio);
    gradiente.addColorStop(0, "rgba(255,255,255,1)");
    gradiente.addColorStop(0.8, "rgba(255,255,255,1)");
    gradiente.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, diametro, diametro);

    textura.refresh();

    return chave;
}

export function criar_escuridao(cena, diametro = 500, cor = 0x050208){
    const largura = cena.scale.width;
    const altura = cena.scale.height;

    cena.diametro_luz = diametro; //guarda na cena pra dar pra mudar em tempo real se quiser (cena.diametro_luz = 300, por exemplo)
    cena.cor_escuridao = cor; //cor do "breu". Deixei um preto arroxeado ao inves de preto puro, fica com mais cara de halloween
    cena.chave_luz = criar_textura_luz(cena, diametro);

    //RenderTexture cobrindo a tela toda, fixa na camera (scrollFactor 0) e por cima de tudo (depth alto)

    cena.escuridao = cena.add.renderTexture(0, 0, largura, altura).setOrigin(0, 0);
    cena.escuridao.setScrollFactor(0);
    cena.escuridao.setDepth(9999);

    //se o jogo redimensionar a tela (modo RESIZE), acompanha o novo tamanho

    cena.scale.on("resize", (tamanho)=>{
        if(cena.escuridao){
            cena.escuridao.setSize(tamanho.width, tamanho.height);
        }
    });
}

export function atualizar_escuridao(cena){
    if(!cena.escuridao || !cena.jogador){
        return;
    }

    const cam = cena.cameras.main;

    //preenche a tela toda com o "breu"

    cena.escuridao.clear();
    cena.escuridao.fill(cena.cor_escuridao, 1);

    //posicao do jogador NA TELA (nao no mundo), é onde vamos "furar" o buraco de luz

    const x_tela = (cena.jogador.x - cam.scrollX) * cam.zoom;
    const y_tela = (cena.jogador.y - cam.scrollY) * cam.zoom;

    //erase usa blend mode ERASE: apaga o alpha da render texture nesse ponto, revelando o jogo por baixo

    cena.escuridao.erase(cena.chave_luz, x_tela - cena.diametro_luz / 2, y_tela - cena.diametro_luz / 2);
}

function criar_efeitos_no_dom(nome, tipo, efeito, alt, duracao, mensagem){
    const hud_efeitos = document.createElement("div");
    hud_efeitos.className = "efeitos";
    hud_efeitos.id = nome;

    const imagem_efeito = document.createElement("img");
    imagem_efeito.className = "icone_efeitos";
    imagem_efeito.src = `assets/conteudo/${tipo}/${efeito}.png`;
    imagem_efeito.alt = alt;

    let efeito_duracao = document.createElement("p");
    efeito_duracao.className = "duracao";
    efeito_duracao.innerHTML = duracao;

    let balao_efeitos = document.createElement("div");
    balao_efeitos.className = "balao";
    balao_efeitos.style.display = "none";


    let balao_triangulo = document.createElement("div");
    balao_triangulo.className = "triangulo";

    let conteudo_do_balao = document.createElement("div");
    // conteudo_do_balao.className = "conteudo_balao";
    conteudo_do_balao.classList.add("conteudo_balao");
    conteudo_do_balao.classList.add("pixel-borders");
    conteudo_do_balao.classList.add("pixel-borders--3");

    let texto_balao = document.createElement("p");
    texto_balao.innerHTML = mensagem;

    conteudo_do_balao.append(texto_balao);
    balao_efeitos.append(balao_triangulo, conteudo_do_balao);
    hud_efeitos.append(imagem_efeito, efeito_duracao, balao_efeitos);

    hud_efeitos.addEventListener("mouseenter", ()=>{
        balao_efeitos.style.display = "flex";
    })

    hud_efeitos.addEventListener("mouseleave", ()=>{
        balao_efeitos.style.display = "none";
    })

    const container_efeitos = document.getElementById("efeitos");

    container_efeitos.append(hud_efeitos);

    texto_efeitos();

    return{
        elemento: hud_efeitos,
        texto_duracao:efeito_duracao
    };

}

function criar_buff_e_debuff(cena, item){
    let efeito;
    switch(item.tipo){
        case "pocao_ataque":
            if(cena.buff_ataque){
                return;
            }
            cena.buff_ataque = true;
            efeito = criar_efeitos_no_dom("ataque", "Buffs", "ataque", "Buff de ataque", "60s", "<u>+&nbsp;Ataque</u><br><br>Violência sempre é a resposta!" );
            cena.buff_ataque_timer = criar_timer(60, efeito.texto_duracao, efeito.elemento, ()=>{
                cena.buff_ataque = false;
                // document.getElementById("ataque")
            })
            break;
        case "pocao_defesa":
            if(cena.buff_defesa){
                return;
            }
            cena.buff_defesa = true;
            efeito = criar_efeitos_no_dom("defesa", "Buffs", "defesa", "Buff de defesa", "60s", "<u>+&nbsp;Defesa</u><br><br>Os golpes agora machucam um tiquinho menos." );
            cena.buff_defesa_timer = criar_timer(60, efeito.texto_duracao, efeito.elemento, ()=>{
                cena.buff_defesa = false;
            })
            break;
        case "pocao_velocidade":
            if(cena.buff_velocidade){
                return;
            }
            cena.buff_velocidade = true;
            efeito = criar_efeitos_no_dom("velocidade", "Buffs", "velocidade", "Buff de velocidade", "60s", "<u>+&nbsp;Velocidade</u><br><br>Você agora corre perceptivelmente mais rápido." );
            cena.buff_velocidade_timer = criar_timer(60, efeito.texto_duracao, efeito.elemento, ()=>{
                cena.buff_velocidade = false;
            })
            break;
        case "pocao_regeneracao":
            if(cena.buff_regeneracao){

                return;
            }
            cena.buff_regeneracao = true;
            cena.buff_regeneracao_cura = cena.time.addEvent({
                delay:2000,
                callback:()=>{
                    cena.jogador.hp_atual += 2
                    if(cena.jogador.hp_atual >=50){
                        cena.jogador.hp_atual = 50;
                    }
                    atualizar_barra_hp(cena);
                },
                callbackScope:cena,
                loop:true
            })
            efeito = criar_efeitos_no_dom("regeneracao", "Buffs", "regeneracao", "Buff de regeneracao", "60s", "<u>Regenereção</u><br><br> Você se sente extremamente saudavel. +2hp a cada 2 segundos!" );
            cena.buff_regeneracao_timer = criar_timer(35, efeito.texto_duracao, efeito.elemento, ()=>{
                cena.buff_regeneracao = false;
                if(cena.buff_regeneracao_cura){
                    cena.buff_regeneracao_cura.remove();
                    cena.buff_regeneracao_cura = null;
                }
            })
            break;
        case "veneno":
        
            if(cena.debuff_envenenado){
                return;
            }
            cena.debuff_envenenado = true;
            cena.debuff_veneno_dano = cena.time.addEvent({
                delay:2000,
                callback:()=>{
                    if(cena.jogador.derrotado){
                        return;
                    }

                    cena.jogador.hp_atual -=2
                    atualizar_barra_hp(cena);

                    if(cena.jogador.hp_atual <=0){
                        jogador_derrotado(cena);
                        return;
                    }

                    //faz o jogador reagir como se tivesse tomado um golpe a cada tick de dano do veneno
                    jogador_reagir_golpe(cena);
                },
                callbackScope:cena,
                loop:true
            })
            efeito = criar_efeitos_no_dom("veneno", "Debuffs", "envenenado", "Debuff de veneno", "15s", "<u>Envenenado</u><br><br>Você comeu algo que não devia e foi envenenado! Parabéns pela péssima decisão." );
            cena.debuff_envenenado_timer = criar_timer(15, efeito.texto_duracao, efeito.elemento, ()=>{
                cena.debuff_envenenado = false;
                if(cena.debuff_veneno_dano){
                    cena.debuff_veneno_dano.remove();
                    cena.debuff_veneno_dano = null;
                }
            })
            break;
        default:
            return;
    }
}

function criar_timer(duracao, texto_duracao, elemento, fim){

    let tempo = duracao
    texto_duracao.textContent = tempo + "s";

    let timer = setInterval(()=>{
        tempo--;
        texto_duracao.textContent = tempo + "s";
        if(tempo <=0){
            clearInterval(timer);
            elemento.remove();

            if(fim){
                fim();
            }
        }
    },1000)
    return timer;
}

function texto_efeitos(){
    let efeitos = document.querySelectorAll(".efeitos");

    efeitos.forEach(efeito=>{
        efeito.addEventListener("mouseenter",()=>{
            let balao = efeito.querySelector(".balao");
            balao.style.display = "flex";
        })

        efeito.addEventListener("mouseleave", ()=>{
            let balao = efeito.querySelector(".balao");
            balao.style.display = "none";
        })
    })  
}

//FUNÇÕES BARREIRAS!!!

export function animacao_barreiras(cena){
    if(!cena.anims.exists("barreira_atingida")){
        animacoes(cena, "barreira_atingida", "barreira", 2, 5, 0);
    }
    if(!cena.anims.exists("barreira_quebrada")){
        animacoes(cena, "barreira_quebrada", "barreira", 3, 5, 0);
    }
    


}

export function criar_barreira(cena, quantidade_min, quantidade_max, barreiras){

    cena.barreiras = cena.physics.add.group();
    let quantidade_barreiras = Phaser.Math.Between(quantidade_min, quantidade_max, 3);

    let posicoes_barreiras = barreiras

    for (let i = 0; i < quantidade_barreiras; i++) {

        let posicao_x = Phaser.Utils.Array.GetRandom(posicoes_barreiras);
        let deletar = posicoes_barreiras.indexOf(posicao_x);
        posicoes_barreiras.splice(deletar, 1);

        for (let j = 0; j < 4; j++) {
            let barreira = cena.physics.add.sprite( posicao_x,  450 + (j * 60), "barreira" );
            barreira.setScale(0.2);
            barreira.setPushable(false);
            barreira.setImmovable(true);
            

            barreira.hp = 30;
            barreira.defesa = 6;
            barreira.tipo = "barreira";


            // barreira.body.setSize(barreira.width/2, barreira.height/2);
            criar_body_barreira(barreira);

            barreira.foi_atingida = false;

            cena.barreiras.add(barreira);
        }
    }
}

function criar_body_barreira(barreira){
    barreira.body.setSize(400, 400);
    // barreira.body.setOffset(barreira.width/4, barreira.height/4);
}

//verifica se tem algum inimigo dentro da area de ataque do jogador no momento
//usado pra garantir que o inimigo sempre tem prioridade de dano sobre a barreira
function inimigo_na_area_ataque(cena){
    if(!cena.inimigos || cena.inimigos.getLength() === 0){
        return false;
    }

    let zonas_dano = cena.inimigos.getChildren()
        .filter(inimigo=> inimigo.area_dano)
        .map(inimigo=> inimigo.area_dano);

    if(zonas_dano.length === 0){
        return false;
    }

    return cena.physics.overlap(cena.area_ataque, zonas_dano);
}

export function overlap_barreira(cena){
    cena.physics.add.overlap(cena.area_ataque, cena.barreiras, (jogador, barreira)=>{
        if(barreira.foi_atingida){
            return;
        }
        //o inimigo sempre tem prioridade: se tiver um inimigo dentro da area de ataque
        //junto com a barreira, quem toma o dano e o inimigo, mesmo que a barreira
        //tenha "recebido" o overlap primeiro nesse frame
        if(inimigo_na_area_ataque(cena)){
            return;
        }
        verifica_ataque(cena, barreira);
    }, null, cena);
}

function batendo_barreira(cena, barreira){
    barreira.foi_atingida = true;
    if(barreira.hp <=0){
        barreira_destruida(cena, barreira);
        return;
    }
    barreira.play("barreira_atingida");
    cena.area_ataque.body.enable = false;
    barreira.once("animationcomplete-barreira_atingida",()=>{
        barreira.foi_atingida = false;
        barreira.setFrame(0);
    });

}
function barreira_destruida(cena, barreira){
    atualizar_pontuacao(cena, 10);
    barreira.body.enable = false; //desliga a colisao na hora, pra o jogador ja poder passar por ali
    barreira.play("barreira_quebrada");
    barreira.once("animationcomplete-barreira_quebrada",()=>{
        cena.barreiras.remove(barreira);
        barreira.destroy();
    })

    return;
    
}

export function botoes_morte(cena, mapa_atual){
    cena.scene.launch("Pausa", {
        mapa:mapa_atual,
        motivo: "morreu"
    })
}

export function pausa(cena, mapa_atual){
    cena.input.keyboard.on("keydown-P", ()=>{
        if(!cena.scene.isActive("Pausa")){
            cena.scene.launch("Pausa",{
                mapa:mapa_atual,
                motivo: "pausa"
            })
            cena.scene.pause();
        }
    })

    cena.input.gamepad.on("down",(pad, botao)=>{
        if(botao.index === 4){ //L1
            if(!cena.scene.isActive("Pausa")){
                cena.scene.launch("Pausa",{
                    mapa:mapa_atual,
                    motivo: "pausa"
                })
                cena.scene.pause();
            }
        }
    })
    
}

export function colliders(cena){

    //colisao com o inimigo e o jogador

    cena.physics.add.collider(cena.jogador, cena.inimigos); 

    //adicionando colisao nas barreiras do mapa

    cena.physics.add.collider(cena.jogador, cena.barreiras_mapa_1);
    cena.physics.add.collider(cena.inimigos, cena.barreiras_mapa_1);

    //colisao com as latas

    cena.physics.add.collider(cena.latas, cena.jogador);
    cena.physics.add.collider(cena.latas, cena.inimigos);

    //colisao com as barreiras obstaculos

    cena.physics.add.collider(cena.barreiras, cena.jogador);
    cena.physics.add.collider(cena.barreiras, cena.inimigos);
}

//MARCAÇOES!!!

export function marcacoes_1(cena){
    cena.entrar_boss = cena.add.rectangle(10000, 550, 100,500, 0x0000ff, 0);
    cena.physics.add.existing(cena.entrar_boss, true);

    cena.physics.add.collider(cena.inimigos, cena.entrar_boss);
}

export function marcacoes_2(cena){
    cena.porta_1 = cena.add.zone(1250, 470, 100, 30);
    cena.physics.world.enable(cena.porta_1);
    cena.porta_1.body.setAllowGravity(false);

    cena.porta_2 = cena.add.zone(2580, 470, 100, 30);
    cena.physics.world.enable(cena.porta_2);
    cena.porta_2.body.setAllowGravity(false);

    cena.portas_mapa_2 = [cena.porta_1, cena.porta_2];

    cena.fim = cena.add.zone(3780, 480, 100, 50);
    cena.physics.world.enable(cena.fim);
    cena.fim.body.setAllowGravity(false);
}

export function marcacoes_3(cena){
    cena.buraco_1 = cena.add.zone(1990, 680, 840, 80);
    cena.physics.world.enable(cena.buraco_1);
    cena.buraco_1.body.setAllowGravity(false);

    cena.buraco_2 = cena.add.zone(7730, 540, 940, 80);
    cena.physics.world.enable(cena.buraco_2);
    cena.buraco_2.body.setAllowGravity(false);

    cena.buraco_3 = cena.add.zone(9530, 600, 175, 60);
    cena.physics.world.enable(cena.buraco_3);
    cena.buraco_3.body.setAllowGravity(false);

    cena.buraco_4 = cena.add.zone(10000, 600, 480, 60);
    cena.physics.world.enable(cena.buraco_4);
    cena.buraco_4.body.setAllowGravity(false);
}

export function ir_boss(cena, marcacao, boss){
    cena.physics.add.overlap(marcacao, cena.jogador, ()=>{
        if(cena.cutscene){
            return;
        }
        cena.tempo = cena.time.now;
        cena.cutscene = true;
        cena.cameras.main.fadeOut(1000, 0,0,0);
        cena.cameras.main.once("camerafadeoutcomplete", ()=>{
            cena.scene.start(boss, {
                genero:cena.genero,
                skin:cena.skin,
                hp: cena.jogador.hp_atual,
                pontuacao: cena.jogador.pontuacao,
                inimigos_derrotados: cena.jogador.inimigos_derrotados,
                tempo:cena.tempo,
                hits:cena.jogador.hits,
                bonus:cena.bonus


            })
        })

    }, null, cena);
}

//PONTUACAO !!!

export function atualizar_pontuacao(cena, pontuacao){

    cena.jogador.pontuacao += pontuacao;

    if(!cena.pontuacao_exibida){
        cena.pontuacao_exibida = { valor: Number(cena.mostrar_pontuacao.innerHTML) || 0 };
    }

    cena.tweens.killTweensOf(cena.pontuacao_exibida);

    cena.tweens.add({
        targets: cena.pontuacao_exibida,
        valor: cena.jogador.pontuacao,
        duration: 1000,
        ease: "Linear",
        onUpdate:()=>{
            cena.mostrar_pontuacao.innerHTML = Math.floor(cena.pontuacao_exibida.valor);
        },
        onComplete:()=>{
            cena.mostrar_pontuacao.innerHTML = Math.floor(cena.jogador.pontuacao);
        }
    })
}


async function calcular_pontuacao(cena, inimigos, pontos, tempo, hits, mapa_atual) {
    // const tempo_total = Math.floor(tempo / 1000);

    const tempo_total = tempo;

    const pontos_inimigos = inimigos * 100;
    const pontos_parciais = pontos;

    const penalidade_tempo = Math.max(0, tempo_total - 150) * 10;

    let bonus_hits;
    let bonus_tempo;
    let bonus_pontos;

    // Bônus por hits
    if (hits === 0) {
        bonus_hits = 1;
    } 
    else if (hits < 5) {
        bonus_hits = 0.5;
    } 
    else if (hits < 10) {
        bonus_hits = 0.2;
    } 
    else {
        bonus_hits = 0;
    }

    // Bônus por tempo
    if (tempo_total < 300) {
        bonus_tempo = 0.1;
    }
    else if (tempo_total < 400) {
        bonus_tempo = 0.05;
    } 
    else if (tempo_total < 500) {
        bonus_tempo = 0.002;
    } 
    else {
        bonus_tempo = 0;
    }

    // Bônus por pontos
    if (pontos > 3000) {
        bonus_pontos = 0.1;
    }
    else if (pontos > 2000) {
        bonus_pontos = 0.05;
    } 
    else if (pontos >= 1500) {
        bonus_pontos = 0.02;
    } 
    else {
        bonus_pontos = 0;
    }

    const bonus_total = bonus_hits + bonus_pontos + bonus_tempo;

    let pontuacao_total = Math.max(300,pontos_inimigos + pontos_parciais - penalidade_tempo + 1500);

    pontuacao_total += pontuacao_total * bonus_total;

    //pega a pontuação salva no banco

    let mapa = mapa_atual

    switch(mapa){
        case "Boss_1":
            mapa = 1;
            break;
        case "Boss_2":
            mapa = 2;
            break;
        case "Boss_3":
            mapa = 3;
            break;
        default:
            mapa = 1;
            break;
    }

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const pontos_finais = Math.floor(pontuacao_total);

    if(!usuario || usuario.id === undefined){
        return pontos_finais;
    }

    let pontos_antigos_valor = 0;

    try{
        const pontos_antigos = await fetch(`http://192.168.0.10:8080/ranking/mapa${mapa}`);
        if(pontos_antigos.ok){
            const dados = await pontos_antigos.json();
            const encontrado = dados.find(item=> item.nome === usuario.nome);
            pontos_antigos_valor = encontrado ? encontrado.pontos : 0;
        }
    }
    catch(erro){
        pontos_antigos_valor = 0;
    }

    if(pontos_finais > pontos_antigos_valor){
        try{
            await fetch("http://192.168.0.10:8080/ranking/atualizar", {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    id:usuario.id,
                    pontos:pontos_finais,
                    mapa:mapa
                })
            });
        }
        catch(erro){
            return pontos_finais;
        }
    }

    return pontos_finais;
}


export async function mostrar_pontuacao(cena, inimigos_derrotados, pontuacao, tempo, hits, mapa){
    console.log("abriu");

    document.body.classList.add("fundo_preto");

    document.getElementById("menu_ganhou").style.display = "flex";
    

    // let tempo_segundos = tempo/1000;
    let tempo_segundos = Math.floor(tempo/1000);

    

    const mostrar_inimigos = document.getElementById("inimigos_derrotados");
    const mostrar_pontuacao = document.getElementById("pontos_obtidos");
    const mostrar_tempo = document.getElementById("tempo_total_fase");
    const mostrar_hits = document.getElementById("hits_tomados");
    const mostrar_pontuacao_total = document.getElementById("pontos_totais");

    let pontuacao_total;
    if(mapa === "Boss_1_online" || mapa === "Boss_2_online" || mapa === "Boss_3_online"){
        pontuacao_total = 0;
    }
    else{
        pontuacao_total =  await calcular_pontuacao(cena, inimigos_derrotados, pontuacao, tempo_segundos, hits, mapa);
    }
    
    mostrar_inimigos.innerHTML = "0";
    mostrar_pontuacao.innerHTML = "0";
    // mostrar_tempo.innerHTML = "00:00";
    mostrar_tempo.innerHTML = "0";
    mostrar_hits.innerHTML = "0";
    mostrar_pontuacao_total.innerHTML = "0";

    const contador_inimigo = { valor:0 };

    cena.tweens.add({
        targets:contador_inimigo,
        valor:inimigos_derrotados,
        duration:inimigos_derrotados * 50,
        ease:"Linear",
        onUpdate:()=>{
            mostrar_inimigos.innerHTML = Math.floor(contador_inimigo.valor);
        },
        onComplete:()=>{
            const contador_pontos = { valor: 0 };
            cena.tweens.add({
                targets:contador_pontos,
                valor: pontuacao,
                duration:pontuacao * 5,
                ease:"Linear",
                onUpdate:()=>{
                    mostrar_pontuacao.innerHTML = Math.floor(contador_pontos.valor);
                },
                onComplete:()=>{
                    const contador_tempo = { valor: 0 };
                    cena.tweens.add({
                        targets:contador_tempo,
                        valor:tempo_segundos,
                        duration: tempo_segundos * 10,
                        ease:"Linear",
                        onUpdate:()=>{
                            mostrar_tempo.innerHTML = Math.floor(contador_tempo.valor);
                        },
                        onComplete:()=>{
                            const contador_hits = { valor: 0 };
                            cena.tweens.add({
                                targets:contador_hits,
                                valor: hits,
                                duration:hits * 100,
                                ease:"Linear",
                                onUpdate:()=>{
                                    mostrar_hits.innerHTML = Math.floor(contador_hits.valor);
                                },
                                onComplete:()=>{
                                    const contador_total = { valor: 0 };
                                    cena.tweens.add({
                                        targets:contador_total,
                                        valor: pontuacao_total,
                                        duration: pontuacao_total * 1,
                                        ease:"Linear",
                                        onUpdate:()=>{
                                            mostrar_pontuacao_total.innerHTML = Math.floor(contador_total.valor);
                                        },
                                        onComplete:()=>{
                                            document.getElementById("jogar_novamente_ganhou").classList.add("seta_ganhou");
                                            cena.scene.launch("Pausa", {
                                                mapa: mapa,
                                                motivo: "ganhou"
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        
    })
}

export function tela_vitoria(cena, mapa_atual,inimigos_derrotados, pontuacao_parcial, tempo_total, quantidade_hits){
    
    cena.scene.launch("Pausa",{
        mapa:mapa_atual,
        motivo:"ganhou",
        inimigos: inimigos_derrotados,
        pontuacao:pontuacao_parcial,
        tempo:tempo_total,
        hits:quantidade_hits
    })
    cena.scene.pause();
}

//LASERS !!!

export function criar_lasers(cena, lasers, opcoes = {}){

    cena.lasers_opcoes = {
        cooldown_inicial: opcoes.cooldown_inicial ?? 1500, //tempo que o laser fica desligado
        intervalo_piscar: opcoes.intervalo_piscar ?? 200, //velocidade do piscar do indicador
        vezes_piscar: opcoes.vezes_piscar ?? 3, //quantas vezes o indicador pisca antes do laser ligar
        duracao_ativo: opcoes.duracao_ativo ?? 800, //quanto tempo o laser fica ligado (dando dano)
        dano_jogador: opcoes.dano_jogador ?? 15,
        dano_inimigo: opcoes.dano_inimigo ?? 40,
        dano_lata: opcoes.dano_lata ?? 999
    };

    cena.lasers = lasers.map((laser)=>{
        let novo_laser = {
            indicador: laser.indicador,
            corpo: laser.corpo,
            ativo: false,
            atingidos: new Set()
        };

        novo_laser.indicador.setVisible(false);
        novo_laser.corpo.setVisible(false);

        return novo_laser;
    });

    cena.lasers.forEach((laser)=>{
        iniciar_ciclo_laser(cena, laser);
    });
}

function iniciar_ciclo_laser(cena, laser){
    laser.ativo = false;
    laser.indicador.setVisible(false);
    laser.corpo.setVisible(false);
    laser.atingidos.clear();

    cena.time.delayedCall(cena.lasers_opcoes.cooldown_inicial, ()=>{
        piscar_laser(cena, laser, 0);
    });
}

function piscar_laser(cena, laser, vezes){

    if(vezes >= cena.lasers_opcoes.vezes_piscar){
        ativar_laser(cena, laser);
        return;
    }

    laser.indicador.setVisible(true);

    cena.time.delayedCall(cena.lasers_opcoes.intervalo_piscar, ()=>{
        laser.indicador.setVisible(false);

        cena.time.delayedCall(cena.lasers_opcoes.intervalo_piscar, ()=>{
            piscar_laser(cena, laser, vezes + 1);
        });
    });
}

function ativar_laser(cena, laser){
    laser.indicador.setVisible(false);
    laser.corpo.setVisible(true);
    laser.ativo = true;
    laser.atingidos.clear();

    cena.time.delayedCall(cena.lasers_opcoes.duracao_ativo, ()=>{
        laser.corpo.setVisible(false);
        laser.ativo = false;

        iniciar_ciclo_laser(cena, laser);
    });
}

//verifica os toques do laser contra o jogador, os inimigos e as latas de lixo
//precisa ser chamada no update() da cena
export function lasers_update(cena){

    if(!cena.lasers){
        return;
    }

    cena.lasers.forEach((laser)=>{

        if(!laser.ativo){
            return;
        }

        let area_laser = laser.corpo.getBounds();

        //jogador

        if(cena.area_dano && !laser.atingidos.has(cena.jogador) && Phaser.Geom.Intersects.RectangleToRectangle(area_laser, cena.area_dano.getBounds())){
            laser.atingidos.add(cena.jogador);
            jogador_tomando_dano(cena, {ataque: cena.lasers_opcoes.dano_jogador});
        }

        //latas de lixo

        if(cena.latas){
            cena.latas.children.iterate((lata)=>{
                if(!lata || !lata.area_dano || laser.atingidos.has(lata)){
                    return;
                }

                if(Phaser.Geom.Intersects.RectangleToRectangle(area_laser, lata.area_dano.getBounds())){
                    laser.atingidos.add(lata);
                    lata.hp -= cena.lasers_opcoes.dano_lata;
                    lata_atingida(cena, lata);
                }
            });
        }

        //inimigos

        if(cena.inimigos){
            cena.inimigos.children.iterate((inimigo)=>{
                if(!inimigo || !inimigo.area_dano || laser.atingidos.has(inimigo) || inimigo.invencibilidade){
                    return;
                }

                if(Phaser.Geom.Intersects.RectangleToRectangle(area_laser, inimigo.area_dano.getBounds())){
                    laser.atingidos.add(inimigo);
                    inimigo.hp -= cena.lasers_opcoes.dano_inimigo;
                    inimigo_tomando_dano(cena, inimigo);
                }
            });
        }
    });
}

//BURACOS !!!
function obter_direcao_jogador(cena){
    let dir_x = 0;
    let dir_y = 0;


    if(cena.teclas){
        if(cena.teclas.w.isDown || cena.teclas.seta_cima.isDown){
            dir_y = -1;
        }
        if(cena.teclas.s.isDown || cena.teclas.seta_baixo.isDown){
            dir_y = 1;
        }
        if(cena.teclas.a.isDown || cena.teclas.seta_esquerda.isDown){
            dir_x = -1;
        }
        if(cena.teclas.d.isDown || cena.teclas.seta_direita.isDown){
            dir_x = 1;
        }
    }

    if(cena.gamepad){
        if(cena.gamepad.up){
            dir_y = -1;
        }
        if(cena.gamepad.down){
            dir_y = 1;
        }
        if(cena.gamepad.left){
            dir_x = -1;
        }
        if(cena.gamepad.right){
            dir_x = 1;
        }

        let zona_morta = 0.2;
        let eixo_x = cena.gamepad.axes.length > 0? cena.gamepad.axes[0].getValue(): 0;
        let eixo_y = cena.gamepad.axes.length > 1? cena.gamepad.axes[1].getValue(): 0;

        if(Math.abs(eixo_x) >= zona_morta){
            dir_x = eixo_x > 0? 1: -1;
        }
        if(Math.abs(eixo_y) >= zona_morta){
            dir_y = eixo_y > 0? 1: -1;
        }
    }

    if(dir_x === 0 && dir_y === 0 && cena.jogador.body){
        let vx = cena.jogador.body.velocity.x;
        let vy = cena.jogador.body.velocity.y;

        dir_x = vx > 0? 1: (vx < 0? -1: 0);
        dir_y = vy > 0? 1: (vy < 0? -1: 0);
    }

    //prioridade 4 (fallback final): jogador parado e sem velocidade, usa o lado que ele esta olhando

    if(dir_x === 0 && dir_y === 0){
        dir_x = cena.jogador_olhando? -1: 1;
    }

    return {x: dir_x, y: dir_y};
}

export function criar_buracos(cena, buracos, opcoes = {}){

    cena.buracos_opcoes = {
        velocidade_empurrao: opcoes.velocidade_empurrao ?? 50, //o quao forte é o empurraozinho na direcao que o jogador estava indo
        duracao_queda: opcoes.duracao_queda ?? 500, //tempo entre pisar no buraco e a morte (duracao do fade + inclinacao)
        inclinacao: opcoes.inclinacao ?? 15 //graus de inclinacao para frente
    };

    cena.buracos = buracos.filter((buraco)=> !!buraco);

    cena.buracos.forEach((buraco)=>{

        buraco.body.setImmovable(true);

        cena.physics.add.overlap(cena.jogador, buraco, ()=>{
            jogador_caiu_no_buraco(cena, buraco);
        });


        if(cena.inimigos){
            cena.physics.add.collider(cena.inimigos, buraco)
        }
    });
}

function jogador_caiu_no_buraco(cena, buraco){
    if(cena.jogador.derrotado || cena.caiu){
        return;
    }

    if(cena.sfx_ligado){
        cena.sound.play("grito", {
            volume:2
        });
    }

    cena.caiu = true;
    cena.machucado = true;
    cena.pode_atacar = false;
    cena.ataque = false;

    let direcao = obter_direcao_jogador(cena);


    let textura_machucado = cena.genero === "feminino"? `ramona_machucada_${cena.skin}`: `scott_machucado${cena.skin}`;
    let frame_machucado = cena.genero === "feminino"? 3: 1;

    cena.jogador.anims.stop();
    cena.jogador.setTexture(textura_machucado, frame_machucado).setFlipX(cena.jogador_olhando);

    cena.jogador.setVelocity(0, 0);

    let lado_inclinacao = direcao.x !== 0? direcao.x : (cena.jogador_olhando? -1: 1);
    let angulo_final = cena.buracos_opcoes.inclinacao * lado_inclinacao;

    let centro_x = buraco.x;
    let centro_y = buraco.y;

    cena.tweens.add({
        targets: cena.jogador,
        x: centro_x,
        y: centro_y,
        angle: angulo_final,
        alpha: 0,
        duration: cena.buracos_opcoes.duracao_queda,
        ease: "Sine.easeIn",
        onComplete: ()=>{
            cena.jogador.setVelocity(0);


            // cena.jogador.setAlpha(1);
            // cena.jogador.setAngle(0);

            cena.jogador.hp_atual = 0;
            atualizar_barra_hp(cena);
            jogador_derrotado(cena, true);
        }
    });
}