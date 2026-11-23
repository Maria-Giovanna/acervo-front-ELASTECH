# Acervo: site de empréstimo de equipamentos

Site da **Acervo**, uma empresa fictícia que empresta equipamentos (notebooks, monitores, headsets, celulares...) para as pessoas colaboradoras. A pessoa vê o que está livre, cria a conta, reserva, acompanha o prazo e devolve, tudo pelo navegador.

O site é a parte visual do **Projeto 2 do bootcamp #ElasTech** (PagBank). Todos os dados vêm da API em Java/Spring Boot: [emprestimos](https://github.com/Maria-Giovanna/emprestimos).

## 🌐 No ar

| | Link |
|---|---|
| **Site** (Netlify) | COLE_AQUI_O_LINK_DO_NETLIFY |
| **API** (Render) | https://emprestimos-api-magi.onrender.com |

> A API está no plano gratuito do Render e "dorme" depois de 15 minutos sem uso. Se o site demorar na primeira vez, ele avisa: "Acordando o servidor". A primeira resposta pode levar até 1 minuto.

## 🛠️ Tecnologias

- **HTML, CSS e JavaScript puro**, sem framework e sem etapa de build
- `fetch` para conversar com a API, e o token JWT guardado no `localStorage`
- CSS moderno: variáveis, `light-dark()` para os temas, `:has()`, popover e animações que respeitam quem prefere menos movimento
- Fontes: **Archivo** (títulos) e **Atkinson Hyperlegible Next** (texto, feita para baixa visão)
- Deploy no **Netlify**

## 🧭 Páginas

| Página | O que faz | Rotas da API que usa |
|---|---|---|
| `index.html` | Início: catálogo por tipo de equipamento, quantos estão livres agora, avaliações e perguntas frequentes | `GET /equipamentos` |
| `criar-conta.html` | A pessoa cria a própria conta e já entra | `POST /auth/cadastro`, `GET /auth/eu` |
| `entrar.html` | Login com e-mail e senha | `POST /auth/login`, `GET /auth/eu` |
| `retirada.html` | Reserva: escolher, conferir o resumo (quem, retirada, devolução) e confirmar | `GET /equipamentos`, `POST /emprestimos` |
| `meus-emprestimos.html` | O que está com a pessoa agora, o prazo e o histórico, com o botão de devolver | `GET /emprestimos/meus`, `PUT /emprestimos/{id}/devolucao` |
| `empresa.html` | Só ADMIN: cadastrar equipamentos e pessoas e ver todas as unidades | `POST /equipamentos`, `POST /colaboradores` |

## 🔗 Como o site fala com a API

Tudo passa por dois arquivos:

- **`js/core/config.js`** escolhe a API pelo endereço do site: aberto no computador (`localhost`), usa `http://localhost:8080`; publicado, usa a do Render.
- **`js/core/api.js`** é o único arquivo que faz `fetch`. Ele coloca o token no cabeçalho `Authorization: Bearer ...`, transforma os erros da API em mensagens claras e, se o token vencer (10 minutos), leva a pessoa de volta ao login, lembrando de onde ela estava.

**Quem decide as regras é a API.** O site mostra antes o que vai acontecer (o prazo de 14 dias, "um equipamento por vez"), mas quem bloqueia de verdade é o back-end. Se a pessoa tentar pegar um segundo equipamento, a mensagem que aparece é a da própria API.

## ▶️ Como rodar no computador

1. Rode a API ([instruções no README dela](https://github.com/Maria-Giovanna/emprestimos#️-como-rodar)). Ela fica em `http://localhost:8080`.
2. Clone este repositório:
   ```bash
   git clone https://github.com/Maria-Giovanna/acervo-front.git
   ```
3. Abra o `index.html` com um servidor local: no IntelliJ, abra o arquivo e clique no ícone do navegador; no VS Code, use a extensão Live Server.

> Abrir o arquivo com dois cliques (`file://`) não funciona, porque o navegador bloqueia o `fetch`. Precisa ser por um servidor local.

## 🗂️ Organização dos arquivos

Cada arquivo tem **uma responsabilidade só** (o S do SOLID) e começa com um comentário explicando o que faz.

```
acervo-front/
├── *.html                 uma página por arquivo
├── img/
│   ├── hero.webp          a foto do topo da página inicial
│   └── produtos/          uma foto por modelo de equipamento
├── css/
│   ├── base/              o sistema: cores e medidas (tokens), reset, tipografia, layout
│   ├── componentes/       peças reutilizadas: botões, cartões, formulários, cabeçalho, rodapé...
│   └── paginas/           o que é só de uma página
└── js/
    ├── core/              o que todo mundo usa: config, conversa com a API, sessão, validação
    ├── dados/             textos e fotos dos modelos, ícones
    ├── componentes/       peças reutilizadas: cabeçalho, avisos, campos, regras da senha...
    └── paginas/           um arquivo por página
```

Os scripts são carregados em ordem no fim de cada HTML: primeiro o que os outros usam (`core`), por último o arquivo da página.

## ♿ Acessibilidade

No botão de acessibilidade do cabeçalho, a pessoa escolhe:

- **Tamanho do texto:** A−, A, A+ e A++
- **Tema:** claro, escuro ou igual ao sistema
- **Cores para daltonismo:** vermelho e verde (protanopia e deuteranopia), azul e amarelo (tritanopia) e tons de cinza

As escolhas ficam salvas no navegador e são aplicadas antes de a página aparecer, sem "piscar". Além disso:
- os erros aparecem embaixo do campo certo, com ícone e texto (não só com cor), e dizem exatamente o que corrigir;
- dá para navegar só pelo teclado, com o foco sempre visível;
- as animações diminuem para quem pediu menos movimento no sistema.

## ✅ Validações no navegador

- **E-mail:** formato válido, com mensagem específica para cada erro (sem @, sem domínio, espaço...)
- **Senha forte** (as mesmas regras da API): 8 caracteres ou mais, com letra maiúscula, letra minúscula e número. Cada regra vira ✓ enquanto a pessoa digita.
- **Botões em espera:** mostram "Entrando…" ou "Criando sua conta…" e não deixam clicar duas vezes.