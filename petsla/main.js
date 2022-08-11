
var productApi = 'http://petsla-api.herokuapp.com/products/';
var ElementAmount = document.querySelector('#amount-in-page');
var listCart = JSON.parse(localStorage.getItem("data")) || [];
function converToVND(value) {
    var test1 = value.toString();
    var x = test1.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return x;
}

function start() {
    getData(renderHTML);
    handleDisplayCart();
    // handleAmount(pages);
}


start();

function renderHTML(products) {
    var htmls = products.map(function (product) {
        var converted = converToVND(product.price);
        return `
        <div class="l-3 m-4 c-6 col pd product-id-${product.id}">
            <div class="product-item">
                <a href="./cart.html" class="product-item-link" onclick="saveID(${product.id})">
                    <div class="product-item-img" style="background-image:url(http://petsla-api.herokuapp.com${product.images}) ;"></div>
                </a>
                <div class="product-info">
                    <div class="product-info-text">
                        <a href="" class="product-text-link">
                            <span class="product-title">${product.product_name}</span>
                        </a>
                        <div class="product-price">${converted}</div>
                    </div>
                    <div class="product-buy">
                        <div class="buy-btn btn-has-hover>
                            <i class="bi bi-bag"></i>
                            <span class="sub-buy">Buy now</span>
                        </div>
                        <div class="add-cart btn-has-hover" onclick="handleAddCart(${product.id})">
                            <i class="bi bi-cart3"></i>
                            <span class="sub-cart">Add to Cart</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    })
    ElementAmount.onchange = function () {
        handleAmount(htmls);
    }
    handleAmount(htmls);
}

function saveID(id){
    localStorage.setItem("id",JSON.stringify(id));
}

function handleAmount(pages) {
    var blockProduct = document.querySelector('.cover-container');
    var ValueElementAmount = parseInt(ElementAmount.value);
    var listPage = handleDivision(pages, ValueElementAmount);
    blockProduct.innerHTML = listPage[0].join('');
    var htmls = listPage.map(function (value, index) {
        return `
        <button class="btn-index_page">
        <a href = "#test" class = "btn-index_page_link">${index}</a>
        </button>
        `
    })
    document.querySelector('.list').innerHTML = htmls.join('');
    document.querySelectorAll('.btn-index_page_link').forEach(function (btn) {
        btn.onclick = function () {
            handleTransferPage(blockProduct, listPage, btn.innerHTML);
        }
    })
}

function handleTransferPage(blockProduct, listPage, id) {
    blockProduct.innerHTML = listPage[id].join('');
    // blockProduct.innerHTML = listPage[id].join('');
}

function getData(callback) {
    fetch(productApi)
        .then(function (response) {
            return response.json();
        })
        .then(callback)
        .catch(function (err) {
            console.log(err);
        })
}

function handleDivision(myArr, num) {
    var teamArr = [];
    for (var index = 0; index < myArr.length; index += num) {
        teamArr.push(myArr.slice(index, index + num));
    }
    return teamArr;
}



function handleAddCart(id) {
    fetch(productApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var productElementAdder = data.find(function(x){
                return x.id == id;
            })
            var checkAdder = listCart.find(function(x){
                return x.id == id;
            })
            if (checkAdder  !== undefined) {
                handleUpdateCart(id,+1);
            } else {
                var converted = converToVND(productElementAdder.price);
                var htmls = `
                    <div class="item-cart">
                        <div class="add-number-item">
                            <button class="sum" onclick="handleChanged(${id},${1})">+</button>
                            <span class="amount">1</span>
                            <button class="remove" onclick="handleChanged(${id},${-1})">-</button>
                        </div>
                        <div class="describe-item">
                            <div class="cover-img-item">
                                <div class="img-item" style="background-image:  url(http://petsla-api.herokuapp.com${productElementAdder.images});"></div>
                            </div>
                            <div class="text-item">
                                <span class="product-title">${productElementAdder.product_name}</span>
                                <div class="cover-prices">
                                    <span class="caculate" style="margin-right:2px ;">${productElementAdder.price}đ x </span>
                                    <span class="amount" style="font-size:1.3rem ;">1</span>
                                </div>
                                <span class="sum-monney">${converted}đ</span>
                            </div>
                        </div>
                        <div class="delete-product" onclick="handleDelete(${id})">
                            <i class="bi bi-x-lg"></i>
                        </div>
                    </div>
                `
                listCart.push({
                    id: productElementAdder.id,
                    amount: 1,
                    sumPrice: productElementAdder.price,
                    images: productElementAdder.images,
                    product_name: productElementAdder.product_name,
                    price: productElementAdder.price,
                    htmls: htmls
                });
            }
        })
        .then(function () {
            handleDisplayCart();
        })
    localStorage.setItem("data",JSON.stringify(listCart));    
}


function handleUpdateCart(id,option) {
    let search = listCart.find(function(x){
        return x.id == id;
    })

    if(search.amount == 1 && option == -1){
        return;
    }
    else{
        search.amount += option;
        search.sumPrice = search.price * search.amount;
        var converted = converToVND(search.sumPrice);
        search.htmls = `
            <div class="item-cart">
                <div class="add-number-item">
                    <button class="sum" onclick="handleChanged(${id},${1})")>+</button>
                    <span class="amount">${search.amount}</span>
                    <button class="remove" onclick="handleChanged(${id},${-1})">-</button>
                </div>
                <div class="describe-item">
                    <div class="cover-img-item">
                        <div class="img-item" style="background-image:  url(http://petsla-api.herokuapp.com${search.images});"></div>
                    </div>
                    <div class="text-item">
                        <span class="product-title">${search.product_name}</span>
                        <div class="cover-prices">
                            <span class="caculate" style="margin-right:2px ;">${search.price}đ x </span>
                            <span class="amount" style="font-size:1.3rem ;">${search.amount}</span>
                        </div>
                        <span class="sum-monney">${converted}đ</span>
                    </div>
                </div>
                <div class="delete-product" onclick="handleDelete(${id})">
                    <i class="bi bi-x-lg"></i>
                </div>
            </div>
            `
    }

    
}

function handleChanged(id,option){
    handleUpdateCart(id,option);
    localStorage.setItem("data",JSON.stringify(listCart));
    handleDisplayCart();
}


function handleDisplayCart() {
    var sumProduct = 0;
    var sumPriceProduct = 0;
    var blockAddProduct = document.querySelector('.container-cart');
    var listHtmls = listCart.map(function (value) {
        sumProduct += value.amount;
        sumPriceProduct += value.sumPrice;
        return value.htmls;
    })
    blockAddProduct.innerHTML = listHtmls.join('');
    var converted = converToVND(sumPriceProduct);
    document.querySelector('.title-text').innerHTML = `title.cart: ${sumProduct} title.item`;
    document.querySelector('.checkout-price').innerHTML = `title.checkout (${converted})đ`;
    document.querySelector('.number_cart').innerHTML = sumProduct;
}


function handleDelete(id){
    listCart = listCart.filter(function(value){
        if(value.id == id){
            return false;
        }
        return true;
    })
    localStorage.setItem("data",JSON.stringify(listCart));
    handleDisplayCart();
}

