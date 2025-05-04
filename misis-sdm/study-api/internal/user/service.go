package user

import (
	"context"
	"study-api/pkg/crud"
)

type Service interface {
	Create(ctx context.Context, u *UserDTO) (*User, error)
	GetByID(ctx context.Context, id string) (*User, error)
	GetAll(ctx context.Context) ([]User, error)
	Update(ctx context.Context, u *UserDTO, id string) (*User, error)
	Delete(ctx context.Context, id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, dto *UserDTO) (*User, error) {
	user := User{
		Name:       dto.Name,
		Surname:    dto.Surname,
		Patronomic: dto.Patronomic,
		Email:      dto.Email,
		Password:   dto.Password,
		Avatar:     dto.Avatar,
	}
	return &user, s.repo.Create(ctx, &user)
}

func (s *service) GetByID(ctx context.Context, id string) (*User, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *service) GetAll(ctx context.Context) ([]User, error) {
	return s.repo.GetAll(ctx)
}

func (s *service) Update(ctx context.Context, dto *UserDTO, id string) (*User, error) {
	user := User{
		BaseEntity: crud.BaseEntity{ID: id},
		Name:       dto.Name,
		Surname:    dto.Surname,
		Patronomic: dto.Patronomic,
		Email:      dto.Email,
		Password:   dto.Password,
		Avatar:     dto.Avatar,
	}
	return &user, s.repo.Update(ctx, &user)
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
