package serverws

import (
	"time"

	"real-time-forum/pkg/datatbase"
)

// mon hub d'acceuil et mon hub pour les client connecter
var loginHub, forumHub = NewHub(), NewHub()

func init() {
	forumHub.ListenRegister(debouncupdateconection)
	forumHub.ListenUnregister(debouncupdateconection)
	go loginHub.Run()
	go forumHub.Run()
}

type Hub struct {
	Clients      map[*Client]bool
	Register     chan *Client
	Unregister   chan *Client
	Broadcast    chan []byte
	OnRegister   func(c *Client)
	OnUnregister func(c *Client)
}

func NewHub() *Hub {
	return &Hub{map[*Client]bool{}, make(chan *Client, 1), make(chan *Client, 1), make(chan []byte, 1024), func(c *Client) {}, func(c *Client) {}}
}

func Debounce(f func(c *Client), s time.Duration) func(*Client) {
	var timer *time.Timer
	return func(c *Client) {
		go func() {
			if timer == nil || !timer.Reset(time.Microsecond*0) {
				timer = time.AfterFunc(s, func() { f(c); timer = nil })
			}
		}()
	}
}

var debouncupdateconection = Debounce(func(c *Client) {
	users := datatbase.GetUser()
	for _, u := range users {
		u["Actif"] = forumHub.CheckUserActif(u["ID"].(int64))
	}
	for _, u := range users {
		for _, u2 := range users {
			u2["LastDate"] = datatbase.GetMostRecentNotifFrom(u2["ID"].(int64), u["ID"].(int64))
			u2["NotifNB"] = datatbase.GetNumberNotifFrom(u2["ID"].(int64), u["ID"].(int64))
		}
		if uuu := forumHub.GetClientById(u["ID"].(int64)); uuu != nil {
			uuu.Send(CreateMessageToJs(JS_UPDATE_USER, users).Byte())
		}
	}
}, time.Millisecond*1)

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			client.Hub = h
			h.Clients[client] = true
			h.OnRegister(client)
		case client := <-h.Unregister:
			delete(h.Clients, client)
			h.OnUnregister(client)
		case data := <-h.Broadcast:
			for c := range h.Clients {
				c.Send(data)
			}
		}
	}
}

func (h *Hub) ListenRegister(f func(c *Client)) {
	h.OnRegister = f
}

func (h *Hub) ListenUnregister(f func(c *Client)) {
	h.OnUnregister = f
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
