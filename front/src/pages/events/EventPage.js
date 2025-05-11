import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById, updateEvent, deleteEvent } from '../../api/events';
import { getAllMemberships } from '../../api/memberships';
import { getRoles } from '../../api/roles';
import { getCourses } from '../../api/courses';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Modal';

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [originalEvent, setOriginalEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [adminCourseIds, setAdminCourseIds] = useState([]);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    if (id && user?.id) {
      async function loadData() {
        try {
          console.log("Запрос к API для получения данных события с ID:", id); // Логируем ID события
  
          // Загружаем событие, курсы, участников и роли
          const [eventRes, coursesRes, membershipsRes, rolesRes] = await Promise.all([
            getEventById(id),
            getCourses(),
            getAllMemberships(),
            getRoles(),
          ]);
  
          console.log("Ответ от API:", eventRes, coursesRes, membershipsRes, rolesRes); // Логируем ответы
  
          const eventData = eventRes.data;
          const allCourses = coursesRes.data;
          const allMemberships = membershipsRes.data;
          const allRoles = rolesRes.data;
  
          setEvent(eventData);
          setOriginalEvent(eventData);
  
          const course = allCourses.find(c => c.id === eventData.courseId);
          if (course) setCourseName(course.name);
  
          const groupId = course?.groupId;
          const adminRoleId = allRoles.find(r => r.name === 'admin')?.id;
  
          const isAdmin = allMemberships.some(m =>
            m.user_id === user.id &&
            m.group_id === groupId &&
            m.role_id === adminRoleId
          );
  
          if (isAdmin) {
            setAdminCourseIds([eventData.courseId]);
          }
  
        } catch (err) {
          console.error('Failed to load data:', err); // Логируем ошибки запроса
        }
      }
  
      loadData();
    }
  }, [id, user?.id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;
    if (name === 'start') {
      const localDate = new Date(value);
      updatedValue = localDate.toISOString();
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

  const formatDateTime = (ts) => ts ? new Date(ts).toLocaleString('ru-RU') : '';
  const formatDatetimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const local = new Date(date - tzOffset);
    return local.toISOString().slice(0, 16);
  };

  if (!event) return <p>Загрузка...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        {isEditing ? `Редактирование события для курса "${courseName}"` : 'Страница события'}
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
          {/* Курс не меняется, но показывается */}
          <div className="mb-2">
            <strong>Курс:</strong> {courseName}
          </div>
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
            {adminCourseIds.includes(event?.courseId) && (
              <button onClick={() => setIsEditing(true)}>Редактировать</button>
            )}
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
