import * as logpage from "./loginpage.js";
import * as websocket from "./conection.js";
import { getconfig } from "./config.js";
import { GetCookie } from "./cookies.js";
import { RequestToGo } from "./js_to_go.js";

window.onload = ()=>{
    websocket.connection().then((c)=>{ // init websocket connection
        getconfig((config)=> {
            const session = GetCookie(config.Cookies.Session) // get uuid
            const nickname = GetCookie(config.Cookies.Nickname) // and nickname
            if (session && nickname) { // check if cookies exist
                RequestToGo.send(RequestToGo.OrderGo.GO_CHECK_USER_STATUS, session, nickname) // if cookie exist check cookie validity, go will answer display login or forum page
            } else {
                logpage.ShowLoginPage() // default display login page
            }
        })
    }) 
}
