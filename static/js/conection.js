import { RequestToGo } from "./js_to_go.js";

export function

connection() {
    if (window["WebSocket"]) {
        console.log("TryToConnect");
        const conn = new WebSocket("ws://"+window.location.host+"/ws")
        console.log(conn);
        conn.onerror = (e)=>{
            console.error(e);
        }
        conn.onclose = ()=>{
            alert("CONNECTION CLOSE")
            location.reload()       
        }
        conn.onmessage =
            /**
             * @param {MessageEvent} evt 
             */(evt)=>{
                console.log(evt.data);
                const incomingorder = JSON.parse(evt.data);
                if (incomingorder.Params === null) incomingorder.Params = [];
                actionJS.actions.get(incomingorder.Instruction)(...incomingorder.Params);
            }
        conn.onopen = ()=>{
            RequestToGo.GoRequestInit = conn;
            console.log("Sucessefull conect");
        }
    } else {
        console.error("Your Brower is not Compatible with websocket")
        document.body.innerText = "Your Brower is not Compatible with websocket"
    }
}