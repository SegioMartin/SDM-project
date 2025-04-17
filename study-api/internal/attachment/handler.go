package attachment

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
	e.GET("/attachments", h.GetAll)
	e.POST("/attachments", h.Create)
	e.GET("/attachments/:id", h.GetByID)
	e.PATCH("/attachments/:id", h.Update)
	e.DELETE("/attachments/:id", h.Delete)
}

func (h *Handler) Create(c echo.Context) error {
	var dto AttachmentDTO
	if err := c.Bind(&dto); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid request"})
	}

	attachment, err := h.service.Create(c.Request().Context(), &dto)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, attachment)
}

func (h *Handler) GetByID(c echo.Context) error {
	id := c.Param("id")

	attachment, err := h.service.GetByID(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "user not found"})
	}

	return c.JSON(http.StatusOK, attachment)
}

func (h *Handler) GetAll(c echo.Context) error {
	attachments, err := h.service.GetAll(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, attachments)
}

func (h *Handler) Update(c echo.Context) error {
	id := c.Param("id")
	var dto AttachmentDTO

	if err := c.Bind(&dto); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid request"})
	}

	attachment, err := h.service.Update(c.Request().Context(), &dto, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, attachment)
}

func (h *Handler) Delete(c echo.Context) error {
	id := c.Param("id")

	if err := h.service.Delete(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.NoContent(http.StatusNoContent)
}
