/* =========================================================
   ACERVO – cabeçalho e rodapé
   Monta os dois em todas as páginas a partir de um lugar só.
   Cada página tem <header id="cabecalho">, <footer id="rodape">
   e diz quem ela é em <body data-pagina="...">.
   Na página inicial (<body data-hero>), o cabeçalho começa
   "flutuante" em cima da foto e vira "fixo" ao rolar.
   ========================================================= */

function montarCabecalho() {
    const cabecalho = document.getElementById("cabecalho");
    const paginaAtual = document.body.dataset.pagina;
    const usuario = lerUsuario();

    cabecalho.className = "cabecalho";
    cabecalho.innerHTML = `
        <a class="pular" href="#conteudo">Pular para o conteúdo</a>

        <div class="cabecalho__barra">
            <a class="cabecalho__caixa cabecalho__marca" href="index.html">
                ${ICONES.marca}
                <span>Acervo</span>
            </a>

            <nav class="cabecalho__caixa cabecalho__nav" aria-label="Principal">
                ${linksDaNavegacao(usuario)}
            </nav>

            <div class="cabecalho__caixa cabecalho__acoes">
                <button class="botao-icone" type="button" popovertarget="painel-acessibilidade" aria-label="Acessibilidade">
                    ${ICONES.acessibilidade}
                </button>
                <button class="botao-icone cabecalho__menu" type="button" popovertarget="painel-menu" aria-label="Menu">
                    ${ICONES.menu}
                </button>
                <div class="cabecalho__usuario" data-so-logado>
                    <strong id="nome-usuario"></strong>
                    <span id="perfil-usuario"></span>
                </div>
                <button class="botao botao--secundario botao--pequeno" type="button" id="botao-sair" data-so-logado>Sair</button>
                <a class="botao botao--primario botao--pequeno" href="entrar.html" data-so-visitante>Entrar</a>
            </div>
        </div>

        ${montarPainelAcessibilidade()}

        <div class="painel" id="painel-menu" popover>
            <div class="painel__topo">
                <h2>Menu</h2>
                <button class="botao-icone" type="button" popovertarget="painel-menu" popovertargetaction="hide" aria-label="Fechar">${ICONES.fechar}</button>
            </div>
            <nav class="painel__links" aria-label="Menu do celular">
                ${linksDaNavegacao(usuario)}
            </nav>
        </div>
    `;

    // a página atual fica marcada (o leitor de tela anuncia "página atual")
    cabecalho.querySelectorAll(`a[data-pagina="${paginaAtual}"]`).forEach((link) => {
        link.setAttribute("aria-current", "page");
    });

    // mostra só o que faz sentido pra quem está vendo
    cabecalho.querySelectorAll("[data-so-logado]").forEach((elemento) => {
        elemento.hidden = !usuario;
    });
    cabecalho.querySelectorAll("[data-so-visitante]").forEach((elemento) => {
        elemento.hidden = Boolean(usuario) || paginaAtual === "entrar";
    });

    if (usuario) {
        cabecalho.querySelector("#nome-usuario").textContent = usuario.nome;
        cabecalho.querySelector("#perfil-usuario").textContent =
            usuario.perfil === "ADMIN" ? "Administração" : (usuario.cargo || "Colaborador");
    }

    cabecalho.querySelector("#botao-sair").addEventListener("click", () => {
        encerrarSessao();   // logout com token é jogar o token fora (slide 17)
        location.href = "index.html";
    });

    // fechar o menu do celular ao escolher um link (ex.: #catalogo na mesma página)
    cabecalho.querySelectorAll("#painel-menu a").forEach((link) => {
        link.addEventListener("click", () => document.getElementById("painel-menu").hidePopover());
    });

    ligarEstadoDoCabecalho(cabecalho);
}

// os links mudam com quem está logado
function linksDaNavegacao(usuario) {
    let links = `
        <a href="index.html#catalogo" data-pagina="catalogo">Catálogo</a>
        <a href="index.html#avaliacoes">Avaliações</a>
        <a href="index.html#perguntas">Perguntas</a>
    `;
    if (usuario) {
        links += `<a href="meus-emprestimos.html" data-pagina="meus-emprestimos">Meus empréstimos</a>`;
    }
    if (usuario?.perfil === "ADMIN") {
        links += `<a href="empresa.html" data-pagina="empresa">Área da empresa</a>`;
    }
    return links;
}

