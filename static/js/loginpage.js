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
    lastfocus = null
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
            document.forms["loginform"]["password"].focus()
            setTimeout(()=>{document.forms["registerform"].reset()}, 300)
            registerdiv.classList.toggle("close", true)
            logindiv.classList.toggle("close", false)
        }
    }
}


let lastfocus = null
function listenToggleOff(e) {
    if (e.target.parentElement.id === "loginbt") {
        listenLoginBt(e)
    } else if  (e.target.parentElement.id === "registerbt") {
        listetRegisterBt(e)
    } else if (e.target.parentElement.id === "body" && lastfocus === document.activeElement){
        const registerdiv = document.getElementById("registerdiv")
        const logindiv = document.getElementById("logindiv")
        registerdiv.classList.toggle("close", true)
        logindiv.classList.toggle("close", true)
    }
    lastfocus = document.activeElement
    if (lastfocus.tagName !== "INPUT") lastfocus = document.body 
}

function listetRegisterBt(e) {
    const registerdiv = document.getElementById("registerdiv")
    const logindiv = document.getElementById("logindiv")
    const loginbt = document.getElementById("loginbt")
    const registerbt = document.getElementById("registerbt")
    if (registerdiv.classList.contains("close")) {
        registerdiv.classList.toggle("close", false)
        logindiv.classList.toggle("close", true)
        registerbt.setAttribute('type', "summit")
        e.preventDefault()
    } else {
        loginbt.setAttribute('type', 'button')
        const valid = Array(...document.forms['registerform']).every(input => input.checkValidity());
        if (valid && summitRegister()) {// if register success
            document.forms["loginform"]["logincredential"].value = document.forms["registerform"]["email"].value
            document.forms["loginform"]["password"].focus()
            setTimeout(()=>{document.forms["registerform"].reset()}, 300)
            registerdiv.classList.toggle("close", true)
            logindiv.classList.toggle("close", false)
        }
    }
}

function listenLoginBt(e) {
    const registerdiv = document.getElementById("registerdiv")
    const logindiv = document.getElementById("logindiv")
    const loginbt = document.getElementById("loginbt")
    const registerbt = document.getElementById("registerbt")
    if (logindiv.classList.contains("close")) {
        logindiv.classList.toggle("close", false)
        registerdiv.classList.toggle("close", true)
        loginbt.setAttribute('type', 'summit')
        e.preventDefault()
    } else {
        registerbt.setAttribute('type', "button")
        const valid = Array(...document.forms['loginform']).every(input => input.checkValidity());
        if (valid && summitLogin()) {// if login success
            hideLoginPage()
        }
    }
}

export function summitLogin() {
    return true // if login succesfull
}

function summitRegister() {
    return true // if register succesfull
}