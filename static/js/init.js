import * as logpage from "./loginpage.js";
import * as websocket from "./conection.js";

window.onload = ()=>{

    websocket.connection()

    logpage.ShowLoginPage()

}
