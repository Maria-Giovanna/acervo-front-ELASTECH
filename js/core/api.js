/* =========================================================
   ACERVO – conversa com a API
   A única parte do site que faz fetch. Coloca o token no
   cabeçalho Authorization (slide 18), transforma os erros da API
   em mensagens e trata o token vencido (401).
   ========================================================= */

// quando a API responde erro sem "message" (ex.: 403 do Spring Security)
const MENSAGENS_POR_STATUS = {
    400: "Algum dado foi enviado errado. Confira os campos e tente de novo.",
    401: "Entre com seu e-mail e senha para continuar.",
    403: "Seu perfil não tem permissão para fazer isso.",
    404: "Não encontramos o que você procurou.",
    409: "Essa ação entra em conflito com uma regra do sistema.",
    500: "O servidor teve um problema. Tente de novo em alguns instantes."
};


//MÉTODOS
async function chamarApi(caminho, opcoes = {}) {
    const token = lerToken();

    const cabecalhos = {
        "Content-Type": "application/json"
    };
    if (token) {
        cabecalhos.Authorization = `Bearer ${token}`;
    }

    // no plano gratuito, o Render dorme: se demorar, avisa que está acordando
    const lembreteDemora = setTimeout(() => {
        mostrarAvisoFixo("servidor", "Acordando o servidor. No plano gratuito, a primeira resposta pode levar até 1 minuto.");
    }, 4000);

    let resposta;
    try {
        resposta = await fetch(API_URL + caminho, {
            ...opcoes,
            headers: cabecalhos
        });
    } catch {
        throw new Error("Não foi possível falar com o servidor. Confira sua internet e tente de novo.");
    } finally {
        clearTimeout(lembreteDemora);
        removerAvisoFixo("servidor");
    }

    // tinha token e mesmo assim deu 401: ele venceu (10 minutos). Volta pro login.
    if (resposta.status === 401 && token) {
        encerrarSessao();
        irParaEntrar("expirou");
        throw new Error("Sua sessão expirou.");
    }

    if (resposta.status === 204) {
        return null;   // deu certo e não tem corpo
    }

    const corpo = await resposta.json().catch(() => null);

    if (!resposta.ok) {
        const mensagem = corpo?.message ?? MENSAGENS_POR_STATUS[resposta.status] ?? `Erro ${resposta.status}.`;
        throw new Error(mensagem);
    }

    return corpo;
}
