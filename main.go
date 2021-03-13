package main

import "github.com/AlexanderBrese/gorro/pkg/model"

func main() {
	config := ParsedConfiguration()
	user := model.DefaultUser()
	logging := NewLogging()
	rendering, err := NewRendering(config, logging)
	if err != nil {
		logging.errorLog.Fatalf("error: could not initialize rendering: %s", err)
	}
	handling := NewRouteHandling(rendering, user)
	routing := NewRouting(handling, config)
	serving := NewServing(config, logging, routing)

	logging.errorLog.Fatal(serving.start())
}
