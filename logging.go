package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime/debug"
)

type ClientError struct {
	err    error
	status int
}

func (c *ClientError) Error() string {
	return c.err.Error()
}

func NewClientError(err error, status int) *ClientError {
	return &ClientError{
		err:    err,
		status: status,
	}
}

func BadRequestError(err error) *ClientError {
	return &ClientError{
		err:    err,
		status: http.StatusBadRequest,
	}
}

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

func (l *Logging) logServerError(w http.ResponseWriter, err error) {
	l.trace(err)
	l.respond(w, http.StatusInternalServerError)
}

func (l *Logging) logClientError(w http.ResponseWriter, c *ClientError) {
	l.trace(c)
	l.respond(w, c.status)
}

func (l *Logging) respond(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func (l *Logging) trace(err error) {
	out := fmt.Sprintf("%s\n%s", err.Error(), debug.Stack())

	// Report the file name and the line number one step back in the stack trace
	// This gives a clearer picture about the actual origin of the error
	l.errorLog.Output(2, out)
}
