export 

/**
 * Envoyer un ordre au serveurgo
 * A BESOIN D'INITIER SON OBJET "conn"
 */
class RequestToGo {
    /**
     * @type {WebSocket}
     */
    static conn

    /**
     * @param {WebSocket} conn
     * set la connection 
     */
    static set GoRequestInit(conn) {RequestToGo.conn = conn}

    /**
     * @param {OrderGo} order 
     * @param {Any} params 
     */
    static send(order, ...params) {
        const request = {
            Order: order,
            Params: params
        }
        RequestToGo.conn.send(JSON.stringify(request))
    }
    
    static get OrderGo() {return OrderGo}
}


// la standardisation des ordre go
class OrderGo {
    static GO_CREATE_USER = 1
    static GO_CHECK_USER_EXIST = 2
    static GO_LOGIN_USER = 3
    static GO_CHECK_USER_STATUS = 4
}
