package main

import (
	"flag"
	"time"
)

type Configuration struct {
	Addr         string
	StaticPath   string
	TemplatePath string
	IdleTimeout  time.Duration
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

func ParsedConfiguration() *Configuration {
	var addr, staticPath, templatePath string
	flag.StringVar(&addr, "addr", ":4000", "HTTP network address")
	flag.StringVar(&staticPath, "static-dir", "./ui/static", "Path to static assets")
	flag.StringVar(&templatePath, "template-path", "./ui/html", "Path to templates")
	flag.Parse()
	return &Configuration{
		Addr:         addr,
		StaticPath:   staticPath,
		TemplatePath: templatePath,
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
}
