package main

import (
	"net/http"
	"regexp"

	"github.com/bmizerany/pat"
)

type Routes struct {
	home       string
	statistics string
	settings   string

	alive string
	files string
}

var routes = &Routes{
	home:       "/",
	statistics: "/statistics",
	settings:   "/settings",

	alive: "/ping",
	files: "/static/",
}

type Routing struct {
	handling *RouteHandling
	config   *Configuration
}

func NewRouting(h *RouteHandling, cfg *Configuration) *Routing {
	return &Routing{
		handling: h,
		config:   cfg,
	}
}

func (r *Routing) routes() http.Handler {
	router := pat.New()

	router.NotFound = http.HandlerFunc(r.handling.notFound)

	router.Get(routes.home, http.HandlerFunc(r.handling.home))
	router.Get(routes.settings, http.HandlerFunc(r.handling.settings))
	router.Post(routes.statistics, http.HandlerFunc(r.handling.statistics))

	router.Get(routes.alive, http.HandlerFunc(r.handling.ping))
	router.Get(routes.files, fileServer(http.StripPrefix(routes.files, http.FileServer(http.Dir(r.config.StaticPath)))))

	return http.HandlerFunc(router.ServeHTTP)
}

var (
	js  = regexp.MustCompile("\\.js$")
	css = regexp.MustCompile("\\.css$")
)

// TODO: refactor into class
func fileServer(h http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uri := r.RequestURI
		if js.MatchString(uri) {
			w.Header().Set("Content-Type", "text/javascript")
		} else if css.MatchString(uri) {
			w.Header().Set("Content-Type", "text/css")
		}
		h.ServeHTTP(w, r)
	}
}
