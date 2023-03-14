export var config

fetch("./init.js")
.then((response) => console.log(response.text().then((t) => {console.log(t)})))