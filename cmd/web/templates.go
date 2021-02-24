package main

import (
	"html/template"
	"path/filepath"
	"time"
)

type TemplateCache = map[string]*template.Template

type TemplateData struct {
	Flash       string
	CurrentYear int
	// TODO: Add input validation
	// Form  *forms.Form
}

func humanDate(t time.Time) string {
	if t.IsZero() {
		return ""
	}

	return t.UTC().Format("24 Feb 2021 at 08:35")
}

var templateFunctions = template.FuncMap{
	"humanDate": humanDate,
}

func newTemplateCache(pageDir string) (TemplateCache, error) {
	templateCache := TemplateCache{}
	pages, err := _getPages(pageDir)
	if err != nil {
		return nil, err
	}
	for _, page := range pages {
		pageName := _getPageName(page)
		parsedPageTemplate, err := _parsePageTemplate(page, pageName)
		if err != nil {
			return nil, err
		}
		parsedPageTemplate, err = _addLayoutTemplates(parsedPageTemplate, pageDir)
		if err != nil {
			return nil, err
		}
		parsedPageTemplate, err = _addPartialTemplates(parsedPageTemplate, pageDir)
		if err != nil {
			return nil, err
		}

		templateCache[pageName] = parsedPageTemplate
	}

	return templateCache, nil
}

// getPages finds all file paths ending with the extension '.page.html' recursively
func _getPages(pageDir string) ([]string, error) {
	return filepath.Glob(filepath.Join(pageDir, "*.page.html"))
}

func _getPageName(page string) string {
	return filepath.Base(page)
}

func _parsePageTemplate(page string, pageName string) (*template.Template, error) {
	return template.New(pageName).Funcs(templateFunctions).ParseFiles(page)
}

func _addLayoutTemplates(pageTemplate *template.Template, pageDir string) (*template.Template, error) {
	return pageTemplate.ParseGlob(filepath.Join(pageDir, "*.layout.html"))
}

func _addPartialTemplates(pageTemplate *template.Template, pageDir string) (*template.Template, error) {
	return pageTemplate.ParseGlob(filepath.Join(pageDir, "*.partial.html"))
}
