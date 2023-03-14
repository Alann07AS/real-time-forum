import * as logpage from "./loginpage.js";
import * as websocket from "./conection.js";
import { config } from "./config.js";

window.onload = ()=>{

    console.log(config);

    websocket.connection()

    if (false) { //si connecter
        //afficher forum
    } else {
        logpage.ShowLoginPage()
    }

}
