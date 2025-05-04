package crud

import (
	"context"
	"gorm.io/gorm"
)

type Repository[T any] interface {
	Create(ctx context.Context, entity *T) error
	GetByID(ctx context.Context, id string) (*T, error)
	GetAll(ctx context.Context) ([]T, error)
	Update(ctx context.Context, entity *T) error
	Delete(ctx context.Context, id string) error
	PreloadByID(ctx context.Context, id string, fields ...string) (*T, error)
}
type BaseRepository[T any] struct {
	db *gorm.DB
}

func NewBaseRepository[T any](db *gorm.DB) Repository[T] {
	return &BaseRepository[T]{db: db}
}

func (r *BaseRepository[T]) Create(ctx context.Context, entity *T) error {
	return r.db.WithContext(ctx).Create(entity).Error
}

func (r *BaseRepository[T]) GetByID(ctx context.Context, id string) (*T, error) {
	var entity T
	err := r.db.WithContext(ctx).First(&entity, "id = ?", id).Error
	return &entity, err
}

func (r *BaseRepository[T]) GetAll(ctx context.Context) ([]T, error) {
	var entities []T
	err := r.db.WithContext(ctx).Find(&entities).Error
	return entities, err
}

func (r *BaseRepository[T]) Update(ctx context.Context, entity *T) error {
	return r.db.WithContext(ctx).Save(entity).Error
}

func (r *BaseRepository[T]) Delete(ctx context.Context, id string) error {
	var entity T
	return r.db.WithContext(ctx).Delete(&entity, "id = ?", id).Error
}

func (r *BaseRepository[T]) PreloadByID(ctx context.Context, id string, fields ...string) (*T, error) {
	query := r.db.WithContext(ctx)
	for _, field := range fields {
		query = query.Preload(field)
	}
	var entity T
	if err := query.First(&entity, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}
