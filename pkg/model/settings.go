package model

type Settings struct {
	sound        string
	dark         bool
	volume       uint8
	notification bool
	duration     uint8
	smallPause   uint8
	pause        uint8
	dailyGoal    uint8
}

func DefaultSettings() *Settings {
	return &Settings{
		sound:        "",
		dark:         false,
		volume:       100,
		notification: true,
		duration:     25,
		smallPause:   5,
		pause:        10,
		dailyGoal:    4,
	}
}
