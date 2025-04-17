package taskCompletion

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(e *echo.Group) {
	e.GET("/tasksCompletion", h.GetAll)
	e.POST("/tasksCompletion", h.Create)
	e.GET("/users/:userId/tasksCompletion/:taskID", h.GetByID)
	e.PATCH("/users/:userId/tasksCompletion/:taskID", h.Update)
	e.DELETE("/users/:userId/tasksCompletion/:taskID", h.Delete)
}

func (h *Handler) Create(c echo.Context) error {
	var dto TaskCompletionDTO
	if err := c.Bind(&dto); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid request"})
	}

	taskCompletion, err := h.service.Create(c.Request().Context(), &dto)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, taskCompletion)
}

func (h *Handler) GetByID(c echo.Context) error {
	userId := c.Param("userId")
	taskId := c.Param("taskID")

	taskCompletion, err := h.service.GetByID(c.Request().Context(), userId, taskId)
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "user not found"})
	}

	return c.JSON(http.StatusOK, taskCompletion)
}

func (h *Handler) GetAll(c echo.Context) error {
	tasksCompletion, err := h.service.GetAll(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, tasksCompletion)
}

func (h *Handler) Update(c echo.Context) error {
	userId := c.Param("userId")
	taskId := c.Param("taskID")
	var dto TaskCompletionDTO

	if err := c.Bind(&dto); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid request"})
	}

	taskCompletion, err := h.service.Update(c.Request().Context(), &dto, userId, taskId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, taskCompletion)
}

func (h *Handler) Delete(c echo.Context) error {
	userId := c.Param("userId")
	taskId := c.Param("taskID")

	if err := h.service.Delete(c.Request().Context(), userId, taskId); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.NoContent(http.StatusNoContent)
}
