package crud

type BaseEntity struct {
	ID string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
}
