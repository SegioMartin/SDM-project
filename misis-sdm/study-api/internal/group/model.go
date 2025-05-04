package group

import (
	"study-api/pkg/crud"
	"time"
)

type Group struct {
	crud.BaseEntity
	Name        string    `gorm:"not null" json:"name"`
	Description string    `gorm:"default:null" json:"description"`
	CreatedAt   time.Time `gorm:"not null" json:"createdAt"`
}

type GroupDTO struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
}
