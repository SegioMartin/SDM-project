package group

import (
	"context"
	"gorm.io/gorm"
	"study-api/pkg/crud"
)

type Repository interface {
	Create(ctx context.Context, u *Group) error
	GetByID(ctx context.Context, id string) (*Group, error)
	GetAll(ctx context.Context) ([]Group, error)
	Update(ctx context.Context, u *Group) error
	Delete(ctx context.Context, id string) error
}

func NewRepository(db *gorm.DB) Repository {
	return crud.NewBaseRepository[Group](db)
}
