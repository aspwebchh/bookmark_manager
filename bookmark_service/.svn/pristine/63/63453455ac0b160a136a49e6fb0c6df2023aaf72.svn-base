package main

import (
	"./web"
	"net/http"
)

func main() {
	http.Handle("/log/", http.FileServer(http.Dir(".")))
	http.Handle("/bookmark", new(web.Bookmark))
	http.ListenAndServe(":9528",nil)
}
