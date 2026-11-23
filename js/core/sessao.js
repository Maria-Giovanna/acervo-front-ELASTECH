/* =========================================================
   ACERVO – sessão
   Guarda o token do login e os dados de quem entrou.
   O token vence em 10 minutos (TokenService.java): depois disso
   a pessoa precisa entrar de novo.
   ========================================================= */

const CHAVE_SESSAO = "acervo-sessao";


//MÉTODOS: GUARDAR E LER
function guardarSessao(token, usuario) {
    try {
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ token, usuario }));
    } catch {
        // sem armazenamento: a pessoa vai precisar entrar de novo ao trocar de página
    }
}

function lerSessao() {
    try {
        const sessao = JSON.parse(localStorage.getItem(CHAVE_SESSAO));
        if (!sessao || tokenVenceu(sessao.token)) {
            return null;
        }
        return sessao;
    } catch {
        return null;
    }
}

function lerToken() {
    return lerSessao()?.token ?? null;
}

function lerUsuario() {
    return lerSessao()?.usuario ?? null;
}

function encerrarSessao() {
    try {
        localStorage.removeItem(CHAVE_SESSAO);
    } catch {
        // nada a fazer
    }
}


//MÉTODOS: PERGUNTAS
function estaLogado() {
    return lerSessao() !== null;
}

function ehAdmin() {
    return lerUsuario()?.perfil === "ADMIN";
}

// o conteúdo do JWT é público (slide 13): dá pra ler o "exp" sem a chave
function tokenVenceu(token) {
    try {
        const conteudo = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const dados = JSON.parse(atob(conteudo));
        const agoraEmSegundos = Date.now() / 1000;
        return dados.exp < agoraEmSegundos;
    } catch {
        return true;   // token estragado conta como vencido
    }
}


//MÉTODOS: PROTEGER PÁGINAS
// manda pra tela de entrar, lembrando de onde a pessoa veio
function irParaEntrar(motivo) {
    const voltar = location.pathname.split("/").pop() + location.search;
    const parametros = new URLSearchParams({ voltar });
    if (motivo) {
        parametros.set("motivo", motivo);
    }
    location.href = `entrar.html?${parametros}`;
}

function exigirLogin() {
    if (!estaLogado()) {
        irParaEntrar("entrar");
        return false;
    }
    return true;
}
