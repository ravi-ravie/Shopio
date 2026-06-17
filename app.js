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
let emptyCartDisplay =  document.querySelector(".emptyCartDisplay");
let cartFooter = document.querySelector(".cart-footer");
let subtotal = document.querySelector(".subtotal-value");
let shipping = document.querySelector(".shipping-value");
let total = document.querySelector(".total-value");
let fixedCart = document.querySelector(".fixed-cart");
let cartSize = document.querySelectorAll(".cartSize");
let backdrop = document.querySelector(".backdrop");

searchIcon.addEventListener("click", ()=>{
    let existing = document.querySelector(".searchDiv");
    if(existing){
        removeSearchBar(existing);
        return;
    }

    let searchDiv = document.createElement("div");
    searchDiv.className = "searchDiv";
    navbar.append(searchDiv);

    searchDiv.innerHTML =  `
        <i class="ri-search-line"></i>
        <input class="searchBar" placeholder="Search products...">
        <i class="ri-close-line close-button"></i>
    `;

    let searchBar = searchDiv.querySelector("input");
    searchBar.addEventListener("focus", ()=>{
        searchDiv.classList.add("selected");
        navbar.style.backdropFilter = "none";
        navbar.style.background = "rgba(252, 252, 253)";
    });

    searchBar.addEventListener("blur", ()=>{
        searchDiv.classList.remove("selected");
    })

    searchBar.focus();
    searchBar.addEventListener("input",()=>{
        searchFilterFunc(searchBar.value.toLowerCase().trim());
    });


    searchDiv.querySelector(".close-button").addEventListener("click", ()=>{
        removeSearchBar(searchDiv);
        displayProducts();
    });
});

function removeSearchBar(searchDiv){
    navbar.style.backdropFilter = "blur(30px)";
    navbar.style.background = "rgba(252, 252, 253,0.2)";
    searchDiv.classList.add("slideup");
    console.log(searchDiv.classList);
    setTimeout(()=>searchDiv.remove(), 200);
}


// search filter
let allProducts = [];
function searchFilterFunc(inputValue){
    let filteredProducts =[];
    allProducts.forEach(singleproduct => {
        if(singleproduct.title.toLowerCase().includes(inputValue) || singleproduct.category.toLowerCase().includes(inputValue)){
            filteredProducts.push(singleproduct);
            console.log(filteredProducts);
        }
    });
    productLoading(filteredProducts);

}
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
        allProducts = await response.json();
        productLoading(allProducts);
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
        upperDiv.className = "upperDiv"
        let lowerDiv = document.createElement("div");
        lowerDiv.className = "lowerDiv";
        itemContainer.append(upperDiv);
        itemContainer.append(lowerDiv);

        let upperCategory = document.createElement("p");
        upperCategory.className = "upper-category";
        let img = document.createElement("img");
        img.className = "productImg"
        upperCategory.innerText = `${products[i].category}`;
        img.src = `${products[i].image}`;
        upperDiv.append(upperCategory);
        upperDiv.append(img);

        let title = document.createElement("p");
        title.className = "cardTitle";
        title.innerText = `${products[i].title}`;
        lowerDiv.append(title);

        let rating = document.createElement("div");
        rating.className = "ratingContainer";
        lowerDiv.append(rating);

        let stars = document.createElement("span");
        stars.className = "stars";
        let voting = document.createElement("span");
        voting.className = "voting";
        let voteCount = document.createElement("span");
        voteCount.className = "voteCount";
        voting.innerText = `${products[i].rating.rate}`;
        voteCount.innerText =  `(${products[i].rating.count})`;
        starGenerateFunc(stars, voting.innerText);
        rating.append(stars);
        rating.append(voting);
        rating.append(voteCount);

        let priceNcart = document.createElement("div");
        priceNcart.className = "priceNcart";
        lowerDiv.append(priceNcart);

        let price = document.createElement("span");
        price.className = "price";
        let cartAdd = document.createElement("button");
        cartAdd.className = "cartAdd";
        price.innerText = `$${(products[i].price).toFixed(2)}`;
        itemContainer.dataset.price = products[i].price;
        cartAdd.innerText = "+";
        priceNcart.append(price);
        priceNcart.append(cartAdd);

    }
}

