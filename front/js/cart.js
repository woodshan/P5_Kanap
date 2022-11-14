let kanap = JSON.parse(localStorage.getItem("kanap"));

const start = function() {
    
    for(let basket of kanap) {

    let url = `http://localhost:3000/api/products/${basket.id}`

    fetch(url)
    .then((response) => response.json()
    .then((product) => {
        let display = "";

            display = `
            <article class="cart__item" data-id=${basket.id} data-color=${basket.colors}>
                <div class="cart__item__img">
                <img src=${product.imageUrl} alt=${product.altTxt}>
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${basket.colors}</p>
                    <p>${product.price * basket.quantity} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${basket.quantity}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
                </div>
            </article>`

            let productPrice = product.price * basket.quantity;

            let totalQuantity = document.querySelector("#totalQuantity");
            totalQuantity.textContent = getTotalQuantity();

            let totalPrice = document.querySelector("#totalPrice");
            totalPrice.textContent = productPrice; 
            console.log(productPrice);   

        document.querySelector("#cart__items").insertAdjacentHTML("beforeend", display); 
    })
    ).catch(erreur => {
        console.log("Il y a une erreur : " + erreur)
    })
        
    } 
}

//Calculer la quantité total du panier
function getTotalQuantity () {
    let number = 0;
    for(let total of kanap) {
        number += total.quantity;
    }
    return number;
}

// console.log(getTotalPrice())

window.addEventListener("load", start())


