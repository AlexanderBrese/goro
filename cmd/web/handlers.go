package main

import (
	"bytes"
	"fmt"
	"net/http"
	"time"
)

type RenderConfig struct {
	request        *http.Request
	responseWriter http.ResponseWriter
	templateName   string
	templateData   *TemplateData
}

func (app *Application) homeHandler(w http.ResponseWriter, r *http.Request) {
	cfg := RenderConfig{
		request:        r,
		responseWriter: w,
		templateName:   "home.page.html",
	}

	app.render(cfg)
}

func (app *Application) defaultTemplateData(td *TemplateData, r *http.Request) *TemplateData {
	if td == nil {
		td = new(TemplateData)
	}

	td.Flash = ""
	td.CurrentYear = time.Now().Year()
	return td
}

func (app *Application) render(r RenderConfig) {
	ts, ok := app.templateCache[r.templateName]
	if !ok {
		app.tracedServerError(r.responseWriter, fmt.Errorf("The template %s does not exist", r.templateName))
		return
	}

	buf := new(bytes.Buffer)

	err := ts.Execute(buf, app.defaultTemplateData(r.templateData, r.request))
	if err != nil {
		app.tracedServerError(r.responseWriter, err)
	}

	buf.WriteTo(r.responseWriter)

}

func ping(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("OK"))
}
