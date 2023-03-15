import { getconfig } from "./config.js";

// Fonction pour écrire un cookie
export function SetCookie(name, value, date) {
    var expires = "";
    if (date) {
        date.setTime(date);
        expires = "; expires=" + date.toUTCString();
    }
    console.log(name, value, date);
    document.cookie = name + "=" + (value || "")  + expires + "; SameSite=Strict;";
}

// Fonction pour lire un cookie
export function GetCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export function SetSessionTimeOut() {
    getconfig((config)=> {
        var cookies = document.cookie.split(";");
        var sessionExpiration = cookies.find(cookie => cookie.trim().startsWith(config.Cookies.Session+"="));
        if (sessionExpiration) {
            sessionExpiration = sessionExpiration.substring("sessionExpiration=".length).trim();
            var timeRemaining = getTimeRemaining(sessionExpiration);
            console.log("Il reste " + timeRemaining + " millisecondes avant l'expiration de la session.");
        
    })
}

function getTimeRemaining(expirationDate) {
    var timeRemaining = Date.parse(expirationDate) - Date.now();
    if (timeRemaining < 0) {
        timeRemaining = 0;
    }
    return timeRemaining;
}