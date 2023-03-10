export function

connection() {
    console.log("TryToConnect");

    if (window["WebSocket"]) {
        
    } else {
        console.error("Your Brower is not Compatible with websocket")
        document.body.innerText = "Your Brower is not Compatible with websocket"
    }
}