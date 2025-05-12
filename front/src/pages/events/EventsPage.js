import React, { useEffect, useState } from 'react';
import { getEvents } from '../../api/events';
import { getAllMemberships } from '../../api/memberships';
import { getRoles } from '../../api/roles';
import { getCourses } from '../../api/courses';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './EventsPage.css';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        const [eventsRes, membershipsRes, rolesRes, coursesRes] = await Promise.all([
          getEvents(),
          getAllMemberships(),
          getRoles(),
          getCourses(),
        ]);

        const allEvents = eventsRes.data ?? [];
        const allMemberships = membershipsRes.data ?? [];
        const allRoles = rolesRes.data ?? [];
        const allCourses = coursesRes.data ?? [];

        setCourses(allCourses);

        const userGroupIds = allMemberships
          .filter(m => m.user_id === user.id)
          .map(m => m.group_id);

        const userCourseIds = allCourses
          .filter(course => userGroupIds.includes(course.groupId))
          .map(course => course.id);

        const filteredEvents = allEvents.filter(event =>
          event.courseId && userCourseIds.includes(event.courseId)
        );

        filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
        setEvents(filteredEvents);

        const adminRoleIds = allRoles.filter(r => r.name === 'admin').map(r => r.id);
        const userMemberships = allMemberships.filter(m => m.user_id === user.id);
        const userIsAdmin = userMemberships.some(m => adminRoleIds.includes(m.role_id));

        setIsAdmin(userIsAdmin);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить события');
      }
    }

    if (user?.id) {
      loadData();
    } else {
      setError('Пользователь не авторизован');
    }
  }, [user?.id]);

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Не указан';
  };

  const formatDateAndTime = (dateStr) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString(); // Форматируем только дату
    const formattedTime = date.toLocaleTimeString(); // Форматируем только время
    return { formattedDate, formattedTime };
  };

  return (
    <div>
      <h1>Мои события</h1>
      <div className="content">
        {isAdmin && (
          <Link to="/add-event">
            <button>Новое событие</button>
          </Link>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {events.length === 0 ? (
          <p className='comment'>Нет доступных событий</p>
        ) : (
          <ul>
            {events.map(event => {
              const { formattedDate, formattedTime } = formatDateAndTime(event.start);
              return (
                <Link to={`/event/${event.id}`} key={event.id}>
                  <li className="self_event_info">
                    <div className="event_info">
                      <div className="text">
                        <strong>{event.name}</strong>
                        <p>{event.description}</p>
                        
                      </div>
                      <div className='secondary_info'>
                        <div className="event-date-time">
                          <small>{formattedDate}</small>
                          <small>{formattedTime}</small>
                        </div>
                        <small>{getCourseName(event.courseId)}</small>
                      </div>
                    </div>
                  </li>
                </Link>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EventsPage;
