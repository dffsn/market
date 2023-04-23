"use strict";

// Список пользователей
let users = [
    {
        "login" : "admin@mail.ru",
        "password" : "admin_test",
        "key_code" : "test_admin",
        "is_admin"  : "1",
        "user_id" : 1
    },
    {
        "login" : "user@mail.ru",
        "password" : "user_test",
        "key_code" : "test_user",
        "is_admin"  : "0",
        "user_id" : 2
    }
];

localStorage.setItem("users", JSON.stringify(users));

let auth_user;
let basket_id = 0;

// Корзина
let basket = [
    
];

// Определение страницы контента
let content = document.querySelector(".content");

// Слушатели кнопок меню навигации
let log_out_btn = document.querySelector(".log_out_btn");
log_out_btn.addEventListener("click", log_out);

let to_login_btn = document.querySelector(".to_log_btn");
to_login_btn.addEventListener("click", auth_form_wrap);

let select_category = document.querySelector(".select_category");

let to_main_btn = document.querySelector(".to_main_btn");
to_main_btn.addEventListener("click", add_content);

let to_basket_btn = document.querySelector(".to_basket_btn");
to_basket_btn.addEventListener("click", add_basket);

let search_cont = document.querySelector(".search_cont");

let search = document.querySelector("#to_search");
search.addEventListener("click", input_search);

// Слушатели кнопок формы авторизации
let login_btn = document.querySelector(".login_btn");
login_btn.addEventListener("click", getLogPass);

let to_recover = document.querySelector("#to_recover_btn");
to_recover.addEventListener("click", recovery_form_wrap);

let to_reg_btn = document.querySelector("#to_reg_btn");
to_reg_btn.addEventListener("click", reg_form_wrap);

// Слушатель кнопки формы регистрации
let reg_btn = document.querySelector(".reg_btn");
reg_btn.addEventListener("click", getLogPass);

let to_login = document.querySelector("#to_login");
to_login.addEventListener("click", auth_form_wrap);

// Слушатель кнопки формы восстановления пароля
let cancel_recover = document.querySelector("#cancel_recover");
cancel_recover.addEventListener("click", auth_form_wrap);

let recover_btn = document.querySelector(".recover_btn");
recover_btn.addEventListener("click", getLogPass);

// Изменение стандартных настроек сабмита
document.addEventListener('submit', (e) => { 
    e.target.reset(); 
    e.preventDefault();
});

// Добавление контента
function add_content() {
    clear_content();
    fetch('https://dummyjson.com/products')
    .then((response)  => response.json())
    .then((json)=>add_products(json));
}

function add_products(json) {
    clear_content();
    document.querySelector("#search_product").value = '';
    let all_products = json.products;
    if(all_products.length === 0){
        content.innerHTML = `
        <p class="search_failed">По вашему запросу ничего не найдено ;(</p>`;
    }
    else{
        add_product_in_html(all_products);
    }
}

function add_product_in_html(all_products){
    clear_content();
    let i = 0;
    for (const product of all_products){
        content.innerHTML += `
        <div class="item" >      
            <div class="product" id="${i}">
                <div class="item_img">
                    <div class="price_conteiner">
                        <p class="item_price">${product.price}$</p>
                    </div>
                    <img src="${product["images"][0]}" alt="">
                </div>
                <div class="item_info">
                    <p class="item_header">${product.title}</p>
                    <p class="about_item">${product.description}</p>
                </div>
            </div>
            <div class="basket_btn" id="${i}">
                <div id="basket_btn">
                        <a href="#" class="basket_btn_text">Купить</a>
                </div>
            </div>
        </div>`;
        i += 1;
    }
    // Слушатель нажатия на карточку продукта
    let item = document.querySelectorAll('.product');
    let add_product_to_basket = document.querySelectorAll('.basket_btn');
    for(let i = 0; i < item.length; i++){
        let click_on_item_id = item[i].id;
        item[i].addEventListener('click', (e) => {
            let product_id = all_products[click_on_item_id].id;
            clear_content();    
            add_info_about_product(product_id);
        });  
        let click_on_buy_id = add_product_to_basket[i].id;
        add_product_to_basket[i].addEventListener('click', (e) => {
            let product_id = all_products[click_on_buy_id].id;
            add_to_basket(product_id);
        });  
    }   
}

// Добавление продукта по категории
function add_products_of_category(product_id){
    let search_category;
    let all_categories_by_id = document.querySelectorAll('.option');
    for(let i = 0; i < all_categories_by_id.length; i++){
        if(all_categories_by_id[i].htmlFor === product_id){
            search_category = all_categories_by_id[i].outerText.toLowerCase();
        }
    }
    fetch('https://dummyjson.com/products/category/' + search_category)
    .then(response => response.json())
    .then((json)=>add_products(json));
}

