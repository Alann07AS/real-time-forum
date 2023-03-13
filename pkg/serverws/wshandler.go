package serverws

import (
	"fmt"
	"net/http"

	"real-time-forum/pkg/config"

	"github.com/Alann07AS/DevTools/GO/errm"
	"github.com/gorilla/websocket"
)

var cfg *config.Config

func init() {
	cfg = config.GetConfig()
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// connection du client
func Wsconnection(w http.ResponseWriter, r *http.Request) {
	// etablir la connection
	conn, err := upgrader.Upgrade(w, r, nil)
	errm.LogErr(err)

	// verifie si cette utilisateur posséde une session
	ckcookie, err := r.Cookie(cfg.Cookies.Session)
	errm.LogErr(err)
	// verifie si cette session est présente en base de donner

	fmt.Println("", conn, ckcookie) // enrobage  client
}
