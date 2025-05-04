package crud

import (
	"context"
	"fmt"
	"gorm.io/gorm"
)

type CompositeRepository[T any] interface {
	Create(ctx context.Context, entity *T) error
	GetByCompositeID(ctx context.Context, nameKey1, key1, nameKey2, key2 string) (*T, error)
	GetAll(ctx context.Context) ([]T, error)
	Update(ctx context.Context, entity *T) error
	Delete(ctx context.Context, nameKey1, key1, nameKey2, key2 string) error
	PreloadByCompositeID(ctx context.Context, nameKey1, key1, nameKey2, key2 string, fields ...string) (*T, error)
}

type CompositeBaseRepository[T any] struct {
	db *gorm.DB
}

func NewCompositeBaseRepository[T any](db *gorm.DB) CompositeRepository[T] {
	return &CompositeBaseRepository[T]{db: db}
}

func (r *CompositeBaseRepository[T]) Create(ctx context.Context, entity *T) error {
	return r.db.WithContext(ctx).Create(entity).Error
}

func (r *CompositeBaseRepository[T]) GetByCompositeID(
	ctx context.Context,
	nameKey1, key1 string,
	nameKey2, key2 string,
) (*T, error) {
	var entity T

	whereClause := fmt.Sprintf("%s = ? AND %s = ?", nameKey1, nameKey2)

	err := r.db.WithContext(ctx).First(&entity, whereClause, key1, key2).Error
	return &entity, err
}

func (r *CompositeBaseRepository[T]) GetAll(ctx context.Context) ([]T, error) {
	var entities []T
	err := r.db.WithContext(ctx).Find(&entities).Error
	return entities, err
}

func (r *CompositeBaseRepository[T]) Update(ctx context.Context, entity *T) error {
	return r.db.WithContext(ctx).Save(entity).Error
}

func (r *CompositeBaseRepository[T]) Delete(
	ctx context.Context,
	nameKey1, key1 string,
	nameKey2, key2 string,
) error {
	var entity T

	whereClause := fmt.Sprintf("%s = ? AND %s = ?", nameKey1, nameKey2)

	return r.db.WithContext(ctx).Delete(&entity, whereClause, key1, key2).Error
}

func (r *CompositeBaseRepository[T]) PreloadByCompositeID(
	ctx context.Context,
	nameKey1, key1 string,
	nameKey2, key2 string,
	fields ...string,
) (*T, error) {
	query := r.db.WithContext(ctx)

	for _, field := range fields {
		query = query.Preload(field)
	}
	var entity T
	whereClause := fmt.Sprintf("%s = ? AND %s = ?", nameKey1, nameKey2)

	if err := query.First(&entity, whereClause, key1, key2).Error; err != nil {
		return nil, err
	}

	return &entity, nil
}
