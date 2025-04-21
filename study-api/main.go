package main

import (
	"net/http"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	attachmentHandler "study-api/internal/attachment"
	courseHandler "study-api/internal/course"
	eventHandler "study-api/internal/event"
	groupHandler "study-api/internal/group"
	membershipHandler "study-api/internal/membership"
	roleHandler "study-api/internal/role"
	taskHandler "study-api/internal/task"
	taskCompletionHandler "study-api/internal/taskCompletion"
	userHandler "study-api/internal/user"
	"study-api/pkg/database"
)

func main() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"}, // Replace with your React app's origin
		AllowMethods:     []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: false, // If you need to send cookies/auth headers
		ExposeHeaders:    []string{"Content-Length"},
		MaxAge:           3600,
	   }))
	e.Use(middleware.Logger())

	db, err := database.InitDB()
	if err != nil {
		e.Logger.Fatal(err)
	}

	userRepo := userHandler.NewRepository(db)
	roleRepo := roleHandler.NewRepository(db)
	groupRepo := groupHandler.NewRepository(db)
	courseRepo := courseHandler.NewRepository(db)
	eventRepo := eventHandler.NewRepository(db)
	taskRepo := taskHandler.NewRepository(db)
	attachmentRepo := attachmentHandler.NewRepository(db)
	taskCompetitionRepo := taskCompletionHandler.NewRepository(db)
	membershipRepo := membershipHandler.NewRepository(db)

	userService := userHandler.NewService(userRepo)
	roleService := roleHandler.NewService(roleRepo)
	groupService := groupHandler.NewService(groupRepo)
	courseService := courseHandler.NewService(courseRepo)
	eventService := eventHandler.NewService(eventRepo)
	taskService := taskHandler.NewService(taskRepo)
	attachmentService := attachmentHandler.NewService(attachmentRepo)
	taskCompetitionService := taskCompletionHandler.NewService(taskCompetitionRepo)
	membershipService := membershipHandler.NewService(membershipRepo)

	user := userHandler.NewHandler(userService)
	role := roleHandler.NewHandler(roleService)
	group := groupHandler.NewHandler(groupService)
	course := courseHandler.NewHandler(courseService)
	event := eventHandler.NewHandler(eventService)
	task := taskHandler.NewHandler(taskService)
	attachment := attachmentHandler.NewHandler(attachmentService)
	taskCompetition := taskCompletionHandler.NewHandler(taskCompetitionService)
	membership := membershipHandler.NewHandler(membershipService)

	api := e.Group("/api")

	user.RegisterRoutes(api)
	role.RegisterRoutes(api)
	group.RegisterRoutes(api)
	course.RegisterRoutes(api)
	event.RegisterRoutes(api)
	task.RegisterRoutes(api)
	attachment.RegisterRoutes(api)
	taskCompetition.RegisterRoutes(api)
	membership.RegisterRoutes(api)

	e.Logger.Fatal(e.Start(":8080"))
}
