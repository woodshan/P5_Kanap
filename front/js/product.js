let urlProduct = new URL(location.href).searchParams.get("id");
const start = function() {
    
    // console.log(urlProduct);

    let url = `http://localhost:3000/api/products/${urlProduct}`
    fetch(url)
        .then((response) => response.json()
        .then((product) => {
            let image = document.createElement("img");
            image.src = product.imageUrl;
            image.alt = product.altTxt;
            document.querySelector(".item__img").append(image);

            document.querySelector("#title").textContent = product.name;

            document.querySelector("#price").textContent = product.price;

            document.querySelector("#description").textContent = product.description;

            for(let option of product.colors) {
                let color = document.createElement("option");
                color.textContent = option;
                document.querySelector("#colors").append(color);
            }
            
        })
        ).catch(erreur => console.log("Il y a une erreur : " + erreur));

}

window.addEventListener("load", start);

// AJOUTER AU PANIER
let btnAddToCart = document.querySelector("#addToCart");
let panierQuantity = document.querySelector("#quantity");
let colors = document.querySelector("#colors option");

function saveKanap(kanap) { //Enregistrer panier dans localSTorage
    localStorage.setItem("kanap", JSON.stringify(kanap));
}

function getKanap() {
    let kanap = localStorage.getItem("kanap");
    if(kanap == null) {
        return [];
    }else {
        return JSON.parse(kanap);
    }
}

function addKanap(product) { //Ajouter le produit
    let kanap = getKanap();
    let foundProduct = kanap.find(p => p.id == product.id); 
    if(foundProduct != undefined) {
        foundProduct.quantity += Number(panierQuantity.value);
    }else {
        product.quantity = 0;
        kanap.push(product);
    }
    saveKanap(kanap);
}

btnAddToCart.addEventListener("click", () => {
    addKanap({"id": urlProduct, "colors": colors.value})
})


