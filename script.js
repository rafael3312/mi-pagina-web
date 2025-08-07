// Estado global de la aplicación
let products = [
    {
        id: 1,
        name: "Vibrador Premium Rosa",
        price: 89.99,
        category: "juguetes",
        images: [
            "https://example.com/vibrador1.jpg",
            "https://example.com/vibrador2.jpg",
            "https://example.com/vibrador3.jpg"
        ],
        features: "Silicona médica, 10 modos de vibración, resistente al agua, carga USB"
    },
    {
        id: 2,
        name: "Aceite de Masaje Sensual",
        price: 25.50,
        category: "aceites",
        images: [
            "https://example.com/aceite1.jpg",
            "https://example.com/aceite2.jpg"
        ],
        features: "Base natural, aroma a vainilla, 100ml, no mancha"
    },
    {
        id: 3,
        name: "Lencería Conjunto Encaje",
        price: 45.00,
        category: "lenceria",
        images: [
            "https://example.com/lenceria1.jpg",
            "https://example.com/lenceria2.jpg",
            "https://example.com/lenceria3.jpg",
            "https://example.com/lenceria4.jpg"
        ],
        features: "Encaje francés, tallas S-XL, copas con push-up, incluye tanga"
    }
];

let isAdminLoggedIn = false;
let nextProductId = 4;
let productToDelete = null;
let isEditing = false;
let imageSliders = {};
let lastScrollPosition = 0;
let filtersVisible = true;

// Verificación de edad
function confirmAge(isAdult) {
    if (isAdult) {
        document.getElementById('ageVerification').style.display = 'none';
        // Mostrar filtros después de la verificación
        showFilters();
    } else {
        alert('Lo sentimos, debes ser mayor de edad para acceder a este sitio.');
        window.location.href = 'https://www.google.com';
    }
}

// Mostrar/ocultar filtros
function toggleFilters() {
    const filtersContainer = document.getElementById('filtersContainer');
    if (filtersContainer.classList.contains('visible')) {
        hideFilters();
    } else {
        showFilters();
    }
}

function showFilters() {
    const filtersContainer = document.getElementById('filtersContainer');
    const toggleBtn = document.getElementById('filterToggleBtn');
    
    filtersContainer.classList.add('visible');
    document.getElementById('filterToggleContainer').classList.remove('hidden');
    toggleBtn.innerHTML = '<i class="fas fa-times"></i> Cerrar filtros';
    filtersVisible = true;
}

function hideFilters() {
    const filtersContainer = document.getElementById('filtersContainer');
    const toggleBtn = document.getElementById('filterToggleBtn');
    
    filtersContainer.classList.remove('visible');
    toggleBtn.innerHTML = '<i class="fas fa-sliders-h"></i> Filtros';
    filtersVisible = false;
}

// Manejar scroll para ocultar/mostrar filtros
function handleScroll() {
    const currentScrollPosition = window.pageYOffset;
    const filterToggle = document.getElementById('filterToggleContainer');
    
    if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
        // Scroll hacia abajo
        if (filtersVisible) {
            hideFilters();
        }
        filterToggle.classList.remove('hidden');
    } else {
        // Scroll hacia arriba
        if (currentScrollPosition < 100) {
            showFilters();
        }
        filterToggle.classList.remove('hidden');
    }
    
    lastScrollPosition = currentScrollPosition;
}

// Funciones para manejar el modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    productToDelete = null;
}

// Función de login corregida
function login() {
    const password = document.getElementById('adminPassword').value;
    const errorMsg = document.getElementById('loginError');
    
    // Validar que se ingresó una contraseña
    if (!password) {
        errorMsg.textContent = 'Por favor ingrese la contraseña';
        return;
    }
    
    // Contraseña hardcodeada (en producción usar autenticación segura)
    if (password === 'admin123') {
        isAdminLoggedIn = true;
        closeModal();
        showAdminPanel();
        errorMsg.textContent = '';
    } else {
        errorMsg.textContent = 'Contraseña incorrecta. Intente nuevamente.';
    }
}

// Cambiar entre vistas
function showCatalog() {
    document.getElementById('catalogView').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    renderProducts();
}

function showAdminPanel() {
    if (!isAdminLoggedIn) {
        showLoginModal();
        return;
    }
    document.getElementById('catalogView').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderAdminProductsTable();
}

