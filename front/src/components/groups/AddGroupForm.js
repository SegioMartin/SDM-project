import React, { useState } from 'react';
import { createGroup } from '../../api/groups';
import { useNavigate } from 'react-router-dom';

function AddGroupForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createGroup(formData).then(() => navigate('/groups')); // После создания переходим на страницу списка групп
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Название" onChange={handleChange} required />
      <input name="description" placeholder="Описание" onChange={handleChange} required />
      <button type="submit">Добавить группу</button>

      <button type="button" onClick={() => navigate('/groups')}>Назад к списку групп</button>
    </form>
  );
}

export default AddGroupForm;