// star generating 
function starGenerateFunc(star, ratingVal){
    fullStar = `<i class="ri-star-s-fill"></i>`;
    halfStar = `<i class="ri-star-half-s-line"></i>`;
    emptyStar = `<i class="ri-star-s-line"></i>`
    if(ratingVal - Math.floor(ratingVal) >= 0.5){
        star.innerHTML = fullStar.repeat(Math.floor(ratingVal)) + halfStar + emptyStar.repeat(4- Math.floor(ratingVal));
    }else{
        star.innerHTML = fullStar.repeat(Math.floor(ratingVal)) + emptyStar.repeat(5 - Math.floor(ratingVal));
    }
}

// Bottom sheet
let isbottomsheet = false;
let DrawerActiveCard = null;

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
    DrawerActiveCard = card;
    productDrawer.classList.add("open");
    backdrop.classList.add("open");
    isbottomsheet = true;
    document.querySelector(".drawer-img").src = card.querySelector("img").src;
    document.querySelector(".drawer-category").innerText = card.querySelector(".upper-category").innerText;
    document.querySelector(".drawer-title").innerText = card.querySelector(".cardTitle").innerText;
    document.querySelector(".drawer-stars").innerHTML = card.querySelector(".stars").innerHTML;
    document.querySelector(".drawer-vote").innerText = `${card.querySelector(".voting").innerText}/5 ·`;
    document.querySelector(".drawer-count").innerText = `${card.querySelector(".voteCount").innerText} reviews`;
    document.querySelector(".drawer-description").innerText = card.dataset.description;
    document.querySelector(".drawer-price").innerText = card.querySelector(".price").innerText;
}


function closeDrawerFunc(){
    productDrawer.classList.remove("open");
    backdrop.classList.remove("open");
    isbottomsheet = false;
    DrawerActiveCard = null;
}

drawerClose.addEventListener("click", ()=>{
    closeDrawerFunc();
});

document.addEventListener("click", (e)=>{
    if(!productsContainer.contains(e.target) && !productDrawer.contains(e.target) && e.target !== cartIcon && !fixedCart.contains(e.target) && !sidebar.contains(e.target))
        closeDrawerFunc();

    if(isSidebar===true && !sidebar.contains(e.target) && e.target !== cartIcon && !fixedCart.contains(e.target)){
        closeSidebar();
    }

});

document.querySelector(".product-drawer button").addEventListener("click",()=>{
    AddingToCart(DrawerActiveCard);
});


// Sidebar
let isSidebar = false;

fixedCart.addEventListener("click", toggleSidebar);
cartIcon.addEventListener("click", toggleSidebar);

function toggleSidebar(){
    if(!isSidebar)
        sidebarFunc();
    else
        closeSidebar();
}

function sidebarFunc(){
    sidebar.classList.add("open");
    backdrop.classList.add("open");
    isSidebar = true;
}

sidebarClose.addEventListener("click", ()=>{
    closeSidebar();
});

function closeSidebar(){
    console.log(backdrop.classList.contains("open"));

    sidebar.classList.remove("open");
    backdrop.classList.remove("open");
    console.log("is it removed");
    isSidebar = false;
}

// cart
let cart = [];

document.addEventListener("DOMContentLoaded", ()=>{
    cart = JSON.parse(localStorage.getItem("cartKey"));

    cart.forEach(item => {
        displayCartProducts(item);
    });
    emptyCartFunc();
    priceCalculation();
    cartSizeFunc();
});

function AddingToCart(card){
    let itemFound = cart.find(obj => obj.id === card.dataset.id);
    if(itemFound){
        addQtyFunc(itemFound)
        return;
    }

    const item = {
        id : card.dataset.id,
        title : card.querySelector(".cardTitle").innerText,
        quantity : 1,
        price : +card.dataset.price,
        imgUrl : card.querySelector("img").src,
        
    }
    cart.push(item);
    localStorage.setItem("cartKey", JSON.stringify(cart));
    emptyCartFunc();
    displayCartProducts(item);
    priceCalculation();
    cartSizeFunc();
}

