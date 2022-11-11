const url = "http://localhost:3000/api/products";
const start = () => {
fetch(url)
    .then(response => response.json())
    .then(data => { 

        let display = ''
        
        for(let article of data)  { 
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
    })
    .catch(erreur => {
        console.log("Il y a une erreur : " + erreur);
    });
;}

window.addEventListener("load", start);