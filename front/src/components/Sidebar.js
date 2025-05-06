import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css'; // Создаем отдельный файл стилей для боковой панели

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Статус открытой/закрытой панели

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Переключение состояния
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? 'Свернуть' : 'Развернуть'}
      </button>
      <ul>
        <li>
          <Link to="/groups">Группы</Link>
        </li>
        <li>
          <Link to="/courses">Курсы</Link>
        </li>
        <li>
          <Link to="/events">События</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
