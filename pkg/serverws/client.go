package serverws

import (
	"github.com/Alann07AS/DevTools/GO/errm"
	"github.com/gorilla/websocket"
)

type Client struct {
	UserId int64
	Conn   *websocket.Conn
	Hub    *Hub
}

func (c *Client) Send(data []byte) {
	err := c.Conn.WriteMessage(websocket.TextMessage, data)
	errm.LogErr(err)
}

func (c *Client) Listen() {
	defer func() {
		c.Hub.Unregister <- c
	}() // c.Conn.Close()
	for {
		_, data, err := c.Conn.ReadMessage()
		if err != nil {
			errm.LogErr(err)
			return
		}
		ParseMessageFromJs(data, c).Exec()
	}
}

func (c *Client) SwitchHub(h *Hub) {
	c.Hub.Unregister <- c
	h.Register <- c
}
