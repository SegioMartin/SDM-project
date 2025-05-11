import React, { useState } from 'react';
import { createUser } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    patronomic: '',
    email: '',
    password: '',
    avatar: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();  // Используем login вместо setUser

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      const user = response.data;

      // авто-вход: сохраняем пользователя
      localStorage.setItem('user', JSON.stringify(user));
      login(user); // используем login для обновления состояния пользователя

      navigate('/'); // Перенаправление на главную страницу
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
    }
  };

  return (
    <div className='auth'>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit} className='auth_form'>
        <div className='inputs'>
          <input type="text" name="name" placeholder="Имя" value={formData.name} onChange={handleChange} />
          <input type="text" name="surname" placeholder="Фамилия" value={formData.surname} onChange={handleChange} />
          <input type="text" name="patronomic" placeholder="Отчество" value={formData.patronomic} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} />
          <input type="text" name="avatar" placeholder="Ссылка на аватар" value={formData.avatar} onChange={handleChange} />
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
