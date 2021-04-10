package model

type Settings struct {
	Sound        string `json:"sound"`
	Dark         bool   `json:"dark"`
	Muted        bool   `json:"muted"`
	Notification bool   `json:"notification"`
	Duration     uint8  `json:"duration"`
	SmallPause   uint8  `json:"smallPause"`
	Pause        uint8  `json:"pause"`
	DailyGoal    uint8  `json:"dailyGoal"`
}
