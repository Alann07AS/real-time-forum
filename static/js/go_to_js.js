import { getconfig } from "./config.js";
import { SetCookie } from "./cookies.js";
import { ShowForumPage } from "./forumpage.js";
import { ErrCredential, ShowLoginPage } from "./loginpage.js";

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
    static JS_SHOW_LOGIN            = 3
	static JS_SHOW_FORUM            = 4

}

OrderJS.setFunc(OrderJS.JS_ERR_CREDENTIAL, (...params)=>{
    ErrCredential(params[0], params[1])
})

OrderJS.setFunc(OrderJS.JS_CREATE_SESSION_COOKIE, (...params)=>{
    getconfig((config)=>{
        var expire = new Date()
        expire.setTime(expire.getTime() + config.Cookies.Expiration * 1000 * 60)
        SetCookie(config.Cookies.Session, params[0], expire) // param 0 UUID
        SetCookie(config.Cookies.Nickname, params[1], expire) // param 1 Nicname
    })
})

OrderJS.setFunc(OrderJS.JS_SHOW_FORUM, (...params)=>{
    ShowForumPage()
})

OrderJS.setFunc(OrderJS.JS_SHOW_LOGIN, (...params)=>{
    ShowLoginPage()
})