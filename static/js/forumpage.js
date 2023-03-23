import { debounceIsWriting } from "./chat.js"
import { getconfig } from "./config.js"
import { GetCookie } from "./cookies.js"
import { RequestToGo } from "./js_to_go.js"
import { HideLoginPage as hideLogPage } from "./loginpage.js"

const listecreate = ()=>{FocusCreate()}

export function ShowForumPage() {
    hideLogPage()
    getconfig((config)=> document.getElementById("username").innerText = GetCookie(config.Cookies.Nickname))
    document.getElementById("forliv").classList.toggle("hidepage", false)
    document.getElementById("signout").addEventListener("click", LogOut)
    document.getElementById("createpostbt").addEventListener("click", listecreate)
    document.getElementById("summitpostbt").addEventListener("click", CreatePost)
    document.getElementById("inputmessage").addEventListener("input", debounceIsWriting)
}

export function HideForumPage() {
    document.getElementById("forliv").classList.toggle("hidepage", true)
    document.getElementById("signout").removeEventListener("click", LogOut)
    document.getElementById("createpostbt").removeEventListener("click", listecreate)
    document.getElementById("summitpostbt").removeEventListener("click", CreatePost)
    document.getElementById("inputmessage").removeEventListener("input", debounceIsWriting)
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
        <div id="${"postcomments_"+p.ID}" class="comments">

        </div>
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
        newdivpost.addEventListener("click",()=>{
        if (newdivpost.classList.toggle("openpost")) {
            RequestToGo.send(RequestToGo.OrderGo.GO_GET_COMMENTS, parseInt(p.ID))
        } else {
            document.getElementById("postcomments_"+p.ID).innerHTML = ""
        }
        })
        postsdiv.appendChild(newdivpost)
    })
}

export function GetComments(id, comms) {
    console.log(id, comms);
    const comments = document.getElementById("postcomments_"+id)
    comms.forEach(c => {
        const cdiv = document.createElement("div")
        const tmpl = 
        `
        <p>${c.Username}</p>
        <p>${c.Content}</p>
        `
        cdiv.innerHTML = tmpl
        comments.appendChild(cdiv)
    });
}