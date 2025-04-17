package task

import (
	"context"
	"errors"
)

type Service interface {
	Create(ctx context.Context, u *TaskDTO) (*Task, error)
	GetByID(ctx context.Context, id string) (*Task, error)
	GetAll(ctx context.Context) ([]Task, error)
	Update(ctx context.Context, u *TaskDTO, id string) (*Task, error)
	Delete(ctx context.Context, id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, dto *TaskDTO) (*Task, error) {

	switch dto.Priority {
	case "low", "medium", "high":
		break
	default:
		return nil, errors.New("invalid priority")
	}

	task := Task{
		Name:        dto.Name,
		Description: dto.Description,
		Deadline:    dto.Deadline,
		Priority:    dto.Priority,
		CourseId:    dto.CourseId,
	}

	if err := s.repo.Create(ctx, &task); err != nil {
		return nil, err
	}

	fullCourse, err := s.repo.PreloadByID(ctx, task.ID, "Course")
	if err != nil {
		return nil, err
	}

	return fullCourse, nil
}

func (s *service) GetByID(ctx context.Context, id string) (*Task, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *service) GetAll(ctx context.Context) ([]Task, error) {
	return s.repo.GetAll(ctx)
}

func (s *service) Update(ctx context.Context, dto *TaskDTO, id string) (*Task, error) {

	switch dto.Priority {
	case "low", "medium", "high":
		break
	default:
		return nil, errors.New("invalid priority")
	}

	task, err := s.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if dto.Name != "" {
		task.Name = dto.Name
	}
	if dto.Description != "" {
		task.Description = dto.Description
	}
	if dto.Deadline != "" {
		task.Deadline = dto.Deadline
	}
	if dto.Priority != "" {
		task.Priority = dto.Priority
	}
	return task, s.repo.Update(ctx, task)
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
