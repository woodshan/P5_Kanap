const url = "http://localhost:3000/api/products";

/**
 * 
 * @return {Promise<JSON>}
 */
const start = () => {
fetch(url)
    .then(response => {
        if(response.ok === true) {
        return response.json()
        }
    })
    .then(data => { 
        console.table(data);
        displayKanap(data); 
    })
    .catch(erreur => {
        console.log("Il y a une erreur : " + erreur);
    });
;}

/**
 * Permet d'afficher les produits sur la page d'accueil
 * @param {string} products 
 */
function displayKanap(products) {
    let display = ''
        
        for(let article of products)  { 
            display += `
            <a href="product.html?id=${article._id}">
                <article>
                    <img src="${article.imageUrl}" alt="${article.altTxt}">
                    <h3 class="productName">${article.name}</h3>
                    <p class="productDescription">${article.description}</p>
                </article>
            </a> `
            
        }
        
        document.querySelector("#items").insertAdjacentHTML("beforeend", display);
}

window.addEventListener("load", start);

