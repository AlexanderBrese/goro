package model

import "time"

type User struct {
	name     string
	settings *Settings
	sessions []*Session
	stats    *Stats
}

func DefaultUser() *User {
	return &User{
		name:     "Joe",
		settings: DefaultSettings(),
		stats:    DefaultStats(),
		sessions: make([]*Session, 0),
	}
}

func (u *User) NewSession() {
	u.sessions = append(u.sessions, NewSession(u.settings.pause, u.settings.smallPause, int(u.settings.duration)))
}

func (u *User) DailyGoal() uint8 {
	return u.settings.dailyGoal
}

func (u *User) LatestSession() *Session {
	l := len(u.sessions)
	if l == 0 {
		return nil
	}
	return u.sessions[len(u.sessions)-1]
}

func (u *User) TodaysPomodoros() uint8 {
	var todaysPoms uint8 = 0

	today := time.Now().Day()

	// TODO: Treat sessions as a stack and compare the pre-latest & latest item only
	for _, session := range u.sessions {
		completionDay := session.completionDate.Day()
		if completionDay == today {
			todaysPoms += uint8(len(session.Pomodoros))
		} else if completionDay == today-1 || completionDay == today+1 {
			for _, pom := range session.Pomodoros {
				completionDay := pom.completionDate.Day()
				if completionDay == today {
					todaysPoms += uint8(len(session.Pomodoros))
				}
			}
		}
	}

	return todaysPoms
}
