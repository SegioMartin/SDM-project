import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '<' : '>'}
      </button>

      {user ? (
        <div className='side_content'>
          <div className='side'>
            <p className="user-info">Привет, {user.name}!</p>
            <ul>
              <NavLink to="/groups" className={({ isActive }) => isActive ? 'active' : ''}><li>Группы</li></NavLink>
              <NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}><li>Курсы</li></NavLink>
              <NavLink to="/events" className={({ isActive }) => isActive ? 'active' : ''}><li>События</li></NavLink>
            </ul>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Выйти</button>
        </div>
      ) : (
        <ul>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}><li>Войти</li></NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}><li>Зарегистрироваться</li></NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
