package main

import (
	"net/http"
)

func greet(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	http.HandleFunc("/", greet)
	http.ListenAndServe(":8080", nil)
}
