package role

import (
	"context"
	"gorm.io/gorm"
	"study-api/pkg/crud"
)

type Repository interface {
	Create(ctx context.Context, u *Role) error
	GetByID(ctx context.Context, id string) (*Role, error)
	GetAll(ctx context.Context) ([]Role, error)
	Update(ctx context.Context, u *Role) error
	Delete(ctx context.Context, id string) error
}

func NewRepository(db *gorm.DB) Repository {
	return crud.NewBaseRepository[Role](db)
}