// Inicializar slider de imágenes para un producto
function initImageSlider(productId, images) {
    const sliderId = `slider-${productId}`;
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    let currentIndex = 0;
    const dotsContainer = slider.querySelector('.product-image-dots');
    const imagesElements = slider.querySelectorAll('.product-image');
    
    // Crear dots/navegación
    dotsContainer.innerHTML = '';
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'product-image-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            showImage(index, productId);
        });
        dotsContainer.appendChild(dot);
    });
    
    // Configurar botones de navegación
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    
    prevBtn.addEventListener('click', () => {
        showImage((currentIndex - 1 + images.length) % images.length, productId);
    });
    
    nextBtn.addEventListener('click', () => {
        showImage((currentIndex + 1) % images.length, productId);
    });
    
    // Función para mostrar imagen específica
    function showImage(index, productId) {
        currentIndex = index;
        
        // Actualizar imágenes
        imagesElements.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        
        // Actualizar dots
        const dots = dotsContainer.querySelectorAll('.product-image-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Configurar rotación automática
    let intervalId = setInterval(() => {
        showImage((currentIndex + 1) % images.length, productId);
    }, 5000);
    
    // Guardar referencia para poder limpiar después
    imageSliders[productId] = {
        intervalId: intervalId,
        showImage: showImage
    };
    
    // Pausar al hacer hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
    });
    
    slider.addEventListener('mouseleave', () => {
        intervalId = setInterval(() => {
            showImage((currentIndex + 1) % images.length, productId);
        }, 5000);
        imageSliders[productId].intervalId = intervalId;
    });
}

