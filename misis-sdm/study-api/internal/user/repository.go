package user

import (
	"context"
	"gorm.io/gorm"
	"study-api/pkg/crud"
)

type Repository interface {
	Create(ctx context.Context, u *User) error
	GetByID(ctx context.Context, id string) (*User, error)
	GetAll(ctx context.Context) ([]User, error)
	Update(ctx context.Context, u *User) error
	Delete(ctx context.Context, id string) error
}

func NewRepository(db *gorm.DB) Repository {
	return crud.NewBaseRepository[User](db)
}
