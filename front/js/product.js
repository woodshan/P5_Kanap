const start = function() {
    let url = "http://localhost:3000/api/products";
    fetch(url)
        .then((response) => response.json()
        .then((data) => {

        let urlProduit = new URL(location.href).searchParams.get("id");
        console.log(urlProduit);
        
        // let image = document.createElement("img");
        // image.src = data.imageUrl;
        // image.alt = data.alTxt;
        // document.querySelector(".item__img").prepend(image);
        document.querySelector("#title").innerHTML = data.name;
        document.querySelector("#price").innerHTML = data.price;
        document.querySelector("#description").innerHTML = data.description;
        document.querySelector("option").innerHTML = data.colors;
            
        })
        ).catch(erreur => console.log("Il y a une erreur : " + erreur));
}

start();




