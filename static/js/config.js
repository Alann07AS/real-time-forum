var config = fetch("./static/json/config.json").then((p)=>p.json().then((v)=>v))

/**
 * 
 * @param {Function} func 
 */
export function getconfig(func) {
    config.then(
        (value) => {
            func(value)
        }
    )
}