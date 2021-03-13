package main

import (
	"net/http"

	"github.com/AlexanderBrese/gorro/pkg/model"
)

var (
	pageTemplates = &PageTemplates{
		home: "home.page.html",
	}
	partialTemplates = &PartialTemplates{
		session: "continue.partial.html",
	}
)

type PageTemplates struct {
	home string
}

type PartialTemplates struct {
	session string
}

type RouteHandling struct {
	render *Rendering
	user   *model.User
}

func NewRouteHandling(r *Rendering, u *model.User) *RouteHandling {
	return &RouteHandling{
		render: r,
		user:   u,
	}
}

func (h *RouteHandling) home(w http.ResponseWriter, r *http.Request) {
	cfg := &RenderingConfiguration{
		request:        r,
		responseWriter: w,
		templateName:   pageTemplates.home,
		templateData: &TemplateData{
			User: h.user,
		},
	}
	h.render.start(cfg)
}

func (h *RouteHandling) ping(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("OK"))
}

func (h *RouteHandling) newSession(w http.ResponseWriter, r *http.Request) {
	h.user.NewSession()
	// Store a new session
	cfg := &RenderingConfiguration{
		request:        r,
		responseWriter: w,
		templateName:   partialTemplates.session,
		templateData: &TemplateData{
			User: h.user,
		},
	}
	h.render.start(cfg)
}
