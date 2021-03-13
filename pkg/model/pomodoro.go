package model

import "time"

type Session struct {
	Pomodoros      []*Pomodoro
	startDate      time.Time
	completionDate time.Time
	pause          uint8
	smallPause     uint8
	duration       int
}

func NewSession(pause uint8, smallPause uint8, duration int, dailyGoal uint8) *Session {
	s := &Session{
		Pomodoros:  make([]*Pomodoro, 0),
		startDate:  time.Now(),
		pause:      pause,
		smallPause: smallPause,
		duration:   duration,
	}

	return s
}

func (s *Session) NewPomodoro() {
	s.Pomodoros = append(s.Pomodoros, NewPomodoro())
}

func (s *Session) Complete() {
	s.completionDate = time.Now()
}

type Pomodoro struct {
	description    string
	enduration     int
	breaks         []*Break
	startDate      time.Time
	completionDate time.Time
	feltProductive bool
}

func NewPomodoro() *Pomodoro {
	return &Pomodoro{
		breaks:    make([]*Break, 0),
		startDate: time.Now(),
	}
}

func (p *Pomodoro) Describe(desc string) {
	p.description = desc
}

func (p *Pomodoro) Finish(end int) {
	p.enduration = end
	p.completionDate = time.Now()
}

func (p *Pomodoro) Feedback(fp bool) {
	p.feltProductive = fp
}

type Break struct {
	duration uint8
}
