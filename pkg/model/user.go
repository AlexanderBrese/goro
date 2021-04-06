package model

type User struct {
	Name     string     `json:"name"`
	Settings *Settings  `json:"settings"`
	Sessions []*Session `json:"sessions"`
	stats    *Stats
}

func DefaultUser() *User {
	return &User{
		Name:     "",
		Settings: &Settings{},
		Sessions: make([]*Session, 0),
		stats:    &Stats{},
	}
}
