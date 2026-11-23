/* =========================================================
   ACERVO – painel de acessibilidade (comportamento)
   Marca as opções que já estavam salvas e, a cada troca,
   aplica na hora e guarda pra próxima visita.
   ========================================================= */

function ligarPainelAcessibilidade() {
    const painel = document.getElementById("painel-acessibilidade");
    const preferencias = lerPreferencias();

    // marca o que já estava escolhido
    for (const [nome, valor] of Object.entries(preferencias)) {
        const opcao = painel.querySelector(`input[name="${nome}"][value="${valor}"]`);
        if (opcao) {
            opcao.checked = true;
        }
    }

    // qualquer troca dentro do painel: aplica e salva
    painel.addEventListener("change", (evento) => {
        const atualizadas = {
            ...lerPreferencias(),
            [evento.target.name]: evento.target.value
        };
        aplicarPreferencias(atualizadas);
        salvarPreferencias(atualizadas);
    });
}
