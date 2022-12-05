let kanap = JSON.parse(localStorage.getItem("kanap"));

// Send request using fetch api to get products added to cart in cart page
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
        if (product._id == basket.id) {
          for(let element of kanap) {
            if(product._id == element.id) {
              element.price = product.price
            }
          }
        }
      })
      .catch((erreur) => {
        console.log("Il y a une erreur : " + erreur);
      });
  }
  getTotalPrice();
  clickDelete();
  changeQuantity();
};

window.addEventListener("load", start());

/**
 * Display added cart products
 * @param {*} productInBasket product in local storage cart
 * @param {*} productInData api products data 
 */
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
  productPrice.classList.add("productPrice");
  productPrice.textContent = `${
    productInData.price * productInBasket.quantity
  } €`;
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

  quantity.addEventListener("change", () => {
    productPrice.textContent = `${productInData.price * quantity.value} €`;
  })
}

// Calculate total cart quantity
function getTotalQuantity() {
  let number = 0;
  for (let total of kanap) {
    number += total.quantity;
  }
  return number;
}

// PART TOTAL CART PRICE
// let cartTotalPrice = 0;
/**
 * Calculate total cart price
 * @param {number} price
 * @param {number} quantity
 * @returns Total cart price
 */
function getTotalPrice() {
  let cartTotalPrice = 0;
  for(let element of kanap) {
    cartTotalPrice += element.price * element.quantity;
  }
  let totalPrice = document.querySelector("#totalPrice");
  totalPrice.textContent = cartTotalPrice;
}

/**
 * 
 * @param {Number} Quantity value
 */
function getUnitTotalPrice() {
  let productPrice = document.querySelector(".productPrice");
  let unitTotal = 0;
  unitTotal += kanap.price * kanap.quantity;
  console.log(unitTotal)
  productPrice.textContent = `${unitTotal} €`;
};

/**
 * Remove selected product
 * @param {object} element delete button
 * @param {string} idProduct
 * @param {string} colorProduct
 */
 function removeFromBasket(element, idProduct, colorProduct) {
  element.closest(".cart__item").remove();
  kanap =
    kanap.filter((p) => p.id != idProduct) &&
    kanap.filter((p) => p.colors != colorProduct);
  totalQuantity.textContent = getTotalQuantity();
  getTotalPrice();  
  saveKanap(kanap);
  emptyCart();
}

// Delete cart product by clicking button
function clickDelete() {
  let deleteBtn = document.querySelectorAll(".deleteItem");
  for (let btn of deleteBtn) {
    btn.addEventListener("click", (evt) => {
      let id = evt.target.closest("article").dataset.id;
      let color = evt.target.closest("article").dataset.color;
      removeFromBasket(btn, id, color);
    });
  }
};

/**
 * Change quantity in cart page
 */
function changeQuantity() {
  let btnChange = document.querySelectorAll(".itemQuantity");
  for (let btn of btnChange) {
    btn.addEventListener("change", (evt) => {
      let id = evt.target.closest("article").dataset.id;
      let color = evt.target.closest("article").dataset.color;
      let foundProduct =
        kanap.find((p) => p.id == id) && kanap.find((p) => p.colors == color);
      if (btn.value <= 0) {
        removeFromBasket(btn, id, color);
      } else if (
        foundProduct != undefined &&
        btn.value.split(".").length == 1 &&
        btn.value <= 100
      ) {
        foundProduct.quantity += Number(btn.value) - foundProduct.quantity;
        totalQuantity.textContent = getTotalQuantity();
        getTotalPrice();
        // getUnitTotalPrice();
      }
      saveKanap(kanap);
    });
  }
}
/**
 * Save cart in the Local Storage.
 * @param {string} kanap Cart in the local storage.
 */
 function saveKanap() {
  // on souhaite conserver intact le contenu de kanap
  let copy = JSON.parse(JSON.stringify(kanap));
  // pour chaque élément du panier
  for(let element of copy) {
    // On vérifie que cet élément (objet JS) a une propriété nommée "price"
    if(element.hasOwnProperty("price")) {
      // On supprime cette propriété
      delete element.price;
      console.log("prix retiré")
    }
  };
  console.log("copy APRES modif : ",copy);
  // suppression de l'item Kanap du LS
  localStorage.removeItem("kanap");
  // Ajout de l'item Kanap au LS
  localStorage.setItem("kanap", JSON.stringify(copy));
  // Verif contenu LS
  console.log(localStorage.getItem("kanap"));
};

