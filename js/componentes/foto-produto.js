/* =========================================================
   ACERVO – foto do produto
   Coloca a foto do modelo no começo de uma caixa (sem apagar o
   que já está dentro dela, como a chamada "Pegar emprestado").
   Se a foto ainda não existe em img/produtos/, mostra o ícone do tipo.
   ========================================================= */

function colocarFoto(caixa, nomeDoModelo, tipo) {
    const produto = dadosDoProduto(nomeDoModelo);
    const iconeDoTipo = ICONES[tipo] ?? ICONES.OUTRO;

    // tira a foto ou o ícone antigo e coloca o ícone no lugar
    function trocarPorIcone() {
        caixa.querySelector(":scope > img, :scope > svg")?.remove();
        caixa.insertAdjacentHTML("afterbegin", iconeDoTipo);
    }

    if (!produto.imagem) {
        trocarPorIcone();
        return;
    }

    const foto = document.createElement("img");
    foto.src = `img/produtos/${produto.imagem}`;
    foto.alt = produto.titulo;
    foto.loading = "lazy";
    foto.width = 600;
    foto.height = 600;

    // a foto não carregou (ainda não foi colocada na pasta): troca pelo ícone
    foto.addEventListener("error", trocarPorIcone);

    caixa.querySelector(":scope > img, :scope > svg")?.remove();
    caixa.prepend(foto);
}
