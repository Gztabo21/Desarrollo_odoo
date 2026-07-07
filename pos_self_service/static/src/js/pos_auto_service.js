document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('product-list');
    const cartEl = document.getElementById('cart');
    const createBtn = document.getElementById('create-order');
    const resultEl = document.getElementById('result');

    let products = [];
    let cart = [];

    function renderProducts() {
        productList.innerHTML = '';
        products.forEach(p => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${p.name}</strong> — ${p.price.toFixed(2)} € ` +
                `<button data-id="${p.id}">Añadir</button>`;
            productList.appendChild(div);
            div.querySelector('button').addEventListener('click', () => addToCart(p));
        });
    }

    function renderCart() {
        if (cart.length === 0) {
            cartEl.innerText = 'Vacío';
            return;
        }
        cartEl.innerHTML = '';
        cart.forEach((c, idx) => {
            const el = document.createElement('div');
            el.innerHTML = `${c.name} — ${c.qty} x ${c.price.toFixed(2)} € = ${(c.qty*c.price).toFixed(2)} € ` +
                `<button data-idx="${idx}">-</button>`;
            cartEl.appendChild(el);
            el.querySelector('button').addEventListener('click', () => {
                removeFromCart(idx);
            });
        });
    }

    function addToCart(p) {
        const found = cart.find(x => x.id === p.id);
        if (found) found.qty += 1;
        else cart.push({id: p.id, name: p.name, qty: 1, price: p.price});
        renderCart();
    }

    function removeFromCart(idx) {
        if (!cart[idx]) return;
        cart[idx].qty -= 1;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
        renderCart();
    }

    async function loadProducts() {
        const res = await fetch('/pos_auto_service/products', {credentials: 'include'});
        products = await res.json();
        renderProducts();
    }

    createBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            resultEl.innerText = 'El carrito está vacío.';
            return;
        }
        const items = cart.map(c => ({product_id: c.id, qty: c.qty}));
        resultEl.innerText = 'Creando pedido...';
        try {
            const res = await fetch('/pos_auto_service/create_order', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({items}),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                resultEl.innerHTML = `Pedido creado: <strong>${data.order_name}</strong> (ID ${data.order_id})`;
                cart = [];
                renderCart();
            } else {
                resultEl.innerText = 'Error: ' + (data.error || 'Desconocido');
            }
        } catch (e) {
            resultEl.innerText = 'Error en la petición: ' + e;
        }
    });

    loadProducts();
});
