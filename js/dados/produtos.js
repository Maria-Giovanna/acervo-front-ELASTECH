/* =========================================================
   ACERVO – dados dos produtos
   A API guarda só patrimônio, nome, tipo e disponibilidade.
   A foto, o nome bonito e os destaques ficam aqui, ligados pelo
   NOME EXATO do modelo (o mesmo do DadosIniciais.java).
   As fotos vão na pasta img/produtos/ com o nome do campo "imagem".
   ========================================================= */

const PRODUTOS = {
    "Notebook Dell Latitude 5450": {
        tipo: "NOTEBOOK",
        titulo: "Dell Latitude 5450",
        imagem: "dell-latitude-5450.webp",
        destaques: ["Intel Core Ultra 5", "16 GB de RAM", "SSD de 512 GB", "Tela de 14\""]
    },
    "MacBook Air 13 M3": {
        tipo: "NOTEBOOK",
        titulo: "MacBook Air 13\" M3",
        imagem: "macbook-air-m3.webp",
        destaques: ["Chip Apple M3", "16 GB de memória", "SSD de 256 GB", "Tela de 13,6\""]
    },
    "Monitor Dell P2425H": {
        tipo: "MONITOR",
        titulo: "Monitor Dell P2425H",
        imagem: "dell-p2425h.webp",
        destaques: ["23,8\" Full HD", "Painel IPS, 100 Hz", "Ajuste de altura"]
    },
    "Headset Jabra Evolve2 55": {
        tipo: "HEADSET",
        titulo: "Jabra Evolve2 55",
        imagem: "jabra-evolve2-55.webp",
        destaques: ["Sem fio", "Cancelamento de ruído", "Microfone com haste"]
    },
    "Teclado Logitech MX Keys S": {
        tipo: "TECLADO",
        titulo: "Logitech MX Keys S",
        imagem: "logitech-mx-keys-s.webp",
        destaques: ["Sem fio", "Teclas iluminadas", "Até 3 aparelhos"]
    },
    "Mouse Logitech MX Master 3S": {
        tipo: "MOUSE",
        titulo: "Logitech MX Master 3S",
        imagem: "logitech-mx-master-3s.webp",
        destaques: ["Sem fio", "Cliques silenciosos", "Rolagem rápida"]
    },
    "Celular Samsung Galaxy S24": {
        tipo: "CELULAR",
        titulo: "Samsung Galaxy S24",
        imagem: "samsung-galaxy-s24.webp",
        destaques: ["Para testes de apps", "Android", "Tela de 6,2\""]
    },
    "Mesa digitalizadora Wacom Intuos M": {
        tipo: "MESA_DIGITALIZADORA",
        titulo: "Wacom Intuos M",
        imagem: "wacom-intuos-m.webp",
        destaques: ["Tamanho médio", "Caneta sem bateria", "Bluetooth"]
    },
    "Webcam Logitech Brio 4K": {
        tipo: "OUTRO",
        titulo: "Logitech Brio 4K",
        imagem: "logitech-brio-4k.webp",
        destaques: ["Imagem 4K", "Ajuste de luz automático", "USB"]
    }
};

// os nomes dos tipos como aparecem na tela (o enum TipoEquipamento.java)
const NOMES_DOS_TIPOS = {
    NOTEBOOK: "Notebook",
    MONITOR: "Monitor",
    HEADSET: "Headset",
    TECLADO: "Teclado",
    MOUSE: "Mouse",
    CELULAR: "Celular",
    MESA_DIGITALIZADORA: "Mesa digitalizadora",
    OUTRO: "Outro"
};

// no plural, para os cartões de tipo do catálogo
const NOMES_NO_PLURAL = {
    NOTEBOOK: "Notebooks",
    MONITOR: "Monitores",
    HEADSET: "Headsets",
    TECLADO: "Teclados",
    MOUSE: "Mouses",
    CELULAR: "Celulares",
    MESA_DIGITALIZADORA: "Mesas digitalizadoras",
    OUTRO: "Outros"
};

// a ordem dos filtros e dos cards no catálogo
const ORDEM_DOS_TIPOS = Object.keys(NOMES_DOS_TIPOS);


//MÉTODOS
// os dados de um modelo; se ele não estiver na lista (cadastrado pela empresa depois), usa o nome da API
function dadosDoProduto(nomeDoModelo) {
    const produto = PRODUTOS[nomeDoModelo];
    if (produto) {
        return produto;
    }
    return {
        tipo: "OUTRO",
        titulo: nomeDoModelo,
        imagem: null,
        destaques: []
    };
}
