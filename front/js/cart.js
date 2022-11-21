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

  // Lorsque le panier est vide
  if(kanap.length == 0) {
    let displayForm = document.querySelector(".cart__order");
    displayForm.style.display = "none";
  }

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

// Retirer le produit du panier
function removeFromBasket(element, idProduct, colorProduct) {
  element.closest(".cart__item").remove();
  kanap = kanap.filter(p => p.id != idProduct) && kanap.filter(p => p.colors != colorProduct);
  saveKanap(kanap);
  location.reload();
};

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

// PARTIE PASSER LA COMMANDE

// Recuperer tous les élement du formulaire;
let firstName = document.querySelector("#firstName");
let firstNameError = document.querySelector("#firstNameErrorMsg");

let lastName = document.querySelector("#lastName");
let lastNameError = document.querySelector("#lastNameErrorMsg");

let address = document.querySelector("#address");
let addressError = document.querySelector("#addressErrorMsg");

let city = document.querySelector("#city");
let cityError = document.querySelector("#cityErrorMsg");

let email = document.querySelector("#email");
let emailError = document.querySelector("#emailErrorMsg");

let formulaire = document.querySelector(".cart__order__form");

let orderButton = document.querySelector("#order");

// Creation de regex 
let nameRegExp = /^[a-zA-Z-àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s\,\'\-]*$/
let addressRegExp = /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s\,\'\-]*$/
let numberRegExp = /[0-9]/
let postalCode = /[0-9]{5}/
let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');

//Fonction pour tester le prénom et le nom
function nameValid(name, nameError, nameLength) {
  if(nameRegExp.test(name) && name != "" && nameLength >= 2) {
    nameError.style.display = "none";
  } else {
    nameError.textContent = "Ce champ doit contenir au minimum 2 caractères."
  }
}

// Fonction pour tester l'adresse
function addressValid() {
  let splitWords = address.value.split(' ').length

  if(addressRegExp.test(address.value) && splitWords >= 2 && numberRegExp.test(address.value)) {
    addressError.style.display = "none";
  } else {
    addressError.textContent = "Veuillez indiquer une adresse valide."
  }
}

// Fonction pour tester la ville
function cityValid() {
  let splitWords = city.value.split(' ').length;

  if(addressRegExp.test(city.value) && splitWords >= 2 && postalCode.test(city.value)) {
    cityError.style.display = "none";
  } else {
    cityError.textContent = "Veuillez indiquer votre code postal ainsi que votre ville (ex : 75000 Paris).";
  }
}

//Fonction pour tester l'email
// function emailValid() {
//   if(emailRegExp.test(email.value)) {
//     emailError.style.display = "none";
//   } else {
//     emailError.textContent = "Veuillez indiquer une adresse email valide.";
//   }
// }
let emailValid = emailRegExp.test(email.value);
console.log(emailValid)

// Objet contact et tableau produits
// Evenements au click du bouton commander
orderButton.addEventListener("click", (e) => {
  e.preventDefault()

    let arrayProducts = [];
    for(let basket of kanap) {
      arrayProducts.push(basket.id)
    }

  const orderProducts = {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    products: arrayProducts
  }

  Ordered(orderProducts);
  // console.log(JSON.stringify(orderProducts));
})

async function Ordered(orderProducts) {
  let response = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers : {
      "Accept": "application/json",
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(orderProducts),
  })

  let result = await response.json();
  console.log(result)
};

// async function resultat() {
//   let result = await response.json();
//   alert(result.message);
// }
