package main

import (
	"net/http"
	"time"

	"github.com/AlexanderBrese/gorro/pkg/forms"
	"github.com/AlexanderBrese/gorro/pkg/model"
)

type TemplateData struct {
	CurrentHour uint8
	CurrentYear int
	Form        *forms.Form
	Request     *http.Request
	User        *model.User
}

func NewTemplateData(form *forms.Form, r *http.Request, u *model.User) *TemplateData {
	today := time.Now()
	return &TemplateData{
		CurrentHour: uint8(today.Hour()),
		CurrentYear: today.Year(),
		Form:        form,
		User:        u,
	}
}

func DefaultTemplateData() *TemplateData {
	return NewTemplateData(nil, nil, model.DefaultUser())
}
