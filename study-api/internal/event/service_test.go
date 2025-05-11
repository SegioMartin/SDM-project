package event

import (
	"context"
	"errors"
	"github.com/google/uuid"
	"reflect"
	"study-api/internal/course"
	"study-api/internal/group"
	"testing"
	"time"
)

type mockRepo struct {
	CreateFn      func(ctx context.Context, a *Event) error
	DeleteFn      func(ctx context.Context, id string) error
	GetAllFn      func(ctx context.Context) ([]Event, error)
	GetByIDFn     func(ctx context.Context, id string) (*Event, error)
	UpdateFn      func(ctx context.Context, a *Event) error
	PreloadByIDFn func(ctx context.Context, id string, fields ...string) (*Event, error)
}

func (m *mockRepo) Create(ctx context.Context, a *Event) error {
	return m.CreateFn(ctx, a)
}

func (m *mockRepo) Delete(ctx context.Context, id string) error {
	return m.DeleteFn(ctx, id)
}

func (m *mockRepo) GetAll(ctx context.Context) ([]Event, error) {
	return m.GetAllFn(ctx)
}

func (m *mockRepo) GetByID(ctx context.Context, id string) (*Event, error) {
	return m.GetByIDFn(ctx, id)
}

func (m *mockRepo) Update(ctx context.Context, a *Event) error {
	return m.UpdateFn(ctx, a)
}

func (m *mockRepo) PreloadByID(ctx context.Context, id string, fields ...string) (*Event, error) {
	return m.PreloadByIDFn(ctx, id, fields...)
}

func Test_service_Create(t *testing.T) {
	testGroup := group.Group{Name: "testGroup"}
	testGroup.ID = uuid.NewString()
	testCourse := course.Course{Name: "testCourse", GroupId: testGroup.ID}
	testCourse.ID = uuid.NewString()
	expected := &Event{Name: "Course 0", Start: time.Now(), Location: "Here", CourseId: testCourse.ID, Course: testCourse}

	s := &service{
		repo: &mockRepo{
			CreateFn: func(ctx context.Context, a *Event) error {
				a.ID = uuid.NewString()
				return nil
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Event, error) {
				return &Event{
					Name:     "Course 0",
					Start:    time.Now(),
					Location: "Here",
					CourseId: testCourse.ID,
					Course:   testCourse,
				}, nil
			},
		},
	}

	dto := &EventDTO{Name: "Course 0", Start: time.Now(), Location: "Here", CourseId: testCourse.ID}
	got, err := s.Create(context.Background(), dto)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	expected.ID = got.ID
	expected.Start = got.Start
	if !reflect.DeepEqual(got, expected) {
		t.Errorf("Create() got = %v, want = %v", got, expected)
	}
}

func Test_service_Delete(t *testing.T) {
	s := &service{
		repo: &mockRepo{
			DeleteFn: func(ctx context.Context, id string) error {
				if id == "notfound" {
					return errors.New("not found")
				}
				return nil
			},
		},
	}

	err := s.Delete(context.Background(), "123")
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	err = s.Delete(context.Background(), "notfound")
	if err == nil {
		t.Errorf("expected error for notfound id")
	}
}

func Test_service_GetAll(t *testing.T) {
	testGroup := group.Group{Name: "testGroup"}
	testGroup.ID = uuid.NewString()
	testCourse := course.Course{Name: "testCourse", GroupId: testGroup.ID}
	testCourse.ID = uuid.NewString()
	expected := []Event{{Name: "Course 0", Start: time.Now(), Location: "Here", CourseId: testCourse.ID, Course: testCourse}}

	s := &service{
		repo: &mockRepo{
			GetAllFn: func(ctx context.Context) ([]Event, error) {
				return []Event{{Name: "Course 0", Start: time.Now(), Location: "Here", CourseId: testCourse.ID}}, nil
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Event, error) {
				return &expected[0], nil
			},
		},
	}

	got, err := s.GetAll(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !reflect.DeepEqual(got, expected) {
		t.Errorf("GetAll() got = %v, want = %v", got, expected)
	}
}

func Test_service_GetByID(t *testing.T) {
	testGroup := group.Group{Name: "testGroup"}
	testGroup.ID = uuid.NewString()
	testCourse := course.Course{Name: "testCourse", GroupId: testGroup.ID}
	testCourse.ID = uuid.NewString()
	expected := Event{Name: "Course 0", Start: time.Now(), Location: "Here", CourseId: testCourse.ID, Course: testCourse}
	expected.ID = uuid.NewString()

	s := &service{
		repo: &mockRepo{
			GetByIDFn: func(ctx context.Context, id string) (*Event, error) {
				if id == expected.ID {
					return &Event{Name: "Course 0", Start: time.Now(), Location: "Here", CourseId: testCourse.ID}, nil
				}
				return nil, errors.New("not found")
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Event, error) {
				return &expected, nil
			},
		},
	}

	got, err := s.GetByID(context.Background(), expected.ID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !reflect.DeepEqual(got, &expected) {
		t.Errorf("GetByID() got = %v, want = %v", got, expected)
	}
}

func Test_service_Update(t *testing.T) {
	testGroup := group.Group{Name: "testGroup"}
	testGroup.ID = uuid.NewString()
	testCourse := course.Course{Name: "testCourse", GroupId: testGroup.ID}
	testCourse.ID = uuid.NewString()
	expected := Event{Name: "Course 0", Start: time.Now(), Location: "Here", CourseId: testCourse.ID, Course: testCourse}
	expected.ID = uuid.NewString()

	s := &service{
		repo: &mockRepo{
			UpdateFn: func(ctx context.Context, a *Event) error {
				if a.ID == expected.ID {
					return nil
				}
				return errors.New("not found")
			},
			GetByIDFn: func(ctx context.Context, id string) (*Event, error) {
				if id == expected.ID {
					return &expected, nil
				}
				return nil, errors.New("not found")
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Event, error) {
				return &expected, nil
			},
		},
	}

	dto := &EventDTO{Name: "Course 0", Start: time.Now(), Location: "Here", CourseId: testCourse.ID}
	got, err := s.Update(context.Background(), dto, expected.ID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !reflect.DeepEqual(got, &expected) {
		t.Errorf("Update() got = %v, want = %v", got, expected)
	}
}
