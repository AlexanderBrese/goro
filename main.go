package main

func main() {
	config := ParsedConfiguration()
	logging := NewLogging()
	rendering, err := NewRendering(config)
	if err != nil {
		logging.errorLog.Fatalf("error: could not initialize rendering: %s", err)
	}
	handling := NewRouteHandling(rendering, logging)
	routing := NewRouting(handling, config)
	serving := NewServing(config, logging, routing)

	logging.errorLog.Fatal(serving.start())
}
