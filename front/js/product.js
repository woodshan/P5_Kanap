// Get product id in URL
let urlProduct = new URL(location.href).searchParams.get("id");

// Send request using fetch api to get the product.
const start = function () {

  let url = `http://localhost:3000/api/products/${urlProduct}`;
  fetch(url)
    .then((response) => {
      if (response.ok === true) {
        return response.json();
      }
    })
    .then((product) => {
      displayProduct(product);
    })
    .catch((erreur) => console.log("Il y a une erreur : " + erreur));
};

/**
 * Display products details.
 * @param {object} details Get the details of the selected item.
 */
function displayProduct(details) {
  let image = document.createElement("img");
  image.src = details.imageUrl;
  image.alt = details.altTxt;
  document.querySelector(".item__img").append(image);

  document.querySelector("#title").textContent = details.name;

  document.querySelector("#price").textContent = details.price;

  document.querySelector("#description").textContent = details.description;

  document.querySelector("title").textContent = details.name;

  for (let option of details.colors) {
    let color = document.createElement("option");
    color.textContent = option;
    color.value = option;
    document.querySelector("#colors").append(color);
  }
}

window.addEventListener("load", start);

// CART PART
let btnAddToCart = document.querySelector("#addToCart");
let cartQuantity = document.querySelector("#quantity");
let colors = document.querySelector("#colors");

/**
 * Save cart in the Local Storage.
 * @param {string} kanap Cart in the local storage.
 */
function saveKanap(kanap) {
  localStorage.setItem("kanap", JSON.stringify(kanap));
}

/**
 * Get cart in the local storage
 * @returns Array of products
 */
function getKanap() {
  let kanap = localStorage.getItem("kanap");
  if (kanap == null) {
    return [];
  } else {
    return JSON.parse(kanap);
  }
}

/**
 * Add a product to the cart.
 * @param {Object} product Product add to the cart.
 * @returns The local storage of the cart and its details.
 */
function addKanap(product) {
  let kanap = getKanap();
  let foundProduct = kanap.find((p) => p.id == product.id); //Je cherche dans mon panier s'il y a un produit dont l'id est égale à l'id du produit que je veux ajouter
  let foundColors = kanap.find((c) => c.colors == product.colors); // Je cherche dans mon panier s'il y a un produit dont la couleur est égale à la couleur du produit que je veux ajouter
  if (foundProduct != undefined && foundColors != undefined && cartQuantity.value > 0 && cartQuantity.value.split(".").length == 1 && cartQuantity.value <= 100) {
    // S'il ne trouve pas de produit dans mon panier ayant la même couleur que le produit que je veux ajouter, retourne undefined
    foundColors.quantity += Number(cartQuantity.value);
  } else if (product.colors == "" || cartQuantity.value <= 0 || cartQuantity.value.split(".").length != 1 || cartQuantity.value > 100) {
    return kanap;
  } else {
    product.quantity = Number(cartQuantity.value);
    kanap.push(product);
  }
  saveKanap(kanap);
}
// Create add to cart success message.
let msgValid;
let msgValidate = document.createElement("p");
msgValidate.style.color = "#00FF00";
msgValidate.style.fontWeight = "bold";
document.querySelector(".item__content__settings").appendChild(msgValidate);
msgValidate.style.display = "none";

// Add to cart success message conditions.
function validMsg() {

  if (cartQuantity.value > 0 && colors.value != "" && cartQuantity.value.split(".").length == 1 && cartQuantity.value < 100) {
    msgValid = true;
  } else {
    msgValid = false;
  }

  if (msgValid) {
    msgValidate.style.display = "block";
    msgValidate.textContent = `Vous avez ajouté ${cartQuantity.value} produit(s) ${colors.value} au panier`;
  } else {
    msgValidate.style.display = "none";
  }
}

// CREATE ERROR MESSAGES
let errorMsgColor;
let errorColor = document.createElement("p");
document
  .querySelector(".item__content__settings__color")
  .appendChild(errorColor);
errorColor.style.display = "none";

let quantityMsgError;
let quantityError = document.createElement("p");
document
  .querySelector(".item__content__settings__quantity")
  .appendChild(quantityError);
quantityError.style.display = "none";

// Check error messages conditions
function msgError() {
  if (colors.value == "") {
    errorMsgColor = true;
  } else {
    errorMsgColor = false;
  };

  if (errorMsgColor) {
    errorColor.style.color = "red";
    errorColor.textContent = "Choisissez une couleur.";
    errorColor.style.display = "block";
  } else {
    errorColor.style.display = "none";
  };

  if (cartQuantity.value <= 0 || cartQuantity.value.split(".").length != 1 || cartQuantity.value > 100) {
    quantityMsgError = true;
  } else {
    quantityMsgError = false;
  };

  if (quantityMsgError) {
    quantityError.style.color = "red";
    quantityError.textContent = "Choisissez une quantité valable.";
    quantityError.style.display = "block";
  } else {
    quantityError.style.display = "none";
  };
}

// Run actions by clicking the button add to cart
btnAddToCart.addEventListener("click", () => {
  addKanap({ id: urlProduct, colors: colors.value });
  msgError();
  validMsg();
  cartQuantity.value = 0;
  colors.value = "";
});

// Run actions by changing input color
colors.addEventListener("change", () => {
  msgValidate.style.display = "none";
  msgError();
});

// Run actions by changing input quantity
cartQuantity.addEventListener("change", () => {
  msgValidate.style.display = "none";
  msgError();
});
