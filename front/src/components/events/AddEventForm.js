import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../api/events';
import { getCourses } from '../../api/courses';
import { getAllMemberships } from '../../api/memberships';
import { getRoles } from '../../api/roles';
import { useAuth } from '../../contexts/AuthContext';

function AddEventForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    start: '',
    location: '',
    courseId: '',
  });

  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesRes, membershipsRes, rolesRes] = await Promise.all([
          getCourses(),
          getAllMemberships(),
          getRoles(),
        ]);

        const allCourses = coursesRes.data;
        const allMemberships = membershipsRes.data;
        const allRoles = rolesRes.data;

        // Получаем id роли администратора
        const adminRoleId = allRoles.find(r => r.name === 'admin')?.id;

        // Фильтруем курсы, для которых текущий пользователь является администратором
        const userAdminCourses = allCourses.filter(course => {
          const groupId = course.groupId;
          const isAdmin = allMemberships.some(
            membership =>
              membership.user_id === user.id &&
              membership.group_id === groupId &&
              membership.role_id === adminRoleId
          );
          return isAdmin;
        });

        setCourses(userAdminCourses); // Отображаем только те курсы, где пользователь администратор
      } catch (err) {
        setError('Не удалось загрузить курсы');
      }
    }

    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, location, courseId, start } = form;

    if (!start) {
      setError('Укажите дату и время проведения');
      return;
    }

    const isoDate = new Date(start);

    if (isNaN(isoDate.getTime())) {
      setError('Некорректный формат даты и времени');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      location: location.trim(),
      courseId,
      start: isoDate.toISOString(), // <--- критически важно
    };

    try {
      await createEvent(payload);
      navigate('/events');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Неизвестная ошибка';

      setError(`Ошибка при создании события: ${msg}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="border p-4 rounded space-y-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Название"
          required
          className="block border p-1 w-full"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Описание"
          className="block border p-1 w-full"
        />

        <select
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          required
          className="block border p-1 w-full"
        >
          <option value="" disabled hidden>Выберите курс</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <label className="block">Когда</label>
        <input
          type="datetime-local"
          name="start"
          value={form.start}
          onChange={handleChange}
          required
          className="block border p-1 w-full"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Где"
          className="block border p-1 w-full"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Создать событие
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>

      <button onClick={() => navigate('/events')} className="mt-2 underline text-sm">
        Назад к событиям
      </button>
    </div>
  );
}

export default AddEventForm;
