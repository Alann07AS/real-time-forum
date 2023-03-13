package main

import (
	"net/http"

	"real-time-forum/pkg/config"
	"real-time-forum/pkg/datatbase"
	"real-time-forum/pkg/serverws"
)

var cfg *config.Config

func init() {
	config.GetConfig(&cfg)
	config.LoadConfig("config.json")
	datatbase.OpenDB()
}

func index(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	http.HandleFunc("/ws", serverws.Wsconnection)
	http.HandleFunc("/", index)
	http.ListenAndServe(cfg.Port, nil)
}
