// JS validation and topup message for deliver.html

window.addEventListener('DOMContentLoaded', function() {
    // Product selection logic with main choice and grid
    const products = [
        {
            name: 'Vegetables',
            img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop',
            desc: 'Fresh, pesticide-free vegetables grown with care.'
        },
        {
            name: 'Fruits',
            img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop',
            desc: 'Seasonal fruits picked at peak ripeness.'
        },
        {
            name: 'Grains',
            img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&auto=format&fit=crop',
            desc: 'High-quality grains and pulses for your kitchen.'
        },
        {
            name: 'Mango',
            img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&auto=format&fit=crop',
            desc: 'Sweet, juicy mangoes delivered fresh to your door.'
        }
    ];

    const productInput = document.getElementById('product');
    const orderInput = document.getElementById('order');
    const mainChoiceDiv = document.querySelector('.product-main-choice');
    const gridDiv = document.querySelector('.product-select-grid');

    let selectedProduct = products[0];

    function renderProducts() {
        // Main choice
        mainChoiceDiv.innerHTML = '';
        const mainCard = document.createElement('div');
        mainCard.className = 'product-card selected product-main-card';
        mainCard.setAttribute('data-product', selectedProduct.name);
        mainCard.innerHTML = `
            <div class="product-flip">
                <div class="product-front">
                    <img src="${selectedProduct.img}" alt="${selectedProduct.name}">
                </div>
                <div class="product-back">
                    <h4>${selectedProduct.name}</h4>
                    <p>${selectedProduct.desc}</p>
                </div>
            </div>
        `;
        mainChoiceDiv.appendChild(mainCard);

        // Grid of other choices
        gridDiv.innerHTML = '';
        products.filter(p => p.name !== selectedProduct.name).forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-product', prod.name);
            card.innerHTML = `
                <div class="product-flip">
                    <div class="product-front">
                        <img src="${prod.img}" alt="${prod.name}">
                    </div>
                    <div class="product-back">
                        <h4>${prod.name}</h4>
                        <p>${prod.desc}</p>
                    </div>
                </div>
            `;
            card.onclick = function() {
                selectedProduct = prod;
                productInput.value = prod.name;
                orderInput.value = prod.name;
                renderProducts();
            };
            gridDiv.appendChild(card);
        });
        // Set input values
        productInput.value = selectedProduct.name;
        orderInput.value = selectedProduct.name;
    }

    renderProducts();

    const form = document.getElementById('deliverForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;
        let message = '';
        const name = form.name.value.trim();
        const address = form.address.value.trim();
        const phone = form.phone.value.trim();
        const date = form.date.value;
        const product = form.product.value.trim();

        // Enhanced validation
        if (!product) {
            valid = false;
            message = 'Please select a product to deliver by clicking an image.';
        } else if (!name || name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
            valid = false;
            message = 'Please enter your full name (at least 3 letters, letters and spaces only).';
        } else if (!address || address.length < 8) {
            valid = false;
            message = 'Please enter a valid address (at least 8 characters).';
        } else if (!/^\d{10}$/.test(phone)) {
            valid = false;
            message = 'Phone number must be exactly 10 digits.';
        } else if (!date) {
            valid = false;
            message = 'Please select a delivery date.';
        } else {
            // Check if date is in the future
            const today = new Date();
            const selectedDate = new Date(date);
            today.setHours(0,0,0,0);
            if (selectedDate < today) {
                valid = false;
                message = 'Delivery date must be today or in the future.';
            }
        }
        if (!valid) {
            showTopup(message, 'error');
            return;
        }
        showTopup('Delivery request submitted successfully!', 'success');
        form.reset();
        selectedProduct = products[0];
        renderProducts();
    });

    function showTopup(msg, type) {
        let topup = document.createElement('div');
        topup.className = 'topup-message ' + (type === 'success' ? 'success' : 'error');
        topup.innerHTML = `<span>${msg}</span><button class="topup-close" aria-label="Close">&times;</button>`;
        document.body.appendChild(topup);
        const closeBtn = topup.querySelector('.topup-close');
        closeBtn.onclick = function() {
            topup.remove();
        };
        setTimeout(() => {
            if (document.body.contains(topup)) topup.remove();
        }, 5000);
    }
});
