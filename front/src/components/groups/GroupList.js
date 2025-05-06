import React, { useEffect, useState } from 'react';
import { getGroups } from '../../api/groups';
import { Link } from 'react-router-dom';

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getGroups()
      .then(res => setGroups(res.data))
      .catch(err => {
        console.error('Ошибка при загрузке групп:', err);
        setError('Не удалось загрузить группы');
      });
  }, []);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {groups.map(group => (
          <li key={group.id}>
            <Link to={`/group/${group.id}`}>
              <strong>{group.name}</strong> — {group.description}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupList;
