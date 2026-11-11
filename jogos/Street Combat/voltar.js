/* Botão "Voltar ao site" do Street Combat.
 * - Aparece em todas as telas (menu, login, modos, lobby, partida, pausa, morte, vitória).
 * - Durante a partida pede confirmação antes de sair, para não perder o progresso sem querer.
 * - Não deixa o Enter/Espaço do jogo acionar o link por acidente. */
(function () {
    var link = document.getElementById("voltar_jogos");
    if (!link) return;

    function emPartida() {
        return document.body.classList.contains("em-gameplay");
    }

    link.addEventListener("click", function (e) {
        if (emPartida() && !window.confirm("Sair do jogo e voltar ao site?\nO progresso desta partida será perdido.")) {
            e.preventDefault();
        }
        link.blur(); // o jogo usa o teclado: o link não pode ficar com o foco
    });

    link.addEventListener("keydown", function (e) {
        if (emPartida() && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            link.blur();
        }
    });
})();
