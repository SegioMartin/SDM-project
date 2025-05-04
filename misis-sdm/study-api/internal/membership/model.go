package membership

import (
	"study-api/internal/group"
	"study-api/internal/role"
	"study-api/internal/user"
	"time"
)

type Membership struct {
	UserID  string      `gorm:"primaryKey" json:"user_id"`
	GroupID string      `gorm:"primaryKey" json:"group_id"`
	RoleID  string      `gorm:"not null" json:"role_id"`
	Joined  time.Time   `json:"joined"`
	User    user.User   `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user"`
	Group   group.Group `gorm:"foreignKey:GroupID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"group"`
	Role    role.Role   `gorm:"foreignKey:RoleID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"role"`
}

type MembershipDTO struct {
	UserID  string `json:"user_id"`
	GroupID string `json:"group_id"`
	RoleID  string `json:"role_id"`
}
