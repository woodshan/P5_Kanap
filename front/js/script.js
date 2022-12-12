const url = "http://localhost:3000/api/products";

/**
 * Send request using fetch api to get products.
 * @return {Promise<JSON>}
 */
const start = () => {
  fetch(url)
    .then((response) => {
      if (response.ok === true) {
        return response.json();
      }
    })
    .then((data) => {
      displayKanap(data);
    })
    .catch((error) => {
      console.log("Il y a une erreur : " + error);
    });
};

/**
 * Display products on the homepage.
 * @param {string} products
 */
function displayKanap(products) {
  for (let article of products) {
    let link = document.createElement("a");
    link.href = `product.html?id=${article._id}`;
    document.querySelector("#items").appendChild(link);

    let cart = document.createElement("article");
    link.appendChild(cart);

    let image = document.createElement("img");
    image.src = article.imageUrl;
    image.alt = article.altTxt;
    cart.appendChild(image);

    let productName = document.createElement("h3");
    productName.classList.add("productName");
    productName.textContent = article.name;
    cart.appendChild(productName);

    let productDescription = document.createElement("p");
    productDescription.classList.add("productDescription");
    productDescription.textContent = article.description;
    cart.appendChild(productDescription);
  }
}

window.addEventListener("load", start);
