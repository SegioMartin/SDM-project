package event

import (
	"study-api/internal/course"
	"study-api/pkg/crud"
	"time"
)

type Event struct {
	crud.BaseEntity
	Name        string        `gorm:"not null" json:"name"`
	Description string        `gorm:"default:null" json:"description"`
	Start       time.Time     `gorm:"not null" json:"start"`
	End         time.Time     `gorm:"default:null" json:"end"`
	Location    string        `gorm:"not null" json:"location"`
	CourseId    string        `gorm:"not null" json:"courseId"`
	Course      course.Course `gorm:"foreignKey:CourseId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"course"`
}

type EventDTO struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Start       time.Time `json:"start"`
	End         time.Time `json:"end"`
	Location    string    `json:"location"`
	CourseId    string    `json:"courseId"`
}