// flutuante (em cima da foto) ou fixo (depois de rolar / nas outras páginas)
function ligarEstadoDoCabecalho(cabecalho) {
    const temHero = document.body.hasAttribute("data-hero");

    function atualizar() {
        const rolou = window.scrollY > 40;
        cabecalho.dataset.estado = temHero && !rolou ? "flutuante" : "fixo";
    }

    atualizar();
    if (temHero) {
        window.addEventListener("scroll", atualizar, { passive: true });
    }
}

// o painel abre e fecha com o atributo popover do HTML, sem JavaScript
function montarPainelAcessibilidade() {
    return `
        <div class="painel" id="painel-acessibilidade" popover>
            <div class="painel__topo">
                <h2>Acessibilidade</h2>
                <button class="botao-icone" type="button" popovertarget="painel-acessibilidade" popovertargetaction="hide" aria-label="Fechar">
                    ${ICONES.fechar}
                </button>
            </div>

            <fieldset>
                <legend>Tamanho do texto</legend>
                <div class="opcoes">
                    <label><input type="radio" name="fonte" value="1"> A−</label>
                    <label><input type="radio" name="fonte" value="2"> A</label>
                    <label><input type="radio" name="fonte" value="3"> A+</label>
                    <label><input type="radio" name="fonte" value="4"> A++</label>
                </div>
            </fieldset>

            <fieldset>
                <legend>Tema</legend>
                <div class="opcoes">
                    <label><input type="radio" name="tema" value="claro"> Claro</label>
                    <label><input type="radio" name="tema" value="escuro"> Escuro</label>
                    <label><input type="radio" name="tema" value="sistema"> Igual ao sistema</label>
                </div>
            </fieldset>

            <fieldset>
                <legend>Cores para daltonismo</legend>
                <div class="opcoes">
                    <label><input type="radio" name="visao" value="padrao"> Padrão</label>
                    <label><input type="radio" name="visao" value="vermelho-verde"> Vermelho e verde</label>
                    <label><input type="radio" name="visao" value="azul-amarelo"> Azul e amarelo</label>
                    <label><input type="radio" name="visao" value="cinza"> Tons de cinza</label>
                </div>
                <p class="campo__dica">Vermelho e verde: protanopia e deuteranopia. Azul e amarelo: tritanopia. Tons de cinza: acromatopsia.</p>
            </fieldset>
        </div>
    `;
}

// rodapé (referência 8) com as informações do Acervo
function montarRodape() {
    const rodape = document.getElementById("rodape");
    rodape.className = "rodape";
    rodape.innerHTML = `
        <div class="container rodape__conteudo">
            <div class="rodape__marca">
                <a class="cabecalho__marca" href="index.html">
                    ${ICONES.marca}
                    <span>Acervo</span>
                </a>
                <p>Os equipamentos da empresa para o seu trabalho. Você reserva, retira hoje e devolve em até 14 dias.</p>
                <div class="rodape__redes">
                    <a href="https://github.com/Maria-Giovanna" aria-label="GitHub da Maria Giovanna">${ICONES.github}</a>
                    <a href="#contato" aria-label="Contato da equipe de TI">${ICONES.email}</a>
                </div>
            </div>

            <nav aria-label="Páginas">
                <h2>Páginas</h2>
                <ul>
                    <li><a href="index.html">Início</a></li>
                    <li><a href="index.html#catalogo">Catálogo</a></li>
                    <li><a href="meus-emprestimos.html">Meus empréstimos</a></li>
                    <li><a href="entrar.html">Entrar</a></li>
                </ul>
            </nav>

            <div>
                <h2>Equipamentos</h2>
                <ul>
                    <li>Notebooks</li>
                    <li>Monitores</li>
                    <li>Headsets</li>
                    <li>Teclados e mouses</li>
                    <li>Celulares e mesas digitalizadoras</li>
                </ul>
            </div>

            <div id="contato">
                <h2>Fale com a TI</h2>
                <dl class="rodape__contato">
                    <dt>Ramal</dt>
                    <dd>2040</dd>
                    <dt>Onde fica</dt>
                    <dd>2º andar, sala 204</dd>
                    <dt>Horário</dt>
                    <dd>Seg. a sex., das 9h às 18h</dd>
                </dl>
            </div>
        </div>

        <div class="container rodape__base">
            <p>Acervo é uma empresa fictícia do Projeto 2 do #ElasTech, feito por Maria Giovanna.</p>
            <div class="rodape__tecnologias">
                <p>Feito com:</p>
                <span>Java</span>
                <span>Spring Boot</span>
                <span>JWT</span>
            </div>
        </div>
    `;
}
