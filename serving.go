package main

import (
	"net/http"
)

type Serving struct {
	server  *http.Server
	config  *Configuration
	logging *Logging
}

func NewServing(cfg *Configuration, logging *Logging, routing *Routing) *Serving {
	return &Serving{
		server: &http.Server{
			Addr:         cfg.Addr,
			ErrorLog:     logging.errorLog,
			IdleTimeout:  cfg.IdleTimeout,
			Handler:      routing.routes(),
			ReadTimeout:  cfg.ReadTimeout,
			WriteTimeout: cfg.WriteTimeout,
		},
		logging: logging,
		config:  cfg,
	}
}

func (s *Serving) start() error {
	s.logging.infoLog.Printf("Starting server on %s", s.config.Addr)
	return s.server.ListenAndServe()
}
