import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGroups } from '../../api/groups';
import { getMembershipByUserAndGroup } from '../../api/memberships';
import { getRoles } from '../../api/roles';
import { useAuth } from '../../contexts/AuthContext';
import './GroupsPage.css';

function GroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupsForUser = async () => {
      try {
        if (!user) return;

        const groupsRes = await getGroups();
        const allGroups = groupsRes.data;

        // Загружаем роли
        const rolesRes = await getRoles();
        const rolesObj = rolesRes.data.reduce((obj, role) => {
          obj[role.id] = role.name; // Сохраняем роли по ID
          return obj;
        }, {});

        // Параллельно проверяем членство в каждой группе
        const checkPromises = allGroups.map(async (group) => {
          try {
            const membershipRes = await getMembershipByUserAndGroup(user.id, group.id);
            const roleName = rolesObj[membershipRes.data.role_id];
            return { group, roleName }; // Возвращаем группу и роль пользователя
          } catch (err) {
            return null;
          }
        });

        const results = await Promise.all(checkPromises);
        const userGroups = results.filter(g => g !== null);

        setGroups(userGroups);
      } catch (err) {
        console.error('Ошибка при загрузке групп:', err);
        setError('Не удалось загрузить группы');
      }
    };

    fetchGroupsForUser();
  }, [user]);

  return (
    <div>
      <h1>Мои группы</h1>
      <div className="content">
        <Link to="/add-group">
          <button>Новая группа</button>
        </Link>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {groups.map(({ group, roleName }) => (
            <Link to={`/group/${group.id}`} key={group.id}>
              <li className="self_group_info">
                <div className="group_info">
                  <strong>{group.name}</strong>
                  <p>{group.description}</p>
                </div>
                <p>{roleName === 'admin' ? roleName : ''}</p>
              </li>
            </Link>
          ))}
        </ul>
        
      </div>
    </div>
  );
}

export default GroupsPage;
