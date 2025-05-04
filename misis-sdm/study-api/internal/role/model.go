package role

import "study-api/pkg/crud"

type Role struct {
	crud.BaseEntity
	Name        string `gorm:"not null;unique" json:"name"`
	Description string `gorm:"default:null" json:"description"`
}

type RoleDTO struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}
