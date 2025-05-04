# Используем официальный образ Go в качестве базового
FROM golang:1.21-alpine AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы go.mod и go.sum для управления зависимостями
COPY go.mod go.sum ./

# Загружаем зависимости
RUN go mod download

# Копируем исходный код приложения
COPY . .

# Компилируем приложение
RUN go build -o main .

# Создаем минимальный образ для запуска приложения (используем alpine linux)
FROM alpine:latest

# Копируем исполняемый файл из образа builder
COPY --from=builder /app/main /app/main

# Открываем порт 8080
EXPOSE 8080

# Запускаем приложение
CMD ["/app/main"]