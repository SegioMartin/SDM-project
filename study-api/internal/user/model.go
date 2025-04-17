package user

import "study-api/pkg/crud"

type User struct {
	crud.BaseEntity
	Name       string `gorm:"not null" json:"name"`
	Surname    string `gorm:"not null" json:"surname"`
	Patronomic string `gorm:"default:null" json:"patronomic"`
	Email      string `gorm:"not null;unique" json:"email"`
	Password   string `gorm:"not null" json:"password"`
	Avatar     string `gorm:"default:null" json:"avatar"`
}

type UserDTO struct {
	Name       string `json:"name"`
	Surname    string `json:"surname"`
	Patronomic string `json:"patronomic"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Avatar     string `json:"avatar"`
}
