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

}