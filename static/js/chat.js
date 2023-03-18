import { getconfig } from "./config.js";
import { GetCookie } from "./cookies.js";

export function UpdateActivUser(users) {
    console.log("UPDATE ONLY USER", users);
    const userlist = document.getElementById("userlist")
    getconfig((config)=>{
        users.forEach((p)=>{
            if (GetCookie(config.Cookies.Nickname) === p.Nickname) return
            const existuser = document.getElementById("chatuser_"+p.ID)
            let tmpl = `
            <p>${p.Nickname}</p>
            <p>${p.ID}</p>
            `
            if (existuser) {
                console.log("update", users);
                existuser.innerHTML = tmpl
                existuser.classList.toggle("active", p.Actif)
                existuser.classList.toggle("inactive", !p.Actif)
                return
            }
            const newdivuser = document.createElement("div")
            newdivuser.classList.add("classuser")
            newdivuser.classList.toggle("active", p.Actif)
            newdivuser.classList.toggle("inactive", !p.Actif)
            newdivuser.id = "chatuser_"+p.ID
            newdivuser.innerHTML += tmpl
            userlist.appendChild(newdivuser)
        })
    })
}