package course

import (
	"context"
	"gorm.io/gorm"
	"study-api/pkg/crud"
)

type Repository interface {
	Create(ctx context.Context, u *Course) error
	GetByID(ctx context.Context, id string) (*Course, error)
	GetAll(ctx context.Context) ([]Course, error)
	Update(ctx context.Context, u *Course) error
	Delete(ctx context.Context, id string) error
	PreloadByID(ctx context.Context, id string, fields ...string) (*Course, error)
}

func NewRepository(db *gorm.DB) Repository {
	return crud.NewBaseRepository[Course](db)
}
