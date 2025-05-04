package membership

import (
	"context"
	"gorm.io/gorm"
	"study-api/pkg/crud"
)

type Repository interface {
	Create(ctx context.Context, entity *Membership) error
	GetByCompositeID(ctx context.Context, nameKey1, key1, nameKey2, key2 string) (*Membership, error)
	GetAll(ctx context.Context) ([]Membership, error)
	Update(ctx context.Context, entity *Membership) error
	Delete(ctx context.Context, nameKey1, key1, nameKey2, key2 string) error
	PreloadByCompositeID(ctx context.Context, nameKey1, key1, nameKey2, key2 string, fields ...string) (*Membership, error)
}

func NewRepository(db *gorm.DB) Repository {
	return crud.NewCompositeBaseRepository[Membership](db)
}
