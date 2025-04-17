package event

import (
	"context"
	"gorm.io/gorm"
	"study-api/pkg/crud"
)

type Repository interface {
	Create(ctx context.Context, u *Event) error
	GetByID(ctx context.Context, id string) (*Event, error)
	GetAll(ctx context.Context) ([]Event, error)
	Update(ctx context.Context, u *Event) error
	Delete(ctx context.Context, id string) error
	PreloadByID(ctx context.Context, id string, fields ...string) (*Event, error)
}

func NewRepository(db *gorm.DB) Repository {
	return crud.NewBaseRepository[Event](db)
}
