package group

import (
	"context"
	"time"
)

type Service interface {
	Create(ctx context.Context, u *GroupDTO) (*Group, error)
	GetByID(ctx context.Context, id string) (*Group, error)
	GetAll(ctx context.Context) ([]Group, error)
	Update(ctx context.Context, u *GroupDTO, id string) (*Group, error)
	Delete(ctx context.Context, id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, dto *GroupDTO) (*Group, error) {
	group := Group{
		Name:        dto.Name,
		Description: dto.Description,
		CreatedAt:   time.Now().Local(),
	}
	return &group, s.repo.Create(ctx, &group)
}

func (s *service) GetByID(ctx context.Context, id string) (*Group, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *service) GetAll(ctx context.Context) ([]Group, error) {
	return s.repo.GetAll(ctx)
}

func (s *service) Update(ctx context.Context, dto *GroupDTO, id string) (*Group, error) {
	group, err := s.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if dto.Name != "" {
		group.Name = dto.Name
	}
	if dto.Description != "" {
		group.Description = dto.Description
	}
	return group, s.repo.Update(ctx, group)
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
