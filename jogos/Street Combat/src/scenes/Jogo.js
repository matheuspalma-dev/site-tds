import { menu_sfx } from "./funcoes.js";
import {abrir_socket, criar_nova_sala, buscar_salas, pegar_data, marcar_sala_atual} from "./websocket.js";

export class Jogo extends Phaser.Scene {

    constructor(){
        super("Jogo");
    }

    init(){

        const tutorial = new URLSearchParams(window.location.search).get("tutorial");

        if(tutorial !== "true"){
            document.body.style.setProperty("--fundo", "linear-gradient(to bottom, #ff9800, #ff7b00, #4e2500)");
        }

        // document.body.style.setProperty("--fundo", "linear-gradient(to bottom, #ff9800, #ff7b00, #4e2500)");
    }

    preload(){
        menu_sfx(this);
    }

    async create(){

        window.scrollTo(0,0);

        this.gamepad = null;
        this.proximo_movimento_permitido = 0;

        let volume_atual = Number(sessionStorage.getItem("volume") ?? 50);
        let musica_ligada = sessionStorage.getItem("som") !== "desligado";

        let musica = this.sound.add("musica_menu", {
            loop: true,
            volume: volume_atual / 100
        });

        if(musica_ligada){
            musica.play();
        }

        let sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";

        //pagina onde esta tudo
        const pagina = document.getElementById("pagina_inteira");

        const parametros = new URLSearchParams(window.location.search);
        const tutorial = parametros.get("tutorial");

        if(tutorial === "true"){
            document.body.classList.add("em-gameplay");
            this.scene.start("Tutorial");
            this.scene.stop("Jogo");
            window.history.replaceState({}, document.title, window.location.pathname);
            pagina.style.display = "none";
            return;
        }

        let usuario = JSON.parse(sessionStorage.getItem("usuario")); //pega as informacoes do usuario

        async function mostrar_highscore(mapa, id) {
            const elemento = document.getElementById(id);

            if(!elemento){
                return;
            }

            if(!usuario){
                elemento.innerHTML = "Highscore: 0";
                return;
            }

            try {
                const placares = await fetch(`http://192.168.0.10:8080/ranking/${mapa}`);
                if (!placares.ok) {
                    throw new Error(placares.status);
                }

                const dados = await placares.json();
                const nome = String(usuario.nome).trim().toLowerCase();
                const resposta = dados.find(item=> String(item.nome).trim().toLowerCase() === nome);

                elemento.innerHTML = "Highscore: " + (resposta ? resposta.pontos : 0);
            } 
            catch (erro) {
                elemento.innerHTML = "Highscore: --";
            }
        }

        mostrar_highscore("mapa1", "highscore_1");
        mostrar_highscore("mapa2", "highscore_2");
        mostrar_highscore("mapa3", "highscore_3");
        
        const container_jogo = document.getElementById("game-container"); //! <-- canvas do jogo

        

        pagina.style.display = "block";
        document.body.classList.remove("em-gameplay");

        //botoes para os mapas ranking e perfil

        const botao_jogos = document.getElementById("mapas"); //ranking perfil
        const botao_ranking = document.getElementById("ranking");
        const botao_perfil = document.getElementById("perfil");

        botao_jogos.classList.add("seta_botoes");
        botao_ranking.classList.remove("seta_botoes");
        botao_perfil.classList.remove("seta_botoes");

        //paginas do mapa e login

        const lugar_mapas = document.getElementById("tela_mapas"); 
        const lugar_ranking = document.getElementById("tela_ranking");
        const lugar_perfil = document.getElementById("tela_perfil");

        //mapas do jogo

        const mapa_rua = document.getElementById("rua");
        const mapa_tribunal = document.getElementById("tribunal");
        const mapa_prisao = document.getElementById("prisao");

        mapa_rua.classList.remove("setas");
        mapa_tribunal.classList.remove("setas");
        mapa_prisao.classList.remove("setas");

        this.mapa = 0; //variavel que salva o mapa
        this.criando_sala_online = false //varaivel que verifica se estou criando uma sala online
        this.entrando_online = false;

        //escolha do modo de jogo

        const modos = document.getElementById("modos_jogo");

        const modo_singleplayer = document.getElementById("sozinho");
        const modo_multiplayer = document.getElementById("multiplayer");

        //escolha de personagem

        const escolher_personagem = document.getElementById("selecionar_personagem");

        //rankings

        const ranking_mapa_1 = document.getElementById("ranking_1");
        const ranking_mapa_2 = document.getElementById("ranking_2");
        const ranking_mapa_3 = document.getElementById("ranking_3");

        const primeiro_lugar = document.getElementById("1");
        const segundo_lugar = document.getElementById("2");
        const terceiro_lugar = document.getElementById("3");
        const quarto_lugar = document.getElementById("4");
        const quinto_lugar = document.getElementById("5");
        const sexto_lugar = document.getElementById("6");
        const setimo_lugar = document.getElementById("7");
        const oitavo_lugar = document.getElementById("8");
        const nono_lugar = document.getElementById("9");
        const decimo_lugar = document.getElementById("10");

        //perfil do jogador 

        const jogador_id = document.getElementById("id_jogador");
        const jogador_nome = document.getElementById("nome_jogador");
        const jogador_ranking = document.getElementById("ranking_jogador");
        const jogador_sair = document.getElementById("sair"); //menu_sair

        const mostrar_id = document.getElementById("id");
        const mostrar_nome = document.getElementById("nome");

        if(usuario){
            mostrar_id.innerText = "#" + usuario.id;
            mostrar_nome.innerText = usuario.nome;
        }

        const opcao_sair = document.getElementById("menu_sair");
        const botao_sair = document.getElementById("sair_da_conta");
        const botao_ficar = document.getElementById("nao_sair_da_conta");

        const ao_receber_mensagem = (event) => {

            if (event.data?.tipo !== "personagem_selecionado") {
                return;
            }

            const genero_personagem = event.data.genero;

            const skin_personagem = event.data.skin;
            
            const bonus_personagem = event.data.bonus;

            this.personagem = genero_personagem;

            let genero;
            let skin;
            let bonus = false;

            if(bonus_personagem){
                bonus = true;
            }

            
            switch (genero_personagem) {

                case "homem":
                    genero = "masculino";
                    if(sfx_ligado){
                        this.sound.play("arreia", {
                            volume:0.5,
                            seek:2.5
                        });
                    }
                    break;

                case "mulher":
                    genero = "feminino";
                    if(sfx_ligado){
                        this.sound.play("zoio", {
                            volume:0.5
                        });
                    }
                    break;

                default:
                    console.log("deu erro");
                    return;
            }

            escolher_personagem.style.display = "none";
            document.body.classList.remove("blur");
            pagina.style.display = "none";
            document.body.classList.add("em-gameplay");

            if(this.criando_sala_online){
                salas_ligadas.style.display = "none";
                criar_nova_sala(this, genero, usuario, skin_personagem);
            }

            if(this.entrando_online){
                salas_ligadas.style.display = "none";

                if (!this.nome_criador) {
                    console.error(
                        "[entrando_online] this.nome_criador está vazio — não vou mandar entrarSala",
                        "pra não entrar numa sala inválida. Confere o log '[clicar em uma sala]' acima",
                        "pra ver o que veio no dataset.salaInfo e ajustar o campo certo."
                    );
                    return;
                }

                this.mostrar_sala.send(JSON.stringify({
                    tipo:"entrarSala",
                    idSala:this.nome_criador,
                    personagem: genero,
                    skin: skin_personagem,
                    nomeJogador: usuario.nome
                }))
                marcar_sala_atual(this.nome_criador); // guarda a sala atual (pra sumir da lista quando for pro boss)
                console.log("chegou aqui")
                console.log(this.nome_criador, genero, usuario.nome); //<--- AQUIIIII

                this.scene.start("Rua_online", {
                    genero: genero,
                    skin: skin_personagem, // faltava: sem isso a Rua_online nasce sem skin
                    bonus: bonus,
                    socket: this.mostrar_sala // reaproveita a conexão já aberta no lobby
                });

                return;
            }

            if(this.criando_sala_online){

                switch (this.mapa) {

                    case 1:
                        this.scene.start("Rua_online", {
                            genero: genero,
                            skin: skin_personagem,
                            bonus: bonus,
                            socket: this.mostrar_sala // reaproveita a conexão já aberta no lobby
                        });
                        break;

                    case 2:
                        this.scene.start("Lugar", {
                            genero: genero,
                            skin: skin_personagem,
                            bonus: bonus,
                            online:this.criando_sala_online
                        });
                        break;

                    case 3:
                        this.scene.start("Prisao", {
                            genero: genero,
                            skin: skin_personagem,
                            bonus: bonus,
                            online:this.criando_sala_online
                        });
                        break;
                }

            }
            else{
                switch (this.mapa) {

                    case 1:
                        this.scene.start("Rua", {
                            genero: genero,
                            skin: skin_personagem,
                            bonus: bonus,
                            online:this.criando_sala_online,
                            socket:this.mostrar_sala //reaproveita a conexao ja aberta no lobby, em vez de abrir outra
                        });

                        break;

                    case 2:
                        this.scene.start("Lugar", {
                            genero: genero,
                            skin: skin_personagem,
                            bonus: bonus,
                            online:this.criando_sala_online
                        });
                        break;

                    case 3:
                        this.scene.start("Prisao", {
                            genero: genero,
                            skin: skin_personagem,
                            bonus: bonus,
                            online:this.criando_sala_online
                        });
                        break;
                }
            }
        };

        window.addEventListener("message", ao_receber_mensagem);

        const ao_apertar_tecla = (event) => {

            // Só controla o carrossel se ele estiver aberto
            if (escolher_personagem.style.display === "block") {

                if (event.key === "ArrowRight" || event.key.toLocaleLowerCase() === "d") {

                    escolher_personagem.contentWindow.postMessage(
                        "proximo",
                        "*"
                    );
                }

                if (event.key === "ArrowLeft" || event.key.toLocaleLowerCase() === "a") {

                    escolher_personagem.contentWindow.postMessage(
                        "anterior",
                        "*"
                    );
                }
            }

        };

        window.addEventListener("keydown", ao_apertar_tecla);

        // O DOM sobrevive ao scene.start, mas o create() roda de novo a cada
        // volta ao menu: sem remover, os listeners se acumulam e cada mensagem
        // de personagem dispara criarSala/entrarSala/scene.start várias vezes.
        this.events.once("shutdown", () => {
            window.removeEventListener("message", ao_receber_mensagem);
            window.removeEventListener("keydown", ao_apertar_tecla);

            // MESMO PROBLEMA DE CIMA, mas com as teclas do Phaser (w,a,s,d,setas,z,x):
            // addKeys() cria objetos Key novos a cada create(), mas os listeners "down"
            // dos objetos Key antigos (inclusive o do z, que chama selecionar()->puxar_placares())
            // continuavam vivos. Resultado: depois de voltar pro menu algumas vezes, cada
            // aperto de tecla disparava a mesma ação várias vezes -> várias requisições
            // de placar pro servidor. removeAllKeys(true) destroi os Keys antigos e remove
            // esses listeners.
            this.input.keyboard.removeAllKeys(true);

            // idem para o gamepad: o listener "down" registrado abaixo também se acumulava.
            if(this.input.gamepad){
                this.input.gamepad.removeAllListeners("down");
            }
        });


        const recado = document.getElementById("em_breve"); //recado para mapas em breve

        //pagina com salas online

        const salas_ligadas = document.getElementById("salas");
        const salas_online = document.getElementById("salas");

        //navegacao por setas dentro da tela de salas multiplayer

        const criar_sala = document.getElementById("criar_sala");
        const parte_baixo = document.getElementById("parte_baixo");

        //pega as salas que existem no momento (nao usa id, pois as salas sao dinamicas)
        function pegar_salas(){
            return Array.from(parte_baixo.querySelectorAll(".sala"));
        }

        //coloca a seta na primeira sala ao entrar na tela; se nao tiver nenhuma sala, fica no botao de criar sala
        function selecionar_seta_inicial_salas(){
            let salas = pegar_salas();

            criar_sala.classList.remove("seta_criar_sala");
            salas.forEach(sala_item => sala_item.classList.remove("seta_sala"));

            if(salas.length > 0){
                salas[0].classList.add("seta_sala");
            }
            else{
                criar_sala.classList.add("seta_criar_sala");
            }
        }
     

        lugar_mapas.style.display = "flex";

        // RESET DO ESTADO VISUAL: o HTML sobrevive ao scene.start, então tudo
        // que a visita anterior deixou (blur, z-index da tela de salas, menus
        // abertos, setas, lista de salas velha) precisa ser limpo aqui.
        document.body.classList.remove("blur");
        salas_ligadas.style.display = "none";
        salas_ligadas.style.zIndex = ""; // selecionar() põe "0"; volta pro valor do CSS
        modos.style.display = "none";
        escolher_personagem.style.display = "none";
        opcao_sair.style.display = "none";
        parte_baixo.innerHTML = "";
        criar_sala.classList.remove("seta_criar_sala");
        modo_singleplayer.classList.remove("seta_botoes");
        modo_multiplayer.classList.remove("seta_botoes");

        const teclas = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,

            seta_cima: Phaser.Input.Keyboard.KeyCodes.UP,
            seta_esquerda: Phaser.Input.Keyboard.KeyCodes.LEFT,
            seta_baixo: Phaser.Input.Keyboard.KeyCodes.DOWN,
            seta_direita: Phaser.Input.Keyboard.KeyCodes.RIGHT,

            z: Phaser.Input.Keyboard.KeyCodes.Z,
            x: Phaser.Input.Keyboard.KeyCodes.X
            
        });

        teclas.a.on("down", ()=>{
            andar_esquerda(botao_jogos, botao_ranking, botao_perfil, botao_sair, botao_ficar, this);
          
            
        })
        teclas.seta_esquerda.on("down", ()=>{
            andar_esquerda(botao_jogos, botao_ranking, botao_perfil, botao_sair, botao_ficar, this);
           
        })

        teclas.d.on("down", ()=>{
            andar_direita(botao_jogos, botao_ranking, botao_perfil, botao_sair, botao_ficar, this);
           
        })

        teclas.seta_direita.on("down", ()=>{
            andar_direita(botao_jogos, botao_ranking, botao_perfil, botao_sair, botao_ficar, this);
            
        })

        teclas.w.on("down",()=>{
            ir_cima(mapa_rua, mapa_tribunal, mapa_prisao, lugar_mapas, lugar_perfil, jogador_id, jogador_nome, jogador_ranking, jogador_sair, opcao_sair, modos, modo_singleplayer, modo_multiplayer, this);
        })

        teclas.seta_cima.on("down",()=>{
            ir_cima(mapa_rua, mapa_tribunal, mapa_prisao, lugar_mapas, lugar_perfil, jogador_id, jogador_nome, jogador_ranking, jogador_sair, opcao_sair, modos, modo_singleplayer, modo_multiplayer, this);
        })

        teclas.s.on("down",()=>{
            ir_baixo(mapa_rua, mapa_tribunal, mapa_prisao , lugar_mapas, lugar_perfil, jogador_id, jogador_nome, jogador_ranking, jogador_sair, opcao_sair, modos, modo_singleplayer, modo_multiplayer, this);
        })

        teclas.seta_baixo.on("down",()=>{
            ir_baixo(mapa_rua, mapa_tribunal, mapa_prisao, lugar_mapas, lugar_perfil, jogador_id, jogador_nome, jogador_ranking, jogador_sair, opcao_sair, modos, modo_singleplayer, modo_multiplayer, this);
        })

        teclas.z.on("down",()=>{
            if(escolher_personagem.style.display === "block"){
                escolher_personagem.contentWindow.postMessage( "pegar_personagem", "*" ); 
                return;
            }
            selecionar(botao_jogos, botao_ranking, botao_perfil, lugar_mapas, lugar_ranking, lugar_perfil, mapa_rua, mapa_tribunal, mapa_prisao, modos, escolher_personagem, this, jogador_id, jogador_ranking, jogador_sair, opcao_sair, botao_sair, botao_ficar, modo_singleplayer, modo_multiplayer, salas_ligadas);
            
        })

        teclas.x.on("down",()=>{
            voltar(botao_jogos, botao_ranking, botao_perfil, lugar_mapas, lugar_ranking, lugar_perfil, escolher_personagem, mapa_rua, mapa_tribunal, mapa_prisao, this, jogador_id, jogador_nome, jogador_ranking, jogador_sair, opcao_sair, modos, modo_singleplayer, modo_multiplayer, salas_ligadas); 
        })

        function andar_esquerda(mapas, ranking, perfil, sair, ficar, cena){
            if(mapas.classList.contains("seta_botoes")){
                mapas.classList.remove("seta_botoes");
                perfil.classList.add("seta_botoes");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(ranking.classList.contains("seta_botoes")){
                ranking.classList.remove("seta_botoes");
                mapas.classList.add("seta_botoes");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(perfil.classList.contains("seta_botoes")){
                perfil.classList.remove("seta_botoes");
                ranking.classList.add("seta_botoes");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(sair.classList.contains("seta_sair")){
                sair.classList.remove("seta_sair");
                ficar.classList.add("seta_sair");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(ficar.classList.contains("seta_sair")){
                ficar.classList.remove("seta_sair");
                sair.classList.add("seta_sair");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(ranking_mapa_1.classList.contains("ranking_seta")){
                ranking_mapa_1.classList.remove("ranking_seta");
                ranking_mapa_3.classList.add("ranking_seta");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(ranking_mapa_2.classList.contains("ranking_seta")){
                ranking_mapa_2.classList.remove("ranking_seta");
                ranking_mapa_1.classList.add("ranking_seta");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(ranking_mapa_3.classList.contains("ranking_seta")){
                ranking_mapa_3.classList.remove("ranking_seta");
                ranking_mapa_2.classList.add("ranking_seta");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            return;
        }

        function andar_direita(mapas, ranking, perfil, sair,ficar, cena){
            if(mapas.classList.contains("seta_botoes")){
                mapas.classList.remove("seta_botoes");
                ranking.classList.add("seta_botoes");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(ranking.classList.contains("seta_botoes")){
                ranking.classList.remove("seta_botoes");
                perfil.classList.add("seta_botoes");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(perfil.classList.contains("seta_botoes")){
                perfil.classList.remove("seta_botoes");
                mapas.classList.add("seta_botoes");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }

            else if(sair.classList.contains("seta_sair")){
                sair.classList.remove("seta_sair");
                ficar.classList.add("seta_sair");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(ficar.classList.contains("seta_sair")){
                ficar.classList.remove("seta_sair");
                sair.classList.add("seta_sair");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }

            else if(ranking_mapa_1.classList.contains("ranking_seta")){
                ranking_mapa_1.classList.remove("ranking_seta");
                ranking_mapa_2.classList.add("ranking_seta");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(ranking_mapa_2.classList.contains("ranking_seta")){
                ranking_mapa_2.classList.remove("ranking_seta");
                ranking_mapa_3.classList.add("ranking_seta");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(ranking_mapa_3.classList.contains("ranking_seta")){
                ranking_mapa_3.classList.remove("ranking_seta");
                ranking_mapa_1.classList.add("ranking_seta");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            return;
        }

        function ir_cima(mapa_1, mapa_2, mapa_3, mapas, perfil, jogador_id, jogador_nome, jogador_ranking, jogador_sair, opcao_sair, modos, singleplayer, multiplayer, cena){
            if(opcao_sair.style.display === "flex"){
                return;
            }
            if(escolher_personagem.style.display === "flex"){
                return;
            }
            else if(modos.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                if(singleplayer.classList.contains("seta_botoes")){
                    singleplayer.classList.remove("seta_botoes");
                    multiplayer.classList.add("seta_botoes");
                }
                else{
                    multiplayer.classList.remove("seta_botoes");
                    singleplayer.classList.add("seta_botoes");
                }
            }
            else if(salas_ligadas.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                let salas = pegar_salas();
                let indice_atual = salas.findIndex(sala_item => sala_item.classList.contains("seta_sala"));

                if(indice_atual > 0){
                    //ainda tem sala acima, so sobe uma
                    salas[indice_atual].classList.remove("seta_sala");
                    salas[indice_atual - 1].classList.add("seta_sala");
                    salas[indice_atual - 1].scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(indice_atual === 0){
                    //estava na primeira sala, sobe pro botao de criar sala
                    salas[0].classList.remove("seta_sala");
                    criar_sala.classList.add("seta_criar_sala");
                }
                //se ja estiver no criar_sala, nao acontece nada (nao eh circular)
            }
            else if(mapas.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                if(mapa_1.classList.contains("setas")){
                    mapa_1.classList.remove("setas");
                    mapa_3.classList.add("setas");
                    mapa_3.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(mapa_2.classList.contains("setas")){
                    mapa_2.classList.remove("setas");
                    mapa_1.classList.add("setas");
                    mapa_1.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(mapa_3.classList.contains("setas")){
                    mapa_3.classList.remove("setas");
                    mapa_2.classList.add("setas");
                    mapa_2.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
            }

            else if(lugar_ranking.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                if(primeiro_lugar.classList.contains("ranking_selecionado")){
                    primeiro_lugar.classList.remove("ranking_selecionado");
                    decimo_lugar.classList.add("ranking_selecionado");
                    decimo_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(segundo_lugar.classList.contains("ranking_selecionado")){
                    segundo_lugar.classList.remove("ranking_selecionado");
                    primeiro_lugar.classList.add("ranking_selecionado");
                    primeiro_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(terceiro_lugar.classList.contains("ranking_selecionado")){
                    terceiro_lugar.classList.remove("ranking_selecionado");
                    segundo_lugar.classList.add("ranking_selecionado");
                    segundo_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(quarto_lugar.classList.contains("ranking_selecionado")){
                    quarto_lugar.classList.remove("ranking_selecionado");
                    terceiro_lugar.classList.add("ranking_selecionado");
                    terceiro_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(quinto_lugar.classList.contains("ranking_selecionado")){
                    quinto_lugar.classList.remove("ranking_selecionado");
                    quarto_lugar.classList.add("ranking_selecionado");
                    quarto_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(sexto_lugar.classList.contains("ranking_selecionado")){
                    sexto_lugar.classList.remove("ranking_selecionado");
                    quinto_lugar.classList.add("ranking_selecionado");
                    quinto_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(setimo_lugar.classList.contains("ranking_selecionado")){
                    setimo_lugar.classList.remove("ranking_selecionado");
                    sexto_lugar.classList.add("ranking_selecionado");
                    sexto_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(oitavo_lugar.classList.contains("ranking_selecionado")){
                    oitavo_lugar.classList.remove("ranking_selecionado");
                    setimo_lugar.classList.add("ranking_selecionado");
                    setimo_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(nono_lugar.classList.contains("ranking_selecionado")){
                    nono_lugar.classList.remove("ranking_selecionado");
                    oitavo_lugar.classList.add("ranking_selecionado");
                    oitavo_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(decimo_lugar.classList.contains("ranking_selecionado")){
                    decimo_lugar.classList.remove("ranking_selecionado");
                    nono_lugar.classList.add("ranking_selecionado");
                    nono_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
            }
            
            else if(perfil.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                if(jogador_id.classList.contains("seta_jogador")){
                    jogador_id.classList.remove("seta_jogador");
                    jogador_sair.classList.add("seta_jogador");
                }
                else if(jogador_nome.classList.contains("seta_jogador")){
                    jogador_nome.classList.remove("seta_jogador");
                    jogador_id.classList.add("seta_jogador");
                }
                else if(jogador_ranking.classList.contains("seta_jogador")){
                    jogador_ranking.classList.remove("seta_jogador");
                    jogador_nome.classList.add("seta_jogador");
                }
                else if(jogador_sair.classList.contains("seta_jogador")){
                    jogador_sair.classList.remove("seta_jogador");
                    jogador_ranking.classList.add("seta_jogador");
                }
            }
            
        }

        function ir_baixo(mapa_1, mapa_2, mapa_3, mapas, perfil, jogador_id, jogador_nome, jogador_ranking, jogador_sair, opcao_sair, modos, singleplayer, multiplayer, cena){
            if(opcao_sair.style.display === "flex"){
                return;
            }
            if(escolher_personagem.style.display === "flex"){
                return;
            }
            else if(modos.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                if(singleplayer.classList.contains("seta_botoes")){
                    singleplayer.classList.remove("seta_botoes");
                    multiplayer.classList.add("seta_botoes");
                }
                else{
                    multiplayer.classList.remove("seta_botoes");
                    singleplayer.classList.add("seta_botoes");
                }
            }
            else if(salas_ligadas.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                //AQUIIII
                let salas = pegar_salas();

                if(criar_sala.classList.contains("seta_criar_sala")){
                    //estava no botao de criar sala, desce pra primeira sala (se tiver)
                    if(salas.length > 0){
                        criar_sala.classList.remove("seta_criar_sala");
                        salas[0].classList.add("seta_sala");
                    }
                }
                else{
                    let indice_atual = salas.findIndex(sala_item => sala_item.classList.contains("seta_sala"));
                    if(indice_atual > -1 && indice_atual < salas.length - 1){
                        //ainda tem sala abaixo, so desce uma
                        salas[indice_atual].classList.remove("seta_sala");
                        salas[indice_atual + 1].classList.add("seta_sala");
                        salas[indice_atual + 1].scrollIntoView({
                            behavior:"smooth",
                            block:"center"
                        });
                    }
                    //se ja estiver na ultima sala, nao acontece nada (nao eh circular)
                }
            }
            else if(mapas.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                if(mapa_1.classList.contains("setas")){
                    mapa_1.classList.remove("setas");
                    mapa_2.classList.add("setas");
                    mapa_2.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(mapa_2.classList.contains("setas")){
                    mapa_2.classList.remove("setas");
                    mapa_3.classList.add("setas");
                    mapa_3.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(mapa_3.classList.contains("setas")){
                    mapa_3.classList.remove("setas");
                    mapa_1.classList.add("setas");
                    mapa_1.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
            }
            else if(lugar_ranking.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                if(primeiro_lugar.classList.contains("ranking_selecionado")){
                    primeiro_lugar.classList.remove("ranking_selecionado");
                    segundo_lugar.classList.add("ranking_selecionado");
                    segundo_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(segundo_lugar.classList.contains("ranking_selecionado")){
                    segundo_lugar.classList.remove("ranking_selecionado");
                    terceiro_lugar.classList.add("ranking_selecionado");
                    terceiro_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(terceiro_lugar.classList.contains("ranking_selecionado")){
                    terceiro_lugar.classList.remove("ranking_selecionado");
                    quarto_lugar.classList.add("ranking_selecionado");
                    quarto_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(quarto_lugar.classList.contains("ranking_selecionado")){
                    quarto_lugar.classList.remove("ranking_selecionado");
                    quinto_lugar.classList.add("ranking_selecionado");
                    quinto_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(quinto_lugar.classList.contains("ranking_selecionado")){
                    quinto_lugar.classList.remove("ranking_selecionado");
                    sexto_lugar.classList.add("ranking_selecionado");
                    sexto_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(sexto_lugar.classList.contains("ranking_selecionado")){
                    sexto_lugar.classList.remove("ranking_selecionado");
                    setimo_lugar.classList.add("ranking_selecionado");
                    setimo_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(setimo_lugar.classList.contains("ranking_selecionado")){
                    setimo_lugar.classList.remove("ranking_selecionado");
                    oitavo_lugar.classList.add("ranking_selecionado");
                    oitavo_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(oitavo_lugar.classList.contains("ranking_selecionado")){
                    oitavo_lugar.classList.remove("ranking_selecionado");
                    nono_lugar.classList.add("ranking_selecionado");
                    nono_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(nono_lugar.classList.contains("ranking_selecionado")){
                    nono_lugar.classList.remove("ranking_selecionado");
                    decimo_lugar.classList.add("ranking_selecionado");
                    decimo_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
                else if(decimo_lugar.classList.contains("ranking_selecionado")){
                    decimo_lugar.classList.remove("ranking_selecionado");
                    primeiro_lugar.classList.add("ranking_selecionado");
                    primeiro_lugar.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });
                }
            }
            else if(perfil.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                if(jogador_id.classList.contains("seta_jogador")){
                    jogador_id.classList.remove("seta_jogador");
                    jogador_nome.classList.add("seta_jogador");
                }
                else if(jogador_nome.classList.contains("seta_jogador")){
                    jogador_nome.classList.remove("seta_jogador");
                    jogador_ranking.classList.add("seta_jogador");
                }
                else if(jogador_ranking.classList.contains("seta_jogador")){
                    jogador_ranking.classList.remove("seta_jogador");
                    jogador_sair.classList.add("seta_jogador");
                }
                else if(jogador_sair.classList.contains("seta_jogador")){
                    jogador_sair.classList.remove("seta_jogador");
                    jogador_id.classList.add("seta_jogador");
                }
            }
            
            
        }

        function selecionar( mapas, ranking,perfil, lugar_mapas, lugar_ranking, lugar_perfil, mapa_1, mapa_2,mapa_3, modos, escolher_personagem, cena, jogador_id, jogador_ranking, jogador_sair, opcao_sair, sair, ficar,singleplayer, multiplayer, sala){
            if(mapas.classList.contains("seta_botoes")){
                lugar_mapas.style.display = "flex";
                lugar_ranking.style.display = "none";
                lugar_perfil.style.display = "none";
                mapa_1.classList.add("setas");
                mapas.classList.remove("seta_botoes");
                ranking.classList.remove("seta_botoes");
                perfil.classList.remove("seta_botoes");
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
            }
            else if(ranking.classList.contains("seta_botoes")){
                lugar_mapas.style.display = "none";
                lugar_ranking.style.display = "flex";
                lugar_perfil.style.display = "none";
                mapas.classList.remove("seta_botoes");
                ranking.classList.remove("seta_botoes");
                perfil.classList.remove("seta_botoes");
                ranking_mapa_1.classList.add("ranking_seta");
                ranking_mapa_2.classList.remove("ranking_seta");
                ranking_mapa_3.classList.remove("ranking_seta");
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                
            }
            
            else if(ranking_mapa_1.classList.contains("ranking_seta") || ranking_mapa_2.classList.contains("ranking_seta") || ranking_mapa_3.classList.contains("ranking_seta")){
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })

                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                
                primeiro_lugar.classList.add("ranking_selecionado");
                segundo_lugar.classList.remove("ranking_selecionado");
                terceiro_lugar.classList.remove("ranking_selecionado");
                quarto_lugar.classList.remove("ranking_selecionado");
                quinto_lugar.classList.remove("ranking_selecionado");
                sexto_lugar.classList.remove("ranking_selecionado");
                setimo_lugar.classList.remove("ranking_selecionado");
                oitavo_lugar.classList.remove("ranking_selecionado");
                nono_lugar.classList.remove("ranking_selecionado");
                decimo_lugar.classList.remove("ranking_selecionado");
                if(ranking_mapa_1.classList.contains("ranking_seta")){
                    puxar_placares(1);
                }
                else if(ranking_mapa_2.classList.contains("ranking_seta")){
                    puxar_placares(2);
                }
                else if(ranking_mapa_3.classList.contains("ranking_seta")){
                    puxar_placares(3);
                }
            }
            else if(perfil.classList.contains("seta_botoes")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                lugar_mapas.style.display = "none";
                lugar_ranking.style.display = "none";
                lugar_perfil.style.display = "flex";
                mapas.classList.remove("seta_botoes");
                ranking.classList.remove("seta_botoes");
                perfil.classList.remove("seta_botoes");
                jogador_id.classList.add("seta_jogador")
            }
            else if(mapa_1.classList.contains("setas") || mapa_2.classList.contains("setas") || mapa_3.classList.contains("setas")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                if(mapa_1.classList.contains("setas")){
                    cena.mapa = 1;
                }
                else if(mapa_2.classList.contains("setas")){
                    // recado.style.display = "flex";
                    // return;
                    cena.mapa = 2;
                }
                else{
                    // recado.style.display = "flex";
                    // return;
                    cena.mapa = 3;
                }
                cena.criando_sala_online = false;
                cena.entrando_online = false;
                escolher_personagem.style.display = "block";
                // if(cena.mapa === 1){
                //     modos.style.display = "flex";
                //     singleplayer.classList.add("seta_botoes");
                //     multiplayer.classList.remove("seta_botoes");
                // }
                // else{
                //     cena.criando_sala_online = false;
                //     cena.entrando_online = false;
                //     escolher_personagem.style.display = "block";
                // }
                // document.body.classList.add("blur");
                document.body.classList.add("blur");
                mapa_1.classList.remove("setas");
                mapa_2.classList.remove("setas");
                mapa_3.classList.remove("setas");
            }

            else if(jogador_ranking.classList.contains("seta_jogador")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                //vai aparecer os rankings do jogador
            }
            else if(sair.classList.contains("seta_sair")){
                sessionStorage.clear();
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                window.location.href = "index.html";

                return;  
            }
            else if(ficar.classList.contains("seta_sair")){
                opcao_sair.style.display = "none";
                document.body.classList.remove("blur");
                sair.classList.remove("seta_sair");
                ficar.classList.remove("seta_sair");
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
            }

            else if(jogador_sair.classList.contains("seta_jogador")){
                opcao_sair.style.display = "flex";
                document.body.classList.add("blur");
                sair.classList.add("seta_sair");
                ficar.classList.remove("seta_sair");
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
            }
            else if(singleplayer.classList.contains("seta_botoes")){
                modos.style.display = "none";
                escolher_personagem.style.display = "block";
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
            }
            else if(pegar_salas().some(sala_item => sala_item.classList.contains("seta_sala"))){ //clicar em uma sala
                let sala_selecionada = pegar_salas().find(sala_item => sala_item.classList.contains("seta_sala"));
                cena.nome_criador = sala_selecionada.dataset.nomeCriador;
                console.log("[clicar em uma sala] dataset.nomeCriador:", sala_selecionada.dataset.nomeCriador);
                console.log("[clicar em uma sala] dataset.salaInfo (objeto completo):", sala_selecionada.dataset.salaInfo);
                escolher_personagem.style.display = "block";
                criar_sala.classList.remove("seta_criar_sala");
                sala.style.zIndex = "0";
                cena.entrando_online = true;
                // BUGFIX: sem isso, se o jogador tivesse clicado antes em
                // "criar sala" (e voltado sem chegar a criar), essa flag
                // ficava travada em true. Na hora de escolher o personagem,
                // os dois blocos "if" (criando_sala_online / entrando_online)
                // disparavam juntos: criava uma sala nova por engano E
                // entrava na sala selecionada.
                cena.criando_sala_online = false;
                
            }
            else if(criar_sala.classList.contains("seta_criar_sala")){
                console.log("clicou");
                escolher_personagem.style.display = "block";
                criar_sala.classList.remove("seta_criar_sala");
                sala.style.zIndex = "0";
                cena.criando_sala_online = true;
                // BUGFIX: mesma correção do outro lado — zera o "entrando_online"
                // que podia ter ficado true de uma seleção de sala anterior.
                cena.entrando_online = false;
            }
            else if(multiplayer.classList.contains("seta_botoes")){
                abrir_socket(cena);
                modos.style.display = "none";
                sala.style.display = "flex";
                parte_baixo.innerHTML = ""; // some com salas velhas antes de posicionar a seta
                multiplayer.classList.remove("seta_botoes"); // senão o Z reabre as salas quando nada está selecionado
                buscar_salas(cena);
                selecionar_seta_inicial_salas();
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
            }

            

            
            return;
        }


        function voltar(mapas, ranking, perfil, lugar_mapas, lugar_ranking, lugar_perfil, personagens, mapa_1, mapa_2,mapa_3, cena, jogador_id, jogador_nome, jogador_ranking, jogador_sair, opcao_sair, modos, singleplayer, multiplayer, sala){
            
            if (opcao_sair.style.display === "flex"){
                return;
            }
            if(recado.style.display === "flex"){
                recado.style.display = "none";
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                return;
            }
            if(mapas.classList.contains("seta_botoes") || ranking.classList.contains("seta_botoes")|| perfil.classList.contains("seta_botoes")){
                window.location.href = "index.html";
                document.body.classList.remove("blur");
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
            }
            else if(sala.style.display === "flex" && personagens.style.display === "block"){
                personagens.style.display = "none";
                criar_sala.classList.add("seta_criar_sala");
                sala.style.zIndex = "5";
                // BUGFIX: zera as duas flags ao voltar pra lista de salas —
                // reforça a correção acima pra nenhuma das duas ficar
                // "grudada" em true de uma escolha anterior (criar ou entrar).
                cena.criando_sala_online = false;
                cena.entrando_online = false;
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
            }
            
            else if(personagens.style.display === "block"){
                personagens.style.display = "none";
                if(cena.mapa === 1){
                    modos.style.display = "flex";
                }
                else{
                    document.body.classList.remove("blur");
                    if(cena.mapa === 2){
                        mapa_2.classList.add("setas");
                    }
                    else{
                        mapa_3.classList.add("setas");
                    }
                }
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
            }
            else if(modos.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                modos.style.display = "none";
                document.body.classList.remove("blur");
                switch(cena.mapa){
                    case 1:
                        mapa_1.classList.add("setas");
                        break;
                    case 2:
                        mapa_2.classList.add("setas");
                        break;
                    case 3:
                        mapa_3.classList.add("setas");
                        break;
                    default:
                        mapa_1.classList.add("setas");
                        break;
                }  

            }
            else if(salas_ligadas.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                singleplayer.classList.add("seta_botoes");
                multiplayer.classList.remove("seta_botoes");
                // sala.style.display = "none";
                salas_ligadas.style.display = "none"
                modos.style.display = "flex";
                criar_sala.classList.remove("seta_criar_sala");
                pegar_salas().forEach(sala_item => sala_item.classList.remove("seta_sala"));
            }
            else if(lugar_mapas.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                mapa_1.classList.remove("setas");
                mapa_2.classList.remove("setas");
                mapa_3.classList.remove("setas");
                mapas.classList.add("seta_botoes");
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                document.body.classList.remove("blur");
            }
            else if(primeiro_lugar.classList.contains("ranking_selecionado") || segundo_lugar.classList.contains("ranking_selecionado") ||
                terceiro_lugar.classList.contains("ranking_selecionado") || quarto_lugar.classList.contains("ranking_selecionado") ||
                quinto_lugar.classList.contains("ranking_selecionado") || sexto_lugar.classList.contains("ranking_selecionado") ||
                setimo_lugar.classList.contains("ranking_selecionado") || oitavo_lugar.classList.contains("ranking_selecionado") ||
                nono_lugar.classList.contains("ranking_selecionado") || decimo_lugar.classList.contains("ranking_selecionado")){
                // sai do placar mostrado e volta pros botões de mapa do ranking
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                primeiro_lugar.classList.remove("ranking_selecionado");
                segundo_lugar.classList.remove("ranking_selecionado");
                terceiro_lugar.classList.remove("ranking_selecionado");
                quarto_lugar.classList.remove("ranking_selecionado");
                quinto_lugar.classList.remove("ranking_selecionado");
                sexto_lugar.classList.remove("ranking_selecionado");
                setimo_lugar.classList.remove("ranking_selecionado");
                oitavo_lugar.classList.remove("ranking_selecionado");
                nono_lugar.classList.remove("ranking_selecionado");
                decimo_lugar.classList.remove("ranking_selecionado");
            }
            else if(ranking_mapa_1.classList.contains("ranking_seta") || ranking_mapa_2.classList.contains("ranking_seta") || ranking_mapa_3.classList.contains("ranking_seta")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                ranking_mapa_1.classList.remove("ranking_seta");
                ranking_mapa_2.classList.remove("ranking_seta");
                ranking_mapa_3.classList.remove("ranking_seta");
                // a tela de ranking (lugar_ranking) continua visível — nunca escondida aqui
                ranking.classList.add("seta_botoes");
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }
            else if(lugar_perfil.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                perfil.classList.add("seta_botoes");
                jogador_id.classList.remove("seta_jogador");
                jogador_nome.classList.remove("seta_jogador");
                jogador_ranking.classList.remove("seta_jogador");
                jogador_sair.classList.remove("seta_jogador");
                document.body.classList.remove("blur");
            }     
        }

        if(this.input.gamepad){

            if(this.input.gamepad.total > 0){
                this.gamepad = this.input.gamepad.getPad(0);
            }

            this.input.gamepad.on("connected", (pad)=>{
                this.gamepad = pad;
            });

            this.input.gamepad.on("down", (pad, button)=>{
                if(button.index === 0){
                    if(escolher_personagem.style.display === "block"){
                        escolher_personagem.contentWindow.postMessage("pegar_personagem", "*");
                        return;
                    }
                    selecionar(botao_jogos, botao_ranking, botao_perfil, lugar_mapas, lugar_ranking, lugar_perfil, mapa_rua, mapa_tribunal, mapa_prisao, modos, escolher_personagem, this, jogador_id, jogador_ranking, jogador_sair, opcao_sair, botao_sair, botao_ficar, modo_singleplayer, modo_multiplayer, salas_ligadas);
                }
                else if(button.index === 1){
                    voltar(botao_jogos, botao_ranking, botao_perfil, lugar_mapas, lugar_ranking, lugar_perfil, escolher_personagem, mapa_rua, mapa_tribunal, mapa_prisao, this, jogador_id, jogador_nome, jogador_ranking, jogador_sair, opcao_sair, modos, modo_singleplayer, modo_multiplayer, salas_ligadas);
                }
            });
        }



        //adicionando os nomes no ranking

        let buscando_placar = false; // trava extra: evita chamada concorrente à mesma função

        async function puxar_placares(mapa){
            if(buscando_placar) return;
            buscando_placar = true;
            try{
                let pegar_placares = await fetch(`http://192.168.0.10:8080/ranking/mapa${mapa}`)
                if(!pegar_placares.ok){
                    throw new Error(`HTTP ${pegar_placares.status}`);
                }
                
                let dados = await pegar_placares.json();

                // Ordena do maior para o menor
                dados.sort((a, b) => b.pontos - a.pontos);

                // Pega no máximo os 10 maiores
                let maiores_pontuacoes = dados.slice(0, 10);

                let posicoes = [
                    primeiro_lugar, segundo_lugar, terceiro_lugar, quarto_lugar, quinto_lugar,
                    sexto_lugar, setimo_lugar, oitavo_lugar, nono_lugar, decimo_lugar
                ];

                // Preenche cada posição; se não houver jogador suficiente, mostra "-"
                // em vez de quebrar (evita o bug de "não aparece valor nenhum")
                posicoes.forEach((posicao, indice) => {
                    let jogador = maiores_pontuacoes[indice];
                    posicao.querySelector(".nome_ranking").innerHTML = jogador ? jogador.nome : "-";
                    posicao.querySelector(".pontos_ranking").innerHTML = jogador ? jogador.pontos : "-";
                });

                console.log(maiores_pontuacoes);
            }
            catch(erro){
                console.log("Erro ", erro);
                //codigo
            }
            finally{
                buscando_placar = false;
            }
        }

        // guarda referencias em "this" para poderem ser usadas dentro do update()
        // (dentro do create() elas sao apenas variaveis locais, o update() nao enxerga)
        this.botao_jogos = botao_jogos;
        this.botao_ranking = botao_ranking;
        this.botao_perfil = botao_perfil;
        this.botao_sair = botao_sair;
        this.botao_ficar = botao_ficar;
        this.mapa_rua = mapa_rua;
        this.mapa_tribunal = mapa_tribunal;
        this.mapa_prisao = mapa_prisao;
        this.lugar_mapas = lugar_mapas;
        this.lugar_perfil = lugar_perfil;
        this.jogador_id = jogador_id;
        this.jogador_nome = jogador_nome;
        this.jogador_ranking = jogador_ranking;
        this.jogador_sair = jogador_sair;
        this.opcao_sair = opcao_sair;
        this.modos = modos;
        this.modo_singleplayer = modo_singleplayer;
        this.modo_multiplayer = modo_multiplayer;

        this.escolher_personagem = escolher_personagem;

        this.ir_cima = ir_cima;
        this.ir_baixo = ir_baixo;
        this.andar_esquerda = andar_esquerda;
        this.andar_direita = andar_direita;
    }

    update(time){

        if(!this.gamepad && this.input.gamepad && this.input.gamepad.total > 0){
            this.gamepad = this.input.gamepad.getPad(0);
        }

        if(!this.gamepad){
            return;
        }

        const cooldown_navegacao = 200; //ms entre cada movimento

        if(this.proximo_movimento_permitido && time < this.proximo_movimento_permitido){
            return;
        }

        const cima = this.gamepad.up || this.gamepad.leftStick.y < -0.5;
        const baixo = this.gamepad.down || this.gamepad.leftStick.y > 0.5;
        const esquerda = this.gamepad.left || this.gamepad.leftStick.x < -0.5;
        const direita = this.gamepad.right || this.gamepad.leftStick.x > 0.5;

        if(cima){
            this.ir_cima(this.mapa_rua, this.mapa_tribunal, this.mapa_prisao, this.lugar_mapas, this.lugar_perfil, this.jogador_id, this.jogador_nome, this.jogador_ranking, this.jogador_sair, this.opcao_sair, this.modos, this.modo_singleplayer, this.modo_multiplayer, this);
            this.proximo_movimento_permitido = time + cooldown_navegacao;
        }
        else if(baixo){
            this.ir_baixo(this.mapa_rua, this.mapa_tribunal, this.mapa_prisao, this.lugar_mapas, this.lugar_perfil, this.jogador_id, this.jogador_nome, this.jogador_ranking, this.jogador_sair, this.opcao_sair, this.modos, this.modo_singleplayer, this.modo_multiplayer, this);
            this.proximo_movimento_permitido = time + cooldown_navegacao;
        }

        if(esquerda){
            if(this.escolher_personagem.style.display === "block"){
                this.escolher_personagem.contentWindow.postMessage("anterior", "*");
            }
            else{
                this.andar_esquerda(this.botao_jogos, this.botao_ranking, this.botao_perfil, this.botao_sair, this.botao_ficar, this);
            }
            this.proximo_movimento_permitido = time + cooldown_navegacao;
        }
        else if(direita){
            if(this.escolher_personagem.style.display === "block"){
                this.escolher_personagem.contentWindow.postMessage("proximo", "*");
            }
            else{
                this.andar_direita(this.botao_jogos, this.botao_ranking, this.botao_perfil, this.botao_sair, this.botao_ficar, this);
            }
            this.proximo_movimento_permitido = time + cooldown_navegacao;
        }
    }
}
