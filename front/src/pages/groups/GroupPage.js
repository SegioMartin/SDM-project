import React, { useEffect, useState } from 'react';
import { getGroupById, updateGroup, deleteGroup } from '../../api/groups'; // Импортируем необходимые API
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal'; // Подключаем универсальную модалку

function GroupPage() {
  const { id } = useParams(); // Получаем ID группы из URL
  const [group, setGroup] = useState(null);
  const [originalGroup, setOriginalGroup] = useState(null); // Храним исходные данные группы
  const [isEditing, setIsEditing] = useState(false); // Статус редактирования
  const [isModalOpen, setIsModalOpen] = useState(false); // Модалка для отмены изменений
  const [isChanged, setIsChanged] = useState(false); // Отслеживаем, были ли изменения
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false); // Модалка для подтверждения сохранения
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Модалка для подтверждения удаления
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getGroupById(id)
      .then((res) => {
        setGroup(res.data);
        setOriginalGroup(res.data); // Сохраняем исходное состояние
      })
      .catch((err) => {
        console.error('Ошибка при получении группы:', err);
        setError('Не удалось загрузить группу');
      });
  }, [id]);

  // Функция для обработки изменений в полях
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroup(prevGroup => {
      const updatedGroup = { ...prevGroup, [name]: value };
      // Проверяем, были ли изменения
      setIsChanged(JSON.stringify(updatedGroup) !== JSON.stringify(originalGroup));
      return updatedGroup;
    });
  };

  // Функция для сохранения изменений
  const handleSave = () => {
    setIsSaveModalOpen(true); // Показываем модалку для подтверждения сохранения
  };

  // Подтверждение сохранения в модалке
  const handleConfirmSave = () => {
    updateGroup(id, group)
      .then(() => {
        setOriginalGroup(group); // Обновляем исходные данные группы
        setIsEditing(false); // Завершаем редактирование
        setIsChanged(false); // Сбрасываем изменения
        setIsSaveModalOpen(false); // Закрываем модалку
      })
      .catch((err) => {
        console.error('Ошибка при сохранении группы:', err);
        alert('Не удалось сохранить изменения');
      });
  };

  // Функция для отмены изменений
  const handleCancel = () => {
    if (isChanged) {
      setIsModalOpen(true); // Показываем модалку, если есть изменения
    } else {
      setIsEditing(false); // Если изменений нет, просто выходим из режима редактирования
    }
  };

  const handleConfirmCancel = () => {
    setGroup(originalGroup); // Возвращаем данные в исходное состояние
    setIsEditing(false); // Закрываем режим редактирования
    setIsModalOpen(false); // Закрываем модалку
  };

  const handleCancelModal = () => {
    setIsModalOpen(false); // Закрываем модалку без изменений
  };

  // Функция для удаления группы
  const handleDelete = () => {
    setIsDeleteModalOpen(true); // Показываем модалку для подтверждения удаления
  };

  // Подтверждение удаления в модалке
  const handleConfirmDelete = () => {
    deleteGroup(id)
      .then(() => {
        navigate('/groups'); // Перенаправляем на страницу списка групп после удаления
      })
      .catch((err) => {
        console.error('Ошибка при удалении группы:', err);
        alert('Не удалось удалить группу');
      });
  };

  const handleCancelDeleteModal = () => {
    setIsDeleteModalOpen(false); // Закрываем модалку без удаления
  };

  // Сбрасываем состояние изменения, когда пользователь выходит из режима редактирования
  useEffect(() => {
    if (!isEditing) {
      setIsChanged(false); // Сбрасываем состояние изменений при выходе из редактирования
    }
  }, [isEditing]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!group) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>{isEditing ? 'Редактирование группы' : 'Страница группы'}</h1>
      <div>
        {isEditing ? (
          <div>
            <div>
              <label>Название группы:</label>
              <input
                type="text"
                name="name"
                value={group.name}
                onChange={handleChange}
                placeholder="Название группы"
              />
            </div>
            <div>
              <label>Описание группы:</label>
              <textarea
                name="description"
                value={group.description}
                onChange={handleChange}
                placeholder="Описание группы"
              />
            </div>
          </div>
        ) : (
          <div>
            <div>
              <strong>Название:</strong> {group.name}
            </div>
            <div>
              <strong>Описание:</strong> {group.description}
            </div>
          </div>
        )}
      </div>

      <div>
        {!isEditing && (
          <>
            <button onClick={() => navigate('/groups')}>Назад к списку групп</button>
          </>
        )}

        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={!isChanged}>Сохранить</button>
            <button onClick={handleCancel}>Отменить</button>
            <button onClick={handleDelete}>Удалить группу</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
        )}
      </div>

      {/* Модалка для отмены изменений */}
      <Modal
        isOpen={isModalOpen}
        title="Вы уверены?"
        message="Вы уверены, что хотите отменить изменения?"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
      />

      {/* Модалка для подтверждения сохранения изменений */}
      <Modal
        isOpen={isSaveModalOpen}
        title="Подтверждение"
        message="Вы уверены, что хотите сохранить изменения?"
        onConfirm={handleConfirmSave}
        onCancel={() => setIsSaveModalOpen(false)}
      />

      {/* Модалка для подтверждения удаления группы */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Подтверждение удаления"
        message="Вы уверены, что хотите удалить эту группу?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDeleteModal}
      />
    </div>
  );
}

export default GroupPage;
