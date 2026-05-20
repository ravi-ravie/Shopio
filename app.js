let api = "https://fakestoreapi.com/products";

let searchIcon = document.querySelector(".search-icon");
let navbar = document.querySelector("nav");




searchIcon.addEventListener("click", ()=>{
    if(document.querySelector(".searchDiv")) return;

    let searchDiv = document.createElement("div");
    searchDiv.className = "searchDiv";
    navbar.append(searchDiv);

    searchDiv.innerHTML =  `
        <i class="ri-search-line"></i>
        <input class="searchBar" placeholder="Search products">
        <i class="ri-close-line close-button"></i>
    `;

    searchDiv.querySelector(".close-button").addEventListener("click", ()=>{
        searchDiv.remove();
    });
});

