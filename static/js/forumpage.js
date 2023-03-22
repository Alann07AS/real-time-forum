import { getconfig } from "./config.js"
import { GetCookie } from "./cookies.js"
import { GoRequest } from "./go_to_js.js"
import { RequestToGo } from "./js_to_go.js"
import { HideLoginPage as hideLogPage } from "./loginpage.js"

const listecreate = ()=>{FocusCreate()}

export function ShowForumPage() {
    hideLogPage()
    getconfig((config)=> document.getElementById("username").innerText = GetCookie(config.Cookies.Nickname))
    document.getElementById("forliv").classList.toggle("hidepage", false)
    document.getElementById("signout").addEventListener("click", LogOut)
    document.getElementById("createpostbt").addEventListener("click", listecreate)
    // document.getElementById("summitpostbt").addEventListener("click", )
    // document.getElementById("summitpostbt").removeEventListener("click", )
}

export function HideForumPage() {
    document.getElementById("forliv").classList.toggle("hidepage", true)
    document.getElementById("signout").removeEventListener("click", LogOut)
    document.getElementById("createpostbt").removeEventListener("click", listecreate)
}

function LogOut() {
    getconfig((config)=>{
        RequestToGo.send(RequestToGo.OrderGo.GO_LOGOUT_USER, GetCookie(config.Cookies.Session), GetCookie(config.Cookies.Nickname))
    })
}

export function FocusChats(force = undefined) {
    const posts = document.getElementById("posts")
    const createpost = document.getElementById("createpost")
    const filters = document.getElementById("filters")
    const chats = document.getElementById("chats")
    posts.classList.toggle("postsunfocus", force)
    chats.classList.toggle("chatsfocus", force)
    createpost.classList.toggle("unfocuschat", force)
    filters.classList.toggle("unfocuschat", force)
}

function FocusCreate(force = undefined) {
    const posts = document.getElementById("posts")
    const createpost = document.getElementById("createpost")
    const filters = document.getElementById("filters")
    const chats = document.getElementById("chats")
    const createform = document.getElementById("createform")
    createform.classList.toggle("hidepage", force)
    createpost.classList.toggle("createfocus", force)
    chats.classList.toggle("unfocuscreate", force)
    filters.classList.toggle("unfocuscreate", force)
    posts.classList.toggle("postsunfocus", force)
}

export function UpdatePcatego(cats) {
    const pcatego = document.getElementById("pcatego")
    pcatego.innerHTML = ""
    cats.forEach((name)=>{
        let tmplCatego = `
        <label for="input${name}">${name}</label>
        <input type="checkbox" name="input${name}" id="input${name}" value="${name}">
        `
        pcatego.innerHTML += tmplCatego
    })
}

document.addEventListener("keydown", (e)=>{
    if (e.key === "p") CreatePost()
})

function CreatePost() {
    const f = document.forms["createform"]
    const title = f["ptitle"].value
    const content = f["pcontent"].value
    const catego = []
    Array(...document.getElementById("pcatego").children).forEach((v)=>{
        if (v.value !== undefined && v.checked) catego.push(v.value)
    })
    //title content categos
    console.log(RequestToGo.OrderGo.GO_CREATE_POST, title, content,  catego);
    RequestToGo.send(RequestToGo.OrderGo.GO_CREATE_POST, title, content,  catego)
}

export function UpdatePosts(posts) {
    const postsdiv = document.getElementById("posts")
    posts.forEach((p)=>{
        const existpost = document.getElementById("post_"+p.ID)
        let tmpl = `
        <p>${p.Title}</p>
        <p>${p.Username}</p>
        <p>${p.Content}</p>
        <div class="horizontalsepbottom"></div>
        `
        if (existpost) {
            existpost.innerHTML = tmpl
            return
        }
        const newdivpost = document.createElement("div")
        newdivpost.classList.add("classpost")
        newdivpost.id = "post_"+p.ID
        newdivpost.innerHTML += tmpl
        postsdiv.appendChild(newdivpost)
    })
}