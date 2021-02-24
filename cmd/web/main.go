package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"time"
)

type WebServerConfig struct {
	Addr        string
	StaticDir   string
	idleTimeout time.Duration
}

type Application struct {
	templateCache   TemplateCache
	webServerConfig *WebServerConfig
	*ApplicationLog
}

type ApplicationLog struct {
	errorLog *log.Logger
	infoLog  *log.Logger
}

func main() {
	webServerConfig := _parseWebServerConfig()
	applicationLog := _createApplicationLog()
	templateCache, err := _createTemplateCache()
	if err != nil {
		// TODO: can we make this better?
		applicationLog.errorLog.Fatal(err)
	}

	app := &Application{
		templateCache:   templateCache,
		webServerConfig: webServerConfig,
		ApplicationLog:  applicationLog,
	}

	srv := &http.Server{
		Addr:         webServerConfig.Addr,
		ErrorLog:     applicationLog.errorLog,
		IdleTimeout:  time.Minute,
		Handler:      app.routes(),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	applicationLog.infoLog.Printf("Starting server on %s", webServerConfig.Addr)
	applicationLog.errorLog.Fatal(srv.ListenAndServe())
}

func _parseWebServerConfig() *WebServerConfig {
	cfg := new(WebServerConfig)
	flag.StringVar(&cfg.Addr, "addr", ":4000", "HTTP network address")
	flag.StringVar(&cfg.StaticDir, "static-dir", "./ui/static", "Path to static assets")
	flag.Parse()
	return cfg
}

func _createApplicationLog() *ApplicationLog {
	appLog := new(ApplicationLog)
	appLog.errorLog = log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)
	appLog.infoLog = log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)

	return appLog
}

func _createTemplateCache() (TemplateCache, error) {
	return newTemplateCache("./ui/html/")
}
