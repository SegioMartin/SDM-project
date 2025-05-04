package taskCompletion

import (
	"context"
	"errors"
)

type Service interface {
	Create(ctx context.Context, dto *TaskCompletionDTO) (*TaskCompletion, error)
	GetByID(ctx context.Context, userId, taskId string) (*TaskCompletion, error)
	GetAll(ctx context.Context) ([]TaskCompletion, error)
	Update(ctx context.Context, dto *TaskCompletionDTO, userId, taskId string) (*TaskCompletion, error)
	Delete(ctx context.Context, userId, taskId string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, dto *TaskCompletionDTO) (*TaskCompletion, error) {
	if dto.UserID == "" || dto.TaskID == "" {
		return nil, errors.New("user_id and task_id are required")
	}

	completion := TaskCompletion{
		UserID:         dto.UserID,
		TaskID:         dto.TaskID,
		DateCompletion: dto.DateCompletion,
		Comment:        dto.Comment,
		IsDone:         dto.IsDone,
	}

	if err := s.repo.Create(ctx, &completion); err != nil {
		return nil, err
	}

	fullTaskCompletion, err := s.repo.PreloadByCompositeID(ctx, "user_id", dto.UserID, "task_id", dto.TaskID, "User", "Task")
	if err != nil {
		return nil, err
	}

	return fullTaskCompletion, nil
}

func (s *service) GetByID(ctx context.Context, userId, taskId string) (*TaskCompletion, error) {
	task, err := s.repo.GetByCompositeID(ctx, "user_id", userId, "task_id", taskId)
	if err != nil {
		return nil, err
	}

	fullTask, err := s.repo.PreloadByCompositeID(ctx, "user_id", task.UserID, "task_id", task.TaskID, "User", "Task")
	if err != nil {
		return nil, err
	}

	return fullTask, nil
}

func (s *service) GetAll(ctx context.Context) ([]TaskCompletion, error) {
	tasks, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	var fullTasks []TaskCompletion
	for _, c := range tasks {
		fullTask, err := s.repo.PreloadByCompositeID(ctx, "user_id", c.UserID, "task_id", c.TaskID, "User", "Task")
		if err != nil {
			return nil, err
		}
		fullTasks = append(fullTasks, *fullTask)
	}

	return fullTasks, nil
}

func (s *service) Update(ctx context.Context, dto *TaskCompletionDTO, userId, taskId string) (*TaskCompletion, error) {
	task, err := s.GetByID(ctx, userId, taskId)
	if err != nil {
		return nil, err
	}
	if dto.Comment != "" {
		task.Comment = dto.Comment
	}
	if dto.IsDone != task.IsDone {
		task.IsDone = dto.IsDone
	}

	if err := s.repo.Update(ctx, task); err != nil {
		return nil, err
	}

	return task, nil
}

func (s *service) Delete(ctx context.Context, userId, taskId string) error {
	return s.repo.Delete(ctx, "user_id", userId, "task_id", taskId)
}
