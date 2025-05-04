package attachment

import (
	"github.com/labstack/echo/v4"
	"io"
	"net/http"
	"os"
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
	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "file is required"})
	}

	src, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "cannot open file"})
	}
	defer src.Close()

	name := c.FormValue("name")
	typ := c.FormValue("type")
	courseId := c.FormValue("course_id")
	taskId := c.FormValue("task_id")

	uploadDir := "uploads"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to create upload directory"})
	}

	dstPath := uploadDir + "/" + file.Filename
	dst, err := os.Create(dstPath)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "cannot save file"})
	}

	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "cannot save file"})
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to copy file"})
	}
	var dto AttachmentDTO
	if courseId != "" {
		dto.Name = name
		dto.Type = typ
		dto.Path = dstPath
		dto.CourseId = &courseId
	} else {
		dto.Name = name
		dto.Type = typ
		dto.Path = dstPath
		dto.TaskId = &taskId
	}

	att, err := h.service.Create(c.Request().Context(), &dto)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, att)
}

func (h *Handler) GetByID(c echo.Context) error {
	id := c.Param("id")

	attachment, err := h.service.GetByID(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "attachment not found"})
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
