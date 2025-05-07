import React, { useEffect, useState } from 'react';
import { getCourses } from '../../api/courses';
import { getAllMemberships } from '../../api/memberships';
import { getGroups } from '../../api/groups'; // Функция для получения всех групп
import { getRoles } from '../../api/roles'; // Функция для получения всех ролей
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

function CourseList() {
  const [groupedCourses, setGroupedCourses] = useState({}); // Состояние для курсов, сгруппированных по группам
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [groups, setGroups] = useState([]); // Состояние для всех групп
  const [roles, setRoles] = useState([]); // Состояние для ролей

  useEffect(() => {
    async function loadData() {
      try {
        // Загружаем все данные одновременно
        const [coursesRes, membershipsRes, groupsRes, rolesRes] = await Promise.all([
          getCourses(),
          getAllMemberships(),
          getGroups(), // Получаем все группы
          getRoles(), // Получаем все роли
        ]);
        console.log(coursesRes.data); 

        const allMemberships = membershipsRes.data;
        const allGroups = groupsRes.data;
        const allRoles = rolesRes.data;

        setMemberships(allMemberships); // Сохраняем членства в состоянии
        setGroups(allGroups); // Сохраняем все группы в состоянии
        setRoles(allRoles); // Сохраняем роли в состоянии

        // Получаем все уникальные группы, к которым относится пользователь
        const userGroupIds = allMemberships
          .filter(m => m.user_id === user.id)
          .map(m => m.group_id);

        // Группируем курсы по groupId
        const grouped = {};
        allGroups.forEach(group => {
          if (userGroupIds.includes(group.id)) {
            const groupCourses = coursesRes.data.filter(course => course.groupId === group.id);
            grouped[group.id] = groupCourses;  // Добавляем курсы или пустой массив
          }
        });
        console.log(grouped);

        setGroupedCourses(grouped); // Обновляем состояние с курсами по группам
      } catch (err) {
        console.error('Ошибка при загрузке курсов или членств:', err);
        setError('Не удалось загрузить курсы');
      }
    }

    if (user.id) {
      loadData();
    } else {
      setError('Пользователь не авторизован');
    }
  }, [user.id]);

  // Проверяем, является ли пользователь админом в группе
  const isAdmin = (groupId) => {
    const userMembership = memberships.find(m => m.user_id === user.id && m.group_id === groupId);
    
    if (!userMembership) return false;  // Если нет такого членства

    // Ищем роль по role_id
    const userRole = roles.find(role => role.id === userMembership.role_id);
    return userRole?.name === 'admin'; // если роль admin
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {groups
        .filter(group => memberships.some(m => m.user_id === user.id && m.group_id === group.id)) // Отображаем только группы, в которых есть пользователь
        .map(group => {
          const courses = groupedCourses[group.id] || [];  // Получаем курсы для текущей группы

          return (
            <div key={group.id}>
              <h2>Курсы группы «{group.name || 'Без названия'}»</h2>

              {/* Если нет курсов в группе, выводим соответствующее сообщение */}
              {courses.length === 0 && <p>Тут пока нет курсов</p>}




              <ul>
                {courses.map(course => (
                  <li key={course.id}>
                    <Link to={`/course/${course.id}`}>
                      <strong>{course.name}</strong> — {course.description}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Кнопка "Добавить курс" только для админов группы */}
              {isAdmin(group.id) && (
                <Link to={`/add-course/${group.id}`}>
                  <button>Добавить курс</button>
                </Link>
              )}              
            </div>
          );
        })}
    </div>
  );
}

export default CourseList;
