package role

import (
	"context"
	"study-api/pkg/crud"
)

type Service interface {
	Create(ctx context.Context, u *RoleDTO) (*Role, error)
	GetByID(ctx context.Context, id string) (*Role, error)
	GetAll(ctx context.Context) ([]Role, error)
	Update(ctx context.Context, u *RoleDTO, id string) (*Role, error)
	Delete(ctx context.Context, id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, dto *RoleDTO) (*Role, error) {
	role := Role{
		Name:        dto.Name,
		Description: dto.Description,
	}
	return &role, s.repo.Create(ctx, &role)
}

func (s *service) GetByID(ctx context.Context, id string) (*Role, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *service) GetAll(ctx context.Context) ([]Role, error) {
	return s.repo.GetAll(ctx)
}

func (s *service) Update(ctx context.Context, dto *RoleDTO, id string) (*Role, error) {
	role := Role{
		BaseEntity:  crud.BaseEntity{ID: id},
		Name:        dto.Name,
		Description: dto.Description,
	}
	return &role, s.repo.Update(ctx, &role)
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
