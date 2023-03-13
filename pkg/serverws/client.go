package serverws

import (
	"fmt"

	"github.com/Alann07AS/DevTools/GO/errm"
	"github.com/gorilla/websocket"
)

type Client struct {
	UserId int64
	Conn   websocket.Conn
	Hub    *Hub
}

func (c *Client) Send(data []byte) {
	err := c.Conn.WriteMessage(websocket.TextMessage, data)
	errm.LogErr(err)
}

func (c *Client) Read() {
	defer func() { c.Hub.Unregister <- c; c.Conn.Close() }()
	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			errm.LogErr(err)
			return
		}
		fmt.Println("m", message) // mesasge exec ___________________________________
	}
}
