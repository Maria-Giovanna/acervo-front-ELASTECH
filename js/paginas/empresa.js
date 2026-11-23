/* =========================================================
   ACERVO – área da empresa (só ADMIN)
   Cadastra equipamento (POST /equipamentos) e pessoa
   (POST /colaboradores) com validação no navegador, e mostra a
   tabela de todas as unidades. A API também confere o perfil:
   se alguém abrir esta página sem ser ADMIN, ela responde 403.
   ========================================================= */

//ELEMENTOS DA PÁGINA
const formEquipamento = document.getElementById("form-equipamento");
const campoPatrimonio = document.getElementById("patrimonio");
const campoNomeEquipamento = document.getElementById("nome-equipamento");
const campoTipo = document.getElementById("tipo");
const listaModelos = document.getElementById("lista-modelos");

const formPessoa = document.getElementById("form-pessoa");
const campoNomePessoa = document.getElementById("nome-pessoa");
const campoEmailPessoa = document.getElementById("email-pessoa");
const campoCargoPessoa = document.getElementById("cargo-pessoa");
const campoSenhaPessoa = document.getElementById("senha-pessoa");
const listaRegrasSenha = document.getElementById("regras-senha");

const corpoTabela = document.getElementById("corpo-tabela");
const resumoUnidades = document.getElementById("resumo-unidades");

let equipamentosCadastrados = [];


//MÉTODOS: TABELA DE UNIDADES
async function carregarUnidades() {
    try {
        equipamentosCadastrados = await chamarApi("/equipamentos");
        mostrarTabela(equipamentosCadastrados);
        preencherListaDeModelos(equipamentosCadastrados);
    } catch (erro) {
        mostrarAviso(erro.message, "erro");
    }
}

function mostrarTabela(equipamentos) {
    const linhas = equipamentos.map((unidade) => {
        const linha = document.createElement("tr");

        const colunas = [
            unidade.patrimonio,
            dadosDoProduto(unidade.nome).titulo,
            NOMES_DOS_TIPOS[unidade.tipo] ?? unidade.tipo
        ];
        for (const valor of colunas) {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.append(celula);
        }

        const celulaSituacao = document.createElement("td");
        celulaSituacao.append(criarSeloDeSituacao(unidade.disponivel));
        linha.append(celulaSituacao);
        return linha;
    });

    corpoTabela.replaceChildren(...linhas);

    const livres = equipamentos.filter((unidade) => unidade.disponivel).length;
    resumoUnidades.textContent = `${equipamentos.length} unidades, ${livres} disponíveis`;
}

function criarSeloDeSituacao(disponivel) {
    const selo = document.createElement("span");
    selo.className = disponivel ? "selo selo--disponivel" : "selo selo--emprestado";
    selo.innerHTML = disponivel ? ICONES.check : ICONES.cadeado;
    selo.append(disponivel ? "Disponível" : "Emprestado");
    return selo;
}

// os modelos que já existem viram sugestões no campo "Modelo"
function preencherListaDeModelos(equipamentos) {
    const nomes = [...new Set(equipamentos.map((unidade) => unidade.nome))];
    listaModelos.replaceChildren(...nomes.map((nome) => new Option("", nome)));
}

function preencherTipos() {
    const primeira = new Option("Escolha o tipo", "");
    const opcoes = ORDEM_DOS_TIPOS.map((tipo) => new Option(NOMES_DOS_TIPOS[tipo], tipo));
    campoTipo.replaceChildren(primeira, ...opcoes);
}

// escolheu um modelo que já existe: o tipo é preenchido sozinho
function completarTipoDoModelo() {
    const existente = equipamentosCadastrados.find((unidade) => unidade.nome === campoNomeEquipamento.value);
    if (existente) {
        campoTipo.value = existente.tipo;
        limparErro(campoTipo);
    }
}


