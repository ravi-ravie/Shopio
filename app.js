let api = "https://fakestoreapi.com/products";

let searchIcon = document.querySelector(".search-icon");
let navbar = document.querySelector("nav");
let CategoryContainer = document.querySelector(".category-container");
let productsContainer = document.querySelector(".products-container");
let productDrawer = document.querySelector(".product-drawer");
let drawerClose = document.querySelector(".drawer-close");
let sidebar = document.querySelector(".sidebar");
let cartIcon = document.querySelector(".cart-icon");
let sidebarClose = document.querySelector(".sidebar-close");
let cartProducts = document.querySelector(".cart-products");

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
        let response = await fetch(`${api}/category/${categories[idx-1]}`);

        productLoading(await response.json());
    }
}

function productLoading(products){
    productsContainer.innerHTML = "";
    for(let i=0; i<products.length; i++){
        let itemContainer = document.createElement("div");
        itemContainer.dataset.id = products[i].id;
        itemContainer.dataset.description = products[i].description;
        itemContainer.className = "card";
        productsContainer.append(itemContainer);

        let upperDiv = document.createElement("div");
        let lowerDiv = document.createElement("div");
        itemContainer.append(upperDiv);
        itemContainer.append(lowerDiv);

        let upperCategory = document.createElement("p");
        upperCategory.className = "upper-category";
        let img = document.createElement("img");
        img.className = ""
        upperCategory.innerText = `${products[i].category}`;
        img.src = `${products[i].image}`;
        img.width = 100;
        img.height = 100;
        upperDiv.append(upperCategory);
        upperDiv.append(img);

        let title = document.createElement("p");
        title.className = "cardTitle";
        title.innerText = `${products[i].title}`;
        lowerDiv.append(title);

        let rating = document.createElement("div");
        lowerDiv.append(rating);

        let stars = document.createElement("span");
        stars.className = "stars";
        let voting = document.createElement("span");
        voting.className = "voting";
        let voteCount = document.createElement("span");
        voteCount.className = "voteCount";
        voting.innerText = `${products[i].rating.rate}`;
        voteCount.innerText =  `${products[i].rating.count}`;
        rating.append(stars);
        rating.append(voting);
        rating.append(voteCount);

        let priceNcart = document.createElement("div");
        lowerDiv.append(priceNcart);

        let price = document.createElement("span");
        price.className = "price";
        let cartAdd = document.createElement("button");
        cartAdd.className = "cartAdd";
        price.innerText = `${products[i].price}`;
        itemContainer.dataset.price = products[i].price;
        cartAdd.innerText = "+";
        priceNcart.append(price);
        priceNcart.append(cartAdd);

    }
}

// Bottom sheet
let isbottomsheet = false

productsContainer.addEventListener("click", (e)=>{
    let card = e.target.closest(".card");
    if(!card)return;
    
    if(!isbottomsheet){
        if(e.target === card.querySelector(".cartAdd")){
            AddingToCart(card);
            return;
        }
        drawerFunc(card);
        return
    }
    
    closeDrawerFunc();
    
});

function drawerFunc(card){
    productDrawer.classList.add("open");
    isbottomsheet = true;
    document.querySelector(".drawer-img").src = card.querySelector("img").src;
    document.querySelector(".drawer-category").innerText = card.querySelector(".upper-category").innerText;
    document.querySelector(".drawer-stars").innerText = card.querySelector(".stars").innerText;
    document.querySelector(".drawer-vote").innerText = card.querySelector(".voting").innerText;
    document.querySelector(".drawer-count").innerText = card.querySelector(".voteCount").innerText;
    document.querySelector(".drawer-description").innerText = card.dataset.description;
    document.querySelector(".drawer-price").innerText = card.querySelector(".price").innerText;
}

function closeDrawerFunc(){
    productDrawer.classList.remove("open");
    isbottomsheet = false;
}

drawerClose.addEventListener("click", ()=>{
    closeDrawerFunc();
});

document.addEventListener("click", (e)=>{
    if(!productsContainer.contains(e.target) && !productDrawer.contains(e.target))
        closeDrawerFunc();

    if(isSidebar===true && !sidebar.contains(e.target) && e.target !== cartIcon){
        closeSidebar();
    }

});

let drawerAddCartButton = document.querySelector(".prouct-drawer button");


// Sidebar
let isSidebar = false;

cartIcon.addEventListener("click", ()=>{
    if(!isSidebar)
        sidebarFunc();
    else
        closeSidebar();
});

function sidebarFunc(){
    sidebar.classList.add("open");
    isSidebar = true;
}

sidebarClose.addEventListener("click", ()=>{
    closeSidebar();
});

function closeSidebar(){
    sidebar.classList.remove("open");
    isSidebar = false;
}

// cart
const cart = [];



function AddingToCart(card){
    let itemFound = cart.find(obj => obj.id === card.dataset.id);
    if(itemFound){
        itemFound.quantity++;
        return;
    }
    
    const item = {
        id : card.dataset.id,
        title : card.querySelector(".cardTitle").innerText,
        quantity : 1,
        price : card.dataset.price,
        
        get totalPrice(){
            return this.price * this.quantity;
        }
    }
    cart.push(item);
    displayCartProducts(item, card);
}

function displayCartProducts(item, card){
    cartProducts.innerHTML += `
        <div class="leftCartDiv">
            <img class="cartImg" src="${card.querySelector("img").src}" height="40px"/>
        </div>
        <div class="rightCartDiv">
            <p>${item.title}</p>
            <p>${item.price}</p>
        </div>
        <div class="quantityDiv">
            <button><i class="ri-subtract-line"></i></button><span class="cartProductQty">${item.quantity}<button><i class="ri-add-line"></i></button><i class="ri-close-line"></i>
    `
}