import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {
  createAttachment,
  deleteAttachment,
} from '../../api/attachments';

const Attachments = forwardRef(({ courseId, isEditing, attachments, setAttachments }, ref) => {
  const [fileInputKey, setFileInputKey] = useState(0);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useImperativeHandle(ref, () => ({}));

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !courseId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('type', 'file');
    formData.append('course_id', courseId);

    createAttachment(formData)
      .then((res) => {
        setAttachments([...attachments, res.data]); // важно использовать функцию из родителя
        setFileInputKey((prev) => prev + 1);
      })
      .catch((err) => console.error('Ошибка загрузки файла:', err));
  };

  const handleAddLink = () => {
    if (!newLinkName || !newLinkUrl) return;

    const formData = new FormData();
    formData.append('name', newLinkName);
    formData.append('type', 'link');
    formData.append('path', newLinkUrl);
    formData.append('course_id', courseId);

    createAttachment(formData)
      .then((res) => {
        setAttachments([...attachments, res.data]); // важно использовать функцию из родителя
        setNewLinkName('');
        setNewLinkUrl('');
      })
      .catch((err) => console.error('Ошибка добавления ссылки:', err));
  };

  const handleDelete = (id) => {
    deleteAttachment(id)
      .then(() => {
        setAttachments(attachments.filter((att) => att.id !== id)); // снова через родителя
      })
      .catch((err) => console.error('Ошибка удаления вложения:', err));
  };

  return (
    <div>
      <h2>Материалы</h2>
      <ul>
        {attachments.map((att) => (
          <li key={att.id}>
            {att.type === 'link' ? (
              <a href={att.path} target="_blank" rel="noopener noreferrer">
                {att.name}
              </a>
            ) : (
              <a href={`/${att.path}`} download>
                {att.name}
              </a>
            )}
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
          <div style={{ marginTop: '10px' }}>
            <label>Загрузить файл: </label>
            <input key={fileInputKey} type="file" onChange={handleFileUpload} />
          </div>

          <div style={{ marginTop: '10px' }}>
            <label>Добавить ссылку:</label>
            <input
              type="text"
              placeholder="Название"
              value={newLinkName}
              onChange={(e) => setNewLinkName(e.target.value)}
              style={{ marginLeft: '8px' }}
            />
            <input
              type="text"
              placeholder="URL"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              style={{ marginLeft: '8px' }}
            />
            <button onClick={handleAddLink} style={{ marginLeft: '8px' }}>
              ➕
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Attachments;
