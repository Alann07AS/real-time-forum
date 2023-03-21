import { getconfig } from "./config.js";
import { GetCookie } from "./cookies.js";
import { FocusChats as openchat } from "./forumpage.js";
import { RequestToGo } from "./js_to_go.js";

var activefromid = 0
export function UpdateActivUser(users) {
    const userlist = document.getElementById("userlist")
    setTimeout(() => {
        // Convertit la NodeList en tableau pour pouvoir utiliser la méthode sort()
        const divArray = Array.from(userlist.childNodes);

        // Trie le tableau en fonction du contenu textuel des div
        divArray.sort((a, b) => {
            const Aid = (a.id.split("_")[1])
            const Bid = (b.id.split("_")[1])
            const Ap = document.getElementById("user_"+Aid)
            const Bp = document.getElementById("user_"+Bid)
            const An = document.getElementById("usernotif_"+Aid)
            const Bn = document.getElementById("usernotif_"+Bid)
            const Aactif = Ap.classList.contains("active") 
            const Bactif = Bp.classList.contains("active")
            if (Aactif && !Bactif) return -1
            if (!Aactif && Bactif) return 1
            if (An.innerText > "0") return -1
            if (Bn.innerText > "0") return 1
            if (Ap.innerText[0] > Bp.innerText[0]) return 1
            if (Ap.innerText[0] < Bp.innerText[0]) return -1
            return 0
        });
        // Réinsère chaque div dans l'ordre trié
        divArray.forEach((div) => {
            userlist.appendChild(div);
        });
    }, 400);
    getconfig((config)=>{
        users.forEach((p)=>{
            if (GetCookie(config.Cookies.Nickname) === p.Nickname) return
            const existuser = document.getElementById("chatuser_"+p.ID)
            if (existuser) {
                const bt = document.getElementById(`user_${p.ID}`)
                if (typeof p.Actif === "boolean" ) {
                    bt.classList.toggle("active", p.Actif)
                    bt.classList.toggle("inactive", !p.Actif)
                }
                
                const usernotif = document.getElementById(`usernotif_${p.ID}`)
                usernotif.innerText = (typeof p.NotifNB === "number"?p.NotifNB:"")
                if (usernotif.innerText !== "" && activefromid === p.ID && !document.getElementById("chatbox").classList.contains("hidepage")) {
                    RequestToGo.send(RequestToGo.OrderGo.GO_CLEAR_MESSAGE_NOTIF, activefromid)
                }
                return
            }
            
            let tmpl = `
            <button id="signout">
                <div class="border-left"></div><div class="border-bottom"></div>
                <p class="btn-text" id="user_${p.ID}">${p.Nickname}<strong id="usernotif_${p.ID}">${typeof p.NotifNB === "number"?p.NotifNB:""}</strong></p>
            </button>
            `
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

                messages.addEventListener("scroll", (e)=>{
                    console.log(messages.scrollTop);
                    console.log(messages.getBoundingClientRect().height);
                    // if (this.scrollTop < 10) {
                    //     CallMessageFrom(activefromid, messages.children.length)
                    // }
                })
                
                const isDisplay = !chatbox.classList.contains("hidepage")
                
                const uid = parseInt(this.id.split("_")[1])
                if (isDisplay) {
                    if (activefromid == uid) {
                        openchat(false)
                        chatbox.classList.toggle("hidepage", true)
                        chats.classList.toggle("displaychatbox", false)
                        return
                    } else {
                        RequestToGo.send(RequestToGo.OrderGo.GO_CLEAR_MESSAGE_NOTIF, uid)
                        messages.innerHTML = ""
                        CallMessageFrom(uid, messages.children.length)
                    }
                } else {
                    RequestToGo.send(RequestToGo.OrderGo.GO_CLEAR_MESSAGE_NOTIF, uid)
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
    if (!document.getElementById("chats").classList.contains("chatsfocus")) {
        const notif = document.getElementById(`usernotif_${mess[0].FromID}`)
        notif.innerText = (parseInt(notif.innerText) | 0)+1
        return
    }
    getconfig((config)=>{
        if (!mess || (mess[0].FromID != activefromid && mess[0].From != GetCookie(config.Cookies.Nickname)) ) return
        const messages = document.getElementById("messages")
        mess.forEach(m => {
            const divm = document.createElement("div")
            divm.innerHTML = 
            `
                <div><p>${m.From}</p><p class="date">${m.Date}</p></div>
                <p>${m.Content}</p>
                <div class="horizontalsepbottom"></div>
            `
            messages.appendChild(divm)
        });
            // Convertit la NodeList en tableau pour pouvoir utiliser la méthode sort()
        const divArray = Array.from(messages.childNodes);

        // Trie le tableau en fonction du contenu textuel des div
        divArray.sort((a, b) => {
            const Adate = new Date(a.getElementsByClassName("date")[0].innerText)
            const Bdate = new Date(b.getElementsByClassName("date")[0].innerText)
            if (Adate > Bdate) return 1
            if (Adate < Bdate) return -1
            return 0
        });
        // Réinsère chaque div dans l'ordre trié
        divArray.forEach((div) => {
            messages.appendChild(div);
        });
    })

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