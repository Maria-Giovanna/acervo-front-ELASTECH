/* =========================================================
   ACERVO – página inicial
   Tudo que é número aqui vem da API Java (GET /equipamentos, pública):
   - os cartões de vidro do hero (livres agora, lista do dia, mais procurados);
   - o catálogo: primeiro os tipos (com quantos modelos e aparelhos
     cada um tem), depois os modelos do tipo escolhido.
   ========================================================= */

//ELEMENTOS DA PÁGINA
const gradeCatalogo = document.getElementById("grade-catalogo");
const tituloCatalogo = document.getElementById("titulo-catalogo");
const textoCatalogo = document.getElementById("texto-catalogo");
const alternarCatalogo = document.getElementById("alternar-catalogo");

let modelosDaApi = [];         // as unidades da API agrupadas por modelo
let vistaAtual = "tipos";      // "tipos", "todos" ou um tipo (ex.: "NOTEBOOK")


//MÉTODOS: CARREGAR
async function carregarCatalogo() {
    mostrarEsqueletos();

    try {
        const equipamentos = await chamarApi("/equipamentos");
        modelosDaApi = agruparPorModelo(equipamentos);

        preencherHero(equipamentos);
        mostrarVista("tipos", false);
    } catch (erro) {
        mostrarVazio("Não foi possível carregar o catálogo. Confira se a API está ligada e recarregue a página.");
        document.getElementById("hero-resumo").textContent = "Não foi possível carregar.";
        mostrarAviso(erro.message, "erro");
    }
}

// cada unidade é um equipamento na API (NB-001, NB-002...). Aqui elas viram um modelo só.
function agruparPorModelo(equipamentos) {
    const grupos = new Map();

    for (const unidade of equipamentos) {
        if (!grupos.has(unidade.nome)) {
            grupos.set(unidade.nome, {
                nome: unidade.nome,
                tipo: unidade.tipo,
                unidades: []
            });
        }
        grupos.get(unidade.nome).unidades.push(unidade);
    }

    return [...grupos.values()].sort((a, b) => {
        const porTipo = ORDEM_DOS_TIPOS.indexOf(a.tipo) - ORDEM_DOS_TIPOS.indexOf(b.tipo);
        return porTipo !== 0 ? porTipo : a.nome.localeCompare(b.nome);
    });
}

function contarLivres(unidades) {
    return unidades.filter((unidade) => unidade.disponivel).length;
}


//MÉTODOS: O HERO
function preencherHero(equipamentos) {
    const livres = contarLivres(equipamentos);

    // cartão da esquerda
    document.getElementById("hero-livres").textContent = `${livres} aparelhos livres agora`;

    // cartão do meio: os 2 modelos com mais unidades livres
    // (2 e não 3, pra os três cartões do hero terem a mesma altura sem sobrar espaço vazio)
    document.getElementById("hero-resumo").textContent = `${livres} de ${equipamentos.length} aparelhos livres`;
    const destaques = [...modelosDaApi]
        .sort((a, b) => contarLivres(b.unidades) - contarLivres(a.unidades))
        .slice(0, 2)
        .map((modelo) => {
            const item = document.createElement("li");
            const textos = document.createElement("span");
            const nome = document.createElement("strong");
            nome.textContent = dadosDoProduto(modelo.nome).titulo;
            const tipo = document.createElement("span");
            tipo.className = "vidro__suave";
            tipo.textContent = NOMES_DOS_TIPOS[modelo.tipo];
            textos.append(nome, tipo);

            const pilula = document.createElement("span");
            pilula.className = "vidro__pilula";
            pilula.textContent = `${contarLivres(modelo.unidades)} de ${modelo.unidades.length}`;

            item.append(textos, pilula);
            return item;
        });
    document.getElementById("hero-lista").replaceChildren(...destaques);

    // cartão da direita: os 3 tipos com mais aparelhos
    const tipos = ORDEM_DOS_TIPOS
        .map((tipo) => ({
            tipo,
            total: equipamentos.filter((unidade) => unidade.tipo === tipo).length
        }))
        .filter((grupo) => grupo.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, 3)
        .map((grupo) => {
            const item = document.createElement("li");
            item.innerHTML = `<span>${ICONES[grupo.tipo] ?? ICONES.OUTRO}</span>`;
            item.append(String(grupo.total));
            item.setAttribute("aria-label", `${NOMES_NO_PLURAL[grupo.tipo]}: ${grupo.total} aparelhos`);
            return item;
        });
    document.getElementById("hero-tipos").replaceChildren(...tipos);
}

// o segundo botão do hero: sem login leva pra entrar; com login, direto pro catálogo
function prepararBotaoReservar() {
    const botao = document.getElementById("hero-reservar");
    if (estaLogado()) {
        botao.href = "#catalogo";
        botao.textContent = "Reservar um equipamento";
    } else {
        botao.innerHTML = ICONES.entrar;
        botao.append("Entrar para reservar");
    }
}


//MÉTODOS: O CATÁLOGO
function mostrarEsqueletos() {
    gradeCatalogo.replaceChildren();
    for (let i = 0; i < 8; i++) {
        const item = document.createElement("li");
        item.className = "esqueleto";
        item.setAttribute("aria-hidden", "true");
        gradeCatalogo.append(item);
    }
}

function mostrarVazio(mensagem) {
    const item = document.createElement("li");
    item.className = "vazio";
    item.textContent = mensagem;
    gradeCatalogo.replaceChildren(item);
}

