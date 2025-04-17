package course

import (
	"study-api/internal/group"
	"study-api/pkg/crud"
)

type Course struct {
	crud.BaseEntity
	Name        string      `gorm:"not null;unique" json:"name"`
	Description string      `gorm:"default:null" json:"description"`
	Teacher     string      `gorm:"default:null" json:"teacher"`
	GroupId     string      `gorm:"not null" json:"groupId"`
	Group       group.Group `gorm:"foreignKey:GroupId;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"group"`
}

type CourseDTO struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Teacher     string `json:"teacher"`
	GroupId     string `json:"groupId"`
}
