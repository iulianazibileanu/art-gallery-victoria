const productList = [{
    id: "one",
    price: 100,
    name: "Toamna de aur",
    img: "https://1.bonami.ro/images/products/25/b3/25b30ef7839e924f304f2f439ec765776f09a57e-600x600.jpeg"
},
    {
        id: "two",
        price: 150,
        name: "Rugină vie",
        img: "https://1.bonami.ro/images/products/02/80/0280c1022ce7b239cb1f1e8d6f3a58fd8f97cbd5-600x600.jpeg"
    },
    {
        id: "three",
        price: 95,
        name: "Dragoste în octombrie",
        img: "https://www.storedesign.ro/image/cache/catalog/Tablouri/500-600/orasul-de-pe-lac-1100x1100.jpg"
    }]
let cartTotal = 0;
let numberCart = parseInt(document.getElementById("number-prod-in-cart").innerHTML);
let cartDisappear;

//lista de produse salvate in localstorage
let selectedProducts = JSON.parse(localStorage.getItem("selectedProduct")) ?? [];

document.getElementById("products-container").addEventListener("click", addToCart);
document.getElementById("empty-cart-button").addEventListener("click", emptyCart);

function cartExpand() {
    document.getElementById("expanded-cart").style.display = "block";
}

function closeCart() {
    document.getElementById("expanded-cart").style.display = "none";
}

function cartOptions() {
    if (cartTotal >= 100) {
        document.getElementById("min-order").style.display = "none";
        document.getElementById("checkout-button").classList.add("checkout", "pointer");
    }

    if (numberCart > 0) {
        document.getElementById("empty-cart-button").classList.add("empty-cart", "pointer");
    }
}

function addToCart(event) {
    clearTimeout(cartDisappear);
    let productId;
    const elementType = event.composedPath()[0].tagName;
    if (elementType === "BUTTON") {
        for (let i = 0; i < event.composedPath().length; i++) {
            if (event.composedPath()[i].getAttribute("productId")) {
                productId = event.composedPath()[i].getAttribute("productId");
                break;
            }
        }
    }

    for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === productId) {
            cartTotal += productList[j].price;
            setSelectedProduct(productList[j]);
            numberCart++;
            document.getElementById("number-prod-in-cart").innerHTML = numberCart;
            document.getElementById("cart-value").innerHTML = `Valoare comandă: ${cartTotal} lei`;
            cartExpand();
            cartDisappear = setTimeout(closeCart, 2500);
            document.getElementById("expanded-cart").addEventListener("mouseover", () => clearTimeout(cartDisappear));
            cartOptions();
        }
    }
    localStorage.setItem("numberCartLS", numberCart);
    localStorage.setItem("cartTotalLS", cartTotal);
}


// functie ce adauga produs in cos - product este parametrul ce contine produsul ce trebuie adaugat
function setSelectedProduct(product) {
    const finishedProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: 1
    };
    let isProductAdded = false;
    let newQuantity;
    for (let i = 0; i < selectedProducts.length; i++) {
        if (finishedProduct.id === selectedProducts[i].id) {
            selectedProducts[i].quantity++;
            newQuantity = selectedProducts[i].quantity;
            isProductAdded = true;
        }
    }

    if (isProductAdded === false) {
        selectedProducts.push(finishedProduct);
    }
    localStorage.setItem("selectedProduct", JSON.stringify(selectedProducts));
    if (isProductAdded) {
        const quantity = document.getElementById(`quantity-${product.id}`);
        quantity.innerHTML = newQuantity;
    } else {
        createElementProduct(finishedProduct, 1);
    }
}

// functie ce adauga produse in cos daca sunt salvate in localstorage
function computeCartListOnLoad() {
    for (let i = 0; i < selectedProducts.length; i++) {
        for (let j = 0; j < productList.length; j++) {
            if (selectedProducts[i].id === productList[j].id) {
                createElementProduct(productList[j], selectedProducts[i].quantity);
                
            }
        }
    }
    numberCart = JSON.parse(parseInt(localStorage.getItem("numberCartLS")));
    document.getElementById("number-prod-in-cart").innerHTML = numberCart;
    cartTotal = JSON.parse(parseInt(localStorage.getItem("cartTotalLS")));
    document.getElementById("cart-value").innerHTML = `Valoare comandă: ${cartTotal} lei`;
    cartOptions();
}

// creem elemente in html pentru un produs

