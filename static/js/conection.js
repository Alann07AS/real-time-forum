import { GoRequest } from "./go_to_js.js";
import { RequestToGo } from "./js_to_go.js";



// connection() {
//     if (window["WebSocket"]) {
//         console.log("TryToConnect");
//         const conn = new WebSocket("ws://"+window.location.host+"/ws")
//         conn.onerror = (e)=>{
//             console.error(e);
//         }
//         conn.onclose = ()=>{
//             alert("CONNECTION CLOSE")
//             location.reload()       
//         }
//         conn.onmessage =
//             /**
//              * @param {MessageEvent} message 
//              */(message)=>{
//                 GoRequest.ReadGoRequest(message)
//                 console.log(message);
//             }
//         conn.onopen = ()=>{
//             RequestToGo.GoRequestInit = conn;
//             console.log("Sucessefull conect");
//         }
//     } else {
//         console.error("Your Brower is not Compatible with websocket")
//         document.body.innerText = "Your Brower is not Compatible with websocket"
//     }
// }

export function connection() {
    return new Promise((resolve, reject) => {
    if (window["WebSocket"]) {
        console.log("TryToConnect");
        const conn = new WebSocket("ws://" + window.location.host + "/ws");
        conn.onerror = (e) => {
            console.error(e);
            reject(e);
        };
        conn.onclose = () => {
            alert("CONNECTION CLOSE");
            location.reload();
        };
        conn.onmessage = (message) => {
            GoRequest.ReadGoRequest(message);
            console.log(message);
        };
        conn.onopen = () => {
            RequestToGo.GoRequestInit = conn;
            console.log("Sucessefull conect");
            resolve(conn);
        };
    } else {
        console.error("Your Brower is not Compatible with websocket");
        document.body.innerText = "Your Brower is not Compatible with websocket";
        reject("WebSocket not supported");
        }
    });
}
