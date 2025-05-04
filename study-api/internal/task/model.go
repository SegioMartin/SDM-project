package task

import (
	"study-api/internal/course"
	"study-api/pkg/crud"
)

type Task struct {
	crud.BaseEntity
	Name        string        `gorm:"not null;index:idx_name_deadline,unique" json:"name"`
	Description string        `gorm:"default:null" json:"description"`
	Deadline    string        `gorm:"not null;index:idx_name_deadline,unique" json:"deadline"`
	Priority    string        `gorm:"type:text;check:priority IN ('low','medium','high')" json:"priority"`
	CourseId    string        `gorm:"not null" json:"course_id"`
	Course      course.Course `gorm:"foreignKey:CourseId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"course"`
}

type TaskDTO struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Deadline    string `json:"deadline"`
	Priority    string `json:"priority"`
	CourseId    string `json:"course_id"`
}