// Выбор категории продукта
function get_category(json) {
    let all_categories = json;
    capitalize(all_categories);
    for (let i = 0; i < all_categories.length; i++){
        select_category.innerHTML += `
        <input class="select_opt" name="category" type="radio" id="opt${i+2}">
        <label for="opt${i+2}" class="option">${all_categories[i]}</label>`
    }
    let cat = document.querySelectorAll('.select_opt');
    for(let i = 0; i < cat.length; i++){
        if(i === 0){
            cat[i].addEventListener('click', (e) => {
                add_content();
            });
        }
        else{
            cat[i].addEventListener('click', (e) => {
                let product_id = e.target.id;
                add_products_of_category(product_id);
            });
        }
    }   
}

// Добавление продукта в корзину
function add_to_basket(product_id){
    if(basket.length === 0){
        let add_item = {
            'id' : product_id,
            'quantity' : 1,
        };
        alert("Ваш товар добавлен в корзину");
        basket.push(add_item);
    }
    else{
        let is_contain_product = 0;
        for(let i = 0; i < basket.length; i++){
            if (basket[i].id === product_id){
                is_contain_product = 1;
                alert("Такой товар уже имеется в корзине, если хотите купить более одного, то укажите количество на странице с описанием продукта");
            }
        }
        if(is_contain_product === 0){
            let add_item = {
                'id' : product_id,
                'quantity' : 1
            };
            basket.push(add_item);
            alert("Ваш товар добавлен в корзину");
        }  
    }
}

function add_basket(){
    clear_content();
    fetch('https://dummyjson.com/carts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        userId: auth_user,
        products: basket
    })
    })
    .then(res => res.json())
    .then((json) => {
        let all_products = json.products;
        add_product_in_basket_html(all_products);
    });
    
}

function add_product_in_basket_html(all_products){
    clear_content();
    console.log(basket);
    let total_price = 0;
    let i = 0;
    for (const product of all_products){
        content.innerHTML += `
        <div class="basket_item" >      
            <div class="product" id="${i}">
                <div class="item_info">
                    <p class="item_header">${product.title}</p>
                    <p class="about_item">Количество: ${product.quantity}</p>
                </div>
            </div>
            <div class="delete_btn" id="${i}">
                <div id="delete_btn">
                        <a href="#" class="delete_btn_text">Удалить</a>
                </div>
            </div>
        </div>`;
        total_price += product.price;
        i += 1;
    }
    content.innerHTML += `
    <div class="product_page_basket_btn">
            <div id="basket_btn">
                    <a href="#" class="basket_btn_text">К оплате <span class="price_product">${total_price}$</span></a>
            </div>
    </div>`;
    // Слушатель нажатия на карточку продукта
    let item = document.querySelectorAll('.product');
    let delete_from_basket = document.querySelectorAll('.delete_btn');
    for(let i = 0; i < item.length; i++){
        let click_on_item_id = item[i].id;
        item[i].addEventListener('click', (e) => {
            let product_id = all_products[click_on_item_id].id;
            clear_content();    
            add_info_about_product(product_id, all_products);
        });  
        delete_from_basket[i].addEventListener('click', (e) => {
            let click_on_delete_id = delete_from_basket[i].id;
            delete_product(click_on_delete_id);

        }); 
    }    
}

function delete_product(click_on_delete_id){
    basket.splice(click_on_delete_id, 1);
    console.log(basket);
    add_basket();
}

// Открытие страницы продукта
function add_info_about_product(product_id){
    let about_product_page = document.querySelector(".about_product_page");
    fetch('https://dummyjson.com/products/' + product_id)
    .then(response => response.json())
    .then((json)=>{
        about_product_page.innerHTML = `
        <h1 class="title_product">${json.title}</h1>
        <div class="picture">
            <ul class="product_picture_selector">
                <li>
                    <img class="product_img" src="${json.images[0]}" alt="product_photo">
                </li>
            </ul>
        </div>
        <br>
        <p class="brand_of_product">Производитель: ${json.brand}</p>
        <br>
        <p class="description_of_product">${json.description}</p>
        <br>
        <p class="description_of_product">Рейтинг продукта: <span class="mark_product">${json.rating}&#9733;</span></p>
        <br>
        <div class="product_page_basket_btn">
            <div id="basket_btn">
                    <a href="#" class="basket_btn_text">Купить за <span class="price_product">${json.price}$</span></a>
            </div>
        </div>
    `;
    let add_product_to_basket = document.querySelector('.product_page_basket_btn');
        add_product_to_basket.addEventListener('click', (e) => {
            add_to_basket(product_id);
        });  
    });
}

// Правка регистра категорий
function capitalize(category)
{
    for(let i = 0; i < category.length; i++){
        let s = category[i]
        category[i] = s[0].toUpperCase() + s.slice(1);  
    }
    
}

// Очистка контента
function clear_content(){
    let div = document.getElementById('content_page');
    let div2 = document.getElementById('about_product_page');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
    while(div2.firstChild){
        div2.removeChild(div2.firstChild);
    }
}

// Поиск
function input_search(){
    let search_product = document.querySelector("#search_product").value;
    fetch('https://dummyjson.com/products/search?q=' + search_product)
    .then(res => res.json())
    .then((json) =>add_products(json));
}
