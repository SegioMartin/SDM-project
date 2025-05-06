import React, { useEffect, useState } from 'react';
import { getCourseById, updateCourse, deleteCourse } from '../../api/courses';
import { getAttachmentsByCourse } from '../../api/attachments';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import Attachments from '../../components/attachments/Attachments';

function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [originalCourse, setOriginalCourse] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [originalAttachments, setOriginalAttachments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCourseById(id)
      .then(async (res) => {
        setCourse(res.data);
        setOriginalCourse(res.data);

        const resAttachments = await getAttachmentsByCourse(id);
        setAttachments(resAttachments.data);
        setOriginalAttachments(resAttachments.data);
      })
      .catch((err) => {
        console.error('Ошибка при получении курса:', err);
        setError('Не удалось загрузить курс');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => {
      const updated = { ...prev, [name]: value };
      checkIfChanged(updated, attachments);
      return updated;
    });
  };

  const checkIfChanged = (updatedCourse, updatedAttachments) => {
    const courseChanged = JSON.stringify(updatedCourse) !== JSON.stringify(originalCourse);
    const attachmentsChanged = JSON.stringify(updatedAttachments) !== JSON.stringify(originalAttachments);
    setIsChanged(courseChanged || attachmentsChanged);
  };

  const handleSave = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = () => {
    updateCourse(id, course)
      .then(() => {
        setOriginalCourse(course);
        setOriginalAttachments(attachments);
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
    setAttachments(originalAttachments);
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
              <label>ID группы:</label>
              <input
                type="text"
                name="groupId"
                value={course.groupId}
                onChange={handleChange}
              />
            </div>
          </div>
        ) : (
          <div>
            <div><strong>Название:</strong> {course.name}</div>
            <div><strong>Описание:</strong> {course.description}</div>
            <div><strong>Преподаватель:</strong> {course.teacher}</div>
            <div><strong>Группа:</strong> {course.groupId || 'Не указана'}</div>
          </div>
        )}
      </div>

      <Attachments
        courseId={id}
        isEditing={isEditing}
        attachments={attachments}
        setAttachments={(newList) => {
          setAttachments(newList);
          checkIfChanged(course, newList);
        }}
      />

      <div>
        {!isEditing && (
          <button onClick={() => navigate('/courses')}>Назад к списку курсов</button>
        )}
        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={!isChanged}>Сохранить</button>
            <button onClick={handleCancel}>Отменить</button>
            <button onClick={handleDelete}>Удалить курс</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
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
