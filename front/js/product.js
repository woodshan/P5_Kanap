const start = function() {
    let urlProduit = new URL(location.href).searchParams.get("id");
    console.log(urlProduit);

    let url = `http://localhost:3000/api/products/${urlProduit}`
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




