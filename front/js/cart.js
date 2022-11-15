let kanap = JSON.parse(localStorage.getItem("kanap"));

const start = function() {
    
    for(let basket of kanap) {
        
    let url = `http://localhost:3000/api/products/${basket.id}`

    fetch(url)
    .then((response) => {
        if(response.ok === true) {
            return response.json()
        }
    })
    .then((product) => {

        displayBasket(basket, product);

    }) .catch(erreur => {
        console.log("Il y a une erreur : " + erreur);
    });

    };
};

window.addEventListener("load", start())

//Afficher le panier
function displayBasket(productInBasket, productInData) {
    let display = "";
            display += `
            <article class="cart__item" data-id=${productInBasket.id} data-color=${productInBasket.colors}>
                <div class="cart__item__img">
                <img src=${productInData.imageUrl} alt=${productInData.altTxt}>
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${productInData.name}</h2>
                    <p>${productInBasket.colors}</p>
                    <p>${productInData.price * productInBasket.quantity} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${productInBasket.quantity}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
                </div>
            </article>`;

            let totalQuantity = document.querySelector("#totalQuantity");
            totalQuantity.textContent = getTotalQuantity();

            let totalPrice = document.querySelector("#totalPrice");
            totalPrice.textContent = getTotalPrice(productInData.price, productInBasket.quantity); 
            
        document.querySelector("#cart__items").insertAdjacentHTML("beforeend", display); 

        let btnRemove = document.querySelector(".deleteItem"); 
        btnRemove.addEventListener("click", () => {
            removeFromBasket(productInBasket);
        });
};

//Calculer la quantité total du panier
function getTotalQuantity () {
    let number = 0;
    for(let total of kanap) {
        number += total.quantity;
    };
    return number;
};

//Calculer le prix total des articles
let cartTotalPrice = 0;
function getTotalPrice(price, quantity) {
    cartTotalPrice += price * quantity;
    return cartTotalPrice;
};

// Changer la quantité du produit à partir de la page panier
function changeQuantity(product, quantity) {
    let foundProduct = kanap.find(p => p.id == product.id); 
    if (foundProduct != undefined) {
        foundProduct.quantity += quantity;
    }
    saveKanap(kanap);
}

// Retirer le produit du panier
function removeFromBasket(produit) {
    // console.log(btnDelete.closest(".cart__item"));
    // btnDelete.closest(".cart__item").remove();
    // kanap = kanap.filter(p => p.id != produit.id);
    // kanap.closest(produit.id).remove
    saveKanap(kanap);
}

//Enregistrer panier dans localSTorage
function saveKanap(kanap) { 
    localStorage.setItem("kanap", JSON.stringify(kanap));
}




