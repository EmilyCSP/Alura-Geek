document.addEventListener('DOMContentLoaded', () => {
    exibirProdutos();

    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        const nome = document.querySelector('#nome').value;
        const preco = document.querySelector('#preco').value;
        const imagem = document.querySelector('#imagem').value;

        if (nome && preco && imagem) {
            adicionarProduto(nome, parseFloat(preco), imagem);
        } else {
            alert('Por favor, preencha todos os campos do formulário.');
        }
    });
});

async function exibirProdutos() {
    try {
        const response = await fetch('https://challenger-produtos-servidor-web-1.onrender.com/produtos');
        const produtosData = await response.json();
        const container = document.querySelector('.produtos');

        if (!container) {
            console.error('Elemento .produtos não encontrado no DOM.');
            return;
        }

        container.innerHTML = '';

        produtosData.forEach((produto, index) => {
            if (index % 3 === 0) {
                const secaoAtual = document.createElement('div');
                secaoAtual.classList.add('secao');
                container.appendChild(secaoAtual);
            }
            const card = criarCardProduto(produto);
            container.lastChild.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao buscar os dados dos produtos:', error);
    }
}

async function adicionarProduto(nome, preco, imagem) {
    try {
        const response = await fetch('https://challenger-produtos-servidor-web-1.onrender.com/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, preco, imagem })
        });

        if (response.ok) {
            limparFormulario();
            alert(`Seu produto "${nome}" foi adicionado com sucesso!`);
            exibirProdutos();
        } else {
            throw new Error('Erro ao adicionar produto.');
        }
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro ao adicionar produto. Por favor, tente novamente.');
    }
}

function limparFormulario() {
    document.querySelector('form').reset();
}

async function removerProduto(produtoId) {
    try {
        const response = await fetch(`https://challenger-produtos-servidor-web-1.onrender.com/produtos/${produtoId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Produto removido com sucesso!');
            exibirProdutos();
        } else {
            throw new Error('Erro ao remover produto.');
        }
    } catch (error) {
        console.error('Erro ao remover produto:', error);
        alert('Erro ao remover produto. Por favor, tente novamente.');
    }
}

function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.produtoId = produto.id;

    const imagem = document.createElement('img');
    imagem.classList.add('produto');
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;

    const nomeProduto = document.createElement('p');
    nomeProduto.classList.add('nome__produto');
    nomeProduto.textContent = produto.nome;

    const precoProduto = document.createElement('p');
    precoProduto.classList.add('preco__produto');
    precoProduto.textContent = `R$ ${produto.preco.toFixed(2)}`;

    const iconeLixeira = document.createElement('img');
    iconeLixeira.src = 'imgs/icon_trash.png';
    iconeLixeira.alt = 'Ícone de Lixeira';
    iconeLixeira.classList.add('icone__lixeira');

    precoProduto.appendChild(iconeLixeira);
    card.appendChild(imagem);
    card.appendChild(nomeProduto);
    card.appendChild(precoProduto);

    iconeLixeira.addEventListener('click', () => {
        if (confirm(`Tem certeza que deseja excluir o produto "${produto.nome}"?`)) {
            removerProduto(produto.id);
        }
    });

    return card;
}
