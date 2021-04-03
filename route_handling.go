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
		session: "session.partial.html",
	}
)

type PageTemplates struct {
	home string
}

type PartialTemplates struct {
	session string
}

type RouteHandling struct {
	rendering *Rendering
	user      *model.User
}

func NewRouteHandling(r *Rendering, u *model.User) *RouteHandling {
	return &RouteHandling{
		rendering: r,
		user:      u,
	}
}

func (h *RouteHandling) home(w http.ResponseWriter, r *http.Request) {
	h.render(w, r, pageTemplates.home)
}

func (h *RouteHandling) newSession(w http.ResponseWriter, r *http.Request) {
	h.user.NewSession()

	h.render(w, r, partialTemplates.session)
}

func (h *RouteHandling) ping(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("OK"))
}

func (h *RouteHandling) render(w http.ResponseWriter, r *http.Request, templateName string) {
	cfg := &RenderingConfiguration{
		request:        r,
		responseWriter: w,
		templateName:   templateName,
		templateData: &TemplateData{
			User: h.user,
		},
	}
	h.rendering.start(cfg)
}
