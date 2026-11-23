/* =========================================================
   ACERVO – avisos
   Mostra mensagens no canto da tela. mostrarAviso some sozinho;
   mostrarAvisoFixo fica até alguém chamar removerAvisoFixo.
   ========================================================= */

function caixaDeAvisos() {
    let caixa = document.querySelector(".avisos");
    if (!caixa) {
        caixa = document.createElement("div");
        caixa.className = "avisos";
        caixa.setAttribute("aria-live", "polite");
        document.body.append(caixa);
    }
    return caixa;
}

function criarAviso(mensagem, tipo) {
    const aviso = document.createElement("div");
    aviso.className = tipo === "erro" ? "aviso aviso--erro" : "aviso";

    const icone = tipo === "erro" ? ICONES.alerta : ICONES.check;
    aviso.innerHTML = icone;

    const texto = document.createElement("span");
    texto.textContent = mensagem;   // textContent: a mensagem nunca vira código na página
    aviso.append(texto);
    return aviso;
}


//MÉTODOS
function mostrarAviso(mensagem, tipo = "sucesso") {
    const aviso = criarAviso(mensagem, tipo);
    caixaDeAvisos().append(aviso);

    setTimeout(() => {
        aviso.classList.add("aviso--saindo");
        setTimeout(() => aviso.remove(), 300);
    }, 5000);
}

function mostrarAvisoFixo(id, mensagem) {
    if (document.querySelector(`[data-aviso="${id}"]`)) {
        return;   // já está na tela
    }
    const aviso = criarAviso(mensagem, "info");
    aviso.dataset.aviso = id;
    aviso.innerHTML = ICONES.relogio;
    const texto = document.createElement("span");
    texto.textContent = mensagem;
    aviso.append(texto);
    caixaDeAvisos().append(aviso);
}

function removerAvisoFixo(id) {
    document.querySelector(`[data-aviso="${id}"]`)?.remove();
}
