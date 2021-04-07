package main

import (
	"bytes"
	"html/template"
	"strings"
)

type Rendering struct {
	cache *TemplateCaching
}

func NewRendering(config *Configuration) (*Rendering, error) {
	tc, err := NewTemplateCaching(config)
	if err != nil {
		return nil, err
	}

	return &Rendering{
		cache: tc,
	}, nil
}

func (r *Rendering) start(templateData *TemplateData) ([]byte, error) {
	t, err := r.getTemplate(templateData)
	if err != nil {
		return nil, err
	}

	res, err := r.render(t, templateData)

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (r *Rendering) getTemplate(templateData *TemplateData) (*template.Template, error) {
	return r.cache.Get(templateData.Name)
}

func (r *Rendering) render(t *template.Template, td *TemplateData) ([]byte, error) {
	buf := new(bytes.Buffer)

	if err := t.Execute(buf, td); err != nil {
		return nil, err
	}
	res := []byte(strings.TrimSpace(buf.String()))

	return res, nil
}
