/* =========================================================
   ACERVO – campos de formulário
   Mostra e limpa a mensagem de erro embaixo do campo certo
   e liga o botão "Mostrar" da senha.
   ========================================================= */

// o campo ganha aria-invalid (o leitor de tela anuncia) e a mensagem aparece embaixo
function mostrarErro(entrada, mensagem) {
    const caixaDoErro = document.getElementById(`${entrada.id}-erro`);
    entrada.setAttribute("aria-invalid", "true");
    caixaDoErro.innerHTML = ICONES.alerta;

    const texto = document.createElement("span");
    texto.textContent = mensagem;
    caixaDoErro.append(texto);
    caixaDoErro.hidden = false;
}

function limparErro(entrada) {
    const caixaDoErro = document.getElementById(`${entrada.id}-erro`);
    entrada.removeAttribute("aria-invalid");
    caixaDoErro.hidden = true;
    caixaDoErro.textContent = "";
}

// confere um campo com a função de validação e mostra ou limpa o erro; devolve true se passou
function conferirCampo(entrada, validar) {
    const mensagem = validar(entrada.value);
    if (mensagem) {
        mostrarErro(entrada, mensagem);
        return false;
    }
    limparErro(entrada);
    return true;
}

// o erro aparece quando a pessoa sai do campo, e some assim que ela corrige
function ligarValidacaoAoVivo(campo, validar) {
    campo.addEventListener("blur", () => {
        if (campo.value !== "") {
            conferirCampo(campo, validar);
        }
    });

    campo.addEventListener("input", () => {
        const estaComErro = campo.getAttribute("aria-invalid") === "true";
        if (estaComErro) {
            conferirCampo(campo, validar);
        }
    });
}

function ligarMostrarSenha(entrada, botao) {
    botao.addEventListener("click", () => {
        const estaEscondida = entrada.type === "password";
        entrada.type = estaEscondida ? "text" : "password";
        botao.textContent = estaEscondida ? "Ocultar" : "Mostrar";
        botao.setAttribute("aria-pressed", String(estaEscondida));
    });
}

// botão em espera: troca o texto e bloqueia outro clique
function botaoEsperando(botao, textoDeEspera) {
    botao.dataset.textoOriginal = botao.textContent;
    botao.textContent = textoDeEspera;
    botao.disabled = true;
    botao.setAttribute("aria-busy", "true");
}

function botaoLiberado(botao) {
    botao.textContent = botao.dataset.textoOriginal;
    botao.disabled = false;
    botao.removeAttribute("aria-busy");
}
