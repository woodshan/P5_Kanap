let kanap = JSON.parse(localStorage.getItem("kanap"));

const start = async function () {
  for (let basket of kanap) {
    let url = `http://localhost:3000/api/products/${basket.id}`;

    await fetch(url)
      .then((response) => {
        if (response.ok === true) {
          return response.json();
        }
      })
      .then((product) => {
        displayBasket(basket, product);

      })
      .catch((erreur) => {
        console.log("Il y a une erreur : " + erreur);
      });
  }
  clickDelete();
  changeQuantity();
};

window.addEventListener("load", start());

//Afficher le panier
function displayBasket(productInBasket, productInData) {
  let article = document.createElement("article");
  article.classList.add("cart__item");
  article.setAttribute("data-id", productInBasket.id);
  article.setAttribute("data-color", productInBasket.colors);
  document.querySelector("#cart__items").appendChild(article);

  let imgContainer = document.createElement("div");
  imgContainer.setAttribute("class", "cart__item__img");
  article.appendChild(imgContainer);

  let image = document.createElement("img");
  image.src = productInData.imageUrl;
  image.alt = productInData.altTxt;
  imgContainer.appendChild(image);

  let itemContent = document.createElement("div");
  itemContent.setAttribute("class", "cart__item__content");
  article.appendChild(itemContent);

  let contentDescription = document.createElement("div");
  contentDescription.setAttribute("class", "cart__item__content__description");
  itemContent.appendChild(contentDescription);

  let productName = document.createElement("h2");
  productName.textContent = productInData.name;
  contentDescription.appendChild(productName);

  let productColors = document.createElement("p");
  productColors.textContent = productInBasket.colors;
  contentDescription.appendChild(productColors);

  let productPrice = document.createElement("p");
  productPrice.textContent = `${productInData.price * productInBasket.quantity} €`;
  contentDescription.appendChild(productPrice);

  let settingsContainer = document.createElement("div");
  settingsContainer.setAttribute("class", "cart__item__content__settings");
  itemContent.appendChild(settingsContainer);

  let contentSettings = document.createElement("div");
  contentSettings.setAttribute(
    "class",
    "cart__item__content__settings__quantity"
  );
  settingsContainer.appendChild(contentSettings);

  let titleQuantity = document.createElement("p");
  titleQuantity.textContent = "Qté : ";
  contentSettings.appendChild(titleQuantity);

  let quantity = document.createElement("input");
  quantity.classList.add("itemQuantity");
  quantity.type = "number";
  quantity.name = "itemQuantity";
  quantity.min = "1";
  quantity.max = "100";
  quantity.value = productInBasket.quantity;
  contentSettings.appendChild(quantity);

  let contentDelete = document.createElement("div");
  contentDelete.setAttribute("class", "cart__item__content__settings__delete");
  settingsContainer.appendChild(contentDelete);

  let deleteItem = document.createElement("p");
  deleteItem.classList.add("deleteItem");
  deleteItem.textContent = "Supprimer";
  contentDelete.appendChild(deleteItem);

  let totalQuantity = document.querySelector("#totalQuantity");
  totalQuantity.textContent = getTotalQuantity();

  let totalPrice = document.querySelector("#totalPrice");
  totalPrice.textContent = getTotalPrice(
    productInData.price,
    productInBasket.quantity
  );

}

//Calculer la quantité total du panier
function getTotalQuantity() {
  let number = 0;
  for (let total of kanap) {
    number += total.quantity;
  }
  return number;
}

//Calculer le prix total des articles
let cartTotalPrice = 0;
function getTotalPrice(price, quantity) {
  cartTotalPrice += price * quantity;
  return cartTotalPrice;
};

// Retirer le produit du panier
function removeFromBasket(element, idProduct, colorProduct) {
  element.closest(".cart__item").remove();
  kanap = kanap.filter(p => p.id != idProduct) && kanap.filter(p => p.colors != colorProduct);
  saveKanap(kanap);
  // location.reload();
};

// Clicker pour retirer le produit du panier
function clickDelete () {
  let deleteBtn = document.querySelectorAll('.deleteItem'); 
  // console.log(deleteBtn);
  for(let btn of deleteBtn) {
    btn.addEventListener("click", (evt) => {
      // console.log(evt);
      let id = evt.target.closest("article").dataset.id;
      let color = evt.target.closest("article").dataset.color;
      console.log(id, color);
      removeFromBasket(btn, id, color);
    })
  }
}

// Changer la quantité du produit à partir de la page panier
function changeQuantity() {
  let btnChange = document.querySelectorAll(".itemQuantity");
  for(let btn of btnChange) {
    btn.addEventListener("change", (evt) => {
      let id = evt.target.closest("article").dataset.id;
      let color = evt.target.closest("article").dataset.color;
      let foundProduct = kanap.find((p) => p.id == id) && kanap.find((p) => p.colors == color);
      if (foundProduct != undefined) {
        foundProduct.quantity += Number(btn.value) - foundProduct.quantity;
      }
      saveKanap(kanap);
    })
  }
}

//Enregistrer panier dans localSTorage
function saveKanap(kanap) {
  localStorage.setItem("kanap", JSON.stringify(kanap));
};




