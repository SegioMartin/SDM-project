package task

import (
	"context"
	"gorm.io/gorm"
	"study-api/pkg/crud"
)

type Repository interface {
	Create(ctx context.Context, u *Task) error
	GetByID(ctx context.Context, id string) (*Task, error)
	GetAll(ctx context.Context) ([]Task, error)
	Update(ctx context.Context, u *Task) error
	Delete(ctx context.Context, id string) error
	PreloadByID(ctx context.Context, id string, fields ...string) (*Task, error)
}

func NewRepository(db *gorm.DB) Repository {
	return crud.NewBaseRepository[Task](db)
}
