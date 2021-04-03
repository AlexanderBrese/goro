package main

import (
	"fmt"
	"html/template"
	"path/filepath"
	"strings"
)

type TemplateCache = map[string]*template.Template

type TemplateCaching struct {
	templateCache TemplateCache
}

func NewTemplateCaching(cfg *Configuration) (*TemplateCaching, error) {
	funcs := NewTemplateFunctions()
	tc, err := cachePartials(cfg.TemplatePath, funcs)
	if err != nil {
		return nil, err
	}
	tc, err = create(cfg.TemplatePath, funcs, tc)
	if err != nil {
		return nil, err
	}

	return &TemplateCaching{
		templateCache: tc,
	}, nil
}

func (t *TemplateCaching) Get(name string) (*template.Template, error) {
	tc, ok := t.templateCache[name]
	if !ok {
		return nil, fmt.Errorf("The template %s does not exist", name)
	}
	return tc, nil
}

func create(pagesPath string, funcs *TemplateFunctions, templateCache TemplateCache) (TemplateCache, error) {

	pages, err := pages(pagesPath)
	if err != nil {
		return nil, err
	}
	for _, page := range pages {
		pageName := templateName(page)
		parsedPageTemplate, err := parseTemplate(page, pageName, funcs)
		if err != nil {
			return nil, err
		}
		parsedPageTemplate, err = dependentLayouts(parsedPageTemplate, pagesPath)
		if err != nil {
			return nil, err
		}
		parsedPageTemplate, err = dependentPartials(parsedPageTemplate, pagesPath)
		if err != nil {
			return nil, err
		}

		templateCache[pageName] = parsedPageTemplate
	}

	return templateCache, nil
}

func cachePartials(partialPath string, funcs *TemplateFunctions) (TemplateCache, error) {
	templateCache := TemplateCache{}
	partials, err := partials(partialPath)
	if err != nil {
		return nil, err
	}
	for _, partial := range partials {
		partialName := templateName(partial)
		partialTemplate, err := parsePartial(partialName, funcs)
		if err != nil {
			return nil, err
		}
		partialTemplate, err = dependentPartials(partialTemplate, partialPath)
		if err != nil {
			return nil, err
		}

		templateCache[partialName] = partialTemplate
	}

	return templateCache, nil
}

func partials(pageDir string) ([]string, error) {
	return filepath.Glob(filepath.Join(pageDir, "*.partial.html"))
}

// pages finds all file paths ending with the extension '.page.html' recursively
func pages(pageDir string) ([]string, error) {
	return filepath.Glob(filepath.Join(pageDir, "*.page.html"))
}

func templateName(template string) string {
	return filepath.Base(template)
}

func parsePartial(partialName string, funcs *TemplateFunctions) (*template.Template, error) {
	name := strings.Split(partialName, ".")[0]
	return template.New(partialName).Funcs(funcs.get()).Parse(fmt.Sprintf("{{template \"%s\" .}}", name))
}

func parseTemplate(templatePath string, templateName string, funcs *TemplateFunctions) (*template.Template, error) {
	return template.New(templateName).Funcs(funcs.get()).ParseFiles(templatePath)
}

func dependentLayouts(pageTemplate *template.Template, pageDir string) (*template.Template, error) {
	return pageTemplate.ParseGlob(filepath.Join(pageDir, "*.layout.html"))
}

func dependentPartials(pageTemplate *template.Template, pageDir string) (*template.Template, error) {
	return pageTemplate.ParseGlob(filepath.Join(pageDir, "*.partial.html"))
}