// TO ORDER PART
// Get all form elements
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

let form = document.querySelector(".cart__order__form");

let orderButton = document.querySelector("#order");

// Display empty cart
function emptyCart() {
  if (kanap == null || kanap.length == 0) {
    form.style.display = "none";

    let title = document.querySelector("h1");
    title.innerHTML = "Votre panier est vide";

    document.querySelector(".cart__price").style.display = "none";
  }
}

emptyCart();

// Create Regex
let nameRegExp =
  /^[a-zA-Z-àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s\,\'\-]*$/;
let addressRegExp =
  /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s\,\'\-]*$/;
let numberRegExp = /[0-9]/;
let postalCode = /[0-9]{5}/;
let emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;

/**
 * Test the validity of the first and last name and displays error messages
 * @param {string} name user data
 * @param {*} nameError Error message
 * @param {number} nameLength user data length
 * @returns Boolean
 */
function nameValid(name, nameError, nameLength) {
  let nameValid = nameRegExp.test(name) && name != "" && nameLength >= 2;
  if (nameValid) {
    nameError.style.display = "none";
  } else {
    nameError.textContent =
      "Ce champ doit contenir au minimum 2 caractères sans nombre.";
    nameError.style.display = "block";
  }
  return nameValid;
}

/**
 * Test the validity of the address and displays error messages
 * @returns Boolean
 */
function addressValid() {
  let splitWords = address.value.split(" ").length;
  let addressValid =
    addressRegExp.test(address.value) &&
    splitWords >= 2 &&
    numberRegExp.test(address.value);

  if (addressValid) {
    addressError.style.display = "none";
  } else {
    addressError.textContent = "Veuillez indiquer une adresse valide.";
    addressError.style.display = "block";
  }
  return addressValid;
}

/**
 * Test the validity of the city and displays error messages
 * @returns Boolean
 */
function cityValid() {
  let splitWords = city.value.split(" ").length;
  let cityValid =
    addressRegExp.test(city.value) &&
    splitWords >= 2 &&
    postalCode.test(city.value);

  if (cityValid) {
    cityError.style.display = "none";
  } else {
    cityError.textContent =
      "Veuillez indiquer votre code postal ainsi que votre ville (ex : 75000 Paris).";
    cityError.style.display = "block";
  }
  return cityValid;
}

/**
 * Test the validity of the email and displays error messages
 * @returns Boolean
 */
function emailValid() {
  let emailValid = emailRegExp.test(email.value);
  if (emailValid) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
    emailError.textContent = "Veuillez indiquer une adresse email valide.";
  }
  return emailValid;
}

/**
 * Test the validity of all tests and run them
 * @returns Boolean
 */
function testError() {
  testValid =
    nameValid(firstName.value, firstNameError, firstName.value.length) &&
    nameValid(lastName.value, lastNameError, lastName.value.length) &&
    addressValid() &&
    cityValid() &&
    emailValid();

  nameValid(firstName.value, firstNameError, firstName.value.length);
  nameValid(lastName.value, lastNameError, lastName.value.length);
  addressValid();
  cityValid();
  emailValid();

  return testValid;
}

/**
 * Run actions by clicking the button to order
 * Create an object "Contact" using form data
 * Create an array of id products
 */
orderButton.addEventListener("click", (e) => {
  e.preventDefault();

  testError();

  if (testError()) {
    let arrayProducts = [];
    for (let basket of kanap) {
      arrayProducts.push(basket.id);
    }

    const orderProducts = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      },
      products: arrayProducts,
    };

    Ordered(orderProducts);
  }
});

/**
 * Requesting api using fetch to get order Id
 * @param {{contact, idProducts}} orderProducts form data and Id products
 */
async function Ordered(orderProducts) {
  let response = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderProducts),
  });

  let result = await response.json();
  window.location.href = `confirmation.html?orderId=${result.orderId}`;
  localStorage.clear();
}