function createElementProduct(product, quantity) {
    let cartProduct = document.createElement("div");
    cartProduct.classList.add("cart-product");
    document.getElementById("cart-title").insertAdjacentElement("afterend", cartProduct);
    let painting = document.createElement("img");
    painting.src = product.img;
    painting.style.width = "100px";
    cartProduct.appendChild(painting);
    let paintingTitle = document.createElement("div");
    paintingTitle.innerHTML = product.name;
    cartProduct.appendChild(paintingTitle);
    let cartProdDetails = document.createElement("div");
    cartProduct.appendChild(cartProdDetails);
    let cartQuantity = document.createElement("div");
    cartQuantity.classList.add("display-flex");
    cartProdDetails.appendChild(cartQuantity);
    let quantityEl = document.createElement("div");
    quantityEl.id = `quantity-${product.id}`;
    quantityEl.innerHTML = quantity;
    quantityEl.style.padding = "0 8px";
    let addMore = document.createElement("button");
    addMore.innerHTML = "+";
    let less = document.createElement("button");
    less.innerHTML = "-";
    cartQuantity.appendChild(less);
    cartQuantity.appendChild(quantityEl);
    cartQuantity.appendChild(addMore);
    let cartPrice = document.createElement("div");
    cartPrice.innerHTML = product.price + " lei";
    cartPrice.style.textAlign = "right";
    cartPrice.id = `price-${product.id}`;
    cartProdDetails.appendChild(cartPrice);
    less.id = `less-${product.id}`;
    let lessClick = document.getElementById(`less-${product.id}`);
    lessClick.addEventListener("click", () => {
        for (let i = 0; i < selectedProducts.length; i++) {
            if (selectedProducts[i].id === product.id) {
                if (selectedProducts[i].quantity > 1) {
                    selectedProducts[i].quantity--;
                    quantityEl.innerHTML = selectedProducts[i].quantity;
                    numberCart--;
                    document.getElementById("number-prod-in-cart").innerHTML = numberCart;
                    cartTotal -= selectedProducts[i].price;
                    document.getElementById("cart-value").innerHTML = `Valoare comandă: ${cartTotal} lei`;
                    localStorage.setItem("selectedProduct", JSON.stringify(selectedProducts));
                    if(cartTotal<100) {
                        document.getElementById("min-order").style.display = "block";
                        document.getElementById("checkout-button").classList.remove("checkout", "pointer");
                    }
                }
            }
        }
    });

    addMore.id = `more-${product.id}`;
    let addMoreClick = document.getElementById(`more-${product.id}`);
    addMoreClick.addEventListener("click", () => {
        for (let i = 0; i < selectedProducts.length; i++) {
            if (selectedProducts[i].id === product.id) {
                if (selectedProducts[i].quantity >= 1) {
                    selectedProducts[i].quantity++;
                    quantityEl.innerHTML = selectedProducts[i].quantity;
                    numberCart++;
                    cartTotal += selectedProducts[i].price;
                    document.getElementById("cart-value").innerHTML = `Valoare comandă: ${cartTotal} lei`;
                    document.getElementById("number-prod-in-cart").innerHTML = numberCart;
                    localStorage.setItem("selectedProduct", JSON.stringify(selectedProducts));
                    if(cartTotal>100) {
                        document.getElementById("min-order").style.display = "none";
                        document.getElementById("checkout-button").classList.add("checkout", "pointer");
                    }
                }
            }
        }
    });
    cartQuantity.classList.add("cart-quantity-container");
    let eliminateProd = document.createElement("button");
    eliminateProd.innerHTML = "x";
    eliminateProd.classList.add("eliminate");
    cartProduct.appendChild(eliminateProd);
    eliminateProd.addEventListener("click", () => {
        cartProduct.style.display = "none";
        for (let i = 0; i < selectedProducts.length; i++) {
            if (selectedProducts[i].id === product.id) {
                cartTotal = cartTotal - selectedProducts[i].price*selectedProducts[i].quantity
            document.getElementById('cart-value').innerHTML = `Valoare comandă: ${cartTotal} lei`;
            numberCart = numberCart - selectedProducts[i].quantity;
            document.getElementById("number-prod-in-cart").innerHTML = numberCart;
            // localStorage.setItem("selectedProduct", JSON.stringify(selectedProducts)); 
            if(cartTotal === 0) {
                    emptyCart();
                } else if(cartTotal<100) {
                    document.getElementById("min-order").style.display = "block";
                    document.getElementById("checkout-button").classList.remove("checkout", "pointer");
                    localStorage.removeItem("selectedProduct");
                    localStorage.removeItem("numberCartLS");
                    localStorage.removeItem("cartTotalLS");
                }
                    }
    }}
        )
}

computeCartListOnLoad();

function emptyCart() {
    localStorage.removeItem("selectedProduct");
    localStorage.removeItem("numberCartLS");
    localStorage.removeItem("cartTotalLS");
    selectedProducts = [];
    cartTotal = 0;
    numberCart = 0;
    document.getElementById("number-prod-in-cart").innerHTML = numberCart;
    document.getElementById("cart-value").innerHTML = "Coșul este gol.";
    document.getElementById("min-order").style.display = "block";
    document.getElementById("checkout-button").classList.remove("checkout", "pointer");
    document.getElementById("empty-cart-button").classList.remove("empty-cart", "pointer");
    const products = document.querySelectorAll('.cart-product');
    for(let i = 0; i < products.length; i++) {
        products[i].remove();
    }
}
