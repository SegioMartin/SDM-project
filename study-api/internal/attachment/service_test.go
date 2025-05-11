package attachment

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
	CreateFn      func(ctx context.Context, a *Attachment) error
	DeleteFn      func(ctx context.Context, id string) error
	GetAllFn      func(ctx context.Context) ([]Attachment, error)
	GetByIDFn     func(ctx context.Context, id string) (*Attachment, error)
	UpdateFn      func(ctx context.Context, a *Attachment) error
	PreloadByIDFn func(ctx context.Context, id string, fields ...string) (*Attachment, error)
}

func (m *mockRepo) Create(ctx context.Context, a *Attachment) error {
	return m.CreateFn(ctx, a)
}

func (m *mockRepo) Delete(ctx context.Context, id string) error {
	return m.DeleteFn(ctx, id)
}

func (m *mockRepo) GetAll(ctx context.Context) ([]Attachment, error) {
	return m.GetAllFn(ctx)
}

func (m *mockRepo) GetByID(ctx context.Context, id string) (*Attachment, error) {
	return m.GetByIDFn(ctx, id)
}

func (m *mockRepo) Update(ctx context.Context, a *Attachment) error {
	return m.UpdateFn(ctx, a)
}

func (m *mockRepo) PreloadByID(ctx context.Context, id string, fields ...string) (*Attachment, error) {
	return m.PreloadByIDFn(ctx, id, fields...)
}

func Test_service_Create(t *testing.T) {
	testGroup := group.Group{Name: "testGroup"}
	testGroup.ID = uuid.NewString()
	testCourse := course.Course{Name: "testCourse", GroupId: testGroup.ID}
	testCourse.ID = uuid.NewString()
	expected := &Attachment{Name: "file", Type: "image/png", Path: "file.png", CourseId: &testCourse.ID, Course: testCourse}

	s := &service{
		repo: &mockRepo{
			CreateFn: func(ctx context.Context, a *Attachment) error {
				a.ID = uuid.NewString()
				return nil
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Attachment, error) {
				return &Attachment{
					Name:      "file",
					Type:      "image/png",
					Path:      "file.png",
					CourseId:  &testCourse.ID,
					Course:    testCourse,
					CreatedAt: time.Now(),
				}, nil
			},
		},
	}

	dto := &AttachmentDTO{Name: "file", Type: "image/png", Path: "file.png", CourseId: &testCourse.ID}
	got, err := s.Create(context.Background(), dto)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	expected.ID = got.ID
	expected.CreatedAt = got.CreatedAt
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
	expected := []Attachment{{Name: "file", Type: "image/png", Path: "file.png", CourseId: &testCourse.ID, Course: testCourse}}

	s := &service{
		repo: &mockRepo{
			GetAllFn: func(ctx context.Context) ([]Attachment, error) {
				return []Attachment{{Name: "file", Type: "image/png", Path: "file.png", CourseId: &testCourse.ID}}, nil
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Attachment, error) {
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
	expected := Attachment{Name: "file", Type: "image/png", Path: "file.png", CourseId: &testCourse.ID, Course: testCourse}
	expected.ID = uuid.NewString()

	s := &service{
		repo: &mockRepo{
			GetByIDFn: func(ctx context.Context, id string) (*Attachment, error) {
				if id == expected.ID {
					return &expected, nil
				}
				return nil, errors.New("not found")
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Attachment, error) {
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
	expected := Attachment{Name: "file", Type: "image/png", Path: "file.png", CourseId: &testCourse.ID, Course: testCourse}
	expected.ID = uuid.NewString()

	s := &service{
		repo: &mockRepo{
			UpdateFn: func(ctx context.Context, a *Attachment) error {
				if a.ID == expected.ID {
					return nil
				}
				return errors.New("not found")
			},
			GetByIDFn: func(ctx context.Context, id string) (*Attachment, error) {
				if id == expected.ID {
					return &expected, nil
				}
				return nil, errors.New("not found")
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Attachment, error) {
				return &expected, nil
			},
		},
	}

	dto := &AttachmentDTO{Name: "updated.pdf"}
	got, err := s.Update(context.Background(), dto, expected.ID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !reflect.DeepEqual(got, &expected) {
		t.Errorf("Update() got = %v, want = %v", got, expected)
	}
}
