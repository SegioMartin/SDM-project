import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../api/groups';
import { createMembership } from '../../api/memberships';
import { useAuth } from '../../contexts/AuthContext';
import { getRoles, createRole } from '../../api/roles';
import './AddGroupPage.css';

function AddGroupPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const groupRes = await createGroup(formData);
      const groupId = groupRes.data.id;
  
      const rolesRes = await getRoles();
      let adminRole = rolesRes.data.find(role => role.name === 'admin');
  
      if (!adminRole) {
        const newRoleRes = await createRole({
          name: 'admin',
          description: 'Administrator of the group',
        });
        adminRole = newRoleRes.data;
      }
      let userRole = rolesRes.data.find(role => role.name === 'user');
  
      if (!userRole) {
        const newRoleRes = await createRole({
          name: 'user',
          description: 'User of the group',
        });
        userRole = newRoleRes.data;
      }
  
      await createMembership({
        user_id: user.id,
        group_id: groupId,
        role_id: adminRole.id,
      });
  
      navigate('/groups');
    } catch (err) {
      console.error('Ошибка при создании группы или роли:', err.response?.data || err.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="form">
      <button type="button" onClick={() => navigate('/groups')}>Назад к списку групп</button>
      <div className='input'>
        <div className='inputs'>
          <input
            name="name"
            placeholder="Название"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <input
            name="description"
            placeholder="Описание"
            onChange={handleChange}
            value={formData.description}
            required
          />
          </div>
        <button type="submit">Добавить группу</button>
      </div>
    </form>
  );
}

export default AddGroupPage;
