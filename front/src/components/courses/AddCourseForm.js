import React, { useState, useEffect } from 'react';
import { createCourse } from '../../api/courses';
import { getGroups } from '../../api/groups';
import { useNavigate } from 'react-router-dom';

function AddCourseForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher: '',
    groupId: '',
  });
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getGroups()
      .then(res => setGroups(res.data))
      .catch(() => setError('Не удалось загрузить группы'));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createCourse(formData)
      .then(() => navigate('/courses'))
      .catch(() => alert('Ошибка при создании курса'));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Название" onChange={handleChange} required />
        <input name="description" placeholder="Описание" onChange={handleChange} required />
        <input name="teacher" placeholder="Преподаватель" onChange={handleChange} required />
        <select name="groupId" onChange={handleChange} required>
          <option value="">Выберите группу</option>
          {groups.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <button type="submit">Добавить курс</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <button onClick={() => navigate('/courses')}>Назад к списку курсов</button>
    </div>
  );
}

export default AddCourseForm;
