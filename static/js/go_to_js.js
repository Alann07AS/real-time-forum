import { SetCookie } from "./cookies.js";
import { ErrCredential } from "./loginpage.js";

export 

class GoRequest {
    static ReadGoRequest = (message)=>{
        const request = JSON.parse(message.data);
        if (request.Params === null) request.Params = [];
        GoRequest.exec(request)
    }

    static exec(request) {
        OrderJS.getFunc(request.Order)(...request.Params)
    }
}

export 

class OrderJS {
    static getFunc (name) {
        return OrderJS.funcs.get(name)
    }

    static funcs = new Map()

    static setFunc (name, func) {
        OrderJS.funcs.set(name, func)
    }
    static JS_ERR_CREDENTIAL = 1
    static JS_CREATE_SESSION_COOKIE = 2
}

OrderJS.setFunc(OrderJS.JS_ERR_CREDENTIAL, (...params)=>{
    ErrCredential(params[0], params[1])
})

OrderJS.setFunc(OrderJS.JS_CREATE_SESSION_COOKIE, (...params)=>{
})
