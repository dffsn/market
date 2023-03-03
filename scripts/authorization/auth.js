"use strict";

// Авторизация

// Функция входа
function log_in(auth_log, auth_pwd, reg_log, reg_pwd) {
    let flag = false;
    let is_admin_flag = 0;
    let list_of_users = JSON.parse(localStorage.getItem("users"));
    for (const user of list_of_users) {
        if ((user.login == auth_log && user.password == auth_pwd)||(user.login == reg_log && user.password == reg_pwd)) {
            auth_user = user.user_id    ;
            console.log(auth_user);
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
            search_cont.style.display = "flex";

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
        let add_id = users[users.length - 1].user_id + 1;
        let add = {
                "login" : reg_log,
                "password" : reg_pwd,
                "key_code" : key_code,
                "is_admin" : "0",
                "user_id" : add_id
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