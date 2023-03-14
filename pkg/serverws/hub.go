package serverws

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

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			client.Hub = h
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
