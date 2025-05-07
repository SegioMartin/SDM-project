import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../api/users';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await getUsers();
      const user = res.data.find(
        (u) => u.email === form.email && u.password === form.password
      );

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Ошибка при входе');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Пароль" />
      <button type="submit">Войти</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default LoginPage;
