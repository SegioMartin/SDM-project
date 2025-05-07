import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGroups } from '../../api/groups';
import AddCourseForm from '../../components/courses/AddCourseForm';

function AddCoursePage() {
  const { groupId } = useParams(); // Получаем groupId из параметров маршрута
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Загружаем название группы по groupId
    getGroups()
      .then(res => {
        const group = res.data.find(g => g.id === groupId);
        if (group) {
          setGroupName(group.name);
        } else {
          setError('Группа не найдена');
        }
      })
      .catch(() => setError('Не удалось загрузить информацию о группе'));
  }, [groupId]);

  return (
    <div>
      <h1>Добавить курс для группы «{groupName || 'Загрузка...'}»</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <AddCourseForm groupId={groupId} />
    </div>
  );
}

export default AddCoursePage;
