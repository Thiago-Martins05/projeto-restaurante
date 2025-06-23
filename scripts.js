"use strict";

// Listar produtos OK*
// clicar em carrinho e abrir modal OK
// add produtos no carrinho OK
// verificar itens no carrinho pela home (count) OK
// acessar detalhes do carrinho  OK
// remover item do carrinho OK
// add e verificar endereço OK
// validar se o restaurante está aberto
// enviar pedido para o whatsapp

const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// clicar em carrinho e abrir modal OK
cartBtn.addEventListener("click", () => {
  cartModal.style.display = "flex";

  //   colocar o update para sempre que abrir o modal ele atualizar o carrinho
  updateCartModal();
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", (event) => {
  // console.log(event)
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// fechar o modal pelo button
closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// ADD carrinho vai usar o id menu, add-to-cart-btn, o data-name e data-price, passo a passo OK

menu.addEventListener("click", (event) => {
  // console.log(event.target)

  // o closest vai servir para caso eu clique na tag icone do button ou no elemento pai que seria o proprio button (o parent element), ele verificar se tem a classe add-to-cart-btn tanto no elemento ou no elemento pai e retornar o elemento caso possua a classe

  let parentButton = event.target.closest(".add-to-cart-btn");
  // console.log(parentButton)

  // se o elemento clicado for = ao parentButton pegar o atributos name e price

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    // console.log(name)
    // console.log(price)

    // adicionar ao carrinho usando a função para adicionar ao carrinho, após pegar o price e name do produto chamar a função addToCart passando o param name e price para adicionar ao carrinho, e criar um array la em cima para que consiga acessar ela de qualquer lugar do código
    addToCart(name, price);
  }
});

// função para adicionar ao carrinho
function addToCart(name, price) {
  // verificação se caso aquele item já esteja na lista, somar apenas mais 1 na quantidade. O find seria para percorrer o array e verificar se o item.name é igual ao name do objeto que vai ser selecionado
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
    updateCartModal();
    return;
  }

  // pegar o array vazio la em cima e jogar dentro o objeto com a props name, price, quantity 1 (começa em 1 pois quando for add já deve ser o objeto numero 1)
  cart.push({
    name,
    price,
    quantity: 1,
  });

  updateCartModal();
}

// atualizar o carrinho com o item adicionado no Modal
function updateCartModal() {
  // cartItemsContainer.innerHTML = ''para zerar o que estiver lá dentro
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");

    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">

        <div class="">
            <p class="font-bold">${item.name}</p>
            <p class="">Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <button class="remove-from-cart-btn" data-name="${item.name}">
        Remover
        </button>


    </div>

    `;

    // agora calcular o total, coloca antes do appendChild
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  //  inserir o total com o textContent, e cofig para moeda real
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  //   adicionar a quantidade de itens no carrinho no contador do cart na home
  cartCounter.innerHTML = cart.length;
}

// função remover do carrinho
// cartItemsContainer pois é o nosso item dentro do modal
cartItemsContainer.addEventListener("click", (event) => {
  // basicamente esta veirifcando no modal se possui algum elemento com esta classe
  if (event.target.classList.contains("remove-from-cart-btn")) {
    // e se houver pegar dele o atributo passado no data-name
    const name = event.target.getAttribute("data-name");
    // console.log(name)

    removeItemCart(name);
  }
});

// função para remover do carrinho e chamar em cima
function removeItemCart(name) {
  // primeiro pega o indice do elemento
  const index = cart.findIndex((item) => item.name === name);

  // o -1 é porque o findIndex só retorna -1 se ele não encontrar o item na lista, neste caso se ele achar o item vai retornar diferente de -1
  if (index !== -1) {
    // dessa forma pega somente o cart com o index do elemento que foi clicado
    const item = cart[index];
    // console.log(item)

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    // o splice vai remover o o elemento da lista na posição passada no caso o index, e o 1 é para remover 1 elemento
    cart.splice(index, 1);
    updateCartModal();
  }
}

// Agora pegar o que for digitado no input do addressInput

addressInput.addEventListener('input', (event) => {
    // event.target.value para ter acesso ao valor do input
    let inputValue = event.target.value;

    //agora tirar o addresWarn e o border caso o usuario digite no input
    if(inputValue !== '')
        addressInput.classList.remove('border-red-500')
         addressWarn.classList.add('hidden')
})

// finalizar o carrinho
checkoutBtn.addEventListener('click', () => {

    // para barrar caso a loja esteja fechada
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        alert('Restaurante Fechado no momento.')
        return;
    }


    if(cart.length === 0) {
        return;
    }

    if(addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return;
    }

    // caso passe em todas as verificações enviar o pedido para api do whats
    const cartItems = cart.map((item) => {
        return (
            `
             ${item.name}, Quantidade: (${item.quantity}), Preço: R$${item.price} |
            `
        )
        
    }).join('')

    // console.log(cartItems)
    const message = encodeURIComponent(cartItems);
    const phone = '84988578428';

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
})


// verificar a horae manipular o card horario

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23; //true
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-[#54CC0A]')
} else {
    spanItem.classList.remove('bg-[#54CC0A]')
    spanItem.classList.add('bg-red-500')
}