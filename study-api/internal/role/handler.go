package role

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
	e.GET("/roles", h.GetAll)
	e.POST("/roles", h.Create)
	e.GET("/roles/:id", h.GetByID)
	e.PATCH("/roles/:id", h.Update)
	e.DELETE("/roles/:id", h.Delete)
}

func (h *Handler) Create(c echo.Context) error {
	var dto RoleDTO
	if err := c.Bind(&dto); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid request"})
	}

	role, err := h.service.Create(c.Request().Context(), &dto)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, role)
}

func (h *Handler) GetByID(c echo.Context) error {
	id := c.Param("id")

	role, err := h.service.GetByID(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "user not found"})
	}

	return c.JSON(http.StatusOK, role)
}

func (h *Handler) GetAll(c echo.Context) error {
	roles, err := h.service.GetAll(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, roles)
}

func (h *Handler) Update(c echo.Context) error {
	id := c.Param("id")
	var dto RoleDTO

	if err := c.Bind(&dto); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid request"})
	}

	role, err := h.service.Update(c.Request().Context(), &dto, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, role)
}

func (h *Handler) Delete(c echo.Context) error {
	id := c.Param("id")

	if err := h.service.Delete(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.NoContent(http.StatusNoContent)
}
