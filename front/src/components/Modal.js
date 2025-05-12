import React from 'react';
import './modal.css'; // Стили для модалки

// Универсальный компонент модального окна
function Modal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <p className='comment'>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Ок</button>
          <button onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
