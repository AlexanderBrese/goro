package main

import (
	"fmt"
	"net/http"
	"runtime/debug"
)

func (app *Application) tracedServerError(w http.ResponseWriter, err error) {
	trace := _tracedError(err)
	// Report the file name and the line number one step back in the stack trace
	// This gives a clearer picture about the actual origin of the error
	app.errorLog.Output(2, trace)
	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

func (app *Application) customClientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func (app *Application) notFoundClientError(w http.ResponseWriter) {
	app.customClientError(w, http.StatusNotFound)
}

func _tracedError(err error) string {
	return fmt.Sprintf("%s\n%s", err.Error(), debug.Stack())
}
