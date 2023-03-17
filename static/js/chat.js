export function UpdateActivUser(users) {
    console.log("UPDATE ONLY USER");
    const userlist = document.getElementById("userlist")
    users.forEach((p)=>{
        const existuser = document.getElementById("chatuser_"+p.ID)
        let tmpl = `
        <p>${p.Nickname}</p>
        <p>${p.ID}</p>
        `
        if (existuser) {
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
}