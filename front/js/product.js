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
                color.value = option;
                document.querySelector("#colors").append(color);
            }
            
        })
        ).catch(erreur => console.log("Il y a une erreur : " + erreur));

}

window.addEventListener("load", start);

// AJOUTER AU PANIER
let btnAddToCart = document.querySelector("#addToCart");
let panierQuantity = document.querySelector("#quantity");
let colors = document.querySelector("#colors");

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
    let foundProduct = kanap.find(p => p.id == product.id); //Je cherche dans mon panier s'il y a un produit dont l'id est égale à l'id du produit que je veux ajouter
    let foundColors = kanap.find(c => c.colors == product.colors);// Je cherche dans mon panier s'il y a un produit dont la couleur est égale à la couleur du produit que je veux ajouter
    // console.log(foundColors);
    if(foundProduct != undefined && foundColors != undefined) { // S'il ne trouve pas de produit dans mon panier ayant la même couleur que le produit que je veux ajouter, retourne undefined
        foundProduct.quantity += Number(panierQuantity.value);
        foundColors.quantity += Number(panierQuantity.value);
        // console.log(product.quantity);
    } else if (product.colors == "" || panierQuantity.value == 0) {
        return kanap;
    } else {
        product.quantity = Number(panierQuantity.value);
        kanap.push(product);
    }
    saveKanap(kanap);
}

btnAddToCart.addEventListener("click", () => {
    addKanap({"id": urlProduct, "colors": colors.value})
    // console.log(colors.value)
})
// console.log(colors.options);

