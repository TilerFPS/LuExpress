document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("products");
    const cartList = document.getElementById("cart-list");
    const checkoutButton = document.getElementById("checkout");

    let cart = [];

    // Buscar produtos no Realtime Database
    database.ref("products").once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            let product = childSnapshot.val();
            let productElement = document.createElement("div");
            productElement.classList.add("product");
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>R$ ${product.price}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Adicionar</button>
            `;
            productsContainer.appendChild(productElement);
        });
    });

    // Adicionar ao carrinho
    window.addToCart = (name, price) => {
        cart.push({ name, price });
        updateCart();
    };

    // Atualizar carrinho
    function updateCart() {
        cartList.innerHTML = "";
        cart.forEach(item => {
            let li = document.createElement("li");
            li.textContent = `${item.name} - R$ ${item.price}`;
            cartList.appendChild(li);
        });
    }

    // Finalizar compra via WhatsApp
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        let message = "Pedido:%0A";
        let total = 0;
        cart.forEach(item => {
            message += `- ${item.name}: R$ ${item.price}%0A`;
            total += item.price;
        });
        message += `%0ATotal: R$ ${total}`;

        let phoneNumber = "SEU_NUMERO_WHATSAPP";  // Substitua pelo seu número
        let url = `https://wa.me/${phoneNumber}?text=${message}`;
        window.location.href = url;
    });
});
