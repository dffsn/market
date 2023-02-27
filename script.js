"use strict";

// Список пользователей
let users = [
    {
        "login" : "admin@mail.ru",
        "password" : "admin_test",
        "key_code" : "test_admin",
        "is_admin"  : "1"
    },
    {
        "login" : "user@mail.ru",
        "password" : "user_test",
        "key_code" : "test_user",
        "is_admin"  : "0"
    }
];

localStorage.setItem("users", JSON.stringify(users));

let content = document.querySelector(".content");

// Флаги перехода на форму восстановления или регистрации
let is_reg_flag = false;
let is_recovery_flag = false;

// Слушатели кнопок меню навигации
let log_out_btn = document.querySelector(".log_out_btn");
log_out_btn.addEventListener("click", log_out);

let to_login_btn = document.querySelector(".to_log_btn");
to_login_btn.addEventListener("click", auth_form_wrap);

let select_category = document.querySelector(".select_category");

let to_main_btn = document.querySelector(".to_main_btn");
to_main_btn.addEventListener("click", add_content);

let to_basket_btn = document.querySelector(".to_basket_btn");
// to_basket_btn.addEventListener("click", add_content);


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

// Отрисовка формы логинизации
function auth_form_wrap() {
    to_login_btn.style.display = "none";
    is_reg_flag = false;
    is_recovery_flag = false;

    anti_wrap_reg_form();
    anti_wrap_recovery_form();

    let login_form = document.querySelector(".login_form");
    login_form.style.display = "block";
}

// Отрисовка формы регистрации
function reg_form_wrap() {
    is_reg_flag = true;
    is_recovery_flag = false;

    anti_wrap_auth_form();
    anti_wrap_recovery_form();

    let registration_form = document.querySelector(".registration_form");
    registration_form.style.display = "block";
}

// Отрисовка формы восстановления пароля
function recovery_form_wrap() {
    is_reg_flag = false;
    is_recovery_flag = true;

    anti_wrap_auth_form();
    anti_wrap_reg_form();
    
    let recovery_form = document.querySelector(".recovery_form");
    recovery_form.style.display = "block";
}

// Функции скрытия форм
function anti_wrap_auth_form() {
    let login_form = document.querySelector(".login_form");
    login_form.style.display = "none";
}

function anti_wrap_reg_form() {
    let registration_form = document.querySelector(".registration_form");
    registration_form.style.display = "none";

}

function anti_wrap_recovery_form() {
    let recovery_form = document.querySelector(".recovery_form");
    recovery_form.style.display = "none"; 
}

// Получение данных, проверка полей на пустоту и отправка данных на валидацию
function getLogPass(){  
    if (is_reg_flag == false && is_recovery_flag == false){
        let auth_log = document.querySelector("#auth_log").value;
        let auth_pwd = document.querySelector("#auth_pwd").value;
        if(auth_log && auth_pwd){
            check_log_in(auth_log, auth_pwd);
        }
        else{
            alert("Not all fields are filled correctly");
        }   
    }
    else if (is_reg_flag == true && is_recovery_flag == false){
        let reg_log = document.querySelector("#reg_log").value;
        let reg_pwd = document.querySelector("#reg_pwd").value;
        let key_code = document.querySelector("#key_code").value;
        if(reg_log && reg_pwd && key_code){
            check_reg(reg_log, reg_pwd, key_code);
        }
        else{
            alert("Not all fields are filled correctly");
        }
    }
    else if (is_reg_flag == false && is_recovery_flag == true){
        let log = document.querySelector("#log").value;
        let code = document.querySelector("#code").value;
        let pwd = document.querySelector("#pwd").value;
        if(log && code && pwd){
            check_recovery(log, code, pwd);
        }
        else{
            alert("Not all fields are filled correctly");
        }   
    }
}

// Валидация полей
let filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function check_log_in(auth_log, auth_pwd){ 
    if (!filter.test(auth_log)) {
        alert('Invalid username!');
        auth_log.focus;
        return false;
    }
    else{
        log_in(auth_log, auth_pwd);
    }
}

