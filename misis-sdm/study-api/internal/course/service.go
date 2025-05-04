package course

import (
	"context"
)

type Service interface {
	Create(ctx context.Context, u *CourseDTO) (*Course, error)
	GetByID(ctx context.Context, id string) (*Course, error)
	GetAll(ctx context.Context) ([]Course, error)
	Update(ctx context.Context, u *CourseDTO, id string) (*Course, error)
	Delete(ctx context.Context, id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, dto *CourseDTO) (*Course, error) {
	course := Course{
		Name:        dto.Name,
		Description: dto.Description,
		Teacher:     dto.Teacher,
		GroupId:     dto.GroupId,
	}

	if err := s.repo.Create(ctx, &course); err != nil {
		return nil, err
	}

	fullCourse, err := s.repo.PreloadByID(ctx, course.ID, "Group")
	if err != nil {
		return nil, err
	}

	return fullCourse, nil
}

func (s *service) GetByID(ctx context.Context, id string) (*Course, error) {
	course, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	fullCourse, err := s.repo.PreloadByID(ctx, course.ID, "Group")
	if err != nil {
		return nil, err
	}

	return fullCourse, nil
}

func (s *service) GetAll(ctx context.Context) ([]Course, error) {
	courses, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	var fullCourses []Course
	for _, c := range courses {
		fullCourse, err := s.repo.PreloadByID(ctx, c.ID, "Group")
		if err != nil {
			return nil, err
		}
		fullCourses = append(fullCourses, *fullCourse)
	}

	return fullCourses, nil
}

func (s *service) Update(ctx context.Context, dto *CourseDTO, id string) (*Course, error) {
	course, err := s.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if dto.Name != "" {
		course.Name = dto.Name
	}
	if dto.Description != "" {
		course.Description = dto.Description
	}
	if dto.Teacher != "" {
		course.Teacher = dto.Teacher
	}
	return course, s.repo.Update(ctx, course)
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
