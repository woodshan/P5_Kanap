//Récupère l'id du produit dans l'URL
let urlProduct = new URL(location.href).searchParams.get("id");
console.log(urlProduct)

const start = function () {
  // console.log(urlProduct);

  let url = `http://localhost:3000/api/products/${urlProduct}`;
  fetch(url)
    .then((response) => {
      if(response.ok === true) {
        return response.json()
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
  // console.log(foundColors);
  if (foundProduct != undefined && foundColors != undefined) {
    // S'il ne trouve pas de produit dans mon panier ayant la même couleur que le produit que je veux ajouter, retourne undefined
    // foundProduct.quantity += Number(panierQuantity.value);
    foundColors.quantity += Number(panierQuantity.value);
  } else if (product.colors == "" || panierQuantity.value == 0) {
    return kanap;
  } else {
    product.quantity = Number(panierQuantity.value);
    kanap.push(product);
  }
  saveKanap(kanap);
}

btnAddToCart.addEventListener("click", () => {
  addKanap({ id: urlProduct, colors: colors.value });
  if(colors.value != "" && panierQuantity.value > 0) {
    let addToCart = document.createElement("p")
    addToCart.style.color = "#83FF00";
    addToCart.textContent = `Vous avez ajouté ${panierQuantity.value} produit(s) au panier`
    document.querySelector(".item__content__settings").appendChild(addToCart);
  } else {
    if(panierQuantity.value <= 0) {
      let quantityError = document.createElement("p");
      quantityError.style.color = "red";
      quantityError.innerHTML = "Choisissez une quantité"
      document.querySelector(".item__content__settings__quantity").appendChild(quantityError);
      return;
    }
  }
  panierQuantity.value = 0;
  colors.value = "";
  // console.log(colors.value)
});
// console.log(colors.options);
colors.addEventListener("change", () => {
  let errorColor = document.createElement("p");
  if(colors.value == "") {
    let errorColor = document.createElement("p");
    errorColor.style.color = "red";
    errorColor.innerHTML = "Choisissez une couleur"
    document.querySelector(".item__content__settings__color").appendChild(errorColor);
    return 
  } 
})