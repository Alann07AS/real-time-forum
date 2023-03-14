package serverws

import (
	"fmt"
	"net/http"

	"real-time-forum/pkg/config"
	"real-time-forum/pkg/datatbase"

	"github.com/Alann07AS/DevTools/GO/errm"
	"github.com/gorilla/websocket"
)

var cfg *config.Config

func init() {
	config.GetConfig(&cfg)
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

	// debut de creation de client
	client := &Client{Conn: conn}
	defer func() { go client.Listen() }()

	// verifie si cette utilisateur posséde une session
	cksession, errs := r.Cookie(cfg.Cookies.Session)
	errm.LogErr(errs)
	cknickname, errn := r.Cookie(cfg.Cookies.Nickname)
	errm.LogErr(errn)

	if errs != nil || errn != nil {
		// la perssone n'as pas etre identifier
		loginHub.Register <- client
		return
	}

	// verifie si cette session est présente en base de donner
	uid := datatbase.GetUserIdBySession(cksession.Value, cknickname.Value)
	if !(uid > 0) {
		// la perssone n'as pas etre identifier
		loginHub.Register <- client
		return
	}

	// la perssone est identifier
	client.UserId = uid
	forumHub.Register <- client
	fmt.Println("exits")
}
