package course

import (
	"context"
	"errors"
	"github.com/google/uuid"
	"reflect"
	"study-api/internal/group"
	"testing"
)

type mockRepo struct {
	CreateFn      func(ctx context.Context, a *Course) error
	DeleteFn      func(ctx context.Context, id string) error
	GetAllFn      func(ctx context.Context) ([]Course, error)
	GetByIDFn     func(ctx context.Context, id string) (*Course, error)
	UpdateFn      func(ctx context.Context, a *Course) error
	PreloadByIDFn func(ctx context.Context, id string, fields ...string) (*Course, error)
}

func (m *mockRepo) Create(ctx context.Context, a *Course) error {
	return m.CreateFn(ctx, a)
}

func (m *mockRepo) Delete(ctx context.Context, id string) error {
	return m.DeleteFn(ctx, id)
}

func (m *mockRepo) GetAll(ctx context.Context) ([]Course, error) {
	return m.GetAllFn(ctx)
}

func (m *mockRepo) GetByID(ctx context.Context, id string) (*Course, error) {
	return m.GetByIDFn(ctx, id)
}

func (m *mockRepo) Update(ctx context.Context, a *Course) error {
	return m.UpdateFn(ctx, a)
}

func (m *mockRepo) PreloadByID(ctx context.Context, id string, fields ...string) (*Course, error) {
	return m.PreloadByIDFn(ctx, id, fields...)
}

func Test_service_Create(t *testing.T) {
	testGroup := group.Group{Name: "testGroup"}
	testGroup.ID = uuid.NewString()
	expected := &Course{Name: "Course 0", Description: "Course 0!", GroupId: testGroup.ID, Group: testGroup}

	s := &service{
		repo: &mockRepo{
			CreateFn: func(ctx context.Context, a *Course) error {
				a.ID = uuid.NewString()
				return nil
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Course, error) {
				return &Course{
					Name:        "Course 0",
					Description: "Course 0!",
					GroupId:     testGroup.ID,
					Group:       testGroup,
				}, nil
			},
		},
	}

	dto := &CourseDTO{Name: "Course 0", Description: "Course 0!", GroupId: testGroup.ID}
	got, err := s.Create(context.Background(), dto)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	expected.ID = got.ID
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
	expected := []Course{{Name: "Course 0", Description: "Course 0!", GroupId: testGroup.ID, Group: testGroup}}

	s := &service{
		repo: &mockRepo{
			GetAllFn: func(ctx context.Context) ([]Course, error) {
				return []Course{{Name: "Course 0", Description: "Course 0!", GroupId: testGroup.ID}}, nil
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Course, error) {
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
	expected := Course{Name: "Course 0", Description: "Course 0!", GroupId: testGroup.ID, Group: testGroup}
	expected.ID = uuid.NewString()

	s := &service{
		repo: &mockRepo{
			GetByIDFn: func(ctx context.Context, id string) (*Course, error) {
				if id == expected.ID {
					return &Course{Name: "Course 0", Description: "Course 0!", GroupId: testGroup.ID}, nil
				}
				return nil, errors.New("not found")
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Course, error) {
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
	expected := Course{Name: "Course 0", Description: "Course 0!", GroupId: testGroup.ID, Group: testGroup}
	expected.ID = uuid.NewString()

	s := &service{
		repo: &mockRepo{
			UpdateFn: func(ctx context.Context, a *Course) error {
				if a.ID == expected.ID {
					return nil
				}
				return errors.New("not found")
			},
			GetByIDFn: func(ctx context.Context, id string) (*Course, error) {
				if id == expected.ID {
					return &expected, nil
				}
				return nil, errors.New("not found")
			},
			PreloadByIDFn: func(ctx context.Context, id string, fields ...string) (*Course, error) {
				return &expected, nil
			},
		},
	}

	dto := &CourseDTO{Name: "Course 0", Description: "Course 0!", GroupId: testGroup.ID}
	got, err := s.Update(context.Background(), dto, expected.ID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !reflect.DeepEqual(got, &expected) {
		t.Errorf("Update() got = %v, want = %v", got, expected)
	}
}
