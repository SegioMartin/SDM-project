import React, { useEffect, useState } from 'react';
import { getCourses } from '../../api/courses';
import { getAllMemberships } from '../../api/memberships';
import { getGroups } from '../../api/groups';
import { getRoles } from '../../api/roles';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

function CoursesPage() {
  const [groupedCourses, setGroupedCourses] = useState({});
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesRes, membershipsRes, groupsRes, rolesRes] = await Promise.all([
          getCourses(),
          getAllMemberships(),
          getGroups(),
          getRoles(),
        ]);

        const allMemberships = membershipsRes.data;
        const allGroups = groupsRes.data;
        const allRoles = rolesRes.data;

        setMemberships(allMemberships);
        setGroups(allGroups);
        setRoles(allRoles);

        const userGroupIds = allMemberships
          .filter(m => m.user_id === user.id)
          .map(m => m.group_id);

        const grouped = {};
        allGroups.forEach(group => {
          if (userGroupIds.includes(group.id)) {
            const groupCourses = coursesRes.data.filter(course => course.groupId === group.id);
            grouped[group.id] = groupCourses;
          }
        });

        setGroupedCourses(grouped);
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

  const isAdmin = (groupId) => {
    const userMembership = memberships.find(m => m.user_id === user.id && m.group_id === groupId);
    if (!userMembership) return false;
    const userRole = roles.find(role => role.id === userMembership.role_id);
    return userRole?.name === 'admin';
  };

  return (
    <div>
      <h1>Мои курсы</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {groups
        .filter(group => memberships.some(m => m.user_id === user.id && m.group_id === group.id))
        .map(group => {
          const courses = groupedCourses[group.id] || [];

          return (
            <div key={group.id}>
              <h2>«{group.name || 'Без названия'}»</h2>
              <div className="content">
                {courses.length === 0 && <p className='comment'>Чилл, курсов нет...</p>}
                <ul>
                  {courses.map(course => (
                    <Link to={`/course/${course.id}`}>  
                      <li key={course.id} className="group_info">
                        <strong>{course.name}</strong>
                        <p>{course.description}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
                {isAdmin(group.id) && (
                  <Link to={`/add-course/${group.id}`}>
                    <button>Добавить курс</button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default CoursesPage;
