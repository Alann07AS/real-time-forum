package serverws

import (
	"fmt"
	"time"

	"real-time-forum/pkg/datatbase"
)

// mon hub d'acceuil et mon hub pour les client connecter
var loginHub, forumHub = NewHub(), NewHub()

func init() {
	go loginHub.Run()
	go forumHub.Run()
}

type Hub struct {
	Clients    map[*Client]bool
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan []byte
}

func NewHub() *Hub {
	return &Hub{map[*Client]bool{}, make(chan *Client, 1), make(chan *Client, 1), make(chan []byte, 1024)}
}

var debouncupdateconection = Debounce(func() {
	go func() {
		users := datatbase.GetUser()
		for _, u := range users {
			u["Actif"] = forumHub.CheckUserActif(u["ID"].(int64))
		}
		fmt.Println(users)
		forumHub.Broadcast <- CreateMessageToJs(JS_UPDATE_USER, users).Byte()
	}()
}, time.Millisecond*300)

func Debounce(f func(), s time.Duration) func() {
	var timer *time.Timer
	return func() {
		if timer == nil || !timer.Reset(time.Microsecond*0) {
			timer = time.AfterFunc(s, func() { f(); timer = nil })
		}
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			client.Hub = h
			h.Clients[client] = true
			debouncupdateconection()
		case client := <-h.Unregister:
			debouncupdateconection()
			delete(h.Clients, client)
		case data := <-h.Broadcast:
			for c := range h.Clients {
				c.Send(data)
			}
		}
	}
}

func (h *Hub) CheckUserActif(uid int64) bool {
	for c := range h.Clients {
		if c.UserId == uid {
			return true
		}
	}
	return false
}

func (h *Hub) GetClientById(uid int64) *Client {
	for c := range h.Clients {
		if c.UserId == uid {
			return c
		}
	}
	return nil
}
