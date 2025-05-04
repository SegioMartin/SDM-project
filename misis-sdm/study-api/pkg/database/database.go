package database

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"study-api/internal/attachment"
	"study-api/internal/course"
	"study-api/internal/event"
	"study-api/internal/group"
	"study-api/internal/membership"
	"study-api/internal/role"
	"study-api/internal/task"
	"study-api/internal/taskCompletion"
	"study-api/internal/user"
)

func InitDB() (*gorm.DB, error) {
	host := os.Getenv("DB_HOST")
	usr := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, usr, password, dbname, port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	if err := db.AutoMigrate(user.User{}); err != nil {
		log.Fatalf("failed to auto migrate: %v", err)
	}

	if err := db.AutoMigrate(role.Role{}); err != nil {
		log.Fatalf("failed to auto migrate: %v", err)
	}

	if err := db.AutoMigrate(group.Group{}); err != nil {
		log.Fatalf("failed to auto migrate: %v", err)
	}
	if err := db.AutoMigrate(course.Course{}); err != nil {
		log.Fatalf("failed to auto migrate: %v", err)
	}
	if err := db.AutoMigrate(event.Event{}); err != nil {
		log.Fatalf("failed to auto migrate: %v", err)
	}
	if err := db.AutoMigrate(task.Task{}); err != nil {
		log.Fatalf("failed to auto migrate: %v", err)
	}
	if err := db.AutoMigrate(attachment.Attachment{}); err != nil {
		log.Fatalf("failed to auto migrate: %v", err)
	}
	if err := db.AutoMigrate(taskCompletion.TaskCompletion{}); err != nil {
		log.Fatalf("failed to auto migrate: %v", err)
	}
	if err := db.AutoMigrate(membership.Membership{}); err != nil {
		log.Fatalf("failed to auto migrate: %v", err)
	}
	return db, err
}
