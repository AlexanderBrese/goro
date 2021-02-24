package main

import (
	"net/http"

	"github.com/bmizerany/pat"
)

func (app *Application) routes() http.Handler {
	fileServer := getFileServer(app.webServerConfig.StaticDir)
	mux := pat.New()

	mux.Get("/", http.HandlerFunc(app.homeHandler))
	mux.Get("/ping", http.HandlerFunc(http.HandlerFunc(ping)))
	mux.Get("/static/", http.StripPrefix("/static", fileServer))

	return http.HandlerFunc(mux.ServeHTTP)
}

func getFileServer(staticDir string) http.Handler {
	return http.FileServer(http.Dir(staticDir))
}
