package membership

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
	e.GET("/memberships", h.GetAll)
	e.POST("/memberships", h.Create)
	e.GET("/users/:userId/memberships/:groupID", h.GetByID)
	e.PATCH("/users/:userId/memberships/:groupID", h.Update)
	e.DELETE("/users/:userId/memberships/:groupID", h.Delete)
}

func (h *Handler) Create(c echo.Context) error {
	var dto MembershipDTO
	if err := c.Bind(&dto); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid request"})
	}

	member, err := h.service.Create(c.Request().Context(), &dto)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, member)
}

func (h *Handler) GetByID(c echo.Context) error {
	userId := c.Param("userId")
	groupId := c.Param("groupID")

	member, err := h.service.GetByID(c.Request().Context(), userId, groupId)
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "user not found"})
	}

	return c.JSON(http.StatusOK, member)
}

func (h *Handler) GetAll(c echo.Context) error {
	members, err := h.service.GetAll(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, members)
}

func (h *Handler) Update(c echo.Context) error {
	userId := c.Param("userId")
	groupId := c.Param("groupID")
	var dto MembershipDTO

	if err := c.Bind(&dto); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid request"})
	}

	member, err := h.service.Update(c.Request().Context(), &dto, userId, groupId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, member)
}

func (h *Handler) Delete(c echo.Context) error {
	userId := c.Param("userId")
	groupId := c.Param("groupID")

	if err := h.service.Delete(c.Request().Context(), userId, groupId); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.NoContent(http.StatusNoContent)
}
