package main

import (
	"bytes"
	"html/template"
	"net/http"
)

type Rendering struct {
	cache  *TemplateCaching
	logger *Logging
}

type RenderingConfiguration struct {
	request        *http.Request
	responseWriter http.ResponseWriter
	templateName   string
	templateData   *TemplateData
}

func NewRendering(config *Configuration, logger *Logging) (*Rendering, error) {
	tc, err := NewTemplateCaching(config)
	if err != nil {
		return nil, err
	}

	return &Rendering{
		cache:  tc,
		logger: logger,
	}, nil
}

func (r *Rendering) start(renderConfig *RenderingConfiguration) {
	t, err := r.getTemplate(renderConfig)
	if err != nil {
		r.logger.tracedServerError(renderConfig.responseWriter, err)
		return
	}

	renderConfig.responseWriter.Header().Set("Content-Type", "text/html")

	if err := r.render(t, r.getTemplateData(renderConfig), renderConfig.responseWriter); err != nil {
		r.logger.tracedServerError(renderConfig.responseWriter, err)
	}
}

func (r *Rendering) getTemplate(renderConfig *RenderingConfiguration) (*template.Template, error) {
	return r.cache.Get(renderConfig.templateName)
}

func (r *Rendering) getTemplateData(renderConfig *RenderingConfiguration) *TemplateData {
	td := renderConfig.templateData
	if td == nil {
		td = DefaultTemplateData()
	}
	return td
}

func (r *Rendering) render(t *template.Template, td *TemplateData, out http.ResponseWriter) error {
	buf := new(bytes.Buffer)

	if err := t.Execute(buf, td); err != nil {
		return err
	}
	if _, err := buf.WriteTo(out); err != nil {
		return err
	}
	return nil
}
