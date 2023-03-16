import { getconfig } from "./config.js"
import { GetCookie } from "./cookies.js"
import { RequestToGo } from "./js_to_go.js"
import { HideLoginPage as hideLogPage } from "./loginpage.js"

const listecreate = ()=>{FocusCreate()}

export function ShowForumPage() {
    hideLogPage()
    document.getElementById("forliv").classList.toggle("hidepage", false)
    document.getElementById("signout").addEventListener("click", LogOut)
    document.getElementById("createpostbt").addEventListener("click", listecreate)
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

function FocusChats(force = undefined) {
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