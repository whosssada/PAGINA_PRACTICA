// Carrito de compras
let cart = [];

// Función para añadir productos al carrito
function addToCart(product) {
    cart.push(product);
    updateCartIcon();
    showNotification('Producto añadido al carrito');
    // Guardar el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para actualizar el ícono del carrito
function updateCartIcon() {
    const cartIcon = document.querySelector('.cart-count');
    if (cartIcon) {
        cartIcon.textContent = cart.length;
        cartIcon.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

// Función para mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para mostrar el carrito
function showCart() {
    const cartModal = document.createElement('div');
    cartModal.className = 'cart-modal';
    
    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    
    const cartHeader = document.createElement('div');
    cartHeader.className = 'cart-header';
    cartHeader.innerHTML = `
        <h2>Tu Carrito</h2>
        <button class="close-cart">&times;</button>
    `;
    
    const cartItems = document.createElement('div');
    cartItems.className = 'cart-items';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price">$${item.price}</p>
                </div>
                <button class="remove-item" data-index="${index}">&times;</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    const cartFooter = document.createElement('div');
    cartFooter.className = 'cart-footer';
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartFooter.innerHTML = `
        <div class="cart-total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
        <button class="checkout-button">Proceder al Pago</button>
    `;
    
    cartContent.appendChild(cartHeader);
    cartContent.appendChild(cartItems);
    cartContent.appendChild(cartFooter);
    cartModal.appendChild(cartContent);
    document.body.appendChild(cartModal);
    
    // Event listeners para el carrito
    cartModal.querySelector('.close-cart').addEventListener('click', () => {
        cartModal.remove();
    });
    
    cartModal.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            cart.splice(index, 1);
            updateCartIcon();
            localStorage.setItem('cart', JSON.stringify(cart));
            cartModal.remove();
            showCart();
        });
    });
    
    cartModal.querySelector('.checkout-button').addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'pago.html';
        } else {
            showNotification('El carrito está vacío', 'error');
        }
    });
}

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Cargar el carrito desde localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    // Añadir contador al ícono del carrito
    const cartIcon = document.querySelector('.nav-icons a:last-child');
    const cartCount = document.createElement('span');
    cartCount.className = 'cart-count';
    cartIcon.appendChild(cartCount);
    
    // Event listener para el ícono del carrito
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showCart();
    });
    
    // Event listeners para los botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const product = {
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
                image: productCard.querySelector('img').src
            };
            addToCart(product);
        });
    });

    // Actualizar el ícono del carrito al cargar la página
    updateCartIcon();
}); 