let url = "http://localhost:3000/api/products"

const start = function() {
    fetch(url)
    .then((response) => response.json()
    .then((data) => {
        // for(let product of data) {
            let article = document.createElement("article");
            article.classList.add("cart__item");
            document.querySelector("#cart__items").append(article);

            let divImg = document.createElement("div");
            divImg.classList.add("cart__item__img");
            document.querySelector(".cart__item").append(divImg);

            let image = document.createElement("img");
            image.src = data.imageUrl;
            image.alt = data.altTxt;
            document.querySelector(".cart__item__img").append(image);

            let cartItemContent = document.createElement("div");
            cartItemContent.classList.add("cart__item__content");
            document.querySelector(".cart__item").append(cartItemContent);

            let cartDescription = document.createElement("div");
            cartDescription.classList.add("cart__item__content__description");
            document.querySelector(".cart__item__content").append(cartDescription);

            let title = document.createElement("h2");
            title.textContent = data.name;
            document.querySelector(".cart__item__content__description").append(title);

            let color = document.createElement("p");
            color.textContent = data.colors;
            document.querySelector(".cart__item__content__description").append(color);

            let price = document.createElement("p");
            price.textContent = data.price;
            document.querySelector(".cart__item__content__description").append(price);

            let cartSettings = document.createElement("div");
            cartSettings.classList.add("cart__item__content__settings");
            document.querySelector(".cart__item__content").append(cartSettings);

            let cartSettingsContentQuantity = document.createElement("div");
            cartSettingsContentQuantity.classList.add("cart__item__content__settings__quantity");
            document.querySelector(".cart__item__content__settings").append(cartSettingsContentQuantity);

            let quantity = document.createElement("p");
            quantity.textContent = "Qté : ";
            document.querySelector(".cart__item__content__settings__quantity").append(quantity);

            let itemQuantity = document.createElement("input");
            itemQuantity.type = "number";
            itemQuantity.min = 1;
            itemQuantity.max = 100;
            // itemQuantity.value = kanap.quantity;
            itemQuantity.classList.add("itemQuantity");
            document.querySelector(".cart__item__content__settings__quantity").append(itemQuantity);

            let deleteContent = document.createElement("div");
            deleteContent.classList.add("cart__item__content__settings__delete")
            document.querySelector(".cart__item__content__settings").append(deleteContent);

            let deleteItem = document.createElement("p");
            deleteItem.classList.add("deleteItem");
            deleteItem.textContent = "Supprimer";
            document.querySelector(".cart__item__content__settings__delete").append(deleteItem);
        // }   
    })
    )
}

window.addEventListener("load", start())


