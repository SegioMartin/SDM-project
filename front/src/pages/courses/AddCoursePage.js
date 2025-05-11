import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroups } from '../../api/groups';
import { createCourse } from '../../api/courses';

function AddCoursePage() {
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState('');
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher: '',
    groupId: groupId || '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    getGroups()
      .then(res => {
        const group = res.data.find(g => g.id === groupId);
        if (group) {
          setGroupName(group.name);
        } else {
          setLoadError('Группа не найдена');
        }
      })
      .catch(() => setLoadError('Не удалось загрузить информацию о группе'));
  }, [groupId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse(formData);
      navigate('/courses');
    } catch (err) {
      if (err.response?.data?.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError('Ошибка при создании курса');
      }
    }
  };

  return (
    <div>
      {loadError && <p style={{ color: 'red' }}>{loadError}</p>}
      <form onSubmit={handleSubmit} className='form'>
        <button onClick={() => navigate('/courses')}>Назад к списку курсов</button>
        <h1>Новый курс для «{groupName || 'Загрузка...'}»</h1>
        <div className='input'>
          <div className='inputs'>
            <input
              name="name"
              placeholder="Название"
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Описание"
              onChange={handleChange}
              required
            />
            <input
              name="teacher"
              placeholder="Преподаватель"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Добавить курс</button>
          {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
        </div>
      </form>
    </div>
  );
}

export default AddCoursePage;
