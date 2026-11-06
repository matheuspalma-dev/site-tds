let aviso_nome = document.getElementById("nome_menor");
document.documentElement.style.setProperty("--blur", "0px");

document.getElementById("ok_nome").onclick = ()=>{
    document.documentElement.style.setProperty("--blur", "0px");
    aviso_nome.style.display = "none";
}

let sala;

let enviando_cadastro = false; // trava contra reenvio duplicado (clique duplo / Enter repetido)

document.querySelector("#cadastro").addEventListener("submit", async(event)=>{
    event.preventDefault();

    if(enviando_cadastro) return;
    enviando_cadastro = true;
    let botao_cadastro = event.submitter; // botao que disparou o submit, se houver
    if(botao_cadastro) botao_cadastro.disabled = true;

    try{
        let nome = document.getElementById("nome_cadastro").value;
        if(nome.length > 15){
            document.documentElement.style.setProperty("--blur", "10px");
            aviso_nome.style.display = "flex";
            console.log("escreva um nome menor");
            return;
        }
        let email = document.getElementById("email_cadastro").value;
        let senha = document.getElementById("senha_cadastro").value;

        nome = nome.toLowerCase().trim();
        email = email.toLowerCase().trim();
        senha = senha.trim();

        let cadastro = await fetch("http://192.168.0.10:8080/usuario/cadastro", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                email:email,
                senha:senha
            })
        })

        let resposta = await cadastro.json();
        console.log("cadastro: " , resposta);
        console.log(resposta.nome);
        console.log(resposta.id);
        console.log(resposta.banido);

        if(!resposta.nome || !resposta.id){
            console.log("deu erro")
        }
        else{
            sessionStorage.setItem("usuario", JSON.stringify({ 
                id: resposta.id,
                nome:resposta.nome
            }))
            document.getElementById("menu_cadastro").reset();
            sessionStorage.setItem("usuario", JSON.stringify({ 
                id: resposta.id,
                nome:resposta.nome
            }))
            window.location.href = "jogo.html";
            return;
        }
    }
    catch(erro){
        console.log(erro);
        console.log("deu algum problema no servidor");
    }
    finally{
        enviando_cadastro = false;
        if(botao_cadastro) botao_cadastro.disabled = false;
    }
})

let enviando_login = false; // trava contra reenvio duplicado (clique duplo / Enter repetido)

document.getElementById("login").addEventListener("submit", async(event)=>{
    event.preventDefault();

    if(enviando_login) return;
    enviando_login = true;
    let botao_login = event.submitter;
    if(botao_login) botao_login.disabled = true;

    try{
        let nome = document.getElementById("nome_login").value;
        let senha = document.getElementById("senha_login").value;

        let login = await fetch("http://192.168.0.10:8080/usuario/login", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                senha:senha
            })
        })

        let resposta = await login.json();
        console.log("login: " , resposta);
        console.log(resposta.nome);
        console.log(resposta.id);
        console.log(resposta.banido);
        if(!resposta.nome || !resposta.id){
            console.log("deu erro")
            return;
        }
        else if(resposta.banido){
            console.log("foi banido")
        }
        else{
            document.getElementById("menu_login").reset();
            console.log("deu certo");
            sessionStorage.setItem("usuario", JSON.stringify({ 
                id: resposta.id,
                nome:resposta.nome
            }))
            window.location.href = "jogo.html";
            return;
        }
    }
    catch(erro){
        console.log(erro);
        console.log("deu algum problema no servidor");
    }
    finally{
        enviando_login = false;
        if(botao_login) botao_login.disabled = false;
    }
    
})