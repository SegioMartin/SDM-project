import React, { useEffect, useState } from 'react';
import { getCourseById, updateCourse, deleteCourse } from '../../api/courses';
import { getAllMemberships } from '../../api/memberships';
import { getGroups } from '../../api/groups';
import { getRoles } from '../../api/roles';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import { useAuth } from '../../contexts/AuthContext';

function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [originalCourse, setOriginalCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const courseRes = await getCourseById(id);
        const courseData = courseRes.data;
        setCourse(courseData);
        setOriginalCourse(courseData);

        const [membershipsRes, rolesRes] = await Promise.all([
          getAllMemberships(),
          getRoles()
        ]);

        const userMembership = membershipsRes.data.find(
          (m) => m.user_id === user.id && m.group_id === courseData.groupId
        );

        const userRole = rolesRes.data.find(
          (role) => role.id === userMembership?.role_id
        );

        setIsGroupAdmin(userRole?.name === 'admin');
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
        setError('Не удалось загрузить данные курса');
      }

      try {
        const groupsRes = await getGroups();
        setGroups(groupsRes.data);
      } catch (err) {
        console.error('Ошибка при получении групп:', err);
      }
    }

    fetchData();
  }, [id, user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => {
      const updated = { ...prev, [name]: value };
      checkIfChanged(updated);
      return updated;
    });
  };

  const checkIfChanged = (updatedCourse) => {
    const courseChanged = JSON.stringify(updatedCourse) !== JSON.stringify(originalCourse);
    setIsChanged(courseChanged);
  };

  const handleSave = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = () => {
    updateCourse(id, course)
      .then(() => {
        setOriginalCourse(course);
        setIsEditing(false);
        setIsChanged(false);
        setIsSaveModalOpen(false);
      })
      .catch((err) => {
        console.error('Ошибка при сохранении курса:', err);
        alert('Не удалось сохранить изменения');
      });
  };

  const handleCancel = () => {
    if (isChanged) {
      setIsModalOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleConfirmCancel = () => {
    setCourse(originalCourse);
    setIsEditing(false);
    setIsChanged(false);
    setIsModalOpen(false);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteCourse(id)
      .then(() => {
        navigate('/courses');
      })
      .catch((err) => {
        console.error('Ошибка при удалении курса:', err);
        alert('Не удалось удалить курс');
      });
  };

  const handleCancelDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    if (!isEditing) {
      setIsChanged(false);
    }
  }, [isEditing]);

  const getGroupName = (groupId) => {
    const group = groups.find((group) => group.id === groupId);
    return group ? group.name : 'Не указана';
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!course) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>{isEditing ? 'Редактирование курса' : 'Страница курса'}</h1>
      <div>
        {isEditing ? (
          <div>
            <div>
              <label>Название курса:</label>
              <input
                type="text"
                name="name"
                value={course.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Описание курса:</label>
              <textarea
                name="description"
                value={course.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Преподаватель:</label>
              <input
                type="text"
                name="teacher"
                value={course.teacher}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Группа:</label>
              <input
                type="text"
                name="groupId"
                value={getGroupName(course.groupId)}
                disabled
              />
            </div>
          </div>
        ) : (
          <div>
            <div><strong>Название:</strong> {course.name}</div>
            <div><strong>Описание:</strong> {course.description}</div>
            <div><strong>Преподаватель:</strong> {course.teacher}</div>
            <div><strong>Группа:</strong> {getGroupName(course.groupId) || 'Не указана'}</div>
          </div>
        )}
      </div>

      <div>
        {!isEditing && (
          <button onClick={() => navigate('/courses')}>Назад к списку курсов</button>
        )}
        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={!isChanged}>Сохранить</button>
            <button onClick={handleCancel}>Отменить</button>
            {isGroupAdmin && <button onClick={handleDelete}>Удалить курс</button>}
          </>
        ) : (
          isGroupAdmin && <button onClick={() => setIsEditing(true)}>Редактировать</button>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Вы уверены?"
        message="Вы уверены, что хотите отменить изменения?"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
      />

      <Modal
        isOpen={isSaveModalOpen}
        title="Подтверждение"
        message="Вы уверены, что хотите сохранить изменения?"
        onConfirm={handleConfirmSave}
        onCancel={() => setIsSaveModalOpen(false)}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        title="Подтверждение удаления"
        message="Вы уверены, что хотите удалить этот курс?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDeleteModal}
      />
    </div>
  );
}

export default CoursePage;
