var productApi = 'http://petsla-api.herokuapp.com/products/';
var  idProduct =JSON.parse(localStorage.getItem("id"))
function start() {
    callApi(renderHTML);
}

start();

function converToVND(value) {
    var test1 = value.toString();
    var x = test1.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return x;
}


function callApi(callback) {
    fetch(productApi)
        .then((response) => {
            return response.json();
        })
        .then(callback);
}

function renderHTML(products) {
    var search = products.find(function (x) {
        return x.id == idProduct;
    })
    var html = `
    <div class="l-6 c-12 m-6 col" style="border-radius: 4px;">
        <img src="http://petsla-api.herokuapp.com${search.images}" alt="" class="product-img" style="border-radius: 4px;">
    </div>
    <div class="l-6 c-12 m-6 col">
        <h1 class="title-product">${search.product_name}</h1>
        <div class="product-price">
            <span>${converToVND(search.price)}</span>
        </div>
        <div class="btn-wrap">
            <button class="buy-in-cart-btn">Buy Now</button>
            <button class="add-in-cart-btn">Add to Cart</button>
        </div>
        <div class="product-desc">
            <h3 class="title-desc">Thông tin sản phẩm</h3>
            <div class="text-desc">${search.description}</div>
        </div>
    </div>
    `
    document.querySelector('.useInnerHTML').innerHTML = html;
}