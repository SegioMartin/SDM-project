package event

import (
	"context"
	"study-api/pkg/crud"
)

type Service interface {
	Create(ctx context.Context, u *EventDTO) (*Event, error)
	GetByID(ctx context.Context, id string) (*Event, error)
	GetAll(ctx context.Context) ([]Event, error)
	Update(ctx context.Context, u *EventDTO, id string) (*Event, error)
	Delete(ctx context.Context, id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, dto *EventDTO) (*Event, error) {
	event := Event{
		Name:        dto.Name,
		Description: dto.Description,
		Start:       dto.Start,
		End:         dto.End,
		Location:    dto.Location,
		CourseId:    dto.CourseId,
	}
	if err := s.repo.Create(ctx, &event); err != nil {
		return nil, err
	}

	fullEvent, err := s.repo.PreloadByID(ctx, event.ID, "Course")
	if err != nil {
		return nil, err
	}

	return fullEvent, nil
}

func (s *service) GetByID(ctx context.Context, id string) (*Event, error) {
	event, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	fullEvent, err := s.repo.PreloadByID(ctx, event.ID, "Group")
	if err != nil {
		return nil, err
	}

	return fullEvent, nil
}

func (s *service) GetAll(ctx context.Context) ([]Event, error) {
	events, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	var fullEvents []Event
	for _, c := range events {
		fullEvent, err := s.repo.PreloadByID(ctx, c.ID, "Course")
		if err != nil {
			return nil, err
		}
		fullEvents = append(fullEvents, *fullEvent)
	}

	return fullEvents, nil
}

func (s *service) Update(ctx context.Context, dto *EventDTO, id string) (*Event, error) {
	event := Event{
		BaseEntity:  crud.BaseEntity{ID: id},
		Name:        dto.Name,
		Description: dto.Description,
		Start:       dto.Start,
		End:         dto.End,
		Location:    dto.Location,
		CourseId:    dto.CourseId,
	}

	if err := s.repo.Update(ctx, &event); err != nil {
		return nil, err
	}

	fullEvent, err := s.repo.PreloadByID(ctx, event.ID, "Course")
	if err != nil {
		return nil, err
	}
	return fullEvent, nil
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
