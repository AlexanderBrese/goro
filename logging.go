package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime/debug"
)

type Logging struct {
	errorLog *log.Logger
	infoLog  *log.Logger
}

func NewLogging() *Logging {
	return &Logging{
		errorLog: log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile),
		infoLog:  log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime),
	}
}

func (l *Logging) tracedServerError(w http.ResponseWriter, err error) {
	trace := _tracedError(err)
	// Report the file name and the line number one step back in the stack trace
	// This gives a clearer picture about the actual origin of the error
	l.errorLog.Output(2, trace)
	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

func (l *Logging) customClientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func (l *Logging) notFoundClientError(w http.ResponseWriter) {
	l.customClientError(w, http.StatusNotFound)
}

func _tracedError(err error) string {
	return fmt.Sprintf("%s\n%s", err.Error(), debug.Stack())
}
