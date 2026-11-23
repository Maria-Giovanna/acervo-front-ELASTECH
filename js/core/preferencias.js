/* =========================================================
   ACERVO – preferências de acessibilidade
   Lê, guarda e aplica tamanho do texto, tema e modo de visão.
   Este arquivo é carregado no <head>, antes da página aparecer,
   pra a tela já nascer com as cores e o tamanho certos.
   ========================================================= */

const CHAVE_PREFERENCIAS = "acervo-preferencias";

const PREFERENCIAS_PADRAO = {
    fonte: "2",          // 1 = menor, 2 = normal, 3 = maior, 4 = muito maior
    tema: "sistema",     // claro, escuro ou sistema
    visao: "padrao"      // padrao, vermelho-verde, azul-amarelo ou cinza
};


//MÉTODOS
function lerPreferencias() {
    try {
        const guardadas = JSON.parse(localStorage.getItem(CHAVE_PREFERENCIAS));
        return { ...PREFERENCIAS_PADRAO, ...guardadas };
    } catch {
        return { ...PREFERENCIAS_PADRAO };   // navegador sem armazenamento: usa o padrão
    }
}

function salvarPreferencias(preferencias) {
    try {
        localStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(preferencias));
    } catch {
        // sem armazenamento: vale só até fechar a página
    }
}

// as escolhas viram atributos no <html>, e o tokens.css faz o resto
function aplicarPreferencias(preferencias) {
    const raiz = document.documentElement;
    raiz.dataset.fonte = preferencias.fonte;
    raiz.dataset.visao = preferencias.visao;

    if (preferencias.tema === "sistema") {
        delete raiz.dataset.tema;
    } else {
        raiz.dataset.tema = preferencias.tema;
    }
}


//INÍCIO: aplica antes de desenhar a página
aplicarPreferencias(lerPreferencias());
