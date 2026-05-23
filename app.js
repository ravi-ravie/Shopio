let api = "https://fakestoreapi.com/products";

let searchIcon = document.querySelector(".search-icon");
let navbar = document.querySelector("nav");
let CategoryContainer = document.querySelector(".category-container");
let productsContainer = document.querySelector(".products-container");


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
let btn;
let categories;
let allBtn = document.createElement("button");
allBtn.className = "cate-btn active";
allBtn.innerText = "All";
CategoryContainer.append(allBtn);

async function fetchCategory(){
    let response = await fetch(`${api}/categories`);
    categories = await response.json();


    for(let i=0; i<categories.length; i++){
    let categoryButton = document.createElement("button");
    categoryButton.className = "cate-btn";
    categoryButton.innerText = `${categories[i]}`
    CategoryContainer.append(categoryButton);
    }

    btn = document.querySelectorAll(".cate-btn");
    btn.forEach((ele)=>{
        ele.addEventListener("click", ()=>{
            CategorySelected(btn, ele);
        });
    });
    displayProducts();
}

fetchCategory();

function CategorySelected(btn,ele){
    btn.forEach((element)=>{
        element.classList.remove("active");
    });
    ele.classList.add("active");
};


// cards - products


function displayProducts(){
    btn.forEach((ele,idx)=>{
        if(idx===0)
            callProduct(idx);
        ele.addEventListener("click", ()=>{
            callProduct(idx);
        });
    });
}

async function callProduct(idx){

    if(idx===0){
        let response = await fetch(api);
        productLoading(await response.json());
    }
    else{
        console.log(idx, idx-1, categories[idx-1]);

        let response = await fetch(`${api}/category/${categories[idx-1]}`);

        productLoading(await response.json());
        console.log("called non 0");
    }
}

function productLoading(products){
    productsContainer.innerHTML = "";
    for(let i=0; i<products.length; i++){
        let itemContainer = document.createElement("div");
        productsContainer.append(itemContainer);

        let upperDiv = document.createElement("div");
        let lowerDiv = document.createElement("div");
        itemContainer.append(upperDiv);
        itemContainer.append(lowerDiv);

        let upperCategory = document.createElement("p");
        let img = document.createElement("img");
        upperCategory.innerText = `${products[i].category}`
        img.src = `${products[i].image}`
        img.width = 100;
        img.height = 100;
        upperDiv.append(upperCategory);
        upperDiv.append(img);

        let title = document.createElement("p");
        title.innerText = `${products[i].title}`;
        lowerDiv.append(title);

        let rating = document.createElement("div");
        let priceSection = document.createElement("div");
        lowerDiv.append(rating);
        lowerDiv.append(priceSection);

        let stars = document.createElement("span");
        let voting = document.createElement("span");
        let votes = document.createElement("span");
        voting.innerText = `${products[i].rating.rate}`
        votes.innerText =  `${products[i].rating.count}`
        rating.append(stars);
        rating.append(voting);
        rating.append(votes);
    }
}