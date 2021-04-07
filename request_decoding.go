package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/golang/gddo/httputil/header"
)

type ContentType string

const (
	Json ContentType = "application/json"
)

type RequestDecoding struct {
	request     *http.Request
	jsonDecoder *json.Decoder
	maxRead     int64
}

func NewRequestDecoding(r *http.Request) *RequestDecoding {
	return &RequestDecoding{
		request:     r,
		jsonDecoder: newJsonDecoder(r),
	}
}

func NewLimitiedRequestDecoding(r *http.Request, w http.ResponseWriter, maxRead int64) *RequestDecoding {
	rc := NewRequestDecoding(r)
	rc.setMaxRead(w, maxRead)

	return rc
}

func (r *RequestDecoding) Json(dst interface{}) error {
	if err := r.checkContentType(r.request.Header, Json); err != nil {
		return err
	}

	if err := r.decodeJson(dst); err != nil {
		return err
	}

	return r.checkForAdditonalPayload()
}

func (r *RequestDecoding) decodeJson(dst interface{}) error {
	if err := r.jsonDecoder.Decode(&dst); err != nil {
		return r.jsonError(err)
	}
	return nil
}

// Call decode again, using a pointer to an empty anonymous struct as
// the destination. If the request body only contained a single JSON
// object this will return an io.EOF error. So if we get anything else,
// we know that there is additional data in the request body.
func (r *RequestDecoding) checkForAdditonalPayload() error {
	if err := r.jsonDecoder.Decode(&struct{}{}); err != io.EOF {
		err := errors.New("request body must only contain a single JSON object")
		return BadRequestError(err)
	}

	return nil
}

// Setup the decoder and call the DisallowUnknownFields() method on it.
// This will cause Decode() to return a "json: unknown field ..." error
// if it encounters any extra unexpected fields in the JSON. Strictly
// speaking, it returns an error for "keys which do not match any
// non-ignored, exported fields in the destination".
func newJsonDecoder(r *http.Request) *json.Decoder {
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	return d
}

func (r *RequestDecoding) jsonError(err error) error {
	var (
		syntaxError        *json.SyntaxError
		unmarshalTypeError *json.UnmarshalTypeError
	)

	switch {
	// Catch any syntax errors in the JSON and send an error message
	// which interpolates the location of the problem to make it
	// easier for the client to fix.
	case errors.As(err, &syntaxError):
		err := fmt.Errorf("request body contains badly-formed JSON (at position %d)", syntaxError.Offset)
		return BadRequestError(err)

	// In some circumstances Decode() may also return an
	// io.ErrUnexpectedEOF error for syntax errors in the JSON. There
	// is an open issue regarding this at
	// https://github.com/golang/go/issues/25956.
	case errors.Is(err, io.ErrUnexpectedEOF):
		err := fmt.Errorf("request body contains badly-formed JSON")
		return BadRequestError(err)

	// Catch any type errors, like trying to assign a string in the
	// JSON request body to a int field in our Person struct. We can
	// interpolate the relevant field name and position into the error
	// message to make it easier for the client to fix.
	case errors.As(err, &unmarshalTypeError):
		err := fmt.Errorf("request body contains an invalid value for the %q field (at position %d)", unmarshalTypeError.Field, unmarshalTypeError.Offset)
		return BadRequestError(err)

	// Catch the error caused by extra unexpected fields in the request
	// body. We extract the field name from the error message and
	// interpolate it in our custom error message. There is an open
	// issue at https://github.com/golang/go/issues/29035 regarding
	// turning this into a sentinel error.
	case strings.HasPrefix(err.Error(), "json: unknown field "):
		fieldName := strings.TrimPrefix(err.Error(), "json: unknown field ")
		err := fmt.Errorf("request body contains unknown field %s", fieldName)
		return BadRequestError(err)

	// An io.EOF error is returned by Decode() if the request body is
	// empty.
	case errors.Is(err, io.EOF):
		err := errors.New("request body must not be empty")
		return BadRequestError(err)

	// Catch the error caused by the request body being too large. Again
	// there is an open issue regarding turning this into a sentinel
	// error at https://github.com/golang/go/issues/30715.
	case err.Error() == "http: request body too large":
		err := fmt.Errorf("request body must not be larger than %d", r.maxRead)
		return NewClientError(err, http.StatusRequestEntityTooLarge)

	}
	return err
}

// Note that we are using the gddo/httputil/header
// package to parse and extract the value here, so the check works
// even if the client includes additional charset or boundary
// information in the header.
func (r *RequestDecoding) checkContentType(h http.Header, contentType ContentType) error {
	if r.request.Header.Get("Content-Type") != "" {
		value, _ := header.ParseValueAndParams(r.request.Header, "Content-Type")
		if value != string(contentType) {
			err := fmt.Errorf("Content-Type header is not %s", contentType)
			return &ClientError{status: http.StatusUnsupportedMediaType, err: err}
		}
	}
	return nil
}

// Use http.MaxBytesReader to enforce a maximum read of [maxRead] from the
// response body. A request body larger than that will now result in
// Decode() returning a "http: request body too large" error.
func (r *RequestDecoding) setMaxRead(w http.ResponseWriter, maxRead int64) {
	r.maxRead = maxRead
	r.request.Body = http.MaxBytesReader(w, r.request.Body, maxRead)
}