function displayCartProducts(item){
    cartProducts.innerHTML += `
        <div class="singleCartProduct"  data-id="${item.id}">
            <div class="leftCartDiv">
                <img class="cartImg" src="${item.imgUrl}"/>
            </div>
            <div class="rightCartDiv">
                <p class="cartTitle">${item.title}</p>
                <p class="cartPrice">$${item.price}</p>
                <div class="quantityDiv">
                    <button class="minusCart miniBtn"><i class="ri-subtract-line"></i></button><span id="qty-${item.id}">${item.quantity}</span><button class="addToCart miniBtn"><i class="ri-add-line"></i></button><i class="ri-close-line singleCartRemove"></i>
                </div>
            </div>
        </div>
    `
}

cartProducts.addEventListener("click", (e)=>{
    let itemFound = cart.find(obj => obj.id === e.target.closest(".singleCartProduct").dataset.id);
    if(!itemFound)return;

    if(e.target.closest(".addToCart")){
        addQtyFunc(itemFound);
    }else if(e.target.closest(".minusCart")){
        e.stopPropagation();
        minusQtyFunc(itemFound);
    }
});

// cart in/decrease qty

function addQtyFunc(itemFound){
    document.querySelector(`#qty-${itemFound.id}`).innerText = ++itemFound.quantity;
    localStorage.setItem("cartKey", JSON.stringify(cart));
    priceCalculation();
}

function minusQtyFunc(itemFound){
    let qtySpan = document.querySelector(`#qty-${itemFound.id}`)
    qtySpan.innerText = --itemFound.quantity;
    priceCalculation();
    localStorage.setItem("cartKey", JSON.stringify(cart));

    if(itemFound.quantity <= 0){
        removeFromArray(itemFound.id,qtySpan);
    }
}



// cart remove product

cartProducts.addEventListener("click", (e)=>{
    if(e.target.closest(".singleCartRemove")){
        e.stopPropagation();
        removeFromArray(e.target.closest(".singleCartProduct").dataset.id, e.target);
    }
})

function removeFromArray(uniqID, target){
    let cartProductDiv =  target.closest(".singleCartProduct")
    cartProductDiv.classList.add("removeCartProduct")
    cartProductDiv.addEventListener("transitionend", ()=>{
        let idx = cart.findIndex(obj => obj.id === uniqID);
        if(idx !== -1)
            cart.splice(idx,1);
        cartProductDiv.remove();
        localStorage.setItem("cartKey", JSON.stringify(cart));
        emptyCartFunc();
        priceCalculation();
        cartSizeFunc();
    });
}


function emptyCartFunc(){
    if(cart.length !== 0){
        emptyCartDisplay.classList.add("hidden");
        cartFooter.classList.remove("hidden");
        fixedCart.classList.remove("hidden");
    }else if(cart.length === 0){
        emptyCartDisplay.classList.remove("hidden");
        cartFooter.classList.add("hidden");
        fixedCart.classList.add("hidden");
    }
}

// cart price calculation

function priceCalculation(){
    let subtotalVal =0;
    let shippingval =0;

    subtotal.innerText = 0;
    cart.forEach((item, idx)=>{
        subtotalVal += item.quantity * item.price;
        subtotal.innerText =`$${subtotalVal.toFixed(2)}`;
    });

    if(subtotalVal <50){
        shippingVal = 9.99;
        shipping.innerText = `$${shippingVal.toFixed(2)}`;
        shipping.style.color = "";
        shipping.style.fontWeight = "";
    }else if(subtotalVal <99.99){
        shippingVal = 4.99;
        shipping.innerText = `$${shippingVal}`;
        shipping.style.color = "";
        shipping.style.fontWeight = "";
    }else{
        shippingVal = 0;
        shipping.innerText = "FREE";
        shipping.style.color = "#34c759";
        shipping.style.fontWeight = "600";
    }

    total.innerText = `$${(subtotalVal + shippingVal).toFixed(2)}`;
}

function cartSizeFunc(){
    cartSize.forEach(badge =>{
        if(cart.length===0){
            badge.innerText = "";
            return;
        }
        badge.innerText = cart.length;
    });
}