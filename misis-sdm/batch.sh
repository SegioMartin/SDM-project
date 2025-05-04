#!/bin/bash

# Имя проекта Docker Compose (используется для операций)
PROJECT_NAME="misis-sdm"

# Имя сервиса, который нужно пересобрать
SERVER_SERVICE="server"

# Функция для пересборки сервиса server
rebuild() {
  echo "Пересборка сервиса $SERVER_SERVICE..."

  # Останавливаем и удаляем контейнер server (если он существует)
  docker stop "${PROJECT_NAME}-${SERVER_SERVICE}-1" 2>/dev/null || true
  docker rm "${PROJECT_NAME}-${SERVER_SERVICE}-1" 2>/dev/null || true

  # Удаляем образ server (если он существует)
  docker rmi "${PROJECT_NAME}-${SERVER_SERVICE}" 2>/dev/null || true

  # Запускаем пересборку и запуск сервиса
  docker-compose build $SERVER_SERVICE  # Важно: --no-cache для новой сборки
  docker-compose up -d $SERVER_SERVICE

  echo "Сервис $SERVER_SERVICE пересобран и запущен."
}

# Функция для полного рестарта всех сервисов
restart() {
  echo "Полный рестарт всех сервисов..."

  # Останавливаем и удаляем все контейнеры
  docker-compose down

  # Удаляем образ server (если он существует)
  docker rmi "${PROJECT_NAME}-${SERVER_SERVICE}" 2>/dev/null || true

  # Запускаем все сервисы
  docker-compose up -d

  echo "Все сервисы перезапущены."
}

# Обработка аргументов командной строки
case "$1" in
  "rebuild")
    rebuild
    ;;
  "restart")
    restart
    ;;
  *)
    echo "Использование: $0 {rebuild|restart}"
    exit 1
    ;;
esac

exit 0

