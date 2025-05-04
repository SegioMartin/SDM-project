package attachment

import (
	"context"
	"gorm.io/gorm"
	"study-api/pkg/crud"
)

type Repository interface {
	Create(ctx context.Context, u *Attachment) error
	GetByID(ctx context.Context, id string) (*Attachment, error)
	GetAll(ctx context.Context) ([]Attachment, error)
	Update(ctx context.Context, u *Attachment) error
	Delete(ctx context.Context, id string) error
	PreloadByID(ctx context.Context, id string, fields ...string) (*Attachment, error)
}

func NewRepository(db *gorm.DB) Repository {
	return crud.NewBaseRepository[Attachment](db)
}
