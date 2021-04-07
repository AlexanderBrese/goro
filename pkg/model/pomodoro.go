package model

import "time"

type Session struct {
	Pomodoros      []*Pomodoro `json:"pomodoros"`
	StartDate      time.Time   `json:"startDate"`
	CompletionDate time.Time   `json:"completionDate"`
	Pause          uint8       `json:"pause"`
	SmallPause     uint8       `json:"smallPause"`
	Duration       uint8       `json:"duration"`
}

type Pomodoro struct {
	Task           string    `json:"task"`
	Breaks         []*Break  `json:"breaks"`
	StartDate      time.Time `json:"startDate"`
	CompletionDate time.Time `json:"completionDate"`
	FeltProductive bool      `json:"feltProductive"`
}

type Break struct {
	StartDate      time.Time `json:"startDate"`
	CompletionDate time.Time `json:"completionDate"`
}
