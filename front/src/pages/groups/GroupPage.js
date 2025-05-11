import React, { useEffect, useState } from 'react';
import {
  getGroupById,
  updateGroup,
  deleteGroup
} from '../../api/groups';
import {
  getMembershipByUserAndGroup,
  getAllMemberships,
  createMembership,
  updateMembership
} from '../../api/memberships';
import {
  getUsers
} from '../../api/users';
import { getRoleById } from '../../api/roles';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { getRoles } from '../../api/roles';
import './GroupPage.css';


function GroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [originalGroup, setOriginalGroup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [roles, setRoles] = useState({});  // Состояние для хранения ролей участников
  const [availableRoles, setAvailableRoles] = useState([]); // Массив всех ролей


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupRes, usersRes, membershipsRes] = await Promise.all([
          getGroupById(id),
          getUsers(),
          getAllMemberships()
        ]);

        const groupData = groupRes.data;
        setGroup(groupData);
        setOriginalGroup(groupData);
        setUsers(usersRes.data);
        setMemberships(membershipsRes.data);

        const members = membershipsRes.data.filter(m => m.group_id === groupData.id);
        setGroupMembers(members);

        // Загружаем роли для участников
        const rolesObj = {};
        for (let m of members) {
          const roleRes = await getRoleById(m.role_id);
          rolesObj[m.user_id] = roleRes.data.name;
        }
        setRoles(rolesObj);

        const rolesRes = await getRoles();
        setAvailableRoles(rolesRes.data);

        if (user) {
          const member = members.find(m => m.user_id === user.id);
          const role = rolesRes.data.find(r => r.id === member?.role_id);
          if (role?.name === 'admin') {
            setIsAdmin(true);
          }
        }
        
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные группы');
      }
    };

    fetchData();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroup(prev => {
      const updated = { ...prev, [name]: value };
      setIsChanged(JSON.stringify(updated) !== JSON.stringify(originalGroup));
      return updated;
    });
  };

  const handleSave = () => setIsSaveModalOpen(true);
  const handleConfirmSave = () => {
    updateGroup(id, group)
      .then(() => {
        setOriginalGroup(group);
        setIsEditing(false);
        setIsChanged(false);
        setIsSaveModalOpen(false);
      })
      .catch(err => {
        console.error('Ошибка при сохранении:', err);
        alert('Не удалось сохранить');
      });
  };

  const handleCancel = () => isChanged ? setIsModalOpen(true) : setIsEditing(false);
  const handleConfirmCancel = () => {
    setGroup(originalGroup);
    setIsEditing(false);
    setIsModalOpen(false);
  };
  const handleDelete = () => setIsDeleteModalOpen(true);
  const handleConfirmDelete = () => {
    deleteGroup(id)
      .then(() => navigate('/groups'))
      .catch(err => {
        console.error('Ошибка при удалении:', err);
        alert('Не удалось удалить');
      });
  };

  const handleAddMember = async (userId) => {
    try {
      const userRole = availableRoles.find(role => role.name === 'user');
  
      if (!userRole) {
        alert('Роль "user" не найдена');
        return;
      }
  
      await createMembership({
        user_id: userId,
        group_id: group.id,
        role_id: userRole.id,
      });
  
      const updatedMemberships = await getAllMemberships();
      const members = updatedMemberships.data.filter(m => m.group_id === group.id);
      setMemberships(updatedMemberships.data);
      setGroupMembers(members);
    } catch (err) {
      console.error('Ошибка при добавлении участника:', err.response?.data || err.message);
      alert('Не удалось добавить участника');
    }
  };
  
  const handleRoleChange = async (userId, roleName) => {
    try {
      const rolesRes = await getRoles();
      const role = rolesRes.data.find(r => r.name === roleName);
  
      if (!role) {
        alert(`Роль "${roleName}" не найдена`);
        return;
      }
  
      await updateMembership(userId, group.id, { role_id: role.id });
  
      const membershipRes = await getMembershipByUserAndGroup(userId, group.id);
      const updatedMembership = membershipRes.data;
  
      const updated = memberships.map(m =>
        m.user_id === userId && m.group_id === group.id
          ? updatedMembership
          : m
      );
  
      setMemberships(updated);
      setGroupMembers(updated.filter(m => m.group_id === group.id));
  
      setRoles(prev => ({
        ...prev,
        [userId]: role.name
      }));
    } catch (err) {
      console.error('Ошибка при обновлении роли:', err.response?.data || err.message);
      alert('Не удалось изменить роль');
    }
  };
  
  
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!group) return <p>Загрузка...</p>;

  const memberUserIds = groupMembers.map(m => m.user_id);
  const nonMembers = users.filter(u => !memberUserIds.includes(u.id));

  return (
    <div className="edit_form">
      <div className='header'>
        {!isEditing && <button onClick={() => navigate('/groups')}>Назад к списку групп</button>}
        <h1>{isEditing ? 'Редактирование группы' : group.name}</h1>
        <div>
          {isEditing ? (
            <div className='form_inputs'>
              <label>Название:</label>
              <input name="name" value={group.name} onChange={handleChange} />
              <label>Описание:</label>
              <textarea name="description" value={group.description} onChange={handleChange} />
              <div className="buttons">
                <button onClick={handleSave} disabled={!isChanged}>Сохранить</button>
                <button onClick={handleCancel}>Отменить</button>
                <button onClick={handleDelete} className='delete'>Удалить группу</button>
              </div>
            </div>
          ) : (
            <>
              <p className='comment'>{group.description}</p>
              {isAdmin && !isEditing && <button onClick={() => setIsEditing(true)}>Редактировать</button>}
            </>
          )}
        </div>
      </div>
      <div className='content'>
        <h2>Участники</h2>
        <ul>
          {groupMembers.map(m => {
            const u = users.find(u => u.id === m.user_id);
            const role = roles[m.user_id] || 'user';  // Получаем роль из состояния
            return (
              <li key={m.user_id} className="user">
                <div className='user_info'>
                  <p>{u?.name || 'Без имени'}</p>
                  <small className='email'>{u?.email} </small>
                </div>
                
                {isEditing ? (
                  <select value={role} onChange={(e) => handleRoleChange(m.user_id, e.target.value)} disabled={!isAdmin}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <p>{role}</p>
                )}
              </li>
            );
          })}
        </ul>

        {isAdmin && isEditing && (
          <>
            <h3>Добавить участника</h3>
            <ul>
              {nonMembers.map(u => (
                <li key={u.id} className="user">
                  <div className='user_info'>
                    <p>{u.name}</p>
                    <small>{u.email}</small>
                  </div>
                  <button onClick={() => handleAddMember(u.id)}>Добавить</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        title="Отмена"
        message="Отменить изменения?"
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsModalOpen(false)}
      />

      <Modal
        isOpen={isSaveModalOpen}
        title="Сохранение"
        message="Сохранить изменения?"
        onConfirm={handleConfirmSave}
        onCancel={() => setIsSaveModalOpen(false)}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        title="Удаление"
        message="Удалить эту группу?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}

export default GroupPage;
