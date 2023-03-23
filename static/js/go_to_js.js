import { Addmessage, UpdateActivUser, ToggleIsWriting } from "./chat.js";
import { getconfig } from "./config.js";
import { SetCookie } from "./cookies.js";
import { GetComments, ShowForumPage, UpdatePcatego, UpdatePosts } from "./forumpage.js";
import { ErrCredential, ShowLoginPage } from "./loginpage.js";

export 

class GoRequest {
    static ReadGoRequest = (message)=>{
        let messages = message.data.split("\n")
        messages.forEach(order => {
            const request = JSON.parse(order);
            if (request.Params === null) request.Params = [];
            GoRequest.exec(request)
        });

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
	static JS_UPDATE_CAT            = 5
	static JS_UPDATE_POST           = 6
	static JS_UPDATE_USER           = 7
    static JS_ADD_MESSAGE           = 8
    static JS_ADD_MESSAGE           = 8
    static JS_TOGGLE_IS_WRITING     = 9
    static JS_GET_COMMENTS          = 10

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

OrderJS.setFunc(OrderJS.JS_UPDATE_CAT, (...params)=>{
    UpdatePcatego(params[0])
})

OrderJS.setFunc(OrderJS.JS_UPDATE_POST, (...params)=>{
    UpdatePosts(params[0])
})

OrderJS.setFunc(OrderJS.JS_UPDATE_USER, (...params)=>{
    UpdateActivUser(params[0])
})

OrderJS.setFunc(OrderJS.JS_ADD_MESSAGE, (...params)=>{
    Addmessage(params[0])
})

OrderJS.setFunc(OrderJS.JS_TOGGLE_IS_WRITING, (...params)=>{
    ToggleIsWriting(params[0])
})

OrderJS.setFunc(OrderJS.JS_GET_COMMENTS, (...params)=>{
    GetComments(params[0], (params[1]||[]))
})
