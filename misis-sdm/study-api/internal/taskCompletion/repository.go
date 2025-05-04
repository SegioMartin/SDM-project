package taskCompletion

import (
	"context"
	"gorm.io/gorm"
	"study-api/pkg/crud"
)

type Repository interface {
	Create(ctx context.Context, entity *TaskCompletion) error
	GetByCompositeID(ctx context.Context, nameKey1, key1, nameKey2, key2 string) (*TaskCompletion, error)
	GetAll(ctx context.Context) ([]TaskCompletion, error)
	Update(ctx context.Context, entity *TaskCompletion) error
	Delete(ctx context.Context, nameKey1, key1, nameKey2, key2 string) error
	PreloadByCompositeID(ctx context.Context, nameKey1, key1, nameKey2, key2 string, fields ...string) (*TaskCompletion, error)
}

func NewRepository(db *gorm.DB) Repository {
	return crud.NewCompositeBaseRepository[TaskCompletion](db)
}
