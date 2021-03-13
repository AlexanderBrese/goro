package main

import (
	"html/template"
	"math"
	"strings"
	"time"

	"github.com/AlexanderBrese/gorro/pkg/model"
)

type TemplateFunctions struct {
	funcMap template.FuncMap
}

func NewTemplateFunctions() *TemplateFunctions {
	return &TemplateFunctions{
		funcMap: template.FuncMap{
			"greeting":       greeting,
			"steps":          steps,
			"begin":          begin,
			"end":            end,
			"slicePomodoros": slicePomodoros,
		},
	}
}

func (t *TemplateFunctions) get() template.FuncMap {
	return t.funcMap
}

func greeting() string {
	curHour := time.Now().Hour()
	var greeting strings.Builder

	greeting.WriteString("Good ")

	if curHour >= 4 && curHour < 12 {
		greeting.WriteString("morning")
	} else if curHour >= 12 && curHour < 18 {
		greeting.WriteString("afternoon")
	} else if curHour >= 18 && curHour < 22 {
		greeting.WriteString("evening")
	} else {
		greeting.WriteString("night")
	}

	greeting.WriteString("!")
	return greeting.String()
}

func steps(num int) []int {
	return make([]int, num)
}

func portion(steps int, len int) int {
	return int(math.Floor(float64(len / int(steps))))
}

func slicePomodoros(steps int, step int, pomodoros []*model.Pomodoro) []*model.Pomodoro {
	b := begin(steps, step, len(pomodoros))
	e := end(steps, step, len(pomodoros))

	return pomodoros[b:e]
}

func begin(steps int, step int, len int) int {
	if step > steps || step == 0 {
		return 0
	}

	p := portion(steps, len)
	return p * step
}

func end(steps int, step int, len int) int {
	if step > steps {
		return -1
	}
	p := portion(steps, len)
	if step == steps-1 {
		rest := len - (p*steps - 1)
		return rest
	}
	return p
}
