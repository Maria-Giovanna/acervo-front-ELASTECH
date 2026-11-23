/* =========================================================
   ACERVO – utilidades
   Funções pequenas que várias páginas usam: datas, parâmetros
   da URL e cópia de <template>.
   ========================================================= */

// "2026-12-06" vira "06/12/2026" (sem new Date, pra o fuso horário não mudar o dia)
function formatarData(dataDaApi) {
    const [ano, mes, dia] = dataDaApi.split("-");
    return `${dia}/${mes}/${ano}`;
}

// "2026-12-06" vira "06/12"
function formatarDataCurta(dataDaApi) {
    const [, mes, dia] = dataDaApi.split("-");
    return `${dia}/${mes}`;
}

// a data de hoje no formato da API: "2026-11-22"
function hojeNoFormatoDaApi() {
    const hoje = new Date();
    return paraFormatoDaApi(hoje);
}

function somarDias(dataDaApi, dias) {
    const [ano, mes, dia] = dataDaApi.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia + dias);   // o Date ajusta a virada de mês sozinho
    return paraFormatoDaApi(data);
}

function paraFormatoDaApi(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

// lê um valor da URL: em retirada.html?modelo=Mouse, lerParametro("modelo") devolve "Mouse"
function lerParametro(nome) {
    return new URLSearchParams(location.search).get(nome);
}

// copia o conteúdo de um <template> do HTML pra montar um item da lista
function copiarModelo(idDoModelo) {
    return document.getElementById(idDoModelo).content.firstElementChild.cloneNode(true);
}