// Renderizar productos en el catálogo
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const priceFilter = document.getElementById('priceFilter').value;
    
    // Filtrar productos según los criterios
    let filteredProducts = products.filter(product => {
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.features.toLowerCase().includes(searchTerm);
        
        let matchesPrice = true;
        if (priceFilter) {
            if (priceFilter === '0-50') {
                matchesPrice = product.price <= 50;
            } else if (priceFilter === '50-100') {
                matchesPrice = product.price > 50 && product.price <= 100;
            } else if (priceFilter === '100-200') {
                matchesPrice = product.price > 100 && product.price <= 200;
            } else if (priceFilter === '200+') {
                matchesPrice = product.price > 200;
            }
        }
        
        return matchesCategory && matchesSearch && matchesPrice;
    });

    // Actualizar contador de productos
    document.getElementById('productCount').textContent = filteredProducts.length;
    
    // Generar HTML para cada producto
    grid.innerHTML = filteredProducts.map(product => {
        const hasImages = product.images && product.images.length > 0;
        const firstImage = hasImages ? product.images[0] : '';
        
        return `
        <div class="product-card">
            <div class="product-image-container">
                <div class="product-image-slider" id="slider-${product.id}">
                    ${hasImages ? 
                        product.images.map((img, index) => `
                            <img src="${img}" alt="${product.name}" class="product-image ${index === 0 ? 'active' : ''}">
                        `).join('') :
                        '<div class="product-image active">💝</div>'
                    }
                    <div class="product-image-nav">
                        <button class="prev-btn"><i class="fas fa-chevron-left"></i></button>
                        <button class="next-btn"><i class="fas fa-chevron-right"></i></button>
                    </div>
                    <div class="product-image-dots"></div>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-features">${product.features}</div>
                <button class="btn-contact" onclick="contactWhatsApp('${product.name}', ${product.price})">
                    <i class="fab fa-whatsapp"></i> Consultar por WhatsApp
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    // Inicializar sliders para cada producto
    filteredProducts.forEach(product => {
        if (product.images && product.images.length > 1) {
            initImageSlider(product.id, product.images);
        }
    });
}

// Renderizar tabla de productos en el panel de admin
function renderAdminProductsTable() {
    const tableBody = document.getElementById('adminProductsTable');
    const searchTerm = document.getElementById('adminSearch')?.value.toLowerCase() || '';
    
    // Filtrar productos si hay término de búsqueda
    let filteredProducts = products;
    if (searchTerm) {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.features.toLowerCase().includes(searchTerm)
        );
    }
    
    // Actualizar contador de productos
    document.getElementById('adminProductCount').textContent = `${filteredProducts.length} productos`;
    
    tableBody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="action-btn btn-delete" onclick="confirmDelete(${product.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Obtener el nombre legible de la categoría
function getCategoryName(category) {
    const categories = {
        'juguetes': 'Juguetes Íntimos',
        'cosmetica': 'Cosmética Sensual',
        'lenceria': 'Lencería',
        'aceites': 'Aceites y Lubricantes'
    };
    return categories[category] || category;
}

// Integración con WhatsApp
function contactWhatsApp(productName, price) {
    const message = `Hola! Me interesa el producto: ${productName} - Precio: $${price.toFixed(2)}. ¿Podrías darme más información?`;
    const phoneNumber = "1234567890"; // Cambiar por tu número real
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Manejo del formulario de administración
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (isEditing) {
        updateProduct();
    } else {
        addProduct();
    }
});

function addProduct() {
    // Obtener valores del formulario
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const imagesInput = document.getElementById('productImages').value;
    const features = document.getElementById('productFeatures').value;
    
    // Validación básica
    if (!name || !price || !category) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    // Procesar imágenes (separadas por comas)
    const images = imagesInput 
        ? imagesInput.split(',').map(url => url.trim()).filter(url => url)
        : [];
    
    // Crear nuevo producto
    const newProduct = {
        id: nextProductId++,
        name: name,
        price: price,
        category: category,
        images: images,
        features: features
    };
    
    // Agregar al array de productos
    products.push(newProduct);
    
    // Limpiar formulario
    resetForm();
    
    // Mostrar mensaje de éxito
    showMessage('Producto agregado exitosamente!', 'success');
    
    // Actualizar las vistas
    renderProducts();
    renderAdminProductsTable();
}

function editProduct(productId) {
    // Buscar el producto a editar
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Llenar el formulario con los datos del producto
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImages').value = product.images?.join(', ') || '';
    document.getElementById('productFeatures').value = product.features;
    
    // Cambiar a modo edición
    isEditing = true;
    
    // Mostrar mensaje
    showMessage('Editando producto. Complete los cambios y haga clic en Guardar.', 'info');
}

function updateProduct() {
    const productId = parseInt(document.getElementById('productId').value);
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const imagesInput = document.getElementById('productImages').value;
    const features = document.getElementById('productFeatures').value;
    
    // Validación básica
    if (!name || !price || !category) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    // Procesar imágenes (separadas por comas)
    const images = imagesInput 
        ? imagesInput.split(',').map(url => url.trim()).filter(url => url)
        : [];
    
    // Buscar el índice del producto
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) return;
    
    // Actualizar el producto
    products[productIndex] = {
        id: productId,
        name: name,
        price: price,
        category: category,
        images: images,
        features: features
    };
    
    // Limpiar formulario y salir del modo edición
    resetForm();
    isEditing = false;
    
    // Mostrar mensaje de éxito
    showMessage('Producto actualizado exitosamente!', 'success');
    
    // Actualizar las vistas
    renderProducts();
    renderAdminProductsTable();
}

function confirmDelete(productId) {
    productToDelete = productId;
    document.getElementById('confirmModal').style.display = 'block';
    document.getElementById('confirmMessage').textContent = 
        `¿Estás seguro que deseas eliminar el producto "${products.find(p => p.id === productId).name}"?`;
}

function deleteProduct() {
    if (!productToDelete) return;
    
    // Filtrar el producto a eliminar
    products = products.filter(p => p.id !== productToDelete);
    
    // Cerrar modal y limpiar
    closeConfirmModal();
    
    // Mostrar mensaje de éxito
    showMessage('Producto eliminado exitosamente!', 'success');
    
    // Actualizar las vistas
    renderProducts();
    renderAdminProductsTable();
    
    // Si estábamos editando el producto eliminado, limpiar el formulario
    if (isEditing && parseInt(document.getElementById('productId').value) === productToDelete) {
        resetForm();
        isEditing = false;
    }
}

function cancelEdit() {
    resetForm();
    isEditing = false;
    showMessage('Edición cancelada.', 'info');
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

function showMessage(message, type) {
    const messageEl = document.getElementById('adminMessage');
    messageEl.textContent = message;
    messageEl.className = type === 'success' ? 'success-msg' : 'info-msg';
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        messageEl.textContent = '';
    }, 3000);
}

// Event listeners para los filtros
document.getElementById('categoryFilter').addEventListener('change', renderProducts);
document.getElementById('searchInput').addEventListener('input', renderProducts);
document.getElementById('priceFilter').addEventListener('change', renderProducts);

// Event listener para búsqueda en panel admin
document.getElementById('adminSearch')?.addEventListener('input', renderAdminProductsTable);

// Event listener para el botón de toggle de filtros
document.getElementById('filterToggleBtn')?.addEventListener('click', toggleFilters);

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    if (event.target == document.getElementById('loginModal')) {
        closeModal();
    }
    if (event.target == document.getElementById('confirmModal')) {
        closeConfirmModal();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar filtros inicialmente
    hideFilters();
    
    // Configurar evento de scroll
    window.addEventListener('scroll', handleScroll);
    
    // Renderizar productos
    renderProducts();
});

// Manejar redimensionamiento de pantalla
window.addEventListener('resize', function() {
    // Ajustes responsivos si son necesarios
});