function check_reg(reg_log, reg_pwd, key_code){
   if (!filter.test(reg_log)) {
        alert('Invalid username!');
        reg_log.focus;
        return false;
    }
    else{
        registration(reg_log, reg_pwd, key_code);
    }
}

function check_recovery(log, code, pwd){
    if (!filter.test(log)) {
        alert('Invalid username!');
        log.focus;
        return false;
    }
    else{
        recovery(log, code, pwd);
    }
}

// Функция входа
function log_in(auth_log, auth_pwd, reg_log, reg_pwd) {
    let flag = false;
    let is_admin_flag = 0;
    let list_of_users = JSON.parse(localStorage.getItem("users"));
    for (const user of list_of_users) {
        if ((user.login == auth_log && user.password == auth_pwd)||(user.login == reg_log && user.password == reg_pwd)) {
            flag = true;
            is_admin_flag = user.is_admin;  
            anti_wrap_auth_form(); 
            fetch('https://dummyjson.com/products/categories')
            .then(res => res.json())
            .then((json)=>get_category(json));
            add_content();
            to_login_btn.style.display = "none";
            select_category.style.display = "flex";   
            to_main_btn.style.display = "inline";   
            log_out_btn.style.display = "inline";
            to_basket_btn.style.display = "inline";
            break;
        }
    }
    if (!flag) {
        alert("Invalid username or password!");
    }
}

// Функция регистрации
function registration(reg_log, reg_pwd, key_code) {
    let flag = false;
    for (const user of users) {
        if (user.login == reg_log) {
            flag = true;
            alert("A user with this name already exists");
        }
    }
    if (!flag){
        let add = {
                "login" : reg_log,
                "password" : reg_pwd,
                "key_code" : key_code,
                "is_admin" : "0"
        };
        users.push(add);
        localStorage.setItem("users", JSON.stringify(users));
        console.table(users);
        log_in(auth_log, auth_pwd, reg_log, reg_pwd);
        anti_wrap_reg_form();
    }
}

// Функция восстановления пароля
function recovery(log, code, pwd) {
    let flag = false;
    let list_of_users = JSON.parse(localStorage.getItem("users"));
    for (const user of list_of_users) {
        if (user.login == log && user.key_code == code) {
            flag = true;
            user.password = pwd;
            localStorage.setItem("users", JSON.stringify(list_of_users));
            is_reg_flag = false;
            auth_form_wrap();
        }
    }
    if (!flag){
        alert("Invalid username or recovery code!");
    }
}

// Функция выхода
function log_out(){
    to_login_btn.style.display = "inline-block";
    log_out_btn.style.display = "none";
    select_category.style.display = "none";   
    to_main_btn.style.display = "none";  
    to_basket_btn.style.display = "none";
    clear_content();
}

// Добавление контента
function add_content() {
    clear_content();
    fetch('https://dummyjson.com/products')
    .then((response)  => response.json())
    .then((json)=>add_products(json));
}

function add_product_in_html(all_products){
    let i = 0;
    for (const product of all_products){
        content.innerHTML += `
        <div class="item" id="${i}">      
            <div class="product">
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
            <div class="basket_btn">
                <div id="basket_btn">
                        <a href="#" class="basket_btn_text">Купить</a>
                </div>
            </div>
        </div>`;
        i += 1;
    }
    let item = document.querySelectorAll('.item');
    for(let i = 0; i < item.length; i++){
        let click_id = item[i].id;
        item[i].addEventListener('click', (e) => {
            let product_id = all_products[click_id].id;
            clear_content();    
            add_info_about_product(product_id);
        });  
    }   
}

function add_products(json) {
    clear_content();
    let all_products = json.products;
    add_product_in_html(all_products);
}

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

function add_info_about_product(product_id){
    let about_product_page = document.querySelector(".about_product_page");
    let url = 'https://dummyjson.com/products/' + product_id;
    fetch(url)
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


// Слайдер
