let produtos = [
    { id: 1, nome: "Produto A", preco: 350, estoque: 5 },
    { id: 2, nome: "Produto B", preco: 70, estoque: 3 },
    { id: 3, nome: "Produto C", preco: 122, estoque: 2 }
];


let carrinho = [];


function exibirProdutos() {
    let container = document.getElementById("produtos");
    container.innerHTML = "";

    produtos.forEach(produto => {
        container.innerHTML += `
            <div class="produto">
                <h3>${produto.nome} - R$${produto.preco}</h3>
                <p>Estoque: <span id="estoque-${produto.id}">${produto.estoque}</span></p>
                <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
            </div>
        `;
    });
}


function adicionarAoCarrinho(id) {
    let produto = produtos.find(p => p.id === id);

    if (produto && produto.estoque > 0) {
        produto.estoque--; 

        let itemNoCarrinho = carrinho.find(p => p.id === id);
        if (itemNoCarrinho) {
            itemNoCarrinho.quantidade++;
        } else {
            carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
        }

        atualizarCarrinho();
        document.getElementById(`estoque-${id}`).textContent = produto.estoque; 
        
        
        let botao = document.querySelector(`button[onclick="adicionarAoCarrinho(${id})"]`);
        botao.classList.add("pulse");
        setTimeout(() => botao.classList.remove("pulse"), 300);
    } else {
        alert("Produto sem estoque disponível!");
    }
}


function atualizarCarrinho() {
    let container = document.getElementById("carrinho");
    let total = 0;
    container.innerHTML = "";

    if (carrinho.length === 0) {
        container.innerHTML = "<p>Carrinho vazio</p>";
        document.getElementById("total").textContent = "0.00";
        return;
    }

    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
        container.innerHTML += `
            <p class="item-carrinho" id="item-${item.id}">${item.nome} - R$${item.preco} x ${item.quantidade} 
            <button onclick="removerDoCarrinho(${item.id})">Remover</button></p>
        `;
    });

    document.getElementById("total").textContent = total.toFixed(2);
}


function removerDoCarrinho(id) {
    let itemNoCarrinho = carrinho.find(p => p.id === id);
    let produto = produtos.find(p => p.id === id);

    if (itemNoCarrinho) {
        let itemElement = document.getElementById(`item-${id}`);
        itemElement.classList.add("fade-out"); 

        setTimeout(() => {
            itemNoCarrinho.quantidade--;
            produto.estoque++;

            if (itemNoCarrinho.quantidade === 0) {
                carrinho = carrinho.filter(p => p.id !== id);
            }

            atualizarCarrinho();
            document.getElementById(`estoque-${id}`).textContent = produto.estoque;
        }, 300); 
    }
}


exibirProdutos();


function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Carrinho vazio! Adicione produtos para finalizar a compra.");
        return;
    }

    let total = 0;
    let reciboHTML = "<h3>Recibo de Compra</h3><ul>";

    
    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
        reciboHTML += `<li>${item.quantidade} x ${item.nome} - R$${item.preco} = R$${(item.preco * item.quantidade).toFixed(2)}</li>`;
    });

    reciboHTML += `</ul><p><strong>Total da Compra: R$${total.toFixed(2)}</strong></p>`;
    reciboHTML += "<p>Obrigado por comprar conosco!</p>";

    
    let reciboContainer = document.getElementById("recibo");
    reciboContainer.innerHTML = reciboHTML;

    
    carrinho = [];
    atualizarCarrinho();
}

