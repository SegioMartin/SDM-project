import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById, updateEvent, deleteEvent } from '../../api/events';
import { getCourseById, getCourses } from '../../api/courses';
import Modal from '../../components/Modal';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [originalEvent, setOriginalEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [courseName, setCourseName] = useState('');
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    getEventById(id).then(res => {
      setEvent(res.data);
      setOriginalEvent(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (event?.courseId && !isEditing) {
      getCourseById(event.courseId).then(res => setCourseName(res.data.name));
    }
  }, [event, isEditing]);

  useEffect(() => {
    if (isEditing) {
      getCourses().then(res => setCourseList(res.data));
    }
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    let updatedValue = value;
  
    // Преобразуем datetime-local в ISO-строку
    if (name === 'start') {
      const localDate = new Date(value);
      updatedValue = localDate.toISOString(); // ISO формат
    }
  
    setEvent(prev => {
      const updated = { ...prev, [name]: updatedValue };
      setIsChanged(JSON.stringify(updated) !== JSON.stringify(originalEvent));
      return updated;
    });
  };
  

  const handleSave = () => setIsSaveModalOpen(true);

  const handleConfirmSave = () => {
    updateEvent(id, event)
      .then(() => {
        setOriginalEvent(event);
        setIsChanged(false);
        setIsEditing(false);
        setIsSaveModalOpen(false);
      })
      .catch(() => alert('Ошибка при сохранении события'));
  };

  const handleCancel = () => {
    if (isChanged) {
      setIsCancelModalOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleConfirmCancel = () => {
    setEvent(originalEvent);
    setIsChanged(false);
    setIsEditing(false);
    setIsCancelModalOpen(false);
  };

  const handleDelete = () => setIsDeleteModalOpen(true);

  const handleConfirmDelete = () => {
    deleteEvent(id)
      .then(() => navigate('/events'))
      .catch(() => alert('Не удалось удалить событие'));
  };

  // Форматируем дату для отображения
  const formatDateTime = (ts) => ts ? new Date(ts).toLocaleString('ru-RU') : '';

  // Форматируем ISO дату в строку для поля datetime-local
  const formatDatetimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const local = new Date(date - tzOffset);
    return local.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
  };

  if (!event) return <p>Загрузка...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        {isEditing ? 'Редактирование события' : 'Страница события'}
      </h1>

      {isEditing ? (
        <>
          <input
            name="name"
            placeholder="Название"
            value={event.name}
            onChange={handleChange}
            className="block mb-2 border p-1"
          />
          <textarea
            name="description"
            placeholder="Описание"
            value={event.description}
            onChange={handleChange}
            className="block mb-2 border p-1"
          />
          <input
            name="location"
            placeholder="Где"
            value={event.location}
            onChange={handleChange}
            className="block mb-2 border p-1"
          />
          <label className="block">Когда</label>
          <input
            name="start"
            type="datetime-local"
            value={formatDatetimeLocal(event.start)}
            onChange={handleChange}
            className="block mb-2 border p-1"
          />
          <select
            name="courseId"
            value={event.courseId}
            onChange={handleChange}
            className="block mb-2 border p-1"
          >
            <option value="" disabled hidden>Выберите курс</option>
            {courseList.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <p><strong>Название:</strong> {event.name}</p>
          {event.description && <p><strong>Описание:</strong> {event.description}</p>}
          {event.location && <p><strong>Где:</strong> {event.location}</p>}
          {event.start && (
            <p><strong>Когда:</strong> {formatDateTime(event.start)}</p>
          )}
          {event.courseId && <p><strong>Курс:</strong> {courseName || 'Загрузка...'}</p>}
        </>
      )}

      <div className="mt-4 space-x-2">
        {!isEditing ? (
          <>
            <button onClick={() => navigate('/events')}>Назад</button>
            <button onClick={() => setIsEditing(true)}>Редактировать</button>
          </>
        ) : (
          <>
            <button onClick={handleSave} disabled={!isChanged}>Сохранить</button>
            <button onClick={handleCancel}>Отменить</button>
            <button onClick={handleDelete}>Удалить</button>
          </>
        )}
      </div>

      {/* Модалки */}
      <Modal
        isOpen={isCancelModalOpen}
        title="Отменить изменения?"
        message="Вы уверены, что хотите отменить все изменения?"
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsCancelModalOpen(false)}
      />

      <Modal
        isOpen={isSaveModalOpen}
        title="Сохранить изменения?"
        message="Вы уверены, что хотите сохранить изменения?"
        onConfirm={handleConfirmSave}
        onCancel={() => setIsSaveModalOpen(false)}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        title="Удалить событие?"
        message="Вы уверены, что хотите удалить это событие?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
