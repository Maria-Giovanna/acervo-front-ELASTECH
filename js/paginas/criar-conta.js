/* =========================================================
   ACERVO – página de criar conta
   Confere o formulário no navegador (erros específicos),
   cria a conta (POST /auth/cadastro, que já devolve o token),
   pergunta à API quem entrou (GET /auth/eu) e volta pra página
   de onde a pessoa veio. Quem se cadastra aqui é sempre COLABORADOR:
   a API não deixa escolher o perfil.
   ========================================================= */

//ELEMENTOS DA PÁGINA
const formCriarConta = document.getElementById("form-criar-conta");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoCargo = document.getElementById("cargo");
const campoSenha = document.getElementById("senha");
const listaRegrasSenha = document.getElementById("regras-senha");
const botaoCriarConta = document.getElementById("botao-criar-conta");
const alertaErro = document.getElementById("alerta-erro");
const linkEntrar = document.getElementById("link-entrar");


//MÉTODOS: VALIDAR
function validarNome(texto) {
    return validarObrigatorio(texto, "Digite seu nome.");
}

// confere os 3 campos obrigatórios e leva o foco pro primeiro com problema
function formularioEstaCerto() {
    const nomeEstaCerto = conferirCampo(campoNome, validarNome);
    const emailEstaCerto = conferirCampo(campoEmail, validarEmail);
    const senhaEstaCerta = conferirCampo(campoSenha, validarSenhaForte);

    if (!nomeEstaCerto) {
        campoNome.focus();
        return false;
    }
    if (!emailEstaCerto) {
        campoEmail.focus();
        return false;
    }
    if (!senhaEstaCerta) {
        campoSenha.focus();
        return false;
    }
    return true;
}


//MÉTODOS: CRIAR CONTA
async function criarConta(evento) {
    evento.preventDefault();
    alertaErro.hidden = true;

    if (!formularioEstaCerto()) {
        return;
    }

    botaoEsperando(botaoCriarConta, "Criando sua conta…");

    try {
        encerrarSessao();   // começa limpo

        const resposta = await chamarApi("/auth/cadastro", {
            method: "POST",
            body: JSON.stringify({
                nome: campoNome.value.trim(),
                email: campoEmail.value.trim(),
                cargo: campoCargo.value.trim(),
                senha: campoSenha.value
            })
        });

        // a API já devolve o token: guarda primeiro, porque o GET /auth/eu precisa dele
        guardarSessao(resposta.token, null);
        const usuario = await chamarApi("/auth/eu");
        guardarSessao(resposta.token, usuario);

        location.href = destinoDepoisDoLogin();
    } catch (erro) {
        encerrarSessao();
        mostrarErroDoCadastro(erro.message);
        botaoLiberado(botaoCriarConta);
    }
}

// e-mail repetido (R3, 409) aparece embaixo do campo de e-mail; o resto, no alerta
function mostrarErroDoCadastro(mensagem) {
    const ehEmailRepetido = mensagem.includes("E-mail já cadastrado");

    if (ehEmailRepetido) {
        mostrarErro(campoEmail, "Esse e-mail já tem conta. Use outro ou entre com ele.");
        campoEmail.focus();
        return;
    }

    alertaErro.innerHTML = ICONES.alerta;
    const texto = document.createElement("span");
    texto.textContent = mensagem;
    alertaErro.append(texto);
    alertaErro.hidden = false;
}


//INÍCIO
function iniciarCriarConta() {
    montarCabecalho();
    montarRodape();
    ligarPainelAcessibilidade();

    // quem já está logado não precisa ver esta tela
    if (estaLogado()) {
        location.href = destinoDepoisDoLogin();
        return;
    }

    // o "Entrar" leva junto o ?voltar=..., pra pessoa não perder a reserva
    linkEntrar.href = `entrar.html${location.search}`;

    ligarRegrasDaSenha(campoSenha, listaRegrasSenha);
    ligarMostrarSenha(campoSenha, document.getElementById("mostrar-senha"));
    ligarValidacaoAoVivo(campoNome, validarNome);
    ligarValidacaoAoVivo(campoEmail, validarEmail);
    ligarValidacaoAoVivo(campoSenha, validarSenhaForte);
    formCriarConta.addEventListener("submit", criarConta);
    campoNome.focus();
}

iniciarCriarConta();
