let api = "https://fakestoreapi.com/products";

let searchIcon = document.querySelector(".search-icon");
let navbar = document.querySelector("nav");
let CategoryContainer = document.querySelector(".category-container");



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


// Category section
let allBtn = document.createElement("button");
allBtn.className = "cate-btn active";
allBtn.innerText = "All";
CategoryContainer.append(allBtn);

async function fetchCategory(){
    console.log("fetch called");
    let response = await fetch(`${api}/categories`);
    let categories = await response.json();


    for(let i=0; i<categories.length; i++){
    let categoryButton = document.createElement("button");
    categoryButton.className = "cate-btn";
    categoryButton.innerText = `${categories[i]}`
    CategoryContainer.append(categoryButton);
    }

    let btn = document.querySelectorAll(".cate-btn");
    btn.forEach((ele)=>{
        ele.addEventListener("click", ()=>{
            CategorySelected(btn, ele);
        });
    });
}

fetchCategory();

function CategorySelected(btn,ele){
    btn.forEach((element)=>{
        element.classList.remove("active");
    });
    ele.classList.add("active");
};


// cards - products
let products = [];

async function getProducts(){
    let response = await fetch(api);
    products = await response.json();

    displayProducts();
}

getProducts();

function displayProducts(){

}

