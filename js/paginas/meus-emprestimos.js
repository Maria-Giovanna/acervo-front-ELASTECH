/* =========================================================
   ACERVO – página "Meus empréstimos"
   Lista os empréstimos de quem está logado (GET /emprestimos/meus),
   separa o que está com a pessoa do que já voltou e devolve
   (PUT /emprestimos/{id}/devolucao).
   ========================================================= */

//ELEMENTOS DA PÁGINA
const resumoEmprestimos = document.getElementById("resumo-emprestimos");
const listaAbertos = document.getElementById("lista-abertos");
const listaHistorico = document.getElementById("lista-historico");


//MÉTODOS: CARREGAR
async function carregarEmprestimos() {
    try {
        const emprestimos = await chamarApi("/emprestimos/meus");

        const abertos = emprestimos.filter((emprestimo) => emprestimo.dataDevolucao === null);
        const devolvidos = emprestimos
            .filter((emprestimo) => emprestimo.dataDevolucao !== null)
            .sort((a, b) => b.dataDevolucao.localeCompare(a.dataDevolucao));   // o mais recente primeiro

        mostrarResumo(abertos);
        mostrarLista(listaAbertos, abertos, "Você não está com nenhum equipamento agora.");
        mostrarLista(listaHistorico, devolvidos, "Nada no histórico ainda.");
    } catch (erro) {
        resumoEmprestimos.textContent = "Não foi possível carregar os seus empréstimos.";
        mostrarAviso(erro.message, "erro");
    }
}


//MÉTODOS: MOSTRAR
function mostrarResumo(abertos) {
    if (abertos.length === 0) {
        resumoEmprestimos.textContent = "Nenhum equipamento com você agora. Quando precisar, é só reservar pelo catálogo.";
        return;
    }

    const atrasado = abertos.some((emprestimo) => emprestimo.atrasado);
    if (atrasado) {
        resumoEmprestimos.textContent = "Tem um equipamento com o prazo vencido. Devolva para poder reservar outro.";
    } else {
        resumoEmprestimos.textContent = "Um equipamento por vez: devolva este para reservar outro.";
    }
}

function mostrarLista(lista, emprestimos, mensagemVazia) {
    if (emprestimos.length === 0) {
        const item = document.createElement("li");
        item.className = "vazio";
        item.textContent = mensagemVazia;
        lista.replaceChildren(item);
        return;
    }
    lista.replaceChildren(...emprestimos.map(criarItemEmprestimo));
}

function criarItemEmprestimo(emprestimo) {
    const item = copiarModelo("modelo-emprestimo");
    const equipamento = emprestimo.equipamento;
    const produto = dadosDoProduto(equipamento.nome);

    colocarFoto(item.querySelector(".emprestimo__foto"), equipamento.nome, equipamento.tipo);
    item.querySelector(".emprestimo__nome").textContent = produto.titulo;
    item.querySelector(".emprestimo__datas").textContent =
        `Retirado em ${formatarData(emprestimo.dataEmprestimo)}. Unidade ${equipamento.patrimonio}.`;

    preencherSelo(item.querySelector(".selo"), emprestimo);

    const botaoDevolver = item.querySelector(".emprestimo__devolver");
    if (emprestimo.dataDevolucao !== null) {
        botaoDevolver.remove();   // já voltou: não tem o que devolver
    } else {
        botaoDevolver.setAttribute("aria-label", `Devolver ${produto.titulo}`);
        botaoDevolver.addEventListener("click", () => devolver(emprestimo, botaoDevolver));
    }

    return item;
}

// três situações, cada uma com ícone e texto próprios
function preencherSelo(selo, emprestimo) {
    let icone;
    let texto;

    if (emprestimo.dataDevolucao !== null) {
        selo.classList.add("selo--devolvido");
        icone = ICONES.devolvido;
        texto = `Devolvido em ${formatarData(emprestimo.dataDevolucao)}`;
    } else if (emprestimo.atrasado) {
        selo.classList.add("selo--atrasado");
        icone = ICONES.alerta;
        const dias = emprestimo.diasAtrasados;
        texto = `Atrasado há ${dias} ${dias === 1 ? "dia" : "dias"}`;
    } else {
        selo.classList.add("selo--no-prazo");
        icone = ICONES.relogio;
        texto = `Devolva até ${formatarData(emprestimo.dataPrevistaDevolucao)}`;
    }

    selo.innerHTML = icone;
    const span = document.createElement("span");
    span.textContent = texto;
    selo.append(span);
}


//MÉTODOS: DEVOLVER
async function devolver(emprestimo, botao) {
    botaoEsperando(botao, "Devolvendo…");

    try {
        await chamarApi(`/emprestimos/${emprestimo.id}/devolucao`, {
            method: "PUT"
        });
        mostrarAviso("Devolução registrada. Obrigado!");
        carregarEmprestimos();
    } catch (erro) {
        mostrarAviso(erro.message, "erro");
        botao.textContent = "Devolver";
        botao.disabled = false;
        botao.removeAttribute("aria-busy");
    }
}

// mesma ideia do botaoEsperando do campos.js (esta página não carrega formulários)
function botaoEsperando(botao, textoDeEspera) {
    botao.textContent = textoDeEspera;
    botao.disabled = true;
    botao.setAttribute("aria-busy", "true");
}


//INÍCIO
function iniciarMeusEmprestimos() {
    montarCabecalho();
    montarRodape();
    ligarPainelAcessibilidade();

    if (!exigirLogin()) {
        return;
    }
    carregarEmprestimos();
}

iniciarMeusEmprestimos();
