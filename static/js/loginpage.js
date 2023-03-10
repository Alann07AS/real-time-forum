export 

function ShowLoginPage() {
    const loginpage = document.getElementById("login_register")
    const loginbt = document.getElementById("loginbt")
    const registerbt = document.getElementById("registerbt")
    loginbt.onclick = null
    registerbt.onclick = null
    loginpage.classList.toggle("hidepage", false)
    document.addEventListener("click", listenToggleOff)
    document.addEventListener("keydown", listenEnter)
}

function hideLoginPage() {
    const loginpage = document.getElementById("login_register")
    document.removeEventListener("click", listenToggleOff)
    document.removeEventListener("keydown", listenEnter)
    loginpage.classList.toggle("hidepage", true)
}

function listenEnter(e) {
    if (e.key !== "Enter") return
    if (e.target.parentElement.id === "logindiv") {
        const valid = Array(...document.forms['loginform']).every(input => input.checkValidity());
        if (valid && summitLogin()) {// if login success
            hideLoginPage()
        }
    } else if  (e.target.parentElement.id === "registerdiv") {
        const valid = Array(...document.forms['registerform']).every(input => input.checkValidity());
        if (valid && summitRegister()) {// if register success
            document.forms["loginform"]["logincredential"].value = document.forms["registerform"]["email"].value
            document.forms["registerform"].reset()
            registerdiv.classList.toggle("close", true)
            logindiv.classList.toggle("close", false)
        }
    }
}



function listenToggleOff(e) {
    console.log(e.target.parentElement);
    if (e.target.parentElement.id === "loginbt") {
        listenLoginBt()
    } else if  (e.target.parentElement.id === "registerbt") {
        listetRegisterBt()
    } else if (e.target.parentElement.id === "body"){
        const registerdiv = document.getElementById("registerdiv")
        const logindiv = document.getElementById("logindiv")
        registerdiv.classList.toggle("close", true)
        logindiv.classList.toggle("close", true)
    }
}

function listetRegisterBt() {
    const registerdiv = document.getElementById("registerdiv")
    const logindiv = document.getElementById("logindiv")
    const loginbt = document.getElementById("loginbt")
    const registerbt = document.getElementById("registerbt")
    if (registerdiv.classList.contains("close")) {
        registerdiv.classList.toggle("close", false)
        logindiv.classList.toggle("close", true)
        console.log("summit");
        setTimeout(()=>{
            registerbt.setAttribute('type', "summit")
            loginbt.setAttribute('type', 'button')
        }, 1000)        
    } else {
        const valid = Array(...document.forms['registerform']).every(input => input.checkValidity());
        if (valid && summitRegister()) {// if register success
            registerdiv.classList.toggle("close", true)
            logindiv.classList.toggle("close", false)
        }
    }
}

function listenLoginBt() {
    const registerdiv = document.getElementById("registerdiv")
    const logindiv = document.getElementById("logindiv")
    const loginbt = document.getElementById("loginbt")
    const registerbt = document.getElementById("registerbt")
    if (logindiv.classList.contains("close")) {
        logindiv.classList.toggle("close", false)
        registerdiv.classList.toggle("close", true)
        setTimeout(()=>{
            registerbt.setAttribute('type', "button")
            loginbt.setAttribute('type', 'summit')
        }, 1000)  
    } else {
        const valid = Array(...document.forms['loginform']).every(input => input.checkValidity());
        if (valid && summitLogin()) {// if login success
            hideLoginPage()
        }
    }
}

function summitLogin() {
    return false // if login succesfull
}

function summitRegister() {
    return true // if register succesfull
}