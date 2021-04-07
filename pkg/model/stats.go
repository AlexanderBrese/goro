package model

type Stats struct {
	durationMedian float32
	durationHigh   uint8
	durationLow    uint8
	durationSum    int
	pauseMedian    float32
	pauseHigh      uint8
	pauseLow       uint8
	pauseSum       int
	breakMedian    float32
	breakHigh      uint8
	breakLow       uint8
	breakSum       int
	sessionMedian  float32
	sessionHigh    uint8
	sessionLow     uint8
	sessionSum     int
	streakMedian   float32
	streakHigh     uint8
	streakLow      uint8
	streakSum      int
	skipMedian     float32
	skipHigh       int
	level          int
}
