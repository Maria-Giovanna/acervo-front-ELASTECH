/* =========================================================
   ACERVO – configuração
   O endereço da API e o prazo do empréstimo.
   ========================================================= */

// no computador (localhost) usa a API do IntelliJ; publicado (Netlify), usa a do Render
const API_URL = ["localhost", "127.0.0.1"].includes(location.hostname)
    ? "http://localhost:8080"
    : "https://emprestimos-api-magi.onrender.com";

// o mesmo PRAZO_EM_DIAS do Emprestimo.java (só pra mostrar a prévia; quem decide é a API)
const PRAZO_EM_DIAS = 14;
