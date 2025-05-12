import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';  // Импортируем useAuth для работы с контекстом
import './auth.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();  // Получаем функцию login из контекста

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');  // Сбрасываем ошибки

    try {
      const res = await getUsers();
      const user = res.data.find(
        (u) => u.email === form.email && u.password === form.password
      );

      if (user) {
        login(user);  // Обновляем состояние пользователя в контексте
        localStorage.setItem('user', JSON.stringify(user));  // Сохраняем данные в localStorage
        navigate('/');  // Переходим на главную страницу
      } else {
        setError('Неверный email или пароль');
      }
    } catch {
      setError('Ошибка при входе');
    }
  };

  return (
    <div className='auth'>
      <h1>Вход</h1>
      <form onSubmit={handleLogin} className='auth_form'>
        <div className='inputs'>
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Пароль" />
        </div>
        <button type="submit">Войти</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <p>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
