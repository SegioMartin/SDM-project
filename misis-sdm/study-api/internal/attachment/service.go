package attachment

import (
	"context"
	"errors"
	"fmt"
	"time"
)

type Service interface {
	Create(ctx context.Context, u *AttachmentDTO) (*Attachment, error)
	GetByID(ctx context.Context, id string) (*Attachment, error)
	GetAll(ctx context.Context) ([]Attachment, error)
	Update(ctx context.Context, u *AttachmentDTO, id string) (*Attachment, error)
	Delete(ctx context.Context, id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, dto *AttachmentDTO) (*Attachment, error) {
	attachment := Attachment{
		Name:      dto.Name,
		Type:      dto.Type,
		Path:      dto.Path,
		CreatedAt: time.Now().Local(),
		CourseId:  dto.CourseId,
		TaskId:    dto.TaskId,
	}

	if err := s.repo.Create(ctx, &attachment); err != nil {
		return nil, err
	}
	if !((dto.TaskId != nil && *dto.TaskId != "") != (dto.CourseId != nil && *dto.CourseId != "")) {
		return nil, errors.New("invalid course_id or task_id")
	}
	if *dto.CourseId != "" {
		fullCourse, err := s.repo.PreloadByID(ctx, attachment.ID, "Course")
		if err != nil {
			return nil, err
		}
		return fullCourse, nil
	}
	if *dto.TaskId != "" {
		fullCourse, err := s.repo.PreloadByID(ctx, attachment.ID, "Task")
		if err != nil {
			return nil, err
		}
		return fullCourse, nil
	}

	return nil, fmt.Errorf("failed to auto migrate")
}

func (s *service) GetByID(ctx context.Context, id string) (*Attachment, error) {
	attachment, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if attachment.CourseId != nil {
		fullAttachment, err := s.repo.PreloadByID(ctx, attachment.ID, "Course")
		if err != nil {
			return nil, err
		}
		return fullAttachment, nil
	} else {
		fullAttachment, err := s.repo.PreloadByID(ctx, attachment.ID, "Task")
		if err != nil {
			return nil, err
		}
		return fullAttachment, nil
	}

}

func (s *service) GetAll(ctx context.Context) ([]Attachment, error) {
	attachments, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	var fullAttachments []Attachment
	for _, c := range attachments {
		if c.CourseId != nil {
			fullAttachment, err := s.repo.PreloadByID(ctx, c.ID, "Course")
			if err != nil {
				return nil, err
			}
			fullAttachments = append(fullAttachments, *fullAttachment)
		} else {
			fullAttachment, err := s.repo.PreloadByID(ctx, c.ID, "Task")
			if err != nil {
				return nil, err
			}
			fullAttachments = append(fullAttachments, *fullAttachment)
		}

	}

	return fullAttachments, nil
}

func (s *service) Update(ctx context.Context, dto *AttachmentDTO, id string) (*Attachment, error) {
	attachment, err := s.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if dto.Name != "" {
		attachment.Name = dto.Name
	}
	if dto.Type != "" {
		attachment.Type = dto.Type
	}
	if dto.Path != "" {
		attachment.Path = dto.Path
	}
	return attachment, s.repo.Update(ctx, attachment)
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
