import React, { useState } from 'react';
import { createCourse } from '../../api/courses';
import { useNavigate } from 'react-router-dom';

function AddCourseForm({ groupId }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher: '',
    groupId: groupId || '', // Устанавливаем groupId по умолчанию
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse(formData);
      navigate('/courses');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // выводим текст из backend
      } else {
        setError('Ошибка при создании курса');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Название"
          onChange={handleChange}
          required
        />
        <input
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
        
        <button type="submit">Добавить курс</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <button onClick={() => navigate('/courses')}>Назад к списку курсов</button>
    </div>
  );
}

export default AddCourseForm;
