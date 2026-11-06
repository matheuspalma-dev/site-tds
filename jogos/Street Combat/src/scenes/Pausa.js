import {assets_sfx, mostrar_pontuacao, configurar_gamepad} from "./funcoes.js";
import {sair_da_sala, fechar_conexao} from "./websocket.js";
export class Pausa extends Phaser.Scene {
    constructor() {
        super('Pausa');
    }

    init(data) {

        this.mapa = data.mapa;
        this.motivo = data.motivo;
        // this.tutorial = data.tutorial;

        //pagina de volta

        this.pagina = document.getElementById("pagina_inteira");
        const mapa_rua = document.getElementById("rua");
        // const mapa_tribunal = document.getElementById("tribunal");
        // const mapa_prisao = document.getElementById("prisao");

        //hud de vida

        this.hud_vida = document.getElementById("hud");

        this.inimigos_derrotados = data.inimigos;
        this.pontuacao = data.pontuacao;
        this.tempo = data.tempo;
        this.hits = data.hits;

        assets_sfx(this);
    }

    create() {

        configurar_gamepad(this);

        let sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";

        const menu_de_pausa = document.getElementById("menu_pausa");
        const menu_morte = document.getElementById("morreu");

        
        //pausa

        const botao_continuar = document.getElementById("voltar_pausa");
        const botao_reiniciar = document.getElementById("reiniciar_pausa");
        const botao_configuracoes = document.getElementById("configuracoes_pausa");
        const botao_voltar = document.getElementById("menu_pausar");

        //pausa online (nao pausa o mapa, so abre o menu por cima dele)

        const menu_de_pausa_online = document.getElementById("menu_pausa_online");
        const botao_continuar_online = document.getElementById("voltar_pausa_online");
        const botao_configuracoes_online = document.getElementById("configuracoes_pausa_online");
        const botao_voltar_online = document.getElementById("menu_pausar_online");

        //derrota

        const botao_tentar_novamente = document.getElementById("tentar_novamente");
        const botao_configuracoes_morreu = document.getElementById("configuracoes_morreu");
        const botao_voltar_menu = document.getElementById("voltar_menu");
        const botao_reviver = document.getElementById("meme"); //vou tirar esse dps

        //vitoria

        const botao_jogar_novamente = document.getElementById("jogar_novamente_ganhou");
        const voltar_ganhou = document.getElementById("voltar_menu_ganhou");
        const menu_vitoria = document.getElementById("menu_ganhou");
        
        if(this.motivo === "pausa"){
            menu_de_pausa.style.display = "flex";
            botao_continuar.classList.add("seta_pausa");
            botao_reiniciar.classList.remove("seta_pausa");
            botao_voltar.classList.remove("seta_pausa");
        }
        else if(this.motivo === "pausa_online"){
            menu_de_pausa_online.style.display = "flex";
            botao_continuar_online.classList.add("seta_pausa");
            botao_configuracoes_online.classList.remove("seta_pausa");
            botao_voltar_online.classList.remove("seta_pausa");
        }
        else if(this.motivo === "morreu"){
            menu_morte.style.display = "flex";
            botao_tentar_novamente.classList.add("seta_pausa");
            botao_configuracoes_morreu.classList.remove("seta_pausa");
            // botao_reviver.classList.remove("seta_pausa");
        }
        else if(this.motivo === "ganhou"){
            mostrar_pontuacao(this, this.inimigos_derrotados, this.pontuacao, this.tempo, this.hits, this.mapa);
        }



        document.body.classList.add("fundo_preto");

        

        const teclas = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,

            seta_cima: Phaser.Input.Keyboard.KeyCodes.UP,
            seta_esquerda: Phaser.Input.Keyboard.KeyCodes.LEFT,
            seta_baixo: Phaser.Input.Keyboard.KeyCodes.DOWN,
            seta_direita: Phaser.Input.Keyboard.KeyCodes.RIGHT,

            z:Phaser.Input.Keyboard.KeyCodes.Z,
            x:Phaser.Input.Keyboard.KeyCodes.X
            
        });

        //CONFIGURACOES (igual ao menu inicial): musica, volume e sfx

        const menu_de_configuracoes = document.getElementById("configuracoes_menu");
        const som = document.getElementById("musica");
        const mudar_som = document.getElementById("volume");
        const tirar_sfx = document.getElementById("sfx");

        let em_config = false;
        let volume_atual = Number(sessionStorage.getItem("volume") ?? 50);

        //despachantes: decidem o que cada tecla faz dependendo de onde o jogador esta

        const ir_cima = ()=>{
            if(em_config){
                config_cima(this);
            }
            else if(this.motivo === "pausa"){
                para_cima(botao_continuar, botao_reiniciar, botao_configuracoes, botao_voltar, this);
            }
            else if(this.motivo === "pausa_online"){
                para_cima_online(botao_continuar_online, botao_configuracoes_online, botao_voltar_online, this);
            }
            else if(this.motivo === "morreu"){
                para_cima_morte(botao_tentar_novamente, botao_configuracoes_morreu, botao_voltar_menu, botao_reviver, this);
            }
        };

        const ir_baixo = ()=>{
            if(em_config){
                config_baixo(this);
            }
            else if(this.motivo === "pausa"){
                para_baixo(botao_continuar, botao_reiniciar, botao_configuracoes, botao_voltar, this);
            }
            else if(this.motivo === "pausa_online"){
                para_baixo_online(botao_continuar_online, botao_configuracoes_online, botao_voltar_online, this);
            }
            else if(this.motivo === "morreu"){
                para_baixo_morte(botao_tentar_novamente, botao_configuracoes_morreu, botao_voltar_menu, botao_reviver, this);
            }
        };

        const ir_esquerda = ()=>{
            if(em_config){
                config_esquerda(this);
            }
            else if(this.motivo === "ganhou"){
                para_esquerda_direita(this, botao_jogar_novamente, voltar_ganhou);
            }
        };

        const ir_direita = ()=>{
            if(em_config){
                config_direita(this);
            }
            else if(this.motivo === "ganhou"){
                para_esquerda_direita(this, botao_jogar_novamente, voltar_ganhou);
            }
        };

        const confirmar = ()=>{
            if(em_config){
                return; //dentro das configuracoes o Z nao faz nada (igual ao menu inicial)
            }
            if(this.motivo === "pausa"){
                verifica_botao(botao_continuar, botao_reiniciar, botao_configuracoes, botao_voltar, menu_de_pausa, this);
            }
            else if(this.motivo === "pausa_online"){
                verifica_botao_online(botao_continuar_online, botao_configuracoes_online, botao_voltar_online, menu_de_pausa_online, this);
            }
            else if(this.motivo === "morreu"){
                verifica_botao_morte(botao_tentar_novamente, botao_configuracoes_morreu, botao_voltar_menu, menu_morte, this);
            }
            else if(this.motivo === "ganhou"){
                verifica_botao_ganhou(this, botao_jogar_novamente, menu_vitoria, this);
            }
        };

        //teclado

        teclas.w.on("down", ir_cima);
        teclas.seta_cima.on("down", ir_cima);

        teclas.s.on("down", ir_baixo);
        teclas.seta_baixo.on("down", ir_baixo);

        teclas.a.on("down", ir_esquerda);
        teclas.seta_esquerda.on("down", ir_esquerda);

        teclas.d.on("down", ir_direita);
        teclas.seta_direita.on("down", ir_direita);

        teclas.z.on("down", confirmar);

        //o x e para voltar!!! (so faz algo quando as configuracoes estao abertas)
        teclas.x.on("down", ()=>{
            if(em_config){
                fechar_config(this);
            }
        });

        //navegacao e confirmacao com o gamepad (d-pad, botao A e botao B)

        this.input.gamepad.on("down",(pad, botao)=>{
            if(botao.index === 12){ //d-pad cima
                ir_cima();
            }
            else if(botao.index === 13){ //d-pad baixo
                ir_baixo();
            }
            else if(botao.index === 14){ //d-pad esquerda
                ir_esquerda();
            }
            else if(botao.index === 15){ //d-pad direita
                ir_direita();
            }
            else if(botao.index === 0){ //A confirma
                confirmar();
            }
            else if(botao.index === 1){ //B volta
                if(em_config){
                    fechar_config(this);
                }
            }
        });

        //navegacao com o analogico esquerdo (fica escutando de tempos em tempos, com uma trava pra nao repetir toda hora que fica segurado)

        let pode_mover_analogico = true;

        this.time.addEvent({
            delay: 50,
            loop: true,
            callback: ()=>{
                if(!this.gamepad){
                    return;
                }

                let eixo_x = this.gamepad.axes.length > 0? this.gamepad.axes[0].getValue(): 0;
                let eixo_y = this.gamepad.axes.length > 1? this.gamepad.axes[1].getValue(): 0;
                let zona_morta = 0.5;

                if(Math.abs(eixo_x) < zona_morta && Math.abs(eixo_y) < zona_morta){
                    pode_mover_analogico = true; //soltou o analogico, libera pra mover de novo
                    return;
                }

                if(!pode_mover_analogico){
                    return;
                }

                pode_mover_analogico = false;

                if(eixo_y < -zona_morta){
                    ir_cima();
                }
                else if(eixo_y > zona_morta){
                    ir_baixo();
                }
                else if(eixo_x < -zona_morta){
                    ir_esquerda();
                }
                else if(eixo_x > zona_morta){
                    ir_direita();
                }
            }
        });

        //funcoes das configuracoes

        function abrir_config(cena){
            em_config = true;

            menu_de_pausa.style.display = "none";
            menu_de_pausa_online.style.display = "none";
            menu_morte.style.display = "none";
            menu_de_configuracoes.style.display = "flex";

            //mostra o estado atual salvo (igual ao menu inicial)
            let musica_on = sessionStorage.getItem("som") !== "desligado";

            som.classList.toggle("ligada", musica_on);
            som.innerText = musica_on? "< On >" : "< Off >";

            mudar_som.textContent = `< ${volume_atual}% >`;

            tirar_sfx.classList.toggle("ligada", sfx_ligado);
            tirar_sfx.innerText = sfx_ligado? "< On >" : "< Off >";

            //a seta comeca sempre na primeira opcao
            som.classList.add("configurando");
            mudar_som.classList.remove("configurando");
            tirar_sfx.classList.remove("configurando");
        }

        function fechar_config(cena){
            if(sfx_ligado){
                cena.sound.play("selecionando");
            }

            em_config = false;

            som.classList.remove("configurando");
            mudar_som.classList.remove("configurando");
            tirar_sfx.classList.remove("configurando");
            menu_de_configuracoes.style.display = "none";

            //volta pras outras opcoes, com a seta SEMPRE na primeira
            if(cena.motivo === "pausa"){
                menu_de_pausa.style.display = "flex";
                botao_continuar.classList.add("seta_pausa");
                botao_reiniciar.classList.remove("seta_pausa");
                botao_configuracoes.classList.remove("seta_pausa");
                botao_voltar.classList.remove("seta_pausa");
            }
            else if(cena.motivo === "pausa_online"){
                menu_de_pausa_online.style.display = "flex";
                botao_continuar_online.classList.add("seta_pausa");
                botao_configuracoes_online.classList.remove("seta_pausa");
                botao_voltar_online.classList.remove("seta_pausa");
            }
            else if(cena.motivo === "morreu"){
                menu_morte.style.display = "flex";
                botao_tentar_novamente.classList.add("seta_pausa");
                botao_configuracoes_morreu.classList.remove("seta_pausa");
                botao_voltar_menu.classList.remove("seta_pausa");
            }
        }

        //aplica volume/ligado-desligado nas musicas que estao tocando (chaves que comecam com "musica")
        function aplicar_musica(cena, ligada){
            cena.sound.sounds.forEach((s)=>{
                if(s.key && s.key.startsWith("musica")){
                    s.setVolume(volume_atual/100);
                    if(ligada === false && s.isPlaying){
                        s.pause();
                    }
                    else if(ligada === true && s.isPaused){
                        s.resume();
                    }
                }
            });
        }

        function toca_mover(cena){
            if(sfx_ligado){
                cena.sound.play("movendo_menu");
            }
        }

        function config_cima(cena){
            if(som.classList.contains("configurando")){
                som.classList.remove("configurando");
                tirar_sfx.classList.add("configurando");
                toca_mover(cena);
            }
            else if(mudar_som.classList.contains("configurando")){
                mudar_som.classList.remove("configurando");
                som.classList.add("configurando");
                toca_mover(cena);
            }
            else if(tirar_sfx.classList.contains("configurando")){
                tirar_sfx.classList.remove("configurando");
                mudar_som.classList.add("configurando");
                toca_mover(cena);
            }
        }

        function config_baixo(cena){
            if(som.classList.contains("configurando")){
                som.classList.remove("configurando");
                mudar_som.classList.add("configurando");
                toca_mover(cena);
            }
            else if(mudar_som.classList.contains("configurando")){
                mudar_som.classList.remove("configurando");
                tirar_sfx.classList.add("configurando");
                toca_mover(cena);
            }
            else if(tirar_sfx.classList.contains("configurando")){
                tirar_sfx.classList.remove("configurando");
                som.classList.add("configurando");
                toca_mover(cena);
            }
        }

        //esquerda e direita fazem a mesma coisa nos liga/desliga; no volume, esquerda diminui e direita aumenta

        function alterna_musica(cena){
            toca_mover(cena);
            if(som.classList.contains("ligada")){
                som.classList.remove("ligada");
                sessionStorage.setItem("som", "desligado");
                som.innerText = "< Off >";
                aplicar_musica(cena, false);
            }
            else{
                som.classList.add("ligada");
                sessionStorage.setItem("som", "ligado");
                som.innerText = "< On >";
                aplicar_musica(cena, true);
            }
        }

        function alterna_sfx(cena){
            toca_mover(cena);
            if(tirar_sfx.classList.contains("ligada")){
                tirar_sfx.classList.remove("ligada");
                sessionStorage.setItem("sfx", "desligado");
                tirar_sfx.innerText = "< Off >";
                sfx_ligado = false;
            }
            else{
                tirar_sfx.classList.add("ligada");
                sessionStorage.setItem("sfx", "ligado");
                tirar_sfx.innerText = "< On >";
                sfx_ligado = true;
            }
        }

        function muda_volume(cena, quanto){
            toca_mover(cena);
            volume_atual += quanto;
            if(volume_atual < 0){
                volume_atual = 0;
            }
            if(volume_atual > 100){
                volume_atual = 100;
            }
            mudar_som.textContent = `< ${volume_atual}% >`;
            sessionStorage.setItem("volume", volume_atual);
            aplicar_musica(cena);
        }

        function config_esquerda(cena){
            if(som.classList.contains("configurando")){
                alterna_musica(cena);
            }
            else if(mudar_som.classList.contains("configurando")){
                muda_volume(cena, -1);
            }
            else if(tirar_sfx.classList.contains("configurando")){
                alterna_sfx(cena);
            }
        }

        function config_direita(cena){
            if(som.classList.contains("configurando")){
                alterna_musica(cena);
            }
            else if(mudar_som.classList.contains("configurando")){
                muda_volume(cena, 1);
            }
            else if(tirar_sfx.classList.contains("configurando")){
                alterna_sfx(cena);
            }
        }

       //funcoes da pausa

        function para_cima(continuar, reiniciar, configuracoes, voltar, cena){
            if(continuar.classList.contains("seta_pausa")){
                continuar.classList.remove("seta_pausa");
                voltar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(reiniciar.classList.contains("seta_pausa")){
                reiniciar.classList.remove("seta_pausa");
                continuar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(configuracoes.classList.contains("seta_pausa")){
                configuracoes.classList.remove("seta_pausa");
                reiniciar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(voltar.classList.contains("seta_pausa")){
                voltar.classList.remove("seta_pausa");
                configuracoes.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
        }

        function para_baixo(continuar, reiniciar, configuracoes, voltar, cena){
            if(continuar.classList.contains("seta_pausa")){
                continuar.classList.remove("seta_pausa");
                reiniciar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(reiniciar.classList.contains("seta_pausa")){
                reiniciar.classList.remove("seta_pausa");
                configuracoes.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(configuracoes.classList.contains("seta_pausa")){
                configuracoes.classList.remove("seta_pausa");
                voltar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(voltar.classList.contains("seta_pausa")){
                voltar.classList.remove("seta_pausa");
                continuar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
        }

        function verifica_botao(continuar, reiniciar, configuracoes, voltar, menu, cena){
            if(continuar.classList.contains("seta_pausa")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                document.body.classList.remove("fundo_preto");
                cena.scene.resume(cena.mapa);
                menu.style.display = "none";
                cena.scene.stop("Pausa");
                
                return;
            }
            else if(reiniciar.classList.contains("seta_pausa")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                document.body.classList.remove("fundo_preto");
                cena.scene.stop(cena.mapa);
                document.getElementById("hud_boss_1").style.display = "none";
                document.getElementById("hud_boss_2").style.display = "none";
                document.getElementById("hud_boss_3").style.display = "none";
                if(cena.mapa === "Boss_1"){
                    cena.scene.start("Rua");
                }
                else if(cena.mapa === "Boss_2"){
                    cena.scene.start("Lugar");
                }
                else if(cena.mapa === "Boss_3"){
                    cena.scene.start("Prisao");
                }
                else{
                    cena.scene.start(cena.mapa);
                }
                
                menu.style.display = "none";
                cena.scene.stop("Pausa");
                
                return;
            }
            else if(configuracoes.classList.contains("seta_pausa")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }

                abrir_config(cena);
            }
            else if(voltar.classList.contains("seta_pausa")){
                if(cena.mapa === "Tutorial"){
                    window.location.href = "index.html";
                    if(sfx_ligado){
                        cena.sound.play("selecionando");
                    }
                    return;
                }
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                cena.scene.stop(cena.mapa);
                cena.hud_vida.style.display = "none";
                document.getElementById("hud_boss_1").style.display = "none";
                document.getElementById("hud_boss_2").style.display = "none";
                document.getElementById("hud_boss_3").style.display = "none";
                cena.pagina.style.display = "block";
                menu.style.display = "none";
                document.body.classList.remove("fundo_preto");
                window.location.reload();
                cena.scene.start("Jogo");
                cena.scene.stop("Pausa");    
                
                return;
            }
        }

        //funcoes da pausa online (so 3 opcoes, sem reiniciar. o mapa continua rodando por baixo)

        function para_cima_online(continuar, configuracoes, voltar, cena){
            if(continuar.classList.contains("seta_pausa")){
                continuar.classList.remove("seta_pausa");
                voltar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(configuracoes.classList.contains("seta_pausa")){
                configuracoes.classList.remove("seta_pausa");
                continuar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(voltar.classList.contains("seta_pausa")){
                voltar.classList.remove("seta_pausa");
                configuracoes.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
        }

        function para_baixo_online(continuar, configuracoes, voltar, cena){
            if(continuar.classList.contains("seta_pausa")){
                continuar.classList.remove("seta_pausa");
                configuracoes.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(configuracoes.classList.contains("seta_pausa")){
                configuracoes.classList.remove("seta_pausa");
                voltar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(voltar.classList.contains("seta_pausa")){
                voltar.classList.remove("seta_pausa");
                continuar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
        }

        function verifica_botao_online(continuar, configuracoes, voltar, menu, cena){
            const cena_mapa = cena.scene.get(cena.mapa);

            if(continuar.classList.contains("seta_pausa")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                cena_mapa.pausa_aberta = false;
                if(cena_mapa.teclas_ataque){
                    Object.values(cena_mapa.teclas_ataque).forEach((tecla)=>{
                        tecla.reset();
                    });
                }
                document.body.classList.remove("fundo_preto");
                menu.style.display = "none";
                cena.scene.stop("Pausa");
                return;
            }
            else if(configuracoes.classList.contains("seta_pausa")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }

                abrir_config(cena);
            }
            else if(voltar.classList.contains("seta_pausa")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                sair_da_sala(cena_mapa);
                fechar_conexao(cena_mapa);

                cena.scene.stop(cena.mapa);
                cena.hud_vida.style.display = "none";
                document.getElementById("hud_boss_1").style.display = "none";
                document.getElementById("hud_boss_2").style.display = "none";
                document.getElementById("hud_boss_3").style.display = "none";
                cena.pagina.style.display = "block";
                menu.style.display = "none";
                document.body.classList.remove("fundo_preto");
                window.location.reload();
                cena.scene.start("Jogo");
                cena.scene.stop("Pausa");
                return;
            }
        }

        //funcoes derrota

        function para_cima_morte(tentar_novamente, configuracoes, voltar, reviver, cena){
            if(tentar_novamente.classList.contains("seta_pausa")){
                tentar_novamente.classList.remove("seta_pausa");
                voltar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                    
                }
            }
            else if(configuracoes.classList.contains("seta_pausa")){
                configuracoes.classList.remove("seta_pausa");
                tentar_novamente.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(voltar.classList.contains("seta_pausa")){
                voltar.classList.remove("seta_pausa");
                configuracoes.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            // else if(reviver.classList.contains("seta_pausa")){
            //     reviver.classList.remove("seta_pausa");
            //     voltar.classList.add("seta_pausa");
            // }
        }

        function para_baixo_morte(tentar_novamente, configuracoes, voltar, reviver, cena){
            if(tentar_novamente.classList.contains("seta_pausa")){
                tentar_novamente.classList.remove("seta_pausa");
                configuracoes.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(configuracoes.classList.contains("seta_pausa")){
                configuracoes.classList.remove("seta_pausa");
                voltar.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(voltar.classList.contains("seta_pausa")){
                voltar.classList.remove("seta_pausa");
                tentar_novamente.classList.add("seta_pausa");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            // else if(reviver.classList.contains("seta_pausa")){
            //     reviver.classList.remove("seta_pausa");
            //     tentar_novamente.classList.add("seta_pausa");
            // }
        }

        function verifica_botao_morte(tentar_novamente, configuracoes, voltar, menu, cena){
            if(tentar_novamente.classList.contains("seta_pausa")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                document.body.classList.remove("fundo_preto");

                cena.scene.stop(cena.mapa);
                document.getElementById("hud_boss_1").style.display = "none";
                document.getElementById("hud_boss_2").style.display = "none";
                document.getElementById("hud_boss_3").style.display = "none";

                if(cena.mapa === "Boss_1"){
                    cena.scene.start("Rua");
                }
                else if(cena.mapa === "Boss_2"){
                    cena.scene.start("Lugar");
                }
                else if(cena.mapa === "Boss_3"){
                    cena.scene.start("Prisao");
                }
                else{
                    cena.scene.start(cena.mapa);
                }

                menu.style.display = "none";
                cena.scene.stop("Pausa");
                return;
            }
            else if(configuracoes.classList.contains("seta_pausa")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                abrir_config(cena);
            }
            else if(voltar.classList.contains("seta_pausa")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                cena.scene.stop(cena.mapa);
                cena.hud_vida.style.display = "none";
                cena.pagina.style.display = "block";
                menu.style.display = "none";
                document.getElementById("hud_boss_2").style.display = "none";
                document.getElementById("hud_boss_3").style.display = "none";
                document.body.classList.remove("fundo_preto");
                window.location.reload();
                cena.scene.start("Jogo");
                cena.scene.stop("Pausa");
                
                
                return;
            }
            // else if(reviver.classList.contains("seta_pausa")){
            //     //vou adicionar depois
            // }
        }

        //funcoes vitoria

        function para_esquerda_direita(cena, novamente, voltar){
            if(novamente.classList.contains("seta_ganhou")){
                novamente.classList.remove("seta_ganhou");
                voltar.classList.add("seta_ganhou");
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
            }
            else{
                voltar.classList.remove("seta_ganhou");
                novamente.classList.add("seta_ganhou");
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
            }
        }

        function verifica_botao_ganhou(cena, novamente, menu){
            if(cena.mapa === "Boss_1_online" || cena.mapa === "Boss_2_online" || cena.mapa === "Boss_3_online"){
                const cena_mapa = cena.scene.get(cena.mapa);
                sair_da_sala(cena_mapa);
                fechar_conexao(cena_mapa);
            }

            if(novamente.classList.contains("seta_ganhou")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                document.body.classList.remove("fundo_preto");
                cena.scene.stop(cena.mapa);
                document.getElementById("hud_boss_1").style.display = "none";
                document.getElementById("hud_boss_2").style.display = "none";
                document.getElementById("hud_boss_3").style.display = "none";
                if(cena.mapa === "Boss_1"){
                    cena.scene.start("Rua");
                }
                else if(cena.mapa === "Boss_2"){
                    cena.scene.start("Lugar");
                }
                else if(cena.mapa === "Boss_3"){
                    cena.scene.start("Prisao");
                }
                else if(cena.mapa === "Boss_1_online" || cena.mapa === "Boss_2_online" || cena.mapa === "Boss_3_online"){
                    cena.scene.stop(cena.mapa);
                    cena.hud_vida.style.display = "none";
                    cena.pagina.style.display = "block";
                    menu.style.display = "none";
                    document.getElementById("hud_boss_1").style.display = "none";
                    document.getElementById("hud_boss_2").style.display = "none";
                    document.getElementById("hud_boss_3").style.display = "none";
                    document.body.classList.remove("fundo_preto");
                    window.location.reload();
                    cena.scene.start("Jogo");
                    cena.scene.stop("Pausa");
                    return;
                }
                
                menu.style.display = "none";
                cena.scene.stop("Pausa");
                return;
            }
            else{
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                cena.scene.stop(cena.mapa);
                cena.hud_vida.style.display = "none";
                cena.pagina.style.display = "block";
                menu.style.display = "none";
                document.getElementById("hud_boss_1").style.display = "none";
                document.getElementById("hud_boss_2").style.display = "none";
                document.getElementById("hud_boss_3").style.display = "none";
                document.body.classList.remove("fundo_preto");
                window.location.reload();
                cena.scene.start("Jogo");
                cena.scene.stop("Pausa");
                return;
            }
            
        }

    }

}