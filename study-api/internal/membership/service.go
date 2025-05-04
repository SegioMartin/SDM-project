package membership

import (
	"context"
	"errors"
	"time"
)

type Service interface {
	Create(ctx context.Context, dto *MembershipDTO) (*Membership, error)
	GetByID(ctx context.Context, userId, groupId string) (*Membership, error)
	GetAll(ctx context.Context) ([]Membership, error)
	Update(ctx context.Context, dto *MembershipDTO, userId, groupId string) (*Membership, error)
	Delete(ctx context.Context, userId, groupId string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, dto *MembershipDTO) (*Membership, error) {
	if dto.UserID == "" || dto.GroupID == "" {
		return nil, errors.New("user_id and group_id are required")
	}

	member := Membership{
		UserID:  dto.UserID,
		GroupID: dto.GroupID,
		Joined:  time.Now(),
		RoleID:  dto.RoleID,
	}

	if err := s.repo.Create(ctx, &member); err != nil {
		return nil, err
	}

	fullMember, err := s.repo.PreloadByCompositeID(ctx, "user_id", dto.UserID, "group_id", dto.GroupID, "User", "Group", "Role")
	if err != nil {
		return nil, err
	}

	return fullMember, nil
}

func (s *service) GetByID(ctx context.Context, userId, groupId string) (*Membership, error) {
	member, err := s.repo.GetByCompositeID(ctx, "user_id", userId, "group_id", groupId)
	if err != nil {
		return nil, err
	}

	fullMember, err := s.repo.PreloadByCompositeID(ctx, "user_id", member.UserID, "group_id", member.GroupID, "Role", "User", "Group")
	if err != nil {
		return nil, err
	}

	return fullMember, nil

}

func (s *service) GetAll(ctx context.Context) ([]Membership, error) {

	members, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	var fullMembers []Membership
	for _, c := range members {
		fullMember, err := s.repo.PreloadByCompositeID(ctx, "user_id", c.UserID, "group_id", c.GroupID, "Role", "User", "Group")
		if err != nil {
			return nil, err
		}
		fullMembers = append(fullMembers, *fullMember)
	}

	return fullMembers, nil
}

func (s *service) Update(ctx context.Context, dto *MembershipDTO, userId, groupId string) (*Membership, error) {
	member, err := s.GetByID(ctx, userId, groupId)
	if err != nil {
		return nil, err
	}
	if dto.RoleID != "" {
		member.RoleID = dto.RoleID
	}

	if err := s.repo.Update(ctx, member); err != nil {
		return nil, err
	}

	fullMember, err := s.repo.PreloadByCompositeID(ctx, "user_id", member.UserID, "group_id", member.GroupID, "Role", "User", "Group")
	if err != nil {
		return nil, err
	}

	return fullMember, nil
}

func (s *service) Delete(ctx context.Context, userId, groupId string) error {
	return s.repo.Delete(ctx, "user_id", userId, "group_id", groupId)
}
