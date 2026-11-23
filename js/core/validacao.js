/* =========================================================
   ACERVO – validação dos formulários
   Confere os campos antes de chamar a API e devolve uma mensagem
   específica pra cada problema. Devolve null quando está tudo certo.
   (A API confere de novo: o front ajuda, a API garante.)
   ========================================================= */

//E-MAIL: uma mensagem pra cada erro, na ordem em que a pessoa costuma errar
function validarEmail(texto) {
    const email = texto.trim();

    if (email === "") {
        return "Digite seu e-mail.";
    }
    if (email.includes(" ")) {
        return "O e-mail não pode ter espaços.";
    }

    const partes = email.split("@");
    if (partes.length === 1) {
        return "Falta o @ no e-mail, como em nome@empresa.com.";
    }
    if (partes.length > 2) {
        return "O e-mail tem mais de um @. Deixe só um.";
    }

    const [nome, dominio] = partes;
    if (nome === "") {
        return "Falta a parte antes do @, como o seu nome.";
    }
    if (dominio === "") {
        return "Falta o domínio depois do @, como em empresa.com.";
    }
    if (!dominio.includes(".")) {
        return "O domínio precisa de um ponto, como em acervo.com.";
    }
    if (dominio.startsWith(".") || dominio.endsWith(".") || dominio.includes("..")) {
        return "Tem um ponto fora do lugar no domínio.";
    }

    const final = dominio.split(".").pop();
    if (final.length < 2) {
        return "O final do domínio precisa de pelo menos 2 letras, como .com ou .br.";
    }

    return null;
}


//SENHA FORTE: as mesmas regras do @Pattern do ColaboradorRequest.java
const REGRAS_DA_SENHA = [
    {
        id: "tamanho",
        texto: "8 caracteres ou mais",
        confere: (senha) => senha.length >= 8
    },
    {
        id: "maiuscula",
        texto: "uma letra maiúscula",
        confere: (senha) => /[A-Z]/.test(senha)
    },
    {
        id: "minuscula",
        texto: "uma letra minúscula",
        confere: (senha) => /[a-z]/.test(senha)
    },
    {
        id: "numero",
        texto: "um número",
        confere: (senha) => /\d/.test(senha)
    }
];

function validarSenhaForte(senha) {
    if (senha === "") {
        return "Crie uma senha.";
    }

    const faltando = REGRAS_DA_SENHA
        .filter((regra) => !regra.confere(senha))
        .map((regra) => regra.texto);

    if (faltando.length > 0) {
        return `A senha ainda precisa de: ${faltando.join(", ")}.`;
    }
    return null;
}

function validarObrigatorio(texto, mensagem) {
    if (texto.trim() === "") {
        return mensagem;
    }
    return null;
}
