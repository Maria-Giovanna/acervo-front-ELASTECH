/* =========================================================
   ACERVO – regras da senha forte
   Mostra a lista das regras embaixo do campo de senha e marca
   cada uma com ✓ enquanto a pessoa digita (ícone + texto, não só a cor).
   Usada em "Criar conta" e no cadastro de pessoas da página Empresa.
   As regras ficam em validacao.js (REGRAS_DA_SENHA).
   ========================================================= */

//MÉTODOS
// cria um item por regra e passa a atualizar a cada letra digitada
function ligarRegrasDaSenha(campoSenha, lista) {
    for (const regra of REGRAS_DA_SENHA) {
        const item = document.createElement("li");
        item.dataset.regra = regra.id;
        item.dataset.ok = "false";
        lista.append(item);
    }

    campoSenha.addEventListener("input", () => {
        atualizarRegrasDaSenha(campoSenha, lista);
    });

    atualizarRegrasDaSenha(campoSenha, lista);
}

function atualizarRegrasDaSenha(campoSenha, lista) {
    const senha = campoSenha.value;

    for (const regra of REGRAS_DA_SENHA) {
        const item = lista.querySelector(`[data-regra="${regra.id}"]`);
        const cumprida = regra.confere(senha);

        item.dataset.ok = String(cumprida);
        item.innerHTML = cumprida ? ICONES.check : ICONES.vazio;

        const texto = document.createElement("span");
        texto.textContent = cumprida ? `Tem ${regra.texto}` : `Precisa de ${regra.texto}`;
        item.append(texto);
    }
}
