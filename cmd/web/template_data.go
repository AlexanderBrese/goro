package main

import (
	"time"

	"github.com/AlexanderBrese/goro/pkg/model"
)

type TemplateData struct {
	Name    string
	Payload map[string]interface{}
}

func NewTemplateData(name string, payload map[string]interface{}) *TemplateData {
	today := time.Now()
	payload["currentHour"] = uint8(today.Hour())
	payload["currentYear"] = today.Year()
	return &TemplateData{
		Name:    name,
		Payload: payload,
	}
}

func PageTemplateData(name string) *TemplateData {
	return NewTemplateData(name, map[string]interface{}{})
}

func UserTemplateData(name string, user *model.User) *TemplateData {
	return NewTemplateData(name, map[string]interface{}{
		"user": user,
	})
}

func DefaultTemplateData() *TemplateData {
	payload := map[string]interface{}{
		"user": model.DefaultUser(),
	}
	return NewTemplateData("", payload)
}
