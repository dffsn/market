"use strict";

// Флаги перехода на форму восстановления или регистрации
let is_reg_flag = false;
let is_recovery_flag = false;

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