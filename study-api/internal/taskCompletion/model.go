package taskCompletion

import (
	"study-api/internal/task"
	"study-api/internal/user"
	"time"
)

type TaskCompletion struct {
	UserID         string    `gorm:"primaryKey" json:"user_id"`
	TaskID         string    `gorm:"primaryKey" json:"task_id"`
	DateCompletion time.Time `json:"date"`
	Comment        string    `json:"comment"`
	IsDone         bool      `gorm:"default:null" json:"is_done"`

	User user.User `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Task task.Task `gorm:"foreignKey:TaskID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type TaskCompletionDTO struct {
	UserID         string    `json:"user_id"`
	TaskID         string    `json:"task_id"`
	DateCompletion time.Time `json:"date"`
	Comment        string    `json:"comment"`
	IsDone         bool      `json:"is_done"`
}
