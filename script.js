let menuData = {};

async function carregarDados() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        menuData = await response.json();
        filtrar('todos'); // Exibe todos os itens por padrão ao carregar
    } catch (error) {
        console.error("Erro ao carregar os dados do menu:", error);
        const container = document.querySelector('.card-container');
        container.innerHTML = '<p class="error-message">Desculpe, não foi possível carregar o cardápio. Tente novamente mais tarde.</p>';
    }
}

function criarCard(item) {
    return `
        <article class="card">
            <h3>${item.nome}</h3>
            <p>${item.descricao}</p>
            <span class="price">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
        </article>
    `;
}

function renderizarCards(itens) {
    const container = document.querySelector('.card-container');
    container.innerHTML = itens.map(criarCard).join('');
}

function filtrar(categoria) {
    let itensExibidos = [];

    if (categoria === 'todos') {
        // Concatena todos os arrays de categorias
        itensExibidos = Object.values(menuData).flat();
    } else {
        itensExibidos = menuData[categoria] || [];
    }

    renderizarCards(itensExibidos);

    // Atualiza o botão ativo
    document.querySelectorAll('.filtros-lista button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.filtros-lista button[onclick="filtrar('${categoria}')"]`).classList.add('active');
}

function iniciarBusca() {
    const termoBusca = document.getElementById('input-busca').value.toLowerCase();
    const todosOsItens = Object.values(menuData).flat();

    const resultados = todosOsItens.filter(item =>
        item.nome.toLowerCase().includes(termoBusca) ||
        item.descricao.toLowerCase().includes(termoBusca)
    );

    renderizarCards(resultados);
}

function configurarMenuAcordeao() {
    const menuFiltros = document.querySelector('.menu-filtros');
    const botaoPrincipal = document.querySelector('.menu-filtros-botao-principal');

    if (botaoPrincipal) {
        botaoPrincipal.addEventListener('click', () => {
            const isExpanded = botaoPrincipal.getAttribute('aria-expanded') === 'true';
            botaoPrincipal.setAttribute('aria-expanded', !isExpanded);
            menuFiltros.classList.toggle('filtros-visiveis');
        });
    }
}

// Inicia tudo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    configurarMenuAcordeao();
});