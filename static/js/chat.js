import { getconfig } from "./config.js";
import { GetCookie } from "./cookies.js";
import { FocusChats as openchat } from "./forumpage.js";
import { RequestToGo } from "./js_to_go.js";

var activefromid = 0
export function UpdateActivUser(users) {
    const userlist = document.getElementById("userlist")
    getconfig((config)=>{
        users.forEach((p)=>{
            if (GetCookie(config.Cookies.Nickname) === p.Nickname) return
            const existuser = document.getElementById("chatuser_"+p.ID)
            let tmpl = `
            <button id="signout">
                <div class="border-left"></div><div class="border-bottom"></div>
                <p class="btn-text" id="user_${p.ID}">${p.Nickname}</p>
            </button>
            `

            if (existuser) {
                // existuser.innerHTML = tmpl
                const bt = document.getElementById(`user_${p.ID}`)
                bt.classList.toggle("active", p.Actif)
                bt.classList.toggle("inactive", !p.Actif)
                return
            }
            const newdivuser = document.createElement("div")
            newdivuser.innerHTML += tmpl
            newdivuser.classList.add("classuser")
            newdivuser.id = "chatuser_"+p.ID
            userlist.appendChild(newdivuser)
            const bt = document.getElementById(`user_${p.ID}`)
            bt.classList.toggle("active", p.Actif)
            bt.classList.toggle("inactive", !p.Actif)
            bt.addEventListener("click", function () {
                console.log("CLICK");
                const chatbox = document.getElementById("chatbox")
                const chats = document.getElementById("chats")
                const messages = document.getElementById("messages")
                
                const isDisplay = !chatbox.classList.contains("hidepage")
                
                const uid = parseInt(this.id.split("_")[1])
                if (isDisplay) {
                    if (activefromid == uid) {
                        openchat(false)
                        chatbox.classList.toggle("hidepage", true)
                        chats.classList.toggle("displaychatbox", false)
                        return
                    } else {
                        messages.innerHTML = ""
                        CallMessageFrom(uid, messages.children.length)
                    }
                } else {
                    messages.innerHTML = ""
                    CallMessageFrom(uid, messages.children.length)
                    openchat(true)
                    chatbox.classList.toggle("hidepage", false)
                    chats.classList.toggle("displaychatbox", true)
                }
                activefromid = uid
            })
        })
    })
}

export function Addmessage(mess) {
    if (!mess) return
    const messages = document.getElementById("messages")
    mess.forEach(m => {
        const divm = document.createElement("div")
        divm.innerHTML = 
        `
            <div><p>${m.From}</p><p>${m.Date}</p></div>
            <p>${m.Content}</p>
            <div class="horizontalsepbottom"></div>
        `
        messages.appendChild(divm)
    });
}

function CallMessageFrom(from, ofset) {
    RequestToGo.send(RequestToGo.OrderGo.GO_GET_MESSAGE_FROM, from, ofset)
}

function SendMessateTo() {
    const content = document.getElementById("inputmessage").value
    if (!activefromid || !content) return
    RequestToGo.send(RequestToGo.OrderGo.GO_SEND_MESSAGE_TO, activefromid, content)
    
}

document.getElementById("send_message").addEventListener("click", ()=>{
    SendMessateTo()
})