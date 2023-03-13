package serverws

// mon hub d'acceuil et mon hub pour les client connecter
var loginHub, forumHub = NewHub(), NewHub()

type Hub struct {
	Clients    map[*Client]bool
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan []byte
}

func NewHub() *Hub {
	return &Hub{map[*Client]bool{}, make(chan *Client), make(chan *Client), make(chan []byte)}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true
		case client := <-h.Unregister:
			delete(h.Clients, client)
		case data := <-h.Broadcast:
			for c := range h.Clients {
				c.Send(data)
			}
		}
	}
}
