import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {
  getAttachmentsByCourse,
  createAttachment,
  deleteAttachment,
} from '../../api/attachments';

const Attachments = forwardRef(({ courseId, isEditing }, ref) => {
  const [attachments, setAttachments] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  useImperativeHandle(ref, () => ({
    isDirty,
    resetDirty: () => setIsDirty(false),
  }));

  useEffect(() => {
    if (courseId) {
      getAttachmentsByCourse(courseId)
        .then((res) => setAttachments(res.data))
        .catch((err) => console.error('Ошибка загрузки вложений:', err));
    }
  }, [courseId]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !courseId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_id', courseId);

    createAttachment(formData)
      .then((res) => {
        setAttachments((prev) => [...prev, res.data]);
        setIsDirty(true);
      })
      .catch((err) => console.error('Ошибка загрузки файла:', err));
  };

  const handleDelete = (id) => {
    deleteAttachment(id)
      .then(() => {
        setAttachments((prev) => prev.filter((att) => att.id !== id));
        setIsDirty(true);
      })
      .catch((err) => console.error('Ошибка удаления файла:', err));
  };

  return (
    <div>
      <h2>Файлы</h2>
      <ul>
        {attachments.map((att) => (
          <li key={att.id}>
            {att.name}
            {isEditing && (
              <button onClick={() => handleDelete(att.id)} style={{ marginLeft: '8px' }}>
                🗑
              </button>
            )}
          </li>
        ))}
      </ul>

      {isEditing && (
        <div>
          <input type="file" onChange={handleFileUpload} />
        </div>
      )}
    </div>
  );
});

export default Attachments;
