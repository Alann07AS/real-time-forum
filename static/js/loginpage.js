import { HideForumPage } from "./forumpage.js"
import { RequestToGo } from "./js_to_go.js"

export 

function ShowLoginPage() {
    HideForumPage()
    const loginpage = document.getElementById("login_register")
    const loginbt = document.getElementById("loginbt")
    const registerbt = document.getElementById("registerbt")
    loginbt.onclick = null
    registerbt.onclick = null
    loginpage.classList.toggle("hidepage", false)
    document.addEventListener("click", listenToggleOff)
    document.addEventListener("keydown", listenEnter)
    document.forms["registerform"]["nickname"].addEventListener("input", namedebounce)
    document.forms["registerform"]["email"].addEventListener("input", emaildebounce)
}

const namedebounce = debounce(function() {
    console.log("ONINPUT");
    const nickname = document.forms["registerform"]["nickname"]
    RequestToGo.send(RequestToGo.OrderGo.GO_CHECK_USER_EXIST, nickname.value, "nickname", "register")
    nickname.setCustomValidity("")
}, 450)

const emaildebounce = debounce(function() {
    const email = document.forms["registerform"]["email"]
    RequestToGo.send(RequestToGo.OrderGo.GO_CHECK_USER_EXIST, email.value, "email", "register")
    email.setCustomValidity("")
    }, 450)

export function HideLoginPage() {
    lastfocus = null
    const loginpage = document.getElementById("login_register")
    document.removeEventListener("click", listenToggleOff)
    document.removeEventListener("keydown", listenEnter)
    loginpage.classList.toggle("hidepage", true)
    document.forms["registerform"]["nickname"].removeEventListener("input", namedebounce)
    document.forms["registerform"]["email"].removeEventListener("input", emaildebounce)

}

function listenEnter(e) {
    if (e.key !== "Enter") return
    if (e.target.parentElement.id === "logindiv") {
        const valid = Array(...document.forms['loginform']).every(input => input.checkValidity());
        if (valid) {//  login
            summitLogin()
        }
    } else if  (e.target.parentElement.id === "registerdiv") {
        if (CheckFormValidity("registerform")) {
            summitRegister()
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
        registerbt.setAttribute('type', "submit")
        e.preventDefault()
    } else {
        loginbt.setAttribute('type', 'button')
        if (CheckFormValidity("registerform")) {
            summitRegister()
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
        loginbt.setAttribute('type', 'submit')
        e.preventDefault()
    } else {
        registerbt.setAttribute('type', "button")
        const valid = Array(...document.forms['loginform']).every(input => input.checkValidity());
        if (valid) {// login
            summitLogin()
        }
    }
}

export function summitLogin() {
    const lform = document.forms["loginform"]
    console.log("LOGIN");
    RequestToGo.send(RequestToGo.OrderGo.GO_LOGIN_USER,
        lform["logincredential"].value,
        lform["password"].value,
        )
}

function summitRegister() {
    const rform = document.forms["registerform"]
    RequestToGo.send(RequestToGo.OrderGo.GO_CREATE_USER, 
        rform["nickname"].value,
        rform["email"].value,
        rform["lastName"].value,
        rform["firstName"].value,
        parseInt(rform["age"].value),
        rform["password"].value,
        )
}

export
function ErrCredential(type, formname) {
    /**
     * @type {HTMLFormElement}
     */
    const lform = document.forms["loginform"]
    const rform = document.forms["registerform"]
    switch (type+formname) {
        case "emailregister":
            rform["email"].setCustomValidity("Email already use.")
            break;
        case "nicknameregister":
            rform["nickname"].setCustomValidity("Nickname already use.")
            break;
        case "validregister":
            rform["nickname"].setCustomValidity("")
            rform["email"].setCustomValidity("")
            rform.submit()
            SwitchForm()
            break;
        case "credentiallogin":
            lform["logincredential"].setCustomValidity("User no exist.")
            break;
        case "passwordlogin":
            lform["password"].setCustomValidity("Wrong user or wrong password.")
            break;
        case "validlogin":
            HideLoginPage()
            lform.reset()
            break;
        default:
            console.error("ErrCredential err type")
            break;
    }
    

}

function debounce(func, delay) {
    let timeId;
    return function(...args) {
        if (timeId) {
            clearTimeout(timeId);
        }
        timeId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

function SwitchForm() {
    document.forms["loginform"]["logincredential"].value = document.forms["registerform"]["email"].value
    document.forms["loginform"]["password"].focus()
    registerdiv.classList.toggle("close", true)
    logindiv.classList.toggle("close", false)
}

function CheckFormValidity(formname) {
    return Array(...document.forms[formname]).every(input => input.checkValidity());
}