//MÉTODOS: CADASTRAR EQUIPAMENTO
async function cadastrarEquipamento(evento) {
    evento.preventDefault();

    const patrimonioOk = conferirCampo(campoPatrimonio, (texto) => validarObrigatorio(texto, "Digite o patrimônio, como NB-006."));
    const nomeOk = conferirCampo(campoNomeEquipamento, (texto) => validarObrigatorio(texto, "Digite ou escolha o modelo."));
    const tipoOk = conferirCampo(campoTipo, (texto) => validarObrigatorio(texto, "Escolha o tipo do equipamento."));
    if (!patrimonioOk || !nomeOk || !tipoOk) {
        return;
    }

    const botao = document.getElementById("botao-cadastrar-equipamento");
    botaoEsperando(botao, "Cadastrando…");

    try {
        const salvo = await chamarApi("/equipamentos", {
            method: "POST",
            body: JSON.stringify({
                patrimonio: campoPatrimonio.value.trim().toUpperCase(),
                nome: campoNomeEquipamento.value.trim(),
                tipo: campoTipo.value
            })
        });
        mostrarAviso(`Unidade ${salvo.patrimonio} cadastrada.`);
        formEquipamento.reset();
        carregarUnidades();
    } catch (erro) {
        // R1: patrimônio repetido vem como 409 com a mensagem da API
        mostrarErro(campoPatrimonio, erro.message);
        campoPatrimonio.focus();
    } finally {
        botaoLiberado(botao);
    }
}


//MÉTODOS: CADASTRAR PESSOA
async function cadastrarPessoa(evento) {
    evento.preventDefault();

    const nomeOk = conferirCampo(campoNomePessoa, (texto) => validarObrigatorio(texto, "Digite o nome da pessoa."));
    const emailOk = conferirCampo(campoEmailPessoa, validarEmail);
    const senhaOk = conferirCampo(campoSenhaPessoa, validarSenhaForte);
    if (!nomeOk || !emailOk || !senhaOk) {
        return;
    }

    const botao = document.getElementById("botao-cadastrar-pessoa");
    botaoEsperando(botao, "Cadastrando…");

    try {
        const pessoa = await chamarApi("/colaboradores", {
            method: "POST",
            body: JSON.stringify({
                nome: campoNomePessoa.value.trim(),
                email: campoEmailPessoa.value.trim(),
                cargo: campoCargoPessoa.value.trim(),
                senha: campoSenhaPessoa.value,
                perfil: formPessoa.querySelector('input[name="perfil"]:checked').value
            })
        });
        mostrarAviso(`Cadastro de ${pessoa.nome} feito. Já dá pra entrar com esse e-mail e senha.`);
        formPessoa.reset();
        atualizarRegrasDaSenha(campoSenhaPessoa, listaRegrasSenha);
    } catch (erro) {
        // R3: e-mail repetido vem como 409 ("E-mail já cadastrado")
        mostrarErro(campoEmailPessoa, erro.message);
        campoEmailPessoa.focus();
    } finally {
        botaoLiberado(botao);
    }
}


//INÍCIO
function iniciarEmpresa() {
    montarCabecalho();
    montarRodape();
    ligarPainelAcessibilidade();

    if (!exigirLogin()) {
        return;
    }
    if (!ehAdmin()) {
        document.getElementById("sem-permissao-icone").innerHTML = ICONES.cadeado;
        document.getElementById("estado-sem-permissao").hidden = false;
        return;
    }

    document.getElementById("area-admin").hidden = false;
    preencherTipos();
    ligarRegrasDaSenha(campoSenhaPessoa, listaRegrasSenha);
    ligarMostrarSenha(campoSenhaPessoa, document.getElementById("mostrar-senha-pessoa"));

    campoNomeEquipamento.addEventListener("change", completarTipoDoModelo);
    formEquipamento.addEventListener("submit", cadastrarEquipamento);
    formPessoa.addEventListener("submit", cadastrarPessoa);

    carregarUnidades();
}

iniciarEmpresa();
