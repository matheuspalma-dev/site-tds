import { menu_sfx } from "./funcoes.js"

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload(){
        menu_sfx(this);
        this.load.audio("musica_menu", "assets/conteudo/sons/musicas/menu.mp3");
    }
    
    create() {

        this.gamepad = null;
        this.proximo_movimento_permitido = 0;

        let volume_atual = Number(sessionStorage.getItem("volume") ?? 50);

        this.musica = this.sound.add("musica_menu", {
            loop:true,
            volume: volume_atual/100
        })

        if(sessionStorage.getItem("som") !== "desligado"){
            this.musica.play();
        }

        let sfx_ligado = sessionStorage.getItem("sfx") !== "desligado";

        let usuario = JSON.parse(sessionStorage.getItem("usuario"));

        if(window.location.pathname.includes("jogo.html")){
            this.scene.start('Jogo');
            return;
        }
        
        // this.tela_atual = 1;
        
        const inicio = document.getElementById("auxiliar");
        inicio.style.display = "flex";

        const botao_jogar = document.getElementById("jogar");
        const botao_como_joga = document.getElementById("como_joga");
        const botao_configuracoes = document.getElementById("configuracoes");
        const botao_creditos = document.getElementById("creditos");

        botao_jogar.classList.add("setas");
        botao_como_joga.classList.remove("setas");
        botao_configuracoes.classList.remove("setas");
        botao_creditos.classList.remove("setas");

        const lugar_login = document.getElementById("login");
        const lugar_cadastro = document.getElementById("cadastro");

        const botao_para_login = document.getElementById("botao_ir_login");
        const botao_para_cadastro = document.getElementById("botao_ir_cadastro");

        botao_para_login.onclick = ()=>{
            lugar_cadastro.style.display = "none";
            lugar_login.style.display = "flex";
        }

        botao_para_cadastro.onclick = ()=>{
            lugar_cadastro.style.display = "flex";
            lugar_login.style.display = "none";
        }


        const menu_de_configuracoes = document.getElementById("menu_configuracoes");

        const som = document.getElementById("musica");
        const mudar_som = document.getElementById("volume");
        const tirar_sfx = document.getElementById("sfx");

        const atualizar_config = ()=>{
            const musica_on = sessionStorage.getItem("som") !== "desligado";
            som.classList.toggle("ligada", musica_on);
            som.innerText = musica_on ? "< On >" : "< Off >";

            mudar_som.textContent = `< ${volume_atual}% >`;

            tirar_sfx.classList.toggle("ligada", sfx_ligado);
            tirar_sfx.innerText = sfx_ligado ? "< On >" : "< Off >";
        };
        atualizar_config();


        const menu_de_creditos = document.getElementById("menu_creditos");



        //o x é para voltar!!!

        function voltar(cena){
            if(sfx_ligado){
                cena.sound.play("selecionando");
            }
            inicio.style.display = "flex";
            botao_jogar.classList.remove("setas");
            menu_de_configuracoes.style.display = "none";
            lugar_login.style.display = "none";
            lugar_cadastro.style.display = "none";
            menu_de_creditos.style.display = "none";
            botao_jogar.classList.add("setas");
        }

        this.input.keyboard.on("keydown-X",()=>{
            voltar(this);
        });

        //funcoes para subir e descer as setinhas

        this.input.keyboard.on("keydown-S",()=>{
            mover_baixo(this);
        });

        this.input.keyboard.on("keydown-DOWN", ()=>{
            mover_baixo(this);
        });

        this.input.keyboard.on("keydown-W", ()=>{
            mover_cima(this);
        })

        this.input.keyboard.on("keydown-UP", ()=>{
            mover_cima(this);
        });

        this.input.keyboard.on("keydown-LEFT", ()=>{
            mover_esquerda(this);
        })
        this.input.keyboard.on("keydown-A", ()=>{
            mover_esquerda(this);
        })

        this.input.keyboard.on("keydown-RIGHT", ()=>{
            mover_direita(this);
        })
        this.input.keyboard.on("keydown-D", ()=>{
            mover_direita(this);
        })

        //CONTROLE DE PS4: X confirma, B (circulo) volta, analogico e direcionais navegam

        if(this.input.gamepad){

            if(this.input.gamepad.total > 0){
                this.gamepad = this.input.gamepad.getPad(0);
            }

            this.input.gamepad.on("connected", (pad)=>{
                this.gamepad = pad;
            });

            this.input.gamepad.on("down", (pad, button)=>{
                if(button.index === 0){
                    confirmar(this);
                }
                else if(button.index === 1){
                    voltar(this);
                }
            });
        }

        function mover_cima(cena){
            if(botao_jogar.classList.contains("setas")){
                botao_jogar.classList.remove("setas");
                botao_creditos.classList.add("setas");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                
                // cena.sound.play("movendo_menu_2");
                return;
            }
            else if(botao_como_joga.classList.contains("setas")){
                botao_como_joga.classList.remove("setas");
                botao_jogar.classList.add("setas");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                // cena.sound.play("movendo_menu_2");
                return;
            }
            else if(botao_configuracoes.classList.contains("setas")){
                botao_configuracoes.classList.remove("setas");
                botao_como_joga.classList.add("setas");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                // cena.sound.play("movendo_menu_2");
                return;
            }
            else if(botao_creditos.classList.contains("setas")){
                botao_creditos.classList.remove("setas");
                botao_configuracoes.classList.add("setas");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                // cena.sound.play("movendo_menu_2");
                return;
            }
            else if(som.classList.contains("configurando")){
                som.classList.remove("configurando");
                tirar_sfx.classList.add("configurando");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(mudar_som.classList.contains("configurando")){
                mudar_som.classList.remove("configurando");
                som.classList.add("configurando");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(tirar_sfx.classList.contains("configurando")){
                tirar_sfx.classList.remove("configurando");
                mudar_som.classList.add("configurando");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
        }

        function mover_baixo(cena){
            if(botao_jogar.classList.contains("setas")){
                botao_jogar.classList.remove("setas");
                botao_como_joga.classList.add("setas");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                return;
            }
            else if(botao_como_joga.classList.contains("setas")){
                botao_como_joga.classList.remove("setas");
                botao_configuracoes.classList.add("setas")
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                return;
            }
            else if(botao_configuracoes.classList.contains("setas")){
                botao_configuracoes.classList.remove("setas");
                botao_creditos.classList.add("setas");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                return;
            }
            else if(botao_creditos.classList.contains("setas")){
                botao_creditos.classList.remove("setas");
                botao_jogar.classList.add("setas");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
                return;
            }
            else if(som.classList.contains("configurando")){
                som.classList.remove("configurando");
                mudar_som.classList.add("configurando");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(mudar_som.classList.contains("configurando")){
                mudar_som.classList.remove("configurando");
                tirar_sfx.classList.add("configurando");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            else if(tirar_sfx.classList.contains("configurando")){
                tirar_sfx.classList.remove("configurando");
                som.classList.add("configurando");
                if(sfx_ligado){
                    cena.sound.play("movendo_menu");
                }
            }
            
        }

        //AQUI VERIFICA EM QUAL BOTAO VC TA QUANDO APERTA Z

        function confirmar(cena){

            //caso clique em jogar
            if(botao_jogar.classList.contains("setas")){
                botao_jogar.classList.remove("setas");
                inicio.style.display = "none";
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                botao_jogar.classList.remove("setas");
                window.location.href = "jogo.html";
                // if(usuario){
                //     window.location.href = "jogo.html";
                // }
                // else{
                //     lugar_login.style.display = "flex";
                // } 
                return;
            }
            //caso clique em como jogar
            else if(botao_como_joga.classList.contains("setas")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                
                window.location.href = "jogo.html?tutorial=true";
                // window.location.href = "jogo.html";
                // this.scene.start("Tutorial");
                botao_como_joga.classList.remove("setas");
                
                return;
            }
            //caso clique em configuracoes
            else if(botao_configuracoes.classList.contains("setas")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                botao_configuracoes.classList.remove("setas");
                inicio.style.display = "none";
                botao_jogar.classList.remove("setas");
                botao_como_joga.classList.remove("setas");
                botao_configuracoes.classList.remove("setas");
                botao_creditos.classList.remove("setas");
                menu_de_configuracoes.style.display = "flex";
                atualizar_config();
                som.classList.add("configurando");
                mudar_som.classList.remove("configurando");
                tirar_sfx.classList.remove("configurando");
                return;
            }
            //caso clique em creditos
            else if(botao_creditos.classList.contains("setas")){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                botao_creditos.classList.remove("setas");
                inicio.style.display = "none";
                botao_jogar.classList.remove("setas");
                botao_como_joga.classList.remove("setas");
                botao_configuracoes.classList.remove("setas");
                botao_creditos.classList.remove("setas");
                menu_de_creditos.style.display = "flex";
                return;
            }
            
            else if(lugar_login.style.display === "flex"){
                if(sfx_ligado){
                    cena.sound.play("selecionando");
                }
                lugar_login.style.display = "none";
                window.location.href = "jogo.html";
                botao_jogar.classList.remove("setas");
                botao_como_joga.classList.remove("setas");
                botao_configuracoes.classList.remove("setas");
                botao_creditos.classList.remove("setas");
                return;
                
            }
            
            
        }

        this.input.keyboard.on("keydown-Z",()=>{
            confirmar(this);
        })

        //chaves do sessionStorage (iguais na pausa): "som" = musica, "sfx" = efeitos, "volume"

        function alterna_musica(cena){
            if(sfx_ligado){
                cena.sound.play("movendo_menu");
            }
            if(som.classList.contains("ligada")){
                som.classList.remove("ligada");
                sessionStorage.setItem("som", "desligado");
                som.innerText = "< Off >";
                cena.musica.pause();
            }
            else{
                som.classList.add("ligada");
                sessionStorage.setItem("som", "ligado");
                som.innerText = "< On >";
                if(cena.musica.isPaused){
                    cena.musica.resume();
                }
                else if(!cena.musica.isPlaying){
                    cena.musica.play();
                }
            }
        }

        function alterna_sfx(cena){
            if(sfx_ligado){
                cena.sound.play("movendo_menu");
            }
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
            if(sfx_ligado){
                cena.sound.play("movendo_menu");
            }
            volume_atual += quanto;
            if(volume_atual < 0){
                volume_atual = 0;
            }
            if(volume_atual > 100){
                volume_atual = 100;
            }
            mudar_som.textContent = `< ${volume_atual}% >`;
            sessionStorage.setItem("volume", volume_atual);
            cena.musica.setVolume(volume_atual/100);
        }

        function mover_esquerda(cena){
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

        function mover_direita(cena){
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

        this.mover_cima = mover_cima;
        this.mover_baixo = mover_baixo;
        this.mover_esquerda = mover_esquerda;
        this.mover_direita = mover_direita;

        this.events.on("shutdown", () => {
            if(this.musica){
                this.musica.stop();
            }

            this.input.keyboard.removeAllListeners();

            if(this.input.gamepad){
                this.input.gamepad.removeAllListeners();
            }
        });

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
            this.mover_cima(this);
            this.proximo_movimento_permitido = time + cooldown_navegacao;
        }
        else if(baixo){
            this.mover_baixo(this);
            this.proximo_movimento_permitido = time + cooldown_navegacao;
        }

        if(esquerda){
            this.mover_esquerda(this);
            this.proximo_movimento_permitido = time + cooldown_navegacao;
        }
        else if(direita){
            this.mover_direita(this);
            this.proximo_movimento_permitido = time + cooldown_navegacao;
        }
    }
    
    
}