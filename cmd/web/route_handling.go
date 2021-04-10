package main

import (
	"errors"
	"net/http"

	"github.com/AlexanderBrese/goro/pkg/model"
)

var (
	pageTemplates = &PageTemplates{
		home:       "home.page.html",
		statistics: "statistics.page.html",
		settings:   "settings.page.html",
	}
	/*
		partialTemplates = &PartialTemplates{
			newSession: "new_session.partial.html",
		}
	*/
)

type PageTemplates struct {
	home       string
	statistics string
	settings   string
}

/*
type PartialTemplates struct {
	newSession string
}
*/

type RouteHandling struct {
	rendering *Rendering
	log       *Logging
}

func NewRouteHandling(r *Rendering, l *Logging) *RouteHandling {
	return &RouteHandling{
		rendering: r,
		log:       l,
	}
}

func (h *RouteHandling) home(w http.ResponseWriter, r *http.Request) {
	h.handle(w, PageTemplateData(pageTemplates.home))
}

func (h *RouteHandling) settings(w http.ResponseWriter, r *http.Request) {
	h.handle(w, PageTemplateData(pageTemplates.settings))
}

func (h *RouteHandling) statistics(w http.ResponseWriter, r *http.Request) {
	h.handleWithUser(w, r, pageTemplates.statistics)
}

func (h *RouteHandling) ping(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("OK"))
}

func (h *RouteHandling) handleWithUser(w http.ResponseWriter, r *http.Request, name string) {
	user, err := h.user(w, r)
	if err != nil {
		return
	}

	h.handle(w, UserTemplateData(name, user))
}

func (h *RouteHandling) handle(w http.ResponseWriter, templateData *TemplateData) {
	res, err := h.rendering.start(templateData)
	if err != nil {
		h.log.logServerError(w, err)
	}

	w.Header().Set("Content-Type", "text/html")
	if _, err := w.Write(res); err != nil {
		h.log.logServerError(w, err)
	}
}

func (h *RouteHandling) user(w http.ResponseWriter, r *http.Request) (*model.User, error) {
	var user *model.User
	if err := NewRequestDecoding(r).Json(&user); err != nil {
		var clientError *ClientError
		switch {
		case errors.As(err, &clientError):
			h.log.logClientError(w, clientError)
		default:
			h.log.logServerError(w, err)
		}
		return nil, err
	}

	return user, nil
}
