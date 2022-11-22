//Récupère l'id du produit dans l'URL
let urlProduct = new URL(location.href).searchParams.get("id");

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
 * Permet d'afficher le produits en détails
 * @param {object} details Récupère l'objet visé
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

  // btnAddToCart.addEventListener("click", () => {
  //   addOrRemove(details.name);
  // })
}

window.addEventListener("load", start);

// Partie Panier
let btnAddToCart = document.querySelector("#addToCart");
let panierQuantity = document.querySelector("#quantity");
let colors = document.querySelector("#colors");

//Enregistrer panier dans localSTorage
function saveKanap(kanap) {
  localStorage.setItem("kanap", JSON.stringify(kanap));
}

function getKanap() {
  let kanap = localStorage.getItem("kanap");
  if (kanap == null) {
    return [];
  } else {
    return JSON.parse(kanap);
  }
}

/**
 * Permet d'ajouter un produit au panier
 * @param {object} product Contient le produit qui a été ajouté au panier
 * @returns Le localStorage de notre panier contenant le produit ajouté et ses détails
 */
function addKanap(product) {
  let kanap = getKanap();
  let foundProduct = kanap.find((p) => p.id == product.id); //Je cherche dans mon panier s'il y a un produit dont l'id est égale à l'id du produit que je veux ajouter
  let foundColors = kanap.find((c) => c.colors == product.colors); // Je cherche dans mon panier s'il y a un produit dont la couleur est égale à la couleur du produit que je veux ajouter
  if (foundProduct != undefined && foundColors != undefined) {
    // S'il ne trouve pas de produit dans mon panier ayant la même couleur que le produit que je veux ajouter, retourne undefined
    foundColors.quantity += Number(panierQuantity.value);
  } else if (product.colors == "" || panierQuantity.value == 0) {
    return kanap;
  } else {
    product.quantity = Number(panierQuantity.value);
    kanap.push(product);
  }
  saveKanap(kanap);
}

// Valid message
let msgValid;
let msgValidate = document.createElement("p");
msgValidate.style.color = "#00FF00";
msgValidate.style.fontWeight = "bold";
document.querySelector(".item__content__settings").appendChild(msgValidate);
msgValidate.style.display = "none";

function validMsg() {

  if (panierQuantity.value > 0 && colors.value != "") {
    msgValid = true;
  } else {
    msgValid = false;
  }

  if (msgValid) {
    msgValidate.style.display = "block";
    msgValidate.textContent = `Vous avez ajouté ${panierQuantity.value} produit(s) ${colors.value} au panier`;
  } else {
    msgValidate.style.display = "none";
  }
}

// Error Messages
let errorMsgColor;
let errorColor = document.createElement("p");
errorColor.style.color = "red";
errorColor.innerHTML = "Choisissez une couleur.";
document
  .querySelector(".item__content__settings__color")
  .appendChild(errorColor);
errorColor.style.display = "none";

let quantityMsgError;
let quantityError = document.createElement("p");
quantityError.style.color = "red";
quantityError.innerHTML = "Choisissez une quantité.";
document
  .querySelector(".item__content__settings__quantity")
  .appendChild(quantityError);
quantityError.style.display = "none";

function msgError() {
  if (colors.value == "") {
    errorMsgColor = true;
  } else {
    errorMsgColor = false;
  }

  if (errorMsgColor) {
    errorColor.style.display = "block";
  } else {
    errorColor.style.display = "none";
  }

  if (panierQuantity.value <= 0) {
    quantityMsgError = true;
  } else {
    quantityMsgError = false;
  }

  if (quantityMsgError) {
    quantityError.style.display = "block";
  } else {
    quantityError.style.display = "none";
  }
}

btnAddToCart.addEventListener("click", () => {
  addKanap({ id: urlProduct, colors: colors.value });
  msgError();
  validMsg();
  panierQuantity.value = 0;
  colors.value = "";
});

colors.addEventListener("change", () => {
  msgValidate.style.display = "none";
  msgError();
});

panierQuantity.addEventListener("change", () => {
  msgValidate.style.display = "none";
  msgError();
});
