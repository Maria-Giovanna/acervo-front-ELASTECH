/* =========================================================
   ACERVO – confirmar reserva
   Mostra o equipamento escolhido (a primeira unidade livre do
   modelo), os dados de quem entrou e as datas. Ao confirmar:
   POST /emprestimos com o id da unidade. As datas de verdade
   quem decide é a API; aqui é só a prévia.
   ========================================================= */

//ELEMENTOS DA PÁGINA
const carregando = document.getElementById("carregando");
const reserva = document.getElementById("reserva");
const reservaErro = document.getElementById("reserva-erro");
const botaoConfirmar = document.getElementById("botao-confirmar");
const estadoSucesso = document.getElementById("estado-sucesso");
const estadoIndisponivel = document.getElementById("estado-indisponivel");

let unidadeEscolhida = null;   // a unidade que vai ser emprestada (ex.: NB-002)


//MÉTODOS: CARREGAR
async function carregarReserva() {
    const nomeDoModelo = lerParametro("modelo");
    if (!nomeDoModelo) {
        mostrarIndisponivel("Nenhum equipamento escolhido", "Volte ao catálogo e escolha o que você precisa.");
        return;
    }

    try {
        const equipamentos = await chamarApi("/equipamentos");
        const unidadesDoModelo = equipamentos.filter((unidade) => unidade.nome === nomeDoModelo);
        const unidadeLivre = unidadesDoModelo.find((unidade) => unidade.disponivel);

        if (unidadesDoModelo.length === 0) {
            mostrarIndisponivel("Equipamento não encontrado", "Esse modelo não está mais no catálogo.");
        } else if (!unidadeLivre) {
            mostrarIndisponivel("Todas as unidades estão reservadas", "Alguém reservou a última unidade desse modelo. Escolha outro ou volte mais tarde.");
        } else {
            preencherReserva(unidadeLivre, lerUsuario());
        }
    } catch (erro) {
        mostrarIndisponivel("Não foi possível carregar", erro.message);
    }
}


//MÉTODOS: MOSTRAR
function preencherReserva(unidade, usuario) {
    unidadeEscolhida = unidade;
    const produto = dadosDoProduto(unidade.nome);

    colocarFoto(document.getElementById("reserva-foto"), unidade.nome, unidade.tipo);
    document.getElementById("reserva-tipo").textContent = NOMES_DOS_TIPOS[unidade.tipo] ?? unidade.tipo;
    document.getElementById("reserva-nome").textContent = produto.titulo;
    document.getElementById("reserva-unidade").textContent = `Unidade ${unidade.patrimonio}`;

    const destaques = produto.destaques.map((texto) => {
        const item = document.createElement("li");
        item.textContent = texto;
        return item;
    });
    document.getElementById("reserva-destaques").replaceChildren(...destaques);

    document.getElementById("reserva-pessoa").textContent = usuario.nome;
    document.getElementById("reserva-email").textContent = usuario.email;

    // a prévia das datas (a API calcula as mesmas com o PRAZO_EM_DIAS)
    const hoje = hojeNoFormatoDaApi();
    document.getElementById("reserva-retirada").textContent = `Hoje, ${formatarData(hoje)}`;
    document.getElementById("reserva-devolucao").textContent = formatarData(somarDias(hoje, PRAZO_EM_DIAS));

    carregando.hidden = true;
    reserva.hidden = false;
}

function mostrarIndisponivel(titulo, texto) {
    document.getElementById("indisponivel-icone").innerHTML = ICONES.cadeado;
    document.getElementById("indisponivel-titulo").textContent = titulo;
    document.getElementById("indisponivel-texto").textContent = texto;
    carregando.hidden = true;
    reserva.hidden = true;
    estadoIndisponivel.hidden = false;
}


//MÉTODOS: CONFIRMAR
async function confirmarReserva() {
    reservaErro.hidden = true;
    botaoEsperando(botaoConfirmar, "Confirmando…");

    try {
        const emprestimo = await chamarApi("/emprestimos", {
            method: "POST",
            body: JSON.stringify({
                equipamentoId: unidadeEscolhida.id
            })
        });
        mostrarSucesso(emprestimo);
    } catch (erro) {
        // R10 (atrasado), R11 (já tem um) ou a unidade acabou de ser reservada por outra pessoa
        reservaErro.innerHTML = ICONES.alerta;
        const texto = document.createElement("span");
        texto.textContent = erro.message;
        reservaErro.append(texto);
        reservaErro.hidden = false;
        botaoLiberado(botaoConfirmar);
    }
}

function mostrarSucesso(emprestimo) {
    const produto = dadosDoProduto(emprestimo.equipamento.nome);
    document.getElementById("sucesso-icone").innerHTML = ICONES.check;
    document.getElementById("sucesso-texto").textContent =
        `${produto.titulo} (unidade ${emprestimo.equipamento.patrimonio}) está reservado para você. Retire hoje e devolva até ${formatarData(emprestimo.dataPrevistaDevolucao)}.`;

    // os passos andam: Confirmar vira feito, Pronto vira o atual
    const passoConfirmar = document.getElementById("passo-confirmar");
    passoConfirmar.removeAttribute("data-atual");
    passoConfirmar.dataset.feito = "true";
    document.getElementById("passo-pronto").dataset.atual = "true";

    reserva.hidden = true;
    estadoSucesso.hidden = false;
    document.getElementById("link-voltar").hidden = true;
    document.getElementById("sucesso-titulo").focus();   // o leitor de tela anuncia o resultado
    mostrarAviso("Reserva confirmada.");
}


//INÍCIO
function iniciarReserva() {
    montarCabecalho();
    montarRodape();
    ligarPainelAcessibilidade();

    const linkVoltar = document.getElementById("link-voltar");
    linkVoltar.innerHTML = ICONES.setaVoltar;
    linkVoltar.append("Voltar ao catálogo");

    if (!exigirLogin()) {
        return;   // sem login: vai pra tela de entrar e volta pra cá depois
    }

    botaoConfirmar.addEventListener("click", confirmarReserva);
    carregarReserva();
}

iniciarReserva();
