/* =========================================================
   ACERVO – página de entrar
   Confere o formulário no navegador (erros específicos),
   faz o login (POST /auth/login), guarda o token, pergunta à API
   quem entrou (GET /auth/eu) e volta pra página de onde a pessoa veio.
   Quem ainda não tem conta vai pro "Criar conta" (criar-conta.html).
   ========================================================= */

//ELEMENTOS DA PÁGINA
const formEntrar = document.getElementById("form-entrar");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const botaoEntrarForm = document.getElementById("botao-entrar-form");
const alertaMotivo = document.getElementById("alerta-motivo");
const alertaErro = document.getElementById("alerta-erro");
const linkCriarConta = document.getElementById("link-criar-conta");

const MENSAGENS_DE_MOTIVO = {
    expirou: "Sua sessão expirou depois de 10 minutos. Entre de novo para continuar de onde parou.",
    entrar: "Entre com seu e-mail e senha para continuar.",
    reservar: "Para reservar um equipamento, entre ou crie sua conta."
};


//MÉTODOS: VALIDAR
function validarSenhaDigitada(texto) {
    return validarObrigatorio(texto, "Digite sua senha.");
}



//MÉTODOS: ENTRAR
async function entrar(evento) {
    evento.preventDefault();
    alertaErro.hidden = true;

    const emailEstaCerto = conferirCampo(campoEmail, validarEmail);
    const senhaEstaCerta = conferirCampo(campoSenha, validarSenhaDigitada);

    if (!emailEstaCerto || !senhaEstaCerta) {
        // leva o foco pro primeiro campo com problema
        (emailEstaCerto ? campoSenha : campoEmail).focus();
        return;
    }

    botaoEsperando(botaoEntrarForm, "Entrando…");

    try {
        encerrarSessao();   // começa limpo

        const resposta = await chamarApi("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: campoEmail.value.trim(),
                senha: campoSenha.value
            })
        });

        // guarda o token primeiro: o GET /auth/eu precisa dele no cabeçalho
        guardarSessao(resposta.token, null);
        const usuario = await chamarApi("/auth/eu");
        guardarSessao(resposta.token, usuario);

        location.href = destinoDepoisDoLogin();
    } catch (erro) {
        encerrarSessao();
        alertaErro.innerHTML = ICONES.alerta;
        const texto = document.createElement("span");
        texto.textContent = erro.message;   // ex.: "E-mail ou senha inválidos" (a API não diz qual, de propósito)
        alertaErro.append(texto);
        alertaErro.hidden = false;
        botaoLiberado(botaoEntrarForm);
        campoSenha.select();
    }
}

function mostrarMotivo() {
    const mensagem = MENSAGENS_DE_MOTIVO[lerParametro("motivo")];
    if (!mensagem) {
        return;
    }
    alertaMotivo.innerHTML = ICONES.entrar;
    const texto = document.createElement("span");
    texto.textContent = mensagem;
    alertaMotivo.append(texto);
    alertaMotivo.hidden = false;
}


//INÍCIO
function iniciarEntrar() {
    montarCabecalho();
    montarRodape();
    ligarPainelAcessibilidade();

    // quem já está logado não precisa ver esta tela
    if (estaLogado()) {
        location.href = destinoDepoisDoLogin();
        return;
    }

    mostrarMotivo();

    // o "Criar conta" leva junto o ?voltar=..., pra pessoa cair na reserva depois de criar
    linkCriarConta.href = `criar-conta.html${location.search}`;

    ligarMostrarSenha(campoSenha, document.getElementById("mostrar-senha"));
    ligarValidacaoAoVivo(campoEmail, validarEmail);
    ligarValidacaoAoVivo(campoSenha, validarSenhaDigitada);
    formEntrar.addEventListener("submit", entrar);
    campoEmail.focus();
}

iniciarEntrar();
