"use strict";

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