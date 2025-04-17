package attachment

import (
	"study-api/internal/course"
	"study-api/internal/task"
	"study-api/pkg/crud"
	"time"
)

type Attachment struct {
	crud.BaseEntity
	Name      string        `gorm:"not null" json:"name"`
	Type      string        `gorm:"not null" json:"type"`
	Path      string        `gorm:"not null" json:"path"`
	CreatedAt time.Time     `json:"created_at"`
	CourseId  *string       `json:"course_id"`
	Course    course.Course `json:"course"`
	TaskId    *string       `json:"task_id"`
	Task      task.Task     `json:"task"`

	_ struct{} `gorm:"check:one_reference_check,check:(course_id IS NOT NULL)::int + (task_id IS NOT NULL)::int = 1"`
}

type AttachmentDTO struct {
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	Path      string    `json:"path"`
	CreatedAt time.Time `json:"created_at"`
	CourseId  *string   `json:"course_id"`
	TaskId    *string   `json:"task_id"`
}