// troca o que o catálogo mostra: os tipos, todos os modelos, ou os modelos de um tipo
function mostrarVista(vista, rolarAteOCatalogo = true) {
    vistaAtual = vista;

    if (vista === "tipos") {
        tituloCatalogo.textContent = "Do que você precisa hoje?";
        textoCatalogo.textContent = "Escolha um tipo de equipamento para ver os modelos e quantos estão livres agora.";
        trocarBotaoDaVista("Ver todos os equipamentos", ICONES.seta, false);
        gradeCatalogo.replaceChildren(...criarCartoesDeTipo());
    } else {
        const modelos = vista === "todos"
            ? modelosDaApi
            : modelosDaApi.filter((modelo) => modelo.tipo === vista);
        const aparelhos = modelos.reduce((soma, modelo) => soma + modelo.unidades.length, 0);

        tituloCatalogo.textContent = vista === "todos" ? "Todos os equipamentos" : NOMES_NO_PLURAL[vista];
        textoCatalogo.textContent = `${modelos.length} ${modelos.length === 1 ? "modelo" : "modelos"}, ${aparelhos} aparelhos. Escolha um para reservar.`;
        trocarBotaoDaVista("Ver os tipos", ICONES.setaVoltar, true);
        gradeCatalogo.replaceChildren(...modelos.map(criarCartaoDeModelo));
    }

    if (rolarAteOCatalogo) {
        document.getElementById("catalogo").scrollIntoView();
    }
}

function trocarBotaoDaVista(texto, icone, iconeAntes) {
    alternarCatalogo.textContent = texto;
    if (iconeAntes) {
        alternarCatalogo.insertAdjacentHTML("afterbegin", icone);
    } else {
        alternarCatalogo.insertAdjacentHTML("beforeend", icone);
    }
}

// um cartão por tipo que existe na API, com o número de modelos na aba
function criarCartoesDeTipo() {
    return ORDEM_DOS_TIPOS
        .map((tipo) => ({
            tipo,
            modelos: modelosDaApi.filter((modelo) => modelo.tipo === tipo)
        }))
        .filter((grupo) => grupo.modelos.length > 0)
        .map((grupo) => {
            const unidades = grupo.modelos.flatMap((modelo) => modelo.unidades);
            const livres = contarLivres(unidades);
            const qtdModelos = grupo.modelos.length;

            const cartao = montarCartao({
                elemento: "button",
                nomeDaFoto: grupo.modelos[0].nome,
                tipo: grupo.tipo,
                aba: `${qtdModelos} ${qtdModelos === 1 ? "modelo" : "modelos"}`,
                titulo: NOMES_NO_PLURAL[grupo.tipo],
                info: `${livres} de ${unidades.length} livres agora`
            });
            cartao.querySelector("button").addEventListener("click", () => mostrarVista(grupo.tipo));
            return cartao;
        });
}

// um cartão por modelo: leva à confirmação da reserva (que pede login se precisar)
function criarCartaoDeModelo(modelo) {
    const livres = contarLivres(modelo.unidades);
    const total = modelo.unidades.length;

    const cartao = montarCartao({
        elemento: livres > 0 ? "a" : "div",
        nomeDaFoto: modelo.nome,
        tipo: modelo.tipo,
        aba: NOMES_DOS_TIPOS[modelo.tipo],
        titulo: dadosDoProduto(modelo.nome).titulo,
        info: livres > 0 ? `${livres} de ${total} ${livres === 1 ? "disponível" : "disponíveis"}` : "Todas reservadas no momento"
    });

    const corpo = cartao.firstElementChild;
    if (livres > 0) {
        corpo.href = `retirada.html?modelo=${encodeURIComponent(modelo.nome)}`;
        corpo.setAttribute("aria-label", `${dadosDoProduto(modelo.nome).titulo}, ${livres} de ${total} disponíveis. Reservar`);
    } else {
        corpo.setAttribute("aria-disabled", "true");
    }
    return cartao;
}

// a peça comum dos dois cartões (o mesmo desenho da referência 3)
function montarCartao({ elemento, nomeDaFoto, tipo, aba, titulo, info }) {
    const item = document.createElement("li");
    const corpo = document.createElement(elemento);
    corpo.className = "cartao-produto";
    if (elemento === "button") {
        corpo.type = "button";
    }

    const foto = document.createElement("span");
    foto.className = "cartao-produto__foto";
    const etiquetaDaAba = document.createElement("span");
    etiquetaDaAba.className = "cartao-produto__aba";
    etiquetaDaAba.textContent = aba;
    foto.append(etiquetaDaAba);
    colocarFoto(foto, nomeDaFoto, tipo);

    const nome = document.createElement("span");
    nome.className = "titulo-cartao";
    nome.textContent = titulo;

    const detalhe = document.createElement("span");
    detalhe.className = "cartao-produto__info";
    detalhe.textContent = info;

    corpo.append(foto, nome, detalhe);
    item.append(corpo);
    return item;
}


//MÉTODOS: AVALIAÇÕES
// cada depoimento mostra a foto do equipamento que a pessoa reservou
function preencherFotosDosDepoimentos() {
    for (const depoimento of document.querySelectorAll(".depoimento")) {
        const modelo = depoimento.dataset.modelo;
        colocarFoto(depoimento.querySelector(".depoimento__foto"), modelo, dadosDoProduto(modelo).tipo);
    }
}


//INÍCIO
function iniciarPaginaInicial() {
    montarCabecalho();
    montarRodape();
    ligarPainelAcessibilidade();

    document.getElementById("hero-icone").innerHTML = ICONES.check;
    document.getElementById("icone-ajuda").innerHTML = ICONES.suporte;
    prepararBotaoReservar();
    preencherFotosDosDepoimentos();

    alternarCatalogo.addEventListener("click", () => {
        mostrarVista(vistaAtual === "tipos" ? "todos" : "tipos");
    });

    carregarCatalogo();
}

iniciarPaginaInicial();
